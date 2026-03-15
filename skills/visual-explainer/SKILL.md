---
name: visual-explainer
description: 'Generate self-contained HTML pages that explain complex technical content visually — diagrams, tables, slide decks, timelines, and embedded/automotive domain visualizations. Supports AUTOSAR SWC, CAN timing, MISRA heatmaps, FMEA risk matrices, and MCU memory maps with company color themes.'
---

# Visual Explainer

> Based on [nicobailon/visual-explainer](https://github.com/nicobailon/visual-explainer). Extended with embedded and automotive domain templates, company theming, and ASIL/SIL color semantics.

Convert complex technical content into beautiful, self-contained HTML pages. Replace ASCII art, terminal tables, and plaintext diagrams with styled web pages using proper typography, interactive diagrams, and semantic color coding.

## When to Use

- About to render an ASCII table with 4+ rows or 3+ columns → generate HTML instead
- Explaining an architecture, data flow, or system topology
- Creating a slide deck or visual presentation
- Reviewing code diffs or implementation plans visually
- Visualizing AUTOSAR composition, CAN bus timing, FMEA risk matrices, MISRA violations, or MCU memory layouts

## Color Theme Configuration

**Before generating any HTML, read `themes.md`** (located in the same folder as this file). Apply the CSS custom properties from the active theme section as `:root` variables. Use the Safety Criticality Colors whenever content includes ASIL, SIL, or AUTOSAR safety levels. Use the Diagram-Type Palettes for domain-specific visualizations.

```
skills/visual-explainer/
├── SKILL.md          ← you are here
├── themes.md         ← READ THIS FIRST before any HTML generation
├── commands/         ← slash command prompts
├── references/       ← CSS patterns, font/library guides, domain semantics
└── templates/        ← reference HTML files (study before generating)
```

## Commands

### General Visual Explanation
| Command | Purpose |
|---------|---------|
| `/generate-web-diagram` | Any topic → styled HTML diagram |
| `/generate-visual-plan` | Implementation plan → visual roadmap |
| `/generate-slides` | Topic → magazine-quality slide deck |
| `/diff-review` | Code diff → visual comparison |
| `/plan-review` | Plan vs. codebase → gap analysis |
| `/project-recap` | Codebase → mental model snapshot |
| `/fact-check` | Document → accuracy verification report |
### Embedded & Automotive Domain
| Command | Purpose |
|---------|---------|
| `/generate-autosar-swc` | AUTOSAR composition → SWC port diagram |
| `/generate-can-timing` | DBC messages → CAN timing diagram |
| `/generate-misra-heatmap` | MISRA checker output → violation heatmap |
| `/generate-fmea-matrix` | FMEA/TARA data → risk matrix |
| `/generate-memory-map` | Linker script / region list → MCU memory map |

## Aesthetic Principles

**Constrained aesthetics — pick one direction per output:**

| Direction | Character |
|-----------|-----------|
| Blueprint | Technical drafting — dark navy, hairline grids, monospace annotations |
| Editorial | Magazine typography — strong hierarchy, generous whitespace, serif accents |
| Paper/Ink | Document-like — off-white, subtle texture, ink-dark text |
| Terminal Mono | Code-first — dark background, green/amber accent, monospace throughout |
| IDE-Inspired | Developer tool aesthetic — familiar sidebar + main panel layout |
| Data-Dense | Information-rich — compact, tabular, high information-to-space ratio |

**Forbidden patterns (quality signals to avoid):**
- Inter font + violet accents (generic SaaS look)
- Emoji headers
- Glowing cards or neon colors (unless Terminal Mono)
- Gradient text or gradient mesh backgrounds
- Bare unstyled Mermaid diagrams without container treatment

## Typography

**Curated font pairings (Google Fonts CDN):**
- DM Sans + Fira Code
- Instrument Serif + JetBrains Mono
- IBM Plex Sans + IBM Plex Mono
- Bricolage Grotesque + Fragment Mono
- Plus Jakarta Sans + Azeret Mono

Vary font pairing between outputs to avoid visual sameness.

## Output Rules

- **Single self-contained `.html` file** — no external assets except CDN (fonts, Mermaid.js, Chart.js)
- Default output path: `~/.agent/diagrams/`
- Always include both light and dark theme support via `prefers-color-scheme`
- CSS custom properties for all colors — never hardcode hex values in component styles
- Mermaid diagrams: wrap in a container with zoom/pan controls, never bare
- Tables: styled with hover states, never raw `<table>` without CSS

## Diagram Types

**Mermaid (via mermaid.js CDN):**
- Flowcharts, sequence diagrams, ER diagrams, state machines, class diagrams, C4 architecture, Gantt

**CSS/HTML native:**
- Architecture cards with CSS Grid connectors
- Data tables with sort/filter
- Timeline / roadmap
- Dashboard with Chart.js metrics
- Slide decks (100dvh per slide, magazine layout)
- AUTOSAR SWC composition
- CAN timing timeline
- MISRA heatmap
- FMEA risk matrix
- MCU memory map

## Quality Checks (run before delivering)

1. **Squint test** — blurred view: is the hierarchy still readable?
2. **Swap test** — could this visual style work for a different domain? If yes, add more domain-specific character.
3. **Responsive** — does it work at 1280px and 768px?
4. **Completeness** — does every data point from the input appear in the output?

## Workflow

1. **Think** — identify diagram type, select aesthetic direction, check if domain-specific template applies
2. **Read themes.md** — load active theme CSS properties and safety color mappings
3. **Read the matching template** from `templates/` — study structure before writing
4. **Read relevant reference** from `references/` — css-patterns.md for layout, libraries.md for CDN links
5. **Structure** — plan the HTML sections and component hierarchy
6. **Style** — apply theme, typography, depth tiers (hero → elevated → default → recessed)
7. **Deliver** — write the file, run quality checks, report the output path
