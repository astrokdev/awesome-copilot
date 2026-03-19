---
name: arxml-generator
description: 'Use when you need to create or update ARXML descriptions for SWCs, port interfaces, data types, or compositions — generates schema-valid AUTOSAR XML from structured specs.'
---

# ARXML Generator

This skill generates AUTOSAR ARXML description files from structured specifications. It covers all major ARXML artifacts: Software Component descriptions, port interfaces, data types, compositions, and system-level descriptions — following AUTOSAR schema conventions and package hierarchy standards.

## When to Use This Skill

Use this skill when you need to:

- Create an SWC description ARXML for a new component
- Define port interfaces (Sender-Receiver, Client-Server, Mode-Switch)
- Define AUTOSAR data types (Application, Implementation, CompuMethods)
- Create a composition connecting multiple SWCs
- Generate a system description or ECU extract
- Validate ARXML structure against AUTOSAR conventions

## Package Hierarchy Convention

All ARXML elements are organized in a standard package structure:

```
/AUTOSAR
├── /DataTypes
│   ├── /ApplicationDataTypes      # Physical-level types
│   ├── /ImplementationDataTypes   # C-level types
│   └── /CompuMethods              # Scaling/conversion definitions
├── /PortInterfaces
│   ├── /SenderReceiver            # S/R interfaces
│   ├── /ClientServer              # C/S interfaces
│   └── /ModeSwitch                # Mode interfaces
├── /SwComponents
│   ├── /<SwcName>                 # Per-SWC package
│   └── /Compositions              # Composition types
├── /System
│   ├── /SystemDescription         # System topology
│   └── /EcuExtract                # Per-ECU extracts
└── /Constants
    └── /InitValues                # Initial value definitions
```

## ARXML Templates

### Application Software Component Type

