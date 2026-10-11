import React, { FormEvent, KeyboardEvent, useState, useRef } from 'react';
import { getMovieById, fetchSearchResults } from '../../utils/apiUtils';
import { formatDate } from '../../utils/helpers';
import { useSearchContext } from '../../contexts/SearchContext';
import { GaugeSVG } from '../GaugeSVG';
import { imageConfig } from '../../config/imageConfig';
import { motion } from 'framer-motion';
import { Film, AlertCircle, Loader2, Bookmark, User, Eye, CheckCircle2, Download, Upload, ArrowUpDown, X, Star, MessageSquare, Dices } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Badge } from '../ui/badge';
import { Skeleton } from '../ui/skeleton';
import { Button } from '../ui/button';
import { useWatchlist, LibrarySortOption } from '../../contexts/WatchlistContext';

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
    updateSearchCategory,
    highlightedMovieId,
    updateHighlightedMovieId,
  } = useSearchContext();

  const {
    watchlist,
    watchedList,
    isInWatchlist,
    toggleWatchlist,
    isWatched,
    toggleWatched,
    librarySort,
    setLibrarySort,
    exportLibrary,
    importLibrary,
    getReview,
  } = useWatchlist();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const res = importLibrary(content);
        const total = res.importedWatchlist + res.importedWatched;
        if (total === 0 && res.importedReviews === 0) {
          setImportFeedback('All movies in the backup file were already present in your library.');
        } else {
          setImportFeedback(`Imported ${res.importedWatchlist} to Watchlist, ${res.importedWatched} to Watched (${res.importedReviews} ratings/notes)!`);
        }
        setTimeout(() => setImportFeedback(null), 5000);
      } catch (err: any) {
        setImportFeedback('Failed to import: Please select a valid JSON backup file.');
        setTimeout(() => setImportFeedback(null), 5000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

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
    <section aria-label="Search results" className="mt-4 pb-16">
      {/* Library Toolbar for Watchlist & Watched lists */}
      {(searchCategory === 'watchlist' || searchCategory === 'watched') && (
        <div className="mb-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Left: Tab Switcher (Watchlist vs Watched) */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/70 border border-border/60 self-start md:self-auto">
              <button
                type="button"
                onClick={() => updateSearchCategory('watchlist')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  searchCategory === 'watchlist'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Bookmark className={`h-4 w-4 ${searchCategory === 'watchlist' ? 'text-amber-500 fill-current' : ''}`} />
                <span>To Watch ({watchlist.length})</span>
              </button>
              <button
                type="button"
                onClick={() => updateSearchCategory('watched')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all cursor-pointer ${
                  searchCategory === 'watched'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Eye className={`h-4 w-4 ${searchCategory === 'watched' ? 'text-emerald-500' : ''}`} />
                <span>Watched ({watchedList.length})</span>
              </button>
            </div>

            {/* Right: Sorter & Export/Import Actions */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground">
                <ArrowUpDown className="h-3.5 w-3.5" />
                <label htmlFor="library-sort-select" className="sr-only">Sort Library</label>
                <select
                  id="library-sort-select"
                  value={librarySort}
                  onChange={(e) => setLibrarySort(e.target.value as any)}
                  className="h-8 px-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary cursor-pointer"
                >
                  <option value="added.desc">Date Added (Newest)</option>
                  <option value="added.asc">Date Added (Oldest)</option>
                  <option value="myrating.desc">My Rating (Highest)</option>
                  <option value="myrating.asc">My Rating (Lowest)</option>
                  <option value="vote.desc">TMDB Rating (Highest)</option>
                  <option value="vote.asc">TMDB Rating (Lowest)</option>
                  <option value="year.desc">Release Year (Newest)</option>
                  <option value="year.asc">Release Year (Oldest)</option>
                  <option value="title.asc">Title (A-Z)</option>
                </select>
              </div>

              {/* Export JSON */}
              <Button
                variant="outline"
                size="sm"
                onClick={exportLibrary}
                className="h-8 text-xs font-semibold rounded-lg border-border"
                title="Export your entire library to a JSON file"
              >
                <Download className="h-3.5 w-3.5 mr-1.5" />
                <span>Export</span>
              </Button>

              {/* Import JSON */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="h-8 text-xs font-semibold rounded-lg border-border"
                title="Import movies from a JSON backup file"
              >
                <Upload className="h-3.5 w-3.5 mr-1.5" />
                <span>Import</span>
              </Button>

              <input
                ref={fileInputRef}
                type="file"
                accept=".json"
                onChange={handleFileImport}
                className="hidden"
                aria-label="Upload JSON file to import library"
              />
            </div>
          </div>

          {/* Import feedback banner */}
          {importFeedback && (
            <div className="mt-3 flex items-center justify-between rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                <span>{importFeedback}</span>
              </div>
              <button
                type="button"
                onClick={() => setImportFeedback(null)}
                className="text-muted-foreground hover:text-foreground cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>
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
                id={`movie-card-${result.id}`}
                role="button"
                tabIndex={0}
                aria-haspopup="dialog"
                aria-label={`View details for ${result.title}, released ${formatDate(result.release_date || '') || 'unknown date'}`}
                onClick={(e) => openModal(result.id, result.title, e)}
                onKeyDown={(e) => handleKeyDown(result.id, result.title, e)}
                className={`cursor-pointer overflow-hidden border transition-all duration-300 flex flex-col h-full focus-visible:ring-4 focus-visible:ring-ring ${
                  highlightedMovieId === result.id
                    ? 'ring-4 ring-primary border-primary shadow-2xl scale-[1.03] bg-primary/5 -translate-y-2'
                    : 'border-border bg-card text-card-foreground hover:border-primary hover:shadow-xl hover:-translate-y-1.5'
                }`}
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

                  {/* Watchlist & Watched toggles positioned top-left */}
                  <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleWatchlist(result as any);
                      }}
                      aria-label={isInWatchlist(result.id) ? `Remove ${result.title} from watchlist` : `Add ${result.title} to watchlist`}
                      title={isInWatchlist(result.id) ? 'In Watchlist' : 'Add to Watchlist'}
                      className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 backdrop-blur-md shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                        isInWatchlist(result.id)
                          ? 'bg-amber-500 text-amber-950 hover:bg-amber-400 dark:text-amber-950'
                          : 'bg-background/80 text-foreground hover:bg-background hover:text-amber-500'
                      }`}
                    >
                      <Bookmark className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${isInWatchlist(result.id) ? 'fill-current' : ''}`} />
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        toggleWatched(result as any);
                      }}
                      aria-label={isWatched(result.id) ? `Remove ${result.title} from watched` : `Mark ${result.title} as watched`}
                      title={isWatched(result.id) ? 'Watched' : 'Mark as Watched'}
                      className={`p-1.5 sm:p-2 rounded-full transition-all duration-200 backdrop-blur-md shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer ${
                        isWatched(result.id)
                          ? 'bg-emerald-600 text-white hover:bg-emerald-500'
                          : 'bg-background/80 text-foreground hover:bg-background hover:text-emerald-500'
                      }`}
                    >
                      <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                    </button>
                  </div>

                  {/* Rating Gauge positioned top-right */}
                  <div className="absolute top-2 right-2 w-11 h-11 drop-shadow-md">
                    <GaugeSVG id={result.id} vote_average={result.vote_average || 0} />
                  </div>

                  {/* Highlighted Random Pick Badge */}
                  {highlightedMovieId === result.id && (
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-primary text-primary-foreground shadow-xl ring-2 ring-primary-foreground/30 animate-pulse">
                        <Dices className="h-3 w-3 shrink-0" aria-hidden="true" />
                        <span>Random Pick</span>
                      </span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <CardContent className="p-3.5 flex flex-col justify-between flex-1">
                  <div>
                    <h2 className="line-clamp-2 text-sm sm:text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
                      {result.title}
                    </h2>
                    {/* Personal Rating & Note Indicator in Watched View */}
                    {searchCategory === 'watched' && (() => {
                      const review = getReview(result.id);
                      if (!review?.rating && !review?.notes) return null;
                      return (
                        <div className="mt-2 pt-2 border-t border-border/60 flex flex-wrap items-center gap-1.5 text-xs">
                          {review.rating && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full font-bold bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/50">
                              <Star className="h-3 w-3 fill-amber-600 dark:fill-amber-400 text-amber-600 dark:text-amber-400" />
                              <span>{review.rating}/10</span>
                            </span>
                          )}
                          {review.notes && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold text-foreground bg-muted/90 border border-border" title={review.notes}>
                              <MessageSquare className="h-3 w-3 text-primary shrink-0" />
                              <span className="line-clamp-1 max-w-[9.5rem]">{review.notes}</span>
                            </span>
                          )}
                        </div>
                      );
                    })()}
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
