import React, { useState } from 'react';
import { Star, MessageSquare, Edit3 } from 'lucide-react';
import { useWatchlist } from '../../contexts/WatchlistContext';
import type { MovieDetails } from '../../types';

export interface RatingNotesSectionProps {
  movie: MovieDetails;
}

export function RatingNotesSection({ movie }: RatingNotesSectionProps) {
  const { getReview, saveReview, isWatched } = useWatchlist();
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  if (!isWatched(movie.id)) {
    return null;
  }

  const currentReview = getReview(movie.id);

  return (
    <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 sm:p-4 text-xs transition-all">
      <div className="flex items-center justify-between pb-2 border-b border-border/60">
        <div className="flex items-center gap-2">
          <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
          <span className="font-bold text-sm text-foreground">My Rating & Notes</span>
        </div>
        {currentReview?.rating && (
          <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60">
            {currentReview.rating} / 10
          </span>
        )}
      </div>

      {/* Rating 1-10 selector buttons */}
      <div className="mt-3">
        <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
          Your rating (1 to 10):
        </p>
        <div className="flex flex-wrap items-center gap-1 sm:gap-1.5" role="radiogroup" aria-label="Personal rating 1 to 10">
          {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => {
            const isSelected = currentReview?.rating === star;
            return (
              <button
                key={star}
                type="button"
                onClick={() => {
                  if (isSelected) {
                    saveReview(movie.id, { rating: undefined });
                  } else {
                    saveReview(movie.id, { rating: star });
                  }
                }}
                aria-label={`Rate ${star} out of 10`}
                aria-checked={isSelected}
                role="radio"
                className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-black font-extrabold shadow-sm scale-105'
                    : 'bg-card border border-border text-foreground hover:border-amber-500 hover:text-amber-500'
                }`}
              >
                {star}
              </button>
            );
          })}
          {currentReview?.rating && (
            <button
              type="button"
              onClick={() => saveReview(movie.id, { rating: undefined })}
              className="ml-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors font-medium cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Personal Notes */}
      <div className="mt-3 pt-2.5 border-t border-border/50">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
            <MessageSquare className="h-3 w-3" />
            Personal review or notes:
          </span>
          {!isEditingNotes && currentReview?.notes && (
            <button
              type="button"
              onClick={() => {
                setTempNotes(currentReview?.notes || '');
                setIsEditingNotes(true);
              }}
              className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>

        {isEditingNotes ? (
          <div className="space-y-2 mt-1.5">
            <textarea
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
              placeholder="What did you think of the movie? Write a personal note or review..."
              rows={3}
              className="w-full rounded-lg border border-border bg-background p-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary leading-relaxed"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingNotes(false)}
                className="px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground font-medium rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  saveReview(movie.id, { notes: tempNotes.trim() || undefined });
                  setIsEditingNotes(false);
                }}
                className="px-3 py-1 text-xs font-bold rounded-md bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer"
              >
                Save Notes
              </button>
            </div>
          </div>
        ) : currentReview?.notes ? (
          <div className="mt-1.5 rounded-lg bg-card/70 border border-border/60 p-2.5 text-foreground leading-relaxed whitespace-pre-wrap">
            {currentReview.notes}
          </div>
        ) : (
          <button
            type="button"
            onClick={() => {
              setTempNotes('');
              setIsEditingNotes(true);
            }}
            className="mt-1 text-[11px] text-primary hover:underline font-semibold flex items-center gap-1 cursor-pointer"
          >
            + Add a personal note or review
          </button>
        )}
      </div>
    </div>
  );
}
