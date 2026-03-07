#!/usr/bin/env node

import fs from "fs";
import path from "path";
import readline from "readline";
import { AGENTS_DIR } from "./constants.mjs";

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

async function createAgent() {
  try {
    console.log("🤖 Agent Creator");
    console.log(
      "This tool will help you create a new GitHub Copilot agent following the AURA_Marketplace specification.\n"
    );

    const parsed = parseArgs();

    // Get agent slug (used as filename base)
    let agentSlug = parsed.name;
    if (!agentSlug) {
      agentSlug = await prompt("Agent name (lowercase, hyphens only, e.g. misra-c-reviewer): ");
    }

    if (!agentSlug) {
      console.error("❌ Agent name is required");
      process.exit(1);
    }

    if (!/^[a-z0-9-]+$/.test(agentSlug)) {
      console.error(
        "❌ Agent name must contain only lowercase letters, numbers, and hyphens"
      );
      process.exit(1);
    }

    const agentFile = path.join(AGENTS_DIR, `${agentSlug}.agent.md`);

    if (fs.existsSync(agentFile)) {
      console.log(`⚠️  Agent file already exists: ${agentFile}`);
      console.log("💡 Please choose a different name or edit the existing agent.");
      process.exit(1);
    }

    // Get description
    let description = parsed.description;
    if (!description) {
      description = await prompt(
        "Description (what this agent does and when to use it): "
      );
    }

    if (!description || description.trim().length < 10) {
      console.error(
        "❌ Description is required and must be at least 10 characters"
      );
      process.exit(1);
    }

    // Get display name
    const defaultDisplayName = agentSlug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    let displayName = await prompt(`Agent display name (default: ${defaultDisplayName}): `);
    if (!displayName.trim()) {
      displayName = defaultDisplayName;
    }

    // Get model
    let model = await prompt("Model (default: gpt-4o): ");
    if (!model.trim()) {
      model = "gpt-4o";
    }

    // Get tools
    const defaultTools = "codebase";
    let toolsInput = await prompt(`Tools (comma-separated, default: ${defaultTools}): `);
    if (!toolsInput.trim()) {
      toolsInput = defaultTools;
    }
    const toolsArray = toolsInput
      .split(",")
      .map((t) => t.trim())
      .filter((t) => t);
    const toolsYaml = toolsArray.map((t) => `'${t}'`).join(", ");

    // Escape single quotes for YAML single-quoted scalars
    const safeDescription = description.trim().replace(/'/g, "''");
    const safeName = displayName.trim().replace(/'/g, "''");

    // Generate agent file
    const agentContent = `---
description: '${safeDescription}'
model: '${model.trim()}'
tools: [${toolsYaml}]
name: '${safeName}'
---

You are an expert ${displayName} specializing in embedded and automotive software development.

## Your Expertise

- [Specific embedded/automotive domain, e.g., MISRA C compliance, ISO 26262 functional safety]
- [Relevant standard, protocol, or technology, e.g., AUTOSAR, CAN bus, FreeRTOS]
- [Additional area of expertise]

## Your Approach

- Provide precise, standards-compliant guidance relevant to embedded constraints
- Reference applicable standards (MISRA, AUTOSAR, ISO 26262, etc.) when relevant
- Consider memory, timing, and hardware limitations typical of embedded targets
- Flag safety-critical considerations explicitly

## Guidelines

- [Specific instruction for how this agent should respond]
- [Constraint or limitation, e.g., "Always flag code that modifies shared resources without synchronization"]
- [Best practice to enforce, e.g., "Prefer static allocation over dynamic allocation"]
`;

    fs.writeFileSync(agentFile, agentContent);

    console.log(`\n✅ Created agent file: ${agentFile}`);
    console.log("\n📝 Next steps:");
    console.log(`1. Edit ${agentFile} to complete the agent persona`);
    console.log("2. Run 'npm run build' to regenerate documentation");
    console.log("3. Test the agent in GitHub Copilot Chat");
    console.log("4. Submit a PR targeting the 'staged' branch");
  } catch (error) {
    console.error(`❌ Error creating agent: ${error.message}`);
    process.exit(1);
  } finally {
    rl.close();
  }
}

createAgent();
