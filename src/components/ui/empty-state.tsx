import * as React from 'react';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: LucideIcon | React.ReactNode;
  iconClassName?: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({
  icon,
  iconClassName,
  title,
  description,
  action,
  className,
  ...props
}: EmptyStateProps) {
  const renderIcon = () => {
    if (!icon) return null;
    if (React.isValidElement(icon)) return icon;
    const IconComponent = icon as LucideIcon;
    return <IconComponent className={cn('h-8 w-8', iconClassName)} aria-hidden="true" />;
  };

  return (
    <div
      role="status"
      className={cn(
        'my-16 flex flex-col items-center justify-center text-center px-4',
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground shadow-xs">
          {renderIcon()}
        </div>
      )}
      <h2 className="text-xl font-bold text-foreground tracking-tight">{title}</h2>
      {description && (
        <p className="mt-1 text-sm font-medium text-muted-foreground max-w-sm leading-relaxed">
          {description}
        </p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
