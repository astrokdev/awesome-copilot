---
description: 'Linker script conventions for embedded targets: memory region naming, section placement rules, alignment requirements, and startup symbol definitions.'
applyTo: '**.ld, **.ldf, **.lcf, **.icf, **.sct'
---

# Linker Script Conventions

## Memory Region Naming

### AURIX (Infineon TriCore)
- `PFLASH0`, `PFLASH1` — Program FLASH banks
- `DFLASH0` — Data FLASH (NvM storage)
- `DSPR0`, `DSPR1` — CPU-local data SRAM (per core)
- `PSPR0`, `PSPR1` — CPU-local program SRAM (per core)
- `LMU_SRAM` — Shared local memory unit

### ARM Cortex-M (STM32, S32K, etc.)
- `FLASH` — Main program FLASH
- `RAM` — Main SRAM
- `ITCM` — Instruction tightly-coupled memory
- `DTCM` — Data tightly-coupled memory
- `CCMRAM` — Core-coupled memory (STM32 specific)
- `BACKUP_SRAM` — Battery-backed SRAM

### Renesas RH850
- `LOCAL_RAM` — CPU-local RAM
- `GLOBAL_RAM` — Shared global RAM
- `RETENTION_RAM` — Data retained during standby
- `CODE_FLASH` — Code FLASH
- `DATA_FLASH` — Data FLASH for NvM

## Section Placement Rules

| Section | Content | Memory | Notes |
|---------|---------|--------|-------|
| `.isr_vector` | Interrupt vector table | FLASH start | `KEEP`, `ALIGN(256)` or `ALIGN(1024)` |
| `.text` | Code | FLASH | Includes all `*_SEC_CODE` sections |
| `.rodata` | Read-only constants | FLASH | Includes all `*_SEC_CONST_*` sections |
| `.data` | Initialized variables | RAM (load from FLASH) | Runtime in RAM, initial values in FLASH |
| `.bss` | Zero-initialized variables | RAM | Cleared by startup code |
| `.noinit` | Non-initialized variables | RAM | Survives warm reset, `NOLOAD` |
| `.stack` | Stack space | RAM | `ALIGN(8)`, at end of RAM or dedicated region |
| `.heap` | Heap space | RAM | Usually zero in AUTOSAR (no dynamic alloc) |
| `.cal_data` | Calibration parameters | Calibration FLASH | Separate FLASH region for XCP access |

## Alignment Requirements

- **Vector table**: `ALIGN(256)` minimum on Cortex-M, `ALIGN(1024)` on some devices
- **Data sections**: `ALIGN(4)` for 32-bit access
- **MPU regions**: Aligned to region size (power of 2)
- **Stack**: `ALIGN(8)` (ARM AAPCS requires 8-byte aligned stack at function entry)
- **DMA buffers**: May require `ALIGN(32)` or cache-line alignment

## KEEP Directives

Use `KEEP()` for sections that the linker might discard as unused:

```ld
KEEP(*(.isr_vector))           /* Vector table — always needed */
KEEP(*(.init))                 /* C runtime init functions */
KEEP(*(.fini))                 /* C runtime finalization */
KEEP(*(.init_array))           /* C++ constructors */
KEEP(*(.fini_array))           /* C++ destructors */
```

## Startup Symbols

Define these symbols for the startup code to reference:

```ld
__data_load  = LOADADDR(.data);    /* FLASH address of .data initial values */
__data_start = ADDR(.data);        /* RAM start of .data */
__data_end   = __data_start + SIZEOF(.data);
__bss_start  = ADDR(.bss);
__bss_end    = __bss_start + SIZEOF(.bss);
__stack_top  = ORIGIN(RAM) + LENGTH(RAM);  /* or explicit placement */
__stack_size = 0x2000;             /* define stack size */
```

## Fill Patterns

```ld
/* Fill unused FLASH with known pattern (aids debugging) */
= 0xDEADBEEF;    /* Global fill pattern */

/* Or per-section */
.text : ALIGN(4)
{
    *(.text .text.*)
    FILL(0xFF);   /* Fill gaps with 0xFF (erased FLASH state) */
} > FLASH
```

## GNU LD vs IAR ICF Comparison

### GNU LD
```ld
.data : ALIGN(4)
{
    __data_start = .;
    *(.data .data.*)
    __data_end = .;
} > RAM AT> FLASH
```

### IAR ICF
```icf
define block DATA with alignment = 4
{
    readwrite section .data
};
place in RAM_region { block DATA };
initialize by copy { section .data };
```

## Anti-Patterns

- Missing `KEEP` on vector table — linker discards it if no code references the symbols
- Stack not aligned to 8 bytes — ARM hard faults on misaligned stack access
- Forgetting `AT>` for `.data` load address — initialized data has no FLASH copy, boots with garbage
- Using `NOLOAD` on `.data` — this means "do not load initial values," making `.data` behave like `.bss`
- Overlapping memory regions — two sections placed in the same address range
- No overflow assertion — build succeeds but binary is silently corrupted when sections overflow a region
- Hard-coding addresses instead of using `ORIGIN()` and `LENGTH()` — breaks when memory map changes
