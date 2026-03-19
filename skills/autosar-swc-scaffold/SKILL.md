---
name: autosar-swc-scaffold
description: 'Use when creating a new AUTOSAR SWC and you need the full file skeleton — C source, headers, config, ARXML, RTE stubs, and unit test — generated from a component specification.'
---

# AUTOSAR SWC Scaffold

This skill generates a complete AUTOSAR Software Component skeleton from a specification. It produces all files needed to start implementing a new SWC: C source, headers, ARXML description, RTE test stubs, and a unit test skeleton — all following AUTOSAR naming conventions, MISRA-C:2012 patterns, and MemMap section placement.

## When to Use This Skill

Use this skill when you need to:

- Create a new AUTOSAR SWC from scratch with correct structure
- Generate all boilerplate files for an SWC (source, headers, ARXML, tests)
- Ensure consistent SWC structure across a project
- Bootstrap a unit test environment with RTE stubs for a new component
- Add ports or runnables to an existing SWC (use templates as reference)

## Input Specification

Provide the following when requesting a scaffold:

```yaml
swc_name: TempMonitor               # PascalCase, becomes folder and file prefix
swc_type: Application                # Application | SensorActuator | CDD | ServiceProxy
asil_level: QM                       # QM | A | B | C | D

ports:
  - name: RawTemp
    direction: R                     # R (Required/Receive) | P (Provided/Send)
    interface: S/R                   # S/R | C/S | Mode | Parameter
    data_type: Temperature_T         # AUTOSAR data type
    queued: false                    # true for queued S/R, false for last-is-best

  - name: FilteredTemp
    direction: P
    interface: S/R
    data_type: Temperature_T
    queued: false

  - name: DiagService
    direction: R
    interface: C/S
    operations:
      - name: ReportFault
        args: [{ name: dtcCode, type: DTC_T }, { name: status, type: uint8 }]
        return: Std_ReturnType

  - name: VehicleMode
    direction: R
    interface: Mode
    mode_group: VehicleMode

runnables:
  - name: Init
    trigger: InitEvent

  - name: FilterCycle
    trigger: TimingEvent
    period_ms: 10

  - name: OnModeChange
    trigger: ModeSwitchEvent
    mode_port: VehicleMode
```

## Generated File Structure

```
src/app/TempMonitor/
├── TempMonitor.c              # Implementation with runnable skeletons
├── TempMonitor.h              # Public interface
├── TempMonitor_Internal.h     # Internal declarations
├── TempMonitor_Cfg.h          # Configuration parameters (pre-compile)
test/unit/TempMonitor/
├── Test_TempMonitor.c         # Unity test skeleton
├── stubs/
│   ├── Stub_Rte_TempMonitor.h # RTE stub header (control interface)
│   └── Stub_Rte_TempMonitor.c # RTE stub implementation
```

## Generated File Templates

### TempMonitor.h — Public Interface

```c
/**
 * @file    TempMonitor.h
 * @brief   Public interface for TempMonitor SWC
 * @details AUTOSAR Application Software Component
 * @asil    QM
 */
#ifndef TEMPMONITOR_H
#define TEMPMONITOR_H

/*============================================================================*
 * INCLUDES
 *============================================================================*/
#include "Std_Types.h"
#include "Rte_TempMonitor.h"

/*============================================================================*
 * MACROS / DEFINES
 *============================================================================*/

/** @brief Module version information */
#define TEMPMONITOR_SW_MAJOR_VERSION    (1U)
#define TEMPMONITOR_SW_MINOR_VERSION    (0U)
#define TEMPMONITOR_SW_PATCH_VERSION    (0U)

/*============================================================================*
 * TYPE DEFINITIONS
 *============================================================================*/
/* Add SWC-specific public types here */

/*============================================================================*
 * GLOBAL FUNCTION PROTOTYPES (Runnables)
 *============================================================================*/
#define TEMPMONITOR_START_SEC_CODE
#include "MemMap.h"

/**
 * @brief   Initialization runnable (InitEvent)
 * @details Called once during ECU startup after RTE is initialized.
 */
extern FUNC(void, TEMPMONITOR_CODE) TempMonitor_Init(void);

/**
 * @brief   Periodic filter cycle (TimingEvent, 10ms)
 * @details Reads raw temperature, applies filter, writes filtered output.
 */
extern FUNC(void, TEMPMONITOR_CODE) TempMonitor_FilterCycle(void);

/**
 * @brief   Mode change handler (ModeSwitchEvent on VehicleMode)
 * @details Reacts to vehicle mode transitions.
 */
extern FUNC(void, TEMPMONITOR_CODE) TempMonitor_OnModeChange(void);

#define TEMPMONITOR_STOP_SEC_CODE
#include "MemMap.h"

#endif /* TEMPMONITOR_H */
```

