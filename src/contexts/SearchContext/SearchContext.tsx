import React, { createContext, useContext, useState } from 'react';
import { SearchResult } from '../../components/SearchResults';
import { MovieDetailsModel } from '../../model/MovieDetailsModel';

interface SearchContextData {
  searchCategory: string;
  searchTerm: string;
  searchResults: SearchResult[];
  isLoading: boolean;
  error: string | null;
  selectedMovieId: number;
  movieData: MovieDetailsModel | null;
  updateSearchCategory: (category: string) => void;
  updateSearchTerm: (term: string) => void;
  updateSearchResults: (results: SearchResult[]) => void;
  updateIsLoading: (loading: boolean) => void;
  updateError: (error: string | null) => void;
  updateSelectedMovieId: (id: number) => void;
  updateMovieData: (data: MovieDetailsModel | null) => void;
}

const SearchContext = createContext<SearchContextData>({
  searchCategory: '',
  searchTerm: '',
  searchResults: [],
  isLoading: false,
  error: null,
  selectedMovieId: 0,
  movieData: null,
  updateSearchCategory: () => {},
  updateSearchTerm: () => {},
  updateSearchResults: () => {},
  updateIsLoading: () => {},
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
  const [error, setError] = useState<string | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number>(0);
  const [movieData, setMovieData] = useState<MovieDetailsModel | null>(null);

  const contextValue: SearchContextData = {
    searchCategory,
    searchTerm,
    searchResults,
    isLoading,
    error,
    selectedMovieId,
    movieData,
    updateSearchCategory: setSearchCategory,
    updateSearchTerm: setSearchTerm,
    updateSearchResults: setSearchResults,
    updateIsLoading: setIsLoading,
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
