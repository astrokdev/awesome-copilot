---
name: rte-contract-generator
description: 'Use when you have defined SWC ports and runnables and need the matching RTE contract header (Rte_<SwcName>.h), type definitions, and unit test stubs with configurable data consistency modes.'
---

# RTE Contract Generator

This skill generates AUTOSAR RTE contract headers and matching unit test stubs from SWC port and runnable specifications. The generated headers provide all RTE API declarations needed by the SWC, while the stubs provide controllable test doubles for unit testing in isolation.

## When to Use This Skill

Use this skill when you need to:

- Generate `Rte_<SwcName>.h` contract headers for a new or modified SWC
- Create RTE test stubs (`Stub_Rte_<SwcName>.h/.c`) for unit testing
- Verify that RTE API usage in SWC code matches port definitions
- Understand which RTE APIs correspond to specific port configurations
- Generate `Rte_Type.h` additions for new data types

## Input Specification

Provide the SWC's port and runnable definitions:

```yaml
swc_name: TempMonitor

ports:
  - name: RawTemp
    direction: R           # Required (receive)
    interface: S/R         # Sender-Receiver
    data_element: value
    data_type: Temperature_T
    access_mode: explicit  # explicit (Rte_Read/Write) or implicit (Rte_IRead/IWrite)

  - name: FilteredTemp
    direction: P           # Provided (send)
    interface: S/R
    data_element: value
    data_type: Temperature_T
    access_mode: implicit

  - name: DiagService
    direction: R
    interface: C/S         # Client-Server
    operations:
      - name: ReportFault
        args:
          - { name: dtcCode, type: DTC_T, direction: IN }
          - { name: status, type: uint8, direction: IN }
        sync: true          # synchronous call

  - name: VehicleMode
    direction: R
    interface: Mode
    mode_group: VehicleMode

exclusive_areas:
  - name: ExAr_FilterData

irv:
  - name: Irv_LastFilteredValue
    data_type: Temperature_T

runnables:
  - name: Init
    trigger: InitEvent
  - name: FilterCycle
    trigger: TimingEvent
    period_ms: 10
    reads: [RawTemp]
    writes: [FilteredTemp]
    calls: [DiagService.ReportFault]
    exclusive_areas: [ExAr_FilterData]
    irv_read: [Irv_LastFilteredValue]
    irv_write: [Irv_LastFilteredValue]
  - name: OnModeChange
    trigger: ModeSwitchEvent
    mode_port: VehicleMode
```

## Generated Artifacts

### 1. Rte_<SwcName>.h — Contract Header

The contract header declares all RTE APIs the SWC is allowed to call. It is the single interface between the SWC and the RTE.

