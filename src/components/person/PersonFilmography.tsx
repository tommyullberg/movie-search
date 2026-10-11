import React from 'react';
import { Film, Star } from 'lucide-react';
import type { PersonMovieCredits } from '../../types';
import { imageConfig } from '../../config/imageConfig';

export interface PersonFilmographyProps {
  movieCredits: PersonMovieCredits;
  onSelectMovie: (movieId: number, title?: string) => void;
}

interface ProcessedCredit {
  id: number;
  title: string;
  role: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

export function PersonFilmography({
  movieCredits,
  onSelectMovie,
}: PersonFilmographyProps) {
  const { URL_IMAGE_POSTER_w185 } = imageConfig;

  // Process & deduplicate filmography credits (cast + directing/crew), sorted newest first
  const castCredits = movieCredits?.cast || [];
  const crewCredits = movieCredits?.crew || [];

  const seenMovieIds = new Set<number>();
  const allCredits: ProcessedCredit[] = [];

  for (const c of castCredits) {
    if (c.id && !seenMovieIds.has(c.id)) {
      seenMovieIds.add(c.id);
      allCredits.push({
        id: c.id,
        title: c.title || c.name || 'Untitled',
        role: c.character ? `as ${c.character}` : 'Cast',
        poster_path: c.poster_path,
        release_date: c.release_date || c.first_air_date || '',
        vote_average: c.vote_average || 0,
      });
    }
  }

  for (const c of crewCredits) {
    if (c.id && !seenMovieIds.has(c.id)) {
      seenMovieIds.add(c.id);
      allCredits.push({
        id: c.id,
        title: c.title || c.name || 'Untitled',
        role: c.job || c.department || 'Crew',
        poster_path: c.poster_path,
        release_date: c.release_date || c.first_air_date || '',
        vote_average: c.vote_average || 0,
      });
    }
  }

  // Sort by release date descending (newest first, then unreleased/unknown)
  allCredits.sort((a, b) => {
    if (!a.release_date) return 1;
    if (!b.release_date) return -1;
    return new Date(b.release_date).getTime() - new Date(a.release_date).getTime();
  });

  return (
    <section aria-labelledby="filmography-heading" className="pt-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Film className="h-5 w-5 text-primary" aria-hidden="true" />
          <h3 id="filmography-heading" className="text-base sm:text-lg font-bold text-foreground">
            Filmography ({allCredits.length} titles)
          </h3>
        </div>
        <span className="text-xs text-muted-foreground">Click a title to view details</span>
      </div>

      {allCredits.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 max-h-[500px] overflow-y-auto pr-1">
          {allCredits.map((movie) => (
            <button
              key={`${movie.id}-${movie.role}`}
              type="button"
              onClick={() => onSelectMovie(movie.id, movie.title)}
              className="group flex flex-col text-left rounded-xl border border-border bg-card p-2 hover:border-primary transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
            >
              {/* Movie Poster */}
              <div className="relative aspect-[2/3] w-full rounded-lg overflow-hidden bg-muted mb-2">
                {movie.poster_path ? (
                  <img
                    src={`${URL_IMAGE_POSTER_w185}${movie.poster_path}`}
                    alt=""
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground" aria-hidden="true">
                    <Film className="h-8 w-8 opacity-40" />
                  </div>
                )}
                {movie.vote_average > 0 && (
                  <div className="absolute top-1.5 right-1.5 bg-black/80 backdrop-blur-xs px-1.5 py-0.5 rounded text-[10px] font-bold text-amber-400 flex items-center gap-0.5">
                    <Star className="h-2.5 w-2.5 fill-current" />
                    <span>{movie.vote_average.toFixed(1)}</span>
                  </div>
                )}
              </div>

              {/* Movie Details */}
              <div className="flex-1 flex flex-col justify-between">
                <h4 className="line-clamp-2 text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                  {movie.title}
                </h4>
                <div className="mt-1">
                  <p className="line-clamp-1 text-[11px] text-muted-foreground font-medium">
                    {movie.role}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 font-semibold mt-0.5">
                    {movie.release_date ? movie.release_date.slice(0, 4) : 'TBA'}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No credits available for this person.</p>
      )}
    </section>
  );
}
