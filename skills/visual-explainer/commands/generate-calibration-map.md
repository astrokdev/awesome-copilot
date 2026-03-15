# /generate-calibration-map

Render an ECU calibration parameter overview — AUTOSAR CalPrm groups with parameter type (Map/Curve/Scalar/Array/Switch), memory section (Flash/RAM/NVM), hex address, variant conditions, and ASIL annotation. Bridges the gap between ARXML parameter definitions and human-readable form.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load corporate-light + dark tokens and Safety Criticality Colors
3. Read `templates/calibration-map.html` — study the card grid, parameter list collapse, and detail dialog patterns
4. Read `references/embedded-color-semantics.md` — ASIL badge conventions and memory region colors
5. Parse the input (CalPrm ARXML, A2L file, or CSV parameter list):
   - Parameter group name, ASIL level, memory section (Flash/RAM/NVM), address range
   - Per parameter: AUTOSAR name, type (Map/Curve/Scalar/Array/Switch), dimensions, physical range, unit
   - Default value, AUTOSAR data type, initialization description
   - Variant conditions (if any — e.g. only for variant A or B)
   - Linked safety goal for ASIL > QM parameters
6. Classify parameters by type:
   - **Map** (2D lookup table): rows × cols dimensions
   - **Curve** (1D lookup table): N-point array
   - **Scalar** (single value): dimensionless
   - **Array** (1D fixed-size): N elements
   - **Switch** (enumeration): named values
7. Generate HTML layout:
   - Summary stats: Total parameters | Flash | RAM | Variant-coded
   - Filter bar: search + section (Flash/RAM/NVM) + type (Maps/Curves/Scalars/Arrays/Switches) + ASIL dropdown
   - CSS Grid card layout: one card per parameter group
     - Card header: group name + ASIL badge + memory section badge + address range
     - Compact parameter list (show first 3, "Show all N" toggle)
     - Variant-coded parameters marked with orange indicator
   - Click parameter row → `<dialog>` detail panel: full AUTOSAR name, dtype, address, init, variant conditions, safety goal
   - Export CSV: flat list of all parameters
8. Apply corporate-light aesthetic with dark mode support — this is used in Confluence and standalone reports
9. Quality checks: all parameter groups shown, addresses non-overlapping, variant conditions visible
10. Write to `~/.agent/diagrams/calibration-map-<slug>.html`

## Parameter Type Badges

| Type | Badge Color | Meaning |
|------|-------------|---------|
| Map | `#003366` blue | 2D lookup (speed × load → output) |
| Curve | `#1a4d1a` green | 1D lookup (temperature → factor) |
| Scalar | `#4d3300` amber | Single calibration value |
| Array | `#3d1a4d` purple | 1D fixed-size vector |
| Switch | `#4d1a00` orange-red | Enumerated selection |

## Memory Section Badge Colors

| Section | Color |
|---------|-------|
| Flash | `--accent` (blue) — read-only at runtime |
| RAM | `--accent-2` (orange) — online adjustable |
| NVM | `#3d1a4d` (purple) — persisted across power cycle |

## Rules

- Flash parameters: read-only badge annotation (cannot be modified online)
- RAM parameters: editable badge — these can be adjusted during vehicle lifetime
- NVM parameters: persist badge — written at manufacturing/service time
- ASIL > QM parameters with no linked safety goal: show a yellow warning indicator
- Variant-coded parameters: show variant name chips (e.g. "VariantA", "NMC") in the detail dialog
- If A2L file is provided, parse /CHARACTERISTIC, /AXIS_PTS, and /MEASUREMENT sections
- Maps and Curves with > 8 axis points: show axis point count rather than all values

## Input

AUTOSAR CalPrm ARXML export, A2L calibration database file, or CSV with columns `group, asil, section, addr_start, addr_end, name, type, dims, range, unit, default, dtype, variant, safety_goal`.

## Output

Path to the generated `.html` calibration parameter map.
