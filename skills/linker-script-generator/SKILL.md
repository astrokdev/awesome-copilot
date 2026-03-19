---
name: linker-script-generator
description: 'Use when setting up or modifying linker scripts for an embedded target — generates GCC LD, IAR ICF, or ARM scatter-load scripts with correct AUTOSAR MemMap sections and MPU-aligned regions from a memory map spec.'
---

# Linker Script Generator

This skill generates complete linker scripts from memory map specifications. It supports multiple toolchain dialects (GNU LD, IAR ICF, ARM scatter-load), includes AUTOSAR MemMap section placement, and can generate MPU-aligned regions for ASIL partitioning.

## When to Use This Skill

Use this skill when you need to:

- Create a linker script for a new MCU target
- Migrate a linker script between toolchains (e.g., GCC → IAR)
- Add AUTOSAR MemMap sections to a linker script
- Design MPU-aligned memory regions for ASIL partitioning
- Set up a calibration data region for XCP/CCP access
- Verify memory layout after adding new software components

## Input Format

Provide a memory map specification:

```yaml
target:
  mcu: STM32F446RE           # MCU part number
  architecture: ARM Cortex-M4
  toolchain: gcc              # gcc | iar | arm | ghs | tasking

memory_regions:
  - name: FLASH
    origin: 0x08000000
    length: 512K
    attributes: rx
  - name: CAL_FLASH
    origin: 0x08078000
    length: 32K
    attributes: rx            # calibration region in FLASH
  - name: RAM
    origin: 0x20000000
    length: 128K
    attributes: rwx

stack_size: 8K
heap_size: 0                  # no heap in AUTOSAR

mpu_partitioning: false       # set true for ASIL projects

autosar_memmap: true          # include AUTOSAR MemMap sections
```

## Supported Targets

| Dialect | Extension | Toolchain |
|---------|-----------|-----------|
| GNU LD | `.ld` | GCC, arm-none-eabi-gcc |
| IAR ICF | `.icf` | IAR Embedded Workbench |
| ARM scatter-load | `.sct` | ARM Compiler 6 / Keil MDK |
| Green Hills | `.ld` | GHS MULTI |
| Tasking LSL | `.lsl` | Tasking VX (AURIX) |

## MCU Presets

### Infineon AURIX TC397

```yaml
memory_regions:
  - { name: PFLASH0,  origin: 0x80000000, length: 3M,    attributes: rx }
  - { name: PFLASH1,  origin: 0x80300000, length: 3M,    attributes: rx }
  - { name: DFLASH0,  origin: 0xAF000000, length: 1M,    attributes: rw }
  - { name: DSPR0,    origin: 0x70000000, length: 240K,  attributes: rw }
  - { name: DSPR1,    origin: 0x60000000, length: 240K,  attributes: rw }
  - { name: PSPR0,    origin: 0x70100000, length: 64K,   attributes: rx }
  - { name: LMU_SRAM, origin: 0x90000000, length: 256K,  attributes: rw }
```

### NXP S32K344

```yaml
memory_regions:
  - { name: PFLASH,   origin: 0x00400000, length: 4M,    attributes: rx }
  - { name: DFLASH,   origin: 0x10000000, length: 128K,  attributes: rw }
  - { name: SRAM,     origin: 0x20400000, length: 512K,  attributes: rwx }
  - { name: ITCM,     origin: 0x00000000, length: 64K,   attributes: rx }
  - { name: DTCM,     origin: 0x20000000, length: 128K,  attributes: rw }
```

### Renesas RH850/U2A

```yaml
memory_regions:
  - { name: CODE_FLASH,    origin: 0x00000000, length: 16M,   attributes: rx }
  - { name: DATA_FLASH,    origin: 0xFF200000, length: 256K,  attributes: rw }
  - { name: LOCAL_RAM,     origin: 0xFEBF0000, length: 192K,  attributes: rw }
  - { name: GLOBAL_RAM,    origin: 0xFEDE0000, length: 512K,  attributes: rw }
  - { name: RETENTION_RAM, origin: 0xFEEE0000, length: 64K,   attributes: rw }
```

## AUTOSAR MemMap Section Mapping