### TempMonitor_Internal.h — Internal Declarations

```c
/**
 * @file    TempMonitor_Internal.h
 * @brief   Internal declarations for TempMonitor SWC (not part of public API)
 */
#ifndef TEMPMONITOR_INTERNAL_H
#define TEMPMONITOR_INTERNAL_H

#include "TempMonitor.h"
#include "TempMonitor_Cfg.h"

/*============================================================================*
 * INTERNAL MACROS
 *============================================================================*/
#if (TEMPMONITOR_DEV_ERROR_DETECT == STD_ON)
  #include "Det.h"
  #define TEMPMONITOR_DET_REPORT_ERROR(ApiId, ErrorId) \
      (void)Det_ReportError(TEMPMONITOR_MODULE_ID, 0U, (ApiId), (ErrorId))
#else
  #define TEMPMONITOR_DET_REPORT_ERROR(ApiId, ErrorId)
#endif

/*============================================================================*
 * INTERNAL TYPE DEFINITIONS
 *============================================================================*/

/** @brief Internal state of the temperature filter */
typedef struct
{
    Temperature_T lastValue;
    boolean       initialized;
} TempMonitor_FilterState_T;

/*============================================================================*
 * INTERNAL FUNCTION PROTOTYPES
 *============================================================================*/
#define TEMPMONITOR_START_SEC_CODE
#include "MemMap.h"

static FUNC(Temperature_T, TEMPMONITOR_CODE) TempMonitor_Internal_ApplyFilter(
    Temperature_T rawValue,
    P2VAR(TempMonitor_FilterState_T, AUTOMATIC, TEMPMONITOR_VAR) state
);

#define TEMPMONITOR_STOP_SEC_CODE
#include "MemMap.h"

#endif /* TEMPMONITOR_INTERNAL_H */
```

### TempMonitor_Cfg.h — Configuration

```c
/**
 * @file    TempMonitor_Cfg.h
 * @brief   Pre-compile configuration for TempMonitor SWC
 */
#ifndef TEMPMONITOR_CFG_H
#define TEMPMONITOR_CFG_H

/*============================================================================*
 * MODULE IDENTIFICATION
 *============================================================================*/
#define TEMPMONITOR_MODULE_ID          (0xFFU)  /* Vendor-specific module ID */
#define TEMPMONITOR_INSTANCE_ID        (0U)

/*============================================================================*
 * DEVELOPMENT ERROR DETECTION
 *============================================================================*/
/** @brief Enable/disable DET checks (STD_ON / STD_OFF) */
#define TEMPMONITOR_DEV_ERROR_DETECT   STD_ON

/*============================================================================*
 * CONFIGURATION PARAMETERS
 *============================================================================*/
/** @brief Filter coefficient (0.0 = no filter, 1.0 = hold previous) */
#define TEMPMONITOR_FILTER_ALPHA       (0.85f)

/** @brief Maximum valid raw temperature [degC] */
#define TEMPMONITOR_RAW_TEMP_MAX       (150.0f)

/** @brief Minimum valid raw temperature [degC] */
#define TEMPMONITOR_RAW_TEMP_MIN       (-40.0f)

/** @brief Over-temperature fault threshold [degC] */
#define TEMPMONITOR_OVERTEMP_THRESHOLD (120.0f)

/*============================================================================*
 * DET ERROR IDS
 *============================================================================*/
#define TEMPMONITOR_E_UNINIT           (0x01U)
#define TEMPMONITOR_E_PARAM_INVALID    (0x02U)

/*============================================================================*
 * API SERVICE IDS (for DET reporting)
 *============================================================================*/
#define TEMPMONITOR_SID_INIT           (0x00U)
#define TEMPMONITOR_SID_FILTERCYCLE    (0x01U)
#define TEMPMONITOR_SID_ONMODECHANGE   (0x02U)

#endif /* TEMPMONITOR_CFG_H */
```

### TempMonitor.c — Implementation

