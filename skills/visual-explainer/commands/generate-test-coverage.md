# /generate-test-coverage

Render a software unit test coverage dashboard as an interactive HTML page — per-module and per-file statement, branch, and MC/DC coverage metrics with ISO 26262 Part 6 adequacy assessment.

## Workflow

1. Load the `visual-explainer` skill (read `SKILL.md`)
2. **Read `themes.md`** — load corporate-dark tokens and Safety Criticality Colors
3. Read `templates/test-coverage-report.html` — study the ISO 26262 banner, scorecard tiles, and collapsible module rows
4. Read `references/embedded-color-semantics.md` — ASIL badge conventions
5. Parse the input (gcov/lcov output, Ceedling report, or CSV):
   - Per-file: filename, ASIL level, statement %, branch %, MC/DC %, uncovered line count, test pass/total
   - Group files into modules with an overall ASIL level (highest in module)
   - Tool name and version, test run date, project name
6. Apply ISO 26262 Part 6 Table 10 thresholds per ASIL:
   - **ASIL-D / ASIL-C**: Statement 100% + Branch 100% + MC/DC 100% required
   - **ASIL-B / ASIL-A**: Statement 100% + Branch 100% required; MC/DC N/A
   - **QM**: Statement ≥ 80% + Branch ≥ 70% recommended; MC/DC N/A
7. Generate HTML layout:
   - ISO 26262 requirement banner: 4 cards (ASIL-A through D) showing required methods + project compliance
   - Scorecard: overall Statement %, Branch %, MC/DC %, Tests Passed — each with progress bar + Adequate/Insufficient badge
   - Module breakdown `ve-table`: module name + ASIL | coverage bars | file count | Adequacy badge
   - Row click expands per-file detail rows (filename, ASIL, coverage %, uncovered lines)
   - MC/DC column shows "N/A" for ASIL-A/B/QM modules
8. Coverage bar color coding (vs. ASIL threshold):
   - Green: meets or exceeds threshold
   - Amber: ≥ 80% of threshold
   - Red: < 80% of threshold
9. Apply corporate-dark aesthetic — always dark for engineering reports
10. Add `@media print` styles: expand all file rows, remove interactive controls
11. Quality checks: all files accounted for, adequacy badges computed correctly, highest ASIL drives banner highlight
12. Write to `~/.agent/diagrams/test-coverage-<slug>.html`

## ISO 26262 Coverage Thresholds (Part 6, Table 10)

| ASIL | Statement | Branch | MC/DC |
|------|-----------|--------|-------|
| D    | 100%      | 100%   | 100% (mandatory) |
| C    | 100%      | 100%   | 100% (mandatory) |
| B    | 100%      | 100%   | N/A |
| A    | 100%      | 100%   | N/A |
| QM   | ≥ 80%     | ≥ 70%  | N/A |

## Rules

- Never mark a module as Adequate if any file within it is below threshold
- MC/DC must appear for ASIL-C/D files even if the tool didn't produce it (show "Missing" in red)
- Overall adequacy badge in header reflects the worst module result — not the average
- Uncovered line count must appear in per-file rows — not just a percentage
- If test count is zero for a file with ASIL > QM, show a red "No tests" badge

## Input

gcov/lcov XML or text report, Ceedling `test_results` + `gcov` output, or CSV table with columns `module, file, asil, stmt_pct, branch_pct, mcdc_pct, uncovered, tests_pass, tests_total`.

## Output

Path to the generated `.html` test coverage dashboard.
