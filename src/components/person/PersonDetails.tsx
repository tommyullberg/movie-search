import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { PersonDetails as PersonDetailsData } from '../../types';
import { useSearchContext } from '../../contexts/SearchContext';
import { formatDate } from '../../utils/helpers';
import { imageConfig } from '../../config/imageConfig';
import {
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ActionButton } from '../buttons/ActionButton';
import {
  User,
  Calendar,
  MapPin,
  Briefcase,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PersonFilmography } from './PersonFilmography';

interface PersonDetailsProps {
  personData: PersonDetailsData;
  onClose: () => void;
}

export function PersonDetails({ personData }: PersonDetailsProps) {
  const [isBioExpanded, setIsBioExpanded] = useState(false);
  const { detailHistory, navigateToMovie, goBackDetail } = useSearchContext();
  const rootRef = useRef<HTMLDivElement | null>(null);

  // Automatically scroll dialog to top when person changes
  useEffect(() => {
    if (personData?.id && rootRef.current) {
      const scrollContainer = rootRef.current.closest('[data-dialog-scroll="true"]') as HTMLElement | null
        || rootRef.current.closest('.overflow-y-auto') as HTMLElement | null;
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  }, [personData?.id]);

  const {
    URL_IMAGE_PROFILE_h632,
    URL_IMAGE_PROFILE_w185,
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

  const age = personData.birthday ? calculateAge(personData.birthday, personData.deathday) : null;
  const bioIsLong = personData.biography && personData.biography.length > 400;

  return (
    <div ref={rootRef} className="relative flex flex-col overflow-x-hidden text-foreground">
      <AnimatePresence mode="wait">
        <motion.div
          key={personData.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.18, ease: 'easeOut' }}
          className="w-full p-4 sm:p-6 lg:p-8"
        >
          {/* Back button when navigating between detail views */}
          {hasPrevious && previousItem && (
            <div className="mb-4 -mt-1 sm:-mt-2">
              <ActionButton
                type="back"
                targetTitle={previousTitle}
                onBack={goBackDetail}
                className="h-8 border-border bg-card hover:bg-accent shadow-sm"
              />
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

            <ActionButton
              type="share"
              shareParam={{ key: 'person', value: personData.id }}
              shareTitle={personData.name}
              className="text-xs"
            />
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
      <PersonFilmography
        movieCredits={personData.movie_credits}
        onSelectMovie={handleMovieClick}
      />
    </motion.div>
  </AnimatePresence>
</div>
  );
}
