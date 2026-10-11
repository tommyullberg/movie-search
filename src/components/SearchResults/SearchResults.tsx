import React, { FormEvent, KeyboardEvent } from 'react';
import { getMovieById, fetchSearchResults } from '../../utils/apiUtils';
import { formatDate } from '../../utils/helpers';
import { useSearchContext } from '../../contexts/SearchContext';
import { GaugeSVG } from '../GaugeSVG';
import { imageConfig } from '../../config/imageConfig';
import { motion } from 'framer-motion';
import { Film, AlertCircle, Loader2, Bookmark, User } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { useWatchlist } from '../../contexts/WatchlistContext';

export interface SearchResult {
  adult?: boolean;
  backdrop_path?: string;
  genre_ids?: number[];
  id: number;
  original_language?: string;
  original_title?: string;
  overview?: string;
  popularity: number;
  poster_path?: string;
  release_date?: string;
  title?: string;
  name?: string;
  profile_path?: string | null;
  known_for_department?: string;
  media_type?: string;
  known_for?: Array<{
    id: number;
    title?: string;
    name?: string;
    release_date?: string;
    poster_path?: string | null;
  }>;
  video?: boolean;
  vote_average?: number;
  vote_count?: number;
}

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
    selectedMovieId,
    updateSelectedMovieId,
    updateMovieData,
    searchType,
    advancedFilters,
    selectedPersonId,
    openMovieDetailDirect,
    openPersonDetailDirect,
    closeAllDetails,
  } = useSearchContext();

  const { isInWatchlist, toggleWatchlist } = useWatchlist();

  const { URL_IMAGE_POSTER_w342, URL_IMAGE_POSTER_w500, URL_IMAGE_PROFILE_h632 } = imageConfig;

  const openModal = (movieId: number, title?: string, event?: FormEvent<Element> | KeyboardEvent<Element>) => {
    if (event) event.preventDefault();
    openMovieDetailDirect(movieId, title);
  };

  const handleKeyDown = (movieId: number, title?: string, e?: KeyboardEvent<HTMLDivElement>) => {
    if (e && (e.key === 'Enter' || e.key === ' ')) {
      openModal(movieId, title, e);
    }
  };

  const openPersonModal = (personId: number, name?: string, event?: FormEvent<Element> | KeyboardEvent<Element>) => {
    if (event) event.preventDefault();
    openPersonDetailDirect(personId, name);
  };

  const handlePersonKeyDown = (personId: number, name?: string, e?: KeyboardEvent<HTMLDivElement>) => {
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
    <section aria-label="Search results" className="pb-16">
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
              <Card
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`View profile for ${result.name}`}
                onClick={(e) => openPersonModal(result.id, result.name, e)}
                onKeyDown={(e) => handlePersonKeyDown(result.id, result.name, e)}
                className="cursor-pointer overflow-hidden border border-border bg-card text-card-foreground hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full focus-visible:ring-4 focus-visible:ring-ring"
              >
                {/* Profile Image Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                  {result.profile_path ? (
                    <img
                      src={`${URL_IMAGE_PROFILE_h632}${result.profile_path}`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground" aria-hidden="true">
                      <User className="h-12 w-12 opacity-40" />
                    </div>
                  )}

                  {result.known_for_department && (
                    <div className="absolute top-2 left-2 z-10">
                      <Badge variant="secondary" className="text-[10px] font-bold shadow-md bg-background/85 backdrop-blur-xs border border-border">
                        {result.known_for_department}
                      </Badge>
                    </div>
                  )}
                </div>

                {/* Person Card Body */}
                <CardContent className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="line-clamp-2 text-sm sm:text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {result.name}
                    </h2>
                  </div>
                  {result.known_for && result.known_for.length > 0 && (
                    <p className="mt-2 line-clamp-2 text-xs text-muted-foreground font-medium">
                      <span className="font-semibold text-foreground/80">Known for: </span>
                      {result.known_for.map((k) => k.title || k.name).filter(Boolean).slice(0, 3).join(', ')}
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              /* Movie Card */
              <Card
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`View details for ${result.title}, released ${formatDate(result.release_date || '') || 'unknown date'}`}
                onClick={(e) => openModal(result.id, result.title, e)}
                onKeyDown={(e) => handleKeyDown(result.id, result.title, e)}
                className="cursor-pointer overflow-hidden border border-border bg-card text-card-foreground hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full focus-visible:ring-4 focus-visible:ring-ring"
              >
                {/* Poster Image Container */}
                <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                  {result.poster_path ? (
                    <img
                      src={`${URL_IMAGE_POSTER_w342}${result.poster_path}`}
                      srcSet={`${URL_IMAGE_POSTER_w342}${result.poster_path} 1x, ${URL_IMAGE_POSTER_w500}${result.poster_path} 2x`}
                      alt=""
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground" aria-hidden="true">
                      <Film className="h-10 w-10 opacity-50" />
                    </div>
                  )}

                  {/* Watchlist Bookmark toggle positioned top-left */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      toggleWatchlist(result as any);
                    }}
                    aria-label={isInWatchlist(result.id) ? `Remove ${result.title} from watchlist` : `Add ${result.title} to watchlist`}
                    className={`absolute top-2 left-2 z-10 p-2 rounded-full transition-all duration-200 backdrop-blur-md shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                      isInWatchlist(result.id)
                        ? 'bg-amber-500 text-amber-950 hover:bg-amber-400 dark:text-amber-950'
                        : 'bg-background/80 text-foreground hover:bg-background hover:text-amber-500'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isInWatchlist(result.id) ? 'fill-current' : ''}`} />
                  </button>

                  {/* Rating Gauge positioned top-right */}
                  <div className="absolute top-2 right-2 w-11 h-11 drop-shadow-md">
                    <GaugeSVG id={result.id} vote_average={result.vote_average || 0} />
                  </div>
                </div>

                {/* Card Body */}
                <CardContent className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="line-clamp-2 text-sm sm:text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {result.title}
                    </h2>
                  </div>
                  <p className="mt-2 text-xs sm:text-sm font-semibold text-muted-foreground">
                    {formatDate(result.release_date || '') || 'Unknown date'}
                  </p>
                </CardContent>
              </Card>
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
      {!isLoading && searchResults.length === 0 && (searchTerm || searchCategory || advancedFilters.genre || advancedFilters.year) && (
        <div role="status" className="my-16 flex flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground" aria-hidden="true">
            {searchCategory === 'watchlist' ? (
              <Bookmark className="h-8 w-8 text-amber-500" />
            ) : searchType === 'person' ? (
              <User className="h-8 w-8" />
            ) : (
              <Film className="h-8 w-8" />
            )}
          </div>
          <h2 className="text-xl font-bold text-foreground">
            {searchCategory === 'watchlist'
              ? 'Your watchlist is empty'
              : searchType === 'person'
              ? 'No actors or directors found'
              : 'No movies found'}
          </h2>
          <p className="mt-1 text-sm font-medium text-muted-foreground max-w-sm">
            {searchCategory === 'watchlist'
              ? 'Click the bookmark icon on any movie card or in movie details to save it to your personal watchlist.'
              : searchType === 'person'
              ? 'Try searching with another actor or director name.'
              : 'Try adjusting your search query or pick a different category.'}
          </p>
        </div>
      )}

      {/* Load More Button */}
      {page < totalPages && searchResults.length > 0 && !isLoading && (
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
