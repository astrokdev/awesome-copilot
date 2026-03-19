---
description: 'AUTOSAR memory section placement: MemMap.h patterns, pragma section directives, GCC section attributes, and calibration data placement conventions.'
applyTo: '**.c, **.h'
---

# AUTOSAR Memory Section Placement

## AUTOSAR MemMap Pattern

All code and data in AUTOSAR modules must be placed in explicit memory sections using the MemMap mechanism. This enables the linker to place code and data in specific memory regions (FLASH, RAM, calibration areas, etc.).

### Basic Pattern

```c
/* Start a code section */
#define <MODULE>_START_SEC_CODE
#include "MemMap.h"

void MyModule_Function(void)
{
    /* implementation */
}

/* End the code section */
#define <MODULE>_STOP_SEC_CODE
#include "MemMap.h"
```

The `MemMap.h` file translates these macros into compiler-specific pragmas or attributes.

## Section Categories

### Code Sections

```c
#define <MODULE>_START_SEC_CODE               /* Normal code → FLASH */
#define <MODULE>_START_SEC_CODE_FAST          /* Fast code → TCM/ITCM */
#define <MODULE>_START_SEC_CODE_SLOW          /* Infrequent code → slower FLASH */
```

### Constant Sections (read-only, placed in FLASH)

```c
#define <MODULE>_START_SEC_CONST_8            /* 8-bit constants */
#define <MODULE>_START_SEC_CONST_16           /* 16-bit constants */
#define <MODULE>_START_SEC_CONST_32           /* 32-bit constants */
#define <MODULE>_START_SEC_CONST_UNSPECIFIED  /* Structs, arrays, unspecified size */
```

### Initialized Variable Sections (RAM, initialized from FLASH at startup)

```c
#define <MODULE>_START_SEC_VAR_INIT_8         /* 8-bit initialized variables */
#define <MODULE>_START_SEC_VAR_INIT_16        /* 16-bit initialized variables */
#define <MODULE>_START_SEC_VAR_INIT_32        /* 32-bit initialized variables */
#define <MODULE>_START_SEC_VAR_INIT_UNSPECIFIED /* Structs, arrays */
```

### Cleared Variable Sections (RAM, zero-initialized at startup)

```c
#define <MODULE>_START_SEC_VAR_CLEARED_8      /* 8-bit cleared variables */
#define <MODULE>_START_SEC_VAR_CLEARED_16     /* 16-bit cleared variables */
#define <MODULE>_START_SEC_VAR_CLEARED_32     /* 32-bit cleared variables */
#define <MODULE>_START_SEC_VAR_CLEARED_UNSPECIFIED /* Structs, arrays */
```

### No-Init Variable Sections (RAM, not initialized — survives warm reset)

```c
#define <MODULE>_START_SEC_VAR_NO_INIT_8      /* 8-bit no-init variables */
#define <MODULE>_START_SEC_VAR_NO_INIT_16     /* 16-bit no-init variables */
#define <MODULE>_START_SEC_VAR_NO_INIT_32     /* 32-bit no-init variables */
#define <MODULE>_START_SEC_VAR_NO_INIT_UNSPECIFIED /* Structs, arrays */
```

### Power-On Init Sections (RAM, initialized only on power-on, not warm reset)

```c
#define <MODULE>_START_SEC_VAR_POWER_ON_INIT_8
#define <MODULE>_START_SEC_VAR_POWER_ON_INIT_UNSPECIFIED
```

## Section Selection Rules

| Data Type | Initialized? | Section Category | Memory |
|-----------|-------------|------------------|--------|
| Function body | N/A | `CODE` | FLASH |
| `const` lookup table | Compile-time | `CONST_*` | FLASH |
| `static` variable with initializer | `= value` | `VAR_INIT_*` | RAM (load from FLASH) |
| `static` variable, zero default | `= 0` or no init | `VAR_CLEARED_*` | RAM (zeroed at startup) |
| Variable that must survive reset | N/A | `VAR_NO_INIT_*` | RAM (no startup init) |
| Calibration parameter | Tool-writable | `CALIB_*` | Calibration FLASH |

### Size Suffix Selection

| C Type | Size Suffix |
|--------|-------------|
| `uint8`, `sint8`, `boolean` | `_8` |
| `uint16`, `sint16` | `_16` |
| `uint32`, `sint32`, `float32` | `_32` |
| `struct`, `array`, `float64`, `union` | `_UNSPECIFIED` |

## Compiler-Specific Backends

### GCC — `__attribute__((section(...)))`

The `MemMap.h` translates to:

```c
/* When <MODULE>_START_SEC_CODE is defined: */
#pragma GCC push_options
#define MEMMAP_SECTION_OPEN
/* Module code goes here */
/* When <MODULE>_STOP_SEC_CODE is defined: */
#pragma GCC pop_options
#undef MEMMAP_SECTION_OPEN
```

