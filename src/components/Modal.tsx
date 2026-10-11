import { Dialog, DialogContent } from './ui/dialog';
import { MovieDetails } from './MovieDetails';

interface ModalProps {
  movieId: number;
  isOpen: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
}

export function Modal({ isOpen, closeModal }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="sm:w-[94vw] sm:max-w-4xl lg:max-w-5xl">
        <MovieDetails />
      </DialogContent>
    </Dialog>
  );
}