```c
/**
 * @file    TempMonitor.c
 * @brief   Implementation of TempMonitor SWC
 * @details Reads raw temperature sensor data, applies a first-order low-pass
 *          filter, and provides the filtered value via RTE. Reports diagnostic
 *          faults for out-of-range or over-temperature conditions.
 * @asil    QM
 */

/*============================================================================*
 * INCLUDES
 *============================================================================*/
#include "TempMonitor.h"
#include "TempMonitor_Internal.h"

/*============================================================================*
 * LOCAL DATA
 *============================================================================*/
#define TEMPMONITOR_START_SEC_VAR_CLEARED_UNSPECIFIED
#include "MemMap.h"

static TempMonitor_FilterState_T TempMonitor_filterState;

#define TEMPMONITOR_STOP_SEC_VAR_CLEARED_UNSPECIFIED
#include "MemMap.h"

#define TEMPMONITOR_START_SEC_VAR_INIT_8
#include "MemMap.h"

static boolean TempMonitor_isInitialized = FALSE;

#define TEMPMONITOR_STOP_SEC_VAR_INIT_8
#include "MemMap.h"

/*============================================================================*
 * LOCAL FUNCTION DEFINITIONS
 *============================================================================*/
#define TEMPMONITOR_START_SEC_CODE
#include "MemMap.h"

static Temperature_T TempMonitor_Internal_ApplyFilter(
    Temperature_T rawValue,
    TempMonitor_FilterState_T* state)
{
    Temperature_T filtered;

    if (state->initialized == FALSE)
    {
        filtered = rawValue;
        state->initialized = TRUE;
    }
    else
    {
        /* First-order IIR low-pass: y[n] = alpha * y[n-1] + (1-alpha) * x[n] */
        filtered = (TEMPMONITOR_FILTER_ALPHA * state->lastValue)
                 + ((1.0f - TEMPMONITOR_FILTER_ALPHA) * rawValue);
    }

    state->lastValue = filtered;
    return filtered;
}

/*============================================================================*
 * RUNNABLE IMPLEMENTATIONS
 *============================================================================*/

void TempMonitor_Init(void)
{
    TempMonitor_filterState.lastValue   = 0.0f;
    TempMonitor_filterState.initialized = FALSE;
    TempMonitor_isInitialized           = TRUE;
}

void TempMonitor_FilterCycle(void)
{
    Temperature_T rawTemp;
    Temperature_T filteredTemp;
    Std_ReturnType readStatus;

#if (TEMPMONITOR_DEV_ERROR_DETECT == STD_ON)
    if (TempMonitor_isInitialized == FALSE)
    {
        TEMPMONITOR_DET_REPORT_ERROR(TEMPMONITOR_SID_FILTERCYCLE, TEMPMONITOR_E_UNINIT);
        return;
    }
#endif

    /* Read raw temperature from sensor abstraction SWC */
    readStatus = Rte_Read_TempMonitor_RPort_RawTemp_value(&rawTemp);

    if (readStatus == RTE_E_OK)
    {
        /* Validate range */
        if ((rawTemp >= TEMPMONITOR_RAW_TEMP_MIN) && (rawTemp <= TEMPMONITOR_RAW_TEMP_MAX))
        {
            /* Apply filter */
            Rte_Enter_TempMonitor_ExAr_FilterData();
            filteredTemp = TempMonitor_Internal_ApplyFilter(rawTemp, &TempMonitor_filterState);
            Rte_Exit_TempMonitor_ExAr_FilterData();

            /* Write filtered value to provided port */
            Rte_IWrite_TempMonitor_FilterCycle_PPort_FilteredTemp_value(filteredTemp);

            /* Check over-temperature condition */
            if (filteredTemp > TEMPMONITOR_OVERTEMP_THRESHOLD)
            {
                (void)Rte_Call_TempMonitor_RPort_DiagService_ReportFault(
                    DTC_OVERTEMP, DEM_EVENT_STATUS_FAILED);
            }
        }
        else
        {
            /* Out of range — report sensor fault */
            (void)Rte_Call_TempMonitor_RPort_DiagService_ReportFault(
                DTC_SENSOR_RANGE, DEM_EVENT_STATUS_FAILED);
        }
    }
    /* else: RTE read failed — signal not yet received, skip this cycle */
}

void TempMonitor_OnModeChange(void)
{
    Rte_ModeType_VehicleMode currentMode;

    currentMode = Rte_Mode_TempMonitor_RPort_VehicleMode_currentMode();

    switch (currentMode)
    {
        case RTE_MODE_VehicleMode_NORMAL:
            /* Normal operation — no action needed */
            break;

        case RTE_MODE_VehicleMode_SLEEP:
            /* Prepare for low-power: reset filter state */
            Rte_Enter_TempMonitor_ExAr_FilterData();
            TempMonitor_filterState.initialized = FALSE;
            Rte_Exit_TempMonitor_ExAr_FilterData();
            break;

        default:
            /* Unexpected mode — do nothing */
            break;
    }
}

#define TEMPMONITOR_STOP_SEC_CODE
#include "MemMap.h"
```