```xml
<?xml version="1.0" encoding="UTF-8"?>
<AUTOSAR xmlns="http://autosar.org/schema/r4.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://autosar.org/schema/r4.0 AUTOSAR_00051.xsd">
  <AR-PACKAGES>
    <AR-PACKAGE>
      <SHORT-NAME>AUTOSAR</SHORT-NAME>
      <AR-PACKAGES>
        <AR-PACKAGE>
          <SHORT-NAME>SwComponents</SHORT-NAME>
          <AR-PACKAGES>
            <AR-PACKAGE>
              <SHORT-NAME>TempMonitor</SHORT-NAME>
              <ELEMENTS>
                <APPLICATION-SW-COMPONENT-TYPE>
                  <SHORT-NAME>TempMonitor</SHORT-NAME>
                  <ADMIN-DATA>
                    <SDGS>
                      <SDG GID="AutosarToolVersion">
                        <SD GID="version">R4.4.0</SD>
                      </SDG>
                    </SDGS>
                  </ADMIN-DATA>
                  <PORTS>
                    <!-- Required Sender-Receiver Port -->
                    <R-PORT-PROTOTYPE>
                      <SHORT-NAME>RPort_RawTemp</SHORT-NAME>
                      <REQUIRED-INTERFACE-TREF DEST="SENDER-RECEIVER-INTERFACE">
                        /AUTOSAR/PortInterfaces/SenderReceiver/SRI_Temperature
                      </REQUIRED-INTERFACE-TREF>
                    </R-PORT-PROTOTYPE>
                    <!-- Provided Sender-Receiver Port -->
                    <P-PORT-PROTOTYPE>
                      <SHORT-NAME>PPort_FilteredTemp</SHORT-NAME>
                      <PROVIDED-INTERFACE-TREF DEST="SENDER-RECEIVER-INTERFACE">
                        /AUTOSAR/PortInterfaces/SenderReceiver/SRI_Temperature
                      </PROVIDED-INTERFACE-TREF>
                    </P-PORT-PROTOTYPE>
                    <!-- Required Client-Server Port -->
                    <R-PORT-PROTOTYPE>
                      <SHORT-NAME>RPort_DiagService</SHORT-NAME>
                      <REQUIRED-INTERFACE-TREF DEST="CLIENT-SERVER-INTERFACE">
                        /AUTOSAR/PortInterfaces/ClientServer/CSI_DiagService
                      </REQUIRED-INTERFACE-TREF>
                    </R-PORT-PROTOTYPE>
                  </PORTS>
                  <INTERNAL-BEHAVIORS>
                    <SWC-INTERNAL-BEHAVIOR>
                      <SHORT-NAME>TempMonitor_IB</SHORT-NAME>
                      <DATA-TYPE-MAPPING-REFS>
                        <DATA-TYPE-MAPPING-REF DEST="DATA-TYPE-MAPPING-SET">
                          /AUTOSAR/DataTypes/DataTypeMappingSet
                        </DATA-TYPE-MAPPING-REF>
                      </DATA-TYPE-MAPPING-REFS>
                      <EXCLUSIVE-AREAS>
                        <EXCLUSIVE-AREA>
                          <SHORT-NAME>ExAr_FilterData</SHORT-NAME>
                        </EXCLUSIVE-AREA>
                      </EXCLUSIVE-AREAS>
                      <RUNNABLES>
                        <RUNNABLE-ENTITY>
                          <SHORT-NAME>TempMonitor_Init</SHORT-NAME>
                          <CAN-BE-INVOKED-CONCURRENTLY>false</CAN-BE-INVOKED-CONCURRENTLY>
                          <SYMBOL>TempMonitor_Init</SYMBOL>
                        </RUNNABLE-ENTITY>
                        <RUNNABLE-ENTITY>
                          <SHORT-NAME>TempMonitor_FilterCycle</SHORT-NAME>
                          <CAN-BE-INVOKED-CONCURRENTLY>false</CAN-BE-INVOKED-CONCURRENTLY>
                          <DATA-READ-ACCESSS>
                            <VARIABLE-ACCESS>
                              <SHORT-NAME>dra_RawTemp</SHORT-NAME>
                              <ACCESSED-VARIABLE>
                                <AUTOSAR-VARIABLE-IREF>
                                  <PORT-PROTOTYPE-REF DEST="R-PORT-PROTOTYPE">
                                    RPort_RawTemp
                                  </PORT-PROTOTYPE-REF>
                                  <TARGET-DATA-PROTOTYPE-REF DEST="VARIABLE-DATA-PROTOTYPE">
                                    /AUTOSAR/PortInterfaces/SenderReceiver/SRI_Temperature/value
                                  </TARGET-DATA-PROTOTYPE-REF>
                                </AUTOSAR-VARIABLE-IREF>
                              </ACCESSED-VARIABLE>
                            </VARIABLE-ACCESS>
                          </DATA-READ-ACCESSS>
                          <DATA-WRITE-ACCESSS>
                            <VARIABLE-ACCESS>
                              <SHORT-NAME>dwa_FilteredTemp</SHORT-NAME>
                              <ACCESSED-VARIABLE>
                                <AUTOSAR-VARIABLE-IREF>
                                  <PORT-PROTOTYPE-REF DEST="P-PORT-PROTOTYPE">
                                    PPort_FilteredTemp
                                  </PORT-PROTOTYPE-REF>
                                  <TARGET-DATA-PROTOTYPE-REF DEST="VARIABLE-DATA-PROTOTYPE">
                                    /AUTOSAR/PortInterfaces/SenderReceiver/SRI_Temperature/value
                                  </TARGET-DATA-PROTOTYPE-REF>
                                </AUTOSAR-VARIABLE-IREF>
                              </ACCESSED-VARIABLE>
                            </VARIABLE-ACCESS>
                          </DATA-WRITE-ACCESSS>
                          <SYMBOL>TempMonitor_FilterCycle</SYMBOL>
                        </RUNNABLE-ENTITY>
                      </RUNNABLES>
                      <EVENTS>
                        <INIT-EVENT>
                          <SHORT-NAME>InitEvent_Init</SHORT-NAME>
                          <START-ON-EVENT-REF DEST="RUNNABLE-ENTITY">
                            TempMonitor_Init
                          </START-ON-EVENT-REF>
                        </INIT-EVENT>
                        <TIMING-EVENT>
                          <SHORT-NAME>TimingEvent_FilterCycle_10ms</SHORT-NAME>
                          <START-ON-EVENT-REF DEST="RUNNABLE-ENTITY">
                            TempMonitor_FilterCycle
                          </START-ON-EVENT-REF>
                          <PERIOD>0.01</PERIOD>
                        </TIMING-EVENT>
                      </EVENTS>
                    </SWC-INTERNAL-BEHAVIOR>
                  </INTERNAL-BEHAVIORS>
                </APPLICATION-SW-COMPONENT-TYPE>
              </ELEMENTS>
            </AR-PACKAGE>
          </AR-PACKAGES>
        </AR-PACKAGE>
      </AR-PACKAGES>
    </AR-PACKAGE>
  </AR-PACKAGES>
</AUTOSAR>
```

