#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import { INSTRUCTIONS_DIR } from "./constants.mjs";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, resolve);
  });
}

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { name: undefined, description: undefined };

  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--name" || a === "-n") {
      out.name = args[i + 1];
      i++;
    } else if (a.startsWith("--name=")) {
      out.name = a.split("=")[1];
    } else if (a === "--description" || a === "-d") {
      out.description = args[i + 1];
      i++;
    } else if (a.startsWith("--description=")) {
      out.description = a.split("=")[1];
    } else if (!a.startsWith("-") && !out.name) {
      out.name = a;
    }
  }

  return out;
}

async function createInstructions() {
  try {
    console.log("📋 Instructions Creator");
    console.log(
      "This tool will help you create a new GitHub Copilot instructions file following the AURA_Marketplace specification.\n"
    );

    const parsed = parseArgs();

    // Get file slug (used as filename base)
    let fileSlug = parsed.name;
    if (!fileSlug) {
      fileSlug = await prompt("Instructions name (lowercase, hyphens only, e.g. freertos-development): ");
    }

    if (!fileSlug) {
      console.error("❌ Instructions name is required");
      process.exit(1);
    }

    if (!/^[a-z0-9-]+$/.test(fileSlug)) {
      console.error(
        "❌ Instructions name must contain only lowercase letters, numbers, and hyphens"
      );
      process.exit(1);
    }

    const instructionsFile = path.join(INSTRUCTIONS_DIR, `${fileSlug}.instructions.md`);

    if (fs.existsSync(instructionsFile)) {
      console.log(`⚠️  Instructions file already exists: ${instructionsFile}`);
      console.log("💡 Please choose a different name or edit the existing file.");
      process.exit(1);
    }

    // Get description
    let description = parsed.description;
    if (!description) {
      description = await prompt(
        "Description (what these instructions cover and when to apply them): "
      );
    }

    if (!description || description.trim().length < 10) {
      console.error(
        "❌ Description is required and must be at least 10 characters"
      );
      process.exit(1);
    }

    // Get display title
    const defaultTitle = fileSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    let title = await prompt(`Title (default: ${defaultTitle}): `);
    if (!title.trim()) {
      title = defaultTitle;
    }

    // Get applyTo glob pattern
    const defaultApplyTo = "**.c, **.cpp, **.h, **.s";
    let applyTo = await prompt(`Apply to file patterns (default: ${defaultApplyTo}): `);
    if (!applyTo.trim()) {
      applyTo = defaultApplyTo;
    }

    // Escape single quotes for YAML single-quoted scalars
    const safeDescription = description.trim().replace(/'/g, "''");

    // Generate instructions file
    const instructionsContent = `---
description: '${safeDescription}'
applyTo: '${applyTo.trim()}'
---

# ${title.trim()}

## Coding Conventions

- [Specific convention, e.g., "Use snake_case for all variables and function names"]
- [Naming rule, e.g., "Prefix interrupt service routines with ISR_"]
- [File organization rule]

## Standards Compliance

- [Standard to enforce, e.g., "All code must comply with MISRA C:2012 mandatory rules"]
- [Tool or check to apply, e.g., "Static analysis must pass with no errors"]
- [Documentation requirement]

## Safety and Reliability

- [Safety-critical constraint, e.g., "Never use dynamic memory allocation after initialization"]
- [Error handling requirement]
- [Defensive programming guideline]

## Embedded-Specific Guidelines

- [Hardware constraint, e.g., "Respect alignment requirements for DMA buffers"]
- [Timing constraint, e.g., "ISR handlers must complete within N microseconds"]
- [Resource limitation, e.g., "Stack usage per task must not exceed X bytes"]

## Code Review Checklist

- [ ] [Check item 1]
- [ ] [Check item 2]
- [ ] [Check item 3]
`;

    fs.writeFileSync(instructionsFile, instructionsContent);

    console.log(`\n✅ Created instructions file: ${instructionsFile}`);
    console.log("\n📝 Next steps:");
    console.log(`1. Edit ${instructionsFile} to add your domain-specific instructions`);
    console.log("2. Run 'npm run build' to regenerate documentation");
    console.log("3. Test by applying the file in a GitHub Copilot Chat session");
    console.log("4. Submit a PR targeting the 'staged' branch");
  } catch (error) {
    console.error(`❌ Error creating instructions file: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createInstructions();
