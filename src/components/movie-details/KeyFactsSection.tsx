import React from 'react';
import type { MovieDetails } from '../../types';

export interface KeyFactsSectionProps {
  movie: MovieDetails;
}

const formatCurrency = (amount: number): string => {
  if (!amount || amount <= 0) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function KeyFactsSection({ movie }: KeyFactsSectionProps) {
  const formattedBudget = formatCurrency(movie.budget);
  const formattedRevenue = formatCurrency(movie.revenue);
  const productionNames = movie.production_companies?.slice(0, 3).map((c) => c.name).join(', ');

  if (!formattedBudget && !formattedRevenue && !movie.status && !productionNames) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 rounded-xl border border-border bg-card/60 p-3 sm:p-3.5 text-xs">
      {movie.status && (
        <div>
          <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">Status</p>
          <p className="font-bold text-foreground mt-0.5">{movie.status}</p>
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
  );
}
