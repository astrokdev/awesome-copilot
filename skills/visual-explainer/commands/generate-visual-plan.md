# /generate-visual-plan

Convert an implementation plan, roadmap, or task list into a visual HTML page.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme tokens
3. Read `references/css-patterns.md` — timeline and card layout patterns
4. Read `references/libraries.md` — CDN links
5. Analyze the plan:
   - Identify phases, milestones, and dependencies
   - Classify tasks by status (planned, in-progress, complete, blocked)
   - Detect any ASIL/safety annotations → apply Safety Criticality Colors
6. Select layout:
   - Linear timeline for sequential plans
   - Kanban-style columns for parallel workstreams
   - Mermaid Gantt for schedule-heavy plans with dates
7. Apply Editorial or Data-Dense aesthetic (avoids distraction for planning documents)
8. Generate self-contained HTML
9. Quality checks: all tasks visible, status color legend present, dependencies shown
10. Write to `~/.agent/diagrams/plan-<slug>.html`

## Rules

- Every task/milestone from the input must appear in the output
- Status colors must be consistent and include a legend
- Dependencies rendered as connecting lines or arrows, not just implied by order
- If dates are present, show them — do not omit temporal information

## Input

Implementation plan (markdown list, Jira export, text description, or existing document).

## Output

Path to the generated `.html` file.
