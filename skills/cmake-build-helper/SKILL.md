---
name: cmake-build-helper
description: Assists with CMake build system configuration for embedded and cross-compilation projects, including toolchain files, target definitions, linker scripts, and common embedded build patterns.
---

# CMake Build Helper

This skill helps you configure, debug, and optimize CMake build systems for embedded and cross-compilation projects.

## When to Use This Skill

Use this skill when you need to:

- Set up a CMake project for cross-compilation (ARM Cortex-M, RISC-V, etc.)
- Write or debug toolchain files for bare-metal or RTOS targets
- Configure linker scripts, memory regions, and output formats (`.hex`, `.bin`, `.elf`)
- Add static analysis, code coverage, or unit test targets to an existing build
- Integrate third-party libraries (CMSIS, FreeRTOS, vendor HALs) as CMake targets
- Troubleshoot CMake cache, generator expressions, or target property issues

## Prerequisites

- CMake 3.21 or later (for full `target_*` command support and presets)
- A cross-compilation toolchain (e.g., `arm-none-eabi-gcc`) available on `PATH` or specified via `CMAKE_TOOLCHAIN_FILE`

## Core Capabilities

### 1. Toolchain File Setup

Generate a cross-compilation toolchain file that sets the compiler, linker, and system root for your target:

```cmake
# toolchains/arm-none-eabi.cmake
set(CMAKE_SYSTEM_NAME Generic)
set(CMAKE_SYSTEM_PROCESSOR ARM)

set(CMAKE_C_COMPILER arm-none-eabi-gcc)
set(CMAKE_CXX_COMPILER arm-none-eabi-g++)
set(CMAKE_ASM_COMPILER arm-none-eabi-gcc)
set(CMAKE_OBJCOPY arm-none-eabi-objcopy)
set(CMAKE_SIZE arm-none-eabi-size)

set(CMAKE_TRY_COMPILE_TARGET_TYPE STATIC_LIBRARY)
```

### 2. Bare-Metal Executable Target

Define a firmware target with the appropriate compile flags and linker script:

```cmake
add_executable(firmware
    src/main.c
    src/startup.s
)

target_compile_options(firmware PRIVATE
    -mcpu=cortex-m4
    -mfpu=fpv4-sp-d16
    -mfloat-abi=hard
    -mthumb
    -Os
    -ffunction-sections
    -fdata-sections
    -Wall
    -Wextra
)

target_link_options(firmware PRIVATE
    -T${CMAKE_SOURCE_DIR}/linker/stm32f4.ld
    -Wl,--gc-sections
    -Wl,-Map=${CMAKE_BINARY_DIR}/firmware.map
    --specs=nano.specs
)
```

### 3. Post-Build Output Generation

Generate `.hex` and `.bin` files automatically after every build:

```cmake
add_custom_command(TARGET firmware POST_BUILD
    COMMAND ${CMAKE_OBJCOPY} -O ihex $<TARGET_FILE:firmware> firmware.hex
    COMMAND ${CMAKE_OBJCOPY} -O binary $<TARGET_FILE:firmware> firmware.bin
    COMMAND ${CMAKE_SIZE} $<TARGET_FILE:firmware>
    COMMENT "Generating firmware.hex and firmware.bin"
)
```

### 4. CMake Presets

Use `CMakePresets.json` to define reusable configurations for debug, release, and test builds without repeating `-D` flags:

```json
{
  "version": 3,
  "configurePresets": [
    {
      "name": "debug-arm",
      "displayName": "Debug (ARM Cortex-M4)",
      "generator": "Ninja",
      "binaryDir": "${sourceDir}/build/debug",
      "toolchainFile": "${sourceDir}/toolchains/arm-none-eabi.cmake",
      "cacheVariables": {
        "CMAKE_BUILD_TYPE": "Debug"
      }
    }
  ]
}
```

## Guidelines

1. **Use `target_*` commands** — never `include_directories()`, `add_definitions()`, or `link_libraries()` at directory scope; these pollute all targets
2. **Separate compile and link flags** — `target_compile_options()` for compiler flags, `target_link_options()` for linker flags
3. **Use `PRIVATE` by default** — only use `PUBLIC` or `INTERFACE` when a dependency must propagate to consumers
4. **Version your minimum CMake requirement** — always declare `cmake_minimum_required(VERSION 3.21)` at the top of your root `CMakeLists.txt`

## Common Patterns

### Pattern: Interface library for compiler flags

Share compile options across multiple targets without creating a real library:

```cmake
add_library(embedded_flags INTERFACE)
target_compile_options(embedded_flags INTERFACE
    -mcpu=cortex-m4 -mthumb -mfloat-abi=hard
)
target_link_options(embedded_flags INTERFACE
    --specs=nano.specs -Wl,--gc-sections
)

target_link_libraries(firmware PRIVATE embedded_flags)
target_link_libraries(tests PRIVATE embedded_flags)
```

### Pattern: Conditional host/target build

Build unit tests natively while building firmware for the target:

```cmake
if(CMAKE_CROSSCOMPILING)
    add_subdirectory(src)
else()
    add_subdirectory(tests)
endif()
```

## Limitations

- Vendor-specific IDE project generation (e.g., STM32CubeIDE, MPLAB X) may require additional CMake generators or plugins
- Some legacy vendor SDKs provide only Makefile-based builds — wrapping them as `ExternalProject` may be necessary
- FPU flags must match between compiler and linker to avoid ABI mismatches; always set both in the same interface target
