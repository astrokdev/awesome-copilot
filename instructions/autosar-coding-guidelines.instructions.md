---
description: 'AUTOSAR naming conventions and coding patterns: module prefixes, Std_Types usage, API design patterns, return type conventions, and DET error reporting.'
applyTo: '**.c, **.h'
---

# AUTOSAR Coding Guidelines

## Naming Conventions

### Functions
- Public API: `<Module>_<FunctionName>` — e.g., `Com_SendSignal`, `NvM_ReadBlock`
- Internal: `<Module>_Internal_<FunctionName>` — e.g., `TempFilter_Internal_ApplyIIR`
- Callback: `<Module>_<CallbackType>Notification` — e.g., `NvM_JobEndNotification`
- Main function: `<Module>_MainFunction` — e.g., `Com_MainFunctionRx`

### Types
- Module types: `<Module>_<TypeName>Type` — e.g., `NvM_BlockIdType`, `Com_SignalIdType`
- Configuration: `<Module>_ConfigType` — e.g., `Can_ConfigType`
- Enumerations: `<Module>_<EnumName>Type` with values `<MODULE>_<VALUE>` — e.g., `NvM_RequestResultType` with `NVM_REQ_OK`

### Macros and Constants
- Module defines: `<MODULE>_<NAME>` in UPPER_CASE — e.g., `COM_SIG_ENGINE_TEMP`
- API service IDs: `<MODULE>_SID_<FUNCTION>` — e.g., `NVM_SID_READBLOCK`
- DET error IDs: `<MODULE>_E_<ERROR>` — e.g., `NVM_E_PARAM_BLOCK_ID`

### Files
- Source: `<Module>.c`, `<Module>_Internal.c`
- Public header: `<Module>.h`
- Configuration header: `<Module>_Cfg.h` (pre-compile), `<Module>_PBCfg.h` (post-build)
- Configuration source: `<Module>_PBCfg.c`
- Type header: `<Module>_Types.h` (if types are shared across modules)

## Standard Types — Std_Types.h

Always use AUTOSAR platform types. Never use raw C types.

| AUTOSAR Type | C Equivalent | Usage |
|-------------|-------------|-------|
| `uint8` | `unsigned char` | 8-bit unsigned |
| `uint16` | `unsigned short` | 16-bit unsigned |
| `uint32` | `unsigned long` | 32-bit unsigned |
| `sint8` | `signed char` | 8-bit signed |
| `sint16` | `signed short` | 16-bit signed |
| `sint32` | `signed long` | 32-bit signed |
| `float32` | `float` | 32-bit float |
| `float64` | `double` | 64-bit float |
| `boolean` | `unsigned char` | `TRUE` / `FALSE` |

```c
/* NON-COMPLIANT: raw C types */
unsigned int counter = 0;
char flag = 1;

/* COMPLIANT: AUTOSAR types */
uint32 counter = 0U;
boolean flag = TRUE;
```

## Return Type Convention

All public API functions that can fail shall return `Std_ReturnType`:

```c
Std_ReturnType Module_DoSomething(uint8 param)
{
    Std_ReturnType retVal = E_NOT_OK;

    if (param < MODULE_MAX_PARAM)
    {
        /* perform operation */
        retVal = E_OK;
    }

    return retVal;
}
```

- `E_OK` (0x00) — operation succeeded
- `E_NOT_OK` (0x01) — operation failed
- Module-specific errors extend from 0x02+

## DET Error Reporting

Development Error Tracer (DET) is used during development to catch API misuse:

