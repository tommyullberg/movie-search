import React from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { MovieDetails } from './MovieDetails';

export interface MovieModalProps {
  movieId?: number;
  isOpen: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
}

export function MovieModal({ isOpen, closeModal }: MovieModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:w-[94vw] sm:max-w-4xl lg:max-w-5xl">
        <MovieDetails />
      </DialogContent>
    </Dialog>
  );
}
