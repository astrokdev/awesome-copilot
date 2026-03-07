The following instructions are only to be applied when performing a code review.

## README updates

- [ ] The new file should be added to the `docs/README.<type>.md`.

## Prompt file guide

**Only apply to files that end in `.prompt.md`**

- [ ] The prompt has markdown front matter.
- [ ] The prompt has a `agent` field specified of either `agent`, `ask`, or `Plan`.
- [ ] The prompt has a `description` field.
- [ ] The `description` field is not empty.
- [ ] The file name is lower case, with words separated by hyphens.
- [ ] Encourage the use of `tools`, but it's not required.
- [ ] Strongly encourage the use of `model` to specify the model that the prompt is optimised for.
- [ ] Strongly encourage the use of `name` to set the name for the prompt.

## Instruction file guide

**Only apply to files that end in `.instructions.md`**

- [ ] The instruction has markdown front matter.
- [ ] The instruction has a `description` field.
- [ ] The `description` field is not empty.
- [ ] The file name is lower case, with words separated by hyphens.
- [ ] The instruction has an `applyTo` field that specifies the file or files to which the instructions apply. If they wish to specify multiple file paths they should formatted like `'**.js, **.ts'`.

## Agent file guide

**Only apply to files that end in `.agent.md`**

- [ ] The agent has markdown front matter.
- [ ] The agent has a `description` field.
- [ ] The `description` field is not empty.
- [ ] The file name is lower case, with words separated by hyphens.
- [ ] Encourage the use of `tools`, but it's not required.
- [ ] Strongly encourage the use of `model` to specify the model that the agent is optimised for.
- [ ] Strongly encourage the use of `name` to set the name for the agent.

## Agent Skills guide

**Only apply to folders in the `skills/` directory**

- [ ] The skill folder contains a `SKILL.md` file.
- [ ] The SKILL.md has markdown front matter.
- [ ] The SKILL.md has a `name` field.
- [ ] The `name` field value is lowercase with words separated by hyphens.
- [ ] The `name` field matches the folder name.
- [ ] The SKILL.md has a `description` field.
- [ ] The `description` field is not empty, at least 10 characters, and maximum 1024 characters.
- [ ] The `description` field value is wrapped in single quotes.
- [ ] The folder name is lower case, with words separated by hyphens.
- [ ] Any bundled assets (scripts, templates, data files) are referenced in the SKILL.md instructions.
- [ ] Bundled assets are reasonably sized (under 5MB per file).

## Plugin guide

**Only apply to directories in the `plugins/` directory**

- [ ] The plugin directory contains a `.github/plugin/plugin.json` file.
- [ ] The plugin directory contains a `README.md` file.
- [ ] The plugin.json has a `name` field matching the directory name.
- [ ] The plugin.json has a `description` field.
- [ ] The `description` field is not empty.
- [ ] The directory name is lower case, with words separated by hyphens.
- [ ] If `tags` is present, it is an array of lowercase hyphenated strings.
- [ ] If `items` is present, each item has `path` and `kind` fields.
- [ ] The `kind` field value is one of: `prompt`, `agent`, `instruction`, `skill`, or `hook`.
- [ ] The plugin does not reference non-existent files.

## Contributing with Copilot

The following guidance applies when you are **writing a new resource** for this repository with Copilot's assistance.

### Scope

This is the AURA_Marketplace — an internal repository for embedded and automotive GitHub Copilot resources. Every contribution must be relevant to:

- Languages: C, C++, Rust, Python (tooling/testing), Assembly
- Standards: AUTOSAR, MISRA C/C++, ISO 26262, ASPICE, IEC 61508, DO-178C
- RTOS: FreeRTOS, Zephyr, RTX, QNX, VxWorks
- Protocols: CAN, LIN, FlexRay, Ethernet (SOME/IP, DoIP), SPI, I2C, UART
- Build systems: CMake, Make, Bazel, Meson, Yocto/BitBake
- Testing: Unity, CppUTest, GoogleTest, VectorCAST, LDRA, static analysis
- Domains: firmware, device drivers, bootloaders, ECU development, safety-critical systems

### Naming conventions

| Resource | File pattern | Example |
| --- | --- | --- |
| Agent | `lowercase-hyphens.agent.md` | `misra-c-reviewer.agent.md` |
| Instructions | `lowercase-hyphens.instructions.md` | `freertos-development.instructions.md` |
| Skill | folder `lowercase-hyphens/SKILL.md` | `cmake-build-helper/SKILL.md` |
| Workflow | `lowercase-hyphens.md` | `stale-issue-reporter.md` |

### Required frontmatter

**Agent** (`.agent.md`):
```yaml
---
description: 'One-sentence description of what this agent does'
model: 'gpt-4o'
tools: ['codebase']
name: 'Display Name'
---
```

**Instructions** (`.instructions.md`):
```yaml
---
description: 'One-sentence description of what these instructions cover'
applyTo: '**.c, **.cpp, **.h, **.s'
---
```

**Skill** (`SKILL.md`):
```yaml
---
name: skill-folder-name
description: 'One-sentence description — must match the folder name exactly'
---
```

### Contribution workflow

1. Use `npm run agent:create`, `npm run instructions:create`, or `npm run skill:create` to scaffold a valid template
2. Fill in the placeholder sections with embedded-specific, actionable content
3. Run `npm run build` to regenerate README tables
4. Submit a PR targeting the `staged` branch (not `main`)
