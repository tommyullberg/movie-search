import React from 'react';
import { Play as PlayIcon, X } from 'lucide-react';
import type { VideoItem } from '../../../types';

export interface MovieTrailerSectionProps {
  movieTitle: string;
  trailer: VideoItem;
  onClose: () => void;
}

export function MovieTrailerSection({ movieTitle, trailer, onClose }: MovieTrailerSectionProps) {
  return (
    <section id="trailer-video-section" aria-label="Official Trailer Video" className="mt-8 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <PlayIcon className="h-4 w-4 text-primary fill-current" aria-hidden="true" />
          <span>{trailer.name || 'Official Trailer'}</span>
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="Close trailer"
          aria-label="Close trailer"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
      <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-2xl border border-border bg-black">
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1`}
          title={`${movieTitle} Trailer`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </section>
  );
}
