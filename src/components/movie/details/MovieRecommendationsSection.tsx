import React from 'react';
import { Film, Sparkles, Star, X } from 'lucide-react';
import type { RecommendedMovie } from '../../../types';
import { imageConfig } from '../../../config/imageConfig';
import { formatYear } from '../../../utils/helpers';

export interface MovieRecommendationsSectionProps {
  recommendations: RecommendedMovie[];
  onSelectMovie: (movieId: number, title?: string) => void;
  isLoading?: boolean;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export function MovieRecommendationsSection({
  recommendations,
  onSelectMovie,
  isLoading = false,
  isVisible = true,
  onToggleVisibility,
}: MovieRecommendationsSectionProps) {
  if (!recommendations || recommendations.length === 0) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <section aria-labelledby="recommendations-heading" className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 id="recommendations-heading" className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>More Like This</span>
        </h3>
        {onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title="Hide recommended movies"
            aria-label="Hide recommended movies"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-3 sm:gap-4">
        {recommendations.map((rec) => (
          <button
            key={rec.id}
            type="button"
            onClick={() => onSelectMovie(rec.id, rec.title)}
            aria-label={`View details for recommended movie ${rec.title}`}
            className="group flex flex-col rounded-xl border border-border bg-card/60 overflow-hidden text-left transition-all hover:bg-card hover:border-primary hover:shadow-lg hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring outline-none"
          >
            <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
              {rec.poster_path ? (
                <img
                  src={`${imageConfig.URL_IMAGE_POSTER_w342}${rec.poster_path}`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
                  <Film className="h-8 w-8 opacity-40" aria-hidden="true" />
                </div>
              )}
              {rec.vote_average > 0 && (
                <div className="absolute top-1.5 right-1.5 rounded-md bg-black/80 px-1.5 py-0.5 text-[11px] font-bold text-amber-400 flex items-center gap-1 backdrop-blur-sm border border-white/10">
                  <Star className="h-3 w-3 fill-amber-400" aria-hidden="true" />
                  <span>{rec.vote_average.toFixed(1)}</span>
                </div>
              )}
            </div>
            <div className="p-2.5 flex flex-col justify-between flex-1">
              <p className="line-clamp-1 text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                {rec.title}
              </p>
              {rec.release_date && (
                <p className="text-[11px] font-semibold text-muted-foreground mt-0.5">
                  {formatYear(rec.release_date)}
                </p>
              )}
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
