import { useState } from 'react';
import { ExternalLink, Calendar, Clock, Globe, Star, Play, X, User, Film, Sparkles } from 'lucide-react';
import { useSearchContext } from '../../contexts/SearchContext';
import { imageConfig } from '../../config/imageConfig';
import { getMovieById } from '../../utils/apiUtils';
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
  const { movieData, updateSelectedMovieId, updateMovieData } = useSearchContext();
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);

  const {
    URL_IMAGE_BACKDROP_w1280,
    URL_IMAGE_POSTER_w342,
    URL_IMAGE_POSTER_w500,
    URL_IMAGE_POSTER_w780,
    URL_IMAGE_PROFILE_w185
  } = imageConfig;

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

  const handleSelectMovie = async (newMovieId: number) => {
    try {
      setIsLoadingRelated(true);
      setShowTrailer(false);
      const data = await getMovieById(newMovieId);
      updateSelectedMovieId(newMovieId);
      updateMovieData(data);
      setIsLoadingRelated(false);

      // Smoothly scroll back to the top of the dialog
      const scrollContainer = document.querySelector('[role="dialog"] .overflow-y-auto');
      if (scrollContainer) {
        scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setIsLoadingRelated(false);
      console.error('Error switching recommended movie:', err);
    }
  };

  return (
    <div className="relative flex flex-col overflow-x-hidden text-foreground">
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
      <div className={`p-4 sm:p-6 lg:p-8 ${movieData.backdrop_path ? '-mt-16 sm:-mt-24 lg:-mt-32 relative z-10' : ''}`}>
        <div className="flex flex-col sm:flex-row gap-5 lg:gap-8 items-start">
          {/* Movie Poster */}
          <div className="w-28 sm:w-44 lg:w-56 shrink-0 rounded-xl overflow-hidden shadow-2xl border-2 border-border bg-muted">
            {movieData.poster_path ? (
              <img
                src={`${URL_IMAGE_POSTER_w500}${movieData.poster_path}`}
                srcSet={`${URL_IMAGE_POSTER_w500}${movieData.poster_path} 1x, ${URL_IMAGE_POSTER_w780}${movieData.poster_path} 2x`}
                alt={`Poster for ${movieData.title}`}
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
                {movieData.genres?.map((genre) => (
                  <Badge key={genre.name} variant="secondary" className="font-semibold text-xs border border-border">
                    {genre.name}
                  </Badge>
                ))}
              </div>

              {/* Title & Year */}
              <DialogTitle className="text-xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-foreground break-words">
                {movieData.title}{' '}
                {movieData.release_date && (
                  <span className="text-muted-foreground font-normal text-lg sm:text-2xl">
                    ({formatYear(movieData.release_date)})
                  </span>
                )}
              </DialogTitle>

              {/* Tagline */}
              {movieData.tagline && (
                <p className="mt-1 text-sm sm:text-base font-medium text-primary italic">
                  "{movieData.tagline}"
                </p>
              )}
            </div>

            {/* Metadata Tags */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-5 text-xs sm:text-sm font-semibold text-muted-foreground">
              {movieData.vote_average > 0 && (
                <div className="flex items-center gap-1 text-amber-500 font-bold" aria-label={`Rating: ${movieData.vote_average.toFixed(1)} out of 10`}>
                  <Star className="h-4 w-4 fill-amber-500" aria-hidden="true" />
                  <span>{movieData.vote_average.toFixed(1)} / 10</span>
                </div>
              )}
              {movieData.runtime > 0 && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" aria-hidden="true" />
                  <span>{formatMinutesToTime(movieData.runtime)}</span>
                </div>
              )}
              {movieData.release_date && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                  <span>{formatDate(movieData.release_date)}</span>
                </div>
              )}
              {director && (
                <div className="flex items-center gap-1 text-foreground">
                  <span className="text-muted-foreground font-normal">Director:</span>
                  <span>{director.name}</span>
                </div>
              )}
            </div>

            {/* Overview / Synopsis */}
            {movieData.overview && (
              <DialogDescription className="text-sm sm:text-base leading-relaxed text-foreground font-normal">
                {movieData.overview}
              </DialogDescription>
            )}

            {/* Action Buttons: Trailer, IMDb, Website */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {trailer && (
                <Button
                  onClick={() => setShowTrailer((prev) => !prev)}
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

        {/* Embedded Trailer Section */}
        {showTrailer && trailer && (
          <section id="trailer-video-section" aria-label="Official Trailer Video" className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Play className="h-4 w-4 text-primary fill-current" aria-hidden="true" />
                {trailer.name || 'Official Trailer'}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowTrailer(false)}
                className="h-8 text-xs font-semibold"
                aria-label="Close trailer"
              >
                Close
              </Button>
            </div>
            <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-border bg-black">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`}
                title={`${movieData.title} Trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </section>
        )}

        {/* Top Cast Section */}
        {topCast.length > 0 && (
          <section aria-labelledby="cast-heading" className="mt-8 pt-6 border-t border-border">
            <h3 id="cast-heading" className="text-base sm:text-lg font-bold text-foreground mb-4">
              Top Cast
            </h3>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 sm:gap-4">
              {topCast.map((actor) => (
                <div
                  key={actor.id}
                  className="flex flex-col rounded-xl border border-border/70 bg-card/60 p-2 text-center transition-all hover:bg-card hover:border-border"
                >
                  <div className="mx-auto mb-2 aspect-square w-14 sm:w-16 rounded-full overflow-hidden bg-muted border border-border/80 shrink-0">
                    {actor.profile_path ? (
                      <img
                        src={`${URL_IMAGE_PROFILE_w185}${actor.profile_path}`}
                        alt={actor.name}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-muted-foreground bg-muted">
                        <User className="h-6 w-6 opacity-40" aria-hidden="true" />
                      </div>
                    )}
                  </div>
                  <p className="line-clamp-1 text-xs sm:text-sm font-bold text-foreground">
                    {actor.name}
                  </p>
                  <p className="line-clamp-1 text-xs text-muted-foreground font-medium">
                    {actor.character}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* More Like This (Recommendations) Section */}
        {recommendations.length > 0 && (
          <section aria-labelledby="recommendations-heading" className="mt-8 pt-6 border-t border-border">
            <h3 id="recommendations-heading" className="text-base sm:text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" aria-hidden="true" />
              <span>More Like This</span>
            </h3>
            <div className="grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 md:grid-cols-4 gap-3 sm:gap-4">
              {recommendations.map((rec) => (
                <button
                  key={rec.id}
                  type="button"
                  onClick={() => handleSelectMovie(rec.id)}
                  disabled={isLoadingRelated}
                  aria-label={`View details for recommended movie ${rec.title}`}
                  className="group flex flex-col rounded-xl border border-border bg-card/60 overflow-hidden text-left transition-all hover:bg-card hover:border-primary hover:shadow-lg hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring outline-none"
                >
                  <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
                    {rec.poster_path ? (
                      <img
                        src={`${URL_IMAGE_POSTER_w342}${rec.poster_path}`}
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
        )}
      </div>
    </div>
  );
}
