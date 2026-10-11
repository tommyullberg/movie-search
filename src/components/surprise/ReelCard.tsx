import React from 'react';
import { motion, useTransform, MotionValue } from 'framer-motion';
import { Film, Sparkles, Star } from 'lucide-react';
import { SearchResult } from '../SearchResults';
import { formatDate } from '../../utils/helpers';
import { imageConfig } from '../../config/imageConfig';

export interface ReelCardProps {
  movie: SearchResult;
  index: number;
  x: MotionValue<number>;
  containerWidth: number;
  isWinner: boolean;
  isRolling: boolean;
  cardWidth: number;
  cardGap: number;
}

export function ReelCard({
  movie,
  index,
  x,
  containerWidth,
  isWinner,
  isRolling,
  cardWidth,
  cardGap,
}: ReelCardProps) {
  const slotWidth = cardWidth + cardGap;
  const halfContainer = containerWidth > 0 ? containerWidth / 2 : 300;

  // Center of card relative to viewport
  const cardCenter = useTransform(
    x,
    (currentX) => currentX + index * slotWidth + cardWidth / 2
  );

  // Distance from exact center of viewport
  const distFromCenter = useTransform(cardCenter, (c) =>
    Math.abs(c - halfContainer)
  );

  // 3D Mac Dock magnification: scale 1.18 at center, 1.0 adjacent, 0.8 further away
  const scale = useTransform(
    distFromCenter,
    [0, slotWidth, slotWidth * 2.5, slotWidth * 4],
    [1.18, 0.98, 0.86, 0.78]
  );

  // 3D rotation: cards tilt inward toward center in 3D space
  const rotateY = useTransform(
    cardCenter,
    [halfContainer - slotWidth * 3, halfContainer, halfContainer + slotWidth * 3],
    [18, 0, -18]
  );

  // Subtle depth opacity fade on edges
  const opacity = useTransform(
    distFromCenter,
    [0, slotWidth * 1.5, slotWidth * 3.5],
    [1, 0.92, 0.6]
  );

  // Elevated zIndex for center cards so magnified card stays on top
  const zIndex = useTransform(distFromCenter, (dist) =>
    Math.max(1, Math.round(50 - dist / 15))
  );

  return (
    <motion.div
      style={{
        width: `${cardWidth}px`,
        scale,
        rotateY,
        opacity,
        zIndex,
        transformStyle: 'preserve-3d',
      }}
      className={`shrink-0 rounded-2xl overflow-hidden bg-card transition-colors duration-300 flex flex-col shadow-lg select-none outline-none focus:outline-none focus-visible:outline-none ${
        !isRolling && isWinner
          ? 'border-2 border-primary ring-4 ring-primary/30 shadow-2xl shadow-primary/25'
          : 'border border-border/70'
      }`}
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] w-full bg-muted overflow-hidden">
        {movie.poster_path ? (
          <img
            src={`${imageConfig.URL_IMAGE_POSTER_w342}${movie.poster_path}`}
            alt=""
            loading="eager"
            className="w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
            <Film className="h-8 w-8 opacity-40" />
          </div>
        )}

        {/* Winner Tag */}
        {!isRolling && isWinner && (
          <div className="absolute top-2 right-2 z-10 pointer-events-none">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-primary text-primary-foreground shadow-md animate-pulse">
              <Sparkles className="h-2.5 w-2.5" />
              Winner!
            </span>
          </div>
        )}

        {Boolean(movie.vote_average && movie.vote_average > 0) && (
          <div className="absolute bottom-1.5 left-1.5 z-10 px-1.5 py-0.5 rounded-md bg-background/85 backdrop-blur-xs text-[10px] font-bold text-foreground flex items-center gap-0.5 pointer-events-none">
            <Star className="h-2.5 w-2.5 fill-amber-500 text-amber-500" />
            <span>{movie.vote_average?.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Title */}
      <div className="p-2 text-left bg-card pointer-events-none">
        <p className="text-xs font-bold text-foreground line-clamp-1">
          {movie.title}
        </p>
        <p className="text-[10px] text-muted-foreground font-medium">
          {formatDate(movie.release_date || '')?.slice(-4) || 'Movie'}
        </p>
      </div>
    </motion.div>
  );
}