### Test_TempMonitor.c — Unit Test Skeleton

```c
/**
 * @file    Test_TempMonitor.c
 * @brief   Unit tests for TempMonitor SWC
 * @details Uses Unity test framework with RTE stubs
 */

#include "unity.h"
#include "TempMonitor.h"
#include "Stub_Rte_TempMonitor.h"

/*============================================================================*
 * TEST SETUP / TEARDOWN
 *============================================================================*/

void setUp(void)
{
    Stub_Rte_TempMonitor_Init();
    TempMonitor_Init();
}

void tearDown(void)
{
    Stub_Rte_TempMonitor_Reset();
}

/*============================================================================*
 * INIT TESTS
 *============================================================================*/

void Test_TempMonitor_Init_SetsInitializedState(void)
{
    /* Init is called in setUp — verify no faults reported */
    TEST_ASSERT_EQUAL_UINT32(0U, Stub_Rte_Call_ReportFault_GetCallCount());
}

/*============================================================================*
 * FILTER CYCLE TESTS
 *============================================================================*/

void Test_TempMonitor_FilterCycle_NominalInput(void)
{
    Stub_Rte_Read_RawTemp_SetValue(25.0f);
    Stub_Rte_Read_RawTemp_SetReturnStatus(RTE_E_OK);

    TempMonitor_FilterCycle();

    /* First cycle: no filtering, output == input */
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 25.0f,
        Stub_Rte_IWrite_FilteredTemp_GetLastWritten());
    TEST_ASSERT_EQUAL_UINT32(1U, Stub_Rte_IWrite_FilteredTemp_GetCallCount());
}

void Test_TempMonitor_FilterCycle_OverTemperature(void)
{
    Stub_Rte_Read_RawTemp_SetValue(130.0f);
    Stub_Rte_Read_RawTemp_SetReturnStatus(RTE_E_OK);

    TempMonitor_FilterCycle();

    /* Should report over-temperature DTC */
    TEST_ASSERT_EQUAL_UINT32(1U, Stub_Rte_Call_ReportFault_GetCallCount());
}

void Test_TempMonitor_FilterCycle_OutOfRange_Low(void)
{
    Stub_Rte_Read_RawTemp_SetValue(-50.0f);
    Stub_Rte_Read_RawTemp_SetReturnStatus(RTE_E_OK);

    TempMonitor_FilterCycle();

    /* Should report sensor range fault, no filtered output */
    TEST_ASSERT_EQUAL_UINT32(1U, Stub_Rte_Call_ReportFault_GetCallCount());
    TEST_ASSERT_EQUAL_UINT32(0U, Stub_Rte_IWrite_FilteredTemp_GetCallCount());
}

void Test_TempMonitor_FilterCycle_RteReadFails(void)
{
    Stub_Rte_Read_RawTemp_SetReturnStatus(RTE_E_NEVER_RECEIVED);

    TempMonitor_FilterCycle();

    /* No output, no fault — graceful skip */
    TEST_ASSERT_EQUAL_UINT32(0U, Stub_Rte_IWrite_FilteredTemp_GetCallCount());
    TEST_ASSERT_EQUAL_UINT32(0U, Stub_Rte_Call_ReportFault_GetCallCount());
}

void Test_TempMonitor_FilterCycle_FilterSmoothing(void)
{
    Stub_Rte_Read_RawTemp_SetReturnStatus(RTE_E_OK);

    /* Cycle 1: seed the filter */
    Stub_Rte_Read_RawTemp_SetValue(100.0f);
    TempMonitor_FilterCycle();
    Temperature_T first = Stub_Rte_IWrite_FilteredTemp_GetLastWritten();
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 100.0f, first);

    /* Cycle 2: step change — filtered value should lag */
    Stub_Rte_Read_RawTemp_SetValue(50.0f);
    TempMonitor_FilterCycle();
    Temperature_T second = Stub_Rte_IWrite_FilteredTemp_GetLastWritten();
    TEST_ASSERT_TRUE(second > 50.0f);  /* Filter smooths the step */
    TEST_ASSERT_TRUE(second < 100.0f);
}

/*============================================================================*
 * MODE CHANGE TESTS
 *============================================================================*/

void Test_TempMonitor_OnModeChange_SleepResetsFilter(void)
{
    /* Seed the filter first */
    Stub_Rte_Read_RawTemp_SetValue(80.0f);
    Stub_Rte_Read_RawTemp_SetReturnStatus(RTE_E_OK);
    TempMonitor_FilterCycle();

    /* Switch to SLEEP mode */
    Stub_Rte_Mode_VehicleMode_SetMode(RTE_MODE_VehicleMode_SLEEP);
    TempMonitor_OnModeChange();

    /* Next filter cycle should behave as first cycle (no smoothing) */
    Stub_Rte_Read_RawTemp_SetValue(60.0f);
    TempMonitor_FilterCycle();
    TEST_ASSERT_FLOAT_WITHIN(0.01f, 60.0f,
        Stub_Rte_IWrite_FilteredTemp_GetLastWritten());
}

/*============================================================================*
 * TEST RUNNER
 *============================================================================*/

int main(void)
{
    UNITY_BEGIN();

    RUN_TEST(Test_TempMonitor_Init_SetsInitializedState);
    RUN_TEST(Test_TempMonitor_FilterCycle_NominalInput);
    RUN_TEST(Test_TempMonitor_FilterCycle_OverTemperature);
    RUN_TEST(Test_TempMonitor_FilterCycle_OutOfRange_Low);
    RUN_TEST(Test_TempMonitor_FilterCycle_RteReadFails);
    RUN_TEST(Test_TempMonitor_FilterCycle_FilterSmoothing);
    RUN_TEST(Test_TempMonitor_OnModeChange_SleepResetsFilter);

    return UNITY_END();
}
```