| MemMap Category | Linker Section | Memory Region |
|----------------|---------------|---------------|
| `*_START_SEC_CODE` | `.text.<module>` | FLASH |
| `*_START_SEC_CODE_FAST` | `.text_fast.<module>` | ITCM/PSPR |
| `*_START_SEC_CONST_*` | `.rodata.<module>` | FLASH |
| `*_START_SEC_VAR_INIT_*` | `.data.<module>` | RAM (load from FLASH) |
| `*_START_SEC_VAR_CLEARED_*` | `.bss.<module>` | RAM |
| `*_START_SEC_VAR_NO_INIT_*` | `.noinit.<module>` | RAM (NOLOAD) |
| `*_START_SEC_VAR_POWER_ON_INIT_*` | `.power_on_init.<module>` | RAM |
| `*_START_SEC_CALIB_*` | `.cal_data.<module>` | CAL_FLASH |

## Output Example — GNU LD with AUTOSAR MemMap

```ld
ENTRY(Reset_Handler)

MEMORY
{
    FLASH     (rx)  : ORIGIN = 0x08000000, LENGTH = 480K
    CAL_FLASH (rx)  : ORIGIN = 0x08078000, LENGTH = 32K
    RAM       (rwx) : ORIGIN = 0x20000000, LENGTH = 128K
}

__stack_size = 0x2000;

SECTIONS
{
    .isr_vector : ALIGN(256) { KEEP(*(.isr_vector)) } > FLASH
    .text       : ALIGN(4)   { *(.text .text.*) } > FLASH
    .rodata     : ALIGN(4)   { *(.rodata .rodata.*) } > FLASH

    /* Calibration data — separate FLASH region for XCP */
    .cal_data   : ALIGN(4)   { *(.cal_data .cal_data.*) } > CAL_FLASH

    /* Initialized data */
    __data_load = LOADADDR(.data);
    .data : ALIGN(4) {
        __data_start = .;
        *(.data .data.*)
        __data_end = .;
    } > RAM AT> FLASH

    /* BSS */
    .bss (NOLOAD) : ALIGN(4) {
        __bss_start = .;
        *(.bss .bss.* COMMON)
        __bss_end = .;
    } > RAM

    /* No-init (survives reset) */
    .noinit (NOLOAD) : ALIGN(4) {
        *(.noinit .noinit.*)
    } > RAM

    /* Stack */
    .stack (NOLOAD) : ALIGN(8) {
        . += __stack_size;
        __stack_top = .;
    } > RAM

    ASSERT(__stack_top <= ORIGIN(RAM) + LENGTH(RAM), "ERROR: RAM overflow")
}
```

## Workflow

1. **Specify memory map** — Fill in the input YAML with MCU regions, stack size, options
2. **Generate linker script** — Skill produces the script in the target dialect
3. **Customize sections** — Add project-specific sections (calibration, DMA buffers, etc.)
4. **Build and verify** — Compile, check `.map` file output with `memory-map-analyzer` skill
5. **Iterate** — Adjust region sizes and section placement based on analysis

## Gotchas

- **Stack size is per-task, not global** — AUTOSAR OS allocates separate stacks per task. The `stack_size` in the input spec sets the main/idle stack. Each OS task's stack must be configured separately in the OS configuration, and each needs its own linker section.
- **MPU regions must be power-of-2 aligned on ARMv7-M** — if you specify an ASIL partition boundary at an arbitrary address, the MPU hardware won't enforce it correctly. The generated script aligns regions, but if you manually adjust addresses, maintain power-of-2 alignment.
- **Calibration region must be separately erasable** — place calibration data in its own flash sector so it can be reprogrammed without erasing application code. The generated script handles this for known MCU presets, but custom memory maps need manual verification.
- **IAR ICF and GCC LD handle `KEEP` differently** — in GCC LD, use `KEEP()` for interrupt vector tables and init arrays. In IAR ICF, use `do not initialize` and `place at address`. The generated scripts account for this, but mixing syntax from one dialect into another is a common mistake.
- **`.bss` must be zero-initialized by startup code** — the generated script defines `__bss_start__` and `__bss_end__` symbols, but the startup code must loop over this range and clear it. If your startup code doesn't reference these symbols, cleared variables will contain garbage.
- **Map file section names don't always match linker script names** — GCC may merge sections. Use `memory-map-analyzer` on the actual output to verify placement rather than assuming the map matches your script 1:1.
