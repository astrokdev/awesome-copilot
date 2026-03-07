# Embedded C Starter Plugin

A starter toolkit for embedded C/C++ development with GitHub Copilot. Includes a MISRA-aware code reviewer agent and a CMake build helper skill.

## What's Included

### Embedded C Reviewer (Agent)

A GitHub Copilot Chat agent specialized in reviewing embedded C/C++ code against MISRA C:2012, AUTOSAR C++14, and ISO 26262 requirements. It flags undefined behavior, missing `volatile` qualifiers, dynamic allocation violations, interrupt safety issues, and other safety-critical patterns.

### CMake Build Helper (Skill)

A GitHub Copilot skill that assists with CMake build system configuration for cross-compilation projects. Covers toolchain files, bare-metal target definitions, linker script integration, post-build output generation (`.hex`, `.bin`), and CMake Presets.

## Installation

```bash
copilot plugin install embedded-c-starter@AURA_Marketplace
```

## Source

This plugin is part of the [AURA_Marketplace](https://github.vitesco.io/SWProductivity/AURA_Marketplace) — the internal GitHub Copilot resource repository for embedded and automotive development.

## License

MIT
