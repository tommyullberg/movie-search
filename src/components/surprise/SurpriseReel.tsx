import React from 'react';
import { motion, MotionValue } from 'framer-motion';
import { SearchResult } from '../../types';
import { ReelCard } from './ReelCard';

export interface SurpriseReelProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
  x: MotionValue<number>;
  candidates: SearchResult[];
  winner: SearchResult | null;
  targetIndex: number;
  containerWidth: number;
  isRolling: boolean;
  cardWidth: number;
  cardGap: number;
}

export function SurpriseReel({
  containerRef,
  x,
  candidates,
  winner,
  targetIndex,
  containerWidth,
  isRolling,
  cardWidth,
  cardGap,
}: SurpriseReelProps) {
  return (
    <div
      ref={containerRef}
      style={{ perspective: 1200 }}
      className="relative w-full h-[330px] sm:h-[350px] overflow-hidden rounded-2xl bg-muted/25 border border-border flex items-center justify-center shadow-inner py-6 sm:py-8"
    >
      {/* Center Reticle Pointer Arrows */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
        <span className="text-primary text-sm font-black drop-shadow-md">
          ▼
        </span>
      </div>
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex flex-col items-center">
        <span className="text-primary text-sm font-black drop-shadow-md">
          ▲
        </span>
      </div>

      {/* Left & Right Shadow Gradient Overlays */}
      <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-r from-card to-transparent z-20 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-28 bg-gradient-to-l from-card to-transparent z-20 pointer-events-none" />

      {/* Ambient Center Glow Aura (borderless to avoid double outline) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[180px] h-[270px] rounded-3xl bg-primary/10 blur-2xl pointer-events-none z-0" />

      {/* Sliding Strip */}
      <motion.div
        className="flex items-center absolute left-0"
        style={{ x, gap: `${cardGap}px` }}
      >
        {candidates.map((movie, index) => {
          const isWinnerCard =
            !isRolling &&
            winner !== null &&
            winner.id === movie.id &&
            index === targetIndex;
          return (
            <ReelCard
              key={`${movie.id}-${index}`}
              movie={movie}
              index={index}
              x={x}
              containerWidth={containerWidth}
              isWinner={isWinnerCard}
              isRolling={isRolling}
              cardWidth={cardWidth}
              cardGap={cardGap}
            />
          );
        })}
      </motion.div>
    </div>
  );
}
