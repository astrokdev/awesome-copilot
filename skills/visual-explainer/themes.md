# Visual Explainer — Company Color Themes

This file is read by the Visual Explainer skill **before generating any HTML**.
Apply the active theme's CSS custom properties as `:root` variables.
Use the Safety Criticality Colors for any ASIL/SIL/safety-annotated content.
Use the Diagram-Type Palettes for domain-specific visualizations.

---

## Active Theme: `corporate-light`

To switch themes, change the value above to one of: `corporate-light`, `corporate-dark`, `blueprint`, `terminal-mono`.

---

## Base Theme Palettes

### `corporate-light`

| Token | Value | Semantic Role |
|-------|-------|---------------|
| `--bg` | `#f5f5f0` | Page background |
| `--surface` | `#ffffff` | Card / panel background |
| `--surface-raised` | `#fafaf8` | Elevated surface (modal, tooltip) |
| `--border` | `#e0ddd8` | Borders, dividers |
| `--border-strong` | `#b0aca6` | Emphasized borders |
| `--text` | `#1a1a1a` | Primary text |
| `--text-dim` | `#6b6b6b` | Captions, labels, secondary |
| `--text-inverse` | `#ffffff` | Text on dark backgrounds |
| `--accent` | `#005a9e` | Primary brand accent |
| `--accent-hover` | `#004880` | Accent hover state |
| `--accent-2` | `#c05a2e` | Secondary accent |
| `--accent-2-hover` | `#a04820` | Secondary accent hover |
| `--code-bg` | `#f0ede8` | Inline code background |
| `--shadow` | `rgba(0,0,0,0.08)` | Card shadow |

### `corporate-dark`

| Token | Value | Semantic Role |
|-------|-------|---------------|
| `--bg` | `#0f0f0f` | Page background |
| `--surface` | `#1c1c1c` | Card / panel background |
| `--surface-raised` | `#242424` | Elevated surface |
| `--border` | `#2e2e2e` | Borders, dividers |
| `--border-strong` | `#444444` | Emphasized borders |
| `--text` | `#e8e8e8` | Primary text |
| `--text-dim` | `#888888` | Captions, labels, secondary |
| `--text-inverse` | `#0f0f0f` | Text on light backgrounds |
| `--accent` | `#4da6ff` | Primary brand accent |
| `--accent-hover` | `#70b8ff` | Accent hover state |
| `--accent-2` | `#e07a4e` | Secondary accent |
| `--accent-2-hover` | `#f09060` | Secondary accent hover |
| `--code-bg` | `#242424` | Inline code background |
| `--shadow` | `rgba(0,0,0,0.4)` | Card shadow |

### `blueprint`

| Token | Value | Semantic Role |
|-------|-------|---------------|
| `--bg` | `#0a1628` | Deep navy background |
| `--surface` | `#0d1f3c` | Panel background |
| `--surface-raised` | `#102448` | Elevated panel |
| `--border` | `#1e3a5f` | Grid lines, borders |
| `--border-strong` | `#2e5a8f` | Emphasized borders |
| `--text` | `#c8d8e8` | Primary text |
| `--text-dim` | `#7090b0` | Dim annotations |
| `--text-inverse` | `#0a1628` | Text on light areas |
| `--accent` | `#4da6ff` | Blueprint highlight |
| `--accent-hover` | `#70b8ff` | Hover |
| `--accent-2` | `#00d4aa` | Secondary (teal) |
| `--accent-2-hover` | `#00f0c0` | Secondary hover |
| `--code-bg` | `#061020` | Code background |
| `--shadow` | `rgba(0,0,0,0.6)` | Shadow |

### `terminal-mono`

| Token | Value | Semantic Role |
|-------|-------|---------------|
| `--bg` | `#0d0d0d` | Terminal background |
| `--surface` | `#141414` | Panel |
| `--surface-raised` | `#1a1a1a` | Elevated |
| `--border` | `#333333` | Borders |
| `--border-strong` | `#555555` | Strong borders |
| `--text` | `#33ff33` | Primary (green) |
| `--text-dim` | `#228822` | Dim |
| `--text-inverse` | `#0d0d0d` | Inverse |
| `--accent` | `#33ff33` | Green accent |
| `--accent-hover` | `#66ff66` | Hover |
| `--accent-2` | `#ffbb00` | Amber accent |
| `--accent-2-hover` | `#ffcc33` | Hover |
| `--code-bg` | `#0a0a0a` | Code background |
| `--shadow` | `rgba(0,255,0,0.1)` | Glow shadow |

