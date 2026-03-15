# /project-recap

Generate a visual mental model snapshot of a codebase — architecture, key modules, data flows, and entry points.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme tokens
3. Read `templates/architecture.html` — study the component card pattern
4. Read `references/css-patterns.md` — grid layout and connector patterns
5. Read `references/responsive-nav.md` — apply sticky TOC if output has 4+ sections
6. Analyze the codebase:
   - Identify top-level modules and their responsibilities
   - Trace main data flows and control paths
   - Identify external dependencies and integration points
   - Note ASIL/safety-critical modules for callout treatment
7. Select Architecture Card layout with Mermaid C4 or flowchart for data flow
8. Apply Blueprint or IDE-Inspired aesthetic (technical audiences)
9. Generate HTML with:
   - Module cards (name, responsibility, key exports)
   - Connector lines showing dependencies and data flows
   - External dependency badges
   - ASIL badges on safety-critical components (Safety Criticality Colors from `themes.md`)
   - Entry points highlighted with `--accent` color
10. Quality checks: all top-level modules present, no orphaned cards, flows are traceable
11. Write to `~/.agent/diagrams/recap-<slug>.html`

## Rules

- Every top-level module must appear — even if responsibility is "unknown"
- Mark safety-critical modules prominently — use ASIL badge from `themes.md`
- Connector lines must show direction (arrow toward dependent)
- Include a legend explaining card color, badge meaning, and connector types

## Input

Codebase (file tree, source files, or high-level description).

## Output

Path to the generated `.html` architecture recap file.
