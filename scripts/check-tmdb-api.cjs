const fs = require('fs');
const path = require('path');

const tokenVariablePrimary = 'VITE_TMDB_READ_ACCESS_TOKEN';
const tokenVariableLegacy = 'REACT_APP_TMDB_READ_ACCESS_TOKEN';
const tokenFile = path.resolve(__dirname, '..', '.env.local');
const popularMoviesUrl =
  'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';

function getToken() {
  if (process.env[tokenVariablePrimary]) {
    return process.env[tokenVariablePrimary];
  }
  if (process.env[tokenVariableLegacy]) {
    return process.env[tokenVariableLegacy];
  }

  try {
    const lines = fs
      .readFileSync(tokenFile, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim());

    const findToken = (varName) => {
      const envLine = lines.find((line) => line.startsWith(`${varName}=`));
      if (!envLine) return '';
      let val = envLine.slice(varName.length + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      return val;
    };

    return findToken(tokenVariablePrimary) || findToken(tokenVariableLegacy);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return '';
    }

    throw error;
  }
}

async function checkTmdbApi() {
  const token = getToken();
  if (!token) {
    console.error(
      `TMDB API check failed: ${tokenVariablePrimary} is missing or empty. Set it in .env.local.`
    );
    process.exitCode = 1;
    return;
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(popularMoviesUrl, {
      method: 'GET',
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(
        `TMDB API check failed (HTTP ${response.status} ${response.statusText}). Check the credential and internet connection.`
      );
      process.exitCode = 1;
      return;
    }

    const data = await response.json();

    if (!Array.isArray(data.results)) {
      console.error(
        'TMDB API check failed: response did not include a results list.'
      );
      process.exitCode = 1;
      return;
    }

    console.log(
      `TMDB API check passed: ${data.results.length} popular movies returned.`
    );
  } catch (error) {
    const errorDescription = error.name === 'AbortError' ? 'timed out after 10s' : error.message || 'network error';
    console.error(
      `TMDB API check failed (${errorDescription}). Check the credential and internet connection.`
    );
    process.exitCode = 1;
  }
}

checkTmdbApi();
