# 🎯 Agent Skills

Agent Skills are self-contained folders with instructions and bundled resources that enhance AI capabilities for specialized tasks. Based on the [Agent Skills specification](https://agentskills.io/specification), each skill contains a `SKILL.md` file with detailed instructions that agents load on-demand.

Skills differ from other primitives by supporting bundled assets (scripts, code samples, reference data) that agents can utilize when performing specialized tasks.
### How to Contribute

See [CONTRIBUTING.md](../CONTRIBUTING.md#adding-skills) for guidelines on how to contribute new agent skills, improve existing ones, and share your use cases.

### How to Use Agent Skills

**What's Included:**
- Each skill is a folder containing a `SKILL.md` instruction file
- Skills may include helper scripts, code templates, or reference data
- Skills follow the Agent Skills specification for maximum compatibility

**When to Use:**
- Skills are ideal for complex, repeatable workflows that benefit from bundled resources
- Use skills when you need code templates, helper utilities, or reference data alongside instructions
- Skills provide progressive disclosure - loaded only when needed for specific tasks

**Usage:**
- Browse the skills table below to find relevant capabilities
- Copy the skill folder to your local skills directory
- Reference skills in your prompts or let the agent discover them automatically

| Name | Description | Bundled Assets |
| ---- | ----------- | -------------- |
| [arxml-generator](../skills/arxml-generator/SKILL.md) | Use when you need to create or update ARXML descriptions for SWCs, port interfaces, data types, or compositions — generates schema-valid AUTOSAR XML from structured specs. | None |
| [autosar-project-template](../skills/autosar-project-template/SKILL.md) | Use when starting a new AUTOSAR ECU project from scratch — generates a complete project skeleton with CLAUDE.md, directory structure, build config, linker scripts, and coding guidelines tailored to the target MCU and toolchain. | None |
| [autosar-swc-scaffold](../skills/autosar-swc-scaffold/SKILL.md) | Use when creating a new AUTOSAR SWC and you need the full file skeleton — C source, headers, config, ARXML, RTE stubs, and unit test — generated from a component specification. | None |
| [bsw-module-configurator](../skills/bsw-module-configurator/SKILL.md) | Use when you need to configure AUTOSAR BSW modules (OS, COM, NvM, Dem, EcuM) from functional requirements — produces task tables, signal routing, NvM blocks, DTC config, and initialization sequences. | None |
| [can-dbc-parser](../skills/can-dbc-parser/SKILL.md) | Assists with reading, writing, and analyzing CAN DBC database files, generating signal handler boilerplate in C, and implementing message encoding and decoding logic for embedded ECUs. | None |
| [ceedling-unit-test](../skills/ceedling-unit-test/SKILL.md) | Comprehensive C unit testing with Ceedling, Unity, and CMock: project setup, testing single files and modules, hardware peripheral register mocking, coverage reporting, and CI integration. | None |
| [cmake-build-helper](../skills/cmake-build-helper/SKILL.md) | Assists with CMake build system configuration for embedded and cross-compilation projects, including toolchain files, target definitions, linker scripts, and common embedded build patterns. | None |
| [integration-test-harness](../skills/integration-test-harness/SKILL.md) | Use when you need to test multiple AUTOSAR SWCs together — generates an integration test harness with RTE simulation, BSW service stubs, a test scheduler, and stimulus/check framework. | None |
| [iso26262-review](../skills/iso26262-review/SKILL.md) | Functional safety review assistant for ISO 26262 automotive systems: FMEA, ASIL decomposition, safety goal definition, safety concept reviews, and work product checklists. | None |
| [linker-script-generator](../skills/linker-script-generator/SKILL.md) | Use when setting up or modifying linker scripts for an embedded target — generates GCC LD, IAR ICF, or ARM scatter-load scripts with correct AUTOSAR MemMap sections and MPU-aligned regions from a memory map spec. | None |
| [low-level-driver-design](../skills/low-level-driver-design/SKILL.md) | Guides the design of embedded peripheral drivers including MMIO register abstraction, ISR design, DMA configuration, and portable HAL patterns for microcontrollers. | None |
| [memory-map-analyzer](../skills/memory-map-analyzer/SKILL.md) | Use when you have a linker map file (.map) and need to check memory utilization, budget compliance, section sizes, stack usage, or find optimization opportunities. | None |
| [rte-contract-generator](../skills/rte-contract-generator/SKILL.md) | Use when you have defined SWC ports and runnables and need the matching RTE contract header (Rte_<SwcName>.h), type definitions, and unit test stubs with configurable data consistency modes. | None |
| [tara-analysis](../skills/tara-analysis/SKILL.md) | Guides automotive Threat Analysis and Risk Assessment (TARA) following ISO 21434 and MITRE TARA methodology, covering asset identification, threat enumeration, vulnerability scoring, and remediation planning. | None |
| [visual-explainer](../skills/visual-explainer/SKILL.md) | Generate self-contained HTML pages that explain complex technical content visually — diagrams, tables, slide decks, timelines, and embedded/automotive domain visualizations. Supports AUTOSAR SWC, CAN timing, MISRA heatmaps, FMEA risk matrices, and MCU memory maps with company color themes. | `.DS_Store`<br />`commands/diff-review.md`<br />`commands/fact-check.md`<br />`commands/generate-autosar-swc.md`<br />`commands/generate-boot-sequence.md`<br />`commands/generate-calibration-map.md`<br />`commands/generate-can-timing.md`<br />`commands/generate-dtc-catalog.md`<br />`commands/generate-fmea-matrix.md`<br />`commands/generate-memory-map.md`<br />`commands/generate-misra-heatmap.md`<br />`commands/generate-public-roadmap.md`<br />`commands/generate-roadmap.md`<br />`commands/generate-rte-timing.md`<br />`commands/generate-signal-routing.md`<br />`commands/generate-slides.md`<br />`commands/generate-test-coverage.md`<br />`commands/generate-visual-plan.md`<br />`commands/generate-web-diagram.md`<br />`commands/plan-review.md`<br />`commands/project-recap.md`<br />`references/css-patterns.md`<br />`references/embedded-color-semantics.md`<br />`references/libraries.md`<br />`references/responsive-nav.md`<br />`references/slide-patterns.md`<br />`templates/architecture.html`<br />`templates/autosar-swc.html`<br />`templates/boot-sequence.html`<br />`templates/calibration-map.html`<br />`templates/can-timing.html`<br />`templates/data-table.html`<br />`templates/dtc-catalog.html`<br />`templates/fmea-matrix.html`<br />`templates/memory-map.html`<br />`templates/mermaid-flowchart.html`<br />`templates/misra-heatmap.html`<br />`templates/roadmap-public.html`<br />`templates/roadmap.html`<br />`templates/rte-timing.html`<br />`templates/signal-routing-matrix.html`<br />`templates/slide-deck.html`<br />`templates/test-coverage-report.html`<br />`themes.md` |
