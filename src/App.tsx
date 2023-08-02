import React from 'react';
import './App.css';
import { isMobile } from 'is-mobile';
import { Header } from './components/Header';
import { SearchContextProvider } from './contexts/SearchContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatedRoutes } from './components/AnimatedRoutes';

export default function App() {

  document.getElementsByTagName('html')[0]?.classList.add(`is${isMobile() ? '' : '-not'}-mobile`);

  return (
    <SearchContextProvider>
      <Router>
        <Header />
        <main>
          <AnimatedRoutes />
        </main>
      </Router>
    </SearchContextProvider>
  );
}
