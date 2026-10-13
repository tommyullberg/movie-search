import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, RotateCcw, Tv } from 'lucide-react';
import { Button } from '../ui/button';
import { useSearchContext } from '../../contexts/SearchContext';
import { TMDB_GENRES, TMDB_STREAMING_PROVIDERS_SE } from '../../utils/apiUtils';

export interface AdvancedFiltersPanelProps {
  isOpen: boolean;
  onApply: () => void;
  onReset?: () => void;
}

export function AdvancedFiltersPanel({ isOpen, onApply, onReset }: AdvancedFiltersPanelProps) {
  const {
    advancedFilters,
    updateAdvancedFilters,
    updateSearchCategory,
  } = useSearchContext();

  const handleResetFilters = () => {
    if (onReset) {
      onReset();
    } else {
      updateAdvancedFilters({
        genre: '',
        year: '',
        minRating: 0,
        sortBy: 'popularity.desc',
        watchProvider: '',
      });
    }
  };

  const hasActiveFilters = Boolean(
    advancedFilters.genre ||
    advancedFilters.year ||
    (advancedFilters.minRating && advancedFilters.minRating > 0) ||
    advancedFilters.watchProvider ||
    (advancedFilters.sortBy && advancedFilters.sortBy !== 'popularity.desc')
  );

  return (
    <AnimatePresence>
      {isOpen && (
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
            {hasActiveFilters && (
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
                  updateAdvancedFilters((prev) => ({ ...prev, watchProvider: newProvider }));
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
                  updateAdvancedFilters((prev) => ({ ...prev, genre: newGenre }));
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
                  updateAdvancedFilters((prev) => ({ ...prev, year: newYear }));
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
                  updateAdvancedFilters((prev) => ({ ...prev, minRating: newRating }));
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
                  updateAdvancedFilters((prev) => ({ ...prev, sortBy: newSort }));
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
              onClick={onApply}
              className="font-bold rounded-lg px-4"
            >
              Apply Filters
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
