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

---

## DTC Status Badge Colors

Use these for DTC catalog status column badges. Status reflects current DEM event memory state.

| Status | Background | Text | Border | Meaning |
|--------|------------|------|--------|---------|
| Active | `#7b0000` | `#ff6666` | `#ff2222` | Fault currently present |
| Confirmed | `#b34700` | `#fff` | `#ff6600` | Confirmed by debounce — in primary memory |
| Pending | `#806600` | `#fff` | `#ffcc00` | Pre-confirmed — debounce in progress |
| Stored | `#1a3a5c` | `#4da6ff` | `#3399ff` | Previously active — in DEM event memory |
| Cleared | `#1a5c1a` | `#66cc66` | `#33cc33` | Cleared by tester or aging |

## DTC Severity Badge Colors

| Severity | Background | Usage |
|----------|------------|-------|
| Critical | `#7b0000` / `#ff6666` text | Safety-relevant faults (ASIL > QM); immediate safe-state risk |
| Warning | `#806600` / `#ffcc00` text | Degraded operation; function available but impaired |
| Info | `#1a3a5c` / `#4da6ff` text | Informational / QM; no safety impact |

## DTC Domain System Badge Colors

| Domain | Background | Usage |
|--------|------------|-------|
| Powertrain | `#003366` | Engine, motor, battery, transmission ECUs |
| Body | `#3d1a4d` | Body control, lighting, comfort ECUs |
| Chassis | `#1a4d1a` | Brakes, steering, suspension ECUs |
| Network | `#4d1a00` | CAN bus, gateway, NM faults |

---

## Test Coverage Adequacy Colors

Use for coverage bar fill and adequacy badge colors in test coverage dashboards.

| State | Color | Condition |
|-------|-------|-----------|
| Adequate (pass) | `#1a5c1a` green | Meets or exceeds ASIL threshold |
| Near threshold | `#806600` amber | ≥ 80% of required threshold |
| Insufficient | `#7b0000` red | < 80% of required threshold |
| N/A | `--surface-raised` | Coverage method not required for this ASIL |

### ISO 26262 Coverage Thresholds Reference

| ASIL | Statement | Branch | MC/DC |
|------|-----------|--------|-------|
| D    | 100%      | 100%   | 100% (mandatory) |
| C    | 100%      | 100%   | 100% (mandatory) |
| B    | 100%      | 100%   | N/A |
| A    | 100%      | 100%   | N/A |
| QM   | ≥ 80%     | ≥ 70%  | N/A |

---

## RTE / OS Task Colors

Task track color is determined by the highest ASIL runnable mapped to the task.

| ASIL | Track Background | Border | Usage |
|------|-----------------|--------|-------|
| D (highest) | `#7b0000` | `#ff2222` | Safety-critical cyclic task |
| C | `#b34700` | `#ff6600` | High-criticality task |
| B | `#806600` | `#ffcc00` | Medium-criticality task |
| A | `#1a5c1a` | `#33cc33` | Low-criticality task |
| QM | `#1a3a5c` | `#3399ff` | Quality-managed background task |
| ISR | `#4d1a00` | `#ff6600` | Interrupt service routine (always highest prio) |

### AUTOSAR Execution Context Colors (for runnable type annotation)

| Context | Color | Description |
|---------|-------|-------------|
| Init Runnable | `#003366` | Runs once at startup (EcuM phase) |
| Cyclic Runnable | `#1a4d1a` | Triggered by OS alarm at fixed period |
| Event Runnable | `#4d3300` | Triggered by DataReceivedEvent or ModeSwitchEvent |
| Background Runnable | `#2a2a4d` | Idle loop / lowest priority |

### CPU Load Color Zones

| Load | Color | Threshold |
|------|-------|-----------|
| Normal | `#1a5c1a` green | ≤ 60% |
| Warning | `#806600` amber | 60–80% |
| Critical | `#7b0000` red | > 80% |

---

## Signal Routing / Network Bus Colors

Use for swimlane backgrounds, bus line strokes, routing arrow colors, and ECU chip borders.

| Bus Type | Background | Border/Stroke | Usage |
|----------|------------|---------------|-------|
| CAN | `#1a4d1a` | `#33cc33` | Standard CAN / CAN FD |
| LIN | `#4d3300` | `#ff9900` | LIN sub-bus (body, lighting) |
| Ethernet | `#003366` | `#3399ff` | 100BASE-T1 / 1000BASE-T1 / SOME-IP |
| FlexRay | `#4d2200` | `#ff6633` | FlexRay (legacy chassis/powertrain) |
| MOST | `#4d1a4d` | `#cc66ff` | MOST optical (legacy infotainment) |

### Signal Direction Symbols

| Symbol | Meaning |
|--------|---------|
| `→` | Unidirectional gateway routing |
| `↔` | Bidirectional routing (rare) |
| `⇒` | Protocol translation (CAN → SOME-IP) |
| `⊕` | Signal fusion (multiple sources → one signal) |

**Safety-critical routing arrows** (ASIL > QM): use dashed red stroke `#ff2222` to distinguish from QM signals.

---

## Calibration Parameter Type Colors

Use as type badge backgrounds in calibration parameter cards and tables.

| Type | Background | Meaning |
|------|------------|---------|
| Map | `#003366` blue | 2D lookup table (e.g. speed × load → torque) |
| Curve | `#1a4d1a` green | 1D lookup / characteristic curve |
| Scalar | `#4d3300` amber | Single calibration value |
| Array | `#3d1a4d` purple | 1D fixed-size vector |
| Switch | `#4d1a00` orange-red | Enumerated selection / boolean |

### Memory Section Badge Colors

| Section | Color | Runtime Behavior |
|---------|-------|-----------------|
| Flash | `--accent` (`#005a9e` / `#4da6ff` dark) | Read-only at runtime — set at programming time |
| RAM | `--accent-2` (`#c05a2e` / `#e07a4e` dark) | Online adjustable during vehicle lifetime |
| NVM | `#3d1a4d` purple | Persisted across power cycles — written at EOL/service |

---

## Boot Sequence Phase Colors

Use for phase block backgrounds in boot sequence timeline diagrams.

| Phase | Background | Border | Description |
|-------|------------|--------|-------------|
| HW Init | `#4d1a00` | `#ff6600` | MCU clock, RAM ECC, flash config |
| Bootloader | `#003366` | `#3399ff` | BL validation, app CRC check, reprog check |
| OS Startup | `#1a4d1a` | `#33cc33` | OSEK/AUTOSAR OS task activation |
| BSW Init | `#3d1a4d` | `#9966ff` | EcuM, WdgM, CanIf, ComM init |
| App Init | `#806600` | `#ffcc00` | RTE_Start, SWC init runnables |
| Run Mode | `#1a5c1a` | `#33cc33` | Full operation — all cyclic tasks active |
| Error / Safe State | `#7b0000` | `#ff2222` | Fault detected, safe state activated |

### Watchdog Window Colors

| Window Type | Color | Description |
|-------------|-------|-------------|
| Init window | `rgba(255,102,0,0.15)` | Wide tolerance during slow startup |
| Tight window | `rgba(255,102,0,0.25)` | Shorter BSW-phase tolerance |
| Operational | `rgba(255,102,0,0.35)` | Strict runtime WDG service interval |

### Boot Time KPI Colors

| Total Boot Time | Color | Notes |
|-----------------|-------|-------|
| ≤ 500ms | `#1a5c1a` green | Typical OEM fast-boot requirement |
| 500ms – 1s | `#806600` amber | Acceptable for non-safety-critical ECUs |
| > 1s | `#7b0000` red | Usually exceeds OEM gate requirement |