```c
/**
 * @file    Rte_TempMonitor.h
 * @brief   RTE contract header for SWC TempMonitor
 * @details Auto-generated. Do not edit manually.
 *          Regenerate from SWC description using rte-contract-generator.
 */
#ifndef RTE_TEMPMONITOR_H
#define RTE_TEMPMONITOR_H

#include "Rte.h"
#include "Rte_Type.h"

#ifdef __cplusplus
extern "C" {
#endif

/*============================================================================*
 * S/R Port: RPort_RawTemp (explicit read)
 *============================================================================*/
extern FUNC(Std_ReturnType, RTE_CODE)
  Rte_Read_TempMonitor_RPort_RawTemp_value(
    P2VAR(Temperature_T, AUTOMATIC, RTE_APPL_DATA) data);

/*============================================================================*
 * S/R Port: PPort_FilteredTemp (implicit write, per-runnable)
 *============================================================================*/
/* FilterCycle runnable — implicit write */
extern FUNC(void, RTE_CODE)
  Rte_IWrite_TempMonitor_FilterCycle_PPort_FilteredTemp_value(
    Temperature_T data);

extern FUNC(P2VAR(Temperature_T, AUTOMATIC, RTE_APPL_DATA), RTE_CODE)
  Rte_IWriteRef_TempMonitor_FilterCycle_PPort_FilteredTemp_value(void);

/*============================================================================*
 * C/S Port: RPort_DiagService (synchronous call)
 *============================================================================*/
extern FUNC(Std_ReturnType, RTE_CODE)
  Rte_Call_TempMonitor_RPort_DiagService_ReportFault(
    DTC_T dtcCode,
    uint8 status);

/*============================================================================*
 * Mode Port: RPort_VehicleMode
 *============================================================================*/
extern FUNC(Rte_ModeType_VehicleMode, RTE_CODE)
  Rte_Mode_TempMonitor_RPort_VehicleMode_currentMode(void);

/*============================================================================*
 * Exclusive Areas
 *============================================================================*/
extern FUNC(void, RTE_CODE)
  Rte_Enter_TempMonitor_ExAr_FilterData(void);
extern FUNC(void, RTE_CODE)
  Rte_Exit_TempMonitor_ExAr_FilterData(void);

/*============================================================================*
 * Inter-Runnable Variables
 *============================================================================*/
/* FilterCycle runnable — IRV read */
extern FUNC(Temperature_T, RTE_CODE)
  Rte_IrvIRead_TempMonitor_FilterCycle_Irv_LastFilteredValue(void);

/* FilterCycle runnable — IRV write */
extern FUNC(void, RTE_CODE)
  Rte_IrvIWrite_TempMonitor_FilterCycle_Irv_LastFilteredValue(
    Temperature_T data);

/*============================================================================*
 * Runnable Entry Points
 *============================================================================*/
extern FUNC(void, RTE_APPL_CODE) TempMonitor_Init(void);
extern FUNC(void, RTE_APPL_CODE) TempMonitor_FilterCycle(void);
extern FUNC(void, RTE_APPL_CODE) TempMonitor_OnModeChange(void);

#ifdef __cplusplus
}
#endif

#endif /* RTE_TEMPMONITOR_H */
```

### 2. Rte_Type.h Additions

```c
/* Add to Rte_Type.h for TempMonitor SWC */

#ifndef RTE_TYPE_TEMPMONITOR_H
#define RTE_TYPE_TEMPMONITOR_H

#include "Std_Types.h"

/* Data types used by TempMonitor ports */
typedef float32 Temperature_T;
typedef uint32  DTC_T;

/* Mode type for VehicleMode */
typedef uint8 Rte_ModeType_VehicleMode;
#define RTE_MODE_VehicleMode_NORMAL     ((Rte_ModeType_VehicleMode)0U)
#define RTE_MODE_VehicleMode_SLEEP      ((Rte_ModeType_VehicleMode)1U)
#define RTE_MODE_VehicleMode_DIAGNOSTIC ((Rte_ModeType_VehicleMode)2U)

/* RTE status codes */
#ifndef RTE_E_OK
#define RTE_E_OK                ((Std_ReturnType)0U)
#endif
#ifndef RTE_E_NEVER_RECEIVED
#define RTE_E_NEVER_RECEIVED    ((Std_ReturnType)128U)
#endif
#ifndef RTE_E_TIMEOUT
#define RTE_E_TIMEOUT           ((Std_ReturnType)129U)
#endif
#ifndef RTE_E_LIMIT
#define RTE_E_LIMIT             ((Std_ReturnType)130U)
#endif
#ifndef RTE_E_NO_DATA
#define RTE_E_NO_DATA           ((Std_ReturnType)131U)
#endif
#ifndef RTE_E_COM_STOPPED
#define RTE_E_COM_STOPPED       ((Std_ReturnType)132U)
#endif

#endif /* RTE_TYPE_TEMPMONITOR_H */
```

### 3. Stub_Rte_<SwcName>.h — Test Stub Control Interface

