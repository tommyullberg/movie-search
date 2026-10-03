const fs = require('fs');
const path = require('path');
const axios = require('axios');

const tokenVariable = 'REACT_APP_TMDB_READ_ACCESS_TOKEN';
const tokenFile = path.resolve(__dirname, '..', '.env.local');
const popularMoviesUrl =
  'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';

function getToken() {
  if (process.env[tokenVariable]) {
    return process.env[tokenVariable];
  }

  try {
    const envLine = fs
      .readFileSync(tokenFile, 'utf8')
      .split(/\r?\n/)
      .map((line) => line.trim())
      .find((line) => line.startsWith(`${tokenVariable}=`));

    if (!envLine) {
      return '';
    }

    let token = envLine.slice(tokenVariable.length + 1).trim();
    if (
      (token.startsWith('"') && token.endsWith('"')) ||
      (token.startsWith("'") && token.endsWith("'"))
    ) {
      token = token.slice(1, -1);
    }

    return token;
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
      `TMDB API check failed: ${tokenVariable} is missing or empty. Set it in .env.local.`
    );
    process.exitCode = 1;
    return;
  }

  try {
    const response = await axios.get(popularMoviesUrl, {
      headers: {
        accept: 'application/json',
        Authorization: `Bearer ${token}`
      },
      timeout: 10000
    });

    if (!Array.isArray(response.data.results)) {
      console.error(
        'TMDB API check failed: response did not include a results list.'
      );
      process.exitCode = 1;
      return;
    }

    console.log(
      `TMDB API check passed: ${response.data.results.length} popular movies returned.`
    );
  } catch (error) {
    const status = error.response && error.response.status;
    const errorDescription = status
      ? `HTTP ${status}`
      : error.code || 'network error';

    console.error(
      `TMDB API check failed (${errorDescription}). Check the credential and internet connection.`
    );
    process.exitCode = 1;
  }
}

checkTmdbApi();
