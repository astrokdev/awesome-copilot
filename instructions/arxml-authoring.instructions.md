---
description: 'AUTOSAR ARXML authoring conventions: package hierarchy, SHORT-NAME rules, reference paths, namespace handling, and schema version compatibility.'
applyTo: '**.arxml, **.xml'
---

# AUTOSAR ARXML Authoring Conventions

## Package Hierarchy

Organize ARXML elements in a standard package structure:

```
/AUTOSAR
├── /DataTypes
│   ├── /ApplicationDataTypes    → APPLICATION-PRIMITIVE-DATA-TYPE, APPLICATION-RECORD-DATA-TYPE
│   ├── /ImplementationDataTypes → IMPLEMENTATION-DATA-TYPE
│   ├── /CompuMethods            → COMPU-METHOD (scaling, enumerations)
│   ├── /DataConstraints         → DATA-CONSTR (range limits)
│   └── /Units                   → UNIT (physical units)
├── /PortInterfaces
│   ├── /SenderReceiver          → SENDER-RECEIVER-INTERFACE
│   ├── /ClientServer            → CLIENT-SERVER-INTERFACE
│   └── /ModeSwitch              → MODE-SWITCH-INTERFACE
├── /SwComponents
│   ├── /<SwcName>               → APPLICATION-SW-COMPONENT-TYPE + internal behavior
│   └── /Compositions            → COMPOSITION-SW-COMPONENT-TYPE
├── /ModeDcls                    → MODE-DECLARATION-GROUP
├── /System
│   ├── /SystemDescription       → SYSTEM element
│   └── /EcuExtract              → ECU-INSTANCE, SWC-to-ECU mapping
└── /Constants
    └── /InitValues              → NUMERICAL-VALUE-SPECIFICATION, TEXT-VALUE-SPECIFICATION
```

## SHORT-NAME Rules

- **PascalCase** for types, interfaces, SWCs: `TemperatureSensor`, `SRI_EngineTemp`
- **camelCase** for data elements, operations, arguments: `value`, `reportFault`, `dtcCode`
- **UPPER_CASE** for constants and mode values: `NORMAL`, `SLEEP`, `E_NOT_OK`
- Prefixes for interfaces: `SRI_` (Sender-Receiver), `CSI_` (Client-Server), `MSI_` (Mode-Switch)
- Port prefixes: `PPort_` (provided), `RPort_` (required), `PRPort_` (provide-require)
- Exclusive area prefix: `ExAr_`
- SHORT-NAMEs must be unique among siblings within the same package

## Reference Paths

All `*-TREF` and `*-REF` attributes use absolute paths from the AUTOSAR root:

```xml
<!-- CORRECT: absolute path -->
<REQUIRED-INTERFACE-TREF DEST="SENDER-RECEIVER-INTERFACE">
  /AUTOSAR/PortInterfaces/SenderReceiver/SRI_Temperature
</REQUIRED-INTERFACE-TREF>

<!-- WRONG: relative path -->
<REQUIRED-INTERFACE-TREF DEST="SENDER-RECEIVER-INTERFACE">
  SRI_Temperature
</REQUIRED-INTERFACE-TREF>
```

- The `DEST` attribute specifies the target element type — it must match the actual element type exactly
- The path must resolve to an existing element in the ARXML file or a referenced file
- Whitespace in reference text content is significant — do not add extra spaces or newlines inside the path

## Schema Version Declaration

```xml
<?xml version="1.0" encoding="UTF-8"?>
<AUTOSAR xmlns="http://autosar.org/schema/r4.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://autosar.org/schema/r4.0 AUTOSAR_00051.xsd">
```

- `r4.0` namespace covers all R4.x releases (R4.0 through R4.7 / R22-11)
- Schema file number (`00051`) corresponds to the AUTOSAR release — check your toolchain
- Always declare encoding as `UTF-8`

## Common Templates

### Data Element with Init Value

```xml
<VARIABLE-DATA-PROTOTYPE>
  <SHORT-NAME>value</SHORT-NAME>
  <TYPE-TREF DEST="APPLICATION-PRIMITIVE-DATA-TYPE">
    /AUTOSAR/DataTypes/ApplicationDataTypes/Temperature_T
  </TYPE-TREF>
  <INIT-VALUE>
    <NUMERICAL-VALUE-SPECIFICATION>
      <VALUE>0.0</VALUE>
    </NUMERICAL-VALUE-SPECIFICATION>
  </INIT-VALUE>
</VARIABLE-DATA-PROTOTYPE>
```

### Runnable with Data Access Points

Every `Rte_Read`/`Rte_Write`/`Rte_IRead`/`Rte_IWrite` call must have a corresponding `DATA-READ-ACCESSS` or `DATA-WRITE-ACCESSS` in the runnable entity.

### Timing Event

```xml
<TIMING-EVENT>
  <SHORT-NAME>TimingEvent_MainCycle_10ms</SHORT-NAME>
  <START-ON-EVENT-REF DEST="RUNNABLE-ENTITY">MainCycle</START-ON-EVENT-REF>
  <PERIOD>0.01</PERIOD>  <!-- seconds, not milliseconds -->
</TIMING-EVENT>
```

Note: AUTOSAR ARXML uses **seconds** as the time unit. A 10ms period is `0.01`, not `10`.

## Anti-Patterns

- Using relative reference paths instead of absolute `/AUTOSAR/...` paths
- Duplicate SHORT-NAMEs within the same package scope
- Missing `DEST` attribute on reference elements — parser may silently accept but tools will reject
- Period specified in milliseconds instead of seconds
- Missing `<SYMBOL>` in runnable entity — the linker cannot find the C function
- Creating PORT-INTERFACE-MAPPING without corresponding port interfaces
- Forgetting DATA-TYPE-MAPPING-SET reference in SWC internal behavior — application types won't map to implementation types
- Whitespace or newlines breaking reference path content
