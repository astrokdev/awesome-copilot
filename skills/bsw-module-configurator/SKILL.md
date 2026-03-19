---
name: bsw-module-configurator
description: 'Use when you need to configure AUTOSAR BSW modules (OS, COM, NvM, Dem, EcuM) from functional requirements — produces task tables, signal routing, NvM blocks, DTC config, and initialization sequences.'
---

# BSW Module Configurator

This skill guides the configuration of AUTOSAR Basic Software modules from functional requirements. It identifies which BSW modules are needed, generates C configuration structures, provides corresponding ARXML configuration snippets, and documents inter-module dependencies.

## When to Use This Skill

Use this skill when you need to:

- Add a new CAN signal to the COM stack (signal → I-PDU → CanIf → Can)
- Create an NvM block for persistent data storage
- Define a new DTC in the Diagnostic Event Manager (Dem)
- Configure OS tasks and alarms for SWC runnable scheduling
- Set up diagnostic service routing in Dcm (DID read/write, routine control)
- Design EcuM startup/shutdown sequences
- Configure BswM mode management rules

## Supported Modules

| Module | Purpose | Key Configuration Items |
|--------|---------|------------------------|
| **Os** | Real-time operating system | Tasks, ISRs, alarms, schedule tables, OS applications |
| **Com** | Signal-based communication | Signals, I-PDU groups, TX modes, timeouts |
| **NvM** | Non-volatile memory | Blocks (native/redundant), CRC, callbacks |
| **Dem** | Diagnostic event management | DTCs, debouncing, freeze frames, aging |
| **Dcm** | Diagnostic communication | Service routing, DIDs, RIDs, sessions, security |
| **EcuM** | ECU state management | Startup phases, wakeup sources, sleep modes |
| **BswM** | Mode management | Mode rules, action lists, conditions |
| **FiM** | Function inhibition | FIDs, DEM event mapping, inhibition masks |
| **CanIf** | CAN interface | Controller, HTH/HRH, TX/RX PDU routing |
| **PduR** | PDU routing | Routing paths between COM/DCM and CanIf/FrIf |

## Configuration Workflow

```
Functional Requirement
        │
        ▼
Identify BSW Modules Involved
        │
        ▼
Check Inter-Module Dependencies
        │
        ▼
Generate Configuration (C structs + ARXML)
        │
        ▼
Verify Initialization Order
        │
        ▼
Test Configuration
```

## Example: Adding a New CAN Signal

**Requirement**: "Transmit engine temperature every 100ms on CAN message 0x123"

**Modules involved**: Com → PduR → CanIf → Can (MCAL)

### Step 1: COM Signal Configuration

```c
/* Com_Cfg.c */
const Com_SignalConfigType Com_Signal_EngineTemp = {
    .signalId        = COM_SIG_ENGINE_TEMP,
    .iPduRef         = COM_IPDU_TX_ENGINE_DATA,
    .bitPosition     = 0U,
    .bitLength       = 16U,
    .endianness      = COM_BIG_ENDIAN,
    .initValue       = 0x0000U,
    .transferProperty = COM_PENDING,
};

const Com_IPduConfigType Com_IPdu_TxEngineData = {
    .pduId     = COM_IPDU_TX_ENGINE_DATA,
    .direction = COM_TX,
    .length    = 8U,
    .txMode    = COM_TX_PERIODIC,
    .periodMs  = 100U,
};
```

### Step 2: PduR Routing

```c
/* PduR_Cfg.c */
const PduR_RoutingPathType PduR_Route_EngineData = {
    .srcModule  = PDUR_SRC_COM,
    .srcPduId   = COM_IPDU_TX_ENGINE_DATA,
    .destModule = PDUR_DEST_CANIF,
    .destPduId  = CANIF_TX_PDU_ENGINE_DATA,
};
```

### Step 3: CanIf TX PDU

```c
/* CanIf_Cfg.c */
const CanIf_TxPduConfigType CanIf_TxPdu_EngineData = {
    .txPduId    = CANIF_TX_PDU_ENGINE_DATA,
    .canId      = 0x123U,
    .canIdType  = CANIF_STANDARD,
    .dlc        = 8U,
    .hthRef     = CANIF_HTH_CAN0,
    .controllerId = CAN_CONTROLLER_0,
};
```

## Example: Adding an NvM Block

**Requirement**: "Store 128 bytes of calibration data with CRC protection"

```c
/* NvM_Cfg.c */
const NvM_BlockDescriptorType NvM_Block_CalData = {
    .blockId         = NVM_BLOCK_CAL_DATA,
    .blockType       = NVM_BLOCK_NATIVE,
    .blockLength     = 128U,
    .ramBlockDataPtr = (void*)&CalData_RamMirror,
    .romBlockDataPtr = (void*)&CalData_RomDefaults,
    .crcType         = NVM_CRC32,
    .priority        = NVM_PRIORITY_STANDARD,
    .writeProtected  = FALSE,
    .selectBlockForReadAll  = TRUE,
    .selectBlockForWriteAll = TRUE,
    .singleBlockCallback    = CalData_NvMCallback,
};
```

**Dependencies**: NvM → MemIf → Fee → Fls (MCAL)

## Inter-Module Dependency Matrix

```
         Os  SchM Com PduR CanIf NvM MemIf Fee Dem Dcm FiM EcuM BswM
Os        -
SchM     ●    -
Com      ●   ●    -   ●
PduR     ●   ●         -   ●                         ●
CanIf    ●   ●              -
NvM      ●   ●                    -   ●
MemIf                              ●   -   ●
Fee                                         -
Dem      ●   ●                    ●              -
Dcm      ●   ●         ●                    ●    -
FiM                                          ●        -
EcuM     ●   ●                               ●             -   ●
BswM     ●   ●                                              ●   -

● = depends on
```

## Initialization Order

Correct sequence — each module initialized only after its dependencies:

```
Phase 1 (before OS): Mcu → Port → Dio → Gpt → Adc → Spi → Can
Phase 2 (OS started): SchM → Fls → Fee → NvM → NvM_ReadAll()
Phase 3 (NvM loaded): CanIf → PduR → Com → Dcm → Dem → BswM → ComM → EcuM_SetWakeupEvent
```

## Common Mistakes

- **COM**: Byte position in DBC uses big-endian bit numbering, but Com config may expect little-endian byte offset — verify conversion
- **NvM**: Not calling `NvM_WriteAll()` during shutdown — changes lost on next power cycle
- **Dem**: Setting debounce threshold too low — transient glitches create false DTCs
- **Dcm**: Forgetting to add DID to the correct session — DID not readable in default session
- **OS**: Stack size too small for tasks with deep call chains — use stack analysis tools
- **PduR**: Missing routing entry — signal is configured in Com but never reaches CanIf
