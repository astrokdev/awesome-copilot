# /generate-roadmap

Generate a strategic feature roadmap HTML page from a GitHub Project — an executive timeline, engineering Kanban, and health metrics dashboard in one self-contained file.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme tokens (use `corporate-light` for roadmaps by default; switch to `corporate-dark` for engineering-only audiences)
3. Read `templates/roadmap.html` — study the timeline lanes, initiative cards, Kanban board, and health scorecard before writing
4. Read `references/css-patterns.md` — timeline, card layout, and depth-tier patterns
5. Read `references/libraries.md` — CDN links for Mermaid Gantt and Chart.js

### Input Acquisition

6. Accept input in one of three forms:
   - **GitHub Project URL** (e.g. `https://github.com/orgs/github/projects/4247/views/1`) — fetch via `gh project item-list` or the GitHub Projects GraphQL API to get items with their fields
   - **CSV/TSV export** — columns: `title, status, theme, confidence, target_ship_date, assignee, labels, description`
   - **Freeform text** — parse initiative names, statuses, dates, and themes from prose

### Data Normalization

7. Map each item to the canonical field schema:

   ```text
   id             — unique identifier
   title          — initiative/feature name
   status         — one of: Triage | Backlog | Design | In Progress | Validation | Done
   theme          — Strategic Theme label (e.g. "Tech Debt", "User Growth", "Platform")
   confidence     — High | Med | Low
   target_ship    — ISO date string (YYYY-MM-DD) or quarter label (e.g. "Q3 2026")
   assignee       — name or handle (optional)
   labels         — array of tags (optional)
   description    — one-line summary (optional)
   ```

8. Group items by `theme`. Compute per-theme and overall health metrics:
   - **Say/Do Ratio**: count(Done in current quarter) / count(committed in current quarter) × 100%
   - **WIP violations**: assignees with >2 In Progress items
   - **Orphan items**: items with status In Progress or Validation but no assignee
   - **Stale items**: items In Progress with no recent update (flag if data is available)
   - **Triage queue depth**: count of items in Triage status

### Layout Generation

9. Generate three panels in a single scrollable page:

   **Panel 1 — Executive Timeline (Gantt)**
   - Mermaid `gantt` diagram, grouped by `theme`, one bar per initiative
   - Filtered to items with status ≠ Triage, ≠ Backlog (show committed work only)
   - Confidence encoded via title annotation: append `(H)`, `(M)`, or `(L)` to each task title (Mermaid does not support per-task opacity; the legend below the diagram explains the symbols)
   - Today marker as a vertical reference line (`todayMarker on`)

   **Panel 2 — Engineering Kanban**
   - CSS Grid board: 6 columns = Triage | Backlog | Design | In Progress | Validation | Done
   - Each card shows: title, theme badge, confidence pill, assignee avatar-initials, target ship date
   - WIP violation highlight: the In Progress column header turns amber (`wip-violation` class) if any single assignee owns >2 In Progress items across the entire board (not just within that column)
   - Triage queue: cards without a theme or confidence are outlined in dashed amber (`triage-orphan` class)

   **Panel 3 — Roadmap Health**
   - Say/Do Ratio gauge (Chart.js doughnut) with green ≥ 80%, amber 60–79%, red < 60%
   - WIP violations list: "Alice: 3 active items" in amber
   - Orphan items count with expandable list
   - Triage queue depth counter
   - Metrics card row: Total Initiatives | In Flight | On Time | Behind

10. Apply **Editorial** aesthetic — roadmaps are strategic documents read by mixed audiences (leadership + engineering)
11. Font pairing: **Plus Jakarta Sans + Azeret Mono** — clean, professional, not the default DM Sans pairing
12. Add `@media print` styles: expand Kanban to a single-column list sorted by target ship date; hide interactive controls
13. Quality checks:
    - Every initiative from the input must appear in exactly one Kanban column
    - Gantt must show all committed initiatives (status Design, In Progress, Validation, Done)
    - Health metrics must be computed from the same data as the visual panels — no inconsistency
    - Confidence encoding present in Gantt legend

14. Write to `~/.agent/diagrams/roadmap-<slug>.html`

## Status → Color Mapping

| Status      | Color token         | Hex (corporate-light) |
|-------------|---------------------|-----------------------|
| Triage      | amber dashed border | `#f59e0b`             |
| Backlog     | `--text-dim`        | `#6b6b6b`             |
| Design      | `--accent`          | `#005a9e`             |
| In Progress | `#7c3aed`           | purple                |
| Validation  | `#0891b2`           | cyan                  |
| Done        | `#16a34a`           | green                 |

## Confidence → Visual Encoding

| Confidence | Gantt title suffix | Card pill color     |
|------------|--------------------|---------------------|
| High       | `(H)`              | green outline       |
| Med        | `(M)`              | amber outline       |
| Low        | `(L)`              | red dashed outline  |
| Unknown    | _(omit)_           | grey dashed outline |

## Interactive Card Data Attributes

Every Kanban card must carry `data-*` attributes so hover and click interactions work without runtime API calls. Populate all fields from the `gh project item-list` JSON at generation time:

```text
data-status      — normalised status slug: triage | backlog | design | in-progress | validation | done
data-title       — initiative title (same as visible card title)
data-theme       — Strategic Theme label
data-conf        — confidence slug: high | med | low
data-desc        — full description (1–3 sentences from GitHub issue body or project item body)
data-issue-num   — GitHub issue / item number (integer)
data-issue-url   — full URL to the GitHub issue or project item
data-comments    — comment count on the issue (integer)
data-prs         — linked pull request count (integer)
data-milestone   — milestone title, or empty string if none
data-assignee    — primary assignee display name (first assignee if multiple)
data-updated     — ISO date of last update (YYYY-MM-DD)
data-labels      — JSON array of label objects: [{"name":"bug","color":"d73a4a"}, ...]
                   color is the 6-character hex without '#' as returned by the GitHub API
```

The hover interaction reveals a two-line description snippet and label chips. The click interaction opens a side drawer with the full description, metadata row, linked issue link, and label chips. Label chip text colour is computed from luminance: dark text (`#1a1a1a`) for light backgrounds (luminance ≥ 0.4), white (`#fff`) for dark backgrounds.

## GitHub Projects Integration Notes

When given a GitHub Project URL, extract the org/user and project number and fetch data with:

```bash
gh project item-list <number> --owner <org> --format json --limit 200
```

Fields to capture: `title`, `status`, `Strategic Theme` (custom field), `Confidence` (custom field), `Target Ship Date` (custom field), `Assignees`, `Body` (description), `Number`, `URL`, `Comments`, `LinkedPullRequests`, `Milestone`, `UpdatedAt`, `Labels`.

If `gh` is not available, instruct the user to export the project as CSV from the GitHub Projects UI (Settings → Export) and re-run the command with the CSV path.

## Rules

- Never omit an initiative from the input — if a field is missing, show a "—" placeholder rather than hiding the card
- Triage items must appear in the Kanban but are **excluded** from the Gantt (they are not committed)
- The Say/Do Ratio must state the measured quarter/period in the metric label
- WIP limit is 2 per assignee — never change this threshold without explicit user instruction
- If there are 0 initiatives, render an empty-state message in each panel, not a blank page

## Input

GitHub Project URL, `gh project item-list` JSON output, CSV export, or freeform text describing features and their statuses.

## Output

Path to the generated `.html` roadmap page.
