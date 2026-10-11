import React from 'react';
import { User } from 'lucide-react';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import type { SearchResult } from '../types';
import { imageConfig } from '../config/imageConfig';

export interface PersonCardProps {
  person: SearchResult;
  onClick: (e: React.MouseEvent<Element>) => void;
  onKeyDown: (e: React.KeyboardEvent<Element>) => void;
}

export function PersonCard({ person, onClick, onKeyDown }: PersonCardProps) {
  const { URL_IMAGE_PROFILE_h632 } = imageConfig;

  return (
    <Card
      role="button"
      tabIndex={0}
      aria-haspopup="dialog"
      aria-label={`View profile for ${person.name}`}
      onClick={onClick}
      onKeyDown={onKeyDown}
      className="cursor-pointer overflow-hidden border border-border bg-card text-card-foreground hover:border-primary transition-all duration-300 hover:shadow-xl hover:-translate-y-1.5 flex flex-col h-full focus-visible:ring-4 focus-visible:ring-ring"
    >
      {/* Profile Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-muted">
        {person.profile_path ? (
          <img
            src={`${URL_IMAGE_PROFILE_h632}${person.profile_path}`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground" aria-hidden="true">
            <User className="h-12 w-12 opacity-40" />
          </div>
        )}

        {person.known_for_department && (
          <div className="absolute top-2 left-2 z-10">
            <Badge variant="secondary" className="text-[10px] font-bold shadow-md bg-background/85 backdrop-blur-xs border border-border">
              {person.known_for_department}
            </Badge>
          </div>
        )}
      </div>

      {/* Person Card Body */}
      <CardContent className="p-3.5 flex flex-col justify-between flex-1">
        <div>
          <h2 className="line-clamp-2 text-sm sm:text-base font-bold tracking-tight text-foreground group-hover:text-primary transition-colors">
            {person.name}
          </h2>
        </div>
        {person.known_for && person.known_for.length > 0 && (
          <p className="mt-2 line-clamp-2 text-xs text-muted-foreground font-medium">
            <span className="font-semibold text-foreground/80">Known for: </span>
            {person.known_for.map((k) => k.title || k.name).filter(Boolean).slice(0, 3).join(', ')}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
