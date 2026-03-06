# Engineering Scripts

This directory contains build scripts and utilities for maintaining the repository.

## Build Scripts

### `update-readme.mjs`

Generates the documentation files (`docs/README.*.md`) from the repository content (agents, instructions, skills, hooks, workflows, plugins).

### `generate-marketplace.mjs`

Generates `.github/plugin/marketplace.json` from all plugin directories in `plugins/`. This file is used by GitHub Copilot CLI to discover and install plugins.

Runs automatically as part of `npm run build`.

### `validate-plugins.mjs`

Validates plugin structure (plugin.json format, required fields, valid references).

### `validate-skills.mjs`

Validates skill folder structure (SKILL.md format, required fields).

## Scaffold Tools

### `create-plugin.mjs`

Interactive CLI for creating a new plugin: `npm run plugin:create -- --name <name>`

### `create-skill.mjs`

Interactive CLI for creating a new skill: `npm run skill:create -- --name <name> --description "<desc>"`

## Publishing

### `materialize-plugins.mjs`

Copies agent/skill source files into plugin directories during the `staged` -> `main` publish workflow.

### `clean-materialized-plugins.mjs`

Removes materialized copies after publishing.
