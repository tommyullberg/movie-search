import React, { useEffect, useState } from 'react';
import {
  Search,
  Loader2,
  TrendingUp,
  Flame,
  Star,
  Calendar,
  Bookmark,
  Eye,
  Clapperboard,
  SlidersHorizontal,
  ChevronDown,
  Dices,
  Sparkles,
} from 'lucide-react';
import { useSearchContext } from '../../contexts/SearchContext';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { fetchSearchResults, SearchType } from '../../utils/apiUtils';
import { SearchResult } from '../../types';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SurprisePickerModal } from '../surprise';
import { CategoryPill } from '../buttons/CategoryPill';
import { AdvancedFiltersPanel } from './AdvancedFiltersPanel';

const CATEGORIES = [
  { key: 'nowplaying', label: 'In Theaters', icon: Clapperboard },
  { key: 'trending', label: 'Trending', icon: TrendingUp },
  { key: 'popular', label: 'Popular', icon: Flame },
  { key: 'toprated', label: 'Top Rated', icon: Star },
  { key: 'upcoming', label: 'Upcoming', icon: Calendar },
] as const;

export function SearchForm() {
  const {
    searchCategory,
    searchTerm,
    searchType,
    isAdvancedOpen,
    advancedFilters,
    isLoading,
    searchResults,
    highlightedMovieId,
    updateHighlightedMovieId,
    openMovieDetailDirect,
    updateSearchCategory,
    updateSearchTerm,
    updateSearchType,
    updateIsAdvancedOpen,
    updateAdvancedFilters,
    updateSearchResults,
    updateIsLoading,
    updateError,
    updatePage,
    updateTotalPages,
  } = useSearchContext();

  const { watchlist, watchedList, getSortedList, librarySort } = useWatchlist();

  const [isSurpriseModalOpen, setIsSurpriseModalOpen] = useState(false);

  // Keep watchlist or watched results live and sorted if user is viewing that category
  useEffect(() => {
    if (searchCategory === 'watchlist') {
      updateSearchResults(getSortedList('watchlist'));
    } else if (searchCategory === 'watched') {
      updateSearchResults(getSortedList('watched'));
    }
  }, [watchlist, watchedList, searchCategory, librarySort]);

  const handleSelectWinner = (movie: SearchResult, pool: SearchResult[]) => {
    const uniquePool = Array.from(new Map(pool.map((m) => [m.id, m])).values());
    if (searchResults.length === 0 || !searchResults.some((m) => m.id === movie.id)) {
      updateSearchResults(uniquePool);
    }
    updateHighlightedMovieId(movie.id);

    setTimeout(() => {
      const cardElement = document.getElementById(`movie-card-${movie.id}`);
      if (cardElement) {
        cardElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }, 150);
  };

  const runSearch = async (
    term: string,
    category: string,
    sType: SearchType = searchType
  ) => {
    updateIsLoading(true);
    updateError(null);
    updateSearchResults([]); // Clear old results to show skeleton
    updatePage(1); // Reset page on new search
    const { results, totalPages, error } = await fetchSearchResults(
      term,
      category,
      1,
      sType,
      isAdvancedOpen ? advancedFilters : undefined
    );
    updateSearchResults(results as SearchResult[]);
    updateTotalPages(totalPages || 0);
    if (error) updateError(error);
    updateIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateSearchTerm(e.target.value);
    updateSearchCategory('');
  };

  const scrollToResults = () => {
    // Only scroll if user has scrolled down past the search categories
    const resultsElement = document.getElementById('search-results-section');
    if (resultsElement) {
      const rect = resultsElement.getBoundingClientRect();
      if (rect.top < 0) {
        resultsElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleCategoryClick = async (category: string) => {
    updateSearchCategory(category);
    updateSearchTerm('');
    scrollToResults();
    await runSearch('', category);
  };

  const handleWatchlistClick = () => {
    updateSearchCategory('watchlist');
    updateSearchTerm('');
    updateError(null);
    updateSearchResults(getSortedList('watchlist'));
    updateTotalPages(1);
    updatePage(1);
    scrollToResults();
  };

  const handleWatchedClick = () => {
    updateSearchCategory('watched');
    updateSearchTerm('');
    updateError(null);
    updateSearchResults(getSortedList('watched'));
    updateTotalPages(1);
    updatePage(1);
    scrollToResults();
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim() && !isAdvancedOpen) return;
    scrollToResults();
    await runSearch(searchTerm, searchCategory);
  };

  const handleResetFilters = () => {
    const emptyFilters = { genre: '', year: '', minRating: 0, sortBy: 'popularity.desc', watchProvider: '' };
    updateAdvancedFilters(emptyFilters);
    if (!searchTerm.trim() && !searchCategory) {
      runSearch('', '', searchType);
    }
  };

  return (
    <section aria-labelledby="search-section-title" className="mb-8 pt-4">
      <div className="mx-auto max-w-3xl text-center">
        <h1
          id="search-section-title"
          className="mb-2 font-extrabold tracking-tight text-foreground"
        >
          Find your next favorite movie
        </h1>
        <p className="mb-6 text-sm text-muted-foreground sm:text-base font-medium">
          Search millions of titles, explore trending releases, and check out top-rated movies.
        </p>

        <form onSubmit={handleSearch} role="search" aria-label="Movie search" className="mb-6">
          <div className="relative flex items-center shadow-md rounded-xl bg-card border border-border focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
            {/* Integrated Search Type Dropdown */}
            <div className="relative shrink-0 flex items-center">
              <label htmlFor="search-type-select" className="sr-only">
                Select search type
              </label>
              <select
                id="search-type-select"
                aria-label="Search type"
                value={searchType}
                onChange={(e) => updateSearchType(e.target.value as SearchType)}
                className="h-14 pl-3.5 pr-7 bg-transparent text-xs sm:text-sm font-bold text-foreground focus:outline-none appearance-none rounded-l-xl border-r border-border hover:bg-muted/50 transition-colors"
              >
                <option value="movie" className="bg-popover text-popover-foreground">
                  Movies
                </option>
                <option value="person" className="bg-popover text-popover-foreground">
                  Cast & Crew
                </option>
                <option value="keyword" className="bg-popover text-popover-foreground">
                  Keywords
                </option>
              </select>
              <ChevronDown className="absolute right-2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" aria-hidden="true" />
            </div>

            {/* Magnifying glass icon */}
            <Search className="ml-3 h-5 w-5 text-muted-foreground pointer-events-none shrink-0 hidden sm:block" aria-hidden="true" />

            {/* Main Input field */}
            <Input
              id="movie-search-input"
              type="search"
              placeholder={
                searchType === 'person'
                  ? 'Search actors or directors (e.g. Nolan, DiCaprio)...'
                  : searchType === 'keyword'
                  ? 'Search by theme (e.g. space, zombie, superhero)...'
                  : 'Search by title, director, or keyword...'
              }
              value={searchTerm}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-14 border-0 bg-transparent backdrop-blur-none text-sm sm:text-base focus-visible:ring-0 shadow-none px-3 text-foreground placeholder:text-muted-foreground flex-1 min-w-0"
            />

            {/* Advanced Filters Toggle Button */}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => updateIsAdvancedOpen(!isAdvancedOpen)}
              aria-expanded={isAdvancedOpen}
              aria-controls="advanced-search-panel"
              aria-label={isAdvancedOpen ? 'Close advanced filters' : 'Open advanced filters'}
              className={`relative z-10 h-10 px-2.5 mx-1.5 rounded-lg font-semibold transition-colors shrink-0 focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-card ${
                isAdvancedOpen
                  ? 'bg-primary/15 text-primary hover:bg-primary/25 border border-primary/30'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              }`}
            >
              <SlidersHorizontal className="h-4 w-4 sm:mr-1.5" aria-hidden="true" />
              <span className="hidden sm:inline text-xs font-bold">Filters</span>
            </Button>

            {/* Search Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || (!searchTerm.trim() && !isAdvancedOpen)}
              aria-label={isLoading ? 'Searching...' : 'Submit movie search'}
              className="relative z-10 mr-2 h-10 px-4 sm:px-5 rounded-lg font-bold shrink-0 shadow-sm focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1 focus-visible:ring-offset-card"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                'Search'
              )}
            </Button>
          </div>

          {/* Persistent Expandable Advanced Discover & Filters Panel */}
          <AdvancedFiltersPanel
            isOpen={isAdvancedOpen}
            onApply={() => runSearch(searchTerm, '')}
            onReset={handleResetFilters}
          />
        </form>

        {/* Discovery Categories Row */}
        <div role="group" aria-label="Quick movie categories" className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map(({ key, label, icon: Icon }) => (
            <CategoryPill
              key={key}
              label={label}
              icon={Icon}
              isActive={searchCategory === key}
              disabled={isLoading}
              aria-label={`Show ${label} movies`}
              onClick={() => handleCategoryClick(key)}
            />
          ))}
        </div>

        {/* Dedicated Library Row: Watchlist and Watched */}
        <div role="group" aria-label="Personal movie lists" className="mt-2.5 flex items-center justify-center gap-2.5">
          <CategoryPill
            label="Watchlist"
            icon={Bookmark}
            isActive={searchCategory === 'watchlist'}
            activeVariant="amber"
            count={watchlist.length}
            disabled={isLoading}
            aria-label={`Show Watchlist, ${watchlist.length} saved movies`}
            onClick={handleWatchlistClick}
          />

          <CategoryPill
            label="Watched"
            icon={Eye}
            isActive={searchCategory === 'watched'}
            activeVariant="emerald"
            count={watchedList.length}
            disabled={isLoading}
            aria-label={`Show Watched movies, ${watchedList.length} movies watched`}
            onClick={handleWatchedClick}
          />

          <CategoryPill
            label="Surprise Me"
            icon={Dices}
            isActive={isSurpriseModalOpen}
            disabled={isLoading}
            aria-label="Pick a random movie from top 50 with animated card reel"
            onClick={() => setIsSurpriseModalOpen(true)}
          />
        </div>

        {/* Surprise Picker Slot Machine Reel Modal */}
        <SurprisePickerModal
          isOpen={isSurpriseModalOpen}
          onClose={() => setIsSurpriseModalOpen(false)}
          watchlist={watchlist}
          watchedList={watchedList}
          initialSource={searchCategory || 'trending'}
          onSelectWinner={handleSelectWinner}
          onOpenDetails={(movieId, title) => openMovieDetailDirect(movieId, title)}
        />
      </div>
    </section>
  );
}
