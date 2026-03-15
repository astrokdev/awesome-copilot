# /diff-review

Render a code diff or set of changes as a visual side-by-side comparison HTML page.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme tokens
3. Read `references/css-patterns.md` — code block and table patterns
4. Parse the diff:
   - Identify added lines (green), removed lines (red), context lines (neutral)
   - Group changes into logical hunks with file/function headers
   - Annotate each hunk with a short description of the change's intent
5. Select IDE-Inspired or Data-Dense aesthetic (appropriate for code review)
6. Layout options:
   - **Unified** (default): single column, inline +/- markers
   - **Split**: two columns, old left / new right (use when changes are structural)
7. Generate HTML:
   - Syntax highlight using `highlight.js` (CDN)
   - Collapsible hunks for large diffs
   - Summary header: files changed, lines added/removed, net delta
   - Change intent annotations beside each hunk
8. Quality checks: every changed line present, no context lines missing, annotations accurate
9. Write to `~/.agent/diagrams/diff-<slug>.html`

## Rules

- Added lines: `background: rgba(0,200,0,0.15)` — never saturated green
- Removed lines: `background: rgba(200,0,0,0.15)` — never saturated red
- Unchanged context: use `--surface` background, `--text-dim` color
- Line numbers must be present and aligned
- Large diffs (>200 lines): collapse unchanged sections by default

## Input

Git diff output, PR diff, or two code blocks to compare.

## Output

Path to the generated `.html` diff review file.
