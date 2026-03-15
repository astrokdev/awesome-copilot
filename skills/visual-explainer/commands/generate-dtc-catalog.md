# /generate-dtc-catalog

Render an ECU Diagnostic Trouble Code (DTC) catalog as an interactive HTML page — DTC codes, fault conditions, DEM event configuration, healing conditions, ASIL ratings, and status per entry.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load Blueprint theme tokens and Safety Criticality Colors
3. Read `templates/dtc-catalog.html` — study the sticky table, inline expandable rows, and status badge patterns
4. Read `references/embedded-color-semantics.md` — ASIL badge conventions
5. Parse the input (DEM ARXML, DTC list, CSV, or prose):
   - DTC code (3-byte hex), Fault Type Byte (FTB), description, system domain
   - DEM event name (AUTOSAR identifier), monitor type (cyclic period / event)
   - Healing condition, debounce strategy + thresholds, aging counter
   - Enable conditions, ASIL level, linked safety goal (if ASIL > QM)
   - Current status: Active / Stored / Confirmed / Pending / Cleared
6. Classify each DTC into a system domain:
   - Powertrain, Body, Chassis, Network — based on DTC code range or explicit tag
7. Generate HTML layout:
   - Summary pills: Total / Active / Stored / Confirmed / Pending counts
   - Filter bar: search + domain buttons (All | Powertrain | Body | Chassis | Network | Safety-relevant | Open)
   - `ve-table` with sticky header: DTC code (hex, monospace) | FTB | Description | System | Severity | Monitor Type | ASIL | Status
   - Row click → inline expandable detail row (no modal): DEM event, debounce, aging, enable conditions, safety goal
   - Export CSV downloads all visible rows
8. Apply Blueprint aesthetic (`--bg: #0a1628`) — this is always a dark/technical artifact
9. Add `@media print` styles: expand all detail rows, hide filter controls, show full page
10. Quality checks: all DTCs placed, status badges correct, ASIL badges match safety colors
11. Write to `~/.agent/diagrams/dtc-catalog-<slug>.html`

## Status Badge Colors

| Status | Color |
|--------|-------|
| Active | Red (`#7b0000` bg, `#ff6666` text) |
| Confirmed | Orange (`#b34700` bg) |
| Pending | Amber (`#806600` bg) |
| Stored | Blue (`#1a3a5c` bg) |
| Cleared | Green (`#1a5c1a` bg) |

## Severity Badge Colors

| Severity | Color |
|----------|-------|
| Critical | Red — safety-relevant faults (ASIL > QM) |
| Warning | Amber — degraded operation |
| Info | Blue — informational / QM |

## Rules

- DTC codes rendered in `IBM Plex Mono` with blue accent color — never plain text
- Safety-relevant filter shows only entries where ASIL is not QM
- Open filter shows Active + Pending entries
- Inline detail rows must not shift surrounding row layout (use `<tbody>` insertion pattern)
- If ASIL > QM and no safety goal linked, show a warning indicator in the expanded row
- Always show FTB alongside DTC code — it disambiguates sub-faults sharing a base DTC

## Input

DEM ARXML export, DTC list CSV (`code, ftb, description, system, severity, monitor, healing, asil, status`), or prose description of ECU fault catalog.

## Output

Path to the generated `.html` DTC catalog page.
