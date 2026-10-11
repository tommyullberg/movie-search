import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SearchResult } from '../components/SearchResults';
import { MovieDetailsModel } from '../model/MovieDetailsModel';

interface WatchlistContextType {
  watchlist: SearchResult[];
  addToWatchlist: (movie: SearchResult | MovieDetailsModel) => void;
  removeFromWatchlist: (movieId: number) => void;
  toggleWatchlist: (movie: SearchResult | MovieDetailsModel) => void;
  isInWatchlist: (movieId: number) => boolean;
  clearWatchlist: () => void;
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const STORAGE_KEY = 'movie-search-watchlist';

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<SearchResult[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to parse watchlist from localStorage:', err);
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (err) {
      console.error('Failed to save watchlist to localStorage:', err);
    }
  }, [watchlist]);

  const isInWatchlist = (movieId: number): boolean => {
    return watchlist.some((movie) => movie.id === movieId);
  };

  const addToWatchlist = (movie: SearchResult | MovieDetailsModel) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      const normalized: SearchResult = {
        id: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        backdrop_path: movie.backdrop_path,
        release_date: movie.release_date,
        vote_average: movie.vote_average,
        vote_count: movie.vote_count || 0,
        overview: movie.overview || '',
        popularity: movie.popularity || 0,
        adult: movie.adult || false,
        genre_ids: 'genre_ids' in movie ? movie.genre_ids : (movie.genres?.map((g) => g.id) || []),
        original_language: movie.original_language || 'en',
        original_title: movie.original_title || movie.title,
        video: movie.video || false,
      };
      return [normalized, ...prev];
    });
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const toggleWatchlist = (movie: SearchResult | MovieDetailsModel) => {
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  };

  const clearWatchlist = () => {
    setWatchlist([]);
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
        clearWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (context === undefined) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
