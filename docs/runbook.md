# Movie Search Runbook

This runbook covers how to install, develop, build, verify, and deploy the Movie Search application.

## Prerequisites

- Node.js 22.12 or newer and npm (required for modern tooling and Commitlint).
- Git installed.
- TMDB API Read Access Token (from [The Movie Database](https://www.themoviedb.org/)).
- Access to the [movie-search repository](https://github.com/tommyullberg/movie-search) to push changes and publish to GitHub Pages.

## Local Development

1. Clone the repository and enter the directory:

   ```bash
   git clone https://github.com/tommyullberg/movie-search.git
   cd movie-search
   ```

2. Create a local environment file from the template:

   ```bash
   cp .env.example .env.local
   ```

   Set `VITE_TMDB_READ_ACCESS_TOKEN` in `.env.local` to your TMDB API Read Access Token.
   Never commit `.env.local`; it is ignored by Git.

3. Install project dependencies:

   ```bash
   npm install
   ```

4. Start the Vite development server:

   ```bash
   npm run dev
   ```

   Vite serves the application at [http://localhost:5173/movie-search/](http://localhost:5173/movie-search/) with fast Hot Module Replacement (HMR).

## API Smoke Check and Verification

To verify that your TMDB API credentials and network connectivity are operational before building or deploying, run the smoke check:

```bash
npm run check:api
```

This runs `scripts/check-tmdb-api.cjs`, loads `VITE_TMDB_READ_ACCESS_TOKEN` from `.env.local`, queries the TMDB Popular Movies endpoint, and reports success or error diagnostics without starting the browser.

## Build for Production

Compile TypeScript and build the optimized static bundle with Vite:

```bash
npm run build
```

This command runs `tsc -b` for strict typechecking, followed by `vite build`. The production-ready static assets are output to the `dist/` directory.

To preview the production build locally:

```bash
npm run preview
```

## Commit Conventions & Pre-commit Hooks

Commits must strictly adhere to the Conventional Commits specification. A Husky pre-commit hook runs Commitlint automatically on each commit.

Format: `<type>(<scope>): <description>`

- Allowed types: `feat`, `fix`, `docs`, `chore`, `refactor`, `test`, `ci`, `build`, `style`, `perf`, `revert`.
- Scope is optional and must be lowercase, e.g. `(ui)`, `(api)`, `(deps)`.
- The first line must not exceed 100 characters.
- Breaking changes can append `!` before the colon, e.g. `feat(api)!: upgrade authentication`.

Examples:

```text
feat(ui): add high contrast theme toggle
fix(search): prevent duplicate movie card rendering
docs(runbook): update deployment guide for Vite
chore(deps): upgrade dependencies to React 19
```

## Deploy to GitHub Pages

The application is deployed to GitHub Pages using the `gh-pages` package, which publishes the contents of the `dist/` directory directly to the `gh-pages` branch.

1. Ensure all changes are committed and pushed to `main`:

   ```bash
   git status
   git push origin main
   ```

2. Run the deploy script:

   ```bash
   npm run deploy
   ```

   This automatically triggers `predeploy` (`npm run build`) and publishes `dist/` to the remote `gh-pages` branch.

3. GitHub Pages Settings:
   - Ensure repository settings under **Settings > Pages** are configured to deploy from branch `gh-pages`, folder `/(root)`.
   - Access the live application at: [https://tommyullberg.github.io/movie-search/](https://tommyullberg.github.io/movie-search/)

## Deployment Checklist

- Confirm that `base` in `vite.config.ts` is set to `/movie-search/`.
- Confirm that `homepage` in `package.json` is set to `https://tommyullberg.github.io/movie-search`.
- Ensure `.env.local` is never staged or committed.
- Verify the live site after deployment and check browser console for zero errors.
