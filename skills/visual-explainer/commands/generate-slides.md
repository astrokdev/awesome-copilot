# /generate-slides

Generate a magazine-quality slide deck as a self-contained HTML file. Each slide is 100dvh.

**Opt-in only** — only generate slides when the user explicitly requests a slide deck or presentation.

## Aesthetic Presets

| Preset | Character |
|--------|-----------|
| Midnight Editorial | Dark background, bold serif headlines, editorial photography slots |
| Warm Signal | Off-white, terracotta accents, humanist sans, warm and approachable |
| Terminal Mono | Dark, monospace, green/amber accent — for technical/developer audiences |
| Swiss Clean | White, geometric sans, minimal color, maximum whitespace |

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load company brand colors; adapt preset to use `--accent` and `--accent-2`
3. Read `templates/slide-deck.html` — study the slide container structure, scroll-snap setup, and keyboard navigation
4. Read `references/slide-patterns.md` — 10 slide type patterns
5. Read `references/css-patterns.md` — depth tiers, typography, layout
6. Plan the story arc: **impact → context → deep dive → resolution**
7. Assign a slide type to each story beat (title, data, quote, diagram, timeline, etc.)
8. Vary composition between slides — avoid repeating the same layout twice in a row
9. Generate HTML:
   - Each slide: `<section class="slide">` with `height: 100dvh`
   - Keyboard navigation: arrow keys + click
   - Slide counter in corner
   - Print-friendly: each slide fits one page
10. Quality checks: narrative flows, visual variety present, all data points included
11. Write to `~/.agent/diagrams/slides-<slug>.html`

## Rules

- Every slide must have a distinct visual composition from its neighbors
- No bullet-point-only slides — always pair text with a visual element
- Brand colors from `themes.md` take precedence over preset defaults
- Include a progress indicator (slide X of N)
- If ASIL/SIL levels appear, use Safety Criticality Colors from `themes.md`

## Input

Topic, outline, or content to present.

## Output

Path to the generated `.html` slide deck file.
