# Libraries & CDN Reference

CDN links and configuration for all external libraries used by the Visual Explainer skill. Use these exact URLs — do not guess or invent CDN links.

---

## Fonts (Google Fonts CDN)

Always load fonts via `<link>` in `<head>`. Pick one pairing per output and vary between sessions.

```html
<!-- Pairing 1: DM Sans + Fira Code (default, technical) -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Fira+Code:wght@400;500&display=swap" rel="stylesheet">

<!-- Pairing 2: Instrument Serif + JetBrains Mono (editorial, warm) -->
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<!-- Pairing 3: IBM Plex Sans + IBM Plex Mono (technical, IBM) -->
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<!-- Pairing 4: Bricolage Grotesque + Fragment Mono (modern, distinctive) -->
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@400;500;600;700&family=Fragment+Mono&display=swap" rel="stylesheet">

<!-- Pairing 5: Plus Jakarta Sans + Azeret Mono (clean, developer) -->
<link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Azeret+Mono:wght@400;500&display=swap" rel="stylesheet">
```

---

## Mermaid.js

For flowcharts, sequence diagrams, ER, state machines, class diagrams, C4, Gantt.

```html
<script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
<script>
  mermaid.initialize({
    startOnLoad: true,
    theme: 'base',
    themeVariables: {
      primaryColor: 'var(--accent)',
      primaryTextColor: 'var(--text)',
      primaryBorderColor: 'var(--border-strong)',
      lineColor: 'var(--border-strong)',
      secondaryColor: 'var(--surface-raised)',
      tertiaryColor: 'var(--surface)',
      background: 'var(--surface)',
      mainBkg: 'var(--surface)',
      nodeBorder: 'var(--border-strong)',
      clusterBkg: 'var(--bg)',
      titleColor: 'var(--text)',
      edgeLabelBackground: 'var(--surface)',
      fontFamily: 'DM Sans, sans-serif',
    }
  });
</script>
```

**Mermaid usage rules:**
- Always wrap in `.ve-mermaid-container` — never bare
- Use `class="mermaid"` on the `<pre>` or `<div>` element
- For dark theme: re-initialize with `theme: 'dark'` in `prefers-color-scheme: dark`

---

## Chart.js

For data visualization: bar charts, line charts, pie/doughnut, radar, scatter.

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
```

**Chart.js usage rules:**
- Use `var(--accent)` for primary dataset color
- Use `var(--accent-2)` for secondary dataset
- Set `backgroundColor` with `rgba()` at 0.7 opacity for fills
- Always set `responsive: true, maintainAspectRatio: false` on the chart options
- Set font family: `Chart.defaults.font.family = 'DM Sans, sans-serif'`

---

## Highlight.js (code syntax highlighting)

For diff-review and code-containing pages.

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github.min.css">
<script src="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/highlight.min.js"></script>
<script>hljs.highlightAll();</script>
```

For dark theme, swap stylesheet:
```html
<!-- Dark theme variant -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11/build/styles/github-dark.min.css">
```

---

## No Other External Resources

The Visual Explainer skill uses **only** the libraries listed above. Do not add:
- Tailwind CSS
- Bootstrap
- React or any JS framework
- Any image CDN or external image URLs
- Any analytics or tracking scripts

All other visual elements must be implemented with vanilla CSS and the libraries above.
