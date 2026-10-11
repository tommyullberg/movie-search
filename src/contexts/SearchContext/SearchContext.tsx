import React, { createContext, useContext, useState, useEffect } from 'react';
import { SearchResult } from '../../components/SearchResults';
import { MovieDetailsModel } from '../../model/MovieDetailsModel';
import { PersonDetailsModel } from '../../model/PersonDetailsModel';
import { SearchType, AdvancedFilterOptions, getMovieById } from '../../utils/apiUtils';

export interface DetailHistoryItem {
  type: 'movie' | 'person';
  id: number;
  title: string;
}

interface SearchContextData {
  searchCategory: string;
  searchTerm: string;
  searchType: SearchType;
  isAdvancedOpen: boolean;
  advancedFilters: AdvancedFilterOptions;
  searchResults: SearchResult[];
  isLoading: boolean;
  isFetchingMore: boolean;
  page: number;
  totalPages: number;
  error: string | null;
  selectedMovieId: number;
  movieData: MovieDetailsModel | null;
  selectedPersonId: number;
  personData: PersonDetailsModel | null;
  detailHistory: DetailHistoryItem[];
  openMovieDetailDirect: (movieId: number, title?: string) => Promise<void>;
  openPersonDetailDirect: (personId: number, name?: string) => void;
  navigateToMovie: (movieId: number, title?: string) => Promise<void>;
  navigateToPerson: (personId: number, name?: string) => void;
  goBackDetail: () => Promise<void>;
  closeAllDetails: () => void;
  updateSearchCategory: (category: string) => void;
  updateSearchTerm: (term: string) => void;
  updateSearchType: (type: SearchType) => void;
  updateIsAdvancedOpen: (open: boolean) => void;
  updateAdvancedFilters: (filters: AdvancedFilterOptions | ((prev: AdvancedFilterOptions) => AdvancedFilterOptions)) => void;
  updateSearchResults: (results: SearchResult[]) => void;
  appendSearchResults: (results: SearchResult[]) => void;
  updateIsLoading: (loading: boolean) => void;
  updateIsFetchingMore: (loading: boolean) => void;
  updatePage: (page: number) => void;
  updateTotalPages: (total: number) => void;
  updateError: (error: string | null) => void;
  updateSelectedMovieId: (id: number) => void;
  updateMovieData: (data: MovieDetailsModel | null) => void;
  updateSelectedPersonId: (id: number) => void;
  updatePersonData: (data: PersonDetailsModel | null) => void;
}

const SearchContext = createContext<SearchContextData>({
  searchCategory: '',
  searchTerm: '',
  searchType: 'movie',
  isAdvancedOpen: false,
  advancedFilters: {},
  searchResults: [],
  isLoading: false,
  isFetchingMore: false,
  page: 1,
  totalPages: 0,
  error: null,
  selectedMovieId: 0,
  movieData: null,
  selectedPersonId: 0,
  personData: null,
  detailHistory: [],
  openMovieDetailDirect: async () => {},
  openPersonDetailDirect: () => {},
  navigateToMovie: async () => {},
  navigateToPerson: () => {},
  goBackDetail: async () => {},
  closeAllDetails: () => {},
  updateSearchCategory: () => {},
  updateSearchTerm: () => {},
  updateSearchType: () => {},
  updateIsAdvancedOpen: () => {},
  updateAdvancedFilters: () => {},
  updateSearchResults: () => {},
  appendSearchResults: () => {},
  updateIsLoading: () => {},
  updateIsFetchingMore: () => {},
  updatePage: () => {},
  updateTotalPages: () => {},
  updateError: () => {},
  updateSelectedMovieId: () => {},
  updateMovieData: () => {},
  updateSelectedPersonId: () => {},
  updatePersonData: () => {}
});

export function useSearchContext() {
  return useContext(SearchContext);
}

interface SearchProviderProps {
  children: React.ReactNode;
}

