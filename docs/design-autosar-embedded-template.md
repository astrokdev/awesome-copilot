# AUTOSAR Embedded Development Template — System Design Specification

> **Status**: Draft
> **Date**: 2026-03-17
> **Author**: AURA Team
> **Inspired by**: [ros2-claude-code-template](https://github.com/harunkurtdev/ros2-claude-code-template)

---

## 1. Executive Summary

This document specifies the design of a comprehensive AUTOSAR Embedded Automotive Development resource set for the AURA Marketplace. Inspired by the ROS2 Claude Code template (which provides agents, rules, skills, and commands for ROS2 development), this design targets the **AUTOSAR Classic Platform** embedded development lifecycle — from architecture definition through unit/integration testing.

The design adds **25 new resources** to the existing 12, covering:

- MISRA-C:2012 compliance
- AUTOSAR BSW configuration
- AUTOSAR RTE layer design
- AUTOSAR Software Component development
- ARXML authoring and validation
- Embedded C coding patterns
- Build system integration (Griddle/CMake cross-compilation)
- Memory layout and linker script design
- Architecture and component definition
- Unit and integration testing

---

## 2. Design Rationale — ROS2 Template vs AUTOSAR Template

### 2.1 ROS2 Template Architecture (Reference)

The ROS2 template uses a `.claude/` project-local structure:

```
.claude/
├── CLAUDE.md              # Entry point — project context, build commands, architecture
├── settings.json          # Claude permissions and tool access
├── rules/                 # 6 architectural rule documents
│   ├── clean_architecture.md
│   ├── ros2_nodes.md
│   ├── ros2_communication.md
│   ├── ros2_general.md
│   ├── robot_specific.md
│   └── testing.md
├── skills/                # 9 specialized skill modules
│   ├── ros2_node_creation/
│   ├── ros2_messaging/
│   ├── ros2_testing/
│   ├── ros2_lifecycle/
│   ├── ros2_launch_config/
│   ├── ros2_service_action/
│   ├── ros2_transforms/
│   ├── ros2_diagnostics/
│   └── ros2_bag/
└── commands/              # CLI command reference
    └── ros2.md
```

**Key patterns**: Clean Architecture enforcement, bilingual (Python/C++), lifecycle management, three-tier testing, modular launch composition.

### 2.2 Our Approach — Marketplace Resources + Project Template

Unlike the ROS2 template (a single project you clone), our design produces:

1. **Marketplace Resources** — Agents, instructions, skills, hooks, workflows, and plugins that live in the aura-marketplace repo and are installable individually or as a plugin bundle
2. **Project Template Skill** — A skill that generates a `.claude/CLAUDE.md` + project skeleton for AUTOSAR projects (the "clone and go" experience)

This dual approach gives teams flexibility: install just what they need, or adopt the full template.

### 2.3 Why Not Just Copy the ROS2 Structure?

| Concern | ROS2 Template | Our AUTOSAR Design |
|---------|---------------|-------------------|
| **Distribution** | Clone entire repo | Install from marketplace (granular) |
| **Updates** | Manual git pull | Plugin version updates |
| **Customization** | Fork and modify | Compose resources per project |
| **Scope** | Single framework (ROS2) | Multi-domain (AUTOSAR + MISRA + ISO 26262 + build) |
| **Safety requirements** | Not safety-critical | ISO 26262 ASIL A–D compliance |
| **Configuration complexity** | Launch files (YAML) | ARXML (XML-based, schema-validated) |

---

## 3. Current State Inventory

### 3.1 Existing Resources (12 total)

| Type | Name | Domain |
|------|------|--------|
| Agent | `embedded-c-reviewer` | MISRA review, safety-critical code review |
| Agent | `autosar-architect` | BSW, layered architecture, ARXML, system integration |
| Agent | `autosar-swc-design` | SWC design, port interfaces, RTE API |
| Instruction | `freertos-development` | FreeRTOS task design, synchronization, memory |
| Skill | `can-dbc-parser` | CAN DBC file analysis and C code generation |
| Skill | `ceedling-unit-test` | Unity/CMock unit testing for C |
| Skill | `cmake-build-helper` | CMake cross-compilation, toolchain files |
| Skill | `iso26262-review` | Functional safety review (FMEA, ASIL) |
| Skill | `low-level-driver-design` | MMIO, ISR, DMA, HAL patterns |
| Skill | `tara-analysis` | ISO 21434 threat analysis |
| Skill | `visual-explainer` | HTML visualization (AUTOSAR, CAN, MISRA, memory maps) |
| Plugin | `embedded-c-starter` | Bundle: embedded-c-reviewer + autosar-swc-design + cmake-build-helper |

### 3.2 Gap Analysis

| Domain | Existing Coverage | Gap |
|--------|------------------|-----|
| MISRA-C | Review only (reactive) | Proactive guidance during authoring |
| AUTOSAR BSW | Architecture-level only | Module-level configuration guidance |
| AUTOSAR RTE | API usage in SWC agent | Dedicated RTE design and contract generation |
| ARXML | Reading/interpreting only | Authoring, generation, validation |
| Linker/Memory | None | Linker scripts, memory maps, section placement |
| Build System | CMake only | Griddle, cross-compilation patterns |
| Testing | Ceedling (unit) only | Integration test, AUTOSAR-specific stubs, coverage per ASIL |
| Hooks | None | Pre-commit automation |
| Workflows | None | Multi-step development processes |
| Project Template | None | CLAUDE.md template for AUTOSAR projects |

---

## 4. Resource Design — Agents

### 4.1 New Agent: `misra-c-advisor.agent.md`

**Purpose**: Real-time MISRA-C:2012 guidance during code authoring (proactive, not just review).

**Distinction from `embedded-c-reviewer`**: The reviewer analyzes existing code after the fact. The advisor guides the developer while writing new code — suggesting compliant patterns, warning about common violations before they happen.

```yaml
---
description: 'Proactive MISRA-C:2012 compliance advisor: suggests compliant coding patterns, warns about common violations during authoring, and guides deviation documentation.'
model: 'claude-sonnet-4-6'
tools: ['codebase']
name: 'MISRA-C Advisor'
---
```

**Expertise areas**:
- MISRA-C:2012 rule categories: Mandatory (cannot deviate), Required (formal deviation needed), Advisory (may deviate with justification)
- Compliant alternatives for common patterns (e.g., compliant `for` loops, switch/case patterns, pointer arithmetic)
- Deviation procedure: when to deviate, how to document (MISRA Deviation Record format)
- Static analysis tool configuration (PC-lint, Polyspace, cppcheck MISRA addon)
- MISRA-C:2023 (Amendment 3) updates and new rules

**Key behaviors**:
- When user writes a C pattern, proactively suggest the MISRA-compliant version
- Cite specific rule numbers (e.g., "Rule 14.4 — the controlling expression of `if` should have essentially Boolean type")
- Provide the "before/after" pattern transformation
- Guide deviation documentation when rules must be violated (e.g., hardware register access)

---

### 4.2 New Agent: `autosar-bsw-configurator.agent.md`

**Purpose**: BSW module selection, configuration, and integration at the module level.

**Distinction from `autosar-architect`**: The architect works at system/ECU level. The configurator works inside individual BSW modules — configuring parameters, generating structures, resolving inter-module dependencies.

```yaml
---
description: 'AUTOSAR BSW module configurator: OS task/ISR setup, COM signal routing, NvM block design, Dem DTC mapping, EcuM startup sequences, and BswM mode management rules.'
model: 'claude-sonnet-4-6'
tools: ['codebase', 'githubRepo']
name: 'AUTOSAR BSW Configurator'
---
```

**Expertise areas**:
- **OS**: Tasks (activation, priority, preemptability), ISR categories, alarms, schedule tables, OS applications (trusted/non-trusted), stack sizing
- **COM**: Signal groups, I-PDU groups, signal packing (byte position, bit length, endianness), transmission modes (periodic, mixed, none), timeout monitoring
- **NvM**: Block types (Native, Redundant, Dataset), RAM/ROM/NV block relationships, CRC protection, read-all/write-all sequences, immediate writes
- **Dem**: DTC definitions, event/operation cycles, enable conditions, debouncing (counter/time-based), freeze frame data, extended data
- **Dcm**: Diagnostic service routing (0x10-0x3E), security access levels, DID/RID configuration, session management, response-on-event
- **EcuM**: Startup/shutdown sequences, wakeup sources, sleep modes, RUN/POST_RUN request arbitration
- **BswM**: Mode request ports, mode arbitration rules, action lists, rule-based mode management
- **FiM**: Function inhibition conditions, FID configuration, DEM event-to-FID mapping
- **SchM**: Exclusive areas, interrupt lock levels, BSW MainFunction scheduling

**Key behaviors**:
- Ask about the AUTOSAR release version (R4.x, R19-11+) as configuration patterns differ
- Generate configuration structures in C (e.g., `Os_TaskConfigType`, `Com_SignalConfigType`)
- Explain inter-module dependencies (e.g., "Dem needs NvM for fault memory storage")
- Provide ARXML configuration snippets alongside C structures

---

### 4.3 New Agent: `autosar-rte-engineer.agent.md`

**Purpose**: Dedicated RTE layer design, contract generation, and data consistency analysis.

**Distinction from `autosar-swc-design`**: The SWC designer focuses on application component design. The RTE engineer focuses on the generated RTE layer — contracts, timing, data consistency mechanisms, and the boundary between SWC and BSW.

```yaml
---
description: 'AUTOSAR RTE design engineer: RTE contract generation, data consistency mechanisms, implicit/explicit access analysis, exclusive area design, and inter-runnable variable patterns.'
model: 'claude-sonnet-4-6'
tools: ['codebase']
name: 'AUTOSAR RTE Engineer'
---
```

**Expertise areas**:
- RTE contract header generation (`Rte_<SwcName>.h`) — all API declarations per SWC
- Data consistency: implicit vs explicit access trade-offs, when to use each
- Exclusive areas: IRQ-based, OS resource-based, cooperative scheduling-based
- Inter-Runnable Variables (IRVs): typed access, initialization, consistency guarantees
- Per-Instance Memory (PIM): allocation, typed access, NvM mirror blocks
- Mode management through RTE: mode switch notifications, mode disabling of runnables
- RTE event mapping: timing events to OS alarms, data-received events to COM notifications
- RTE timing analysis: worst-case execution paths through runnable chains, age/reaction time
- SchM integration: BSW module main function scheduling through SchM exclusive areas

**Key behaviors**:
- Generate complete `Rte_<SwcName>.h` contract headers from SWC descriptions
- Generate RTE stub headers for unit testing (same API, configurable return values)
- Analyze data flow paths for timing constraints (task chain analysis)
- Flag data consistency issues (e.g., "Runnable A writes data that Runnable B reads in a lower-priority task — needs exclusive area or implicit access")

---

### 4.4 New Agent: `linker-memory-engineer.agent.md`

**Purpose**: Linker script authoring, memory map design, and section placement optimization.

```yaml
---
description: 'Embedded linker and memory layout engineer: linker script authoring (GCC LD, IAR ICF, GHS), memory region definitions, section placement, MPU configuration, and map file analysis.'
model: 'claude-sonnet-4-6'
tools: ['codebase', 'terminalCommand']
name: 'Linker & Memory Engineer'
---
```

**Expertise areas**:
- **Linker script dialects**: GNU LD (`.ld`), IAR ICF (`.icf`), Green Hills (`.ld`), ARM scatter-load (`.sct`), Tasking LSL (`.lsl`)
- **Memory regions**: FLASH (code, const, calibration), RAM (initialized data, BSS, stack, heap), TCM (tightly-coupled for fast access), EEPROM emulation, boot sectors, OTP
- **Section definitions**: `.text`, `.rodata`, `.data`, `.bss`, `.stack`, `.heap`, custom sections for AUTOSAR MemMap (`<Module>_START_SEC_CODE`, `<Module>_START_SEC_VAR_INIT_8`)
- **AUTOSAR MemMap integration**: `#include "MemMap.h"` patterns, `#define <Module>_START_SEC_*` / `#define <Module>_STOP_SEC_*`
- **MPU configuration**: Region definitions, access permissions (RX, RW, RO), alignment constraints, ASIL partitioning through MPU regions
- **Map file analysis**: Section sizes, symbol addresses, fill/gap detection, memory utilization percentages
- **Startup code**: Reset vector, `.data` copy (ROM-to-RAM), `.bss` zero-fill, stack pointer initialization, C runtime setup (`__libc_init_array`)
- **Calibration**: XCP/CCP calibration data placement, overlay RAM for online calibration, A2L address mapping

**Key behaviors**:
- Ask about the target MCU family (e.g., Infineon AURIX TC3xx, Renesas RH850, NXP S32K) as memory maps differ significantly
- Generate linker scripts in the appropriate dialect for the toolchain
- Analyze `.map` files to report memory utilization and flag budget overruns
- Explain AUTOSAR MemMap patterns and generate `MemMap.h` configurations
- Design MPU regions for ASIL partitioning (QM vs ASIL code/data separation)

---

### 4.5 New Agent: `embedded-test-architect.agent.md`

**Purpose**: Test strategy and test infrastructure design for embedded/AUTOSAR systems.

**Distinction from `ceedling-unit-test` skill**: The skill teaches Ceedling mechanics. The agent designs the overall test strategy, including what to test, how to structure test doubles, and how to achieve coverage targets per ASIL level.

```yaml
---
description: 'Embedded test architect: unit and integration test strategy, RTE/BSW stub generation, hardware abstraction for host testing, coverage requirements per ASIL level, and test framework selection.'
model: 'claude-sonnet-4-6'
tools: ['codebase', 'terminalCommand']
name: 'Embedded Test Architect'
---
```

**Expertise areas**:
- **Test strategy by ASIL level**: ASIL-A (statement coverage), ASIL-B (branch coverage), ASIL-C/D (MC/DC coverage) per ISO 26262 Part 6
- **Unit test design**: Function-level testing with controlled inputs, boundary value analysis, equivalence partitioning
- **RTE stub generation**: Creating test doubles for `Rte_Read_*`, `Rte_Write_*`, `Rte_Call_*` that simulate RTE behavior
- **BSW service stubs**: NvM read/write stubs, Dem event report stubs, OS alarm stubs, COM signal stubs
- **Hardware abstraction**: MMIO register mocking, DMA simulation, timer simulation for host-based testing
- **Integration test design**: Multi-SWC composition testing, RTE simulation layer, BSW service integration
- **Test frameworks**: Unity/CMock (C), CppUTest (C/C++), GoogleTest (C++), VectorCAST, LDRA Testbed, Tessy
- **Coverage analysis**: gcov/gcovr for GCC, toolchain-specific coverage, MC/DC instrumentation
- **Regression testing**: Test selection strategies, impact analysis for code changes

**Key behaviors**:
- Ask about the ASIL level to determine coverage requirements
- Generate test skeletons with appropriate assertions and boundary conditions
- Design stub/mock architectures that isolate the SWC under test from RTE and BSW
- Recommend test framework based on project constraints (open-source vs commercial, host vs target)
- Calculate coverage gaps and suggest additional test cases

---

## 5. Resource Design — Instructions

### 5.1 `misra-c-2012.instructions.md`

```yaml
---
description: 'MISRA-C:2012 compliance rules for embedded C code: mandatory, required, and advisory rules with compliant patterns and common violations.'
applyTo: '**.c, **.h'
---
```

**Content structure**:
- Top mandatory rules (cannot deviate): Rule 1.3 (no undefined behavior), Rule 17.3 (no implicit function declarations)
- Top required rules (most commonly violated): Rule 8.4 (compatible declaration), Rule 10.1 (operand types), Rule 11.3 (pointer casts), Rule 14.4 (Boolean controlling expressions), Rule 15.7 (else after if-else-if)
- Compliant patterns: `for` loops, `switch`/`case`, pointer usage, type conversions
- Deviation documentation format (MISRA compliance matrix template)

### 5.2 `autosar-coding-guidelines.instructions.md`

```yaml
---
description: 'AUTOSAR naming conventions and coding patterns: module prefixes, Std_Types usage, API design patterns, and return type conventions.'
applyTo: '**.c, **.h'
---
```

**Content structure**:
- Naming: `<Module>_<FunctionName>` (e.g., `Com_SendSignal`), `<Module>_<TypeName>Type` (e.g., `NvM_BlockIdType`)
- Types: Always use `Std_Types.h` base types (`uint8`, `uint16`, `sint32`, `float32`), never raw C types (`unsigned char`, `int`)
- Return types: `Std_ReturnType` for API functions, `E_OK`/`E_NOT_OK` convention
- Error handling: DET (Default Error Tracer) reporting pattern for development errors
- Configuration patterns: `<Module>_Cfg.h` for pre-compile, `<Module>_PBCfg.c` for post-build

### 5.3 `arxml-authoring.instructions.md`

```yaml
---
description: 'AUTOSAR ARXML authoring conventions: package hierarchy, SHORT-NAME rules, reference paths, namespace handling, and schema version compatibility.'
applyTo: '**.arxml, **.xml'
---
```

**Content structure**:
- Package hierarchy: `/AUTOSAR/EcuProject/<EcuName>/...`, `/AUTOSAR/DataTypes/...`, `/AUTOSAR/PortInterfaces/...`
- SHORT-NAME rules: PascalCase for types and interfaces, camelCase for data elements, UPPER_CASE for implementation constants
- Reference paths: absolute DEST-based references, path resolution rules
- Schema version: `xmlns` declaration matching AUTOSAR release (R4.x schema URLs)
- Common ARXML patterns: SWC description template, port interface template, data type template

### 5.4 `linker-script.instructions.md`

```yaml
---
description: 'Linker script conventions for embedded targets: memory region naming, section placement rules, alignment requirements, and startup symbol definitions.'
applyTo: '**.ld, **.ldf, **.lcf, **.icf, **.sct'
---
```

**Content structure**:
- Memory region naming: `PFLASH0`, `PFLASH1`, `DSPR0`, `DLMU`, `LMU_SRAM` (AURIX-style); `FLASH`, `RAM`, `ITCM`, `DTCM` (generic ARM)
- Section placement rules: `.text` → FLASH, `.rodata` → FLASH, `.data` → RAM (load from FLASH), `.bss` → RAM
- Alignment: `ALIGN(4)` for data, `ALIGN(16)` or `ALIGN(32)` for MPU regions, `ALIGN(256)` for vector tables
- KEEP directives: vector table, constructor/destructor arrays, debug sections
- Symbols for startup: `__data_start`, `__data_end`, `__data_load`, `__bss_start`, `__bss_end`, `__stack_top`

### 5.5 `memory-section-pragmas.instructions.md`

```yaml
---
description: 'AUTOSAR memory section placement: MemMap.h patterns, pragma section directives, GCC section attributes, and calibration data placement conventions.'
applyTo: '**.c, **.h'
---
```

**Content structure**:
- AUTOSAR MemMap pattern:
  ```c
  #define COM_START_SEC_CODE
  #include "MemMap.h"
  /* ... function implementations ... */
  #define COM_STOP_SEC_CODE
  #include "MemMap.h"
  ```
- Section categories: `CODE`, `CONST_8/16/32/UNSPECIFIED`, `VAR_INIT_8/16/32/UNSPECIFIED`, `VAR_NO_INIT_8/16/32/UNSPECIFIED`, `VAR_CLEARED_8/16/32/UNSPECIFIED`, `VAR_POWER_ON_INIT`
- GCC attributes: `__attribute__((section(".cal_data")))` for calibration
- Compiler-specific pragmas: `#pragma section` (Tasking, GHS), `#pragma location` (IAR)

### 5.6 `embedded-test-patterns.instructions.md`

```yaml
---
description: 'Embedded C unit and integration test coding patterns: test naming, assertion usage, RTE stub organization, mock configuration, and hardware abstraction in tests.'
applyTo: '**/test/**, **/tests/**, **/*_test.c, **/*_Test.c, **/Test_*.c'
---
```

**Content structure**:
- Test naming: `Test_<Module>_<Function>_<Scenario>` (e.g., `Test_SensorFilter_Apply_NominalInput`)
- Assertion patterns: `TEST_ASSERT_EQUAL_UINT16(expected, actual)`, `TEST_ASSERT_FLOAT_WITHIN(tolerance, expected, actual)`
- RTE stub organization: one stub file per SWC (`Stub_Rte_<SwcName>.c`), configurable return values via setter functions
- Mock configuration: CMock expectations for BSW service calls (`Dem_ReportErrorStatus_Expect()`)
- Hardware abstraction: Register read/write macros redirected to RAM arrays in test builds
- Test isolation: Each test file links against stubs, never against real RTE or BSW

---

## 6. Resource Design — Skills

### 6.1 `autosar-swc-scaffold/`

**Purpose**: Generate a complete SWC skeleton from a specification.

```yaml
---
name: autosar-swc-scaffold
description: 'Scaffold a complete AUTOSAR Software Component: C source/header, configuration header, ARXML description, RTE contract stub, and unit test skeleton from a component specification.'
---
```

**Input specification** (user provides):
- SWC name (e.g., `TempMonitor`)
- SWC type: Application, SensorActuator, CDD, ServiceProxy
- Ports: list of `{name, direction (P/R), interface_type (S/R|C/S|Mode), data_type}`
- Runnables: list of `{name, trigger (timing|data_received|init|mode_switch), period_ms (if timing)}`
- ASIL level: QM, A, B, C, D

**Generated output**:
```
src/app/TempMonitor/
├── TempMonitor.c              # Implementation with runnable skeletons
├── TempMonitor.h              # Public interface
├── TempMonitor_Internal.h     # Internal declarations
├── TempMonitor_Cfg.h          # Configuration parameters
├── TempMonitor.arxml          # SWC description (ports, runnables, interfaces)
test/unit/TempMonitor/
├── Test_TempMonitor.c         # Unit test skeleton
├── stubs/Stub_Rte_TempMonitor.c  # RTE stub
└── stubs/Stub_Rte_TempMonitor.h  # RTE stub header
```

**Key patterns in generated code**:
- AUTOSAR MemMap sections around all code and data
- `Std_ReturnType` returns with error checking
- RTE API calls matching the port specification
- DET checks in development mode (`#if (TEMPMONITOR_DEV_ERROR_DETECT == STD_ON)`)
- MISRA-C:2012 compliant patterns throughout
- Unity test skeleton with setup/teardown for stubs

---

### 6.2 `arxml-generator/`

**Purpose**: Generate ARXML fragments from structured descriptions.

```yaml
---
name: arxml-generator
description: 'Generate AUTOSAR ARXML descriptions: SWC types, port interfaces, data types, compositions, system descriptions, and ECU extracts from structured specifications.'
---
```

**Capabilities**:
- **SWC Description**: Generate `<APPLICATION-SW-COMPONENT-TYPE>` with ports, internal behavior, runnables, data access points
- **Port Interfaces**: Generate `<SENDER-RECEIVER-INTERFACE>`, `<CLIENT-SERVER-INTERFACE>`, `<MODE-SWITCH-INTERFACE>` definitions
- **Data Types**: Generate `<APPLICATION-PRIMITIVE-DATA-TYPE>`, `<IMPLEMENTATION-DATA-TYPE>`, `<COMPUTATION-METHOD>` for physical/internal representations
- **Compositions**: Generate `<COMPOSITION-SW-COMPONENT-TYPE>` with assembly connectors and delegation ports
- **System Description**: Generate `<SYSTEM>` with SWC-to-ECU mapping, signal routing
- **Validation**: Check reference paths, SHORT-NAME uniqueness, schema compliance

---

### 6.3 `rte-contract-generator/`

**Purpose**: Generate RTE contract headers and test stubs.

```yaml
---
name: rte-contract-generator
description: 'Generate AUTOSAR RTE contract headers (Rte_<SwcName>.h) and unit test stubs from SWC port/runnable specifications, with configurable data consistency modes.'
---
```

**Generated artifacts**:
- `Rte_<SwcName>.h` — Full RTE API declarations for all ports and runnables
- `Rte_Type.h` additions — Data type definitions needed by the SWC
- `Stub_Rte_<SwcName>.h/.c` — Test doubles with setter/getter functions for controlling stub behavior
- Data consistency annotations: comments marking which APIs use implicit vs explicit access

---

### 6.4 `linker-script-generator/`

**Purpose**: Generate linker scripts from memory specifications.

```yaml
---
name: linker-script-generator
description: 'Generate linker scripts from memory map specifications: supports GCC LD, IAR ICF, and ARM scatter-load formats with AUTOSAR MemMap section placement and MPU-aligned regions.'
---
```

**Input**: Memory map specification (regions, sizes, attributes, section assignments)

**Output**: Linker script in target dialect + memory utilization summary

**Supported targets**:
- GNU LD (`.ld`) — GCC-based toolchains
- IAR ICF (`.icf`) — IAR Embedded Workbench
- ARM scatter-load (`.sct`) — ARM Compiler / Keil
- Green Hills (`.ld`) — GHS MULTI
- Tasking LSL (`.lsl`) — Tasking compiler (AURIX)

---

### 6.5 `bsw-module-configurator/`

**Purpose**: Guide BSW module configuration from functional requirements.

```yaml
---
name: bsw-module-configurator
description: 'Generate AUTOSAR BSW module configurations: OS task tables, COM signal routing, NvM block definitions, Dem DTC tables, and EcuM startup sequences from functional requirements.'
---
```

**Workflow**:
1. User describes the functional requirement (e.g., "Store calibration data in NvM with CRC protection")
2. Skill identifies involved BSW modules (NvM, Crc, MemIf, Fee/Fls)
3. Generates configuration structures in C and corresponding ARXML
4. Documents inter-module dependencies and initialization order

---

### 6.6 `memory-map-analyzer/`

**Purpose**: Analyze linker map files for memory utilization.

```yaml
---
name: memory-map-analyzer
description: 'Analyze embedded linker map files (.map) for section sizes, memory utilization, budget compliance, stack usage estimation, and optimization recommendations.'
---
```

**Capabilities**:
- Parse `.map` files from common toolchains (GCC, IAR, GHS, Tasking)
- Report memory utilization per region (FLASH %, RAM %)
- Detect potential issues: sections approaching limits, unexpected large symbols, alignment waste
- Compare against memory budget specifications
- Recommend optimization strategies (const-correctness, section consolidation, LTO candidates)

---

### 6.7 `integration-test-harness/`

**Purpose**: Generate integration test environments for multi-SWC testing.

```yaml
---
name: integration-test-harness
description: 'Generate integration test harnesses for AUTOSAR SWC compositions: RTE simulation layer, BSW service stubs, test scheduler, and stimulus/check framework for multi-component testing.'
---
```

**Generated infrastructure**:
- RTE simulation layer that connects SWCs through in-memory data buffers
- BSW service stubs (NvM, Dem, Com, Os) with configurable behavior
- Test scheduler that calls runnables in deterministic order
- Stimulus framework for injecting input signals
- Check framework for verifying output signals and state transitions
- Test sequence runner for scenario-based testing

---

## 7. Resource Design — Hooks

### 7.1 `misra-compliance-check/`

```yaml
# hooks.json
{
  "hooks": [
    {
      "event": "pre-commit",
      "pattern": "**.c,**.h",
      "command": "cppcheck --enable=all --addon=misra.json --suppress=missingInclude ${files}",
      "description": "Run MISRA-C:2012 compliance check on staged C files",
      "blocking": true,
      "severity": "error"
    }
  ]
}
```

**README.md front matter**:
```yaml
---
name: misra-compliance-check
description: 'Pre-commit hook that runs MISRA-C:2012 compliance checking on staged C/H files using cppcheck with MISRA addon, blocking commits on mandatory rule violations.'
tags: ['misra', 'c', 'safety', 'pre-commit']
---
```

### 7.2 `arxml-schema-validation/`

```yaml
# hooks.json
{
  "hooks": [
    {
      "event": "pre-commit",
      "pattern": "**.arxml",
      "command": "xmllint --schema ${AUTOSAR_SCHEMA_PATH}/AUTOSAR_00051.xsd --noout ${files}",
      "description": "Validate ARXML files against AUTOSAR schema",
      "blocking": true,
      "severity": "error"
    }
  ]
}
```

---

## 8. Resource Design — Workflows

### 8.1 `autosar-swc-development.md`

**Purpose**: End-to-end SWC development lifecycle workflow.

```
# AUTOSAR SWC Development Workflow

## Trigger
When developing a new AUTOSAR Software Component from requirements.

## Steps

### Step 1: Requirements Analysis
- Identify functional requirements for the SWC
- Determine ASIL level and safety requirements
- Identify input/output signals and service dependencies
- **Agent**: `autosar-architect` for architecture placement
- **Agent**: `iso26262-review` if ASIL B+

### Step 2: Component Design
- Define SWC type (Application, SensorActuator, CDD)
- Design port interfaces (S/R, C/S, Mode)
- Design runnables with activation triggers
- Define data consistency requirements
- **Agent**: `autosar-swc-design` for port/runnable design
- **Skill**: `autosar-swc-scaffold` to generate skeleton

### Step 3: ARXML Description
- Generate SWC description ARXML
- Generate port interface ARXML
- Generate data type ARXML
- Validate against schema
- **Skill**: `arxml-generator` for ARXML authoring
- **Hook**: `arxml-schema-validation` for validation

### Step 4: RTE Contract Generation
- Generate Rte_<SwcName>.h contract header
- Generate test stubs for unit testing
- Verify data access modes (implicit/explicit)
- **Agent**: `autosar-rte-engineer` for RTE design
- **Skill**: `rte-contract-generator` for header generation

### Step 5: Implementation
- Implement runnable bodies in C
- Follow MISRA-C:2012 guidelines
- Apply AUTOSAR MemMap sections
- Configure DET error checking
- **Agent**: `misra-c-advisor` for MISRA guidance
- **Instruction**: `misra-c-2012` applied automatically
- **Instruction**: `autosar-coding-guidelines` applied automatically
- **Instruction**: `memory-section-pragmas` applied automatically

### Step 6: Unit Testing
- Generate unit test skeleton
- Implement test cases per ASIL coverage requirement
- Create RTE stubs and BSW service mocks
- Run tests and verify coverage
- **Agent**: `embedded-test-architect` for test strategy
- **Skill**: `ceedling-unit-test` for test execution
- **Instruction**: `embedded-test-patterns` applied automatically

### Step 7: Integration
- Add SWC to composition
- Configure BSW modules for new signals
- Update linker script for new sections
- Run integration tests
- **Agent**: `autosar-bsw-configurator` for BSW updates
- **Agent**: `linker-memory-engineer` for memory allocation
- **Skill**: `integration-test-harness` for integration testing

### Step 8: Verification
- Run full MISRA compliance check
- Verify memory budget compliance
- Review safety requirements traceability
- **Hook**: `misra-compliance-check` for final verification
- **Skill**: `memory-map-analyzer` for budget check
```

### 8.2 `safety-code-review.md`

**Purpose**: ISO 26262 compliant code review workflow.

```
# Safety Code Review Workflow

## Trigger
Before merging code changes to safety-relevant (ASIL A+) software components.

## Steps

### Step 1: MISRA Compliance Verification
- Run full MISRA-C:2012 analysis
- Review all mandatory rule violations (must be zero)
- Review required rule deviations (must have formal deviation records)
- **Agent**: `embedded-c-reviewer`
- **Hook**: `misra-compliance-check`

### Step 2: Safety Analysis Impact
- Check if changes affect safety goals or safety requirements
- Review FMEA/FTA for impacted functions
- Verify ASIL decomposition is maintained
- **Skill**: `iso26262-review`

### Step 3: Code Coverage Verification
- Verify coverage meets ASIL level requirements:
  - ASIL A: Statement coverage ≥ 80%
  - ASIL B: Branch coverage ≥ 80%
  - ASIL C: Branch coverage ≥ 90%
  - ASIL D: MC/DC coverage ≥ 90%
- **Agent**: `embedded-test-architect`

### Step 4: Memory and Resource Analysis
- Verify stack usage within bounds
- Check memory budget compliance
- Review timing impact (WCET)
- **Skill**: `memory-map-analyzer`

### Step 5: Review Checklist Sign-off
- Reviewer completes ISO 26262 Part 6 Table 9 checklist
- Document review findings and dispositions
- Archive review record
```

### 8.3 `ecu-integration-build.md`

**Purpose**: Multi-component ECU integration and build workflow.

```
# ECU Integration Build Workflow

## Trigger
When integrating multiple SWCs and BSW modules into a complete ECU build.

## Steps

### Step 1: Component Verification
- Verify all SWCs pass unit tests
- Verify all SWC ARXML descriptions are schema-valid
- Check version consistency across components

### Step 2: RTE Generation
- Generate RTE from system description ARXML
- Verify generated Rte_*.h matches SWC expectations
- Check for unconnected ports or interface mismatches
- **Agent**: `autosar-rte-engineer`

### Step 3: BSW Configuration
- Configure BSW modules for all integrated signals
- Verify OS task configuration covers all runnables
- Check COM signal routing completeness
- **Agent**: `autosar-bsw-configurator`

### Step 4: Build
- Cross-compile all components for target MCU
- Link with target linker script
- Generate map file
- **Skill**: `cmake-build-helper` or Griddle build

### Step 5: Memory Budget Verification
- Analyze map file for section sizes
- Verify FLASH and RAM usage within budget
- Check stack allocation per task
- **Skill**: `memory-map-analyzer`
- **Agent**: `linker-memory-engineer`

### Step 6: Integration Testing
- Run integration test harness
- Verify inter-SWC communication through RTE
- Test BSW service interactions
- **Skill**: `integration-test-harness`

### Step 7: Report
- Generate build report (memory utilization, warnings, test results)
- Archive build artifacts
```

---

## 9. Resource Design — Plugin

### 9.1 `autosar-development-toolkit/`

**Purpose**: Comprehensive plugin bundling all AUTOSAR development resources.

```json
{
  "name": "autosar-development-toolkit",
  "description": "Complete AUTOSAR Classic Platform development toolkit: architecture design, SWC development, BSW configuration, MISRA-C compliance, RTE engineering, linker/memory management, and embedded testing.",
  "version": "1.0.0",
  "keywords": ["autosar", "embedded", "automotive", "misra", "arxml", "bsw", "rte", "safety", "iso26262"],
  "author": "AURA Maintainers",
  "license": "MIT",
  "agents": [
    "../../agents/autosar-architect.agent.md",
    "../../agents/autosar-swc-design.agent.md",
    "../../agents/autosar-bsw-configurator.agent.md",
    "../../agents/autosar-rte-engineer.agent.md",
    "../../agents/embedded-c-reviewer.agent.md",
    "../../agents/misra-c-advisor.agent.md",
    "../../agents/linker-memory-engineer.agent.md",
    "../../agents/embedded-test-architect.agent.md"
  ],
  "skills": [
    "../../skills/autosar-swc-scaffold",
    "../../skills/arxml-generator",
    "../../skills/rte-contract-generator",
    "../../skills/linker-script-generator",
    "../../skills/bsw-module-configurator",
    "../../skills/memory-map-analyzer",
    "../../skills/integration-test-harness",
    "../../skills/ceedling-unit-test",
    "../../skills/can-dbc-parser",
    "../../skills/iso26262-review"
  ]
}
```

---

## 10. Resource Design — AUTOSAR Project Template Skill

### 10.1 `autosar-project-template/`

**Purpose**: Generate a complete AUTOSAR project skeleton with a pre-configured CLAUDE.md.

```yaml
---
name: autosar-project-template
description: 'Generate a complete AUTOSAR Classic Platform project skeleton with CLAUDE.md, directory structure, build configuration, linker scripts, and development guidelines tailored to the target MCU and toolchain.'
---
```

**User provides**:
- Project name
- Target MCU family (AURIX TC3xx, RH850, S32K, STM32, etc.)
- Toolchain (GCC, IAR, GHS, Tasking)
- AUTOSAR release (R4.x, R19-11, R22-11)
- ASIL level (QM, A, B, C, D)
- Build system preference (CMake, Griddle, Make)

**Generated project structure**:

```
<project-name>/
├── CLAUDE.md                           # ← KEY DELIVERABLE (see Section 11)
├── .github/
│   └── copilot-instructions.md         # GitHub Copilot review instructions
├── src/
│   ├── app/                            # Application SWCs (empty, ready for scaffolding)
│   ├── bsw/                            # BSW module configurations
│   │   ├── os/
│   │   ├── com/
│   │   ├── nvm/
│   │   ├── dem/
│   │   └── ecum/
│   ├── rte/                            # Generated RTE (placeholder)
│   ├── mcal/                           # MCAL stubs/configs
│   └── integration/                    # Integration callouts
├── config/
│   ├── arxml/                          # System ARXML
│   │   ├── system.arxml
│   │   └── datatypes.arxml
│   └── bsw/                            # BSW parameter files
├── build/
│   ├── CMakeLists.txt                  # or Griddlefile
│   ├── toolchains/<toolchain>.cmake    # Toolchain definition
│   └── targets/<mcu>.cmake             # MCU-specific config
├── linker/
│   ├── memory_map.ld                   # Main linker script (target-specific)
│   └── sections.ld                     # Section definitions
├── test/
│   ├── unit/                           # Unit tests per SWC
│   ├── integration/                    # Integration tests
│   └── framework/                      # Test framework config
│       └── project.yml                 # Ceedling config
├── tools/
│   ├── static-analysis/
│   │   └── misra_cppcheck.json         # MISRA addon config
│   └── scripts/
│       ├── build.sh
│       └── run_tests.sh
└── docs/
    ├── architecture/
    └── safety/
```

---

## 11. AUTOSAR Project CLAUDE.md Template

This is the core of the "ROS2 template equivalent" — the CLAUDE.md that lives in every AUTOSAR project and teaches Claude/Copilot about the project.

```markdown
# CLAUDE.md — AUTOSAR Classic Platform Project

## Project Overview
This is an AUTOSAR Classic Platform ECU project targeting [MCU_FAMILY] with [TOOLCHAIN].
- **AUTOSAR Release**: [RELEASE_VERSION]
- **Safety Level**: [ASIL_LEVEL]
- **Build System**: [BUILD_SYSTEM]

## Architecture

### AUTOSAR Layered Architecture
```
┌─────────────────────────────────────────────────────┐
│                 Application Layer                     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐            │
│  │   SWC1   │ │   SWC2   │ │   SWC3   │  src/app/  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘            │
├───────┴─────────────┴─────────────┴─────────────────┤
│                Runtime Environment (RTE)              │
│                                          src/rte/    │
├─────────────────────────────────────────────────────┤
│                 BSW Service Layer                     │
│  OS │ COM │ NvM │ Dem │ Dcm │ EcuM │ BswM          │
│                                          src/bsw/   │
├─────────────────────────────────────────────────────┤
│              ECU Abstraction Layer                    │
│  CanIf │ EepIf │ MemIf │ WdgIf                     │
├─────────────────────────────────────────────────────┤
│        Microcontroller Abstraction (MCAL)            │
│  Can │ Spi │ Adc │ Dio │ Gpt │ Fls    src/mcal/    │
├─────────────────────────────────────────────────────┤
│                    Hardware                           │
│               [MCU_FAMILY] @ [CLOCK_FREQ]            │
└─────────────────────────────────────────────────────┘
```

### Directory Structure
- `src/app/<SwcName>/` — Application SWCs (one folder per SWC)
- `src/bsw/` — BSW module configurations
- `src/rte/` — Generated RTE layer (do not edit manually)
- `src/mcal/` — MCAL driver configurations
- `config/arxml/` — System-level ARXML descriptions
- `linker/` — Linker scripts and memory maps
- `test/unit/` — Unit tests per SWC
- `test/integration/` — Integration test harnesses

## Build Commands

```bash
# Configure and build
[BUILD_CONFIGURE_CMD]
[BUILD_CMD]

# Build specific SWC
[BUILD_SWC_CMD]

# Run unit tests (host build)
[TEST_UNIT_CMD]

# Run integration tests
[TEST_INTEGRATION_CMD]

# Run MISRA check
[MISRA_CHECK_CMD]

# Analyze memory usage from map file
[MAP_ANALYSIS_CMD]

# Generate RTE (requires AUTOSAR toolchain)
[RTE_GEN_CMD]
```

## Development Workflow

### Creating a New SWC
1. Design port interfaces and runnables (use `autosar-swc-design` agent)
2. Generate scaffold: invoke `autosar-swc-scaffold` skill
3. Generate ARXML: invoke `arxml-generator` skill
4. Generate RTE contracts: invoke `rte-contract-generator` skill
5. Implement runnable bodies in `src/app/<SwcName>/<SwcName>.c`
6. Write unit tests in `test/unit/<SwcName>/`
7. Add to composition in `config/arxml/composition.arxml`

### Modifying an Existing SWC
1. Update ARXML if port interfaces change
2. Regenerate RTE contracts if ports changed
3. Update implementation
4. Update/add unit tests
5. Run MISRA check
6. Run unit tests and verify coverage

## Coding Standards

### MISRA-C:2012 Compliance
- **All code must be MISRA-C:2012 compliant** at the project's ASIL level
- Mandatory rules: zero violations (no deviations permitted)
- Required rules: deviations require formal Deviation Records in `docs/safety/deviations/`
- Run `[MISRA_CHECK_CMD]` before every commit

### AUTOSAR Conventions
- Use `Std_Types.h` types: `uint8`, `uint16`, `uint32`, `sint8`, `sint16`, `sint32`, `float32`, `float64`
- Function naming: `<SwcName>_<FunctionName>` for public, `<SwcName>_Internal_<FunctionName>` for internal
- All API functions return `Std_ReturnType` (E_OK / E_NOT_OK)
- Use AUTOSAR MemMap sections: `#define <MODULE>_START_SEC_CODE` / `#include "MemMap.h"`
- No dynamic memory allocation after initialization
- No recursion

### Memory Sections
- Code: `<MODULE>_START_SEC_CODE` → placed in FLASH
- Constants: `<MODULE>_START_SEC_CONST_*` → placed in FLASH
- Initialized variables: `<MODULE>_START_SEC_VAR_INIT_*` → placed in RAM (init from FLASH)
- Cleared variables: `<MODULE>_START_SEC_VAR_CLEARED_*` → placed in RAM (zeroed at startup)
- Calibration: `<MODULE>_START_SEC_CALIB_*` → placed in calibration FLASH region

## Memory Map

```
[MEMORY_MAP_ASCII_ART — generated based on MCU_FAMILY]
```

### Memory Budget
| Region | Size | Budget | Current Usage |
|--------|------|--------|---------------|
| PFLASH | ... | 80% max | TBD |
| DSRAM | ... | 70% max | TBD |
| Stack/Task | ... | per-task limit | TBD |

## Testing Strategy

### Coverage Requirements (per ISO 26262 Part 6)
| ASIL Level | Minimum Coverage | Coverage Type |
|------------|-----------------|---------------|
| QM | 60% | Statement |
| ASIL A | 80% | Statement |
| ASIL B | 80% | Branch |
| ASIL C | 90% | Branch |
| ASIL D | 90% | MC/DC |

### Test Organization
- `test/unit/<SwcName>/Test_<SwcName>.c` — Unit tests
- `test/unit/<SwcName>/stubs/` — RTE and BSW stubs
- `test/integration/Test_<Feature>.c` — Integration tests
- `test/integration/harness/` — Shared test infrastructure

### Running Tests
```bash
# All unit tests
[TEST_UNIT_CMD]

# Single SWC tests
[TEST_SINGLE_CMD]

# With coverage report
[TEST_COVERAGE_CMD]
```

## Safety Context

- **ASIL Level**: [ASIL_LEVEL]
- **Safety Goals**: See `docs/safety/safety_goals.md`
- **FMEA**: See `docs/safety/fmea.md`
- **Deviation Records**: `docs/safety/deviations/DR_<number>.md`

## Tool Configuration

### Static Analysis
- Tool: [STATIC_ANALYSIS_TOOL]
- Config: `tools/static-analysis/[CONFIG_FILE]`
- MISRA addon: `tools/static-analysis/misra_cppcheck.json`

### AUTOSAR Toolchain
- RTE Generator: [RTE_TOOL]
- BSW Configurator: [BSW_TOOL]
- ARXML Editor: [ARXML_TOOL]
```

---

## 12. Resource Dependency Map

```
                    ┌─────────────────────┐
                    │  autosar-architect   │ (existing)
                    │  System-level design │
                    └──────────┬──────────┘
                               │ architecture decisions
                    ┌──────────▼──────────┐
               ┌────┤  autosar-swc-design │ (existing)
               │    │  Component design   │
               │    └──────────┬──────────┘
               │               │ port/runnable specs
    ┌──────────▼────────┐  ┌───▼────────────────────┐
    │  arxml-generator  │  │ autosar-swc-scaffold   │
    │  ARXML authoring  │  │ Code skeleton          │
    └──────────┬────────┘  └───┬────────────────────┘
               │               │
    ┌──────────▼────────┐  ┌───▼────────────────────┐
    │  arxml-schema-    │  │ rte-contract-generator │
    │  validation hook  │  │ RTE headers + stubs    │
    └───────────────────┘  └───┬────────────────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
┌─────────▼───────┐ ┌─────────▼───────┐ ┌─────────▼───────┐
│ misra-c-advisor │ │ autosar-rte-    │ │ autosar-bsw-    │
│ MISRA guidance  │ │ engineer        │ │ configurator    │
└─────────┬───────┘ │ RTE design      │ │ BSW config      │
          │         └─────────┬───────┘ └─────────┬───────┘
          │                   │                   │
┌─────────▼───────┐          │         ┌─────────▼───────┐
│ misra-compliance│          │         │ bsw-module-     │
│ -check hook     │          │         │ configurator    │
└─────────────────┘          │         └─────────────────┘
                             │
                    ┌────────▼────────┐
                    │ linker-memory-  │
                    │ engineer        │
                    └────────┬────────┘
                             │
               ┌─────────────┼─────────────┐
               │             │             │
    ┌──────────▼──┐ ┌────────▼────┐ ┌──────▼──────────┐
    │ linker-     │ │ memory-map- │ │ embedded-test-  │
    │ script-gen  │ │ analyzer    │ │ architect       │
    └─────────────┘ └─────────────┘ └────────┬────────┘
                                             │
                                   ┌─────────▼─────────┐
                                   │ integration-test- │
                                   │ harness           │
                                   └───────────────────┘
```

---

## 13. Implementation Phasing

### Phase 1: Foundation (Sprint 1)
**Goal**: Core coding standards and proactive guidance

| # | Resource | Type | Priority |
|---|----------|------|----------|
| 1 | `misra-c-2012.instructions.md` | Instruction | 🔴 Critical |
| 2 | `autosar-coding-guidelines.instructions.md` | Instruction | 🔴 Critical |
| 3 | `misra-c-advisor.agent.md` | Agent | 🔴 Critical |
| 4 | `autosar-bsw-configurator.agent.md` | Agent | 🟡 Important |
| 5 | `arxml-authoring.instructions.md` | Instruction | 🟡 Important |

**Deliverable**: Developers get real-time MISRA and AUTOSAR coding guidance on every C file.

### Phase 2: Component Development (Sprint 2)
**Goal**: SWC creation workflow

| # | Resource | Type | Priority |
|---|----------|------|----------|
| 6 | `autosar-rte-engineer.agent.md` | Agent | 🔴 Critical |
| 7 | `autosar-swc-scaffold/` | Skill | 🔴 Critical |
| 8 | `arxml-generator/` | Skill | 🟡 Important |
| 9 | `rte-contract-generator/` | Skill | 🟡 Important |
| 10 | `memory-section-pragmas.instructions.md` | Instruction | 🟢 Recommended |

**Deliverable**: One-command SWC scaffolding with ARXML and RTE contracts.

### Phase 3: Build & Memory (Sprint 3)
**Goal**: Target build and memory management

| # | Resource | Type | Priority |
|---|----------|------|----------|
| 11 | `linker-memory-engineer.agent.md` | Agent | 🔴 Critical |
| 12 | `linker-script.instructions.md` | Instruction | 🟡 Important |
| 13 | `linker-script-generator/` | Skill | 🟡 Important |
| 14 | `memory-map-analyzer/` | Skill | 🟡 Important |
| 15 | `bsw-module-configurator/` | Skill | 🟢 Recommended |

**Deliverable**: Linker script generation and memory budget analysis.

### Phase 4: Testing & Quality (Sprint 4)
**Goal**: Comprehensive test infrastructure

| # | Resource | Type | Priority |
|---|----------|------|----------|
| 16 | `embedded-test-architect.agent.md` | Agent | 🔴 Critical |
| 17 | `embedded-test-patterns.instructions.md` | Instruction | 🟡 Important |
| 18 | `integration-test-harness/` | Skill | 🟡 Important |
| 19 | `misra-compliance-check/` | Hook | 🟡 Important |
| 20 | `arxml-schema-validation/` | Hook | 🟢 Recommended |

**Deliverable**: Automated testing with ASIL-level coverage enforcement.

### Phase 5: Orchestration (Sprint 5)
**Goal**: End-to-end workflows and bundled plugin

| # | Resource | Type | Priority |
|---|----------|------|----------|
| 21 | `autosar-swc-development.md` | Workflow | 🟡 Important |
| 22 | `safety-code-review.md` | Workflow | 🟡 Important |
| 23 | `ecu-integration-build.md` | Workflow | 🟢 Recommended |
| 24 | `autosar-development-toolkit/` | Plugin | 🔴 Critical |
| 25 | `autosar-project-template/` | Skill | 🔴 Critical |

**Deliverable**: Full plugin bundle and project template (the "ROS2 template equivalent").

---

## 14. V-Cycle Mapping (ASPICE Integration)

All new resources map to ASPICE process phases:

| ASPICE Phase | Existing Resources | New Resources |
|---|---|---|
| **SYS.2** System Req. Analysis | autosar-architect, iso26262-review, tara-analysis | — |
| **SYS.3** System Arch. Design | autosar-architect, iso26262-review | autosar-bsw-configurator |
| **SWE.1** SW Req. Analysis | autosar-swc-design, iso26262-review | misra-c-advisor |
| **SWE.2** SW Arch. Design | autosar-architect, autosar-swc-design, embedded-c-reviewer | autosar-rte-engineer, linker-memory-engineer, arxml-generator, autosar-swc-scaffold |
| **SWE.3** Detailed Design & Unit Construction | autosar-swc-design, embedded-c-reviewer, low-level-driver-design, can-dbc-parser | misra-c-advisor, rte-contract-generator, bsw-module-configurator, linker-script-generator, memory-section-pragmas instruction, misra-c-2012 instruction, autosar-coding-guidelines instruction |
| **SWE.4** Unit Verification | embedded-c-reviewer, ceedling-unit-test | embedded-test-architect, embedded-test-patterns instruction, misra-compliance-check hook |
| **SWE.5** Integration & Test | embedded-c-reviewer | integration-test-harness, memory-map-analyzer, arxml-schema-validation hook |
| **SWE.6** Qualification Test | embedded-c-reviewer, iso26262-review | safety-code-review workflow, ecu-integration-build workflow |

---

## 15. Quality Attributes

### 15.1 Consistency with Existing Resources
- All new agents follow the same front matter format as `autosar-architect.agent.md`
- All new instructions follow the same `applyTo` pattern as `freertos-development.instructions.md`
- All new skills follow the same `SKILL.md` structure as `ceedling-unit-test`
- New plugin follows `embedded-c-starter` JSON structure

### 15.2 Non-Overlapping Responsibilities

| Agent | Focus | Does NOT Cover |
|-------|-------|----------------|
| `embedded-c-reviewer` | Reactive code review | Proactive guidance |
| `misra-c-advisor` | Proactive MISRA guidance during writing | Full code review |
| `autosar-architect` | System/ECU architecture | Module-level BSW config |
| `autosar-bsw-configurator` | Individual BSW module config | System architecture |
| `autosar-swc-design` | SWC design (ports, runnables) | RTE layer internals |
| `autosar-rte-engineer` | RTE contracts, data consistency | SWC application logic |
| `linker-memory-engineer` | Linker scripts, memory layout | Application code |
| `embedded-test-architect` | Test strategy, harness design | Test framework mechanics (→ ceedling skill) |

### 15.3 Safety Traceability
Every resource that touches safety-relevant code must:
- State which ASIL levels it applies to
- Reference specific ISO 26262 clauses when applicable
- Support formal deviation documentation for any rule relaxation

---

## 16. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Resource count (automotive) | 37 total (12 existing + 25 new) | Count in marketplace |
| ASPICE phase coverage | 100% of SWE.1–SWE.6 | V-cycle mapping completeness |
| Development lifecycle coverage | Requirements → Integration | Workflow step coverage |
| MISRA-C rule coverage | Top 50 most-violated rules | Rules referenced in instructions |
| MCU family support | ≥3 families in linker templates | Template variants |
| Toolchain support | ≥3 toolchains in linker generator | Supported dialects |
| Plugin install test | Clean install + build on fresh project | CI validation |

---

## Appendix A: Comparison with ROS2 Template Resources

| ROS2 Template Resource | AUTOSAR Equivalent | Notes |
|---|---|---|
| `rules/clean_architecture.md` | `autosar-coding-guidelines.instructions.md` + `misra-c-2012.instructions.md` | AUTOSAR has formal standards (MISRA) vs architectural rules |
| `rules/ros2_nodes.md` | `autosar-swc-design` agent | SWC = Node equivalent |
| `rules/ros2_communication.md` | `autosar-rte-engineer` agent | RTE = DDS/topic equivalent |
| `rules/ros2_general.md` | `autosar-coding-guidelines.instructions.md` | Build + naming conventions |
| `rules/robot_specific.md` | `linker-memory-engineer` agent | Hardware-specific concerns |
| `rules/testing.md` | `embedded-test-patterns.instructions.md` | Test strategy |
| `skills/ros2_node_creation` | `autosar-swc-scaffold` skill | Component scaffolding |
| `skills/ros2_messaging` | `rte-contract-generator` skill | Communication layer |
| `skills/ros2_testing` | `ceedling-unit-test` skill + `integration-test-harness` skill | Testing infrastructure |
| `skills/ros2_lifecycle` | `autosar-bsw-configurator` agent (EcuM) | Lifecycle management |
| `skills/ros2_launch_config` | `bsw-module-configurator` skill (OS tasks) | System configuration |
| `skills/ros2_service_action` | `autosar-swc-design` agent (C/S interfaces) | Request/response patterns |
| `skills/ros2_transforms` | N/A (no spatial transforms in ECU) | Domain-specific to robotics |
| `skills/ros2_diagnostics` | `visual-explainer` skill (DTC catalog) + `autosar-bsw-configurator` (Dem) | Diagnostic monitoring |
| `skills/ros2_bag` | N/A (use XCP/MDF for measurement) | Data recording is tool-based |
| `commands/ros2.md` | Build commands in CLAUDE.md template | CLI reference |

---

## Appendix B: File Naming Summary

### Agents (in `agents/`)
```
agents/
├── autosar-architect.agent.md          (existing)
├── autosar-bsw-configurator.agent.md   (new)
├── autosar-rte-engineer.agent.md       (new)
├── autosar-swc-design.agent.md         (existing)
├── embedded-c-reviewer.agent.md        (existing)
├── embedded-test-architect.agent.md    (new)
├── linker-memory-engineer.agent.md     (new)
└── misra-c-advisor.agent.md            (new)
```

### Instructions (in `instructions/`)
```
instructions/
├── arxml-authoring.instructions.md         (new)
├── autosar-coding-guidelines.instructions.md (new)
├── embedded-test-patterns.instructions.md  (new)
├── freertos-development.instructions.md    (existing)
├── linker-script.instructions.md           (new)
├── memory-section-pragmas.instructions.md  (new)
└── misra-c-2012.instructions.md            (new)
```

### Skills (in `skills/`)
```
skills/
├── arxml-generator/SKILL.md                (new)
├── autosar-project-template/SKILL.md       (new)
├── autosar-swc-scaffold/SKILL.md           (new)
├── bsw-module-configurator/SKILL.md        (new)
├── can-dbc-parser/SKILL.md                 (existing)
├── ceedling-unit-test/SKILL.md             (existing)
├── cmake-build-helper/SKILL.md             (existing)
├── integration-test-harness/SKILL.md       (new)
├── iso26262-review/SKILL.md                (existing)
├── linker-script-generator/SKILL.md        (new)
├── low-level-driver-design/SKILL.md        (existing)
├── memory-map-analyzer/SKILL.md            (new)
├── rte-contract-generator/SKILL.md         (new)
├── tara-analysis/SKILL.md                  (existing)
└── visual-explainer/SKILL.md               (existing)
```

### Hooks (in `hooks/`)
```
hooks/
├── arxml-schema-validation/
│   ├── README.md
│   └── hooks.json                          (new)
└── misra-compliance-check/
    ├── README.md
    └── hooks.json                          (new)
```

### Workflows (in `workflows/`)
```
workflows/
├── autosar-swc-development.md              (new)
├── ecu-integration-build.md                (new)
└── safety-code-review.md                   (new)
```

### Plugins (in `plugins/`)
```
plugins/
├── autosar-development-toolkit/
│   ├── .github/plugin/plugin.json          (new)
│   └── README.md
└── embedded-c-starter/                     (existing)
```
