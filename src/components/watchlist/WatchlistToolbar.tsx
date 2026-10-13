import React, { useRef, useState } from 'react';
import { Bookmark, Eye, ArrowUpDown, Download, Upload, CheckCircle2, X } from 'lucide-react';
import { Button } from '../ui/button';
import { useWatchlist, LibrarySortOption } from '../../contexts/WatchlistContext';
import { useSearchContext } from '../../contexts/SearchContext';

/**
 * WatchlistToolbar
 *
 * A dedicated toolbar component for managing the user's personal movie collection,
 * including both the "Watchlist" (movies to watch) and "Watched" movies lists.
 * Provides controls for switching views, sorting items, and exporting/importing JSON backups.
 */
export interface WatchlistToolbarProps {}

export function WatchlistToolbar(_props: WatchlistToolbarProps = {}) {
  const {
    watchlist,
    watchedList,
    librarySort,
    setLibrarySort,
    exportLibrary,
    importLibrary,
  } = useWatchlist();
  const { searchCategory, updateSearchCategory } = useSearchContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importFeedback, setImportFeedback] = useState<string | null>(null);

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const res = importLibrary(text);
      const total = res.importedWatchlist + res.importedWatched;
      if (total === 0 && res.importedReviews === 0) {
        setImportFeedback('All movies in the backup file were already present in your library.');
      } else {
        setImportFeedback(`Imported ${res.importedWatchlist} to Watchlist, ${res.importedWatched} to Watched (${res.importedReviews} ratings/notes)!`);
      }
      setTimeout(() => setImportFeedback(null), 5000);
    } catch (err) {
      setImportFeedback('Failed to import: Please select a valid JSON backup file.');
      setTimeout(() => setImportFeedback(null), 5000);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="mb-6 rounded-2xl border border-border bg-card/80 backdrop-blur-md p-4 sm:p-5 shadow-sm">
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Left: Tab Switcher (Watchlist vs Watched) */}
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-muted/70 border border-border/60 self-start md:self-auto">
          <button
            type="button"
            onClick={() => updateSearchCategory('watchlist')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
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
            className={`flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm font-semibold rounded-lg transition-all ${
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
              onChange={(e) => setLibrarySort(e.target.value as LibrarySortOption)}
              className="h-8 px-2.5 rounded-lg border border-border bg-background text-foreground text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-primary"
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
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}

// Backward-compatible alias
export { WatchlistToolbar as LibraryToolbar };
export type { WatchlistToolbarProps as LibraryToolbarProps };
