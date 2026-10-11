import React, { FormEvent, KeyboardEvent } from 'react';
import { fetchSearchResults } from '../utils/apiUtils';
import { useSearchContext } from '../contexts/SearchContext';
import { motion } from 'framer-motion';
import { Film, AlertCircle, Loader2, Bookmark, User, Eye } from 'lucide-react';
import { Skeleton } from './ui/skeleton';
import { Button } from './ui/button';
import { useWatchlist } from '../contexts/WatchlistContext';
import { SearchResult } from '../types';
import { MovieCard } from './MovieCard';
import { PersonCard } from './PersonCard';
import { LibraryToolbar } from './LibraryToolbar';

export type { SearchResult };

export function SearchResults() {
  const {
    searchResults,
    isLoading,
    isFetchingMore,
    page,
    totalPages,
    searchTerm,
    searchCategory,
    appendSearchResults,
    updatePage,
    updateIsFetchingMore,
    error,
    searchType,
    advancedFilters,
    openMovieDetailDirect,
    openPersonDetailDirect,
    highlightedMovieId,
  } = useSearchContext();

  const { getReview } = useWatchlist();

  const openModal = (movieId: number, title?: string, event?: FormEvent<Element> | KeyboardEvent<Element>) => {
    if (event) event.preventDefault();
    openMovieDetailDirect(movieId, title);
  };

  const handleKeyDown = (movieId: number, title?: string, e?: KeyboardEvent<Element>) => {
    if (e && (e.key === 'Enter' || e.key === ' ')) {
      openModal(movieId, title, e);
    }
  };

  const openPersonModal = (personId: number, name?: string, event?: FormEvent<Element> | KeyboardEvent<Element>) => {
    if (event) event.preventDefault();
    openPersonDetailDirect(personId, name);
  };

  const handlePersonKeyDown = (personId: number, name?: string, e?: KeyboardEvent<Element>) => {
    if (e && (e.key === 'Enter' || e.key === ' ')) {
      openPersonModal(personId, name, e);
    }
  };

  const handleLoadMore = async () => {
    if (page < totalPages) {
      updateIsFetchingMore(true);
      const nextPage = page + 1;
      updatePage(nextPage);
      const { results } = await fetchSearchResults(searchTerm, searchCategory, nextPage, searchType, advancedFilters);
      appendSearchResults(results as SearchResult[]);
      updateIsFetchingMore(false);
    }
  };

  if (error) {
    return (
      <section role="alert" className="my-6">
        <div className="flex items-center gap-3 rounded-xl border border-destructive bg-destructive/10 p-4 text-destructive">
          <AlertCircle className="h-5 w-5 shrink-0" aria-hidden="true" />
          <p className="text-sm font-semibold">Could not load movies: {error}</p>
        </div>
      </section>
    );
  }

  return (
    <section aria-label="Search results" className="mt-4 pb-16">
      {/* Library Toolbar for Watchlist & Watched lists */}
      {(searchCategory === 'watchlist' || searchCategory === 'watched') && (
        <LibraryToolbar />
      )}

      {/* Cards Grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6"
        role="region"
        aria-live="polite"
        aria-label="List of search results"
      >
        {searchResults.map((result) => (
          <motion.div
            key={`${result.id}-${result.media_type || 'movie'}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="group"
          >
            {result.media_type === 'person' || (result.name && !result.title) ? (
              /* Person Card */
              <PersonCard
                person={result}
                onClick={(e) => openPersonModal(result.id, result.name, e)}
                onKeyDown={(e) => handlePersonKeyDown(result.id, result.name, e)}
              />
            ) : (
              /* Movie Card */
              <MovieCard
                movie={result}
                isHighlighted={highlightedMovieId === result.id}
                searchCategory={searchCategory}
                review={getReview(result.id)}
                onClick={(e) => openModal(result.id, result.title, e)}
                onKeyDown={(e) => handleKeyDown(result.id, result.title, e)}
              />
            )}
          </motion.div>
        ))}

        {/* Skeleton Loaders */}
        {isLoading &&
          Array.from({ length: 10 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="flex flex-col space-y-3" aria-hidden="true">
              <Skeleton className="aspect-[2/3] w-full rounded-xl" />
              <div className="space-y-2 p-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          ))}
      </div>

      {/* Empty State */}
      {!isLoading && searchResults.length === 0 && Boolean(searchTerm || searchCategory || advancedFilters.genre || advancedFilters.year || advancedFilters.watchProvider || (advancedFilters.minRating && advancedFilters.minRating > 0)) && (
        <div role="status" className="my-16 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground" aria-hidden="true">
            {searchCategory === 'watchlist' ? (
              <Bookmark className="h-8 w-8 text-amber-500" />
            ) : searchCategory === 'watched' ? (
              <Eye className="h-8 w-8 text-emerald-500" />
            ) : searchType === 'person' ? (
              <User className="h-8 w-8" />
            ) : (
              <Film className="h-8 w-8" />
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {searchCategory === 'watchlist'
              ? 'Your watchlist is empty'
              : searchCategory === 'watched'
              ? 'No watched movies yet'
              : searchType === 'person'
              ? 'No actors or directors found'
              : 'No movies found'}
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground max-w-sm">
            {searchCategory === 'watchlist'
              ? 'Click the bookmark icon on any movie card or in movie details to save it to your personal watchlist.'
              : searchCategory === 'watched'
              ? 'Click the eye icon on any movie card or in movie details to keep track of movies you have watched.'
              : searchType === 'person'
              ? 'Try searching with another actor or director name.'
              : 'Try adjusting your search query, filters, or streaming provider.'}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {Boolean(page < totalPages && searchResults.length > 0 && !isLoading) && (
        <div className="mt-12 flex justify-center">
          <Button
            size="lg"
            onClick={handleLoadMore}
            disabled={isFetchingMore}
            aria-busy={isFetchingMore}
            aria-label="Load more movies from the database"
            className="rounded-full px-8 font-bold shadow-md"
          >
            {isFetchingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Loading movies...
              </>
            ) : (
              'Load More Movies'
            )}
          </Button>
        </div>
      )}
    </section>
  );
}