For direct usage without MemMap:
```c
__attribute__((section(".text.MyModule"))) void MyModule_Func(void) { }
__attribute__((section(".rodata.MyModule"))) static const uint8 table[] = { 1, 2, 3 };
__attribute__((section(".bss.MyModule"))) static uint32 counter;
__attribute__((section(".data.MyModule"))) static uint8 flag = 1U;
```

### IAR — `#pragma location`

```c
#pragma section = ".caldata"
#pragma location = ".caldata"
static const float32 Cal_FilterAlpha = 0.85f;
```

### Tasking — `#pragma section`

```c
#pragma section fardata "MyModule_Data"
static uint32 MyModule_counter;
#pragma section fardata restore

#pragma section farrom "MyModule_Const"
static const uint8 MyModule_table[] = { 1, 2, 3 };
#pragma section farrom restore
```

### Green Hills — `#pragma ghs section`

```c
#pragma ghs section rodata=".MyModule_const"
static const uint8 table[] = { 1, 2, 3 };
#pragma ghs section rodata=default
```

## Calibration Data Placement

Calibration parameters (tunable via XCP/CCP tools like CANape, INCA) need special placement:

```c
/* Calibration section — placed in calibration FLASH region */
#define TEMPMONITOR_START_SEC_CALIB_UNSPECIFIED
#include "MemMap.h"

/** @brief Filter coefficient — tunable via XCP */
static const float32 TempMonitor_Cal_FilterAlpha = 0.85f;

/** @brief Over-temperature threshold [degC] — tunable via XCP */
static const float32 TempMonitor_Cal_OverTempThreshold = 120.0f;

#define TEMPMONITOR_STOP_SEC_CALIB_UNSPECIFIED
#include "MemMap.h"
```

For online calibration with overlay RAM:
```c
/* Calibration overlay: RAM copy allows runtime modification */
/* The linker places this in a special RAM region overlaying the FLASH copy */
#define TEMPMONITOR_START_SEC_CALIB_RAM_UNSPECIFIED
#include "MemMap.h"

static float32 TempMonitor_CalRam_FilterAlpha;

#define TEMPMONITOR_STOP_SEC_CALIB_RAM_UNSPECIFIED
#include "MemMap.h"
```

## Complete Example — Correctly Sectioned Module

```c
/**
 * @file    TempFilter.c
 * @brief   Temperature filter module with correct MemMap placement
 */
#include "TempFilter.h"

/*--- Constants (FLASH) ---*/
#define TEMPFILTER_START_SEC_CONST_UNSPECIFIED
#include "MemMap.h"

static const float32 TempFilter_DefaultCoeffs[4] = { 0.1f, 0.2f, 0.3f, 0.4f };

#define TEMPFILTER_STOP_SEC_CONST_UNSPECIFIED
#include "MemMap.h"

/*--- Calibration (Calibration FLASH) ---*/
#define TEMPFILTER_START_SEC_CALIB_32
#include "MemMap.h"

static const float32 TempFilter_Cal_Alpha = 0.85f;

#define TEMPFILTER_STOP_SEC_CALIB_32
#include "MemMap.h"

/*--- Cleared variables (RAM, zeroed at startup) ---*/
#define TEMPFILTER_START_SEC_VAR_CLEARED_UNSPECIFIED
#include "MemMap.h"

static TempFilter_State_T TempFilter_state;

#define TEMPFILTER_STOP_SEC_VAR_CLEARED_UNSPECIFIED
#include "MemMap.h"

/*--- Initialized variables (RAM, loaded from FLASH) ---*/
#define TEMPFILTER_START_SEC_VAR_INIT_8
#include "MemMap.h"

static boolean TempFilter_isInitialized = FALSE;

#define TEMPFILTER_STOP_SEC_VAR_INIT_8
#include "MemMap.h"

/*--- Code (FLASH) ---*/
#define TEMPFILTER_START_SEC_CODE
#include "MemMap.h"

void TempFilter_Init(void)
{
    TempFilter_state.lastValue = 0.0f;
    TempFilter_isInitialized = TRUE;
}

float32 TempFilter_Apply(float32 rawValue)
{
    float32 result;
    if (TempFilter_isInitialized == FALSE)
    {
        result = rawValue;
    }
    else
    {
        result = (TempFilter_Cal_Alpha * TempFilter_state.lastValue)
               + ((1.0f - TempFilter_Cal_Alpha) * rawValue);
    }
    TempFilter_state.lastValue = result;
    return result;
}

#define TEMPFILTER_STOP_SEC_CODE
#include "MemMap.h"
```

## Rules

- Every function definition must be wrapped in `START_SEC_CODE` / `STOP_SEC_CODE`
- Every variable definition must be in the appropriate `VAR_*` section
- Every constant must be in a `CONST_*` section
- The `#include "MemMap.h"` must appear after both START and STOP macros
- Never nest section macros — close one section before opening another
- Module prefix in the macro must match the module being developed
- Use `_UNSPECIFIED` for structs, arrays, and any type that doesn't fit `_8`, `_16`, or `_32`
