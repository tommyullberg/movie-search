import React, { useEffect } from 'react';

import Home from '../pages/Home';
import About from '../pages/About';
import NoPage404 from '../pages/NoPage404';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

export function AnimatedRoutes() {
  const location = useLocation();

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }
  }, [location.pathname, location.hash]);
  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path='/about' element={<About />} />
        <Route path='/' index element={<Home />} />
        <Route path='*' element={<NoPage404 />} />
      </Routes>
    </AnimatePresence>
  );
}
