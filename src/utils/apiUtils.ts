import React from 'react';
import axios, { AxiosRequestConfig } from 'axios';
import { setupCache } from 'axios-cache-adapter';
import qs from 'qs';
import localforage from 'localforage';
import { MovieDetailsModel } from '../model/MovieDetailsModel';

const DEBUG: boolean = true;
const CACHE_KEY: string = 'TMDB-API';

const createCacheAdapter = () => {
  const cache = setupCache({
    store: localforage.createInstance({
      name: 'TMDBCache' // Namnet på din cache-databas
    }),
    maxAge: 60 * 60 * 1000, // 60 minuter
    exclude: {
      query: false
    },
    key: (req) => {
      let key = req.url + qs.stringify(req.params, { addQueryPrefix: true });
      return `${CACHE_KEY}-${key}`;
    },
    debug: DEBUG
  });

  return cache.adapter;
};

const api = axios.create({
  adapter: createCacheAdapter()
});


const options: AxiosRequestConfig = {
  headers: {
    accept: 'application/json',
    Authorization:
      'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3ZDkzNDM2MDY4MDFlN2M4ZTg4ZGI4MDIyZDU4ZDczNiIsInN1YiI6IjY0OGQ3MmZjNDJiZjAxMDBlNDllMmYwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.fK5V-siVy95A00Sm-Wl9GfbLIQHd2Bk32GLVqzEQkiU'
  }
};

export async function fetchSearchResults(searchTerm: string, searchCategory: string) {
  try {
    let url = '';

    if (searchTerm !== '') {
      const encodedSearchTerm = encodeURIComponent(searchTerm);
      url = `https://api.themoviedb.org/3/search/movie?query=${encodedSearchTerm}&include_adult=false&language=en-US&page=1`;
    } else {
      switch (searchCategory) {
        case 'trending':
          url =
            'https://api.themoviedb.org/3/trending/movie/week?language=en-US';
          break;
        case 'popular':
          url =
            'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
          break;
        case 'toprated':
          url =
            'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1';
          break;
        case 'upcoming':
          url =
            'https://api.themoviedb.org/3/movie/upcoming?language=en-US&page=1';
          break;
        default:
          break;
      }
    }

    if (url !== '') {
      const response = await api.get(url, options);
      const results = response.data.results;

      console.log(results);

      return results;
    }
  } catch (error) {
    console.error('Error fetching search results from API:', error);
  }

  return [];
}


export async function getMovieById(movieId: number): Promise<MovieDetailsModel> {
  try {
    if (movieId > 0) {
      const url = `https://api.themoviedb.org/3/movie/${movieId}?language=en-US`;

      const response = await api.get(url, options);
      const data = response.data;

      console.log(data);

      const movieDetails: MovieDetailsModel = {
        ...data // Spread-operatören kopierar värdena från 'data' till 'movieDetails'
      };

      return movieDetails;
    }
  } catch (error) {
    console.error('Error fetching movie details from API:', error);
  }

  return {} as MovieDetailsModel;
}
