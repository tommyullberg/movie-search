import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Star, RotateCcw, ExternalLink, Target } from 'lucide-react';
import { Button } from '../ui/button';
import { SearchResult } from '../SearchResults';
import { formatDate } from '../../utils/helpers';

export interface SurpriseWinnerSpotlightProps {
  winner: SearchResult | null;
  isRolling: boolean;
  onRollAgain: () => void;
  onOpenDetails: (movieId: number, title?: string) => void;
  onHighlightInResults: () => void;
}

export function SurpriseWinnerSpotlight({
  winner,
  isRolling,
  onRollAgain,
  onOpenDetails,
  onHighlightInResults,
}: SurpriseWinnerSpotlightProps) {
  return (
    <AnimatePresence>
      {!isRolling && winner && (
        <motion.div
          initial={{ opacity: 0, y: 12, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="mt-4 p-4 w-full rounded-2xl border border-primary/40 bg-primary/5 shadow-md flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left"
        >
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-1">
              <Sparkles className="h-3.5 w-3.5 shrink-0" />
              <span>Winning Pick</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-foreground truncate">
              {winner.title}
            </h3>
            <p className="text-xs text-muted-foreground font-semibold flex items-center justify-center sm:justify-start gap-2 mt-0.5">
              <span>{formatDate(winner.release_date || '') || 'Unknown'}</span>
              {Boolean(winner.vote_average && winner.vote_average > 0) && (
                <>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-foreground">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500 shrink-0" />
                    {winner.vote_average?.toFixed(1)} / 10
                  </span>
                </>
              )}
            </p>
          </div>

          <div className="shrink-0 flex flex-wrap sm:flex-nowrap items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onRollAgain}
              className="rounded-xl font-bold h-9"
            >
              <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
              Roll Again
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => onOpenDetails(winner.id, winner.title)}
              className="rounded-xl font-bold h-9 shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5 mr-1.5" />
              Go to movie
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={onHighlightInResults}
              className="rounded-xl font-bold h-9 shadow-sm"
            >
              <Target className="h-3.5 w-3.5 mr-1.5" />
              Highlight in results
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
