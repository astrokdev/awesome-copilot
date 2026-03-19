---
name: memory-map-analyzer
description: 'Use when you have a linker map file (.map) and need to check memory utilization, budget compliance, section sizes, stack usage, or find optimization opportunities.'
---

# Memory Map Analyzer

This skill analyzes linker map files (`.map`) from embedded toolchains to provide memory utilization reports, detect potential issues, check budget compliance, and recommend optimizations.

## When to Use This Skill

Use this skill when you need to:

- Check memory utilization after a build (FLASH %, RAM %)
- Verify that memory usage stays within budget limits
- Find the largest functions or data objects (optimization targets)
- Detect alignment waste or unexpected section growth
- Estimate stack usage per OS task
- Prepare a memory utilization report for a release milestone

## Supported Map File Formats

| Toolchain | Map File | Key Sections |
|-----------|----------|-------------|
| GCC (arm-none-eabi) | `*.map` | `Memory Configuration`, `Linker script and memory map` |
| IAR | `*.map` | `MODULE SUMMARY`, `ENTRY LIST` |
| Green Hills | `*.map` | `Section summary`, `Symbol table` |
| Tasking (AURIX) | `*.map` | `Memory usage`, `Section/symbol cross reference` |

## Analysis Capabilities

### 1. Section Size Summary

Extract sizes for each section and region:

```
Memory Utilization Report
========================
Region      Used       Total      Usage    Status
--------    --------   --------   ------   ------
FLASH       387.2 KB   512.0 KB   75.6%   OK
RAM          89.4 KB   128.0 KB   69.8%   OK
CAL_FLASH     4.1 KB    32.0 KB   12.8%   OK

Section Breakdown (FLASH):
  .text       312.8 KB   (80.8% of FLASH used)
  .rodata      72.1 KB   (18.6%)
  .data init    2.3 KB   ( 0.6%)  ← initial values for .data

Section Breakdown (RAM):
  .data         2.3 KB   ( 2.6% of RAM used)
  .bss         71.1 KB   (79.5%)
  .stack        8.0 KB   ( 9.0%)
  .noinit       8.0 KB   ( 9.0%)
```

### 2. Budget Compliance

Define budgets and check compliance:

```yaml
# memory_budget.yaml
budgets:
  FLASH:
    limit_percent: 80       # max 80% usage
    limit_bytes: 409600     # or absolute limit (400 KB)
  RAM:
    limit_percent: 70
  stack_per_task:
    Task_10ms: 2048
    Task_100ms: 4096
    Task_Background: 2048
```

Output:
```
Budget Compliance
=================
FLASH:  387.2 KB / 409.6 KB (80% budget) → PASS (94.5% of budget)
RAM:     89.4 KB /  89.6 KB (70% budget) → WARNING (99.8% of budget)
Stack Task_10ms:  1.2 KB /  2.0 KB       → PASS
Stack Task_100ms: 3.9 KB /  4.0 KB       → WARNING (97.5% of budget)
```

### 3. Largest Symbols

Find optimization targets:

```
Top 10 Largest Functions (by .text contribution):
  1.  Com_MainFunctionRx         4,128 bytes   src/bsw/com/Com.c
  2.  Dcm_ProcessService         3,856 bytes   src/bsw/dcm/Dcm.c
  3.  NvM_MainFunction           2,944 bytes   src/bsw/nvm/NvM.c
  ...

Top 10 Largest Data Objects (by .bss/.data contribution):
  1.  Dem_PrimaryMemory_Ram     32,768 bytes   (.bss)
  2.  Com_SignalBuffer          16,384 bytes   (.bss)
  3.  NvM_RamMirror              8,192 bytes   (.bss)
  ...
```

### 4. Optimization Recommendations

Common recommendations based on analysis:

- **const-correctness**: Data in `.data` (RAM) that never changes → move to `.rodata` (FLASH) by adding `const`
- **String pooling**: Duplicate string literals → enable `-fmerge-constants` or string pooling
- **LTO**: Link-Time Optimization removes unused functions across translation units → `-flto`
- **Section consolidation**: Many small sections with alignment gaps → consolidate into fewer sections
- **Stack reduction**: Measured high-water mark well below allocation → reduce stack size safely
- **Dead code**: Functions in `.text` never called → remove or enable `-ffunction-sections -Wl,--gc-sections`

## Example Analysis Walkthrough

Given a GCC map file excerpt:

```
Memory region         Used Size  Region Size  %age Used
           FLASH:      396304 B       512 KB     75.58%
             RAM:       94208 B       128 KB     71.88%
```

Analysis:
1. FLASH at 75.6% — healthy, room for growth
2. RAM at 71.9% — approaching 80% warning threshold
3. Largest RAM consumer is likely BSS (Dem fault memory, COM buffers)
4. Recommendation: review NvM block sizes and COM buffer allocations

## Workflow

1. **Build the project** — Generate the map file
2. **Provide the map file** — Paste relevant sections or provide the file path
3. **Specify budgets** — Define memory budget limits for the project
4. **Review analysis** — Check utilization, compliance, and top consumers
5. **Apply recommendations** — Implement optimizations and rebuild
6. **Compare** — Analyze the new map file to verify improvements

## Gotchas

- **Map file formats vary significantly between toolchains** — GCC, IAR, GHS, and Tasking each produce different formats. Always specify which toolchain generated the map file so the analysis uses the correct parser.
- **Stack usage from map files is static allocation only** — the map shows reserved stack space, not actual runtime usage. Real stack depth depends on call chains, interrupt nesting, and RTOS context. Use runtime stack painting or hardware stack monitors for accurate measurements.
- **"80% budget" is for steady-state, not peak** — the FLASH 80% / RAM 70% budgets assume room for future features and safety margins. A build at 79% FLASH may still fail budget review if 3 more SWCs are planned.
- **Compiler optimization level changes section sizes dramatically** — analyzing a `-O0` debug build's map file and comparing against a `-O2` release budget is misleading. Always analyze the release build map for budget compliance.
- **Unused function elimination depends on `--gc-sections`** — if the linker doesn't garbage-collect unused sections, the map file will show inflated sizes. Verify `--gc-sections` (GCC) or equivalent is enabled before concluding you have a size problem.
- **Alignment padding inflates apparent usage** — MPU-aligned regions include padding. A 17 KB section in a 32 KB-aligned region shows 32 KB in the map. The analysis should distinguish content size from allocated size.
