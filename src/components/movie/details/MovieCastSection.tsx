import React from 'react';
import { User } from 'lucide-react';
import type { CastMember } from '../../../types';
import { imageConfig } from '../../../config/imageConfig';

export interface MovieCastSectionProps {
  cast: CastMember[];
  onSelectPerson: (personId: number, name?: string) => void;
}

export function MovieCastSection({ cast, onSelectPerson }: MovieCastSectionProps) {
  if (!cast || cast.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="cast-heading" className="mt-8 pt-6 border-t border-border">
      <h3 id="cast-heading" className="text-base sm:text-lg font-bold text-foreground mb-4">
        Top Cast
      </h3>
      <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
        {cast.map((actor) => (
          <button
            key={actor.id}
            type="button"
            onClick={() => onSelectPerson(actor.id, actor.name)}
            aria-label={`View profile for ${actor.name}, played ${actor.character}`}
            className="group flex flex-col rounded-xl border border-border/70 bg-card/60 p-2 text-center transition-all hover:bg-card hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
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