### Sender-Receiver Interface

```xml
<SENDER-RECEIVER-INTERFACE>
  <SHORT-NAME>SRI_Temperature</SHORT-NAME>
  <IS-SERVICE>false</IS-SERVICE>
  <DATA-ELEMENTS>
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
  </DATA-ELEMENTS>
</SENDER-RECEIVER-INTERFACE>
```

### Client-Server Interface

```xml
<CLIENT-SERVER-INTERFACE>
  <SHORT-NAME>CSI_DiagService</SHORT-NAME>
  <IS-SERVICE>false</IS-SERVICE>
  <OPERATIONS>
    <CLIENT-SERVER-OPERATION>
      <SHORT-NAME>ReportFault</SHORT-NAME>
      <ARGUMENTS>
        <ARGUMENT-DATA-PROTOTYPE>
          <SHORT-NAME>dtcCode</SHORT-NAME>
          <TYPE-TREF DEST="IMPLEMENTATION-DATA-TYPE">
            /AUTOSAR/DataTypes/ImplementationDataTypes/DTC_T
          </TYPE-TREF>
          <DIRECTION>IN</DIRECTION>
        </ARGUMENT-DATA-PROTOTYPE>
        <ARGUMENT-DATA-PROTOTYPE>
          <SHORT-NAME>status</SHORT-NAME>
          <TYPE-TREF DEST="IMPLEMENTATION-DATA-TYPE">
            /AUTOSAR/DataTypes/ImplementationDataTypes/uint8
          </TYPE-TREF>
          <DIRECTION>IN</DIRECTION>
        </ARGUMENT-DATA-PROTOTYPE>
      </ARGUMENTS>
      <POSSIBLE-ERROR-REFS>
        <POSSIBLE-ERROR-REF DEST="APPLICATION-ERROR">
          /AUTOSAR/PortInterfaces/ClientServer/CSI_DiagService/E_NOT_OK
        </POSSIBLE-ERROR-REF>
      </POSSIBLE-ERROR-REFS>
    </CLIENT-SERVER-OPERATION>
  </OPERATIONS>
  <POSSIBLE-ERRORS>
    <APPLICATION-ERROR>
      <SHORT-NAME>E_NOT_OK</SHORT-NAME>
      <ERROR-CODE>1</ERROR-CODE>
    </APPLICATION-ERROR>
  </POSSIBLE-ERRORS>
</CLIENT-SERVER-INTERFACE>
```

### Mode-Switch Interface

```xml
<MODE-SWITCH-INTERFACE>
  <SHORT-NAME>MSI_VehicleMode</SHORT-NAME>
  <IS-SERVICE>false</IS-SERVICE>
  <MODE-GROUP>
    <SHORT-NAME>currentMode</SHORT-NAME>
    <TYPE-TREF DEST="MODE-DECLARATION-GROUP">
      /AUTOSAR/ModeDcls/VehicleMode
    </TYPE-TREF>
  </MODE-GROUP>
</MODE-SWITCH-INTERFACE>

<!-- Mode Declaration Group (referenced by the interface) -->
<MODE-DECLARATION-GROUP>
  <SHORT-NAME>VehicleMode</SHORT-NAME>
  <INITIAL-MODE-REF DEST="MODE-DECLARATION">NORMAL</INITIAL-MODE-REF>
  <MODE-DECLARATIONS>
    <MODE-DECLARATION>
      <SHORT-NAME>NORMAL</SHORT-NAME>
    </MODE-DECLARATION>
    <MODE-DECLARATION>
      <SHORT-NAME>SLEEP</SHORT-NAME>
    </MODE-DECLARATION>
    <MODE-DECLARATION>
      <SHORT-NAME>DIAGNOSTIC</SHORT-NAME>
    </MODE-DECLARATION>
  </MODE-DECLARATIONS>
</MODE-DECLARATION-GROUP>
```

