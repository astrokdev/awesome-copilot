# /generate-can-timing

Render a CAN bus message timing diagram — message IDs as rows, time as the horizontal axis, transmission windows as colored blocks.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme + CAN Timing palette (`--diag-primary: #1a4d1a`)
3. Read `templates/can-timing.html` — study the timeline grid layout
4. Read `references/embedded-color-semantics.md` — CAN frame type conventions
5. Parse the input (DBC file excerpt, message list, or prose):
   - Message ID (hex), name, cycle time (ms), DLC (bytes), sender node, receiver nodes
   - Optional: offset (phase), timeout, ASIL rating, bus name (CAN1, CAN2, etc.)
6. Calculate a representative time window:
   - Default: show 2× the LCM of all cycle times, max 500ms
   - If jitter or offset data present, show those visually
7. Generate HTML layout:
   - Horizontal time axis with tick marks (ms)
   - Each message: a horizontal row with blocks showing transmission windows
   - Block width proportional to DLC (longer DLC = wider block)
   - Color: `--diag-primary` for normal frames, `--diag-highlight` for event-triggered
   - ASIL-rated messages: left border uses Safety Criticality Color
   - Hover on block: tooltip with ID, name, DLC, period, sender
8. Add a summary table below the timeline: all messages with their parameters
9. Apply Blueprint or Terminal Mono aesthetic
10. Quality checks: all messages visible, cycle times correct, time axis labeled
11. Write to `~/.agent/diagrams/can-timing-<slug>.html`

## Rules

- Time axis must show units (ms)
- Transmission windows must not overlap within a single message row (correct cycle time rendering)
- If bus load exceeds 80%, show a warning banner
- Message ID displayed in both hex and decimal
- Include DBC signal legend if signal data is provided

## Input

DBC file excerpt, list of `ID name period_ms dlc sender` entries, or prose description of CAN messages.

## Output

Path to the generated `.html` CAN timing diagram.