---

## Safety Criticality Colors

Use these for any content annotated with ASIL (ISO 26262), SIL (IEC 61508), or similar safety integrity levels.
Apply as background + text + border on badges, matrix cells, and table rows.

| Level | `--safety-bg` | `--safety-text` | `--safety-border` | Usage |
|-------|--------------|-----------------|-------------------|-------|
| ASIL-D / SIL-4 | `#7b0000` | `#ffffff` | `#ff2222` | Highest safety criticality |
| ASIL-C / SIL-3 | `#b34700` | `#ffffff` | `#ff6600` | High criticality |
| ASIL-B / SIL-2 | `#806600` | `#ffffff` | `#ffcc00` | Medium criticality |
| ASIL-A / SIL-1 | `#1a5c1a` | `#ffffff` | `#33cc33` | Low criticality |
| QM / SIL-0 | `#1a3a5c` | `#ffffff` | `#3399ff` | Quality managed, no safety claim |
| Decomposed | `#3d1a5c` | `#ffffff` | `#9966ff` | Safety goal decomposed across SWCs |

**CSS helper pattern:**
```css
.asil-d { background: #7b0000; color: #fff; border: 1px solid #ff2222; }
.asil-c { background: #b34700; color: #fff; border: 1px solid #ff6600; }
.asil-b { background: #806600; color: #fff; border: 1px solid #ffcc00; }
.asil-a { background: #1a5c1a; color: #fff; border: 1px solid #33cc33; }
.qm     { background: #1a3a5c; color: #fff; border: 1px solid #3399ff; }
.decomposed { background: #3d1a5c; color: #fff; border: 1px solid #9966ff; }
```

---

## Diagram-Type Palettes

Override `--accent` and `--accent-2` per diagram type when domain identity matters more than brand consistency.

| Diagram Type | `--diag-primary` | `--diag-secondary` | `--diag-highlight` | Notes |
|---|---|---|---|---|
| AUTOSAR SWC | `#003366` | `#336699` | `#99ccff` | Blueprint-style, port connectors |
| CAN Timing | `#1a4d1a` | `#336633` | `#99cc99` | Green = active signal window |
| Memory Map | `#3d1a4d` | `#6633aa` | `#cc99ff` | Purple tones for address space |
| FMEA / TARA | uses Safety Criticality Colors above | | | Cell color = risk level |
| MISRA Heatmap | gradient: `#1a5c1a` → `#806600` → `#7b0000` | | | Green=clean, red=violations |
| DTC Catalog | `#4da6ff` (accent) | `#7090b0` | `#c8d8e8` | Blueprint dark; status/severity drive color |
| Test Coverage | `#1a5c1a` (pass) | `#806600` (warn) | `#7b0000` (fail) | Coverage bars green→amber→red vs. ASIL threshold |
| RTE Timing | uses Safety Criticality Colors for task tracks | | | Task color = highest ASIL runnable in task |
| Signal Routing | CAN `#1a4d1a` / LIN `#4d3300` / ETH `#003366` | `#2e5a8f` | `#4da6ff` | Bus type drives arrow and swimlane color |
| Calibration Map | `#003366` (Map) / `#1a4d1a` (Curve) / `#4d3300` (Scalar) | | | Parameter type drives badge color |
| Boot Sequence | `#4d1a00`→`#003366`→`#1a4d1a`→`#3d1a4d`→`#806600`→`#1a5c1a` | `#ff6600` (WDG) | `#7b0000` (error) | Ordered phase colors; blueprint background |

---

## How to Apply in Generated HTML

```html
<style>
  :root {
    /* Paste active theme tokens here */
    --bg: #f5f5f0;
    --surface: #ffffff;
    --border: #e0ddd8;
    --text: #1a1a1a;
    --text-dim: #6b6b6b;
    --accent: #005a9e;
    --accent-2: #c05a2e;
    /* ... all tokens from active theme ... */
  }

  @media (prefers-color-scheme: dark) {
    :root {
      /* Paste corporate-dark tokens here */
      --bg: #0f0f0f;
      /* ... */
    }
  }

  body { background: var(--bg); color: var(--text); }
</style>
```

For domain diagrams, add diagram palette tokens alongside base theme:
```css
:root {
  /* base theme ... */
  --diag-primary: #003366;    /* AUTOSAR example */
  --diag-secondary: #336699;
  --diag-highlight: #99ccff;
}
```