```c
/**
 * @file    Stub_Rte_TempMonitor.h
 * @brief   Test stub control interface for TempMonitor RTE APIs
 * @details Provides setter/getter functions to control stub behavior
 *          and inspect SWC calls to the RTE during unit testing.
 */
#ifndef STUB_RTE_TEMPMONITOR_H
#define STUB_RTE_TEMPMONITOR_H

#include "Rte_TempMonitor.h"

#ifdef __cplusplus
extern "C" {
#endif

/*============================================================================*
 * STUB LIFECYCLE
 *============================================================================*/
/** @brief Initialize all stubs to default state (call in test setUp) */
void Stub_Rte_TempMonitor_Init(void);
/** @brief Reset all stubs (alias for Init, call in test tearDown) */
void Stub_Rte_TempMonitor_Reset(void);

/*============================================================================*
 * S/R STUB CONTROL: RPort_RawTemp (explicit read)
 *============================================================================*/
void            Stub_Rte_Read_RawTemp_SetValue(Temperature_T value);
void            Stub_Rte_Read_RawTemp_SetReturnStatus(Std_ReturnType status);
uint32          Stub_Rte_Read_RawTemp_GetCallCount(void);

/*============================================================================*
 * S/R STUB CAPTURE: PPort_FilteredTemp (implicit write)
 *============================================================================*/
Temperature_T   Stub_Rte_IWrite_FilteredTemp_GetLastWritten(void);
uint32          Stub_Rte_IWrite_FilteredTemp_GetCallCount(void);

/*============================================================================*
 * C/S STUB CONTROL: RPort_DiagService.ReportFault
 *============================================================================*/
void            Stub_Rte_Call_ReportFault_SetReturnStatus(Std_ReturnType status);
DTC_T           Stub_Rte_Call_ReportFault_GetLastDTC(void);
uint8           Stub_Rte_Call_ReportFault_GetLastStatus(void);
uint32          Stub_Rte_Call_ReportFault_GetCallCount(void);

/*============================================================================*
 * MODE STUB CONTROL: RPort_VehicleMode
 *============================================================================*/
void            Stub_Rte_Mode_VehicleMode_SetMode(Rte_ModeType_VehicleMode mode);

/*============================================================================*
 * IRV STUB CONTROL: Irv_LastFilteredValue
 *============================================================================*/
void            Stub_Rte_Irv_LastFilteredValue_SetValue(Temperature_T value);
Temperature_T   Stub_Rte_Irv_LastFilteredValue_GetLastWritten(void);

/*============================================================================*
 * EXCLUSIVE AREA TRACKING
 *============================================================================*/
uint32          Stub_Rte_Enter_FilterData_GetCallCount(void);
uint32          Stub_Rte_Exit_FilterData_GetCallCount(void);

#ifdef __cplusplus
}
#endif

#endif /* STUB_RTE_TEMPMONITOR_H */
```

### 4. Stub_Rte_<SwcName>.c — Test Stub Implementation

