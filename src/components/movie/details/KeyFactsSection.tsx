import React from 'react';
import { X, DollarSign } from 'lucide-react';
import type { MovieDetails } from '../../../types';

export interface KeyFactsSectionProps {
  movie: MovieDetails;
  isBudgetVisible?: boolean;
  onToggleBudget?: () => void;
}

const formatCurrency = (amount: number): string => {
  if (!amount || amount <= 0) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
};

export function KeyFactsSection({
  movie,
  isBudgetVisible = true,
  onToggleBudget,
}: KeyFactsSectionProps) {
  const formattedBudget = formatCurrency(movie.budget);
  const formattedRevenue = formatCurrency(movie.revenue);
  const productionNames = movie.production_companies?.slice(0, 3).map((c) => c.name).join(', ');

  if (!isBudgetVisible) {
    return null;
  }

  if (!formattedBudget && !formattedRevenue && !movie.status && !productionNames) {
    return null;
  }

  return (
    <div className="relative group rounded-xl border border-white/15 bg-white/5 p-3 sm:p-3.5 text-xs transition-all">
      {onToggleBudget && (
        <button
          type="button"
          onClick={onToggleBudget}
          className="absolute top-2.5 right-2.5 p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          title="Hide budget and financial facts"
          aria-label="Hide budget and financial facts"
        >
          <X className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      )}
      <div className="flex items-start gap-2.5 pr-6">
        <DollarSign className="h-4 w-4 shrink-0 text-amber-500 fill-amber-500/20 stroke-[2.5] mt-0.5" aria-hidden="true" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 flex-1 min-w-0">
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
      </div>
    </div>
  );
}
