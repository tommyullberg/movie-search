import { Dialog, DialogContent } from '../ui/dialog';
import { MovieDetails } from '../MovieDetails';

interface ModalProps {
  movieId: number;
  isOpen: boolean;
  closeModal: () => void;
  children?: React.ReactNode;
}

export function Modal({ isOpen, closeModal }: ModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent className="max-w-3xl p-0 overflow-hidden border border-border bg-card">
        <MovieDetails />
      </DialogContent>
    </Dialog>
  );
}
