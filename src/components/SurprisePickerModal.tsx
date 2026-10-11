import React, { useState, useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  MotionValue,
  AnimatePresence,
} from 'framer-motion';
import {
  Dices,
  Sparkles,
  RotateCcw,
  Film,
  X,
  Star,
  ExternalLink,
  ChevronDown,
  Target,
} from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogTitle } from './ui/dialog';
import { SearchResult } from './SearchResults';
import { formatDate } from '../utils/helpers';
import { TMDB_GENRES, fetchSearchResults } from '../utils/apiUtils';
import { imageConfig } from '../config/imageConfig';

interface SurprisePickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  watchlist: SearchResult[];
  watchedList?: SearchResult[];
  initialSource?: string;
  onSelectWinner: (movie: SearchResult, pool: SearchResult[]) => void;
  onOpenDetails: (movieId: number, title?: string) => void;
}

interface ReelCardProps {
  movie: SearchResult;
  index: number;
  x: MotionValue<number>;
  containerWidth: number;
  isWinner: boolean;
  isRolling: boolean;
  cardWidth: number;
  cardGap: number;
}

function ReelCard({
  movie,
  index,
  x,
  containerWidth,
  isWinner,
  isRolling,
  cardWidth,
  cardGap,
}: ReelCardProps) {
  const slotWidth = cardWidth + cardGap;
  const halfContainer = containerWidth > 0 ? containerWidth / 2 : 300;

  // Center of card relative to viewport
  const cardCenter = useTransform(
    x,
    (currentX) => currentX + index * slotWidth + cardWidth / 2
  );

  // Distance from exact center of viewport
  const distFromCenter = useTransform(cardCenter, (c) =>
    Math.abs(c - halfContainer)
  );

  // 3D Mac Dock magnification: scale 1.18 at center, 1.0 adjacent, 0.8 further away
  const scale = useTransform(
    distFromCenter,
    [0, slotWidth, slotWidth * 2.5, slotWidth * 4],
    [1.18, 0.98, 0.86, 0.78]
  );

  // 3D rotation: cards tilt inward toward center in 3D space
  const rotateY = useTransform(
    cardCenter,
    [halfContainer - slotWidth * 3, halfContainer, halfContainer + slotWidth * 3],
    [18, 0, -18]
  );

  // Subtle depth opacity fade on edges
  const opacity = useTransform(
    distFromCenter,
    [0, slotWidth * 1.5, slotWidth * 3.5],
    [1, 0.92, 0.6]
  );

  // Elevated zIndex for center cards so magnified card stays on top
  const zIndex = useTransform(distFromCenter, (dist) =>
    Math.max(1, Math.round(50 - dist / 15))
  );

  return (
    <motion.div
      style={{
        width: `${cardWidth}px`,
        scale,
        rotateY,
        opacity,
        zIndex,
        transformStyle: 'preserve-3d',
      }}
      className={`shrink-0 rounded-2xl overflow-hidden bg-card transition-colors duration-300 flex flex-col shadow-lg select-none outline-none focus:outline-none focus-visible:outline-none ${
        !isRolling && isWinner
          ? 'border-2 border-primary ring-4 ring-primary/30 shadow-2xl shadow-primary/25'
          : 'border border-border/70'
      }`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full bg-muted overflow-hidden">
        {movie.poster_path ? (
          <img
            src={`${imageConfig.URL_IMAGE_POSTER_w342}${movie.poster_path}`}
            alt=""
            loading="eager"
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Film className="h-8 w-8 opacity-40" />
          </div>
        )}

        {/* Winner Tag */}
        {!isRolling && isWinner && (
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-primary-foreground shadow-md animate-pulse">
              <Sparkles className="h-2.5 w-2.5" />
              Winner!
            </span>
          </div>
        )}

        {Boolean(movie.vote_average && movie.vote_average > 0) && (
          <div className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-md bg-background/85 backdrop-blur-xs text-[10px] font-bold text-foreground flex items-center gap-0.5 pointer-events-none">
            <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="p-2 text-left bg-card pointer-events-none">
        <p className="text-xs font-bold text-foreground line-clamp-1">
          {movie.title}
        </p>
        <p className="text-[10px] text-muted-foreground font-medium">
          {formatDate(movie.release_date || '')?.slice(-4) || 'Movie'}
        </p>
      </div>
    </motion.div>
  );
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
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-destructive mb-3">
                {errorMessage}
              </p>
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
              {/* Card Reel Stage with generous vertical padding to prevent focus/ring clipping */}
              <div
                ref={containerRef}
                style={{ perspective: 1200 }}
                className="relative w-full h-[330px] sm:h-[350px] overflow-hidden rounded-2xl bg-muted/25 border border-border flex items-center justify-center shadow-inner py-6 sm:py-8"
              >
                {/* Center Reticle Pointer Arrows */}
                <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
                  <span className="text-primary text-sm font-black drop-shadow-md">
                    ▼
                  </span>
                </div>
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
                  <span className="text-primary text-sm font-black drop-shadow-md">
                    ▲
                  </span>
                </div>

                {/* Left & Right Shadow Gradient Overlays */}
                <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-card to-transparent z-20 pointer-events-none" />
                <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-card to-transparent z-20 pointer-events-none" />

                {/* Ambient Center Glow Aura (borderless to avoid double outline) */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[270px] rounded-3xl bg-primary/10 blur-2xl pointer-events-none z-0" />

                {/* Sliding Strip */}
                <motion.div
                  className="flex items-center absolute left-0"
                  style={{ x, gap: `${CARD_GAP}px` }}
                >
                  {candidates.map((movie, index) => {
                    const isWinnerCard =
                      !isRolling &&
                      winner !== null &&
                      winner.id === movie.id &&
                      index === targetIndex;
                    return (
                      <ReelCard
                        key={`${movie.id}-${index}`}
                        movie={movie}
                        index={index}
                        x={x}
                        containerWidth={containerWidth}
                        isWinner={isWinnerCard}
                        isRolling={isRolling}
                        cardWidth={CARD_WIDTH}
                        cardGap={CARD_GAP}
                      />
                    );
                  })}
                </motion.div>
              </div>

              {/* Winner Announcement Spotlight */}
              <AnimatePresence>
                {!isRolling && winner && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 p-4 w-full rounded-2xl border border-primary/40 bg-primary/5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
                  >
                    <div className="flex-1 min-w-0 pr-2">
                      <div className="flex items-center justify-center sm:justify-start gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
                        <Sparkles className="h-3.5 w-3.5 shrink-0" />
                        <span>Winning Pick</span>
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
                        {winner.title}
                      </h3>
                      <p className="text-xs text-muted-foreground font-semibold flex items-center justify-center sm:justify-start gap-2 mt-0.5">
                        <span>{formatDate(winner.release_date || '') || 'Unknown'}</span>
                        {Boolean(winner.vote_average && winner.vote_average > 0) && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-1 text-foreground">
                              <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                              {winner.vote_average?.toFixed(1)} / 10
                            </span>
                          </>
                        )}
                      </p>
                    </div>

                    <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => startNewShuffle(source)}
                        className="rounded-xl font-bold h-9"
                      >
                        <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                        Roll Again
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={() => onOpenDetails(winner.id, winner.title)}
                        className="rounded-xl font-bold h-9 shadow-sm"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
                        Go to movie
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleApplyToGrid}
                        className="rounded-xl font-bold h-9 shadow-sm"
                      >
                        <Target className="h-3.5 w-3.5 mr-1.5" />
                        Highlight in results
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
