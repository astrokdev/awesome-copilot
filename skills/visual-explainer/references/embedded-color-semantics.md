# Embedded & Automotive Color Semantics

Domain-specific color conventions for embedded systems and automotive visualizations. Apply these consistently across all domain-specific templates. Safety Criticality Colors always take precedence — load them from `themes.md`.

---

## AUTOSAR Component Types

Use as badge background colors on SWC cards.

| Component Type | Background | Text | Description |
|----------------|------------|------|-------------|
| Application SWC | `#003366` | `#fff` | Application logic |
| Sensor/Actuator SWC | `#1a4d1a` | `#fff` | Direct hardware interface |
| Service SWC | `#4d1a00` | `#fff` | AUTOSAR Basic Software services |
| ECU Abstraction SWC | `#3d1a4d` | `#fff` | Hardware-independent HAL |
| Complex Driver | `#4d3300` | `#fff` | Direct register access (non-AUTOSAR) |
| Composition | `#1a3a5c` | `#fff` | Container of other SWCs |
| Parameter SWC | `#2a2a2a` | `#fff` | Calibration parameter provider |

## AUTOSAR Port & Interface Types

Use as connector labels and port socket colors.

| Interface Type | Label | Color | Description |
|----------------|-------|-------|-------------|
| Sender-Receiver | S/R | `#336699` | Unidirectional data flow |
| Client-Server | C/S | `#996633` | RPC-style call/return |
| NvData | NV | `#663366` | Non-volatile data access |
| Parameter | PRM | `#336633` | Calibration parameters |
| Mode Switch | MS | `#993333` | Mode management |
| Trigger | TRG | `#666600` | Event/trigger activation |

## AUTOSAR Execution Context Colors

| Context | Color | Usage |
|---------|-------|-------|
| Init Runnable | `#003366` | Runs at startup |
| Cyclic Runnable | `#1a4d1a` | Periodic execution |
| Event Runnable | `#4d3300` | Triggered by I/O or mode |
| Background Runnable | `#2a2a4d` | Low-priority idle loop |

---

## CAN Frame & Signal Types

| Type | Color | Description |
|------|-------|-------------|
| Periodic frame | `#1a4d1a` | Fixed cycle time |
| Event-triggered frame | `#4d3300` | Sent on data change |
| BAF (Both) | `#3d3300` | Periodic + event |
| Remote frame | `#3d1a00` | Request frame (rare in CAN FD) |
| Diagnostic frame | `#003366` | UDS/OBD diagnostic |
| NM frame | `#3d1a4d` | Network management |

**CAN FD distinction:** Use dashed border on frame blocks for CAN FD frames (up to 64 bytes DLC).

### Bus Load Color Zones

| Load | Color | Threshold |
|------|-------|-----------|
| Normal | `#1a5c1a` green | 0–60% |
| Warning | `#806600` amber | 60–80% |
| Critical | `#7b0000` red | >80% |

---

## MISRA Rule Categories

| Category | Color | Weight | Description |
|----------|-------|--------|-------------|
| Mandatory | `#7b0000` | 3× | Must not be violated |
| Required | `#806600` | 2× | Violations need formal deviation |
| Advisory | `#1a5c1a` | 1× | Best practice |

### MISRA Rule Group Colors (for heatmap legend)

| Rule Group | Color | MISRA-C:2012 Range |
|------------|-------|-------------------|
| Directives (Dir) | `#003366` | Dir 1.1 – Dir 4.14 |
| Rules (Rule) | `#1a4d1a` | Rule 1.1 – Rule 22.10 |
| Decidable | `#336633` | Decidable subset |
| Undecidable | `#4d3300` | Requires human judgment |

---

## Memory Region Types

| Region | Color | Position Convention |
|--------|-------|---------------------|
| Interrupt vectors | `#4d0000` | Always at 0x0 (bottom of Flash) |
| Bootloader | `#003366` | Above vectors |
| Application code | `#3d1a4d` | Main firmware region |
| Calibration data | `#4d3300` | End of Flash or dedicated sector |
| NVM / EEPROM emulation | `#4d2d00` | Dedicated NVM sector |
| Stack | `#1a4d1a` | Top of RAM (grows down) |
| Heap | `#336633` | Above static data |
| BSS (zero-init) | `#2a2a4d` | Static uninitialized |
| Initialized data | `#3d3d00` | Copied from Flash at startup |
| Shared memory | `#4d1a4d` | IPC between cores/partitions |
| Reserved | `--surface` | Unused / reserved space |

**Memory map conventions:**
- Flash bar: address 0x0 at bottom, highest address at top
- RAM bar: stack at top (grows down), heap below, static data at bottom
- Show gaps explicitly as "Reserved" — never leave unexplained address space

---

## FMEA / TARA Conventions

### Severity Levels (ISO 26262 FMEA)

| S Level | Meaning | ASIL potential |
|---------|---------|----------------|
| S0 | No injuries | QM only |
| S1 | Light/moderate injuries | ASIL-A possible |
| S2 | Severe/life-threatening | ASIL-B/C range |
| S3 | Fatalities | ASIL-C/D range |

### Exposure Levels

| E Level | Meaning | Example |
|---------|---------|---------|
| E1 | Very low probability | <1% of operating time |
| E2 | Low probability | 1–10% |
| E3 | Medium probability | 10–60% |
| E4 | High probability | >60% of operating time |

### Controllability Levels

| C Level | Meaning | Driver success |
|---------|---------|----------------|
| C0 | Controllable in general | Nearly always |
| C1 | Simply controllable | >99% |
| C2 | Normally controllable | >90% |
| C3 | Difficult to control or uncontrollable | <90% |

### TARA Attack Feasibility

| AF Level | Meaning |
|----------|---------|
| AF1 | High attack expertise required |
| AF2 | Moderate expertise |
| AF3 | Low expertise (script kiddie) |
| AF4 | No expertise (commodity tool) |

### TARA Impact Levels

| I Level | Meaning |
|---------|---------|
| I1 | Negligible |
| I2 | Moderate |
| I3 | Major |
| I4 | Severe (safety, financial, operational, privacy) |
