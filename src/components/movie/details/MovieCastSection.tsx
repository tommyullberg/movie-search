import React from 'react';
import { User, Users, X } from 'lucide-react';
import type { CastMember } from '../../../types';
import { imageConfig } from '../../../config/imageConfig';

export interface MovieCastSectionProps {
  cast: CastMember[];
  onSelectPerson: (personId: number, name?: string) => void;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export function MovieCastSection({
  cast,
  onSelectPerson,
  isVisible = true,
  onToggleVisibility,
}: MovieCastSectionProps) {
  if (!cast || cast.length === 0) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  return (
    <section aria-labelledby="cast-heading" className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 id="cast-heading" className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>Top Cast</span>
        </h3>
        {onToggleVisibility && (
          <button
            type="button"
            onClick={onToggleVisibility}
            className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            title="Hide cast members"
            aria-label="Hide cast members"
          >
            <X className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        )}
      </div>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
        {cast.map((actor) => (
          <button
            key={actor.id}
            type="button"
            onClick={() => onSelectPerson(actor.id, actor.name)}
            aria-label={`View profile for ${actor.name}, played ${actor.character}`}
            className="group flex flex-col rounded-xl border border-border/70 bg-card/60 p-2 text-center transition-all hover:bg-card hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <div className="mx-auto mb-2 aspect-square w-14 sm:w-16 rounded-full overflow-hidden bg-muted border border-border/80 shrink-0 group-hover:border-primary transition-colors">
              {actor.profile_path ? (
                <img
                  src={`${imageConfig.URL_IMAGE_PROFILE_w185}${actor.profile_path}`}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
                  <User className="h-6 w-6 opacity-40" aria-hidden="true" />
                </div>
              )}
            </div>
            <p className="line-clamp-1 text-xs sm:text-sm font-bold text-foreground group-hover:text-primary transition-colors">
              {actor.name}
            </p>
            <p className="line-clamp-1 text-xs text-muted-foreground font-medium">
              {actor.character}
            </p>
          </button>
        ))}
      </div>
    </section>
  );
}
