import React, { useState } from 'react';
import { Bookmark, Eye, Share2, Check, ArrowLeft } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { SearchResult, MovieDetails } from '../../types';

export type ActionButtonType = 'watchlist' | 'watched' | 'share' | 'back';
export type ActionButtonVariant = 'icon' | 'detail';

export interface ActionButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  type: ActionButtonType;
  variant?: ActionButtonVariant;
  movie?: SearchResult | MovieDetails;
  shareParam?: { key: 'movie' | 'person'; value: number };
  shareTitle?: string;
  targetTitle?: string;
  onBack?: () => void;
  className?: string;
}

export function ActionButton({
  type,
  variant = 'detail',
  movie,
  shareParam,
  shareTitle,
  targetTitle,
  onBack,
  className,
  onClick,
  disabled,
  ...restProps
}: ActionButtonProps) {
  const { isInWatchlist, toggleWatchlist, isWatched, toggleWatched } = useWatchlist();
  const [isCopied, setIsCopied] = useState(false);

  // 1. WATCHLIST BUTTON
  if (type === 'watchlist') {
    if (!movie) return null;
    const active = isInWatchlist(movie.id);
    const movieTitle = movie.title || 'Movie';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'icon') {
        e.stopPropagation();
        e.preventDefault();
      }
      toggleWatchlist(movie);
      onClick?.(e);
    };

    if (variant === 'icon') {
      return (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-label={active ? `Remove ${movieTitle} from watchlist` : `Add ${movieTitle} to watchlist`}
          title={active ? 'In Watchlist' : 'Add to Watchlist'}
          className={cn(
            'p-1.5 sm:p-2 rounded-full transition-all duration-200 backdrop-blur-md shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer',
            active
              ? 'bg-amber-500 text-amber-950 hover:bg-amber-400 dark:text-amber-950'
              : 'bg-background/80 text-foreground hover:bg-background hover:text-amber-500',
            className
          )}
          {...restProps}
        >
          <Bookmark className={cn('h-3.5 w-3.5 sm:h-4 sm:w-4', active && 'fill-current')} />
        </button>
      );
    }

    return (
      <Button
        type="button"
        variant={active ? 'default' : 'outline'}
        size="sm"
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={active}
        aria-label={active ? `Remove ${movieTitle} from Watchlist` : `Add ${movieTitle} to Watchlist`}
        className={cn(
          'w-[9.75rem] justify-center rounded-lg font-semibold transition-all border-border',
          active
            ? 'bg-amber-500 hover:bg-amber-600 text-black font-bold'
            : 'text-foreground hover:bg-secondary',
          className
        )}
        {...restProps}
      >
        <Bookmark className={cn('h-3.5 w-3.5 mr-1.5 shrink-0', active && 'fill-current')} aria-hidden="true" />
        <span>{active ? 'In Watchlist' : 'Add to Watchlist'}</span>
      </Button>
    );
  }

  // 2. WATCHED BUTTON
  if (type === 'watched') {
    if (!movie) return null;
    const active = isWatched(movie.id);
    const movieTitle = movie.title || 'Movie';

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (variant === 'icon') {
        e.stopPropagation();
        e.preventDefault();
      }
      toggleWatched(movie);
      onClick?.(e);
    };

    if (variant === 'icon') {
      return (
        <button
          type="button"
          onClick={handleClick}
          disabled={disabled}
          aria-label={active ? `Remove ${movieTitle} from watched` : `Mark ${movieTitle} as watched`}
          title={active ? 'Watched' : 'Mark as Watched'}
          className={cn(
            'p-1.5 sm:p-2 rounded-full transition-all duration-200 backdrop-blur-md shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer',
            active
              ? 'bg-emerald-600 text-white hover:bg-emerald-500'
              : 'bg-background/80 text-foreground hover:bg-background hover:text-emerald-500',
            className
          )}
          {...restProps}
        >
          <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
        </button>
      );
    }

    return (
      <Button
        type="button"
        variant={active ? 'default' : 'outline'}
        size="sm"
        onClick={handleClick}
        disabled={disabled}
        aria-pressed={active}
        aria-label={active ? `Remove ${movieTitle} from Watched` : `Mark ${movieTitle} as Watched`}
        className={cn(
          'w-[9.75rem] justify-center rounded-lg font-semibold transition-all border-border',
          active
            ? 'bg-emerald-600 hover:bg-emerald-700 text-white font-bold'
            : 'text-foreground hover:bg-secondary',
          className
        )}
        {...restProps}
      >
        <Eye className="h-3.5 w-3.5 mr-1.5 shrink-0" aria-hidden="true" />
        <span>{active ? 'Watched' : 'Mark as Watched'}</span>
      </Button>
    );
  }

  // 3. SHARE BUTTON
  if (type === 'share') {
    const title = shareTitle || (movie ? movie.title : 'Details');

    const handleShare = async (e: React.MouseEvent<HTMLButtonElement>) => {
      try {
        const url = new URL(window.location.href);
        if (shareParam) {
          if (shareParam.key === 'movie') {
            url.searchParams.set('movie', String(shareParam.value));
            url.searchParams.delete('person');
          } else {
            url.searchParams.set('person', String(shareParam.value));
            url.searchParams.delete('movie');
          }
        } else if (movie) {
          url.searchParams.set('movie', String(movie.id));
          url.searchParams.delete('person');
        }
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url.toString());
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2500);
        }
      } catch (err) {
        console.error('Error copying share link:', err);
      }
      onClick?.(e);
    };

    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleShare}
        disabled={disabled}
        aria-label={`Share link for ${title}`}
        className={cn('rounded-lg font-semibold border-border transition-all', className)}
        {...restProps}
      >
        {isCopied ? (
          <>
            <Check className="h-3.5 w-3.5 mr-1.5 text-emerald-500" aria-hidden="true" />
            <span>Link Copied!</span>
          </>
        ) : (
          <>
            <Share2 className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
            <span>Share</span>
          </>
        )}
      </Button>
    );
  }

  // 4. BACK BUTTON
  if (type === 'back') {
    const handleBack = (e: React.MouseEvent<HTMLButtonElement>) => {
      onBack?.();
      onClick?.(e);
    };

    return (
      <button
        type="button"
        onClick={handleBack}
        disabled={disabled}
        aria-label={`Back to ${targetTitle || 'previous'}`}
        className={cn(
          'inline-flex items-center gap-1.5 rounded-full bg-background/85 px-3 py-1.5 text-xs font-semibold text-foreground/90 backdrop-blur-md shadow-lg transition-all hover:bg-background hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring border border-border cursor-pointer',
          className
        )}
        {...restProps}
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        <span className="truncate max-w-[130px] sm:max-w-[240px]">
          Back to {targetTitle || 'previous'}
        </span>
      </button>
    );
  }

  return null;
}

// Convenience wrapper components
export const WatchlistButton = (props: Omit<ActionButtonProps, 'type'>) => (
  <ActionButton type="watchlist" {...props} />
);

export const WatchedButton = (props: Omit<ActionButtonProps, 'type'>) => (
  <ActionButton type="watched" {...props} />
);

export const ShareButton = (props: Omit<ActionButtonProps, 'type'>) => (
  <ActionButton type="share" {...props} />
);

export const BackDetailButton = (props: Omit<ActionButtonProps, 'type'>) => (
  <ActionButton type="back" {...props} />
);
