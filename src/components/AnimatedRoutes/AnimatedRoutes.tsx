import React from 'react';

import Home from '../../pages/Home';
import About from '../../pages/About';
import NoPage404 from '../../pages/NoPage404';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';


export function AnimatedRoutes() {
  const location   = useLocation();
  const publicPath = process.env.PUBLIC_URL;
  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path={`${publicPath}/`} index element={<Home />} />
        <Route path={`${publicPath}/about`} element={<About />} />
        <Route path='*' element={<NoPage404 />} />
      </Routes>
    </AnimatePresence>
  );
}
