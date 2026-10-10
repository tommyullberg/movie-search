import React, { createContext, useContext, useState } from 'react';
import { SearchResult } from '../../components/SearchResults';
import { MovieDetailsModel } from '../../model/MovieDetailsModel';

interface SearchContextData {
  searchCategory: string;
  searchTerm: string;
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
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number>(0);
  const [movieData, setMovieData] = useState<MovieDetailsModel | null>(null);

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
