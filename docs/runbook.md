# Movie Search Runbook

This runbook covers how to install, run, build, test, and deploy the Movie Search app.

## Prerequisites

- Node.js and npm installed.
- Git installed.
- Access to the [movie-search GitHub repository](https://github.com/tommyullberg/movie-search) to push changes and publish the site.

## Run the app locally

1. Clone the repository and enter the project directory:

	```sh
	git clone https://github.com/tommyullberg/movie-search.git
	cd movie-search
	```

2. Install dependencies:

	```sh
	npm install
	```

3. Start the development server:

	```sh
	npm start
	```

	Create React App opens the app at [http://localhost:3000](http://localhost:3000). The development server reloads when source files change.

## Test and build

Run the test suite:

```sh
npm test
```

Create a production build:

```sh
npm run build
```

The optimized static site is written to the `build/` directory. The `homepage` setting in `package.json` is configured for the GitHub Pages project path, so the generated asset URLs use the correct base path.

## Deploy to GitHub Pages

The project uses `gh-pages` to publish the contents of `build/` to the `gh-pages` branch. The `predeploy` script automatically builds the app before the deploy script runs.

1. Commit and push the changes you want to publish to the repository's source branch (`main`, or `master` if that is the branch in use):

	```sh
	git add .
	git commit -m "Describe the changes"
	git push origin main
	```

	If the repository uses `master`, replace `main` in the push command with `master`.

2. From the project directory, publish the app:

	```sh
	npm run deploy
	```

	This runs `npm run build`, then publishes the generated `build/` directory to the `gh-pages` branch.

3. In the GitHub repository, open **Settings > Pages** and configure the publishing source as:

	- **Source:** Deploy from a branch
	- **Branch:** `gh-pages`
	- **Folder:** `/(root)`

	Save the settings if you changed them. The Pages source branch is `gh-pages`; it is separate from the source branch where you develop the app.

4. After GitHub Pages finishes publishing, visit [https://tommyullberg.github.io/movie-search/](https://tommyullberg.github.io/movie-search/). The initial publish or a new deploy can take a few minutes to appear.

## Deployment checks

- Confirm that `homepage` in `package.json` is `https://tommyullberg.github.io/movie-search`.
- Confirm that the latest source changes have been pushed before running `npm run deploy`.
- Confirm that GitHub Pages is configured to publish the `gh-pages` branch from the repository root.
- If the site does not update immediately, allow a few minutes for GitHub Pages to finish publishing, then reload the site.
