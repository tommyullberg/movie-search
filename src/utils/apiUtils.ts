import { MovieDetailsModel } from '../model/MovieDetailsModel';
import { PersonDetailsModel, PersonSearchResult } from '../model/PersonDetailsModel';

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

export const TMDB_GENRES = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
] as const;

export type SearchType = 'movie' | 'person' | 'keyword';

export interface AdvancedFilterOptions {
  genre?: string;
  year?: string;
  minRating?: number;
  sortBy?: string;
}

export async function fetchSearchResults(
  searchTerm: string,
  searchCategory: string,
  page: number = 1,
  searchType: SearchType = 'movie',
  advancedFilters?: AdvancedFilterOptions
): Promise<{ results: unknown[]; totalPages?: number; error?: string }> {
  try {
    let url = '';

    if (searchTerm.trim() !== '') {
      const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
      if (searchType === 'person') {
        url = `https://api.themoviedb.org/3/search/person?query=${encodedSearchTerm}&include_adult=false&language=en-US&page=${page}`;
      } else if (searchType === 'keyword') {
        url = `https://api.themoviedb.org/3/search/keyword?query=${encodedSearchTerm}&page=${page}`;
      } else {
        url = `https://api.themoviedb.org/3/search/movie?query=${encodedSearchTerm}&include_adult=false&language=en-US&page=${page}`;
      }
    } else if (advancedFilters && (advancedFilters.genre || advancedFilters.year || advancedFilters.minRating || advancedFilters.sortBy)) {
      const params = new URLSearchParams({
        include_adult: 'false',
        language: 'en-US',
        page: page.toString(),
        sort_by: advancedFilters.sortBy || 'popularity.desc',
      });
      if (advancedFilters.genre) params.append('with_genres', advancedFilters.genre);
      if (advancedFilters.year) params.append('primary_release_year', advancedFilters.year);
      if (advancedFilters.minRating && advancedFilters.minRating > 0) {
        params.append('vote_average.gte', advancedFilters.minRating.toString());
        params.append('vote_count.gte', '50');
      }
      url = `https://api.themoviedb.org/3/discover/movie?${params.toString()}`;
    } else {
      switch (searchCategory) {
        case 'trending':
          url = `https://api.themoviedb.org/3/trending/movie/week?language=en-US&page=${page}`;
          break;
        case 'nowplaying':
          url = `https://api.themoviedb.org/3/movie/now_playing?language=en-US&page=${page}`;
          break;
        case 'popular':
          url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${page}`;
          break;
        case 'toprated':
          url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${page}`;
          break;
        case 'upcoming':
          url = `https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=${page}`;
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

      // If searching for person, return matching actors/directors as person cards
      if (searchType === 'person' && searchTerm.trim() !== '') {
        const people = (data.results as Array<PersonSearchResult>) || [];
        const mappedPeople: PersonSearchResult[] = people.map((p) => ({
          ...p,
          media_type: 'person' as const,
        }));
        return { results: mappedPeople, totalPages: data.total_pages || 0 };
      }

      // If searching for keyword, discover movies with top matched keywords
      if (searchType === 'keyword' && searchTerm.trim() !== '') {
        const keywords = (data.results as Array<{ id: number }>) || [];
        if (keywords.length > 0) {
          const keywordIds = keywords.slice(0, 3).map((k) => k.id).join('|');
          const discUrl = `https://api.themoviedb.org/3/discover/movie?with_keywords=${keywordIds}&language=en-US&page=${page}&sort_by=popularity.desc`;
          const discRes = await fetch(discUrl, requestOptions);
          if (discRes.ok) {
            const discData = await discRes.json();
            return { results: discData.results || [], totalPages: discData.total_pages || 0 };
          }
        }
        return { results: [], totalPages: 0 };
      }

      return { results: data.results || [], totalPages: data.total_pages || 0 };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Error fetching search results from API:', error);
    return { results: [], totalPages: 0, error: message };
  }

  return { results: [], totalPages: 0 };
}

export async function getMovieById(
  movieId: number
): Promise<MovieDetailsModel | null> {
  try {
    if (movieId > 0) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US&append_to_response=videos,credits,recommendations,watch/providers`;
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

export async function getPersonById(
  personId: number
): Promise<PersonDetailsModel | null> {
  try {
    if (personId > 0) {
      const url = `https://api.themoviedb.org/3/person/${personId}?language=en-US&append_to_response=movie_credits,external_ids`;
      const response = await fetch(url, requestOptions);
      if (!response.ok) {
        throw new Error(`API returned ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return {
        ...data,
        imdb_id: data.imdb_id || data.external_ids?.imdb_id || null,
      } as PersonDetailsModel;
    }
  } catch (error) {
    console.error('Error fetching person details from API:', error);
  }

  return null;
}
