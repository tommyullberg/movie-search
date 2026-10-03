# Movie Search Runbook

This runbook covers how to install, run, build, test, and deploy the Movie Search app.

## Prerequisites

- Node.js 22.12 or newer and npm installed (Commitlint 21 requires Node.js 22.12+).
- Git installed.
- Access to the [movie-search GitHub repository](https://github.com/tommyullberg/movie-search) to push changes and publish the site.

## Run the app locally

1. Clone the repository and enter the project directory:

	```sh
	git clone https://github.com/tommyullberg/movie-search.git
	cd movie-search
	```

2. Create a local environment file from the example:

	```sh
	cp .env.example .env.local
	```

	Set `REACT_APP_TMDB_READ_ACCESS_TOKEN` in `.env.local` to your TMDB API Read Access Token. Do not commit `.env.local`; it is ignored by Git. The tracked `.env.example` intentionally contains no credential.

3. Install dependencies:

	```sh
	npm install
	```

4. Start the development server:

	```sh
	npm start
	```

	Create React App opens the app at [http://localhost:3000](http://localhost:3000). The development server reloads when source files change. Restart it after changing `.env.local`; CRA reads environment variables at startup.

The CRA build embeds `REACT_APP_*` values in the client bundle. Moving the token to `.env.local` prevents accidentally committing it in the source tree, but does not keep it secret from visitors to a static GitHub Pages deployment. Only use a credential intended for a public client; use a server-side proxy if the credential must remain private. The previously committed token should be revoked or rotated in TMDB.

## Test and build

Run the automated app tests:

```sh
npm test -- --watchAll=false
```

The tests in `src/App.test.tsx` verify the main heading and search controls, all four category buttons, a movie-title search, and navigation to the About page. TMDB search results and the About page's README request are mocked, so these tests do not use the local credential or require network access. The result fixture proves that returned results are rendered; it does not prove that TMDB is reachable.

To make a real request to TMDB before deployment, run the optional API smoke check:

```sh
npm run check:api
```

It uses `REACT_APP_TMDB_READ_ACCESS_TOKEN` from `.env.local`, requests the Popular Movies endpoint, and reports only the result count or a failure status. It requires internet access. It does not run as part of `npm test` or `npm run build`.

Create a production build:

```sh
npm run build
```

The build compiles the app without making a live API request, so it does not require TMDB availability. The optimized static site is written to `build/`. The `homepage` setting in `package.json` is configured for the GitHub Pages project path. CRA embeds `REACT_APP_*` values in the bundle, so the credential remains visible to site visitors.

## Deploy to GitHub Pages

The project uses `gh-pages` to publish the contents of `build/` to the `gh-pages` branch. The `predeploy` script automatically builds the app before the deploy script runs.

1. Review and stage only the files you intend to commit. Never stage `.env.local`:

	```sh
	git status --short --branch
	git add .commitlintrc.cjs .husky/commit-msg .env.example docs/runbook.md package-lock.json package.json scripts/check-tmdb-api.js src/App.test.tsx src/components/SearchForm/SearchForm.tsx src/utils/apiUtils.ts
	git --no-pager diff --cached
	```

2. Commit using the Conventional Commits format `<type>(<scope>): <summary>`. For example:

	```sh
	git commit -m "feat(api): configure TMDB credentials and add smoke check"
	git push origin main
	```

	Husky runs Commitlint automatically before each local commit. Allowed types are `build`, `chore`, `ci`, `docs`, `feat`, `fix`, `perf`, `refactor`, `revert`, `style`, and `test`. A scope such as `api`, `repo`, or `ui` is optional and must be lowercase. The summary is required, must not end in a period, and the complete header must be at most 100 characters. Breaking changes may use `!` before the colon, for example `feat(api)!: replace authentication`.

	Valid examples:

	```text
	fix: handle empty API results
	chore(repo): remove local-only files
	test(ui): cover About navigation
	feat(api)!: replace the authentication flow
	```

	Invalid examples include `update(api): change request` (type is not allowed), `chore(repo):` (missing summary), and `fix(API): handle errors` (scope is not lowercase). For future CI installs and fresh clones, `npm install` runs `npm run prepare` to register Husky. The local hook can be bypassed with `--no-verify`; a future CI check can enforce the policy on GitHub too. Keep credentials out of commit messages and tracked files.

3. When preparing the V1 release, run the automated tests and optional live API check:

	```sh
	npm test -- --watchAll=false
	npm run check:api
	```

	The API check requires a valid local `.env.local` and internet access. It is separate from the mocked tests and from the build.

4. If the package version should match V1, update `package.json` to `1.0.0`, then commit and push that version change before deploying. Build and publish from the tested `main` commit:

	```sh
	npm run deploy
	```

	This runs `npm run build`, then publishes `build/` to `gh-pages`. GitHub Pages serves that branch; pushing to `main` alone does not update the site.

5. In the GitHub repository, open **Settings > Pages** and configure the publishing source as:

	- **Source:** Deploy from a branch
	- **Branch:** `gh-pages`
	- **Folder:** `/(root)`

	Save the settings if you changed them. The Pages source branch is `gh-pages`; it is separate from the source branch where you develop the app.

6. After GitHub Pages finishes publishing, visit [https://tommyullberg.github.io/movie-search/](https://tommyullberg.github.io/movie-search/). The initial publish or a new deploy can take a few minutes to appear.

7. Once the deployed site is verified, tag the exact tested source commit and push the annotated V1 tag:

	```sh
	git tag -a v1.0.0 -m "Release v1.0.0"
	git push origin v1.0.0
	```

Future CI/CD can use Conventional Commit prefixes for changelog classification and version tags for releases. Configure tag-triggered automation to validate semantic versions greater than `2.0.0`; a commit prefix alone should not deploy a release.

## Deployment checks

- Confirm that `homepage` in `package.json` is `https://tommyullberg.github.io/movie-search`.
- Confirm that the latest source changes have been pushed before running `npm run deploy`.
- Confirm that GitHub Pages is configured to publish the `gh-pages` branch from the repository root.
- If the site does not update immediately, allow a few minutes for GitHub Pages to finish publishing, then reload the site.
