import React from 'react';
import { Button } from '../ui/button';
import { Play as PlayIcon } from 'lucide-react';
import type { VideoItem } from '../../types';

export interface MovieTrailerSectionProps {
  movieTitle: string;
  trailer: VideoItem;
  onClose: () => void;
}

export function MovieTrailerSection({ movieTitle, trailer, onClose }: MovieTrailerSectionProps) {
  return (
    <section id="trailer-video-section" aria-label="Official Trailer Video" className="mt-6 pt-6 border-t border-border">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
          <PlayIcon className="h-4 w-4 text-primary fill-current" aria-hidden="true" />
          {trailer.name || 'Official Trailer'}
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-8 text-xs font-semibold"
          aria-label="Close trailer"
        >
          Close
        </Button>
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
