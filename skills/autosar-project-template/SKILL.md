---
name: autosar-project-template
description: 'Use when starting a new AUTOSAR ECU project from scratch — generates a complete project skeleton with CLAUDE.md, directory structure, build config, linker scripts, and coding guidelines tailored to the target MCU and toolchain.'
---

# AUTOSAR Project Template

This skill generates a complete AUTOSAR Classic Platform project skeleton — the embedded automotive equivalent of [ros2-claude-code-template](https://github.com/harunkurtdev/ros2-claude-code-template). It produces a ready-to-develop project directory with a pre-configured CLAUDE.md that teaches AI assistants about the project's architecture, build commands, coding standards, memory layout, and testing strategy.

## When to Use This Skill

- Starting a new AUTOSAR ECU software project from scratch
- Setting up a development environment for a new target MCU
- Creating a standardized project structure for a team
- Bootstrapping a project with correct MISRA-C, safety, and AUTOSAR conventions from day one

## Input Specification

Provide a YAML specification with the following parameters:

```yaml
project:
  name: my-ecu-project            # Project name (lowercase-hyphenated)
  description: "Engine cooling controller ECU"

target:
  mcu_family: aurix-tc3xx         # aurix-tc3xx | rh850 | s32k3 | stm32
  mcu_variant: TC397XP            # Specific MCU variant
  clock_freq: 300MHz              # Core clock frequency

toolchain: gcc                    # gcc | iar | ghs | tasking

autosar:
  release: R22-11                 # R4.0 | R4.3 | R4.4 | R19-11 | R22-11
  rte_generator: rta-rte          # rta-rte | davinci | eb-tresos | arctic-core
  bsw_configurator: eb-tresos    # eb-tresos | davinci | rta-bsw | arctic-core

safety:
  asil_level: B                   # QM | A | B | C | D
  safety_goals: true              # Generate safety documentation stubs

build_system: cmake               # cmake | griddle | make

initial_swcs: []                  # Optional: SWC names to pre-scaffold
```

### MCU Family Presets

If only `mcu_family` is specified, default presets are applied:

| MCU Family | Default Variant | Clock | Flash | RAM | Toolchain |
|-----------|----------------|-------|-------|-----|-----------|
| `aurix-tc3xx` | TC397XP | 300 MHz | 16 MB PFLASH | 6 MB DSRAM | Tasking/GCC |
| `rh850` | RH850/U2A | 400 MHz | 16 MB Flash | 3.5 MB RAM | GHS/GCC |
| `s32k3` | S32K344 | 160 MHz | 4 MB Flash | 512 KB SRAM | GCC/IAR |
| `stm32` | STM32H755 | 480 MHz | 2 MB Flash | 1 MB RAM | GCC/IAR |

## Generated Project Structure

```
<project-name>/
├── CLAUDE.md                               # AI assistant project guide (see below)
├── .github/
│   └── copilot-instructions.md             # GitHub Copilot review instructions
├── src/
│   ├── app/                                # Application SWCs
│   │   └── .gitkeep
│   ├── bsw/                                # BSW module configurations
│   │   ├── os/
│   │   │   └── Os_Cfg.h
│   │   ├── com/
│   │   │   └── Com_Cfg.h
│   │   ├── nvm/
│   │   │   └── NvM_Cfg.h
│   │   ├── dem/
│   │   │   └── Dem_Cfg.h
│   │   └── ecum/
│   │       └── EcuM_Cfg.h
│   ├── rte/                                # Generated RTE (do not edit)
│   │   └── .gitkeep
│   ├── mcal/                               # MCAL stubs and configurations
│   │   └── .gitkeep
│   └── integration/                        # Integration callouts
│       └── .gitkeep
├── include/
│   ├── Std_Types.h                         # AUTOSAR standard types
│   ├── Compiler.h                          # Compiler abstraction
│   ├── Platform_Types.h                    # Platform type definitions
│   └── MemMap.h                            # Memory section mapping
├── config/
│   ├── arxml/                              # System ARXML descriptions
│   │   ├── system.arxml
│   │   └── datatypes.arxml
│   └── bsw/                                # BSW parameter definition files
│       └── .gitkeep
├── build/
│   ├── CMakeLists.txt                      # Top-level CMake (or Griddlefile)
│   ├── toolchains/
│   │   └── <toolchain>.cmake               # Cross-compilation toolchain file
│   └── targets/
│       └── <mcu>.cmake                     # MCU-specific CMake config
├── linker/
│   ├── memory_map.ld                       # Main linker script
│   └── sections.ld                         # AUTOSAR MemMap section definitions
├── test/
│   ├── unit/                               # Unit tests per SWC
│   │   └── .gitkeep
│   ├── integration/                        # Integration test harnesses
│   │   ├── harness/
│   │   │   └── .gitkeep
│   │   └── .gitkeep
│   └── framework/
│       └── project.yml                     # Ceedling configuration
├── tools/
│   ├── static-analysis/
│   │   └── misra_cppcheck.json             # MISRA-C:2012 cppcheck addon config
│   └── scripts/
│       ├── build.sh                        # Build helper script
│       ├── run_tests.sh                    # Test runner script
│       └── check_misra.sh                  # MISRA compliance checker
└── docs/
    ├── architecture/
    │   └── system_architecture.md          # Architecture overview
    └── safety/
        ├── safety_goals.md                 # Safety goal definitions (if ASIL > QM)
        ├── fmea.md                         # Failure mode analysis template
        └── deviations/
            └── DR_TEMPLATE.md              # MISRA deviation record template
```

## Generated CLAUDE.md Template

This is the core deliverable — the CLAUDE.md that lives in the generated project root and teaches AI assistants everything about the project.

````markdown
# CLAUDE.md — AUTOSAR Classic Platform Project

## Project Overview
This is an AUTOSAR Classic Platform ECU project.
- **Project**: {{PROJECT_NAME}} — {{PROJECT_DESCRIPTION}}
- **Target MCU**: {{MCU_VARIANT}} ({{MCU_FAMILY}}) @ {{CLOCK_FREQ}}
- **Toolchain**: {{TOOLCHAIN}}
- **AUTOSAR Release**: {{AUTOSAR_RELEASE}}
- **Safety Level**: {{ASIL_LEVEL}}
- **Build System**: {{BUILD_SYSTEM}}

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
│             {{MCU_VARIANT}} @ {{CLOCK_FREQ}}         │
└─────────────────────────────────────────────────────┘
```

### Directory Structure
- `src/app/<SwcName>/` — Application SWCs (one folder per component)
- `src/bsw/` — BSW module configurations
- `src/rte/` — Generated RTE layer (**do not edit manually** — regenerate from ARXML)
- `src/mcal/` — MCAL driver configurations
- `config/arxml/` — System-level ARXML descriptions
- `linker/` — Linker scripts and memory maps
- `test/unit/<SwcName>/` — Unit tests per SWC
- `test/integration/` — Integration test harnesses

## Build Commands

```bash
# Configure (first time or after CMake changes)
{{BUILD_CONFIGURE_CMD}}

# Build all targets (cross-compile for target MCU)
{{BUILD_CMD}}

# Build specific SWC only
{{BUILD_SWC_CMD}}

# Run all unit tests (host build)
{{TEST_UNIT_CMD}}

# Run single SWC unit tests
{{TEST_SINGLE_CMD}}

# Run integration tests
{{TEST_INTEGRATION_CMD}}

# Run MISRA-C:2012 static analysis
{{MISRA_CHECK_CMD}}

# Analyze memory from map file
{{MAP_ANALYSIS_CMD}}

# Generate RTE from ARXML (requires AUTOSAR toolchain)
{{RTE_GEN_CMD}}

# Full CI pipeline: build + test + MISRA + memory check
{{CI_CMD}}
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
8. Run MISRA check and unit tests before committing

### Modifying an Existing SWC
1. Update ARXML if port interfaces change
2. Regenerate RTE contracts if ports changed
3. Update implementation
4. Update/add unit tests for changed behavior
5. Run MISRA check
6. Run unit tests and verify coverage meets ASIL target

## Coding Standards

### MISRA-C:2012 Compliance
- **All code must be MISRA-C:2012 compliant** at this project's {{ASIL_LEVEL}} level
- Mandatory rules: **zero violations** (no deviations permitted)
- Required rules: deviations need a formal Deviation Record in `docs/safety/deviations/`
- Advisory rules: review and accept or fix
- Run `{{MISRA_CHECK_CMD}}` before every commit

### AUTOSAR Naming Conventions
- **Public functions**: `<SwcName>_<FunctionName>()`
- **Internal functions**: `<SwcName>_Internal_<FunctionName>()`
- **Configuration macros**: `<SWCNAME>_CFG_<PARAMETER>`
- **Type definitions**: `<SwcName>_<TypeName>Type`
- **File naming**: `<SwcName>.c`, `<SwcName>.h`, `<SwcName>_Internal.h`, `<SwcName>_Cfg.h`

### AUTOSAR Type System
- Use `Std_Types.h` types: `uint8`, `uint16`, `uint32`, `sint8`, `sint16`, `sint32`, `float32`, `float64`
- All API functions return `Std_ReturnType` (`E_OK` / `E_NOT_OK`)
- Boolean type: `boolean` (`TRUE` / `FALSE`)
- Null pointer: `NULL_PTR`

### Critical Rules (Safety-Relevant)
- **No dynamic memory allocation** after initialization (`malloc`/`free` forbidden)
- **No recursion** (direct or indirect)
- **No variable-length arrays**
- **All variables initialized** before first use
- **All function return values checked** or explicitly cast to `(void)`
- **All pointer parameters validated** before dereference
- **All array accesses within bounds**
- **Shared data protected** by exclusive areas or OS resources

### Memory Sections (MemMap)
Every function and variable must be placed in the correct AUTOSAR memory section:
```c
#define SWCNAME_START_SEC_CODE
#include "MemMap.h"

/* Function implementations here */

#define SWCNAME_STOP_SEC_CODE
#include "MemMap.h"
```

Section categories:
- `*_SEC_CODE` — executable code → placed in FLASH
- `*_SEC_CONST_*` — constants → placed in FLASH
- `*_SEC_VAR_INIT_*` — initialized variables → RAM (copied from FLASH at startup)
- `*_SEC_VAR_CLEARED_*` — zero-initialized variables → RAM (zeroed at startup)
- `*_SEC_VAR_NO_INIT_*` — uninitialized variables → RAM (not touched at startup)
- `*_SEC_CALIB_*` — calibration parameters → calibration FLASH region

## Memory Map

```
{{MEMORY_MAP_ASCII}}
```

### Memory Budget
| Region | Total Size | Budget Limit | Action if Exceeded |
|--------|-----------|-------------|-------------------|
| PFLASH | {{PFLASH_SIZE}} | 80% | Mandatory optimization review |
| DSRAM | {{DSRAM_SIZE}} | 70% | Mandatory optimization review |
| Stack (per task) | Per-task config | Individual limit | Increase or optimize |

## Testing Strategy

### Coverage Requirements (ISO 26262 Part 6)
| ASIL Level | Minimum Coverage | Coverage Type |
|-----------|-----------------|---------------|
| QM | 60% | Statement |
| ASIL A | 80% | Statement |
| ASIL B | 80% | Branch |
| ASIL C | 90% | Branch + MC/DC |
| ASIL D | 90% | MC/DC |

**This project requires: {{COVERAGE_TYPE}} coverage at {{COVERAGE_MIN}}% minimum.**

### Test Organization
- `test/unit/<SwcName>/Test_<SwcName>.c` — Unit tests (Unity framework)
- `test/unit/<SwcName>/stubs/Stub_Rte_<SwcName>.h` — RTE stubs
- `test/unit/<SwcName>/stubs/Stub_Rte_<SwcName>.c` — RTE stub implementations
- `test/integration/Test_<Feature>.c` — Integration tests
- `test/integration/harness/` — Shared test infrastructure

### Test Patterns
- Use `TEST_ASSERT_EQUAL_UINT8()` and typed assertions (not generic `TEST_ASSERT_EQUAL`)
- Stub all RTE and BSW dependencies — tests must be isolated
- Test boundary values, error paths, and nominal operation
- Every DET check must have a corresponding negative test

```bash
# All unit tests
{{TEST_UNIT_CMD}}

# Single SWC
{{TEST_SINGLE_CMD}}

# With coverage
{{TEST_COVERAGE_CMD}}
```

## Safety Context

- **ASIL Level**: {{ASIL_LEVEL}}
- **Safety Goals**: `docs/safety/safety_goals.md`
- **FMEA**: `docs/safety/fmea.md`
- **Deviation Records**: `docs/safety/deviations/DR_<number>.md`
- **Review records**: Follow `safety-code-review` workflow for all ASIL B+ changes

## Tool Configuration

### Static Analysis
- Tool: cppcheck with MISRA-C:2012 addon
- Config: `tools/static-analysis/misra_cppcheck.json`
- Run: `{{MISRA_CHECK_CMD}}`

### AUTOSAR Toolchain
- RTE Generator: {{RTE_TOOL}}
- BSW Configurator: {{BSW_TOOL}}
- ARXML Schema: AUTOSAR_{{AUTOSAR_RELEASE}}_STRICT.xsd

### Test Framework
- Unit test: Unity + CMock (via Ceedling)
- Config: `test/framework/project.yml`
- Integration: Custom harness in `test/integration/harness/`
````

## Build System Templates

### CMake (default)

**Top-level `CMakeLists.txt`**:
```cmake
cmake_minimum_required(VERSION 3.20)
project({{PROJECT_NAME}} LANGUAGES C ASM)

# Toolchain is set via -DCMAKE_TOOLCHAIN_FILE=build/toolchains/<toolchain>.cmake

set(CMAKE_C_STANDARD 99)
set(CMAKE_C_STANDARD_REQUIRED ON)

# AUTOSAR release define
add_compile_definitions(AUTOSAR_{{AUTOSAR_RELEASE_DEFINE}})

# MISRA-enforced warnings
add_compile_options(-Wall -Wextra -Werror -pedantic -Wmissing-prototypes -Wstrict-prototypes)

# MCU-specific flags (set by target cmake)
include(build/targets/{{MCU_TARGET}}.cmake)

# Source directories
add_subdirectory(src)

# Test target (host build only)
if(CMAKE_CROSSCOMPILING)
    message(STATUS "Cross-compiling for {{MCU_VARIANT}} — tests disabled")
else()
    enable_testing()
    add_subdirectory(test)
endif()
```

**Toolchain file** (`build/toolchains/gcc-arm.cmake`):
```cmake
set(CMAKE_SYSTEM_NAME Generic)
set(CMAKE_SYSTEM_PROCESSOR arm)
set(CMAKE_C_COMPILER arm-none-eabi-gcc)
set(CMAKE_ASM_COMPILER arm-none-eabi-gcc)
set(CMAKE_OBJCOPY arm-none-eabi-objcopy)
set(CMAKE_SIZE arm-none-eabi-size)
set(CMAKE_C_FLAGS_INIT "-mcpu=cortex-m7 -mthumb -mfpu=fpv5-d16 -mfloat-abi=hard")
set(CMAKE_EXE_LINKER_FLAGS_INIT "-T ${CMAKE_SOURCE_DIR}/linker/memory_map.ld -Wl,--gc-sections -Wl,-Map=output.map")
```

### Griddle

**`Griddlefile`**:
```ruby
project "{{PROJECT_NAME}}" do
  target :release do
    toolchain "{{TOOLCHAIN}}"
    mcu "{{MCU_VARIANT}}"
    optimization "-O2"
    linker_script "linker/memory_map.ld"
    sources "src/**/*.c"
    includes "include", "src", "config"
    defines "AUTOSAR_{{AUTOSAR_RELEASE_DEFINE}}"
  end

  target :debug do
    inherit :release
    optimization "-O0"
    debug_symbols true
    defines "AUTOSAR_{{AUTOSAR_RELEASE_DEFINE}}", "DET_ENABLED"
  end

  target :test do
    toolchain "host-gcc"
    sources "src/app/**/*.c", "test/**/*.c"
    includes "include", "src", "test/framework"
    defines "UNIT_TEST", "DET_ENABLED"
  end
end
```

## MCU-Specific Memory Maps

### Infineon AURIX TC3xx
```
┌──────────────────────────────────────┐  0xA000_0000
│            PFLASH0 (4 MB)            │  Code + Constants
├──────────────────────────────────────┤  0xA040_0000
│            PFLASH1 (4 MB)            │  Code + Calibration
├──────────────────────────────────────┤  0xA080_0000
│            PFLASH2-5 (8 MB)          │  Reserved / Data
├──────────────────────────────────────┤
│                  ...                 │
├──────────────────────────────────────┤  0x7000_0000
│            DSRAM0 (240 KB)           │  CPU0 local RAM
├──────────────────────────────────────┤  0x7010_0000
│            DSRAM1 (240 KB)           │  CPU1 local RAM
├──────────────────────────────────────┤  0x7020_0000
│            DSRAM2 (96 KB)            │  CPU2 local RAM
├──────────────────────────────────────┤  0x7030_0000
│            LMU_SRAM (512 KB)         │  Global shared RAM
└──────────────────────────────────────┘
```

### NXP S32K3xx
```
┌──────────────────────────────────────┐  0x0040_0000
│            PFLASH (4 MB)             │  Code + Constants
├──────────────────────────────────────┤  0x2000_0000
│            SRAM (512 KB)             │  Data + Stack + Heap
├──────────────────────────────────────┤  0x2040_0000
│            DFLASH (128 KB)           │  NvM / Calibration
└──────────────────────────────────────┘
```

### Renesas RH850/U2A
```
┌──────────────────────────────────────┐  0x0000_0000
│        Code Flash (16 MB)            │  Code + Constants
├──────────────────────────────────────┤  0xFEBE_0000
│        Local RAM (3.5 MB)            │  Data + Stack
├──────────────────────────────────────┤  0xFF20_0000
│        Data Flash (128 KB)           │  NvM storage
├──────────────────────────────────────┤  0xFF32_0000
│        Retention RAM (64 KB)         │  Persistent data
└──────────────────────────────────────┘
```

### STM32H7xx
```
┌──────────────────────────────────────┐  0x0800_0000
│          Flash Bank 1 (1 MB)         │  Code + Constants
├──────────────────────────────────────┤  0x0810_0000
│          Flash Bank 2 (1 MB)         │  Calibration / OTA
├──────────────────────────────────────┤  0x2000_0000
│          DTCM (128 KB)               │  Fast data / Stack
├──────────────────────────────────────┤  0x2400_0000
│          AXI SRAM (512 KB)           │  Main data RAM
├──────────────────────────────────────┤  0x3000_0000
│          SRAM1-4 (288 KB)            │  DMA buffers
└──────────────────────────────────────┘
```

## Build Command Templates

Commands are generated based on the build system selection:

### CMake
```yaml
BUILD_CONFIGURE_CMD: "cmake -B build/out -DCMAKE_TOOLCHAIN_FILE=build/toolchains/{{TOOLCHAIN}}.cmake --preset release-target"
BUILD_CMD: "cmake --build build/out --parallel"
BUILD_SWC_CMD: "cmake --build build/out --target <SwcName>"
TEST_UNIT_CMD: "cmake -B build/test && cmake --build build/test && ctest --test-dir build/test --output-on-failure"
TEST_SINGLE_CMD: "ctest --test-dir build/test -R <SwcName> --output-on-failure"
TEST_INTEGRATION_CMD: "ctest --test-dir build/test -L integration --output-on-failure"
TEST_COVERAGE_CMD: "cmake -B build/test -DCOVERAGE=ON && cmake --build build/test && ctest --test-dir build/test && gcovr build/test --html coverage.html"
MISRA_CHECK_CMD: "cppcheck --addon=misra --suppress-xml=tools/static-analysis/suppressions.xml src/"
MAP_ANALYSIS_CMD: "python3 tools/scripts/analyze_map.py build/out/output.map"
RTE_GEN_CMD: "# Run AUTOSAR toolchain RTE generator on config/arxml/system.arxml"
CI_CMD: "bash tools/scripts/build.sh && bash tools/scripts/run_tests.sh && bash tools/scripts/check_misra.sh"
```

### Griddle
```yaml
BUILD_CONFIGURE_CMD: "# No separate configure step needed"
BUILD_CMD: "griddle build --target release"
BUILD_SWC_CMD: "griddle build --target release --module <SwcName>"
TEST_UNIT_CMD: "griddle build --target test && griddle test"
TEST_SINGLE_CMD: "griddle test --filter <SwcName>"
TEST_INTEGRATION_CMD: "griddle test --filter integration"
TEST_COVERAGE_CMD: "griddle test --coverage && gcovr build/test --html coverage.html"
MISRA_CHECK_CMD: "cppcheck --addon=misra --suppress-xml=tools/static-analysis/suppressions.xml src/"
MAP_ANALYSIS_CMD: "python3 tools/scripts/analyze_map.py build/release/output.map"
RTE_GEN_CMD: "# Run AUTOSAR toolchain RTE generator on config/arxml/system.arxml"
CI_CMD: "griddle build --target release && griddle test --coverage && bash tools/scripts/check_misra.sh"
```

## Coverage and Safety Mapping

Coverage requirements are set based on the ASIL level in the input specification:

| ASIL Level | Coverage Type | Minimum % | CLAUDE.md Values |
|-----------|--------------|-----------|-----------------|
| QM | Statement | 60% | `COVERAGE_TYPE=Statement`, `COVERAGE_MIN=60` |
| A | Statement | 80% | `COVERAGE_TYPE=Statement`, `COVERAGE_MIN=80` |
| B | Branch | 80% | `COVERAGE_TYPE=Branch`, `COVERAGE_MIN=80` |
| C | Branch + MC/DC | 90% | `COVERAGE_TYPE=Branch + MC/DC`, `COVERAGE_MIN=90` |
| D | MC/DC | 90% | `COVERAGE_TYPE=MC/DC`, `COVERAGE_MIN=90` |

## Step-by-Step Usage

### 1. Invoke the Skill
```
Generate an AUTOSAR project template for an engine cooling controller
targeting AURIX TC397 with GCC toolchain, AUTOSAR R22-11, ASIL B, using CMake.
```

### 2. Review the Generated Structure
The skill generates all directories and files listed in the project structure above. Review the CLAUDE.md and adjust project-specific parameters.

### 3. Start Development
```
# Navigate to the new project
cd my-ecu-project

# First SWC — use the SWC development workflow
# Ask the autosar-swc-design agent to design your first component
# Then use autosar-swc-scaffold to generate the skeleton
```

### 4. Verify Setup
```bash
# Build should succeed (empty project, no SWC code yet)
cmake -B build/out -DCMAKE_TOOLCHAIN_FILE=build/toolchains/gcc-arm.cmake
cmake --build build/out

# MISRA check on generated stubs
cppcheck --addon=misra src/

# Test framework setup
ceedling test:all   # Should pass with zero tests
```

## ASPICE V-Cycle Mapping

This template supports the ASPICE development process:

| V-Cycle Phase | Template Resource |
|--------------|-------------------|
| SWE.1 — Requirements | `docs/architecture/`, safety goals |
| SWE.2 — Architecture | CLAUDE.md architecture section, ARXML system description |
| SWE.3 — Detailed Design | SWC scaffold, port interfaces, ARXML |
| SWE.4 — Unit Testing | `test/unit/`, Ceedling config, coverage requirements |
| SWE.5 — Integration Testing | `test/integration/`, harness framework |
| SWE.6 — Qualification Testing | CI pipeline, MISRA checks, memory analysis |

## Related Resources

- **autosar-swc-scaffold** — Generate individual SWC skeletons within this project
- **arxml-generator** — Generate ARXML descriptions for SWCs and interfaces
- **rte-contract-generator** — Generate RTE contract headers and test stubs
- **linker-script-generator** — Generate MCU-specific linker scripts
- **bsw-module-configurator** — Configure BSW modules from requirements
- **autosar-swc-development** workflow — End-to-end SWC development process
- **safety-code-review** workflow — ISO 26262 compliant review process
- **ecu-integration-build** workflow — Multi-SWC integration and build verification

## Gotchas

- **The generated `src/rte/` directory must not be hand-edited** — this is a placeholder for RTE-generated code. Once you set up the AUTOSAR toolchain, RTE generation will overwrite everything in this directory. Keep your code in `src/app/`.
- **`MemMap.h` is a stub** — the generated `MemMap.h` uses `#pragma` directives for GCC by default. You must replace the pragma mappings with your toolchain's specific section attributes (IAR `#pragma location`, Tasking `#pragma section`, GHS `#pragma ghs section`).
- **CMake cross-compilation requires the actual toolchain installed** — the generated toolchain file references `arm-none-eabi-gcc` or similar. If the toolchain isn't in your PATH, cmake configure will fail silently or with a cryptic error. Verify toolchain installation first.
- **Ceedling project.yml needs Unity/CMock paths** — the generated test framework config assumes Unity and CMock are installed via Ceedling gems. If you use a vendored copy, update the `:paths:` section in `project.yml`.
- **Safety documentation stubs are templates, not compliance artifacts** — the generated `safety_goals.md` and `fmea.md` are starting points. ISO 26262 requires these to be authored by qualified safety engineers and reviewed per your organization's safety plan.
- **AUTOSAR release define must match your BSW vendor** — the generated `AUTOSAR_R22_11` define must match what your BSW vendor (EB tresos, Vector DaVinci, etc.) expects. A mismatch causes subtle API incompatibilities that surface at link time.
