import React, { useState, useEffect, useRef } from 'react';
import { useMotionValue, animate } from 'framer-motion';
import { Dices, X, ChevronDown, AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { Alert, AlertTitle, AlertDescription } from './ui/alert';
import { SearchResult } from '../types';
import { TMDB_GENRES, fetchSearchResults } from '../utils/apiUtils';
import { SurpriseReel, SurpriseWinnerSpotlight } from './surprise';

interface SurprisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: SearchResult[];
  watchedList?: SearchResult[];
  initialSource?: string;
  onSelectWinner: (movie: SearchResult, pool: SearchResult[]) => void;
  onOpenDetails: (movieId: number, title?: string) => void;
}

export function SurprisePickerModal({
  isOpen,
  onClose,
  watchlist,
  watchedList = [],
  initialSource = 'trending',
  onSelectWinner,
  onOpenDetails,
}: SurprisePickerModalProps) {
  const getNormalizedSource = (src: string) => {
    const valid = ['watchlist', 'watched', 'trending', 'popular', 'toprated', 'nowplaying', 'upcoming'];
    if (valid.includes(src) || src.startsWith('genre_')) {
      return src;
    }
    return 'trending';
  };

  const [source, setSource] = useState(() => getNormalizedSource(initialSource));
  const [isLoadingPool, setIsLoadingPool] = useState(false);
  const [isRolling, setIsRolling] = useState(false);
  const [candidates, setCandidates] = useState<SearchResult[]>([]);
  const [winner, setWinner] = useState<SearchResult | null>(null);
  const [targetIndex, setTargetIndex] = useState(20);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState(600);

  const containerRef = useRef<HTMLDivElement>(null);
  const animationControlsRef = useRef<{ stop: () => void } | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);

  const CARD_WIDTH = 145;
  const CARD_GAP = 18;
  const SLOT_WIDTH = CARD_WIDTH + CARD_GAP;

  // Track active trigger element to restore focus on dialog close
  useEffect(() => {
    if (isOpen) {
      triggerRef.current = document.activeElement as HTMLElement;
    }
  }, [isOpen]);

  // Measure container width and resize dynamically
  useEffect(() => {
    if (!isOpen) return;

    const updateWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };

    updateWidth();
    const timer = setTimeout(updateWidth, 50);
    window.addEventListener('resize', updateWidth);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', updateWidth);
    };
  }, [isOpen]);

  // Start initial shuffle when modal opens
  useEffect(() => {
    if (isOpen) {
      const normalized = getNormalizedSource(initialSource);
      setSource(normalized);
      startNewShuffle(normalized);
    } else {
      if (animationControlsRef.current) {
        animationControlsRef.current.stop();
      }
    }
  }, [isOpen]);

  const fetchTop50 = async (chosenSource: string): Promise<SearchResult[]> => {
    if (chosenSource === 'watchlist') {
      return watchlist.slice(0, 50);
    }
    if (chosenSource === 'watched') {
      return watchedList.slice(0, 50);
    }

    const isGenre = chosenSource.startsWith('genre_');
    const genreId = isGenre ? chosenSource.replace('genre_', '') : undefined;
    const category = isGenre ? '' : chosenSource;
    const filters = genreId ? { genre: genreId } : undefined;

    // Fetch pages 1, 2, and 3 concurrently to reach top 50
    const [p1, p2, p3] = await Promise.all([
      fetchSearchResults('', category, 1, 'movie', filters),
      fetchSearchResults('', category, 2, 'movie', filters),
      fetchSearchResults('', category, 3, 'movie', filters),
    ]);

    const combined = [
      ...((p1.results || []) as SearchResult[]),
      ...((p2.results || []) as SearchResult[]),
      ...((p3.results || []) as SearchResult[]),
    ];

    const uniqueMap = new Map<number, SearchResult>();
    for (const movie of combined) {
      if (movie && movie.id && !uniqueMap.has(movie.id)) {
        uniqueMap.set(movie.id, movie);
      }
    }
    return Array.from(uniqueMap.values()).slice(0, 50);
  };

  const startNewShuffle = async (chosenSource = source) => {
    if (animationControlsRef.current) {
      animationControlsRef.current.stop();
    }
    setErrorMessage(null);
    setWinner(null);
    setIsLoadingPool(true);

    try {
      const top50 = await fetchTop50(chosenSource);
      if (top50.length === 0) {
        if (chosenSource === 'watchlist') {
          setErrorMessage('Your watchlist is empty. Add movies first!');
        } else if (chosenSource === 'watched') {
          setErrorMessage('Your watched list is empty. Mark movies as watched first!');
        } else {
          setErrorMessage('Could not find any movies for the selected category.');
        }
        setIsLoadingPool(false);
        return;
      }

      // Fisher-Yates shuffle the entire list so cards and neighbors are completely randomized on every roll
      const shuffled = [...top50];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }

      // Pick a random winner from the pool
      const randomWinnerIndex = Math.floor(Math.random() * shuffled.length);
      const winningMovie = shuffled[randomWinnerIndex];

      // Dynamic target stop index:
      // For lists >= 26: random position between 20 and (totalLength - 5)
      // For shorter lists: randomized in latter half, never at index 0 (unless totalLength is 1)
      const L = shuffled.length;
      let minTarget = 1;
      let maxTarget = 1;

      if (L <= 1) {
        minTarget = 0;
        maxTarget = 0;
      } else if (L >= 26) {
        minTarget = 20;
        maxTarget = L - 5;
      } else {
        minTarget = Math.max(1, Math.floor(L / 2));
        maxTarget = Math.max(minTarget, L - 1);
      }

      const chosenTargetIndex =
        Math.floor(Math.random() * (maxTarget - minTarget + 1)) + minTarget;

      // Swap the winner with the card at the chosen target stop index
      const reelCandidates = [...shuffled];
      const movieAtTarget = reelCandidates[chosenTargetIndex];
      reelCandidates[chosenTargetIndex] = winningMovie;
      reelCandidates[randomWinnerIndex] = movieAtTarget;

      setCandidates(reelCandidates);
      setTargetIndex(chosenTargetIndex);

      setIsLoadingPool(false);
      setIsRolling(true);

      // Reset starting offset to 0
      x.set(0);

      // Calculate final target position to center the winning card
      setTimeout(() => {
        const measuredWidth = containerRef.current?.offsetWidth || containerWidth || 600;
        setContainerWidth(measuredWidth);
        const finalX =
          measuredWidth / 2 - (chosenTargetIndex * SLOT_WIDTH + CARD_WIDTH / 2);

        // Calculate natural spin duration based on distance travelled
        const spinDuration = Math.min(3.8, Math.max(1.8, (chosenTargetIndex / 30) * 3.8));

        // Animate with slot-machine deceleration
        animationControlsRef.current = animate(x, finalX, {
          duration: spinDuration,
          ease: [0.12, 0.85, 0.32, 1],
          onComplete: () => {
            setIsRolling(false);
            setWinner(winningMovie);
          },
        });
      }, 50);
    } catch {
      setErrorMessage('An error occurred while loading movies.');
      setIsLoadingPool(false);
      setIsRolling(false);
    }
  };

  const handleSourceChange = (newSource: string) => {
    setSource(newSource);
    startNewShuffle(newSource);
  };

  const handleApplyToGrid = () => {
    if (winner) {
      const uniquePool = Array.from(
        new Map(candidates.map((m) => [m.id, m])).values()
      );
      onSelectWinner(winner, uniquePool);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        onCloseAutoFocus={(e) => {
          if (triggerRef.current) {
            e.preventDefault();
            triggerRef.current.focus();
          }
        }}
        className="p-0 sm:max-w-2xl md:max-w-3xl lg:max-w-4xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-card/60 backdrop-blur-xs pr-14">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-primary/10 text-primary">
              <Dices className="h-5 w-5" aria-hidden="true" />
            </div>
            <div>
              <DialogTitle className="text-base sm:text-lg font-bold text-foreground leading-tight">
                Random movie from top 50
              </DialogTitle>
            </div>
          </div>
        </div>

        {/* Source Selector Bar */}
        <div className="px-4 sm:px-6 py-3 border-b border-border/60 bg-muted/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-foreground">Source:</span>
            <div className="relative">
              <select
                value={source}
                disabled={isRolling || isLoadingPool}
                onChange={(e) => handleSourceChange(e.target.value)}
                aria-label="Select source to roll from"
                className="h-8 pl-3 pr-8 rounded-lg bg-background border border-border text-xs font-semibold text-foreground cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary appearance-none disabled:opacity-50"
              >
                <option value="watchlist">Watchlist ({watchlist.length})</option>
                <option value="watched">Watched ({watchedList.length})</option>
                <option value="trending">Trending</option>
                <option value="popular">Popular</option>
                <option value="toprated">Top Rated</option>
                <option value="nowplaying">In Theaters</option>
                <option value="upcoming">Upcoming</option>
                <optgroup label="Genres">
                  {TMDB_GENRES.map((g) => (
                    <option key={g.id} value={`genre_${g.id}`}>
                      {g.name}
                    </option>
                  ))}
                </optgroup>
              </select>
              <ChevronDown className="absolute right-2 top-2.5 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            </div>
          </div>

          <Button
            type="button"
            size="sm"
            disabled={isRolling || isLoadingPool}
            onClick={() => startNewShuffle(source)}
            className="h-8 px-3 rounded-lg font-bold shadow-xs text-xs"
          >
            <RotateCcw
              className={`h-3.5 w-3.5 mr-1.5 ${isRolling ? 'animate-spin' : ''}`}
            />
            <span>{isRolling ? 'Rolling...' : 'Roll Again'}</span>
          </Button>
        </div>

        {/* Body Content */}
        <div className="p-4 sm:p-6 flex-1 flex flex-col justify-center items-center overflow-y-auto">
          {errorMessage ? (
            <div className="py-8 max-w-md w-full text-center">
              <Alert variant="destructive" className="text-left mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cannot roll movie</AlertTitle>
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleSourceChange('trending')}
              >
                Choose Trending instead
              </Button>
            </div>
          ) : (
            <div className="w-full flex flex-col items-center">
              <SurpriseReel
                containerRef={containerRef}
                x={x}
                candidates={candidates}
                winner={winner}
                targetIndex={targetIndex}
                containerWidth={containerWidth}
                isRolling={isRolling}
                cardWidth={CARD_WIDTH}
                cardGap={CARD_GAP}
              />

              <SurpriseWinnerSpotlight
                winner={winner}
                isRolling={isRolling}
                onRollAgain={() => startNewShuffle(source)}
                onOpenDetails={onOpenDetails}
                onHighlightInResults={handleApplyToGrid}
              />
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
