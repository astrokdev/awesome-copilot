# /generate-fmea-matrix

Render an FMEA (Failure Mode and Effects Analysis) or TARA (Threat Analysis and Risk Assessment) risk matrix as an interactive HTML page.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load Safety Criticality Colors (cells colored by risk level)
3. Read `templates/fmea-matrix.html` — study the matrix grid and item chip pattern
4. Read `references/embedded-color-semantics.md` — ASIL derivation and risk matrix conventions
5. Detect mode from input:
   - **FMEA mode** (ISO 26262): axes = Severity (S1–S3) × Exposure (E1–E4) × Controllability (C1–C3) → ASIL
   - **TARA mode** (ISO 21434): axes = Impact (I1–I4) × Attack Feasibility (AF1–AF4) → Risk Level
6. Parse input data:
   - Item ID, failure mode / threat description, S/E/C ratings or I/AF ratings
   - Current safety/security controls, ASIL/risk level (calculated or given)
   - Optional: component name, responsible engineer, status
7. Generate HTML layout:
   - 2D risk matrix grid (Severity × Controllability for FMEA, Impact × Feasibility for TARA)
   - Cell background: Safety Criticality Colors from `themes.md` based on resulting ASIL/risk
   - Items: chips placed in their risk cell, click to expand full FMEA/TARA entry
   - Summary panel: item count per ASIL level, unmitigated high-risk items highlighted
   - Filter bar: by component, by ASIL level, by status
8. Include ASIL derivation table (ISO 26262 Table 4) or TARA risk acceptance criteria as reference sidebar
9. Export button: download all items as CSV
10. Quality checks: all items placed, ASIL derivation correct, no items hidden by default
11. Write to `~/.agent/diagrams/fmea-matrix-<slug>.html`

## ASIL Derivation (ISO 26262 — FMEA mode)

| S \ E×C | E1 | E2 | E3 | E4 |
|---------|----|----|----|----|
| S3, C3 | A | B | C | D |
| S3, C2 | A | A | B | C |
| S3, C1 | QM | QM | A | B |
| S2, C3 | QM | A | B | C |
| S2, C2 | QM | QM | A | B |
| S1 / C0 | QM | QM | QM | A |

## Rules

- ASIL-D cells must be the most visually prominent — use Safety Criticality Colors
- QM cells: blue (`#1a3a5c`) — visually distinct from safety levels
- Every item must show its S, E, C (or I, AF) ratings in the expanded view
- Unmitigated ASIL-C/D or high TARA risk items: show a warning indicator
- ASIL decomposed items: use Decomposed color from `themes.md`

## Input

FMEA table data (CSV, markdown table, or prose), or TARA threat list from the `tara-analysis` skill output.

## Output

Path to the generated `.html` FMEA / TARA risk matrix.
