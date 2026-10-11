import { ExternalLink, Calendar, Clock, Globe, Star } from 'lucide-react';
import { useSearchContext } from '../../contexts/SearchContext';
import { imageConfig } from '../../config/imageConfig';
import { formatDate, formatYear } from '../../utils/helpers';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { DialogTitle, DialogDescription } from '../ui/dialog';

const formatMinutesToTime = (minutes: number): string => {
  if (isNaN(minutes) || minutes <= 0) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursStr = hours > 0 ? `${hours}h` : '';
  const minutesStr = remainingMinutes > 0 ? `${remainingMinutes}m` : '';
  return `${hoursStr} ${minutesStr}`.trim();
};

export function MovieDetails() {
  const { movieData } = useSearchContext();
  const {
    URL_IMAGE_BACKDROP_w1280,
    URL_IMAGE_POSTER_w500,
    URL_IMAGE_POSTER_w780
  } = imageConfig;

  if (!movieData) return null;

  return (
    <div className="relative flex flex-col overflow-hidden text-foreground">
      {/* Backdrop Header with strong contrast gradient */}
      {movieData.backdrop_path && (
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-background">
          <img
            src={`${URL_IMAGE_BACKDROP_w1280}${movieData.backdrop_path}`}
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/80 to-transparent" />
        </div>
      )}

      {/* Main Content Area */}
      <div className={`p-6 ${movieData.backdrop_path ? '-mt-20 sm:-mt-28 relative z-10' : ''}`}>
        <div className="flex flex-col sm:flex-row gap-6 items-start">
          {/* Poster */}
          <div className="w-36 sm:w-48 shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-border bg-muted">
            {movieData.poster_path ? (
              <img
                src={`${URL_IMAGE_POSTER_w500}${movieData.poster_path}`}
                srcSet={`${URL_IMAGE_POSTER_w500}${movieData.poster_path} 1x, ${URL_IMAGE_POSTER_w780}${movieData.poster_path} 2x`}
                alt={`Poster for ${movieData.title}`}
                className="w-full h-auto aspect-[2/3] object-cover"
              />
            ) : (
              <div className="w-full aspect-[2/3] flex items-center justify-center text-muted-foreground bg-muted text-sm font-semibold">
                No poster available
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2" role="list" aria-label="Genres">
                {movieData.genres?.map((genre) => (
                  <Badge key={genre.name} variant="secondary" className="font-semibold text-xs border border-border">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              <DialogTitle className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {movieData.title}{' '}
                {movieData.release_date && (
                  <span className="text-muted-foreground font-normal">
                    ({formatYear(movieData.release_date)})
                  </span>
                )}
              </DialogTitle>
            </div>

            {/* Meta info tags */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-muted-foreground">
              {movieData.vote_average > 0 && (
                <div className="flex items-center gap-1.5 text-amber-500 font-bold" aria-label={`Rating: ${movieData.vote_average.toFixed(1)} out of 10`}>
                  <Star className="h-4 w-4 fill-amber-500" aria-hidden="true" />
                  <span>{movieData.vote_average.toFixed(1)} / 10</span>
                </div>
              )}
              {movieData.runtime > 0 && (
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{formatMinutesToTime(movieData.runtime)}</span>
                </div>
              )}
              {movieData.release_date && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>{formatDate(movieData.release_date)}</span>
                </div>
              )}
            </div>

            {/* Overview */}
            {movieData.overview && (
              <DialogDescription className="text-sm sm:text-base leading-relaxed text-foreground font-normal">
                {movieData.overview}
              </DialogDescription>
            )}

            {/* External Links */}
            <div className="flex flex-wrap gap-3 pt-2">
              {movieData.imdb_id && (
                <Button variant="outline" size="sm" asChild className="rounded-lg font-semibold border-border">
                  <a
                    href={`https://www.imdb.com/title/${movieData.imdb_id}`}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`View ${movieData.title} on IMDb (opens in new tab)`}
                    className="flex items-center gap-1.5"
                  >
                    <span>IMDb</span>
                    <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  </a>
                </Button>
              )}
              {movieData.homepage && (
                <Button variant="outline" size="sm" asChild className="rounded-lg font-semibold border-border">
                  <a
                    href={movieData.homepage}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={`Visit official website for ${movieData.title} (opens in new tab)`}
                    className="flex items-center gap-1.5"
                  >
                    <Globe className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>Website</span>
                    <ExternalLink className="h-3 w-3" aria-hidden="true" />
                  </a>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
