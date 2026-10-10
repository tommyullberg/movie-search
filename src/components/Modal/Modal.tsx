import React, { useLayoutEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { MovieDetails } from '../MovieDetails';
import styles from './Modal.module.css';

interface ModalProps {
  movieId: number;
  isOpen: boolean;
  closeModal: () => void;
  children?: React.ReactElement;
}

export function Modal({ movieId, isOpen, closeModal }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog && !dialog.open) {
      dialog.showModal();
      document.body.classList.add('has-modal');
    }
    return () => {
      document.body.classList.remove('has-modal');
    };
  }, [isOpen]);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const animationProps = prefersReducedMotion
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0 }
      }
    : {
        layoutId: `movie-card-${movieId}`,
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { type: 'spring' as const, damping: 25, stiffness: 200 }
      };

  return (
    <motion.dialog
      ref={dialogRef}
      className={styles.modal}
      onClose={closeModal}
      onClick={(e: React.MouseEvent<HTMLDialogElement>) => {
        if (e.target === dialogRef.current) {
          closeModal();
        }
      }}
      {...animationProps}
    >
      <MovieDetails />
      <button
        className={styles.closeBtn}
        onClick={closeModal}
        aria-label='Close'>
        <i className='fas fa-times'></i>
      </button>
    </motion.dialog>
  );
}
