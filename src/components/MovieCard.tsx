import React from 'react';
import { Film, Star, MessageSquare, Dices } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { GaugeSVG } from './ui/gauge';
import { ActionButton } from './buttons/ActionButton';
import { imageConfig } from '../config/imageConfig';
import { formatDate } from '../utils/helpers';
import { SearchResult } from '../types';
import { MovieReview } from '../contexts/WatchlistContext';
import { cn } from '../lib/utils';

export interface MovieCardProps {
  movie: SearchResult;
  isHighlighted?: boolean;
  searchCategory?: string;
  review?: MovieReview;
  onClick?: (e: React.MouseEvent) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  className?: string;
  showActions?: boolean;
  showRatingGauge?: boolean;
}

export function MovieCard({
  movie,
  isHighlighted = false,
  searchCategory,
  review,
  onClick,
  onKeyDown,
  className,
  showActions = true,
  showRatingGauge = true,
}: MovieCardProps) {
  const { URL_IMAGE_POSTER_w342, URL_IMAGE_POSTER_w500 } = imageConfig;

  return (
    <Card
      id={`movie-card-${movie.id}`}
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`View details for ${movie.title}, released ${formatDate(movie.release_date || '') || 'unknown date'}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className={cn(
        'cursor-pointer overflow-hidden border transition-all duration-300 flex flex-col h-full focus-visible:ring-4 focus-visible:ring-ring group',
        isHighlighted
          ? 'ring-4 ring-primary border-primary shadow-2xl scale-[1.03] bg-primary/5 -translate-y-2'
          : 'border-border bg-card text-card-foreground hover:border-primary hover:shadow-xl hover:-translate-y-1.5',
        className
      )}
    >
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {movie.poster_path ? (
          <img
            src={`${URL_IMAGE_POSTER_w342}${movie.poster_path}`}
            srcSet={`${URL_IMAGE_POSTER_w342}${movie.poster_path} 1x, ${URL_IMAGE_POSTER_w500}${movie.poster_path} 2x`}
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
        {showActions && (
          <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5">
            <ActionButton type="watchlist" variant="icon" movie={movie} />
            <ActionButton type="watched" variant="icon" movie={movie} />
          </div>
        )}

        {/* Rating Gauge positioned top-right */}
        {showRatingGauge && (
          <div className="absolute top-2 right-2 w-11 h-11 drop-shadow-md">
            <GaugeSVG id={movie.id} vote_average={movie.vote_average || 0} />
          </div>
        )}

        {/* Highlighted Random Pick Badge */}
        {isHighlighted && (
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
            {movie.title}
          </h2>

          {/* Personal Rating & Note Indicator in Watched View */}
          {searchCategory === 'watched' && review && (review.rating || review.notes) && (
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
          )}
        </div>

        <p className="mt-2 text-xs sm:text-sm font-semibold text-muted-foreground">
          {formatDate(movie.release_date || '') || 'Unknown date'}
        </p>
      </CardContent>
    </Card>
  );
}
