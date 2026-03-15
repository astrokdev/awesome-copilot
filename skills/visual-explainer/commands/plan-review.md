# /plan-review

Compare an implementation plan against the actual codebase state. Render gaps, mismatches, and alignments visually.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme tokens
3. Read the plan (markdown, ticket list, or specification document)
4. Analyze the codebase for the planned items:
   - Files, functions, or modules that should exist per the plan
   - Items present in plan but missing in code → **gap**
   - Items in code not mentioned in plan → **undocumented addition**
   - Items present in both → **aligned**
5. Read `references/css-patterns.md` for table and card patterns
6. Read `references/responsive-nav.md` — apply sticky TOC for the three-panel report
7. Generate a three-panel HTML report:
   - **Aligned** (green): plan item ↔ code artifact confirmed
   - **Gap** (amber/red): plan item with no corresponding code
   - **Undocumented** (blue): code artifact not in plan
8. Include a coverage metric: `N of M plan items implemented (X%)`
9. Apply Data-Dense or Editorial aesthetic
10. Quality checks: every plan item classified, every finding has a code reference
11. Write to `~/.agent/diagrams/plan-review-<slug>.html`

## Rules

- Every plan item must be classified — no omissions
- Code references must include file path and line number where possible
- Gap severity: distinguish "not started", "partial", and "wrong implementation"
- If ASIL requirements are in the plan, flag unimplemented safety items with red Safety Criticality Color

## Input

Implementation plan + codebase access (or code summary).

## Output

Path to the generated `.html` plan review report.