## SWC Type Variations

### Application SWC (default)
- Standard ports (S/R, C/S, Mode)
- All communication through RTE only
- No direct hardware access

### SensorActuator SWC
- Same as Application but with additional ECU abstraction port
- Typically has one port connected to an I/O hardware abstraction SWC
- `Rte_Read` from hardware abstraction, `Rte_Write` filtered/processed value

### Complex Device Driver (CDD)
- May access hardware directly (bypasses MCAL/ECU abstraction)
- Must include `#include "CDD_<Name>.h"` with hardware register access
- Exclusive areas protect hardware register sequences
- Additional safety analysis required for direct hardware access

### ServiceProxy SWC
- Wraps BSW service module APIs as RTE-accessible C/S interfaces
- Typically thin wrappers: `Rte_Call` → `<BswModule>_<Api>()`
- Used to make BSW services available to application SWCs through RTE

## ARXML Description Snippet

For the TempMonitor example above, the corresponding ARXML would include:

```xml
<APPLICATION-SW-COMPONENT-TYPE>
  <SHORT-NAME>TempMonitor</SHORT-NAME>
  <PORTS>
    <R-PORT-PROTOTYPE>
      <SHORT-NAME>RPort_RawTemp</SHORT-NAME>
      <REQUIRED-INTERFACE-TREF DEST="SENDER-RECEIVER-INTERFACE">/AUTOSAR/PortInterfaces/SRI_Temperature</REQUIRED-INTERFACE-TREF>
    </R-PORT-PROTOTYPE>
    <P-PORT-PROTOTYPE>
      <SHORT-NAME>PPort_FilteredTemp</SHORT-NAME>
      <PROVIDED-INTERFACE-TREF DEST="SENDER-RECEIVER-INTERFACE">/AUTOSAR/PortInterfaces/SRI_Temperature</PROVIDED-INTERFACE-TREF>
    </P-PORT-PROTOTYPE>
    <R-PORT-PROTOTYPE>
      <SHORT-NAME>RPort_DiagService</SHORT-NAME>
      <REQUIRED-INTERFACE-TREF DEST="CLIENT-SERVER-INTERFACE">/AUTOSAR/PortInterfaces/CSI_DiagService</REQUIRED-INTERFACE-TREF>
    </R-PORT-PROTOTYPE>
    <R-PORT-PROTOTYPE>
      <SHORT-NAME>RPort_VehicleMode</SHORT-NAME>
      <REQUIRED-INTERFACE-TREF DEST="MODE-SWITCH-INTERFACE">/AUTOSAR/PortInterfaces/MSI_VehicleMode</REQUIRED-INTERFACE-TREF>
    </R-PORT-PROTOTYPE>
  </PORTS>
  <INTERNAL-BEHAVIORS>
    <SWC-INTERNAL-BEHAVIOR>
      <SHORT-NAME>TempMonitor_IB</SHORT-NAME>
      <RUNNABLES>
        <RUNNABLE-ENTITY>
          <SHORT-NAME>TempMonitor_Init</SHORT-NAME>
          <CAN-BE-INVOKED-CONCURRENTLY>false</CAN-BE-INVOKED-CONCURRENTLY>
        </RUNNABLE-ENTITY>
        <RUNNABLE-ENTITY>
          <SHORT-NAME>TempMonitor_FilterCycle</SHORT-NAME>
          <CAN-BE-INVOKED-CONCURRENTLY>false</CAN-BE-INVOKED-CONCURRENTLY>
          <MINIMUM-START-INTERVAL>0.01</MINIMUM-START-INTERVAL>
        </RUNNABLE-ENTITY>
        <RUNNABLE-ENTITY>
          <SHORT-NAME>TempMonitor_OnModeChange</SHORT-NAME>
          <CAN-BE-INVOKED-CONCURRENTLY>false</CAN-BE-INVOKED-CONCURRENTLY>
        </RUNNABLE-ENTITY>
      </RUNNABLES>
      <EXCLUSIVE-AREAS>
        <EXCLUSIVE-AREA>
          <SHORT-NAME>ExAr_FilterData</SHORT-NAME>
        </EXCLUSIVE-AREA>
      </EXCLUSIVE-AREAS>
      <EVENTS>
        <INIT-EVENT>
          <SHORT-NAME>InitEvent_Init</SHORT-NAME>
          <START-ON-EVENT-REF DEST="RUNNABLE-ENTITY">TempMonitor_Init</START-ON-EVENT-REF>
        </INIT-EVENT>
        <TIMING-EVENT>
          <SHORT-NAME>TimingEvent_FilterCycle</SHORT-NAME>
          <START-ON-EVENT-REF DEST="RUNNABLE-ENTITY">TempMonitor_FilterCycle</START-ON-EVENT-REF>
          <PERIOD>0.01</PERIOD>
        </TIMING-EVENT>
        <MODE-SWITCH-EVENT>
          <SHORT-NAME>ModeEvent_OnModeChange</SHORT-NAME>
          <START-ON-EVENT-REF DEST="RUNNABLE-ENTITY">TempMonitor_OnModeChange</START-ON-EVENT-REF>
        </MODE-SWITCH-EVENT>
      </EVENTS>
    </SWC-INTERNAL-BEHAVIOR>
  </INTERNAL-BEHAVIORS>
</APPLICATION-SW-COMPONENT-TYPE>
```

