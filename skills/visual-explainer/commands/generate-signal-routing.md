# /generate-signal-routing

Render a vehicle network gateway signal routing matrix — shows how signals flow between ECUs across CAN, LIN, and Ethernet/SOME-IP buses through a gateway ECU, including protocol translations and ASIL annotations.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load Blueprint theme tokens and Safety Criticality Colors
3. Read `templates/signal-routing-matrix.html` — study the swimlane topology diagram, routing table, and SOME-IP section patterns
4. Read `references/embedded-color-semantics.md` — CAN frame type colors and port conventions
5. Parse the input (ARXML SystemExtract, ComMatrix, DBC/FIBEX signal list, or prose):
   - Network buses: ID, type (CAN/LIN/Ethernet/FlexRay), baud rate, connected ECUs
   - Gateway ECU name and ASIL level
   - Per signal: name, source ECU, source bus, CAN ID or SOME-IP SID, direction, dest bus, dest ECU
   - Optional: signal transformation (scale, offset, protocol conversion), latency budget, ASIL
   - Optional SOME-IP services: service ID, name, method/event, provider, consumers, protocol, cycle
6. Build the topology model:
   - One swimlane row per bus
   - ECU nodes placed on their bus lane
   - Gateway ECU box spans the right side connecting all buses
   - Routing paths: unique srcBus→dstBus pairs become SVG bezier arrows through the gateway
7. Generate HTML layout:
   - Network topology swimlane diagram (CSS + SVG):
     - Horizontal bus lanes with ECU chips
     - Routing arrows colored by source bus type, dashed red for ASIL-D signals
     - Gateway ECU box with ASIL badge
   - Signal routing `ve-table` with filter buttons (All | CAN→CAN | CAN→ETH | LIN→CAN | ETH→CAN | Safety-relevant)
   - Clicking a table row highlights the corresponding routing arrow in the diagram
   - SOME-IP service summary section (collapsed by default)
   - Legend: bus type colors, signal direction symbols, routing type badges
8. Apply Blueprint aesthetic — always dark, network topology diagram style
9. Redraw SVG connectors on window resize
10. Quality checks: all signals appear in table, topology shows all buses, gateway arrows reflect actual routing paths
11. Write to `~/.agent/diagrams/signal-routing-<slug>.html`

## Bus Type Colors

| Bus | Color | Border |
|-----|-------|--------|
| CAN | `#1a4d1a` | `#33cc33` |
| LIN | `#4d3300` | `#ff9900` |
| Ethernet | `#003366` | `#3399ff` |
| FlexRay | `#4d2200` | `#ff6633` |
| MOST | `#4d1a4d` | `#cc66ff` |

## Signal Direction Symbols

- `→` Gateway routing (source → destination)
- `↔` Bidirectional gateway (rare — both directions on same signal name)
- `⇒` Protocol translation (type conversion, e.g. CAN frame → SOME-IP event)
- `⊕` Signal fusion (multiple sources combined into one destination signal)

## Rules

- Safety-relevant filter: show only signals where ASIL > QM
- ASIL-D routing arrows must use a dashed red stroke to be immediately visible
- Latency budget column: amber if > 20ms, red if > 50ms for safety signals
- SOME-IP services collapsed by default to keep the page scannable
- Topology diagram must redraw on resize (JS `ResizeObserver` or `window.resize`)
- If a signal has no matching ECU node on a bus, show an "Unknown" node chip in amber

## Input

AUTOSAR SystemExtract ARXML, ComMatrix/ISignal definitions, DBC files for CAN buses, SOME-IP SD configuration, or prose description of gateway routing (`signal, srcEcu, srcBus, id, dstBus, dstEcu, transform, latency, asil`).

## Output

Path to the generated `.html` signal routing matrix diagram.