```c
/**
 * @file    Stub_Rte_TempMonitor.c
 * @brief   Test stub implementation for TempMonitor RTE APIs
 */
#include "Stub_Rte_TempMonitor.h"
#include <string.h>

/*============================================================================*
 * STUB INTERNAL STATE
 *============================================================================*/
static struct {
    /* S/R Read: RawTemp */
    Temperature_T   rawTemp_value;
    Std_ReturnType  rawTemp_status;
    uint32          rawTemp_callCount;

    /* S/R IWrite: FilteredTemp */
    Temperature_T   filteredTemp_lastWritten;
    uint32          filteredTemp_callCount;

    /* C/S Call: ReportFault */
    Std_ReturnType  reportFault_status;
    DTC_T           reportFault_lastDTC;
    uint8           reportFault_lastSeverity;
    uint32          reportFault_callCount;

    /* Mode: VehicleMode */
    Rte_ModeType_VehicleMode  vehicleMode_current;

    /* IRV: LastFilteredValue */
    Temperature_T   irv_lastFiltered_value;
    Temperature_T   irv_lastFiltered_lastWritten;

    /* Exclusive Area tracking */
    uint32          exAr_filterData_enterCount;
    uint32          exAr_filterData_exitCount;
} s;

/*============================================================================*
 * LIFECYCLE
 *============================================================================*/
void Stub_Rte_TempMonitor_Init(void)
{
    (void)memset(&s, 0, sizeof(s));
    s.rawTemp_status    = RTE_E_OK;
    s.reportFault_status = RTE_E_OK;
    s.vehicleMode_current = RTE_MODE_VehicleMode_NORMAL;
}

void Stub_Rte_TempMonitor_Reset(void)
{
    Stub_Rte_TempMonitor_Init();
}

/*============================================================================*
 * RTE API STUB IMPLEMENTATIONS
 *============================================================================*/

/* --- S/R: Explicit Read --- */
Std_ReturnType Rte_Read_TempMonitor_RPort_RawTemp_value(Temperature_T* data)
{
    s.rawTemp_callCount++;
    if (data != NULL_PTR)
    {
        *data = s.rawTemp_value;
    }
    return s.rawTemp_status;
}

/* --- S/R: Implicit Write --- */
void Rte_IWrite_TempMonitor_FilterCycle_PPort_FilteredTemp_value(Temperature_T data)
{
    s.filteredTemp_lastWritten = data;
    s.filteredTemp_callCount++;
}

Temperature_T* Rte_IWriteRef_TempMonitor_FilterCycle_PPort_FilteredTemp_value(void)
{
    return &s.filteredTemp_lastWritten;
}

/* --- C/S: Synchronous Call --- */
Std_ReturnType Rte_Call_TempMonitor_RPort_DiagService_ReportFault(DTC_T dtcCode, uint8 status)
{
    s.reportFault_lastDTC = dtcCode;
    s.reportFault_lastSeverity = status;
    s.reportFault_callCount++;
    return s.reportFault_status;
}

/* --- Mode --- */
Rte_ModeType_VehicleMode Rte_Mode_TempMonitor_RPort_VehicleMode_currentMode(void)
{
    return s.vehicleMode_current;
}

/* --- Exclusive Areas --- */
void Rte_Enter_TempMonitor_ExAr_FilterData(void) { s.exAr_filterData_enterCount++; }
void Rte_Exit_TempMonitor_ExAr_FilterData(void)  { s.exAr_filterData_exitCount++; }

/* --- IRV --- */
Temperature_T Rte_IrvIRead_TempMonitor_FilterCycle_Irv_LastFilteredValue(void)
{
    return s.irv_lastFiltered_value;
}

void Rte_IrvIWrite_TempMonitor_FilterCycle_Irv_LastFilteredValue(Temperature_T data)
{
    s.irv_lastFiltered_lastWritten = data;
    s.irv_lastFiltered_value = data; /* immediately visible for next read */
}

/*============================================================================*
 * STUB CONTROL FUNCTIONS
 *============================================================================*/

/* Read control */
void   Stub_Rte_Read_RawTemp_SetValue(Temperature_T v)          { s.rawTemp_value = v; }
void   Stub_Rte_Read_RawTemp_SetReturnStatus(Std_ReturnType st) { s.rawTemp_status = st; }
uint32 Stub_Rte_Read_RawTemp_GetCallCount(void)                 { return s.rawTemp_callCount; }

/* IWrite capture */
Temperature_T Stub_Rte_IWrite_FilteredTemp_GetLastWritten(void) { return s.filteredTemp_lastWritten; }
uint32 Stub_Rte_IWrite_FilteredTemp_GetCallCount(void)          { return s.filteredTemp_callCount; }

/* Call control */
void   Stub_Rte_Call_ReportFault_SetReturnStatus(Std_ReturnType st) { s.reportFault_status = st; }
DTC_T  Stub_Rte_Call_ReportFault_GetLastDTC(void)                   { return s.reportFault_lastDTC; }
uint8  Stub_Rte_Call_ReportFault_GetLastStatus(void)                { return s.reportFault_lastSeverity; }
uint32 Stub_Rte_Call_ReportFault_GetCallCount(void)                 { return s.reportFault_callCount; }

/* Mode control */
void Stub_Rte_Mode_VehicleMode_SetMode(Rte_ModeType_VehicleMode m) { s.vehicleMode_current = m; }

/* IRV control */
void          Stub_Rte_Irv_LastFilteredValue_SetValue(Temperature_T v)  { s.irv_lastFiltered_value = v; }
Temperature_T Stub_Rte_Irv_LastFilteredValue_GetLastWritten(void)       { return s.irv_lastFiltered_lastWritten; }

/* EA tracking */
uint32 Stub_Rte_Enter_FilterData_GetCallCount(void) { return s.exAr_filterData_enterCount; }
uint32 Stub_Rte_Exit_FilterData_GetCallCount(void)  { return s.exAr_filterData_exitCount; }
```

