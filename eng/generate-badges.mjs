#!/usr/bin/env node

import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";
import { COMMUNITY_DIR, DOCS_DIR } from "./constants.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Generate an SVG badge with text and color
 * @param {string} label - Left side text
 * @param {string} value - Right side text
 * @param {string} color - Right side background color (hex without #)
 * @returns {string} SVG string
 */
function generateSvgBadge(label, value, color) {
  const labelWidth = label.length * 7 + 10;
  const valueWidth = value.length * 7 + 10;
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20" role="img" aria-label="${label}: ${value}">
  <title>${label}: ${value}</title>
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#${color}"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" text-rendering="geometricPrecision" font-size="11">
    <text aria-hidden="true" x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text aria-hidden="true" x="${labelWidth + valueWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>`;
}

async function main() {
  try {
    const badgesDir = path.join(DOCS_DIR, "badges");

    // Ensure badges directory exists
    if (!fs.existsSync(badgesDir)) {
      fs.mkdirSync(badgesDir, { recursive: true });
    }

    // Generate "Powered by AURA" badge
    const poweredByBadge = generateSvgBadge(
      "Powered by",
      "AURA Marketplace",
      "0078d4"
    );
    const poweredByPath = path.join(badgesDir, "powered-by-aura.svg");
    fs.writeFileSync(poweredByPath, poweredByBadge);
    console.log("Generated powered-by-aura.svg");

    // Load projects and generate per-asset "used by" badges
    const projectsPath = path.join(COMMUNITY_DIR, "projects.json");
    if (fs.existsSync(projectsPath)) {
      const projects = JSON.parse(fs.readFileSync(projectsPath, "utf8"));

      // Build reverse index: asset path -> project count
      const assetCounts = new Map();
      for (const project of projects) {
        if (!Array.isArray(project.assets)) continue;
        for (const assetPath of project.assets) {
          assetCounts.set(assetPath, (assetCounts.get(assetPath) || 0) + 1);
        }
      }

      // Generate a badge for each asset that has projects
      for (const [assetPath, count] of assetCounts) {
        const safeId = assetPath
          .replace(/[/\\]/g, "-")
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-z0-9-]/gi, "-");
        const badge = generateSvgBadge(
          "used by",
          `${count} project${count !== 1 ? "s" : ""}`,
          "28a745"
        );
        const badgePath = path.join(badgesDir, `used-by-${safeId}.svg`);
        fs.writeFileSync(badgePath, badge);
      }

      console.log(
        `Generated ${assetCounts.size} used-by badge(s) for ${projects.length} project(s)`
      );
    }

    // Load stars and generate per-asset star badges
    const starsPath = path.join(COMMUNITY_DIR, "stars.json");
    if (fs.existsSync(starsPath)) {
      const stars = JSON.parse(fs.readFileSync(starsPath, "utf8"));
      let starBadgeCount = 0;

      for (const [assetPath, count] of Object.entries(stars)) {
        if (count <= 0) continue;
        const safeId = assetPath
          .replace(/[/\\]/g, "-")
          .replace(/\.[^.]+$/, "")
          .replace(/[^a-z0-9-]/gi, "-");
        const badge = generateSvgBadge("stars", String(count), "f5c518");
        const badgePath = path.join(badgesDir, `stars-${safeId}.svg`);
        fs.writeFileSync(badgePath, badge);
        starBadgeCount++;
      }

      console.log(`Generated ${starBadgeCount} star badge(s)`);
    }

    console.log("Badge generation complete.");
  } catch (error) {
    console.error(`Error generating badges: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(`Fatal error: ${error.message}`);
  console.error(error.stack);
  process.exit(1);
});
