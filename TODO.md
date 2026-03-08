# TODO — Requires Company Network / GHE Access

This file captures tasks that cannot be completed offline. Complete these items once connected to the Vitesco Technologies network and the GHE instance (`github.vitesco.io`) is accessible.

---

## Section A — Placeholder Updates

The following files contain upstream placeholders that need real company values. Edit them directly once on-network.

### A1. `CODE_OF_CONDUCT.md`

**Line to find:**

```
<opensource@github.com>
```

**Replace with:** your company security or conduct contact (e.g., a team email or `@SWProductivity/aura-maintainers` GitHub team mention).

---

### A2. `AGENTS.md` — Line 11

**Line to find:**

```
https://github.github.com/gh-aw
```

**Replace with:** the internal GHE documentation URL for agentic workflows, or simply remove the external link and point to the `workflows/` directory in this repo:

```
https://github.vitesco.io/SWProductivity/AURA_Marketplace/tree/main/workflows
```

---

### A3. `package.json`

**Field to update:**

```json
"author": "GitHub"
```

**Replace with:**

```json
"author": "Vitesco Technologies"
```

---

## Section B — GHE Migration Guide

Follow these steps in order to migrate from GitHub.com to the company GitHub Enterprise instance.

### Step 1 — Create the GHE repository

On `github.vitesco.io`, create a new repository:

- **Organization:** `SWProductivity`
- **Repository name:** `AURA_Marketplace`
- **Visibility:** Internal (recommended for inner-source)
- **Do not** initialize with a README — you will push existing content

### Step 2 — Mirror-push from your local clone

```bash
cd /path/to/awesome-copilot   # your local clone

# Add the GHE remote
git remote add ghe https://github.vitesco.io/SWProductivity/AURA_Marketplace.git

# Push all branches and tags
git push ghe --all
git push ghe --tags
```

### Step 3 — Verify `package.json` repository URL

The `repository` field is already set to the GHE URL. Confirm it matches:

```json
"repository": {
  "url": "https://github.vitesco.io/SWProductivity/AURA_Marketplace.git"
}
```

No change needed if it matches. ✅

### Step 4 — Verify `eng/constants.mjs` raw URL

Open `eng/constants.mjs` and confirm `repoBaseUrl` points to the GHE raw content URL:

```
https://raw.github.vitesco.io/SWProductivity/AURA_Marketplace/main
```

Update it if it still references GitHub.com.

### Step 5 — Set the default branch to `main`

In GHE repository Settings → Branches → set default branch to `main`.

### Step 6 — Create the `develop` branch on GHE

```bash
git push ghe main:develop
```

Or create it via the GHE UI from `main`.

### Step 7 — Branch protection on `main`

In GHE Settings → Branches → Add rule for `main`:

- ✅ Require a pull request before merging
- ✅ Require status checks to pass: `validate-readme`, `codespell`, `check-plugin-structure`
- ✅ Do not allow bypassing the above settings

### Step 8 — Branch protection on `develop`

Add rule for `develop`:

- ✅ Require a pull request before merging (from feature branches)
- ✅ Dismiss stale pull request approvals when new commits are pushed

### Step 9 — Create the GitHub Team

Create team `aura-maintainers` under the `SWProductivity` organization:

- Add initial maintainers as members
- Set team visibility to **Visible** (so contributors can mention `@SWProductivity/aura-maintainers`)

The `CODEOWNERS` file already references this team — no file changes needed. ✅

### Step 10 — Enable GitHub Actions

In GHE Settings → Actions → General:

- Enable Actions for this repository
- Allow all actions (or restrict to trusted publishers if your GHE policy requires)

### Step 11 — Verify secrets

Current workflows use only `github.token` (auto-provided). No additional secrets should be required unless your GHE Actions policies restrict the default token permissions.

If the `codeowner-update` agentic workflow is enabled, it may need `GH_AW_GITHUB_TOKEN` and `GH_AW_CODEOWNER_PR_TOKEN` — check with your GHE admin.

### Step 12 — Test the full pipeline

**Test CI on a PR:**

1. Create a feature branch: `git checkout -b test/pipeline-check`
2. Make a trivial change (e.g., add a blank line to `cookbook/README.md`)
3. Push and open a PR targeting `develop`
4. Verify all CI checks pass: codespell, line-endings, validate-readme, check-plugin-structure

**Test the publish workflow:**

1. Merge the PR into `develop`
2. Verify the `publish.yml` workflow triggers and pushes to `main`
3. Confirm `docs/README.*.md` and `marketplace.json` are updated on `main`

### Step 13 — Complete Section A placeholder updates

Once on-network and the repo is live, complete the three placeholder updates in Section A above.

### Step 14 — Announce to contributors

Send the launch announcement to the SWProductivity community:

- Repository URL: `https://github.vitesco.io/SWProductivity/AURA_Marketplace`
- Point to: `README.md` (overview), `CONTRIBUTING.md` (how to contribute)
- Highlight the starter plugin: install with `gh copilot plugin install embedded-c-starter`

---

## Section C — Verification Commands

Run these after completing the GHE setup to confirm no upstream references remain:

```bash
# Build and validate
npm run build
npm run plugin:validate
npm run skill:validate

# Check for remaining staged references in CI (should return nothing)
grep -r "staged" .github/ --include="*.yml"

# Check for remaining upstream email
grep -r "opensource@github.com" . --include="*.md"

# Check for remaining upstream agentic workflow docs link
grep -r "github.github.com" . --include="*.md"

# Check for "GitHub" as author in package.json
grep '"author": "GitHub"' package.json
```

All commands above should return **no output** after completing Sections A and B.
