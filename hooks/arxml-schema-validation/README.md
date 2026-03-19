---
name: arxml-schema-validation
description: 'Pre-commit hook that validates ARXML files against the AUTOSAR schema, blocking commits on schema violations.'
tags: ['autosar', 'arxml', 'validation', 'pre-commit', 'xml']
---

# ARXML Schema Validation Hook

This hook validates ARXML files against the AUTOSAR XML schema before each commit. It catches schema violations — malformed XML, missing required elements, incorrect attribute values — before they enter the repository.

## Prerequisites

- **xmllint** (part of `libxml2`) installed and available on `PATH`
- **AUTOSAR schema files**: The AUTOSAR `.xsd` schema files for your target release

### Install xmllint

```bash
# macOS (included with Xcode command line tools)
xcode-select --install

# Ubuntu/Debian
sudo apt-get install libxml2-utils

# Windows
# Download libxml2 binaries from https://www.zlatkovic.com/libxml.en.html
```

## Configuration

Set the `AUTOSAR_SCHEMA_PATH` environment variable to the location of your schema files:

```bash
export AUTOSAR_SCHEMA_PATH=./tools/schema/AUTOSAR_00051.xsd
```

If not set, the hook defaults to `./tools/schema/AUTOSAR_00051.xsd`.

## Example Output

```
config/arxml/system.arxml:42: element PORTS: Schemas validity error:
  Element 'R-PORT-PROTOYPE': This element is not expected.
  Expected is ( R-PORT-PROTOTYPE ).
config/arxml/system.arxml fails to validate

1 ARXML validation error — commit blocked.
```

## Common Validation Errors

| Error | Cause | Fix |
|-------|-------|-----|
| `element not expected` | Typo in element name | Check spelling against AUTOSAR schema |
| `missing child element` | Required element omitted | Add the missing element (e.g., `SHORT-NAME`) |
| `attribute not allowed` | Invalid attribute on element | Remove the attribute or fix the name |
| `value not valid` | Wrong value for restricted type | Check enumeration values in the schema |

## Customization

- **Schema version**: Change the schema `.xsd` file to match your AUTOSAR release
- **Non-blocking mode**: Set `"blocking": false` in `hooks.json` for warnings only
- **Exclude paths**: Modify the `pattern` in `hooks.json` to skip auto-generated ARXML
