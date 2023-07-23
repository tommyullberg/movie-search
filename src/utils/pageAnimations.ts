
export const variants = {
  initial: (direction: string) => {
    return {
      zIndex: 0,
      x: 'right' === direction ? '100vw' : '-100vw', ease: 'easeOut'
    };
  },
  animate: {
    zIndex: 1,
    x: 0
  },
  exit: (direction: string) => {
    return {
      zIndex: 0,
      x: 'right' === direction ? '100vw' : '-100vw', ease: 'easeIn'
    };
  }
};

export const transition = { duration: 0.1 };