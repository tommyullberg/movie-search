import { MovieDetailsModel } from '../model/MovieDetailsModel';

const apiReadAccessToken = import.meta.env.VITE_TMDB_READ_ACCESS_TOKEN;

if (!apiReadAccessToken) {
  throw new Error(
    'TMDB API read access token is not configured. Set VITE_TMDB_READ_ACCESS_TOKEN in .env.local.'
  );
}

const requestOptions = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${apiReadAccessToken}`
  }
};

export async function fetchSearchResults(
  searchTerm: string,
  searchCategory: string
): Promise<{ results: unknown[]; error?: string }> {
  try {
    let url = '';

    if (searchTerm !== '') {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      url = `https://api.themoviedb.org/3/search/movie?query=${encodedSearchTerm}&include_adult=false&language=en-US&page=1`;
    } else {
      switch (searchCategory) {
        case 'trending':
          url = 'https://api.themoviedb.org/3/trending/movie/week?language=en-US';
          break;
        case 'popular':
          url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
          break;
        case 'toprated':
          url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
          break;
        case 'upcoming':
          url = 'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
          break;
        default:
          break;
      }
    }

    if (url !== '') {
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`API returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return { results: data.results };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching search results from API:', error);
    return { results: [], error: message };
  }

  return { results: [] };
}

export async function getMovieById(
  movieId: number
): Promise<MovieDetailsModel | null> {
  try {
    if (movieId > 0) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`API returned ${response.status} ${response.statusText}`);
      }
      return await response.json() as MovieDetailsModel;
    }
  } catch (error) {
    console.error('Error fetching movie details from API:', error);
  }

  return null;
}
