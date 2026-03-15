# Responsive Navigation Reference

Sticky table-of-contents and navigation patterns for multi-section Visual Explainer pages.

---

## Sticky TOC (Table of Contents)

Use for pages with 4+ sections (architecture recaps, plan reviews, fact-check reports).

```html
<div class="ve-layout">
  <nav class="ve-toc">
    <p class="ve-toc-title">Contents</p>
    <ul class="ve-toc-list">
      <li><a href="#section-overview" class="ve-toc-link">Overview</a></li>
      <li><a href="#section-architecture" class="ve-toc-link">Architecture</a></li>
      <li><a href="#section-findings" class="ve-toc-link">Findings</a></li>
    </ul>
  </nav>
  <main class="ve-main">
    <section id="section-overview">...</section>
    <section id="section-architecture">...</section>
  </main>
</div>
```

```css
.ve-layout {
  display: grid;
  grid-template-columns: 220px 1fr;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.ve-toc {
  position: sticky;
  top: 1.5rem;
  height: fit-content;
  align-self: start;
}

.ve-toc-title {
  font-size: 0.6875rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-dim);
  margin: 0 0 0.75rem;
}

.ve-toc-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.ve-toc-link {
  display: block;
  padding: 0.375rem 0.75rem;
  border-radius: 4px;
  font-size: 0.8125rem;
  color: var(--text-dim);
  text-decoration: none;
  border-left: 2px solid transparent;
  transition: all 0.15s;
}

.ve-toc-link:hover,
.ve-toc-link.active {
  color: var(--accent);
  border-left-color: var(--accent);
  background: var(--surface);
}
```

### Active Link Tracking
```javascript
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      const id = entry.target.getAttribute('id');
      const link = document.querySelector(`.ve-toc-link[href="#${id}"]`);
      if (link) link.classList.toggle('active', entry.isIntersecting);
    });
  },
  { rootMargin: '-20% 0% -70% 0%' }
);

document.querySelectorAll('section[id]').forEach(s => observer.observe(s));
```

---

## Slide Navigation

For `/generate-slides` output — keyboard + click navigation.

```javascript
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');

function goTo(n) {
  slides[currentSlide].classList.remove('active');
  currentSlide = Math.max(0, Math.min(n, slides.length - 1));
  slides[currentSlide].classList.add('active');
  slides[currentSlide].scrollIntoView({ behavior: 'smooth' });
  document.querySelector('.slide-counter').textContent =
    `${currentSlide + 1} / ${slides.length}`;
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(currentSlide + 1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goTo(currentSlide - 1);
});
```

```css
.slide {
  height: 100dvh;
  scroll-snap-align: start;
  display: flex;
  flex-direction: column;
  padding: 4rem;
  box-sizing: border-box;
}

.slide-counter {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  font-size: 0.75rem;
  color: var(--text-dim);
  font-family: 'Fira Code', monospace;
}
```

---

## Responsive Collapse (768px)

On mobile, collapse the TOC into a `<details>` element:

```css
@media (max-width: 768px) {
  .ve-layout {
    grid-template-columns: 1fr;
  }

  .ve-toc {
    position: static;
  }
}
```

```html
<!-- Mobile: wrap TOC in details -->
<details class="ve-toc-mobile">
  <summary>Contents</summary>
  <ul class="ve-toc-list">...</ul>
</details>
```

```css
.ve-toc-mobile {
  display: none;
}

@media (max-width: 768px) {
  .ve-toc-mobile { display: block; }
  .ve-toc { display: none; }
}
```
