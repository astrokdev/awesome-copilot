# /generate-web-diagram

Generate a self-contained HTML diagram page for any technical topic.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme tokens and any applicable domain palette
3. Read `templates/mermaid-flowchart.html` or `templates/architecture.html` (whichever fits)
4. Read `references/css-patterns.md` for layout and depth tier patterns
5. Read `references/libraries.md` for correct CDN links and Mermaid theming
6. Identify the best diagram type for the content:
   - Relationships / flows → Mermaid flowchart
   - System topology → CSS Grid architecture cards
   - Sequences / interactions → Mermaid sequence
   - State machines → Mermaid stateDiagram
   - Data / metrics → Chart.js dashboard
7. Select an aesthetic direction (Blueprint, Editorial, Paper/Ink, Terminal Mono, IDE-Inspired, Data-Dense)
8. Vary font pairing from any previous output in this session
9. Generate the HTML file — single self-contained file, no external assets except CDN
10. Apply quality checks: squint test, swap test, responsive at 1280px and 768px, completeness
11. Write to `~/.agent/diagrams/<topic-slug>.html`
12. Report the file path

## Rules

- Wrap all Mermaid diagrams in a `.ve-mermaid-container` with zoom/pan controls — never bare
- Use CSS custom properties from `themes.md` — never hardcode hex values in component styles
- Include `prefers-color-scheme: dark` media query using dark theme tokens from `themes.md`
- If the topic is structural (not data-driven), skip AI illustrations
- If content has ASIL/SIL annotations, apply Safety Criticality Colors from `themes.md`

## Input

The user provides a topic, code snippet, architecture description, or raw data to visualize.

## Output

Path to the generated `.html` file. Optionally open it in the browser.
