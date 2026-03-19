---
name: misra-compliance-check
description: 'Pre-commit hook that runs MISRA-C:2012 compliance checking on staged C/H files using cppcheck with MISRA addon, blocking commits on mandatory rule violations.'
tags: ['misra', 'c', 'safety', 'pre-commit', 'static-analysis']
---

# MISRA Compliance Check Hook

This hook runs MISRA-C:2012 compliance checking on staged C and header files before each commit. It uses cppcheck with the MISRA addon to detect rule violations and blocks the commit if mandatory rule violations are found.

## Prerequisites

- **cppcheck** (version 2.x or later) installed and available on `PATH`
- **MISRA addon**: The `misra.py` addon file (included with cppcheck) and optionally a `misra_rules.txt` file with rule text descriptions
- **Configuration file**: `misra.json` in the project root or `tools/static-analysis/` directory

### Install cppcheck

```bash
# macOS
brew install cppcheck

# Ubuntu/Debian
sudo apt-get install cppcheck

# Windows (via chocolatey)
choco install cppcheck
```

## Configuration

### misra.json

Create a `misra.json` file to configure the addon:

```json
{
    "script": "misra.py",
    "args": ["--rule-texts-file=tools/static-analysis/misra_rules.txt"]
}
```

### Suppressing Rules

To suppress specific rules globally, add a `suppressions.txt`:

```
# Suppress advisory rules that the project has chosen not to enforce
misra-c2012-2.5
misra-c2012-15.5
```

Then add `--suppressions-list=tools/static-analysis/suppressions.txt` to the command.

## Example Output

```
src/app/TempMonitor/TempMonitor.c:45: style: misra-c2012-14.4 (Required)
  The controlling expression of an if-statement shall have essentially Boolean type.
src/app/TempMonitor/TempMonitor.c:67: style: misra-c2012-10.3 (Required)
  The value of an expression shall not be assigned to an object with a narrower essential type.

2 MISRA violations found — commit blocked.
```

## Customization

Edit `hooks.json` to adjust:
- `pattern`: Change file patterns to include/exclude paths
- `command`: Add `--suppressions-list` or `--include` flags
- `blocking`: Set to `false` for advisory-only (non-blocking) mode
