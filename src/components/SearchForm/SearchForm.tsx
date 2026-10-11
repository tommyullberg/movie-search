import React, { useEffect } from 'react';
import { Search, Loader2, TrendingUp, Flame, Star, Calendar, Bookmark } from 'lucide-react';
import { useSearchContext } from '../../contexts/SearchContext';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { fetchSearchResults } from '../../utils/apiUtils';
import { SearchResult } from '../SearchResults';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

const CATEGORIES = [
  { key: 'trending', label: 'Trending', icon: TrendingUp },
  { key: 'popular', label: 'Popular', icon: Flame },
  { key: 'toprated', label: 'Top Rated', icon: Star },
  { key: 'upcoming', label: 'Upcoming', icon: Calendar },
] as const;

export function SearchForm() {
  const {
    searchCategory,
    searchTerm,
    isLoading,
    updateSearchCategory,
    updateSearchTerm,
    updateSearchResults,
    updateIsLoading,
    updateError,
    updatePage,
    updateTotalPages,
  } = useSearchContext();

  const { watchlist } = useWatchlist();

  // Keep watchlist results live if user is currently viewing the watchlist category
  useEffect(() => {
    if (searchCategory === 'watchlist') {
      updateSearchResults(watchlist);
    }
  }, [watchlist, searchCategory]);

  const runSearch = async (term: string, category: string) => {
    updateIsLoading(true);
    updateError(null);
    updateSearchResults([]); // Clear old results to show skeleton
    updatePage(1); // Reset page on new search
    const { results, totalPages, error } = await fetchSearchResults(term, category, 1);
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
    updateSearchResults(watchlist);
    updateTotalPages(1);
    updatePage(1);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!searchTerm.trim()) return;
    await runSearch(searchTerm, searchCategory);
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
          <div className="relative flex items-center shadow-md rounded-xl">
            <label htmlFor="movie-search-input" className="sr-only">
              Search for a movie by title or keyword
            </label>
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground pointer-events-none" aria-hidden="true" />
            <Input
              id="movie-search-input"
              type="search"
              placeholder="Search by title, director, or keyword..."
              value={searchTerm}
              onChange={handleInputChange}
              disabled={isLoading}
              className="h-14 pl-12 pr-28 text-base rounded-xl border-border bg-card text-foreground placeholder:text-muted-foreground focus-visible:ring-primary shadow-sm"
            />
            <Button
              type="submit"
              disabled={isLoading || !searchTerm.trim()}
              aria-label={isLoading ? 'Searching...' : 'Submit movie search'}
              className="absolute right-2 h-10 px-5 rounded-lg font-bold"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              ) : (
                'Search'
              )}
            </Button>
          </div>
        </form>

        <div role="group" aria-label="Quick movie categories" className="flex flex-wrap items-center justify-center gap-2">
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
                    : 'text-foreground border-border bg-card/60 hover:bg-card hover:border-foreground/40'
                }`}
              >
                <Icon className={`h-3.5 w-3.5 mr-1.5 ${isActive ? 'text-primary-foreground' : 'text-primary'}`} aria-hidden="true" />
                <span className="inline-block chrome-text-adjust">{label}</span>
              </Button>
            );
          })}

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
                ? 'font-bold ring-2 ring-primary/40 shadow-sm'
                : 'text-foreground border-border bg-card/60 hover:bg-card hover:border-foreground/40'
            }`}
          >
            <Bookmark
              className={`h-3.5 w-3.5 mr-1.5 ${searchCategory === 'watchlist' ? 'fill-current text-primary-foreground' : 'text-amber-500'}`}
              aria-hidden="true"
            />
            <span className="inline-block chrome-text-adjust">Watchlist</span>
            {watchlist.length > 0 && (
              <span
                className={`ml-1.5 inline-block chrome-text-adjust rounded-full px-1.5 py-0.2 text-[10px] font-bold ${
                  searchCategory === 'watchlist' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-foreground'
                }`}
              >
                {watchlist.length}
              </span>
            )}
          </Button>
        </div>
      </div>
    </section>
  );
}
