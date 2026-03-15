# Slide Patterns Reference

10 slide type patterns for `/generate-slides`. Each slide must have a distinct visual composition from its neighbors. Never repeat the same layout on consecutive slides.

---

## Slide Type 1: Title / Impact

**Use for:** Opening slide, chapter dividers, major section transitions.

```html
<section class="slide slide-title">
  <div class="slide-title-eyebrow">Section 01</div>
  <h1 class="slide-title-headline">The Core Problem</h1>
  <p class="slide-title-sub">A single sentence that frames the rest of the deck.</p>
  <div class="slide-title-accent"></div>
</section>
```

```css
.slide-title {
  justify-content: center;
  align-items: flex-start;
  background: var(--accent);
  color: var(--text-inverse);
}
.slide-title-eyebrow { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; opacity: 0.7; }
.slide-title-headline { font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 800; margin: 1rem 0; line-height: 1.1; }
.slide-title-sub { font-size: 1.25rem; opacity: 0.85; max-width: 40ch; }
.slide-title-accent { width: 4rem; height: 4px; background: var(--accent-2); margin-top: 2rem; }
```

---

## Slide Type 2: Two-Column (Text + Visual)

**Use for:** Explaining a concept with a supporting diagram.

```html
<section class="slide slide-two-col">
  <div class="slide-col-text">
    <h2>Key Finding</h2>
    <p>Supporting explanation in 2-3 sentences maximum.</p>
    <ul class="slide-bullets">
      <li>Point one</li>
      <li>Point two</li>
    </ul>
  </div>
  <div class="slide-col-visual">
    <!-- Mermaid diagram or chart -->
  </div>
</section>
```

```css
.slide-two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.slide-col-text h2 { font-size: 2rem; margin-bottom: 1rem; }
.slide-bullets { list-style: none; padding: 0; }
.slide-bullets li { padding: 0.5rem 0; padding-left: 1.5rem; position: relative; }
.slide-bullets li::before { content: '—'; position: absolute; left: 0; color: var(--accent); }
```

---

## Slide Type 3: Full-Width Diagram

**Use for:** Architecture diagrams, flowcharts, system topology.

```html
<section class="slide slide-diagram">
  <h2 class="slide-diagram-title">System Architecture</h2>
  <div class="ve-mermaid-container slide-diagram-content">
    <pre class="mermaid">graph TD ...</pre>
  </div>
</section>
```

```css
.slide-diagram { flex-direction: column; }
.slide-diagram-title { font-size: 1.25rem; margin-bottom: 1.5rem; color: var(--text-dim); }
.slide-diagram-content { flex: 1; }
```

---

## Slide Type 4: Data / Metrics

**Use for:** Key numbers, KPIs, benchmark results.

```html
<section class="slide slide-metrics">
  <h2>By the Numbers</h2>
  <div class="slide-metric-grid">
    <div class="slide-metric">
      <span class="slide-metric-value">98%</span>
      <span class="slide-metric-label">Code coverage</span>
    </div>
    <div class="slide-metric">
      <span class="slide-metric-value">4</span>
      <span class="slide-metric-label">ASIL-D components</span>
    </div>
  </div>
</section>
```

```css
.slide-metric-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; margin-top: 2rem; }
.slide-metric { text-align: center; padding: 2rem; background: var(--surface); border-radius: 8px; border: 1px solid var(--border); }
.slide-metric-value { display: block; font-size: clamp(3rem, 8vw, 6rem); font-weight: 800; color: var(--accent); line-height: 1; }
.slide-metric-label { display: block; font-size: 0.875rem; color: var(--text-dim); margin-top: 0.5rem; }
```

---

## Slide Type 5: Quote / Principle

**Use for:** Standards references, guiding principles, key requirements.

```html
<section class="slide slide-quote">
  <blockquote class="slide-blockquote">
    "Shall" requirements must be implemented unconditionally.
  </blockquote>
  <cite class="slide-cite">ISO 26262-1:2018, §3.139</cite>
</section>
```

```css
.slide-quote { justify-content: center; align-items: center; flex-direction: column; }
.slide-blockquote { font-size: clamp(1.5rem, 4vw, 2.5rem); font-style: italic; max-width: 30ch; text-align: center; line-height: 1.4; border-left: 4px solid var(--accent); padding-left: 2rem; }
.slide-cite { margin-top: 2rem; font-size: 0.875rem; color: var(--text-dim); font-family: 'Fira Code', monospace; }
```

