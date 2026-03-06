# Awesome Copilot - Embedded & Automotive

A company-internal collection of custom agents, instructions, and skills to supercharge GitHub Copilot for embedded and automotive development.

Based on the [Awesome GitHub Copilot](https://github.com/github/awesome-copilot) framework.

## What is This?

This repository provides a contribution framework for enhancing GitHub Copilot with specialized resources for embedded and automotive domains:

- **[Agents](docs/README.agents.md)** - Specialized GitHub Copilot agents that integrate with MCP servers for embedded workflows
- **[Instructions](docs/README.instructions.md)** - Coding standards and best practices for embedded technologies and patterns
- **[Skills](docs/README.skills.md)** - Self-contained folders with instructions and bundled resources for specialized tasks
- **[Hooks](docs/README.hooks.md)** - Automated workflows triggered by specific events during development
- **[Agentic Workflows](docs/README.workflows.md)** - AI-powered repository automations that run coding agents in GitHub Actions
- **[Plugins](docs/README.plugins.md)** - Curated bundles of related agents and skills organized around specific themes
- **[Cookbook Recipes](cookbook/README.md)** - Practical, copy-paste-ready code snippets and real-world examples

## In Scope

This repository focuses on embedded and automotive development, including but not limited to:

- **Languages:** C, C++, Rust, Python (tooling/testing), Assembly
- **Standards:** AUTOSAR, MISRA C/C++, ISO 26262, ASPICE, IEC 61508
- **RTOS:** FreeRTOS, Zephyr, RTX, QNX, VxWorks
- **Protocols:** CAN, LIN, FlexRay, Ethernet (SOME/IP, DoIP)
- **Build Systems:** CMake, Make, Bazel, Meson
- **Testing:** Unity, CppUTest, GoogleTest, VectorCAST, LDRA
- **Tools:** GDB, JTAG/SWD debuggers, static analyzers, hardware abstraction
- **Domains:** Firmware, device drivers, bootloaders, safety-critical systems, ECU development

## How to Use

### Custom Agents

Custom agents can be used in Copilot coding agent (CCA), VS Code, and Copilot CLI. In VS Code, activate agents through the Chat interface alongside built-in agents like Plan and Agent.

### Instructions

Instructions automatically apply to files based on their patterns and provide contextual guidance for coding standards, frameworks, and best practices.

### Skills

Skills are self-contained folders with instructions and bundled resources that enhance AI capabilities for specialized tasks. They can be accessed through the GitHub Copilot interface or installed via plugins.

### Hooks

Hooks enable automated workflows triggered by specific events during GitHub Copilot coding agent sessions (like sessionStart, sessionEnd, userPromptSubmitted).

### Agentic Workflows

[Agentic Workflows](https://github.github.com/gh-aw) are AI-powered repository automations that run coding agents in GitHub Actions. Defined in markdown with natural language instructions, they enable event-triggered and scheduled automation.

### Plugins

Plugins bundle related agents and skills into installable packages.

## Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details on how to add new resources.

For AI coding agents working with this project, refer to [AGENTS.md](AGENTS.md) for detailed technical guidance.

### Quick Start

1. Follow our file naming conventions and frontmatter requirements
2. Run `npm run build` to update the generated README tables
3. Run `bash scripts/fix-line-endings.sh` to normalize line endings
4. Submit a pull request targeting the **`staged`** branch

## Repository Structure

```plaintext
.
├── agents/           # Custom agent definitions (.agent.md files)
├── instructions/     # Coding standards and guidelines (.instructions.md files)
├── skills/           # Agent skill folders (each with SKILL.md and optional assets)
├── hooks/            # Automated workflow hooks (folders with README.md + hooks.json)
├── workflows/        # Agentic Workflows (.md files for GitHub Actions automation)
├── plugins/          # Installable plugin packages (folders with plugin.json)
├── docs/             # Generated documentation for each resource type
├── eng/              # Build scripts and automation
└── scripts/          # Utility scripts
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Security & Support

- **Security Issues**: Please see our [Security Policy](SECURITY.md)
- **Support**: Check our [Support Guide](SUPPORT.md) for getting help
- **Code of Conduct**: We follow the [Contributor Covenant](CODE_OF_CONDUCT.md)
