import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchContext } from '../../contexts/SearchContext';
import { useWatchlist } from '../../contexts/WatchlistContext';
import { imageConfig } from '../../config/imageConfig';
import { Button } from '../ui/button';
import {
  MovieHeroSection,
  KeyFactsSection,
  RatingNotesSection,
  MovieTrailerSection,
  WhereToWatchSection,
  MovieCastSection,
  MovieRecommendationsSection,
} from './details';

const STORAGE_KEY_RATING_NOTES_VISIBLE = 'movie_search_rating_notes_visible';
const STORAGE_KEY_BUDGET_VISIBLE = 'movie_search_budget_visible';
const STORAGE_KEY_WHERE_TO_WATCH_VISIBLE = 'movie_search_where_to_watch_visible';
const STORAGE_KEY_CAST_VISIBLE = 'movie_search_cast_visible';
const STORAGE_KEY_RECOMMENDATIONS_VISIBLE = 'movie_search_recommendations_visible';

export function MovieDetails() {
  const {
    movieData,
    detailHistory,
    navigateToMovie,
    navigateToPerson,
    goBackDetail,
  } = useSearchContext();
  const { isWatched } = useWatchlist();
  const [showTrailer, setShowTrailer] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const trailerSectionRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll dialog to top when movie changes
  useEffect(() => {
    if (movieData?.id && rootRef.current) {
      const scrollContainer = rootRef.current.closest('[data-dialog-scroll="true"]') as HTMLElement | null
        || rootRef.current.closest('.overflow-y-auto') as HTMLElement | null;
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [movieData?.id]);

  // Persistent visibility states: default visible (true)
  const [isRatingNotesVisible, setIsRatingNotesVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RATING_NOTES_VISIBLE);
    return saved !== null ? saved === 'true' : true;
  });

  const [isBudgetVisible, setIsBudgetVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_BUDGET_VISIBLE);
    return saved !== null ? saved === 'true' : true;
  });

  const [isWhereToWatchVisible, setIsWhereToWatchVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_WHERE_TO_WATCH_VISIBLE);
    return saved !== null ? saved === 'true' : true;
  });

  const [isCastVisible, setIsCastVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CAST_VISIBLE);
    return saved !== null ? saved === 'true' : true;
  });

  const [isRecommendationsVisible, setIsRecommendationsVisible] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_RECOMMENDATIONS_VISIBLE);
    return saved !== null ? saved === 'true' : true;
  });

  const handleToggleRatingNotes = () => {
    setIsRatingNotesVisible((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_RATING_NOTES_VISIBLE, String(next));
      return next;
    });
  };

  const handleToggleBudget = () => {
    setIsBudgetVisible((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_BUDGET_VISIBLE, String(next));
      return next;
    });
  };

  const handleToggleWhereToWatch = () => {
    setIsWhereToWatchVisible((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_WHERE_TO_WATCH_VISIBLE, String(next));
      return next;
    });
  };

  const handleToggleCast = () => {
    setIsCastVisible((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_CAST_VISIBLE, String(next));
      return next;
    });
  };

  const handleToggleRecommendations = () => {
    setIsRecommendationsVisible((prev) => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY_RECOMMENDATIONS_VISIBLE, String(next));
      return next;
    });
  };

  const { URL_IMAGE_BACKDROP_w1280 } = imageConfig;

  if (!movieData) return null;

  // Find primary trailer or teaser video from YouTube
  const trailer = movieData.videos?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Trailer'
  ) || movieData.videos?.results?.find(
    (v) => v.site === 'YouTube' && v.type === 'Teaser'
  ) || movieData.videos?.results?.find(
    (v) => v.site === 'YouTube'
  );

  // Find primary Director
  const director = movieData.credits?.crew?.find(
    (member) => member.job === 'Director'
  );

  // Top 10 prominent cast members
  const topCast = movieData.credits?.cast?.slice(0, 10) || [];

  // Top 8 recommended movies
  const recommendations = movieData.recommendations?.results?.slice(0, 8) || [];

  const hasPrevious = detailHistory.length > 1;
  const previousItem = hasPrevious ? detailHistory[detailHistory.length - 2] : null;
  const previousTitle = previousItem
    ? previousItem.title || (previousItem.type === 'movie' ? 'Movie' : 'Person')
    : '';

  const handleSelectMovie = async (newMovieId: number, title?: string) => {
    // Scroll to top immediately on click without waiting for API fetch
    if (rootRef.current) {
      const scrollContainer =
        (rootRef.current.closest('[data-dialog-scroll="true"]') as HTMLElement | null) ||
        (rootRef.current.closest('.overflow-y-auto') as HTMLElement | null);
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
    setShowTrailer(false);
    await navigateToMovie(newMovieId, title);
  };

  const handleToggleTrailer = () => {
    setShowTrailer((prev) => {
      const nextState = !prev;
      if (nextState) {
        // Scroll trailer into view with bottom edge ~1rem above dialog bottom
        setTimeout(() => {
          if (trailerSectionRef.current) {
            const el = trailerSectionRef.current;
            const scrollContainer = el.closest('.overflow-y-auto') as HTMLElement | null;
            if (scrollContainer) {
              const elRect = el.getBoundingClientRect();
              const containerRect = scrollContainer.getBoundingClientRect();
              const offsetBottom = 16; // 1rem
              const targetScrollTop =
                scrollContainer.scrollTop +
                (elRect.bottom - containerRect.bottom) +
                offsetBottom;

              scrollContainer.scrollTo({
                top: Math.max(0, targetScrollTop),
                behavior: 'smooth',
              });
            } else {
              el.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }
          }
        }, 100);
      }
      return nextState;
    });
  };

  // Determine availability of sections
  const watchResults = movieData['watch/providers']?.results;
  const seProviders = watchResults?.SE;
  const usProviders = watchResults?.US;
  const activeProviders = (seProviders?.flatrate?.length || seProviders?.free?.length || seProviders?.ads?.length || seProviders?.rent?.length || seProviders?.buy?.length) ? seProviders : usProviders;
  const hasWhereToWatch = Boolean(
    activeProviders?.flatrate?.length ||
    activeProviders?.free?.length ||
    activeProviders?.ads?.length ||
    activeProviders?.rent?.length ||
    activeProviders?.buy?.length
  );
  const hasCast = topCast.length > 0;
  const hasRecommendations = recommendations.length > 0;

  return (
    <div ref={rootRef} className="relative overflow-hidden bg-card text-card-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={movieData.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full"
        >
          {/* Back button (Only rendered when navigating deeper from another detail) */}
          {hasPrevious && (
            <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={goBackDetail}
                className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold rounded-lg bg-background/80 hover:bg-background backdrop-blur-md border-border shadow-sm text-foreground transition-all"
                aria-label={`Go back to ${previousTitle}`}
              >
                <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="line-clamp-1 max-w-[140px] sm:max-w-[200px]">
                  Back to {previousTitle}
                </span>
              </Button>
            </div>
          )}

      {/* Backdrop Header with adaptive height */}
      {movieData.backdrop_path && (
        <div className="relative h-44 sm:h-64 lg:h-80 w-full overflow-hidden bg-background">
          <img
            src={`${URL_IMAGE_BACKDROP_w1280}${movieData.backdrop_path}`}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/75 to-transparent" />
        </div>
      )}

      {/* Main Content Area */}
      <div className={`p-4 sm:p-6 lg:p-8 ${movieData.backdrop_path ? '-mt-16 sm:-mt-24 lg:-mt-32 relative z-10' : hasPrevious ? 'pt-14 sm:pt-16' : ''}`}>
        <MovieHeroSection
          movie={movieData}
          director={director}
          trailer={trailer}
          showTrailer={showTrailer}
          onToggleTrailer={handleToggleTrailer}
          onSelectDirector={navigateToPerson}
          isRatingNotesVisible={isRatingNotesVisible}
          onToggleRatingNotes={handleToggleRatingNotes}
          isWatchedMovie={isWatched(movieData.id)}
          isBudgetVisible={isBudgetVisible}
          onToggleBudget={handleToggleBudget}
          hasWhereToWatch={hasWhereToWatch}
          isWhereToWatchVisible={isWhereToWatchVisible}
          onToggleWhereToWatch={handleToggleWhereToWatch}
          hasCast={hasCast}
          isCastVisible={isCastVisible}
          onToggleCast={handleToggleCast}
          hasRecommendations={hasRecommendations}
          isRecommendationsVisible={isRecommendationsVisible}
          onToggleRecommendations={handleToggleRecommendations}
        >
          <KeyFactsSection
            movie={movieData}
            isBudgetVisible={isBudgetVisible}
            onToggleBudget={handleToggleBudget}
          />
          <RatingNotesSection
            movie={movieData}
            isVisible={isRatingNotesVisible}
            onToggleVisibility={handleToggleRatingNotes}
          />
        </MovieHeroSection>

        {/* Embedded Trailer Section */}
        {showTrailer && trailer && (
          <div ref={trailerSectionRef}>
            <MovieTrailerSection
              movieTitle={movieData.title}
              trailer={trailer}
              onClose={() => setShowTrailer(false)}
            />
          </div>
        )}

        {/* Where to Watch (Streaming & Buy/Rent Providers) */}
        <WhereToWatchSection
          movie={movieData}
          isVisible={isWhereToWatchVisible}
          onToggleVisibility={handleToggleWhereToWatch}
        />

        {/* Top Cast Section */}
        <MovieCastSection
          cast={topCast}
          onSelectPerson={navigateToPerson}
          isVisible={isCastVisible}
          onToggleVisibility={handleToggleCast}
        />

        {/* More Like This (Recommendations) Section */}
        <MovieRecommendationsSection
          recommendations={recommendations}
          onSelectMovie={handleSelectMovie}
          isVisible={isRecommendationsVisible}
          onToggleVisibility={handleToggleRecommendations}
        />
      </div>
    </motion.div>
  </AnimatePresence>
</div>
  );
}