---

## Slide Type 6: Timeline

**Use for:** Project roadmaps, development phase sequences, release schedules.

```html
<section class="slide slide-timeline">
  <h2>Project Phases</h2>
  <div class="slide-timeline-track">
    <div class="slide-timeline-item" data-status="complete">
      <div class="slide-timeline-dot"></div>
      <div class="slide-timeline-content">
        <strong>SWE.1 — Requirements</strong>
        <span>Q1 2025</span>
      </div>
    </div>
    <!-- repeat -->
  </div>
</section>
```

```css
.slide-timeline-track { display: flex; flex-direction: column; gap: 1rem; margin-top: 2rem; position: relative; }
.slide-timeline-track::before { content: ''; position: absolute; left: 0.875rem; top: 0; bottom: 0; width: 2px; background: var(--border); }
.slide-timeline-item { display: flex; gap: 1.5rem; align-items: flex-start; }
.slide-timeline-dot { width: 1.75rem; height: 1.75rem; border-radius: 50%; border: 2px solid var(--border); background: var(--surface); flex-shrink: 0; position: relative; z-index: 1; }
[data-status="complete"] .slide-timeline-dot { background: var(--accent); border-color: var(--accent); }
[data-status="active"] .slide-timeline-dot { background: var(--accent-2); border-color: var(--accent-2); }
```

---

## Slide Type 7: Code Comparison

**Use for:** Before/after code changes, diff highlights.

```html
<section class="slide slide-code-compare">
  <h2>Before → After</h2>
  <div class="slide-code-cols">
    <div>
      <p class="slide-code-label slide-code-before">Before</p>
      <pre class="ve-code"><code>/* old code */</code></pre>
    </div>
    <div>
      <p class="slide-code-label slide-code-after">After</p>
      <pre class="ve-code"><code>/* new code */</code></pre>
    </div>
  </div>
</section>
```

```css
.slide-code-cols { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; flex: 1; }
.slide-code-label { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 0.5rem; }
.slide-code-before { color: #cc4444; }
.slide-code-after { color: #44aa44; }
```

---

## Slide Type 8: Risk Matrix (mini)

**Use for:** Quick safety overview, ASIL summary, risk snapshot.

```html
<section class="slide slide-risk">
  <h2>Risk Summary</h2>
  <div class="slide-risk-grid">
    <!-- 3x3 or 4x4 colored cells with item count -->
    <div class="slide-risk-cell asil-d">ASIL-D<br><strong>4</strong></div>
    <div class="slide-risk-cell asil-c">ASIL-C<br><strong>7</strong></div>
  </div>
</section>
```

```css
.slide-risk-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-top: 2rem; }
.slide-risk-cell { padding: 1.5rem; border-radius: 6px; text-align: center; font-size: 0.875rem; }
.slide-risk-cell strong { display: block; font-size: 2rem; margin-top: 0.5rem; }
/* ASIL colors from themes.md */
```

---

## Slide Type 9: Process Flow

**Use for:** Workflow explanations, process descriptions, CI/CD pipelines.

```html
<section class="slide slide-process">
  <h2>Development Workflow</h2>
  <div class="ve-mermaid-container">
    <pre class="mermaid">graph LR ...</pre>
  </div>
</section>
```

---

## Slide Type 10: Summary / CTA

**Use for:** Closing slide, next steps, action items.

```html
<section class="slide slide-summary">
  <h2>Next Steps</h2>
  <ol class="slide-actions">
    <li><strong>Review</strong> — FMEA matrix with safety team</li>
    <li><strong>Implement</strong> — SWE.3 detailed design by end of sprint</li>
    <li><strong>Validate</strong> — Run MISRA checks on all modified modules</li>
  </ol>
  <div class="slide-summary-footer">
    <span>Generated by visual-explainer</span>
  </div>
</section>
```

```css
.slide-summary { justify-content: space-between; }
.slide-actions { font-size: 1.125rem; line-height: 2; }
.slide-summary-footer { font-size: 0.75rem; color: var(--text-dim); }
```
