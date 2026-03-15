# /generate-rte-timing

Render an AUTOSAR Classic RTE / OSEK OS task scheduling diagram — shows which runnables execute in which OS tasks, at what cycle time, with WCET budget, stack usage, and CPU load. This is CPU-scheduler-level timing analysis — distinct from `/generate-can-timing` which is network-level.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load Blueprint theme tokens and Safety Criticality Colors
3. Read `templates/rte-timing.html` — study the Gantt track layout, WCET fill, and CPU load bar patterns
4. Read `references/embedded-color-semantics.md` — AUTOSAR execution context colors and ASIL conventions
5. Parse the input (ARXML OsTask definitions, SWC timing analysis report, or prose):
   - OS task name, priority, cycle period (ms or μs), ASIL level
   - Runnables mapped to each task: name, SWC owner, WCET (μs), stack (bytes), activation type (cyclic / event / init)
   - OS tick resolution (μs), MCU clock, number of cores
6. Compute derived metrics:
   - CPU load per task: `(sum_wcet_us / period_us) × 100%`
   - Total CPU load (sum across tasks); warn if > 70%
   - LCM of all task periods → display window (cap at 200ms for readability)
   - WCET utilization per runnable: `wcet_us / period_us × 100%` — flag > 80% amber, > 100% red
7. Generate HTML layout:
   - Stacked CPU load bar: per-task segments colored by ASIL criticality
   - Gantt diagram: tasks sorted by priority descending (highest priority = top row)
     - Activation blocks: solid WCET fill + faded slack fill + WCET deadline tick (red vertical line)
     - Repeating blocks across the display window at the task's period interval
     - Priority inversion risk marker: diagonal amber stripe where task interleaving could invert priority
   - Collapsible runnable catalog `ve-table`: runnable | SWC | task | cycle | WCET (μs) | stack (bytes) | ASIL | utilization %
8. Apply Blueprint aesthetic — always dark, technical drafting style
9. Quality checks: all runnables shown, WCET totals don't exceed period, CPU load is accurate
10. Write to `~/.agent/diagrams/rte-timing-<slug>.html`

## Task Color Convention

Tasks are colored by ASIL level of their highest-criticality runnable:

| ASIL | Track Color | Border |
|------|-------------|--------|
| D    | `#7b0000`   | `#ff2222` |
| C    | `#b34700`   | `#ff6600` |
| B    | `#806600`   | `#ffcc00` |
| A    | `#1a5c1a`   | `#33cc33` |
| QM   | `#1a3a5c`   | `#3399ff` |
| ISR  | `#4d1a00`   | `#ff6600` (interrupt, highest priority) |

## Rules

- Time axis must show units (ms), ticks at every 10ms or 1/10 of the display window
- WCET fill must be visually distinct from slack (solid vs. semi-transparent)
- If any runnable's WCET exceeds its task period, show a red overflow indicator
- Tasks sorted by priority descending — highest priority task always at top
- CPU load badge: green ≤ 60%, amber 60–80%, red > 80%
- Stack usage in bytes alongside WCET — both are resource budget concerns for ASIL-D

## Input

AUTOSAR ARXML OsTask and SwcInternalBehavior sections, timing analysis CSV (`task, priority, period_ms, runnable, swc, wcet_us, stack_bytes, asil`), or prose description of OS configuration.

## Output

Path to the generated `.html` RTE task scheduling diagram.
