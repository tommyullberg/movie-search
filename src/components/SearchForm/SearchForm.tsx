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
  RotateCcw,
  Tv,
  Dices,
  Sparkles,
} from 'lucide-react';
import { useSearchContext } from '../../contexts/SearchContext';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { fetchSearchResults, TMDB_GENRES, TMDB_STREAMING_PROVIDERS_SE, SearchType } from '../../utils/apiUtils';
import { SearchResult } from '../SearchResults';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { SurprisePickerModal } from '../SurprisePicker/SurprisePickerModal';

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

  const handleCategoryClick = async (category: string) => {
    updateSearchCategory(category);
    updateSearchTerm('');
    await runSearch('', category);
  };

  const handleWatchlistClick = () => {
    updateSearchCategory('watchlist');
    updateSearchTerm('');
    updateError(null);
    updateSearchResults(getSortedList('watchlist'));
    updateTotalPages(1);
    updatePage(1);
  };

  const handleWatchedClick = () => {
    updateSearchCategory('watched');
    updateSearchTerm('');
    updateError(null);
    updateSearchResults(getSortedList('watched'));
    updateTotalPages(1);
    updatePage(1);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim() && !isAdvancedOpen) return;
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
          className="mb-2 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground"
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
                className="h-14 pl-3.5 pr-7 bg-transparent text-xs sm:text-sm font-bold text-foreground cursor-pointer focus:outline-none appearance-none rounded-l-xl border-r border-border hover:bg-muted/50 transition-colors"
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
          <AnimatePresence>
            {isAdvancedOpen && (
              <motion.div
                id="advanced-search-panel"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="mt-3 p-4 rounded-xl border border-border bg-card shadow-lg text-left"
              >
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-border">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="font-bold text-xs sm:text-sm text-foreground">
                      Advanced Discover & Filters
                    </span>
                  </div>
                  {(advancedFilters.genre || advancedFilters.year || (advancedFilters.minRating && advancedFilters.minRating > 0) || advancedFilters.watchProvider || (advancedFilters.sortBy && advancedFilters.sortBy !== 'popularity.desc')) && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium flex items-center gap-1"
                    >
                      <RotateCcw className="h-3 w-3" />
                      Reset filters
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {/* Streaming in Sweden */}
                  <div>
                    <label htmlFor="filter-provider" className="block text-xs font-semibold text-muted-foreground mb-1.5 flex items-center gap-1.5">
                      <Tv className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      <span>Stream in Sweden</span>
                    </label>
                    <select
                      id="filter-provider"
                      value={advancedFilters.watchProvider || ''}
                      onChange={(e) => {
                        const newProvider = e.target.value;
                        updateAdvancedFilters(prev => ({ ...prev, watchProvider: newProvider }));
                        updateSearchCategory('');
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Any / All Providers</option>
                      <option value="any">Any Swedish Stream</option>
                      {TMDB_STREAMING_PROVIDERS_SE.map((p) => (
                        <option key={p.id} value={p.id.toString()}>
                          {p.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Genre */}
                  <div>
                    <label htmlFor="filter-genre" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Genre
                    </label>
                    <select
                      id="filter-genre"
                      value={advancedFilters.genre || ''}
                      onChange={(e) => {
                        const newGenre = e.target.value;
                        updateAdvancedFilters(prev => ({ ...prev, genre: newGenre }));
                        updateSearchCategory('');
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">All Genres</option>
                      {TMDB_GENRES.map((g) => (
                        <option key={g.id} value={g.id.toString()}>
                          {g.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Release Year */}
                  <div>
                    <label htmlFor="filter-year" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Release Year
                    </label>
                    <select
                      id="filter-year"
                      value={advancedFilters.year || ''}
                      onChange={(e) => {
                        const newYear = e.target.value;
                        updateAdvancedFilters(prev => ({ ...prev, year: newYear }));
                        updateSearchCategory('');
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">Any Year</option>
                      {Array.from({ length: 45 }, (_, i) => new Date().getFullYear() + 1 - i).map((yr) => (
                        <option key={yr} value={yr.toString()}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Minimum Rating */}
                  <div>
                    <label htmlFor="filter-rating" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Minimum Rating
                    </label>
                    <select
                      id="filter-rating"
                      value={advancedFilters.minRating || 0}
                      onChange={(e) => {
                        const newRating = Number(e.target.value);
                        updateAdvancedFilters(prev => ({ ...prev, minRating: newRating }));
                        updateSearchCategory('');
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="0">Any Rating</option>
                      <option value="8">8+ (Top Rated)</option>
                      <option value="7">7+ (Good)</option>
                      <option value="6">6+ (Above Average)</option>
                      <option value="5">5+ (Average)</option>
                    </select>
                  </div>

                  {/* Sort By */}
                  <div>
                    <label htmlFor="filter-sort" className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      Sort By
                    </label>
                    <select
                      id="filter-sort"
                      value={advancedFilters.sortBy || 'popularity.desc'}
                      onChange={(e) => {
                        const newSort = e.target.value;
                        updateAdvancedFilters(prev => ({ ...prev, sortBy: newSort }));
                        updateSearchCategory('');
                      }}
                      className="w-full h-9 px-3 rounded-lg border border-border bg-background text-foreground text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="popularity.desc">Most Popular</option>
                      <option value="vote_average.desc">Highest Rated</option>
                      <option value="primary_release_date.desc">Release Date (Newest)</option>
                      <option value="revenue.desc">Top Box Office</option>
                    </select>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-border flex justify-end">
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => runSearch(searchTerm, '')}
                    className="font-bold rounded-lg px-4"
                  >
                    Apply Filters
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        {/* Discovery Categories Row */}
        <div role="group" aria-label="Quick movie categories" className="mt-3 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map(({ key, label, icon: Icon }) => {
            const isActive = searchCategory === key;
            return (
              <Button
                key={key}
                type="button"
                variant={isActive ? 'default' : 'outline'}
                size="sm"
                disabled={isLoading}
                aria-pressed={isActive}
                aria-label={`Show ${label} movies`}
                onClick={() => handleCategoryClick(key)}
                className={`rounded-full transition-all border ${
                  isActive
                    ? 'font-bold ring-2 ring-primary/40 shadow-sm'
                    : 'text-foreground border-border bg-card/60 hover:bg-primary/15 hover:border-primary/50 focus-visible:bg-primary/15 focus-visible:border-primary/50'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 mr-1.5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} aria-hidden="true" />
                <span className="inline-block chrome-text-adjust">{label}</span>
              </Button>
            );
          })}
        </div>

        {/* Dedicated Library Row: Watchlist and Watched */}
        <div role="group" aria-label="Personal movie lists" className="mt-2.5 flex items-center justify-center gap-2.5">
          {/* Watchlist Filter Button */}
          <Button
            type="button"
            variant={searchCategory === 'watchlist' ? 'default' : 'outline'}
            size="sm"
            disabled={isLoading}
            aria-pressed={searchCategory === 'watchlist'}
            aria-label={`Show Watchlist, ${watchlist.length} saved movies`}
            onClick={handleWatchlistClick}
            className={`rounded-full transition-all border ${
              searchCategory === 'watchlist'
                ? 'font-bold ring-2 ring-amber-500/40 bg-amber-500 text-black hover:bg-amber-600 shadow-sm'
                : 'text-foreground border-border bg-card/60 hover:bg-primary/15 hover:border-primary/50 focus-visible:bg-primary/15 focus-visible:border-primary/50'
            }`}
          >
            <Bookmark
              className={`h-3.5 w-3.5 mr-1.5 ${searchCategory === 'watchlist' ? 'fill-current text-black' : 'text-amber-500'}`}
              aria-hidden="true"
            />
            <span className="inline-block chrome-text-adjust">Watchlist</span>
            {watchlist.length > 0 && (
              <span
                className={`ml-1.5 inline-block chrome-text-adjust rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  searchCategory === 'watchlist' ? 'bg-black/20 text-black' : 'bg-secondary text-foreground'
                }`}
              >
                {watchlist.length}
              </span>
            )}
          </Button>

          {/* Watched Filter Button */}
          <Button
            type="button"
            variant={searchCategory === 'watched' ? 'default' : 'outline'}
            size="sm"
            disabled={isLoading}
            aria-pressed={searchCategory === 'watched'}
            aria-label={`Show Watched movies, ${watchedList.length} movies watched`}
            onClick={handleWatchedClick}
            className={`rounded-full transition-all border ${
              searchCategory === 'watched'
                ? 'font-bold ring-2 ring-emerald-500/40 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm'
                : 'text-foreground border-border bg-card/60 hover:bg-primary/15 hover:border-primary/50 focus-visible:bg-primary/15 focus-visible:border-primary/50'
            }`}
          >
            <Eye
              className={`h-3.5 w-3.5 mr-1.5 ${searchCategory === 'watched' ? 'text-white' : 'text-emerald-500'}`}
              aria-hidden="true"
            />
            <span className="inline-block chrome-text-adjust">Watched</span>
            {watchedList.length > 0 && (
              <span
                className={`ml-1.5 inline-block chrome-text-adjust rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  searchCategory === 'watched' ? 'bg-white/20 text-white' : 'bg-secondary text-foreground'
                }`}
              >
                {watchedList.length}
              </span>
            )}
          </Button>

          {/* Random Movie Picker Toggle Button */}
          <Button
            type="button"
            variant={isSurpriseModalOpen ? 'default' : 'outline'}
            size="sm"
            disabled={isLoading}
            aria-label="Pick a random movie from top 50 with animated card reel"
            onClick={() => setIsSurpriseModalOpen(true)}
            className={`rounded-full transition-all border ${
              isSurpriseModalOpen
                ? 'font-bold ring-2 ring-primary/40 bg-primary text-primary-foreground shadow-sm'
                : 'text-foreground border-border bg-card/60 hover:bg-primary/15 hover:border-primary/50 focus-visible:bg-primary/15 focus-visible:border-primary/50'
            }`}
          >
            <Dices
              className={`h-3.5 w-3.5 mr-1.5 ${isSurpriseModalOpen ? 'text-primary-foreground' : 'text-primary'}`}
              aria-hidden="true"
            />
            <span className="inline-block chrome-text-adjust">Surprise Me</span>
          </Button>
        </div>

        {/* Surprise Picker Slot Machine Reel Modal */}
        <SurprisePickerModal
          isOpen={isSurpriseModalOpen}
          onClose={() => setIsSurpriseModalOpen(false)}
          watchlist={watchlist}
          initialSource={searchCategory || 'trending'}
          onSelectWinner={handleSelectWinner}
          onOpenDetails={(movieId, title) => openMovieDetailDirect(movieId, title)}
        />
      </div>
    </section>
  );
}