## Workflow

1. **Define specification** — Fill in the input YAML (name, type, ports, runnables, ASIL)
2. **Generate scaffold** — Skill creates all files in the correct directories
3. **Implement runnables** — Replace skeleton logic in `<SwcName>.c` with actual algorithms
4. **Configure parameters** — Adjust `<SwcName>_Cfg.h` for your project
5. **Run unit tests** — Execute `Test_<SwcName>.c` using Ceedling or your test framework
6. **Generate ARXML** — Use the `arxml-generator` skill with the ARXML snippet as starting point
7. **Integrate** — Add SWC to composition, connect ports, configure BSW for new signals

## Gotchas

- **MemMap sections must wrap every function and variable block** — forgetting `STOP_SEC_*` after `START_SEC_*` causes the linker to place everything after the missing stop into the wrong memory region. This is a silent bug that only manifests as runtime crashes on target.
- **`_Init` function must be called from EcuM** — generated `<SwcName>_Init()` won't run automatically. You must add it to your EcuM startup sequence or OS task initialization, otherwise all state variables remain uninitialized.
- **RTE stub return values default to E_OK** — test stubs generated here return success by default. If your SWC has error-handling logic, you must explicitly configure stub return values in your test setup to exercise those paths.
- **DET checks use module-specific IDs** — `<SWCNAME>_MODULE_ID` and API service IDs must be unique across the ECU. Check your project's ID allocation spreadsheet before using the generated defaults.
- **Do not rename generated files** — the AUTOSAR toolchain (RTE generator, BSW configurator) expects filenames to match the SWC SHORT-NAME exactly. Renaming `TempMonitor.c` to `temp_monitor.c` will break RTE generation.
- **`_Cfg.h` is meant to be edited** — unlike the other generated headers, the configuration header contains project-specific tuning parameters. Do not regenerate it without merging your changes.
