export const onAnimationStart = () => {
  /* console.log('onAnimationStart');
  console.log('clientWidth:', document.documentElement.clientWidth);
  console.log(
    '#navbar.offsetWidth:',
    document?.getElementById('navbar')?.offsetWidth
  );
  console.log(document?.getElementById('appBody')?.innerHTML); */
};

export const onAnimationComplete = () => {
  /* const w = document.documentElement.clientWidth;
  console.log('onAnimationComplete');
  console.log('clientWidth:', w);
  console.log(
    '#navbar.offsetWidth:',
    document?.getElementById('navbar')?.offsetWidth
  );
  console.log(document?.getElementById('appBody')?.innerHTML); */
};


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