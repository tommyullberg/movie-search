import React, { useState } from 'react';
import { PersonDetailsModel } from '../model/PersonDetailsModel';
import { useSearchContext } from '../contexts/SearchContext';
import { getMovieById } from '../utils/apiUtils';
import { formatDate } from '../utils/helpers';
import { imageConfig } from '../config/imageConfig';
import {
  DialogTitle,
  DialogDescription,
} from './ui/dialog';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import {
  User,
  Calendar,
  MapPin,
  Briefcase,
  Star,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Film,
  ArrowLeft,
  Share2,
  Check,
} from 'lucide-react';

interface PersonDetailsProps {
  personData: PersonDetailsModel;
  onClose: () => void;
}

export function PersonDetails({ personData, onClose }: PersonDetailsProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const { detailHistory, navigateToMovie, goBackDetail } = useSearchContext();

  const {
    URL_IMAGE_PROFILE_h632,
    URL_IMAGE_PROFILE_w185,
    URL_IMAGE_POSTER_w185,
  } = imageConfig;

  const hasPrevious = detailHistory.length > 1;
  const previousItem = hasPrevious ? detailHistory[detailHistory.length - 2] : null;
  const previousTitle = previousItem
    ? previousItem.title || (previousItem.type === 'movie' ? 'Movie' : 'Person')
    : '';

  // Calculate age if birthday is available
  const calculateAge = (birthday: string, deathday: string | null) => {
    const birth = new Date(birthday);
    const end = deathday ? new Date(deathday) : new Date();
    let age = end.getFullYear() - birth.getFullYear();
    const m = end.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // Open a movie details modal directly from filmography
  const handleMovieClick = async (movieId: number, title?: string) => {
    try {
      await navigateToMovie(movieId, title);
    } catch (err) {
      console.error('Error opening movie from filmography:', err);
    }
  };

  const handleShare = async () => {
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('person', String(personData.id));
      url.searchParams.delete('movie');
      if (navigator.clipboard) {
        await navigator.clipboard.writeText(url.toString());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
      }
    } catch (err) {
      console.error('Error copying person share link:', err);
    }
  };

  // Process & deduplicate filmography credits (cast + directing/crew), sorted newest first
  const castCredits = personData.movie_credits?.cast || [];
  const crewCredits = personData.movie_credits?.crew || [];

  // Combine and deduplicate
  const seenMovieIds = new Set<number>();
  const allCredits: Array<{
    id: number;
    title: string;
    role: string;
    poster_path: string | null;
    release_date: string;
    vote_average: number;
  }> = [];

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

  const age = personData.birthday ? calculateAge(personData.birthday, personData.deathday) : null;
  const bioIsLong = personData.biography && personData.biography.length > 400;

  return (
    <div className="relative flex flex-col overflow-x-hidden text-foreground p-4 sm:p-6 lg:p-8">
      {/* Back button when navigating between detail views */}
      {hasPrevious && previousItem && (
        <div className="mb-4 -mt-1 sm:-mt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => goBackDetail()}
            className="inline-flex items-center gap-1.5 h-8 text-xs font-semibold rounded-full border-border bg-card hover:bg-accent shadow-sm"
            aria-label={`Back to ${previousTitle}`}
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="truncate max-w-[180px] sm:max-w-[320px]">Back to {previousTitle}</span>
          </Button>
        </div>
      )}

      {/* Header Info Area */}
      <div className="flex flex-col sm:flex-row gap-5 lg:gap-7 items-start pb-6 border-b border-border">
        {/* Profile Image */}
        <div className="w-28 sm:w-44 shrink-0 rounded-xl overflow-hidden shadow-xl border-2 border-border bg-muted aspect-[2/3]">
          {personData.profile_path ? (
            <img
              src={`${URL_IMAGE_PROFILE_h632}${personData.profile_path}`}
              srcSet={`${URL_IMAGE_PROFILE_w185}${personData.profile_path} 1x, ${URL_IMAGE_PROFILE_h632}${personData.profile_path} 2x`}
              alt={`Portrait of ${personData.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted p-2 text-center" aria-hidden="true">
              <User className="h-12 w-12 opacity-40 mb-1" />
              <span className="text-xs font-semibold">No photo</span>
            </div>
          )}
        </div>

        {/* Core Profile Info */}
        <div className="flex-1 min-w-0 space-y-3">
          <div>
            {personData.known_for_department && (
              <Badge variant="secondary" className="mb-2 font-semibold text-xs border border-border">
                {personData.known_for_department}
              </Badge>
            )}
            <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
              {personData.name}
            </DialogTitle>
          </div>

          {/* Quick Facts List */}
          <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs sm:text-sm text-muted-foreground font-medium">
            {personData.birthday && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>
                  {formatDate(personData.birthday)}
                  {age !== null && (
                    <span className="text-foreground font-semibold"> ({age} years old{personData.deathday ? ' at passing' : ''})</span>
                  )}
                </span>
              </div>
            )}

            {personData.place_of_birth && (
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{personData.place_of_birth}</span>
              </div>
            )}

            {personData.known_for_department && (
              <div className="flex items-center gap-1.5">
                <Briefcase className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                <span>Known for {personData.known_for_department}</span>
              </div>
            )}
          </div>

          {/* External Links & Share */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            {personData.imdb_id && (
              <Button variant="outline" size="sm" asChild className="rounded-lg font-semibold border-border">
                <a
                  href={`https://www.imdb.com/name/${personData.imdb_id}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`View ${personData.name} on IMDb (opens in new tab)`}
                  className="flex items-center gap-1.5 text-xs"
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>IMDb Profile</span>
                </a>
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              aria-label={`Share profile for ${personData.name}`}
              className="rounded-lg font-semibold border-border text-xs transition-all"
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
          </div>
        </div>
      </div>

      {/* Biography Section */}
      {personData.biography ? (
        <section aria-labelledby="person-bio-heading" className="py-5 border-b border-border">
          <h3 id="person-bio-heading" className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
            Biography
          </h3>
          <DialogDescription className="text-sm sm:text-base leading-relaxed text-foreground font-normal whitespace-pre-line">
            {bioIsLong && !isBioExpanded
              ? `${personData.biography.slice(0, 380)}...`
              : personData.biography}
          </DialogDescription>
          {bioIsLong && (
            <button
              type="button"
              onClick={() => setIsBioExpanded(!isBioExpanded)}
              className="mt-2 text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              {isBioExpanded ? (
                <>
                  Show less <ChevronUp className="h-3.5 w-3.5" />
                </>
              ) : (
                <>
                  Read full biography <ChevronDown className="h-3.5 w-3.5" />
                </>
              )}
            </button>
          )}
        </section>
      ) : null}

      {/* Filmography Section */}
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
                onClick={() => handleMovieClick(movie.id, movie.title)}
                className="group flex flex-col text-left rounded-xl border border-border bg-card p-2 hover:border-primary transition-all duration-200 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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
    </div>
  );
}
