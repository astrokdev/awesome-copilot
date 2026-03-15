# /generate-misra-heatmap

Render a MISRA violation heatmap — files as cells, color intensity proportional to violation count, with rule category breakdown.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load MISRA Heatmap gradient (`green #1a5c1a → amber #806600 → red #7b0000`)
3. Read `templates/misra-heatmap.html` — study the grid cell and color ramp pattern
4. Read `references/embedded-color-semantics.md` — MISRA rule category conventions
5. Parse the input (MISRA checker output — CSV, plain text log, or JSON):
   - Per file: violation count by rule category
   - Rule categories: Mandatory, Required, Advisory
   - MISRA-C:2012 rule groups: Directives (Dir), Rules (Rule)
6. Compute per-file severity score:
   - Mandatory violations weight 3×, Required 2×, Advisory 1×
   - Normalize scores to 0–100 scale for color mapping
7. Generate HTML layout:
   - File tree heatmap: files as cells in a CSS Grid
   - Cell background: color ramp (green = 0 violations, red = maximum score)
   - Cell size: proportional to file line count (larger files = larger cells)
   - Click to expand: shows rule breakdown table for that file
   - Top-N violations sidebar: most frequent rules across the codebase
   - Summary header: total violations, mandatory count, required count, advisory count
8. Add filter controls: by file, by rule category, by minimum severity
9. Apply Data-Dense aesthetic
10. Quality checks: all files present, color scale correct, totals match input
11. Write to `~/.agent/diagrams/misra-heatmap-<slug>.html`

## MISRA Rule Category Colors

| Category | Color | Meaning |
|----------|-------|---------|
| Mandatory | Red `#7b0000` | Must not be violated — deviations not permitted |
| Required | Amber `#806600` | Must comply unless formal deviation documented |
| Advisory | Green `#1a5c1a` | Best practice, deviation needs brief justification |

## Rules

- Mandatory violations must be visually dominant — never hidden in a collapsed section
- Color scale must have a legend with numeric thresholds
- File paths must be shown in full (not truncated) on hover
- Zero-violation files: show as lightest green (not white — confirms they were checked)
- Export: include a "Copy CSV" button for the full violation table

## Input

MISRA checker output (PC-lint, Polyspace, Helix QAC, or similar tool output).

## Output

Path to the generated `.html` MISRA heatmap.
