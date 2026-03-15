# CSS Patterns Reference

Reusable CSS patterns for Visual Explainer HTML pages. Always use CSS custom properties from `themes.md` — never hardcode hex values in component styles.

---

## Core Setup

### Theme Variables (apply from themes.md)
```css
:root {
  --bg: #f5f5f0;
  --surface: #ffffff;
  --surface-raised: #fafaf8;
  --border: #e0ddd8;
  --border-strong: #b0aca6;
  --text: #1a1a1a;
  --text-dim: #6b6b6b;
  --accent: #005a9e;
  --accent-2: #c05a2e;
  --code-bg: #f0ede8;
  --shadow: rgba(0,0,0,0.08);
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #0f0f0f;
    --surface: #1c1c1c;
    /* ... dark tokens from themes.md ... */
  }
}

body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'DM Sans', sans-serif;
  line-height: 1.6;
}
```

### Depth Tiers
```css
/* hero — primary focal point */
.depth-hero {
  background: var(--accent);
  color: var(--text-inverse);
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 24px var(--shadow);
}

/* elevated — secondary importance */
.depth-elevated {
  background: var(--surface-raised);
  border: 1px solid var(--border-strong);
  padding: 1.5rem;
  border-radius: 6px;
  box-shadow: 0 2px 8px var(--shadow);
}

/* default — normal content */
.depth-default {
  background: var(--surface);
  border: 1px solid var(--border);
  padding: 1rem;
  border-radius: 4px;
}

/* recessed — background / secondary */
.depth-recessed {
  background: var(--bg);
  border: 1px solid var(--border);
  padding: 0.75rem;
  border-radius: 4px;
}
```

---

## Layout Patterns

### Architecture Card Grid
```css
.ve-card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.5rem;
  padding: 2rem;
}

.ve-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.25rem;
  position: relative;
}

.ve-card-title {
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-dim);
  margin-bottom: 0.5rem;
}

.ve-card-name {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--text);
}
```

### SVG Connector Lines
```css
.ve-connector-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  overflow: visible;
}

.ve-connector-line {
  stroke: var(--border-strong);
  stroke-width: 1.5;
  fill: none;
}

.ve-connector-arrow {
  fill: var(--border-strong);
}
```

### Timeline Grid
```css
.ve-timeline {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 0;
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}

.ve-timeline-label {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--border);
  border-right: 1px solid var(--border);
  font-size: 0.8125rem;
  font-family: 'Fira Code', monospace;
  color: var(--text-dim);
  display: flex;
  align-items: center;
}

.ve-timeline-track {
  padding: 0.375rem 0.5rem;
  border-bottom: 1px solid var(--border);
  position: relative;
  background: var(--surface);
}
```

---

## Mermaid Container
```css
/* Always wrap Mermaid in .ve-mermaid-container — never bare */
.ve-mermaid-container {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 1.5rem;
  overflow: auto;
  position: relative;
}

.ve-mermaid-container svg {
  display: block;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
}

.ve-mermaid-controls {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  gap: 0.5rem;
}

.ve-mermaid-btn {
  background: var(--surface-raised);
  border: 1px solid var(--border);
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  font-size: 0.75rem;
  cursor: pointer;
  color: var(--text-dim);
}

.ve-mermaid-btn:hover { border-color: var(--border-strong); color: var(--text); }
```

---

## Tables
```css
.ve-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.875rem;
}

.ve-table th {
  background: var(--surface-raised);
  border-bottom: 2px solid var(--border-strong);
  padding: 0.625rem 1rem;
  text-align: left;
  font-weight: 600;
  color: var(--text-dim);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.ve-table td {
  border-bottom: 1px solid var(--border);
  padding: 0.625rem 1rem;
  color: var(--text);
}

.ve-table tr:hover td { background: var(--surface-raised); }
```

---

## Code Blocks
```css
.ve-code {
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  padding: 1rem 1.25rem;
  font-family: 'Fira Code', 'JetBrains Mono', monospace;
  font-size: 0.8125rem;
  line-height: 1.7;
  overflow-x: auto;
  color: var(--text);
  white-space: pre;
}

/* Preserve formatting — critical for linker scripts, DBC, etc. */
.ve-code * { white-space: pre; }
```

---

## Badges / Pills
```css
.ve-badge {
  display: inline-block;
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  font-size: 0.6875rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 1px solid currentColor;
}

/* Safety criticality — from themes.md */
.ve-badge.asil-d { background: #7b0000; color: #fff; border-color: #ff2222; }
.ve-badge.asil-c { background: #b34700; color: #fff; border-color: #ff6600; }
.ve-badge.asil-b { background: #806600; color: #fff; border-color: #ffcc00; }
.ve-badge.asil-a { background: #1a5c1a; color: #fff; border-color: #33cc33; }
.ve-badge.qm     { background: #1a3a5c; color: #fff; border-color: #3399ff; }
.ve-badge.decomposed { background: #3d1a5c; color: #fff; border-color: #9966ff; }
```

---

## Responsive Behavior
```css
/* Always test at 1280px and 768px */
@media (max-width: 768px) {
  .ve-card-grid {
    grid-template-columns: 1fr;
  }

  .ve-timeline {
    grid-template-columns: 120px 1fr;
  }

  .ve-table {
    font-size: 0.75rem;
  }

  .ve-table th, .ve-table td {
    padding: 0.5rem 0.625rem;
  }
}
```

---

## Key Rules

- **Never use `.node` class** — it conflicts with Mermaid internals. Use `.ve-card` instead.
- **`min-width: 0` on flex children** — prevents overflow in flex containers.
- **Center Mermaid diagrams** — always `display: block; margin: 0 auto` on the SVG.
- **Semantic theming** — every color must reference a CSS custom property from `:root`.
- **No hardcoded hex values** in component rules — only in `:root` definitions (from themes.md).
