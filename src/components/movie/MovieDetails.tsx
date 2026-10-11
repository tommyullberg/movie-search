import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useSearchContext } from '../../contexts/SearchContext';
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

export function MovieDetails() {
  const {
    movieData,
    detailHistory,
    navigateToMovie,
    navigateToPerson,
    goBackDetail,
  } = useSearchContext();
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

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
    try {
      setIsLoadingRelated(true);
      setShowTrailer(false);
      await navigateToMovie(newMovieId, title);
      setIsLoadingRelated(false);
    } catch {
      setIsLoadingRelated(false);
    }
  };

  return (
    <div className="relative overflow-hidden bg-card text-card-foreground">
      {/* Back button (Only rendered when navigating deeper from another detail) */}
      {hasPrevious && (
        <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-20">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={goBackDetail}
            className="flex items-center gap-1.5 h-8 px-2.5 text-xs font-semibold rounded-lg bg-background/80 hover:bg-background backdrop-blur-md border-border shadow-sm text-foreground transition-all cursor-pointer"
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
          onToggleTrailer={() => setShowTrailer((prev) => !prev)}
          onSelectDirector={navigateToPerson}
        >
          <KeyFactsSection movie={movieData} />
          <RatingNotesSection movie={movieData} />
        </MovieHeroSection>

        {/* Embedded Trailer Section */}
        {showTrailer && trailer && (
          <MovieTrailerSection
            movieTitle={movieData.title}
            trailer={trailer}
            onClose={() => setShowTrailer(false)}
          />
        )}

        {/* Where to Watch (Streaming & Buy/Rent Providers) */}
        <WhereToWatchSection movie={movieData} />

        {/* Top Cast Section */}
        <MovieCastSection
          cast={topCast}
          onSelectPerson={navigateToPerson}
        />

        {/* More Like This (Recommendations) Section */}
        <MovieRecommendationsSection
          recommendations={recommendations}
          onSelectMovie={handleSelectMovie}
          isLoading={isLoadingRelated}
        />
      </div>
    </div>
  );
}
