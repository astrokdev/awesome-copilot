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

| Name                                                                  | Description                                                                                                                                                                                                      | Bundled Assets |
| --------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| [can-dbc-parser](../skills/can-dbc-parser/SKILL.md)                   | Assists with reading, writing, and analyzing CAN DBC database files, generating signal handler boilerplate in C, and implementing message encoding and decoding logic for embedded ECUs.                         | None           |
| [ceedling-unit-test](../skills/ceedling-unit-test/SKILL.md)           | Comprehensive C unit testing with Ceedling, Unity, and CMock: project setup, testing single files and modules, hardware peripheral register mocking, coverage reporting, and CI integration.                     | None           |
| [cmake-build-helper](../skills/cmake-build-helper/SKILL.md)           | Assists with CMake build system configuration for embedded and cross-compilation projects, including toolchain files, target definitions, linker scripts, and common embedded build patterns.                    | None           |
| [iso26262-review](../skills/iso26262-review/SKILL.md)                 | Functional safety review assistant for ISO 26262 automotive systems: FMEA, ASIL decomposition, safety goal definition, safety concept reviews, and work product checklists.                                      | None           |
| [low-level-driver-design](../skills/low-level-driver-design/SKILL.md) | Guides the design of embedded peripheral drivers including MMIO register abstraction, ISR design, DMA configuration, and portable HAL patterns for microcontrollers.                                             | None           |
| [tara-analysis](../skills/tara-analysis/SKILL.md)                     | Guides automotive Threat Analysis and Risk Assessment (TARA) following ISO 21434 and MITRE TARA methodology, covering asset identification, threat enumeration, vulnerability scoring, and remediation planning. | None           |
