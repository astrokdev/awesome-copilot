# AUTOSAR Development Toolkit

Complete AUTOSAR Classic Platform development toolkit for GitHub Copilot. Includes agents, skills, and instructions covering the full embedded automotive development lifecycle.

## What's Included

### Agents (8)

| Agent | Description |
|-------|-------------|
| **AUTOSAR Architect** | System/ECU architecture, BSW stack, layered architecture design |
| **AUTOSAR SWC Designer** | Software Component design, port interfaces, RTE API patterns |
| **AUTOSAR BSW Configurator** | BSW module configuration (OS, COM, NvM, Dem, EcuM, BswM) |
| **AUTOSAR RTE Engineer** | RTE contract generation, data consistency, timing analysis |
| **Embedded C Reviewer** | MISRA-C:2012 code review, safety-critical defect detection |
| **MISRA-C Advisor** | Proactive MISRA compliance guidance during code authoring |
| **Linker & Memory Engineer** | Linker scripts, memory maps, MPU, map file analysis |
| **Embedded Test Architect** | Test strategy, ASIL coverage, stub/mock architecture design |

### Skills (10)

| Skill | Description |
|-------|-------------|
| **autosar-swc-scaffold** | Generate complete SWC skeleton (source, headers, ARXML, tests) |
| **arxml-generator** | Generate ARXML descriptions for SWCs, interfaces, data types |
| **rte-contract-generator** | Generate RTE contract headers and unit test stubs |
| **linker-script-generator** | Generate linker scripts for multiple toolchains |
| **bsw-module-configurator** | BSW module configuration from functional requirements |
| **memory-map-analyzer** | Analyze map files for memory utilization and budgets |
| **integration-test-harness** | Generate multi-SWC integration test environments |
| **ceedling-unit-test** | Unit testing with Ceedling, Unity, and CMock |
| **can-dbc-parser** | CAN DBC file analysis and C code generation |
| **iso26262-review** | ISO 26262 functional safety review and analysis |

## Installation

```
gh copilot plugin install autosar-development-toolkit
```

## Quick Start

1. Install the plugin
2. Ask the **AUTOSAR SWC Designer** to help design your component
3. Use **autosar-swc-scaffold** to generate the file skeleton
4. Implement with guidance from **MISRA-C Advisor**
5. Test with support from **Embedded Test Architect**

## Compatibility

- AUTOSAR Classic Platform R4.0 through R22-11
- Toolchains: GCC, IAR, Green Hills, Tasking
- MCU families: Infineon AURIX, Renesas RH850, NXP S32K, STM32
- Test frameworks: Unity/CMock, CppUTest, GoogleTest
