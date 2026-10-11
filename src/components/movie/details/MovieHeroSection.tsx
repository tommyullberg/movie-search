import React from 'react';
import { ExternalLink, Calendar, Clock, Globe, Star, Play, X } from 'lucide-react';
import type { MovieDetails, CrewMember, VideoItem } from '../../../types';
import { imageConfig } from '../../../config/imageConfig';
import { formatDate, formatYear } from '../../../utils/helpers';
import { Badge } from '../../ui/badge';
import { Button } from '../../ui/button';
import { DialogTitle, DialogDescription } from '../../ui/dialog';
import { ActionButton } from '../../buttons/ActionButton';

export interface MovieHeroSectionProps {
  movie: MovieDetails;
  director?: CrewMember;
  trailer?: VideoItem;
  showTrailer: boolean;
  onToggleTrailer: () => void;
  onSelectDirector: (personId: number, name?: string) => void;
  children?: React.ReactNode;
}

const formatMinutesToTime = (minutes: number): string => {
  if (isNaN(minutes) || minutes <= 0) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursStr = hours > 0 ? `${hours}h` : '';
  const minutesStr = remainingMinutes > 0 ? `${remainingMinutes}m` : '';
  return `${hoursStr} ${minutesStr}`.trim();
};

export function MovieHeroSection({
  movie,
  director,
  trailer,
  showTrailer,
  onToggleTrailer,
  onSelectDirector,
  children,
}: MovieHeroSectionProps) {
  const {
    URL_IMAGE_POSTER_w500,
    URL_IMAGE_POSTER_w780,
  } = imageConfig;

  return (
    <div className="flex flex-col sm:flex-row gap-5 lg:gap-8 items-start">
      {/* Movie Poster */}
      <div className="w-28 sm:w-44 lg:w-56 shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-border bg-muted">
        {movie.poster_path ? (
          <img
            src={`${URL_IMAGE_POSTER_w500}${movie.poster_path}`}
            srcSet={`${URL_IMAGE_POSTER_w500}${movie.poster_path} 1x, ${URL_IMAGE_POSTER_w780}${movie.poster_path} 2x`}
            alt={`Poster for ${movie.title}`}
            className="w-full h-auto aspect-[2/3] object-cover"
          />
        ) : (
          <div className="w-full aspect-[2/3] flex items-center justify-center text-muted-foreground bg-muted text-xs sm:text-sm font-semibold p-2 text-center">
            No poster available
          </div>
        )}
      </div>

      {/* Core Info & Actions */}
      <div className="flex-1 min-w-0 space-y-4">
        <div>
          {/* Genre Badges */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-2" role="list" aria-label="Genres">
            {movie.genres?.map((genre) => (
              <Badge key={genre.name} variant="secondary" className="font-semibold text-xs border border-border">
                {genre.name}
              </Badge>
            ))}
          </div>

          {/* Title & Year */}
          <DialogTitle className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground break-words">
            {movie.title}{' '}
            {movie.release_date && (
              <span className="text-muted-foreground font-normal text-lg sm:text-2xl">
                ({formatYear(movie.release_date)})
              </span>
            )}
          </DialogTitle>

          {/* Tagline */}
          {movie.tagline && (
            <p className="mt-1 text-sm sm:text-base font-medium text-primary italic">
              "{movie.tagline}"
            </p>
          )}
        </div>

        {/* Metadata Tags */}
        <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm font-semibold text-muted-foreground">
          {movie.vote_average > 0 && (
            <div className="flex items-center gap-1 text-amber-500 font-bold" aria-label={`Rating: ${movie.vote_average.toFixed(1)} out of 10`}>
              <Star className="h-4 w-4 fill-amber-500" aria-hidden="true" />
              <span>{movie.vote_average.toFixed(1)} / 10</span>
            </div>
          )}
          {movie.runtime > 0 && (
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{formatMinutesToTime(movie.runtime)}</span>
            </div>
          )}
          {movie.release_date && (
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" aria-hidden="true" />
              <span>{formatDate(movie.release_date)}</span>
            </div>
          )}
          {director && (
            <div className="flex items-center gap-1 text-foreground">
              <span className="text-muted-foreground font-normal">Director:</span>
              <button
                type="button"
                onClick={() => onSelectDirector(director.id, director.name)}
                className="font-semibold text-foreground hover:text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-0.5 cursor-pointer"
                aria-label={`View profile for director ${director.name}`}
              >
                {director.name}
              </button>
            </div>
          )}
        </div>

        {/* Overview / Synopsis */}
        {movie.overview && (
          <DialogDescription className="text-sm sm:text-base leading-relaxed text-foreground font-normal">
            {movie.overview}
          </DialogDescription>
        )}

        {/* User Library Actions: Watchlist & Watched on their own dedicated row */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1.5 pb-0.5">
          <ActionButton type="watchlist" movie={movie} />
          <ActionButton type="watched" movie={movie} />
        </div>

        {/* External Links & Media Actions: Trailer, IMDb, Website, Share */}
        <div className="flex flex-wrap items-center gap-2.5">
          {trailer && (
            <Button
              onClick={onToggleTrailer}
              size="sm"
              className="rounded-lg font-semibold shadow-md bg-primary text-primary-foreground hover:bg-primary/90"
              aria-expanded={showTrailer}
              aria-controls="trailer-video-section"
            >
              {showTrailer ? (
                <>
                  <X className="h-3.5 w-3.5 mr-1.5" aria-hidden="true" />
                  Close Trailer
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5 mr-1.5 fill-current" aria-hidden="true" />
                  Watch Trailer
                </>
              )}
            </Button>
          )}

          {movie.imdb_id && (
            <Button variant="outline" size="sm" asChild className="rounded-lg font-semibold border-border">
              <a
                href={`https://www.imdb.com/title/${movie.imdb_id}`}
                target="_blank"
                rel="noreferrer"
                aria-label={`View ${movie.title} on IMDb (opens in new tab)`}
                className="flex items-center gap-1.5"
              >
                <span>IMDb</span>
                <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            </Button>
          )}

          {movie.homepage && (
            <Button variant="outline" size="sm" asChild className="rounded-lg font-semibold border-border">
              <a
                href={movie.homepage}
                target="_blank"
                rel="noreferrer"
                aria-label={`Visit official website for ${movie.title} (opens in new tab)`}
                className="flex items-center gap-1.5"
              >
                <span>Website</span>
                <ExternalLink className="h-3 w-3" aria-hidden="true" />
              </a>
            </Button>
          )}

          <ActionButton type="share" movie={movie} />
        </div>

        {/* Additional child sections (KeyFactsSection, RatingNotesSection) */}
        {children}
      </div>
    </div>
  );
}