### Application Primitive Data Type

```xml
<APPLICATION-PRIMITIVE-DATA-TYPE>
  <SHORT-NAME>Temperature_T</SHORT-NAME>
  <CATEGORY>VALUE</CATEGORY>
  <SW-DATA-DEF-PROPS>
    <SW-DATA-DEF-PROPS-VARIANTS>
      <SW-DATA-DEF-PROPS-CONDITIONAL>
        <COMPU-METHOD-REF DEST="COMPU-METHOD">
          /AUTOSAR/DataTypes/CompuMethods/CM_Temperature
        </COMPU-METHOD-REF>
        <UNIT-REF DEST="UNIT">/AUTOSAR/Units/DegCelsius</UNIT-REF>
      </SW-DATA-DEF-PROPS-CONDITIONAL>
    </SW-DATA-DEF-PROPS-VARIANTS>
  </SW-DATA-DEF-PROPS>
</APPLICATION-PRIMITIVE-DATA-TYPE>

<COMPU-METHOD>
  <SHORT-NAME>CM_Temperature</SHORT-NAME>
  <CATEGORY>LINEAR</CATEGORY>
  <COMPU-INTERNAL-TO-PHYS>
    <COMPU-SCALES>
      <COMPU-SCALE>
        <LOWER-LIMIT INTERVAL-TYPE="CLOSED">-40.0</LOWER-LIMIT>
        <UPPER-LIMIT INTERVAL-TYPE="CLOSED">150.0</UPPER-LIMIT>
        <COMPU-RATIONAL-COEFFS>
          <COMPU-NUMERATOR><V>0</V><V>0.1</V></COMPU-NUMERATOR>
          <COMPU-DENOMINATOR><V>1</V></COMPU-DENOMINATOR>
        </COMPU-RATIONAL-COEFFS>
      </COMPU-SCALE>
    </COMPU-SCALES>
  </COMPU-INTERNAL-TO-PHYS>
</COMPU-METHOD>
```

### Implementation Data Type

```xml
<IMPLEMENTATION-DATA-TYPE>
  <SHORT-NAME>Temperature_Impl_T</SHORT-NAME>
  <CATEGORY>VALUE</CATEGORY>
  <SW-DATA-DEF-PROPS>
    <SW-DATA-DEF-PROPS-VARIANTS>
      <SW-DATA-DEF-PROPS-CONDITIONAL>
        <BASE-TYPE-REF DEST="SW-BASE-TYPE">
          /AUTOSAR/DataTypes/BaseTypes/float32
        </BASE-TYPE-REF>
      </SW-DATA-DEF-PROPS-CONDITIONAL>
    </SW-DATA-DEF-PROPS-VARIANTS>
  </SW-DATA-DEF-PROPS>
</IMPLEMENTATION-DATA-TYPE>
```

### Composition Software Component

