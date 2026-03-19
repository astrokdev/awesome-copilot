---
name: ecu-integration-build
description: 'Multi-component ECU integration, build, and verification workflow.'
---

# ECU Integration Build Workflow

Multi-component ECU integration, build, and verification workflow.

## Trigger

Use this workflow at integration milestones, release preparation, or when adding new SWCs to the ECU build.

## Steps

### Step 1: Component Verification

- Verify all SWCs pass their unit tests
- Verify all ARXML descriptions are schema-valid (run `arxml-schema-validation` hook)
- Check version consistency across component configurations
- Verify no unresolved merge conflicts in configuration files
- **Gate**: All unit tests green, all ARXML valid

### Step 2: RTE Generation

**Agent**: `autosar-rte-engineer`

- Generate RTE from system description ARXML (using AUTOSAR toolchain)
- Verify generated `Rte_*.h` headers match SWC expectations
- Check for unconnected ports — all required ports must have a provider
- Check for interface mismatches — connected ports must share the same interface type
- **Gate**: RTE generation succeeds with zero warnings

### Step 3: BSW Configuration

**Agent**: `autosar-bsw-configurator`

- Verify OS task configuration covers all runnables
- Check COM signal routing completeness (every signal has a path from COM → PduR → CanIf)
- Verify NvM block configuration matches data needs
- Check Dem event configuration for all reported DTCs
- Verify initialization order is correct
- **Gate**: BSW configuration consistent and complete

### Step 4: Build

**Skill**: `cmake-build-helper`

Build targets:

| Target | Optimization | Debug Symbols | Assertions | Use |
|--------|-------------|---------------|------------|-----|
| Debug | -O0 | -g3 | DET ON | Development |
| Release | -O2 | -g1 | DET OFF | Production |
| Test | -O0 | -g3 | DET ON | Host unit tests |

```bash
# Cross-compile for target
cmake --preset release-target && cmake --build --preset release-target

# Or with Griddle
griddle build --target release
```

- **Gate**: Build succeeds with zero errors, warnings reviewed and accepted

### Step 5: Memory Budget Verification

**Skill**: `memory-map-analyzer`
**Agent**: `linker-memory-engineer`

- Analyze map file for section sizes
- Check against memory budget:

| Region | Budget Limit | Action if Exceeded |
|--------|-------------|-------------------|
| FLASH | 80% | Mandatory optimization review |
| RAM | 70% | Mandatory optimization review |
| Stack (per task) | Individual limit | Increase allocation or optimize |

- Review stack usage per OS task against high-water mark measurements
- **Gate**: All memory regions within budget

### Step 6: Integration Testing

**Skill**: `integration-test-harness`

- Run integration test harnesses for SWC compositions
- Verify inter-SWC communication through RTE
- Test BSW service interactions (NvM read/write, Dem event reporting)
- Test mode transitions (startup, shutdown, sleep)
- **Gate**: All integration tests pass

### Step 7: Report

Generate build report containing:

```
ECU Integration Build Report
============================
Date:           <date>
Build ID:       <id>
Target:         <MCU> / <toolchain>
AUTOSAR:        <release>

Component Status:
  [PASS] TempSensor       v1.2.0   (unit tests: 95% branch)
  [PASS] TempMonitor      v1.1.0   (unit tests: 92% branch)
  [PASS] DiagManager      v2.0.1   (unit tests: 88% MC/DC)

Memory Utilization:
  FLASH:  387.2 KB / 512.0 KB  (75.6%)  [OK]
  RAM:     89.4 KB / 128.0 KB  (69.8%)  [OK]

Build Warnings: 3 (reviewed and accepted)
Integration Tests: 24/24 passed
MISRA Violations: 0 mandatory, 2 deviations documented

Verdict: RELEASE CANDIDATE / NOT READY
```
