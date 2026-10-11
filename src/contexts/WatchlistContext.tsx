import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SearchResult } from '../components/SearchResults';
import { MovieDetailsModel } from '../model/MovieDetailsModel';

export type LibrarySortOption =
  | 'added.desc'
  | 'added.asc'
  | 'vote.desc'
  | 'vote.asc'
  | 'year.desc'
  | 'year.asc'
  | 'title.asc';

export interface SavedMovie extends SearchResult {
  addedAt?: number;
}

interface WatchlistContextType {
  watchlist: SavedMovie[];
  watchedList: SavedMovie[];
  librarySort: LibrarySortOption;
  setLibrarySort: (sort: LibrarySortOption) => void;
  addToWatchlist: (movie: SearchResult | MovieDetailsModel) => void;
  removeFromWatchlist: (movieId: number) => void;
  toggleWatchlist: (movie: SearchResult | MovieDetailsModel) => void;
  isInWatchlist: (movieId: number) => boolean;
  clearWatchlist: () => void;
  addToWatched: (movie: SearchResult | MovieDetailsModel) => void;
  removeFromWatched: (movieId: number) => void;
  toggleWatched: (movie: SearchResult | MovieDetailsModel) => void;
  isWatched: (movieId: number) => boolean;
  moveToWatched: (movie: SearchResult | MovieDetailsModel) => void;
  moveToWatchlist: (movie: SearchResult | MovieDetailsModel) => void;
  clearWatched: () => void;
  getSortedList: (listType: 'watchlist' | 'watched') => SavedMovie[];
  exportLibrary: () => void;
  importLibrary: (jsonString: string) => { importedWatchlist: number; importedWatched: number };
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const WATCHLIST_STORAGE_KEY = 'movie-search-watchlist';
const WATCHED_STORAGE_KEY = 'movie-search-watched';
const SORT_STORAGE_KEY = 'movie-search-library-sort';

const normalizeMovie = (movie: SearchResult | MovieDetailsModel): SavedMovie => {
  return {
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
    genre_ids: 'genre_ids' in movie && Array.isArray(movie.genre_ids)
      ? movie.genre_ids
      : ('genres' in movie && Array.isArray(movie.genres) ? movie.genres.map((g: { id: number }) => g.id) : []),
    original_language: movie.original_language || 'en',
    original_title: movie.original_title || movie.title,
    video: movie.video || false,
    addedAt: 'addedAt' in movie && typeof movie.addedAt === 'number' ? movie.addedAt : Date.now(),
  };
};

export function WatchlistProvider({ children }: { children: ReactNode }) {
  const [watchlist, setWatchlist] = useState<SavedMovie[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHLIST_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to parse watchlist from localStorage:', err);
      return [];
    }
  });

  const [watchedList, setWatchedList] = useState<SavedMovie[]>(() => {
    try {
      const saved = localStorage.getItem(WATCHED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (err) {
      console.error('Failed to parse watched list from localStorage:', err);
      return [];
    }
  });

  const [librarySort, setLibrarySort] = useState<LibrarySortOption>(() => {
    try {
      const saved = localStorage.getItem(SORT_STORAGE_KEY);
      return (saved as LibrarySortOption) || 'added.desc';
    } catch {
      return 'added.desc';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(WATCHLIST_STORAGE_KEY, JSON.stringify(watchlist));
    } catch (err) {
      console.error('Failed to save watchlist to localStorage:', err);
    }
  }, [watchlist]);

  useEffect(() => {
    try {
      localStorage.setItem(WATCHED_STORAGE_KEY, JSON.stringify(watchedList));
    } catch (err) {
      console.error('Failed to save watched list to localStorage:', err);
    }
  }, [watchedList]);

  useEffect(() => {
    try {
      localStorage.setItem(SORT_STORAGE_KEY, librarySort);
    } catch (err) {
      console.error('Failed to save library sort to localStorage:', err);
    }
  }, [librarySort]);

  const isInWatchlist = (movieId: number): boolean => {
    return watchlist.some((movie) => movie.id === movieId);
  };

  const isWatched = (movieId: number): boolean => {
    return watchedList.some((movie) => movie.id === movieId);
  };

  const addToWatchlist = (movie: SearchResult | MovieDetailsModel) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [normalizeMovie(movie), ...prev];
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

  const addToWatched = (movie: SearchResult | MovieDetailsModel) => {
    setWatchedList((prev) => {
      if (prev.some((m) => m.id === movie.id)) return prev;
      return [normalizeMovie(movie), ...prev];
    });
  };

  const removeFromWatched = (movieId: number) => {
    setWatchedList((prev) => prev.filter((movie) => movie.id !== movieId));
  };

  const toggleWatched = (movie: SearchResult | MovieDetailsModel) => {
    if (isWatched(movie.id)) {
      removeFromWatched(movie.id);
    } else {
      // Add to watched
      addToWatched(movie);
      // If movie was in watchlist, remove from watchlist as it is now watched
      if (isInWatchlist(movie.id)) {
        removeFromWatchlist(movie.id);
      }
    }
  };

  const moveToWatched = (movie: SearchResult | MovieDetailsModel) => {
    removeFromWatchlist(movie.id);
    addToWatched(movie);
  };

  const moveToWatchlist = (movie: SearchResult | MovieDetailsModel) => {
    removeFromWatched(movie.id);
    addToWatchlist(movie);
  };

  const clearWatched = () => {
    setWatchedList([]);
  };

  const getSortedList = (listType: 'watchlist' | 'watched'): SavedMovie[] => {
    const list = listType === 'watchlist' ? [...watchlist] : [...watchedList];

    switch (librarySort) {
      case 'added.desc':
        return list.sort((a, b) => (b.addedAt || 0) - (a.addedAt || 0));
      case 'added.asc':
        return list.sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));
      case 'vote.desc':
        return list.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
      case 'vote.asc':
        return list.sort((a, b) => (a.vote_average || 0) - (b.vote_average || 0));
      case 'year.desc':
        return list.sort((a, b) => (b.release_date || '').localeCompare(a.release_date || ''));
      case 'year.asc':
        return list.sort((a, b) => (a.release_date || '').localeCompare(b.release_date || ''));
      case 'title.asc':
        return list.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
      default:
        return list;
    }
  };

  const exportLibrary = () => {
    const data = {
      version: 1,
      exportedAt: new Date().toISOString(),
      watchlist,
      watchedList,
    };
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const dateStr = new Date().toISOString().slice(0, 10);
    const a = document.createElement('a');
    a.href = url;
    a.download = `movie-library-${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importLibrary = (jsonString: string): { importedWatchlist: number; importedWatched: number } => {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      throw new Error('Invalid JSON format');
    }

    let importedWlRaw: any[] = [];
    let importedWatchedRaw: any[] = [];

    if (Array.isArray(parsed)) {
      importedWlRaw = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.watchlist)) importedWlRaw = parsed.watchlist;
      if (Array.isArray(parsed.watchedList)) importedWatchedRaw = parsed.watchedList;
    } else {
      throw new Error('Unsupported JSON structure');
    }

    const validWl = importedWlRaw.filter((m) => m && typeof m.id === 'number' && m.title).map(normalizeMovie);
    const validWatched = importedWatchedRaw.filter((m) => m && typeof m.id === 'number' && m.title).map(normalizeMovie);

    let countWl = 0;
    let countWatched = 0;

    setWatchlist((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const toAdd = validWl.filter((m) => !existingIds.has(m.id));
      countWl = toAdd.length;
      return [...toAdd, ...prev];
    });

    setWatchedList((prev) => {
      const existingIds = new Set(prev.map((m) => m.id));
      const toAdd = validWatched.filter((m) => !existingIds.has(m.id));
      countWatched = toAdd.length;
      return [...toAdd, ...prev];
    });

    return { importedWatchlist: countWl, importedWatched: countWatched };
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watchedList,
        librarySort,
        setLibrarySort,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
        clearWatchlist,
        addToWatched,
        removeFromWatched,
        toggleWatched,
        isWatched,
        moveToWatched,
        moveToWatchlist,
        clearWatched,
        getSortedList,
        exportLibrary,
        importLibrary,
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
