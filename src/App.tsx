import React, { useEffect } from 'react';
import './App.css';
import { Header } from './components/Header';
import { SearchContextProvider } from './contexts/SearchContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatedRoutes } from './components/AnimatedRoutes';

export default function App() {
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-not-mobile');
  }, []);

  return (
    <SearchContextProvider>
      <Router basename={import.meta.env.BASE_URL}>
        <Header />
        <main>
          <AnimatedRoutes />
        </main>
      </Router>
    </SearchContextProvider>
  );
}
