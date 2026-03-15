# /generate-memory-map

Render an MCU memory layout diagram — Flash and RAM as vertical bars subdivided into named regions with size annotations.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load active theme + Memory Map palette (`--diag-primary: #3d1a4d`, purple tones)
3. Read `templates/memory-map.html` — study the vertical bar and region block pattern
4. Read `references/embedded-color-semantics.md` — memory region type conventions
5. Parse the input (linker script, memory map file, or region list):
   - For each memory region: name, start address, size (bytes or KB), type, access (RX, RW, W)
   - Typical regions: bootloader, application, calibration data, NVM, stack, heap, BSS, data, vectors
   - Optional: ASIL partitioning (safety / non-safety regions)
6. Group regions by memory type:
   - Flash (ROM): vectors, bootloader, application code, calibration, NVM
   - RAM: stack, heap, BSS, initialized data, shared memory
7. Generate HTML layout:
   - Two vertical bars side by side: FLASH | RAM
   - Each bar: total size labeled at top, regions as proportional height blocks
   - Region block: name, start address (hex), size (hex + human-readable KB/MB)
   - Region color by type (see color conventions below)
   - ASIL-partitioned regions: left border uses Safety Criticality Color
   - Utilization bar at bottom: used / total with percentage
   - Overlap detection: if regions overlap, highlight both in red with warning
8. Hover on region: tooltip with full address range, access flags, description
9. Apply Blueprint aesthetic (technical, address-space appropriate)
10. Quality checks: all regions present, no gaps unaccounted for, utilization math correct
11. Write to `~/.agent/diagrams/memory-map-<slug>.html`

## Memory Region Color Conventions

| Region Type | Color | Notes |
|-------------|-------|-------|
| Interrupt vectors | `#4d0000` | Dark red — always at 0x0 |
| Bootloader | `#003366` | Dark blue |
| Application code | `--diag-primary` | Purple |
| Calibration / NVM | `#4d3300` | Amber-dark |
| Stack | `#1a4d1a` | Dark green |
| Heap | `#336633` | Mid green |
| BSS (zero-init) | `#2a2a4d` | Dark slate |
| Initialized data | `#3d3d00` | Dark yellow |
| Shared memory | `#4d1a4d` | Dark magenta |
| Reserved / unused | `--surface` | Neutral — shows unused space |

## Rules

- Start address 0x0 must be at the bottom of the Flash bar (memory maps are low-at-bottom)
- Size units: always show both hex size and human-readable (e.g., `0x8000 (32 KB)`)
- Gaps between regions: render as "Reserved" blocks — never skip address space
- Total bar height must represent the full addressable range, not just used regions
- Overlap warning must be visible without hover — add a red exclamation badge

## Input

Linker script (`.ld` / `.icf`), IAR map file, GCC map file, or a named region list with addresses and sizes.

## Output

Path to the generated `.html` memory map visualization.
