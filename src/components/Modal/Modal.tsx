import React, { useState, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { MovieDetails } from '../MovieDetails';
import styles from './Modal.module.css';

interface ModalProps {
  isOpening: boolean;
  isOpen: boolean;
  closeModal: () => void;
  children?: ReactElement;
}

export function Modal({ isOpening, isOpen, closeModal }: ModalProps) {
  const [isAnimating, setIsAnimating] = useState(isOpening);

  const closeModalWithAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      closeModal();
      document.getElementById('appBody')?.classList.remove('has-modal');
    }, 100);
  };

  if (!isOpen && !isAnimating) {
    return null;
  }

  if (isOpen) {
    document.getElementById('appBody')?.classList.add('has-modal');
  }

  return ReactDOM.createPortal(
    <div
      className={`${styles.modal} ${
        isOpen ? `${styles.open} is-open` : ''
      } ${isAnimating ? styles.animating : ''}`}>
      <div className={styles.overlay} onClick={closeModalWithAnimation} />
      <div className={`${styles.content} ${isOpen ? styles.open : ''}`}>
        <MovieDetails />
        <button
          className={`ripple ripple-surface btn btn-danger btn-floating ${styles.closeBtn}`}
          onClick={closeModalWithAnimation}
          aria-label='Close'>
          <i className='fas fa-times'></i>
        </button>
      </div>
    </div>,
    document.getElementById('modal-root')!
  );
}
