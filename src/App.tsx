import { useEffect } from 'react';
import { Header, AnimatedRoutes, Modal, PersonModal } from './components';
import { SearchContextProvider, useSearchContext } from './contexts/SearchContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { WatchlistProvider } from './contexts/WatchlistContext';
import { BrowserRouter as Router } from 'react-router-dom';

function DetailModals() {
  const { selectedMovieId, selectedPersonId, closeAllDetails } = useSearchContext();

  return (
    <>
      {Boolean(selectedMovieId > 0) && (
        <Modal movieId={selectedMovieId} isOpen={selectedMovieId > 0} closeModal={closeAllDetails} />
      )}
      {Boolean(selectedPersonId > 0) && (
        <PersonModal personId={selectedPersonId} isOpen={selectedPersonId > 0} closeModal={closeAllDetails} />
      )}
    </>
  );
}

export default function App() {
  useEffect(() => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    document.documentElement.classList.add(isMobile ? 'is-mobile' : 'is-not-mobile');
    const isChromium = /Chrome|Chromium|Edg/i.test(navigator.userAgent) && !/Firefox/i.test(navigator.userAgent);
    if (isChromium) {
      document.documentElement.classList.add('is-chromium');
    }
  }, []);

  return (
    <ThemeProvider>
      <WatchlistProvider>
        <Router basename={import.meta.env.BASE_URL}>
          <SearchContextProvider>
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
              <DetailModals />
            </div>
          </SearchContextProvider>
        </Router>
      </WatchlistProvider>
    </ThemeProvider>
  );
}
