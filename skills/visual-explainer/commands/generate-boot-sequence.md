# /generate-boot-sequence

Render an ECU boot and startup sequence diagram — phase-by-phase timeline from power-on to run mode, showing bootloader validation, AUTOSAR init sequences, watchdog windows, CAN stack startup, safety init, voltage events, and error/safe-state paths.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load Blueprint theme tokens and Safety Criticality Colors
3. Read `templates/boot-sequence.html` — study the multi-lane CSS timeline, phase block rendering, and error paths section patterns
4. Read `references/embedded-color-semantics.md` — AUTOSAR execution context colors
5. Parse the input (EcuM configuration, startup analysis report, or prose):
   - Boot phases: name, start time (ms), end time (ms), AUTOSAR component responsible, key actions, failure condition
   - Voltage/power events: event name, timestamp (ms)
   - Watchdog windows: open time, close time, window type (init/operational)
   - CAN stack events: component initialization timestamps
   - Safety initialization events: component name and timestamp
   - Error paths: trigger condition, from which phase time, consequence
6. Compute total boot time → set as timeline width (100%)
7. All timeline elements rendered proportionally:
   - Phase blocks: `left: (start/total)×100%`, `width: (duration/total)×100%`
   - Event ticks: `left: (t/total)×100%` as vertical tick marks with rotated labels
   - Watchdog bands: semi-transparent horizontal bands spanning open→close
8. Generate HTML layout:
   - Time axis: tick marks every 50ms (or every 10% of total boot time)
   - 5 swim-lane rows:
     1. **Power / Voltage** — voltage ramp events as tick markers
     2. **Watchdog** — WDG window bands colored amber (`#ff6600`)
     3. **Boot Phases** — clickable colored phase blocks
     4. **CAN Stack** — CAN initialization event ticks
     5. **Safety Init** — safety component ready event ticks
   - Click phase block → right-side detail panel (CSS slide-in): duration, component, actions list, failure condition
   - Collapsible error paths section: mini timeline showing alternative fault branches
   - Summary `ve-table`: phase | component | start | end | duration | WDG window | ASIL
9. Apply Blueprint aesthetic — always dark, technical artifact
10. Add `@media print` styles: expand all phases, clean timeline
11. Quality checks: phases contiguous (no unexplained gaps), watchdog windows cover init phases, error paths reference valid phase times
12. Write to `~/.agent/diagrams/boot-sequence-<slug>.html`

## Phase Color Convention

| Phase | Color | Description |
|-------|-------|-------------|
| HW Init | `#4d1a00` | MCU startup, clock init, RAM ECC |
| Bootloader | `#003366` | BL validation, CRC check, reprog check |
| OS Startup | `#1a4d1a` | OSEK/AUTOSAR OS task activation |
| BSW Init | `#3d1a4d` | EcuM, WdgM, ComM, CanIf init |
| App Init | `#806600` | RTE_Start, SWC init runnables |
| Run Mode | `#1a5c1a` | Full operation — all cyclic tasks active |
| Error / Safe State | `#7b0000` | Fault detected, safe state activated |

## Watchdog Window Types

- **Init window**: wide tolerance — allows slow startup initialization
- **Tight window**: shorter tolerance — BSW phase with tighter timing requirements
- **Operational**: strict — normal runtime WDG service interval (typically 5–20ms)

## Rules

- Phase blocks must be proportional to actual duration — no fixed-width blocks
- Watchdog windows must visually overlap the phases they cover
- Event tick labels must not overlap — use alternating above/below placement
- Error paths section collapsed by default (boot engineers focus on nominal path first)
- If any phase's duration is unknown, show it with a hatched pattern and a "TBD" label
- Total boot time badge: green ≤ 500ms, amber 500ms–1s, red > 1s (typical OEM requirements)
- CAN network availability time is a key KPI — annotate it explicitly with a vertical milestone line

## Input

AUTOSAR EcuM/BswM configuration, startup timing measurement data, boot analysis report, or prose description of ECU startup sequence with phase names, durations, and components.

## Output

Path to the generated `.html` boot sequence timeline.
