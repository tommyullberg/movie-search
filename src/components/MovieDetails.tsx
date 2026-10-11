import React, { useState } from 'react';
import { ExternalLink, Calendar, Clock, Globe, Star, Play, X, User, Film, Sparkles, Tv, Bookmark, ArrowLeft, Share2, Check, Eye, MessageSquare, Edit3, Trash2 } from 'lucide-react';
import { useSearchContext } from '../contexts/SearchContext';
import { useWatchlist } from '../contexts/WatchlistContext';
import { imageConfig } from '../config/imageConfig';
import { formatDate, formatYear } from '../utils/helpers';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { DialogTitle, DialogDescription } from './ui/dialog';
import { ActionButton } from './buttons/ActionButton';

const formatMinutesToTime = (minutes: number): string => {
  if (isNaN(minutes) || minutes <= 0) return '';
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  const hoursStr = hours > 0 ? `${hours}h` : '';
  const minutesStr = remainingMinutes > 0 ? `${remainingMinutes}m` : '';
  return `${hoursStr} ${minutesStr}`.trim();
};

const formatCurrency = (amount: number): string => {
  if (!amount || amount <= 0) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function MovieDetails() {
  const {
    movieData,
    detailHistory,
    navigateToMovie,
    navigateToPerson,
    goBackDetail,
  } = useSearchContext();
  const { isInWatchlist, toggleWatchlist, isWatched, toggleWatched, getReview, saveReview, deleteReview } = useWatchlist();
  const [showTrailer, setShowTrailer] = useState(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [tempNotes, setTempNotes] = useState('');

  const isSaved = movieData ? isInWatchlist(movieData.id) : false;
  const isWatchedMovie = movieData ? isWatched(movieData.id) : false;
  const currentReview = movieData ? getReview(movieData.id) : undefined;

  const {
    URL_IMAGE_BACKDROP_w1280,
    URL_IMAGE_POSTER_w342,
    URL_IMAGE_POSTER_w500,
    URL_IMAGE_POSTER_w780,
    URL_IMAGE_PROFILE_w185,
    URL_IMAGE_LOGO_w92
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

  // Financial and Production details
  const formattedBudget = formatCurrency(movieData.budget);
  const formattedRevenue = formatCurrency(movieData.revenue);
  const productionNames = movieData.production_companies?.slice(0, 3).map((c) => c.name).join(', ');

  // Extract streaming providers (prefer Sweden SE, fallback to US)
  const watchResults = movieData['watch/providers']?.results;
  const seProviders = watchResults?.SE;
  const usProviders = watchResults?.US;

  const hasSeContent = !!(
    seProviders?.flatrate?.length ||
    seProviders?.free?.length ||
    seProviders?.ads?.length ||
    seProviders?.rent?.length ||
    seProviders?.buy?.length
  );

  const activeCountry = hasSeContent ? 'Sweden' : 'US';
  const activeData = hasSeContent ? seProviders : usProviders;

  const freeStreamingServices = activeData?.free || [];
  const subscriptionServices = activeData?.flatrate || [];
  const adsServices = activeData?.ads || [];

  const streamServices = Array.from(
    new Map(
      [...subscriptionServices, ...freeStreamingServices, ...adsServices].map((p) => [p.provider_id, p])
    ).values()
  );

  const rentServices = activeData?.rent || [];
  const buyServices = activeData?.buy || [];

  const rentBuyServices = Array.from(
    new Map([...rentServices, ...buyServices].map((p) => [p.provider_id, p])).values()
  );

  const hasStreaming = streamServices.length > 0;
  const hasRentBuy = rentBuyServices.length > 0;

  // Determine smart section heading
  const whereToWatchHeading = hasStreaming && !hasRentBuy
    ? (freeStreamingServices.length > 0 && subscriptionServices.length === 0
        ? `Available for free streaming in ${activeCountry}`
        : `Available to stream in ${activeCountry}`)
    : !hasStreaming && hasRentBuy
    ? `Available for rent & buy in ${activeCountry}`
    : `Where to Watch in ${activeCountry}`;

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
      {/* Back button when navigating between detail views */}
      {hasPrevious && previousItem && (
        <ActionButton
          type="back"
          targetTitle={previousTitle}
          onBack={goBackDetail}
          className="fixed sm:absolute left-3 top-3 z-50"
        />
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
                  <button
                    type="button"
                    onClick={() => navigateToPerson(director.id, director.name)}
                    className="font-semibold text-foreground hover:text-primary hover:underline transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded px-0.5 cursor-pointer"
                    aria-label={`View profile for director ${director.name}`}
                  >
                    {director.name}
                  </button>
                </div>
              )}
            </div>

            {/* Overview / Synopsis */}
            {movieData.overview && (
              <DialogDescription className="text-sm sm:text-base leading-relaxed text-foreground font-normal">
                {movieData.overview}
              </DialogDescription>
            )}

            {/* User Library Actions: Watchlist & Watched on their own dedicated row */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1.5 pb-0.5">
              <ActionButton type="watchlist" movie={movieData} />
              <ActionButton type="watched" movie={movieData} />
            </div>

            {/* External Links & Media Actions: Trailer, IMDb, Website, Share */}
            <div className="flex flex-wrap items-center gap-2.5">
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

              <ActionButton type="share" movie={movieData} />
            </div>

            {/* Key Facts & Financials Box */}
            {(formattedBudget || formattedRevenue || movieData.status || productionNames) && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 rounded-xl border border-border bg-card/60 p-3 sm:p-3.5 text-xs">
                {movieData.status && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
                    <p className="font-bold text-foreground mt-0.5">{movieData.status}</p>
                  </div>
                )}
                {formattedBudget && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Budget</p>
                    <p className="font-bold text-foreground mt-0.5">{formattedBudget}</p>
                  </div>
                )}
                {formattedRevenue && (
                  <div>
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Box Office</p>
                    <p className="font-bold text-foreground mt-0.5">{formattedRevenue}</p>
                  </div>
                )}
                {productionNames && (
                  <div className="col-span-2 sm:col-span-1">
                    <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Production</p>
                    <p className="line-clamp-1 font-bold text-foreground mt-0.5" title={productionNames}>
                      {productionNames}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* My Rating & Personal Notes (Only for Watched Movies) */}
            {isWatchedMovie && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 sm:p-4 text-xs transition-all">
                <div className="flex items-center justify-between pb-2 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                    <span className="font-bold text-sm text-foreground">My Rating & Notes</span>
                  </div>
                  {currentReview?.rating && (
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 border border-amber-300/80 dark:border-amber-700/60">
                      {currentReview.rating} / 10
                    </span>
                  )}
                </div>

                {/* Rating 1-10 selector buttons */}
                <div className="mt-3">
                  <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                    Your rating (1 to 10):
                  </p>
                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5" role="radiogroup" aria-label="Personal rating 1 to 10">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => {
                      const isSelected = currentReview?.rating === star;
                      return (
                        <button
                          key={star}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              saveReview(movieData.id, { rating: undefined });
                            } else {
                              saveReview(movieData.id, { rating: star });
                            }
                          }}
                          aria-label={`Rate ${star} out of 10`}
                          aria-checked={isSelected}
                          role="radio"
                          className={`h-7 w-7 sm:h-8 sm:w-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                            isSelected
                              ? 'bg-amber-500 text-black font-extrabold shadow-sm scale-105'
                              : 'bg-card border border-border text-foreground hover:border-amber-500 hover:text-amber-500'
                          }`}
                        >
                          {star}
                        </button>
                      );
                    })}
                    {currentReview?.rating && (
                      <button
                        type="button"
                        onClick={() => saveReview(movieData.id, { rating: undefined })}
                        className="ml-1 text-[11px] text-muted-foreground hover:text-destructive transition-colors font-medium cursor-pointer"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>

                {/* Personal Notes */}
                <div className="mt-3 pt-2.5 border-t border-border/50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-semibold text-muted-foreground flex items-center gap-1.5">
                      <MessageSquare className="h-3 w-3" />
                      Personal review or notes:
                    </span>
                    {!isEditingNotes && currentReview?.notes && (
                      <button
                        type="button"
                        onClick={() => {
                          setTempNotes(currentReview?.notes || '');
                          setIsEditingNotes(true);
                        }}
                        className="text-[11px] text-muted-foreground hover:text-foreground flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="h-3 w-3" />
                        Edit
                      </button>
                    )}
                  </div>

                  {isEditingNotes ? (
                    <div className="space-y-2 mt-1.5">
                      <textarea
                        value={tempNotes}
                        onChange={(e) => setTempNotes(e.target.value)}
                        placeholder="Write your personal thoughts, memorable scenes, or review..."
                        rows={3}
                        className="w-full p-2.5 rounded-lg border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary resize-y"
                      />
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setIsEditingNotes(false);
                            setTempNotes('');
                          }}
                          className="h-7 text-xs"
                        >
                          Cancel
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            saveReview(movieData.id, { notes: tempNotes.trim() });
                            setIsEditingNotes(false);
                          }}
                          className="h-7 text-xs font-bold"
                        >
                          Save Notes
                        </Button>
                      </div>
                    </div>
                  ) : currentReview?.notes ? (
                    <p className="text-xs text-foreground bg-background/60 p-2.5 rounded-lg border border-border/60 whitespace-pre-wrap leading-relaxed mt-1">
                      {currentReview.notes}
                    </p>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setTempNotes('');
                        setIsEditingNotes(true);
                      }}
                      className="text-xs text-muted-foreground hover:text-foreground underline cursor-pointer mt-0.5 inline-block"
                    >
                      + Add a personal note or review
                    </button>
                  )}
                </div>
              </div>
            )}
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

        {/* Where to Watch (Streaming & Buy/Rent Providers) */}
        {(hasStreaming || hasRentBuy) && (
          <section aria-labelledby="providers-heading" className="mt-8 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h3 id="providers-heading" className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                <Tv className="h-4 w-4 text-primary" aria-hidden="true" />
                <span>{whereToWatchHeading}</span>
              </h3>
              {activeData?.link && (
                <a
                  href={activeData.link}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-muted-foreground hover:text-foreground underline flex items-center gap-1"
                >
                  <span>JustWatch</span>
                  <ExternalLink className="h-3 w-3" aria-hidden="true" />
                </a>
              )}
            </div>

            {/* Streaming Services (Subscription / Free) */}
            {hasStreaming && (
              <div className="mb-4">
                {hasRentBuy && (
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    {freeStreamingServices.length > 0 && subscriptionServices.length === 0
                      ? `Free streaming in ${activeCountry}:`
                      : `Stream in ${activeCountry}:`}
                  </p>
                )}
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  {streamServices.map((provider) => (
                    <div
                      key={provider.provider_id}
                      title={provider.provider_name}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-card/80 px-2.5 py-1.5 shadow-sm hover:border-foreground/30 transition-all"
                    >
                      <img
                        src={`${URL_IMAGE_LOGO_w92}${provider.logo_path}`}
                        alt=""
                        aria-hidden="true"
                        className="h-7 w-7 rounded-lg object-cover shadow-sm"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {provider.provider_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rent or Buy Option */}
            {hasRentBuy && (
              <div>
                {hasStreaming && (
                  <p className="text-xs font-semibold text-muted-foreground mb-2">
                    Available for rent & buy in {activeCountry}:
                  </p>
                )}
                <div className="flex flex-wrap gap-2.5 sm:gap-3">
                  {rentBuyServices.map((provider) => (
                    <div
                      key={provider.provider_id}
                      title={provider.provider_name}
                      className="flex items-center gap-2.5 rounded-xl border border-border bg-card/80 px-2.5 py-1.5 shadow-sm hover:border-foreground/30 transition-all"
                    >
                      <img
                        src={`${URL_IMAGE_LOGO_w92}${provider.logo_path}`}
                        alt=""
                        aria-hidden="true"
                        className="h-7 w-7 rounded-lg object-cover shadow-sm"
                      />
                      <span className="text-xs sm:text-sm font-semibold text-foreground">
                        {provider.provider_name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                <button
                  key={actor.id}
                  type="button"
                  onClick={() => navigateToPerson(actor.id, actor.name)}
                  aria-label={`View profile for ${actor.name}, played ${actor.character}`}
                  className="group flex flex-col rounded-xl border border-border/70 bg-card/60 p-2 text-center transition-all hover:bg-card hover:border-primary hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
                >
                  <div className="mx-auto mb-2 aspect-square w-14 sm:w-16 rounded-full overflow-hidden bg-muted border border-border/80 shrink-0 group-hover:border-primary transition-colors">
                    {actor.profile_path ? (
                      <img
                        src={`${URL_IMAGE_PROFILE_w185}${actor.profile_path}`}
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
                  onClick={() => handleSelectMovie(rec.id, rec.title)}
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