```xml
<COMPOSITION-SW-COMPONENT-TYPE>
  <SHORT-NAME>AppComposition</SHORT-NAME>
  <COMPONENTS>
    <SW-COMPONENT-PROTOTYPE>
      <SHORT-NAME>tempMonitor</SHORT-NAME>
      <TYPE-TREF DEST="APPLICATION-SW-COMPONENT-TYPE">
        /AUTOSAR/SwComponents/TempMonitor/TempMonitor
      </TYPE-TREF>
    </SW-COMPONENT-PROTOTYPE>
    <SW-COMPONENT-PROTOTYPE>
      <SHORT-NAME>tempSensor</SHORT-NAME>
      <TYPE-TREF DEST="SENSOR-ACTUATOR-SW-COMPONENT-TYPE">
        /AUTOSAR/SwComponents/TempSensor/TempSensor
      </TYPE-TREF>
    </SW-COMPONENT-PROTOTYPE>
  </COMPONENTS>
  <CONNECTORS>
    <!-- Connect TempSensor output to TempMonitor input -->
    <ASSEMBLY-SW-CONNECTOR>
      <SHORT-NAME>conn_RawTemp</SHORT-NAME>
      <PROVIDER-IREF>
        <CONTEXT-COMPONENT-REF DEST="SW-COMPONENT-PROTOTYPE">tempSensor</CONTEXT-COMPONENT-REF>
        <TARGET-P-PORT-REF DEST="P-PORT-PROTOTYPE">PPort_RawTemp</TARGET-P-PORT-REF>
      </PROVIDER-IREF>
      <REQUESTER-IREF>
        <CONTEXT-COMPONENT-REF DEST="SW-COMPONENT-PROTOTYPE">tempMonitor</CONTEXT-COMPONENT-REF>
        <TARGET-R-PORT-REF DEST="R-PORT-PROTOTYPE">RPort_RawTemp</TARGET-R-PORT-REF>
      </REQUESTER-IREF>
    </ASSEMBLY-SW-CONNECTOR>
  </CONNECTORS>
  <!-- Delegation ports expose internal ports at composition boundary -->
  <PORTS>
    <P-PORT-PROTOTYPE>
      <SHORT-NAME>PPort_FilteredTemp</SHORT-NAME>
      <PROVIDED-INTERFACE-TREF DEST="SENDER-RECEIVER-INTERFACE">
        /AUTOSAR/PortInterfaces/SenderReceiver/SRI_Temperature
      </PROVIDED-INTERFACE-TREF>
    </P-PORT-PROTOTYPE>
  </PORTS>
  <DELEGATION-CONNECTORS>
    <DELEGATION-SW-CONNECTOR>
      <SHORT-NAME>deleg_FilteredTemp</SHORT-NAME>
      <INNER-PORT-IREF>
        <CONTEXT-COMPONENT-REF DEST="SW-COMPONENT-PROTOTYPE">tempMonitor</CONTEXT-COMPONENT-REF>
        <TARGET-P-PORT-REF DEST="P-PORT-PROTOTYPE">PPort_FilteredTemp</TARGET-P-PORT-REF>
      </INNER-PORT-IREF>
      <OUTER-PORT-REF DEST="P-PORT-PROTOTYPE">PPort_FilteredTemp</OUTER-PORT-REF>
    </DELEGATION-SW-CONNECTOR>
  </DELEGATION-CONNECTORS>
</COMPOSITION-SW-COMPONENT-TYPE>
```

## Validation Rules

When generating or reviewing ARXML, check for:

1. **SHORT-NAME uniqueness**: No two siblings in the same package may share a SHORT-NAME
2. **Reference path validity**: All `*-TREF` and `*-REF` attributes must point to existing elements
3. **Interface consistency**: Provider and requester ports on a connector must reference the same interface
4. **Direction correctness**: `R-PORT-PROTOTYPE` for required, `P-PORT-PROTOTYPE` for provided
5. **Data type mapping**: Application data types must have a mapping to implementation data types
6. **Event-runnable binding**: Every event must reference a runnable that exists in the same behavior
7. **Schema namespace**: `xmlns` must match the AUTOSAR release (e.g., `http://autosar.org/schema/r4.0`)

## Common Mistakes

- **Wrong reference path**: Using relative paths instead of absolute `/AUTOSAR/...` paths
- **Missing data type mapping set**: SWC behavior references unmapped application types
- **Duplicate SHORT-NAMEs**: Two ports or runnables with the same name in the same scope
- **Interface mismatch in connectors**: Connecting ports with different interface types
- **Missing SYMBOL element**: Runnable without `<SYMBOL>` — linker cannot find the C function
- **Wrong event period format**: Using milliseconds instead of seconds (ARXML uses seconds as float)