## API Generation Rules

| Port Config | Generated API | Notes |
|-------------|---------------|-------|
| S/R Required + explicit | `Rte_Read_<Swc>_<Port>_<Element>` | Returns `Std_ReturnType` |
| S/R Required + implicit | `Rte_IRead_<Swc>_<Runnable>_<Port>_<Element>` | Per-runnable, returns data directly |
| S/R Provided + explicit | `Rte_Write_<Swc>_<Port>_<Element>` | Returns `Std_ReturnType` |
| S/R Provided + implicit | `Rte_IWrite_<Swc>_<Runnable>_<Port>_<Element>` | Per-runnable, void return |
| S/R Queued send | `Rte_Send_<Swc>_<Port>_<Element>` | May return `RTE_E_LIMIT` |
| S/R Queued receive | `Rte_Receive_<Swc>_<Port>_<Element>` | May return `RTE_E_NO_DATA` |
| C/S Required sync | `Rte_Call_<Swc>_<Port>_<Operation>` | Blocking, returns `Std_ReturnType` |
| C/S Required async | `Rte_Call_*` + `Rte_Result_*` | Non-blocking call + separate result |
| Mode Required | `Rte_Mode_<Swc>_<Port>_<ModeGroup>` | Returns current mode |
| Mode Provided | `Rte_Switch_<Swc>_<Port>_<ModeGroup>` | Only from mode manager |
| Exclusive Area | `Rte_Enter_<Swc>_<EA>` / `Rte_Exit_<Swc>_<EA>` | Must be paired |
| IRV read | `Rte_IrvIRead_<Swc>_<Runnable>_<IRV>` | Per-runnable |
| IRV write | `Rte_IrvIWrite_<Swc>_<Runnable>_<IRV>` | Per-runnable |

## Data Consistency Annotations

In the generated contract header, each API includes a comment indicating the data consistency mode:

```c
/* [EXPLICIT] Last-is-best read — caller must check return status */
extern Std_ReturnType Rte_Read_...

/* [IMPLICIT] Snapshot at runnable start — consistent for full runnable duration */
extern Temperature_T Rte_IRead_...

/* [IMPLICIT] Deferred write — flushed at runnable exit */
extern void Rte_IWrite_...
```

This helps developers choose the right access pattern and understand the consistency guarantees.

## Gotchas

- **Implicit vs explicit access is a compile-time contract** — if you generate a contract with `Rte_IRead` (implicit) but the ARXML specifies explicit access, the RTE generator will produce `Rte_Read` instead and your code won't compile. Always verify the data access mode in your SWC ARXML description matches this skill's input.
- **Exclusive areas in stubs are no-ops** — generated test stubs for `Rte_Enter_<EA>` / `Rte_Exit_<EA>` do nothing. This means data races in your SWC logic won't be caught by unit tests. Use integration tests with the `integration-test-harness` skill to validate concurrency.
- **`Rte_Type.h` additions are append-only** — this skill generates new type definitions to add to `Rte_Type.h`. Never replace the entire file; merge the generated types into the existing file or you'll break other SWCs' contracts.
- **C/S async return patterns are tricky** — for asynchronous client-server operations, the stub must track call state. The generated stub uses a simple flag; if your test calls the same operation multiple times in one test case, reset the stub state between calls.
- **Mode switch notifications require subscription** — generating `Rte_Mode_<port>` APIs only works if the SWC's ARXML has a `MODE-SWITCH-EVENT` triggering a runnable. Without it, the RTE generator silently skips these APIs.
- **Do not hand-edit generated contract headers** — if ports change, regenerate rather than patching. Hand-edits create drift between ARXML and code that the AUTOSAR toolchain cannot detect.
