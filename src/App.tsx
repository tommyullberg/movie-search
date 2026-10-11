import { useEffect } from 'react';
import { Header } from './components/Header';
import { SearchContextProvider } from './contexts/SearchContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { BrowserRouter as Router } from 'react-router-dom';
import { AnimatedRoutes } from './components/AnimatedRoutes';

export default function App() {
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-not-mobile');
  }, []);

  return (
    <ThemeProvider>
      <WatchlistProvider>
        <SearchContextProvider>
          <Router basename={import.meta.env.BASE_URL}>
          <div className="min-h-screen bg-background text-foreground flex flex-col">
            {/* Skip to Main Content Link for WCAG Keyboard Accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-lg focus:font-semibold focus:shadow-xl focus:outline-none focus:ring-4 focus:ring-ring"
            >
              Skip to main content
            </a>

            <Header />
            <main
              id="main-content"
              tabIndex={-1}
              className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 outline-none"
            >
              <AnimatedRoutes />
            </main>
          </div>
        </Router>
      </SearchContextProvider>
    </WatchlistProvider>
  </ThemeProvider>
  );
}
