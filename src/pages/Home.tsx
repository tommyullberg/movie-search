import React from 'react';
import { SearchForm } from '../components/SearchForm';
import { SearchResults } from '../components/SearchResults';
import { SearchContextProvider } from '../contexts/SearchContext';
import { motion } from 'framer-motion';
import { variants, transition } from '../utils/pageAnimations';
import { useLocation } from 'react-router-dom';

export default function Home() {
  const location = useLocation();
  const direction = location.state?.direction || 'right';
  
  return (
    <SearchContextProvider>
      <motion.div
        className='container-fluid content'
        variants={variants}
        initial='initial'
        animate='animate'
        exit='exit'
        transition={transition}
        custom={direction}>
        <SearchForm />
        <SearchResults />
      </motion.div>
    </SearchContextProvider>
  );
}
