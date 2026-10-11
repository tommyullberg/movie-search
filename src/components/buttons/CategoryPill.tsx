import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

export interface CategoryPillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: LucideIcon;
  isActive?: boolean;
  activeVariant?: 'primary' | 'amber' | 'emerald';
  count?: number;
  className?: string;
}

export function CategoryPill({
  label,
  icon: Icon,
  isActive = false,
  activeVariant = 'primary',
  count,
  className,
  disabled,
  onClick,
  ...restProps
}: CategoryPillProps) {
  const getActiveClass = () => {
    switch (activeVariant) {
      case 'amber':
        return 'font-bold ring-2 ring-amber-500/40 bg-amber-500 text-black hover:bg-amber-600 shadow-sm';
      case 'emerald':
        return 'font-bold ring-2 ring-emerald-500/40 bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm';
      case 'primary':
      default:
        return 'font-bold ring-2 ring-primary/40 shadow-sm';
    }
  };

  const getIconColorClass = () => {
    if (!isActive) {
      switch (activeVariant) {
        case 'amber':
          return 'text-amber-500';
        case 'emerald':
          return 'text-emerald-500';
        case 'primary':
        default:
          return 'text-primary';
      }
    }

    switch (activeVariant) {
      case 'amber':
        return 'fill-current text-black';
      case 'emerald':
        return 'text-white';
      case 'primary':
      default:
        return 'text-primary-foreground';
    }
  };

  const getBadgeClass = () => {
    if (isActive) {
      return activeVariant === 'amber' ? 'bg-black/20 text-black' : 'bg-white/20 text-white';
    }
    return 'bg-secondary text-foreground';
  };

  return (
    <Button
      type="button"
      variant={isActive ? 'default' : 'outline'}
      size="sm"
      disabled={disabled}
      aria-pressed={isActive}
      onClick={onClick}
      className={cn(
        'rounded-full transition-all border',
        isActive
          ? getActiveClass()
          : 'text-foreground border-border bg-card/60 hover:bg-primary/15 hover:border-primary/50 focus-visible:bg-primary/15 focus-visible:border-primary/50',
        className
      )}
      {...restProps}
    >
      <Icon className={cn('h-3.5 w-3.5 mr-1.5 shrink-0', getIconColorClass())} aria-hidden="true" />
      <span className="inline-block chrome-text-adjust">{label}</span>
      {typeof count === 'number' && count > 0 && (
        <span
          className={cn(
            'ml-1.5 inline-block chrome-text-adjust rounded-full px-1.5 py-0.2 text-[10px] font-bold',
            getBadgeClass()
          )}
        >
          {count}
        </span>
      )}
    </Button>
  );
}
