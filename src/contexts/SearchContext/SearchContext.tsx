import React, { createContext, useContext, useState } from 'react';
import { SearchResult } from '../../components/SearchResults';
import { MovieDetailsModel } from '../../model/MovieDetailsModel';

interface SearchContextData {
  searchCategory: string;
  searchTerm: string;
  searchResults: SearchResult[];
  selectedMovieId: number | 0;
  movieData: MovieDetailsModel | null;
  updateSearchCategory: (category: string) => void;
  updateSearchTerm: (term: string) => void;
  updateSearchResults: (results: SearchResult[]) => void;
  updateSelectedMovieId: (id: number | 0) => void;
  updateMovieData: (data: MovieDetailsModel | null) => void;
}

const SearchContext = createContext<SearchContextData>({
  searchCategory: '',
  searchTerm: '',
  searchResults: [],
  selectedMovieId: 0,
  movieData: null,
  updateSearchCategory: () => {},
  updateSearchTerm: () => {},
  updateSearchResults: () => {},
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
  const [selectedMovieId, setSelectedMovieId] = useState<number>(0);
  const [movieData, setMovieData] = useState<MovieDetailsModel | null>(null);

  const updateSearchCategory = (category: string) => {
    setSearchCategory(category);
  };

  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  const updateSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const updateSelectedMovieId = (id: number | 0) => {
    setSelectedMovieId(id);
  };

  const updateMovieData = (data: MovieDetailsModel | null) => {
    setMovieData(data);
  };

  const contextValue: SearchContextData = {
    searchCategory,
    searchTerm,
    searchResults,
    selectedMovieId,
    movieData,
    updateSearchCategory,
    updateSearchTerm,
    updateSearchResults,
    updateSelectedMovieId,
    updateMovieData
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}
