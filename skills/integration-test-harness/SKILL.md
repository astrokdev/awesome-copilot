---
name: integration-test-harness
description: 'Use when you need to test multiple AUTOSAR SWCs together — generates an integration test harness with RTE simulation, BSW service stubs, a test scheduler, and stimulus/check framework.'
---

# Integration Test Harness

This skill generates integration test environments for testing multiple AUTOSAR SWCs together. It creates an RTE simulation layer that connects SWCs through in-memory data buffers, BSW service stubs, a deterministic test scheduler, and a stimulus/check framework for scenario-based testing.

## When to Use This Skill

Use this skill when you need to:

- Test interactions between two or more SWCs before full ECU integration
- Verify data flow through RTE port connections
- Test SWC behavior in response to mode transitions
- Validate timing-dependent SWC chains (sensor → filter → controller)
- Run integration tests on a host PC without target hardware

## Generated Infrastructure

### 1. RTE Simulation Layer

Connects SWC ports through in-memory buffers:

```c
/* Rte_Sim.h — RTE simulation for integration testing */
#ifndef RTE_SIM_H
#define RTE_SIM_H

#include "Std_Types.h"

/** @brief Initialize the RTE simulation (allocate buffers, reset state) */
void RteSim_Init(void);

/** @brief Connect a provider port to a requester port */
void RteSim_Connect(uint16 providerPortId, uint16 requesterPortId);

/** @brief Write data to a port buffer (called by provider SWC stubs) */
void RteSim_WriteBuffer(uint16 portId, const void* data, uint16 length);

/** @brief Read data from a port buffer (called by requester SWC stubs) */
Std_ReturnType RteSim_ReadBuffer(uint16 portId, void* data, uint16 length);

#endif /* RTE_SIM_H */
```

### 2. Test Scheduler

Calls runnables in deterministic order, simulating OS task scheduling:

```c
/* TestScheduler.h */
typedef struct {
    const char* name;
    void (*function)(void);
    uint32 periodMs;
    uint32 nextActivation;
} TestScheduler_RunnableEntry_T;

/** @brief Register a runnable for scheduling */
void TestScheduler_RegisterRunnable(const char* name, void (*func)(void), uint32 periodMs);

/** @brief Advance simulation time by deltaMs and execute due runnables */
void TestScheduler_Tick(uint32 deltaMs);

/** @brief Run scheduler for a total duration, calling runnables at their periods */
void TestScheduler_RunFor(uint32 totalMs);
```

### 3. Stimulus/Check Framework

```c
/* TestStimulus.h */

/** @brief Inject a signal value at a specific simulation time */
void Stimulus_SetSignal(uint16 signalId, const void* value, uint32 atTimeMs);

/** @brief Check a signal value at the current simulation time */
boolean Check_SignalEquals(uint16 signalId, const void* expected, uint16 length);

/** @brief Check that a DTC was reported within the time window */
boolean Check_DtcReported(uint32 dtcNumber, uint32 withinMs);
```

## Complete Example: 2-SWC Integration Test

Testing `TempSensor` → `TempMonitor` chain:

```c
/* Test_Integration_TempChain.c */
#include "unity.h"
#include "Rte_Sim.h"
#include "TestScheduler.h"
#include "TempSensor.h"
#include "TempMonitor.h"

/* Port IDs for RTE simulation */
#define PORT_TEMPSENSOR_P_RAWTEMP    1U
#define PORT_TEMPMONITOR_R_RAWTEMP   2U
#define PORT_TEMPMONITOR_P_FILTERED  3U

void setUp(void)
{
    RteSim_Init();
    TestScheduler_Init();

    /* Connect TempSensor output → TempMonitor input */
    RteSim_Connect(PORT_TEMPSENSOR_P_RAWTEMP, PORT_TEMPMONITOR_R_RAWTEMP);

    /* Register runnables */
    TestScheduler_RegisterRunnable("TempSensor_ReadCycle", TempSensor_ReadCycle, 5U);
    TestScheduler_RegisterRunnable("TempMonitor_FilterCycle", TempMonitor_FilterCycle, 10U);

    /* Initialize SWCs */
    TempSensor_Init();
    TempMonitor_Init();
}

void tearDown(void) { }

void Test_TempChain_NominalFlow(void)
{
    /* Simulate 100ms of operation */
    TestScheduler_RunFor(100U);

    /* Verify TempMonitor produced filtered output */
    Temperature_T filtered;
    Std_ReturnType status = RteSim_ReadBuffer(
        PORT_TEMPMONITOR_P_FILTERED, &filtered, sizeof(filtered));

    TEST_ASSERT_EQUAL(RTE_E_OK, status);
    TEST_ASSERT_TRUE(filtered > 0.0f);
}

void Test_TempChain_SensorFailure_PropagatesDTC(void)
{
    /* Inject sensor failure after 50ms */
    Stimulus_SetSensorFault(PORT_TEMPSENSOR_P_RAWTEMP, 50U);

    TestScheduler_RunFor(200U);

    /* Verify TempMonitor reported a fault */
    TEST_ASSERT_TRUE(Check_DtcReported(DTC_SENSOR_RANGE, 200U));
}

int main(void)
{
    UNITY_BEGIN();
    RUN_TEST(Test_TempChain_NominalFlow);
    RUN_TEST(Test_TempChain_SensorFailure_PropagatesDTC);
    return UNITY_END();
}
```

## Configuration

Specify which SWCs participate in the integration test:

```yaml
integration_test:
  name: TempChain
  swcs:
    - name: TempSensor
      runnables: [TempSensor_Init, TempSensor_ReadCycle]
    - name: TempMonitor
      runnables: [TempMonitor_Init, TempMonitor_FilterCycle]
  connections:
    - from: TempSensor.PPort_RawTemp
      to: TempMonitor.RPort_RawTemp
  bsw_stubs: [Dem, NvM]
  duration_ms: 1000
```

## Workflow

1. **Define composition** — Specify which SWCs and port connections to test
2. **Generate harness** — Skill creates RTE simulation, scheduler, and stubs
3. **Write test scenarios** — Use stimulus/check framework for scenario testing
4. **Run tests** — Execute on host PC using Unity or your test framework
5. **Analyze results** — Check signal propagation, timing, and fault handling

## Gotchas

- **RTE simulation tick order matters** — the test scheduler calls runnables in the order configured. If SWC_A writes a signal that SWC_B reads in the same tick, the result depends on execution order. Match the order to the real OS task priority/scheduling to get realistic behavior.
- **BSW service stubs have no persistence by default** — NvM read stubs return the value you configure, but NvM write stubs discard the data. If your test scenario requires write-then-read persistence, configure the stub to store written values.
- **Mode transitions require explicit scheduler steps** — calling `EcuM_RequestRUN()` in a test won't trigger mode transitions automatically. You must advance the test scheduler and call the BswM main function stub to propagate mode changes.
- **Signal init values differ between test and target** — the RTE simulation initializes all signals to 0. On the real ECU, ARXML-defined init values are used. If your SWC depends on non-zero init values, configure them explicitly in the test setup.
- **Don't test timing constraints in the harness** — the host-PC test scheduler runs in zero-time logical ticks. It cannot validate real-time deadlines. Use hardware-in-the-loop or timing analysis tools for WCET verification.
- **Interrupt-driven runnables can't be simulated accurately** — the harness calls ISR-triggered runnables like normal functions. If your SWC has ISR-context code (e.g., `SuspendAllInterrupts`), those calls are no-ops in the harness.
