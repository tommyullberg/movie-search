# Release Runbook

This document details the CI/CD deployment architecture, release procedure, and operational guidelines for the **Movie Search** application.

---

## 1. Architecture Overview

The repository deploys to **GitHub Pages** using an automated GitHub Actions workflow defined in [`.github/workflows/deploy.yml`](../.github/workflows/deploy.yml).

### Hosting Layout

```text
https://tommyullberg.github.io/movie-search/
├── /              Modern Version 2 (React 19, Vite, Tailwind CSS v4)
├── /about/        Modern v2 About documentation
├── /docs/images/  Showcase screenshots, media, and video assets
├── /v1/           Legacy Version 1 (React 18, Create React App)
└── /v1/about/     Legacy v1 documentation
```

### Key Workflow Characteristics

- **Trigger Policy**: Triggered on pushing Git release tags matching SemVer (`v[2-9].*`, e.g., `v2.0.0`, `v2.1.0`), as well as manual trigger (`workflow_dispatch`).
- **SemVer Validation**: Enforces SemVer compliance and verifies that the tag's major version is >= 2.
- **Node.js 22 Runtime**: Executes on Node.js 22 with dependency caching, performs automated typechecking (`tsc -b`), and compiles the Vite production bundle.
- **Legacy v1 Preservation**: Extracts the legacy Version 1 build artifact from the `gh-pages` branch into `dist/v1/`, including its original README markdown and dedicated SPA route handling (`/v1/about/index.html`).
- **Clean Root Deployment**: Cleans up legacy Create React App root files on the `gh-pages` branch while deploying modern Version 2 to the root, preserving `/v1/` intact.
- **SPA Fallback**: Prepares a root `404.html` and pre-rendered subroutes so direct URLs and page refreshes work seamlessly on GitHub Pages.

---

## 2. Standard Release Procedure

Follow these steps to release a new version of the application:

### Step 1: Verify Working Copy and Branch

Ensure all intended changes are committed and pushed to `main`:

```bash
git checkout main
git pull origin main
git status
```

### Step 2: Create a Semantic Version Tag

Create an annotated or standard tag adhering to Semantic Versioning:

- Feature release (minor bump):

  ```bash
  git tag v2.1.0
  ```

- Bug fix release (patch bump):

  ```bash
  git tag v2.0.1
  ```

### Step 3: Push Tag to GitHub

Push the release tag to GitHub to trigger the deployment pipeline:

```bash
git push origin v2.1.0
```

### Step 4: Monitor Pipeline Execution

Inspect workflow progress using the GitHub CLI:

```bash
gh run list --limit 2
gh run watch <run-id>
```

Or monitor live in the browser under the **Actions** tab on GitHub:
[https://github.com/tommyullberg/movie-search/actions](https://github.com/tommyullberg/movie-search/actions)

### Step 5: Post-Deployment Verification

Verify both live application targets once the pipeline completes:

1. **Modern Version 2 (Root)**:
   - URL: [https://tommyullberg.github.io/movie-search/](https://tommyullberg.github.io/movie-search/)
   - Check movie grid rendering, filters, modal dialogs, and SVG favicon.
2. **Modern Version 2 About View**:
   - URL: [https://tommyullberg.github.io/movie-search/about](https://tommyullberg.github.io/movie-search/about)
   - Verify screenshots, collapsible gallery, and local video walkthrough playback.
3. **Legacy Version 1 (Subdirectory)**:
   - URL: [https://tommyullberg.github.io/movie-search/v1/](https://tommyullberg.github.io/movie-search/v1/)
   - Verify movie cards and gauge meters load via TMDB API.
4. **Legacy Version 1 About View**:
   - URL: [https://tommyullberg.github.io/movie-search/v1/about](https://tommyullberg.github.io/movie-search/v1/about)
   - Verify direct loading and browser reload without 404 errors.

---

## 3. Secrets & Configuration

The deployment pipeline requires the following GitHub repository secret:

| Secret Name | Purpose | Location |
| :--- | :--- | :--- |
| `VITE_TMDB_READ_ACCESS_TOKEN` | Injected into the Vite build environment to authenticate client TMDB API requests | GitHub Repo Settings > Secrets and variables > Actions |

To update the secret via GitHub CLI:

```bash
gh secret set VITE_TMDB_READ_ACCESS_TOKEN --body "your_tmdb_token_here"
```

---

## 4. Rollback & Emergency Recovery

In case of a critical issue in a release:

1. Locate the last stable release tag (e.g. `v2.0.0`).
2. If necessary, re-tag the stable commit and force push:

   ```bash
   git tag -f v2.0.0 <stable-commit-sha>
   git push origin -f v2.0.0
   ```

3. Alternatively, trigger the workflow manually with `workflow_dispatch` selecting the target ref.
