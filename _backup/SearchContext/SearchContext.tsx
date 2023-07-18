import React, { createContext, useContext, useState } from 'react';
import { SearchResult } from '../../components/SearchResults';

interface SearchContextData {
  searchCategory: string;
  searchTerm: string;
  searchResults: SearchResult[];
  updateSearchCategory: (category: string) => void;
  updateSearchTerm: (term: string) => void;
  updateSearchResults: (results: SearchResult[]) => void;
}

const SearchContext = createContext<SearchContextData>({
  searchCategory: '',
  searchTerm: '',
  searchResults: [],
  updateSearchCategory: () => {},
  updateSearchTerm: () => {},
  updateSearchResults: () => {}
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

  const updateSearchCategory = (category: string) => {
    setSearchCategory(category);
  };

  const updateSearchTerm = (term: string) => {
    setSearchTerm(term);
  };

  const updateSearchResults = (results: SearchResult[]) => {
    setSearchResults(results);
  };

  const contextValue: SearchContextData = {
    searchCategory,
    searchTerm,
    searchResults,
    updateSearchCategory,
    updateSearchTerm,
    updateSearchResults
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
}
