# /generate-autosar-swc

Render an AUTOSAR Software Component (SWC) composition diagram as a self-contained HTML page.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme + AUTOSAR SWC palette (`--diag-primary`, `--diag-secondary`, `--diag-highlight`)
3. Read `templates/autosar-swc.html` — study the port and connector layout
4. Read `references/embedded-color-semantics.md` — AUTOSAR port type conventions
5. Parse the input:
   - Extract SWC names, types (Application, Sensor/Actuator, Service, ECU Abstraction, Complex Driver)
   - Extract ports: P-ports (provided interfaces) and R-ports (required interfaces)
   - Extract interface types per port (sender-receiver, client-server, NvData, Parameter, Mode)
   - Extract ASIL ratings per SWC if present
   - Extract connector mappings between SWCs
6. Generate HTML layout:
   - Each SWC: rectangle card with name, type badge, ASIL badge (Safety Criticality Color)
   - P-ports: circles on the right edge of the SWC card
   - R-ports: arrow sockets on the left edge of the SWC card
   - VFB (Virtual Functional Bus): horizontal band in center connecting P-ports to R-ports
   - Connector lines: SVG paths through the VFB band
   - Hover on port: tooltip showing interface type and data elements
7. Apply Blueprint aesthetic (technical, drafting-like)
8. Quality checks: all SWCs present, all connectors traced end-to-end, ASIL badges accurate
9. Write to `~/.agent/diagrams/autosar-swc-<slug>.html`

## Port Symbol Convention

| Port Type | Symbol | Position |
|-----------|--------|----------|
| Provided (P-port) | Filled circle ● | Right edge of SWC |
| Required (R-port) | Open arrow socket ○→ | Left edge of SWC |
| Sender-Receiver | S/R label | On connector |
| Client-Server | C/S label | On connector |

## Rules

- VFB bus must be visually distinguishable — use `--diag-secondary` background strip
- ASIL badges mandatory if any SWC has an ASIL rating — use Safety Criticality Colors
- SWC type badges use `--diag-primary` background
- Never mix port sides — P-ports always right, R-ports always left
- Include a legend for port symbols, interface types, and ASIL levels

## Input

AUTOSAR composition description, ArXML excerpt, or prose description of SWCs and their interfaces.

## Output

Path to the generated `.html` AUTOSAR SWC diagram.
