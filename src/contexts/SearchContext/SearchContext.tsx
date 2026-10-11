import React, { createContext, useContext, useState, useEffect } from 'react';
import { SearchResult } from '../../components/SearchResults';
import { MovieDetailsModel } from '../../model/MovieDetailsModel';
import { SearchType, AdvancedFilterOptions } from '../../utils/apiUtils';

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
  updateMovieData: () => {}
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
    updateMovieData: setMovieData
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}
