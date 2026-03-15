# /fact-check

Verify the accuracy of a technical document against source code, specifications, or standards. Render a visual accuracy report.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme tokens
3. Read the document to be verified
4. Read the reference sources (code, spec, standard)
5. For each verifiable claim in the document:
   - **Confirmed**: claim matches source → green badge
   - **Inaccurate**: claim contradicts source → red badge + correction
   - **Outdated**: claim was correct but source has changed → amber badge
   - **Unverifiable**: no source found to confirm or deny → grey badge
6. Read `references/css-patterns.md` for table and annotation patterns
7. Read `references/responsive-nav.md` — apply sticky TOC and filter controls for multi-section report
8. Generate HTML report:
   - Summary scorecard: X confirmed, Y inaccurate, Z outdated, W unverifiable
   - Document text with inline claim badges
   - Side panel: source references for each finding
   - Filter controls: show only inaccurate, only outdated, etc.
9. Apply Data-Dense or Editorial aesthetic
10. Quality checks: every verifiable claim assessed, source citations present
11. Write to `~/.agent/diagrams/fact-check-<slug>.html`

## Rules

- Never mark a claim as "confirmed" without a specific source reference
- Inaccurate claims must include the correct value and source
- Outdated claims must include the current value and the version/date it changed
- If document contains safety claims (ASIL, SIL, compliance), prioritize those first

## Input

Document to verify + reference sources (code, standards, specifications).

## Output

Path to the generated `.html` fact-check report.
