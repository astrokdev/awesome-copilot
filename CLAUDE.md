# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

This is an internal golden repo for embedded and automotive development, based on the [Awesome GitHub Copilot](https://github.com/github/awesome-copilot) framework. It provides a contribution model for company users to add specialized GitHub Copilot agents, instructions, skills, plugins, hooks, and workflows focused on embedded systems, AUTOSAR, safety-critical development, and related domains.

## Commands

```bash
# Install dependencies
npm ci

# Build: generates README.md and marketplace.json from repository content
npm run build

# Validate plugins and skills
npm run plugin:validate
npm run skill:validate

# Scaffold new resources
npm run skill:create -- --name <skill-name> --description "<description>"
npm run plugin:create -- --name <plugin-name>

# Normalize line endings (CRLF -> LF) - required before committing
bash scripts/fix-line-endings.sh
```

## Architecture

This is a **content repository** (not a traditional code project). The primary content is markdown files organized into resource types, with Node.js build scripts in `eng/` that auto-generate README tables and marketplace manifests.

### Resource Directories

| Directory       | File Pattern                 | Purpose                                   |
| --------------- | ---------------------------- | ----------------------------------------- |
| `agents/`       | `*.agent.md`                 | GitHub Copilot agent definitions          |
| `instructions/` | `*.instructions.md`          | Coding standards applied to file patterns |
| `skills/*/`     | `SKILL.md` + assets          | Self-contained skill folders              |
| `hooks/*/`      | `README.md` + `hooks.json`   | Automated event-triggered workflows       |
| `workflows/`    | `*.md`                       | Agentic workflows for GitHub Actions      |
| `plugins/*/`    | `.github/plugin/plugin.json` | Installable bundles of agents/skills      |

### Build Pipeline

`eng/update-readme.mjs` scans all resource directories and regenerates `README.md` and `docs/README.*.md` tables. `eng/generate-marketplace.mjs` reads each `plugins/*/github/plugin/plugin.json` and consolidates them into `.github/plugin/marketplace.json` (consumed by GitHub Copilot CLI for plugin installation). Both run automatically via `npm run build`.

Plugin content is defined declaratively in `plugin.json` (`agents`, `commands`, `skills` arrays pointing to source paths). CI materializes those source files into the plugin directory — source files always live in their top-level directories (`agents/`, `skills/`, etc.).

### Front Matter Requirements

All resource files require YAML front matter. Key rules:

**Agents** (`*.agent.md`): `description` (single-quoted), `name`, recommended `model` and `tools`.

**Instructions** (`*.instructions.md`): `description` (single-quoted), `applyTo` with glob patterns (e.g., `'**.js, **.ts'`).

**Skills** (`SKILL.md`): `name` (lowercase-hyphenated, matches folder name, max 64 chars), `description` (single-quoted, 10-1024 chars).

**Hooks** (`README.md`): `name`, `description` (single-quoted), optional `tags`. Also requires a sibling `hooks.json`.

**Plugins** (`plugin.json`): `name` (matches folder name), `description`, `version` (semver), optional `keywords` (lowercase hyphenated array).

### Naming Convention

All file and folder names use **lowercase with hyphens** (e.g., `my-resource-name`). The `name` field in a skill's front matter must exactly match the folder name.

### Pull Requests

PRs must target the **`develop`** branch, not `main`.

### External Plugins

External plugins (hosted outside this repo) are listed in `plugins/external.json` and merged into `marketplace.json` during build. Each entry needs `name`, `source`, `description`, and `version`.
