# /generate-public-roadmap

Generate a public-facing feature roadmap HTML page from a GitHub Project. Designed for open-source contributors, community members, and internal stakeholders outside the engineering team. Strips all operational detail (WIP limits, health metrics, governance) and replaces it with plain-language status, a Now / Next / Later / Done timeline, and per-initiative feedback links.

## Audience

- Open-source contributors and community members
- Internal stakeholders outside the core engineering team (product, sales, leadership)

Not for: core engineering team daily operations — use `/generate-roadmap` for that.

## Shadow Items Pattern

This command implements the Shadow Items pattern. Only items explicitly marked for public visibility are included in the output. All others are silently omitted — their existence is never revealed.

**Tagging convention (choose one that fits your project):**

- GitHub Project custom field: `Visibility` = `Public`
- Issue label: `roadmap: public`
- Custom field: `public` = `true`

When fetching from a GitHub Project URL, filter to items where the visibility field matches. If the field is absent on an item, treat it as internal-only and exclude it.

This prevents accidental disclosure of internal initiatives, unreleased features, or sensitive work-in-progress.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load `corporate-light` tokens (public roadmaps are always light theme)
3. Read `templates/roadmap-public.html` — study the Now/Next/Later swimlanes, initiative cards, and feedback row
4. Read `references/css-patterns.md` — card layout and depth-tier patterns
5. Read `references/libraries.md` — CDN links (no Mermaid needed; no Chart.js needed)

### Input Acquisition

6. Accept input in one of three forms:
   - **GitHub Project URL** — fetch with `gh project item-list`, then apply shadow-item filter
   - **CSV/TSV export** — columns: `title, status, theme, confidence, target_ship_date, visibility, description, feedback_url`
   - **Freeform text** — parse initiative names, statuses, and descriptions

### Data Normalization

7. Apply the shadow-item filter first: discard any item without `visibility = public`. Never include internal items.

8. Map each remaining item to the public schema:

   ```text
   title          — initiative name (plain language, no internal codenames)
   public_status  — Now | Next | Later | Done  (derived — see mapping below)
   theme          — Strategic Theme label shown as a section grouping
   horizon        — display date: precise ("Q2 2026") or fuzzy ("~H2 2026") based on confidence
   description    — one or two sentence plain-language summary (required; never empty)
   feedback_url   — link for voting / filing an issue (optional)
   ```

9. Derive `public_status` from internal fields:

   | Internal status        | Confidence | Public status |
   |------------------------|------------|---------------|
   | Triage / Backlog       | any        | _exclude_     |
   | Design / In Progress   | Low        | Later         |
   | Design / In Progress   | Med        | Next          |
   | Design / In Progress   | High       | Now           |
   | Validation             | any        | Now           |
   | Done                   | any        | Done          |

10. Derive `horizon` from `target_ship` and `confidence`:
    - High confidence + ISO date → show quarter label: `Q2 2026`
    - Med confidence → show half-year: `~H1 2026`
    - Low confidence or no date → show year only: `~2026`
    - Done → show actual shipped date or quarter: `Shipped Q1 2026`

### Layout Generation

11. Generate two sections in a single scrollable page:

    **Section 1 — Now / Next / Later / Done swimlanes**
    - Four horizontal swimlane rows, each containing initiative cards
    - Cards show: title, theme badge, horizon label, description, feedback link (if present)
    - No assignees, no WIP counts, no confidence labels, no internal status names
    - Empty swimlanes show a plain "Nothing here yet" placeholder — never hide the row entirely
    - Done swimlane: collapsed by default, expandable with a "Show shipped items" toggle

    **Section 2 — About this Roadmap**
    - Plain-language paragraph explaining what the roadmap is, how often it updates, and how to give feedback
    - Link to the public issue tracker or discussion forum
    - "Last updated" date

12. Apply **Editorial** aesthetic — generous whitespace, strong hierarchy, readable at a glance
13. Font pairing: **Plus Jakarta Sans + Azeret Mono** — same as the internal template for brand consistency
14. Add `@media print` styles: expand the Done swimlane, remove the feedback buttons
15. Quality checks:
    - Zero internal items visible — verify shadow filter was applied
    - Every card has a non-empty `description` — no "TBD" or blank summaries
    - Every theme used by at least one card appears as a section divider
    - Horizon labels are present on all cards

16. Write to `~/.agent/diagrams/roadmap-public-<slug>.html`

## Public Status → Visual Design

| Public status | Header color        | Card left border     |
|---------------|---------------------|----------------------|
| Now           | `--s-in-progress`   | 3px solid purple     |
| Next          | `--s-design`        | 3px solid blue       |
| Later         | `--s-backlog`       | 3px solid grey       |
| Done          | `--s-done`          | 3px solid green      |

## Interactive Card Data Attributes

Every initiative card must carry `data-*` attributes so hover and click interactions work without runtime API calls. Populate all fields at generation time from the shadow-filtered `gh project item-list` JSON:

```text
data-status      — public status slug: now | next | later | done
data-title       — initiative title (plain language, no internal codenames)
data-theme       — Strategic Theme label (displayed as section grouping)
data-horizon     — derived horizon label: e.g. "Q2 2026", "~H1 2026", "~2026", "Shipped Q1 2026"
data-desc        — full plain-language description (1–3 sentences; required — never empty)
data-issue-num   — GitHub issue / item number (integer), or empty if not applicable
data-issue-url   — full URL to the GitHub issue or discussion thread (used for feedback link)
data-comments    — comment count (integer); shown as social proof in modal
data-milestone   — milestone title, or empty string if none
data-updated     — ISO date of last update (YYYY-MM-DD)
data-labels      — JSON array of label objects: [{"name":"ux","color":"bfd4f2"}, ...]
                   color is the 6-character hex without '#' as returned by the GitHub API
```

Never include `data-assignee` or `data-conf` — assignees and confidence are internal-only.

The hover interaction reveals the first two lines of the description and label chips. The click interaction opens a modal with the full description, horizon, theme, comment count, and a feedback/vote link. Label chip text colour is computed from luminance: dark text for light chip backgrounds (luminance ≥ 0.4), white for dark.

## GitHub Projects Integration Notes

```bash
# Fetch all items and filter to public ones
gh project item-list <number> --owner <org> --format json --limit 200 \
  | jq '[.[] | select(.["Visibility"] == "Public")]'
```

Fields to capture after filtering: `title`, `status`, `Strategic Theme`, `Confidence` (used only to derive `horizon` — never surfaced), `Target Ship Date`, `Body` (description), `Number`, `URL`, `Comments`, `Milestone`, `UpdatedAt`, `Labels`.

If the `Visibility` custom field does not exist, warn the user and output nothing — never default to showing all items.

## Rules

- **Never reveal internal items** — the shadow filter is mandatory, not optional
- **No operational jargon** — Triage, WIP, Say/Do, sprint, iteration must not appear in output
- **Descriptions are required** — if an item has no description, write a placeholder prompt in a comment and flag it for the user to fill in before publishing
- **Confidence stays internal** — never surface High/Med/Low labels; use only the derived horizon date format
- **Assignees are never shown** — not even initials
- If there are 0 public items after filtering, render a single "Nothing to show yet" page — not a blank file

## Input

GitHub Project URL, `gh project item-list` JSON output (pre-filtered or full with `Visibility` field), CSV export, or freeform text with `visibility` column.

## Output

Path to the generated `.html` public roadmap page.