export function SearchContextProvider({ children }: SearchProviderProps) {
  const [searchCategory, setSearchCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchType, setSearchType] = useState<SearchType>('movie');
  const [isAdvancedOpen, setIsAdvancedOpen] = useState<boolean>(() => {
    return localStorage.getItem('movie-search-advanced-open') === 'true';
  });
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilterOptions>({
    genre: '',
    year: '',
    minRating: 0,
    sortBy: 'popularity.desc',
  });
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number>(0);
  const [movieData, setMovieData] = useState<MovieDetailsModel | null>(null);
  const [selectedPersonId, setSelectedPersonId] = useState<number>(0);
  const [personData, setPersonData] = useState<PersonDetailsModel | null>(null);
  const [detailHistory, setDetailHistory] = useState<DetailHistoryItem[]>([]);

  const handleUpdateIsAdvancedOpen = (open: boolean) => {
    setIsAdvancedOpen(open);
    try {
      localStorage.setItem('movie-search-advanced-open', String(open));
    } catch (e) {
      console.warn('Could not save advanced search state to localStorage', e);
    }
  };

  const appendSearchResults = (results: SearchResult[] = []) => {
    setSearchResults(prev => {
      const existingIds = new Set(prev.map(r => r.id));
      const newResults = (results || []).filter(r => !existingIds.has(r.id));
      return [...prev, ...newResults];
    });
  };

  const closeAllDetails = () => {
    setDetailHistory([]);
    setSelectedMovieId(0);
    setMovieData(null);
    setSelectedPersonId(0);
    setPersonData(null);
  };

  const openMovieDetailDirect = async (movieId: number, title?: string) => {
    setSelectedPersonId(0);
    setPersonData(null);
    setSelectedMovieId(movieId);
    setDetailHistory([{ type: 'movie', id: movieId, title: title || '' }]);
    try {
      const data = await getMovieById(movieId);
      setMovieData(data);
      if (data?.title) {
        setDetailHistory([{ type: 'movie', id: movieId, title: data.title }]);
      }
    } catch (err) {
      console.error('Error in openMovieDetailDirect:', err);
    }
  };

  const openPersonDetailDirect = (personId: number, name?: string) => {
    setSelectedMovieId(0);
    setMovieData(null);
    setSelectedPersonId(personId);
    setDetailHistory([{ type: 'person', id: personId, title: name || '' }]);
  };

  const navigateToMovie = async (movieId: number, title?: string) => {
    setSelectedPersonId(0);
    setPersonData(null);
    setSelectedMovieId(movieId);
    setDetailHistory(prev => [...prev, { type: 'movie', id: movieId, title: title || '' }]);
    try {
      const data = await getMovieById(movieId);
      setMovieData(data);
      if (data?.title) {
        setDetailHistory(prev => {
          if (prev.length === 0) return prev;
          const updated = [...prev];
          const lastIdx = updated.length - 1;
          if (updated[lastIdx].type === 'movie' && updated[lastIdx].id === movieId) {
            updated[lastIdx] = { ...updated[lastIdx], title: data.title };
          }
          return updated;
        });
      }
    } catch (err) {
      console.error('Error in navigateToMovie:', err);
    }
  };

  const navigateToPerson = (personId: number, name?: string) => {
    setSelectedMovieId(0);
    setMovieData(null);
    setSelectedPersonId(personId);
    setDetailHistory(prev => [...prev, { type: 'person', id: personId, title: name || '' }]);
  };

  const goBackDetail = async () => {
    if (detailHistory.length <= 1) return;
    const newHistory = detailHistory.slice(0, -1);
    const target = newHistory[newHistory.length - 1];
    setDetailHistory(newHistory);

    if (target.type === 'movie') {
      setSelectedPersonId(0);
      setPersonData(null);
      setSelectedMovieId(target.id);
      try {
        const data = await getMovieById(target.id);
        setMovieData(data);
      } catch (err) {
        console.error('Error navigating back to movie:', err);
      }
    } else {
      setSelectedMovieId(0);
      setMovieData(null);
      setSelectedPersonId(target.id);
    }
  };

  const handleUpdateMovieData = (data: MovieDetailsModel | null) => {
    setMovieData(data);
    if (data?.title) {
      setDetailHistory(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx].type === 'movie' && updated[lastIdx].id === data.id && !updated[lastIdx].title) {
          updated[lastIdx] = { ...updated[lastIdx], title: data.title };
        }
        return updated;
      });
    }
  };

  const handleUpdatePersonData = (data: PersonDetailsModel | null) => {
    setPersonData(data);
    if (data?.name) {
      setDetailHistory(prev => {
        if (prev.length === 0) return prev;
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (updated[lastIdx].type === 'person' && updated[lastIdx].id === data.id && !updated[lastIdx].title) {
          updated[lastIdx] = { ...updated[lastIdx], title: data.name };
        }
        return updated;
      });
    }
  };

  const contextValue: SearchContextData = {
    searchCategory,
    searchTerm,
    searchType,
    isAdvancedOpen,
    advancedFilters,
    searchResults,
    isLoading,
    isFetchingMore,
    page,
    totalPages,
    error,
    selectedMovieId,
    movieData,
    selectedPersonId,
    personData,
    detailHistory,
    openMovieDetailDirect,
    openPersonDetailDirect,
    navigateToMovie,
    navigateToPerson,
    goBackDetail,
    closeAllDetails,
    updateSearchCategory: setSearchCategory,
    updateSearchTerm: setSearchTerm,
    updateSearchType: setSearchType,
    updateIsAdvancedOpen: handleUpdateIsAdvancedOpen,
    updateAdvancedFilters: setAdvancedFilters,
    updateSearchResults: setSearchResults,
    appendSearchResults,
    updateIsLoading: setIsLoading,
    updateIsFetchingMore: setIsFetchingMore,
    updatePage: setPage,
    updateTotalPages: setTotalPages,
    updateError: setError,
    updateSelectedMovieId: setSelectedMovieId,
    updateMovieData: handleUpdateMovieData,
    updateSelectedPersonId: setSelectedPersonId,
    updatePersonData: handleUpdatePersonData,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}
