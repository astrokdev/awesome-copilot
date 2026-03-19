---
name: autosar-swc-development
description: 'End-to-end workflow for developing a new AUTOSAR Software Component, from requirements through integration testing.'
---

# AUTOSAR SWC Development Workflow

End-to-end workflow for developing a new AUTOSAR Software Component, from requirements through integration testing.

## Trigger

Use this workflow when developing a new SWC from functional requirements, or when adding significant new functionality to an existing SWC.

## Steps

### Step 1: Requirements Analysis

**Agents**: `autosar-architect`, `iso26262-review` (if ASIL B+)

- Identify functional requirements for the SWC
- Determine ASIL level and safety requirements
- Identify input/output signals and BSW service dependencies
- Determine which OS task(s) will host the SWC runnables
- **Output**: SWC specification (name, type, ports, runnables, ASIL, timing)

**Decision**: If ASIL B or higher → run `iso26262-review` skill for safety concept review before proceeding.

### Step 2: Component Design

**Agent**: `autosar-swc-design`

- Select SWC type (Application, SensorActuator, CDD, ServiceProxy)
- Design port interfaces (S/R, C/S, Mode, Parameter)
- Design runnables with activation triggers and periods
- Define data consistency requirements (implicit/explicit, exclusive areas)
- Define inter-runnable variables if needed
- **Output**: Complete port/runnable specification in YAML format

### Step 3: Scaffold Generation

**Skill**: `autosar-swc-scaffold`

- Generate all boilerplate files from the specification:
  - `<SwcName>.c`, `<SwcName>.h`, `<SwcName>_Internal.h`, `<SwcName>_Cfg.h`
  - `Test_<SwcName>.c`, `Stub_Rte_<SwcName>.h/.c`
- Verify generated files compile
- **Output**: Complete file skeleton in `src/app/<SwcName>/` and `test/unit/<SwcName>/`

### Step 4: ARXML Description

**Skill**: `arxml-generator`
**Hook**: `arxml-schema-validation`

- Generate SWC description ARXML from the port/runnable specification
- Generate port interface ARXML for any new interfaces
- Generate data type ARXML for any new types
- Validate against AUTOSAR schema
- **Output**: Valid ARXML files in `config/arxml/`

### Step 5: RTE Contract Generation

**Agent**: `autosar-rte-engineer`
**Skill**: `rte-contract-generator`

- Generate `Rte_<SwcName>.h` contract header
- Generate matching test stubs
- Verify data access modes are correct (implicit vs explicit)
- Review exclusive area necessity
- **Output**: RTE contract header and test stubs

### Step 6: Implementation

**Agent**: `misra-c-advisor`
**Instructions**: `misra-c-2012`, `autosar-coding-guidelines`, `memory-section-pragmas` (auto-applied)

- Implement runnable bodies in `<SwcName>.c`
- Follow MISRA-C:2012 patterns throughout
- Apply AUTOSAR MemMap sections
- Add DET checks for development error detection
- Document any MISRA deviations
- **Output**: Compilable SWC implementation

### Step 7: Unit Testing

**Agent**: `embedded-test-architect`
**Skill**: `ceedling-unit-test`
**Instruction**: `embedded-test-patterns` (auto-applied)

- Implement test cases for all runnables
- Cover boundary values, error paths, and nominal operation
- Achieve coverage target per ASIL level:
  - QM: 60% statement | ASIL A: 80% statement | ASIL B: 80% branch | ASIL C/D: 90% MC/DC
- **Output**: Passing unit tests with required coverage

### Step 8: Integration

**Agents**: `autosar-bsw-configurator`, `linker-memory-engineer`
**Skills**: `integration-test-harness`, `memory-map-analyzer`

- Add SWC to composition ARXML
- Configure BSW modules for new signals (COM, NvM, Dem as needed)
- Update linker script if new memory sections are needed
- Run integration tests
- Verify memory budget compliance
- **Output**: Integrated SWC passing integration tests within memory budget

## Acceptance Criteria

- [ ] All unit tests pass with required coverage
- [ ] MISRA-C:2012 compliance (zero mandatory violations, deviations documented)
- [ ] ARXML validates against AUTOSAR schema
- [ ] Memory utilization within budget (FLASH < 80%, RAM < 70%)
- [ ] Integration tests pass
- [ ] Code review completed (safety review if ASIL B+)