```c
/* In Module_Cfg.h */
#define MODULE_DEV_ERROR_DETECT   STD_ON

/* In Module.h */
#define MODULE_MODULE_ID          (0x50U)    /* unique module ID */
#define MODULE_INSTANCE_ID        (0x00U)

/* API Service IDs */
#define MODULE_SID_INIT           (0x00U)
#define MODULE_SID_DOWORK         (0x01U)

/* DET Error Codes */
#define MODULE_E_UNINIT           (0x01U)    /* API called before Init */
#define MODULE_E_PARAM_POINTER    (0x02U)    /* NULL pointer parameter */
#define MODULE_E_PARAM_VALUE      (0x03U)    /* Parameter out of range */

/* In Module.c */
#if (MODULE_DEV_ERROR_DETECT == STD_ON)
#include "Det.h"
#endif

Std_ReturnType Module_DoWork(const uint8* dataPtr)
{
    Std_ReturnType retVal = E_NOT_OK;

#if (MODULE_DEV_ERROR_DETECT == STD_ON)
    if (Module_isInitialized == FALSE)
    {
        (void)Det_ReportError(MODULE_MODULE_ID, MODULE_INSTANCE_ID,
                              MODULE_SID_DOWORK, MODULE_E_UNINIT);
    }
    else if (dataPtr == NULL_PTR)
    {
        (void)Det_ReportError(MODULE_MODULE_ID, MODULE_INSTANCE_ID,
                              MODULE_SID_DOWORK, MODULE_E_PARAM_POINTER);
    }
    else
#endif
    {
        /* actual implementation */
        retVal = E_OK;
    }

    return retVal;
}
```

## Configuration Header Pattern

### Pre-Compile Configuration (`<Module>_Cfg.h`)

```c
#ifndef MODULE_CFG_H
#define MODULE_CFG_H

/* Module on/off switches */
#define MODULE_DEV_ERROR_DETECT        STD_ON
#define MODULE_VERSION_INFO_API        STD_OFF

/* Numeric configuration parameters */
#define MODULE_MAX_CHANNELS            (8U)
#define MODULE_BUFFER_SIZE             (256U)

/* Feature switches */
#define MODULE_FEATURE_A_ENABLED       STD_ON
#define MODULE_FEATURE_B_ENABLED       STD_OFF

#endif /* MODULE_CFG_H */
```

### Post-Build Configuration (`<Module>_PBCfg.c`)

```c
#include "Module.h"
#include "Module_Cfg.h"

const Module_ConfigType Module_Config =
{
    .numChannels = MODULE_MAX_CHANNELS,
    .bufferSize  = MODULE_BUFFER_SIZE,
    .channels    = Module_ChannelConfig,
};
```

## API Function Template

Complete example following all conventions:

```c
/**
 * @brief       Read a data value from the specified channel
 * @param[in]   channelId - Channel identifier (0..MODULE_MAX_CHANNELS-1)
 * @param[out]  dataPtr   - Pointer to store the read value
 * @return      E_OK:     Read successful
 *              E_NOT_OK: Read failed (invalid channel or not initialized)
 * @pre         Module_Init() has been called
 */
#define MODULE_START_SEC_CODE
#include "MemMap.h"

Std_ReturnType Module_ReadChannel(uint8 channelId, uint16* dataPtr)
{
    Std_ReturnType retVal = E_NOT_OK;

#if (MODULE_DEV_ERROR_DETECT == STD_ON)
    if (Module_initStatus != MODULE_INITIALIZED)
    {
        (void)Det_ReportError(MODULE_MODULE_ID, MODULE_INSTANCE_ID,
                              MODULE_SID_READCHANNEL, MODULE_E_UNINIT);
    }
    else if (dataPtr == NULL_PTR)
    {
        (void)Det_ReportError(MODULE_MODULE_ID, MODULE_INSTANCE_ID,
                              MODULE_SID_READCHANNEL, MODULE_E_PARAM_POINTER);
    }
    else if (channelId >= MODULE_MAX_CHANNELS)
    {
        (void)Det_ReportError(MODULE_MODULE_ID, MODULE_INSTANCE_ID,
                              MODULE_SID_READCHANNEL, MODULE_E_PARAM_VALUE);
    }
    else
#endif
    {
        *dataPtr = Module_channelData[channelId];
        retVal = E_OK;
    }

    return retVal;
}

#define MODULE_STOP_SEC_CODE
#include "MemMap.h"
```

## Anti-Patterns

- Using `int`, `char`, `long` instead of `uint8`, `sint16`, `uint32`
- Returning `void` from functions that can fail — use `Std_ReturnType`
- Omitting DET checks for null pointers and uninitialized state
- Using `printf`/`assert` in production code — use DET for development, Dem for production diagnostics
- Defining configuration in `.c` files instead of `_Cfg.h` headers
- Calling BSW module APIs before their `_Init()` has been called
- Using dynamic memory allocation (`malloc`/`free`) — all allocation must be static
- Missing `(void)` cast when intentionally discarding a return value
- Mixing module prefixes — every function/type/macro must use its own module prefix
