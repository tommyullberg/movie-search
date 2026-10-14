import React from 'react';
import { ExternalLink, Tv, X } from 'lucide-react';
import type { MovieDetails } from '../../../types';
import { imageConfig } from '../../../config/imageConfig';
import { useSettings } from '../../../contexts/SettingsContext';

export interface WhereToWatchSectionProps {
  movie: MovieDetails;
  isVisible?: boolean;
  onToggleVisibility?: () => void;
}

export function WhereToWatchSection({
  movie,
  isVisible = true,
  onToggleVisibility,
}: WhereToWatchSectionProps) {
  const { region, regionName } = useSettings();
  const watchResults = movie['watch/providers']?.results;
  const userRegionProviders = watchResults?.[region];
  const seProviders = watchResults?.SE;
  const usProviders = watchResults?.US;

  const hasUserRegionContent = !!(
    userRegionProviders?.flatrate?.length ||
    userRegionProviders?.free?.length ||
    userRegionProviders?.ads?.length ||
    userRegionProviders?.rent?.length ||
    userRegionProviders?.buy?.length
  );

  const hasSeContent = !!(
    seProviders?.flatrate?.length ||
    seProviders?.free?.length ||
    seProviders?.ads?.length ||
    seProviders?.rent?.length ||
    seProviders?.buy?.length
  );

  const activeCountry = hasUserRegionContent
    ? regionName
    : hasSeContent
    ? 'Sweden'
    : 'United States';
  const activeData = hasUserRegionContent ? userRegionProviders : hasSeContent ? seProviders : usProviders;

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

  if (!hasStreaming && !hasRentBuy) {
    return null;
  }

  if (!isVisible) {
    return null;
  }

  const whereToWatchHeading = hasStreaming && !hasRentBuy
    ? (freeStreamingServices.length > 0 && subscriptionServices.length === 0
        ? `Available for free streaming in ${activeCountry}`
        : `Available to stream in ${activeCountry}`)
    : !hasStreaming && hasRentBuy
    ? `Available for rent & buy in ${activeCountry}`
    : `Where to Watch in ${activeCountry}`;

  return (
    <section aria-labelledby="providers-heading" className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 id="providers-heading" className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <Tv className="h-4 w-4 text-primary" aria-hidden="true" />
          <span>{whereToWatchHeading}</span>
        </h3>
        <div className="flex items-center gap-2">
          {activeData?.link && (
            <a
              href={activeData.link}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground underline flex items-center gap-1"
              title="Open JustWatch in new tab"
              aria-label="Open JustWatch in new tab"
            >
              <span>JustWatch</span>
              <ExternalLink className="h-3 w-3" aria-hidden="true" />
            </a>
          )}
          {onToggleVisibility && (
            <button
              type="button"
              onClick={onToggleVisibility}
              className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              title="Hide streaming & providers"
              aria-label="Hide streaming & providers"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </button>
          )}
        </div>
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
                  src={`${imageConfig.URL_IMAGE_LOGO_w92}${provider.logo_path}`}
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
                  src={`${imageConfig.URL_IMAGE_LOGO_w92}${provider.logo_path}`}
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
  );
}
