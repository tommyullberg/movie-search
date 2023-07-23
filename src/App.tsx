import React from 'react';
import './App.css';
import { Header } from './components/Header';
import { SearchContextProvider } from './contexts/SearchContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatedRoutes } from './components/AnimatedRoutes';

export default function App() {
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
