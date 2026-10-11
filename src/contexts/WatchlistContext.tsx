import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { SearchResult } from '../components/SearchResults';
import { MovieDetailsModel } from '../model/MovieDetailsModel';

export type LibrarySortOption =
  | 'added.desc'
  | 'added.asc'
  | 'vote.desc'
  | 'vote.asc'
  | 'myrating.desc'
  | 'myrating.asc'
  | 'year.desc'
  | 'year.asc'
  | 'title.asc';

export interface MovieReview {
  rating?: number; // 1 to 10
  notes?: string;
  updatedAt?: number;
}

export interface SavedMovie extends SearchResult {
  addedAt?: number;
}

interface WatchlistContextType {
  watchlist: SavedMovie[];
  watchedList: SavedMovie[];
  reviews: Record<number, MovieReview>;
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
  getReview: (movieId: number) => MovieReview | undefined;
  saveReview: (movieId: number, review: { rating?: number; notes?: string }) => void;
  deleteReview: (movieId: number) => void;
  getSortedList: (listType: 'watchlist' | 'watched') => SavedMovie[];
  exportLibrary: () => void;
  importLibrary: (jsonString: string) => { importedWatchlist: number; importedWatched: number; importedReviews: number };
}

const WatchlistContext = createContext<WatchlistContextType | undefined>(undefined);

const WATCHLIST_STORAGE_KEY = 'movie-search-watchlist';
const WATCHED_STORAGE_KEY = 'movie-search-watched';
const REVIEWS_STORAGE_KEY = 'movie-search-reviews';
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

  const [reviews, setReviews] = useState<Record<number, MovieReview>>(() => {
    try {
      const saved = localStorage.getItem(REVIEWS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (err) {
      console.error('Failed to parse movie reviews from localStorage:', err);
      return {};
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
      localStorage.setItem(REVIEWS_STORAGE_KEY, JSON.stringify(reviews));
    } catch (err) {
      console.error('Failed to save reviews to localStorage:', err);
    }
  }, [reviews]);

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

  const getReview = (movieId: number): MovieReview | undefined => {
    return reviews[movieId];
  };

  const saveReview = (movieId: number, review: { rating?: number; notes?: string }) => {
    setReviews((prev) => ({
      ...prev,
      [movieId]: {
        ...(prev[movieId] || {}),
        ...review,
        updatedAt: Date.now(),
      },
    }));
  };

  const deleteReview = (movieId: number) => {
    setReviews((prev) => {
      const next = { ...prev };
      delete next[movieId];
      return next;
    });
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
      case 'myrating.desc':
        return list.sort((a, b) => {
          const ratingA = reviews[a.id]?.rating ?? -1;
          const ratingB = reviews[b.id]?.rating ?? -1;
          if (ratingB !== ratingA) return ratingB - ratingA;
          return (b.addedAt || 0) - (a.addedAt || 0);
        });
      case 'myrating.asc':
        return list.sort((a, b) => {
          const ratingA = reviews[a.id]?.rating ?? 999;
          const ratingB = reviews[b.id]?.rating ?? 999;
          if (ratingA !== ratingB) return ratingA - ratingB;
          return (b.addedAt || 0) - (a.addedAt || 0);
        });
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
      reviews,
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

  const importLibrary = (jsonString: string): { importedWatchlist: number; importedWatched: number; importedReviews: number } => {
    let parsed: any;
    try {
      parsed = JSON.parse(jsonString);
    } catch {
      throw new Error('Invalid JSON format');
    }

    let importedWlRaw: any[] = [];
    let importedWatchedRaw: any[] = [];
    let importedReviewsRaw: Record<string | number, MovieReview> = {};

    if (Array.isArray(parsed)) {
      importedWlRaw = parsed;
    } else if (parsed && typeof parsed === 'object') {
      if (Array.isArray(parsed.watchlist)) importedWlRaw = parsed.watchlist;
      if (Array.isArray(parsed.watchedList)) importedWatchedRaw = parsed.watchedList;
      if (parsed.reviews && typeof parsed.reviews === 'object' && !Array.isArray(parsed.reviews)) {
        importedReviewsRaw = parsed.reviews;
      }
    } else {
      throw new Error('Unsupported JSON structure');
    }

    const validWl = importedWlRaw.filter((m) => m && typeof m.id === 'number' && m.title).map(normalizeMovie);
    const validWatched = importedWatchedRaw.filter((m) => m && typeof m.id === 'number' && m.title).map(normalizeMovie);

    // Compute added counts based on existing state
    const currentWlIds = new Set(watchlist.map((m) => m.id));
    const newWlItems = validWl.filter((m) => !currentWlIds.has(m.id));
    const countWl = newWlItems.length;

    const currentWatchedIds = new Set(watchedList.map((m) => m.id));
    const newWatchedItems = validWatched.filter((m) => !currentWatchedIds.has(m.id));
    const countWatched = newWatchedItems.length;

    let countReviews = 0;
    Object.keys(importedReviewsRaw).forEach((idStr) => {
      const idNum = Number(idStr);
      if (!isNaN(idNum) && importedReviewsRaw[idStr] && !reviews[idNum]) {
        countReviews++;
      }
    });

    if (countWl > 0) {
      setWatchlist((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const toAdd = validWl.filter((m) => !existingIds.has(m.id));
        return [...toAdd, ...prev];
      });
    }

    if (countWatched > 0) {
      setWatchedList((prev) => {
        const existingIds = new Set(prev.map((m) => m.id));
        const toAdd = validWatched.filter((m) => !existingIds.has(m.id));
        return [...toAdd, ...prev];
      });
    }

    setReviews((prev) => {
      const next = { ...prev };
      Object.entries(importedReviewsRaw).forEach(([idStr, rev]) => {
        const idNum = Number(idStr);
        if (!isNaN(idNum) && rev && typeof rev === 'object') {
          if (!next[idNum]) {
            next[idNum] = rev;
          } else {
            // Merge review if not existing
            next[idNum] = {
              rating: rev.rating ?? next[idNum].rating,
              notes: rev.notes ?? next[idNum].notes,
              updatedAt: Math.max(rev.updatedAt || 0, next[idNum].updatedAt || 0),
            };
          }
        }
      });
      return next;
    });

    return { importedWatchlist: countWl, importedWatched: countWatched, importedReviews: countReviews };
  };

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        watchedList,
        reviews,
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
        getReview,
        saveReview,
        deleteReview,
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
