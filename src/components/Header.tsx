import { useState, useRef, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, HelpCircle, Sun, Moon, Film, Contrast, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import { useSettings } from '../contexts/SettingsContext';
import { Button } from './ui/button';
import { GradientText } from './ui/GradientText';
import { APP_NAME } from '../config/version';

export function Header() {
  const { theme, highContrast, toggleTheme, toggleHighContrast } = useTheme();
  const { toggleSettings, openSettings, isSettingsOpen } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const toggleBtnRef = useRef<HTMLButtonElement | null>(null);

  // Focus trap and keyboard navigation inside mobile menu
  useEffect(() => {
    if (!isMobileMenuOpen) return;

    // Focus the first menu item upon opening
    const focusFirstItem = () => {
      const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements && focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    };

    // Small delay to ensure motion div has mounted
    const timer = setTimeout(focusFirstItem, 40);

    const handleClickOutside = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        toggleBtnRef.current &&
        !toggleBtnRef.current.contains(e.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        setIsMobileMenuOpen(false);
        toggleBtnRef.current?.focus();
        return;
      }

      if (e.key === 'Tab') {
        const focusableElements = menuRef.current?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (!focusableElements || focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          // Shift + Tab: if on first element, wrap to last
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          // Tab: if on last element, wrap to first
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on resize past 640px (sm)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 640 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-colors ${
        highContrast
          ? 'border-b border-foreground bg-background text-foreground'
          : isSettingsOpen || isMobileMenuOpen
            ? 'bg-[#15803d] text-white border-b border-emerald-800/40 shadow-xs dark:bg-background dark:text-foreground dark:border-border'
            : 'bg-[#15803d] text-white border-b border-emerald-800/40 shadow-xs dark:bg-background/90 dark:text-foreground dark:border-border dark:backdrop-blur-md'
      }`}
    >
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Desktop Mode Toggles (>= 640px) */}
          <div className="hidden sm:flex items-center gap-2">
            <Button
              variant={highContrast ? 'default' : 'ghost'}
              size="icon"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className={`rounded-full transition-all ${
                highContrast
                  ? 'border-2 border-foreground bg-background text-foreground hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-ring'
                  : 'text-white hover:bg-white/15 dark:text-foreground dark:hover:bg-secondary focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-ring'
              }`}
            >
              {theme === 'dark' ? (
                <Sun className={`h-5 w-5 transition-transform duration-300 hover:rotate-45 ${
                  highContrast ? 'text-current' : 'text-amber-400'
                }`} />
              ) : (
                <Moon className={`h-5 w-5 transition-transform duration-300 hover:-rotate-12 ${
                  highContrast ? 'text-current' : 'text-amber-200 dark:text-indigo-500'
                }`} />
              )}
            </Button>

            <Button
              variant={highContrast ? 'default' : 'ghost'}
              size="icon"
              onClick={toggleHighContrast}
              aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
              aria-pressed={highContrast}
              title={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
              className={`rounded-full transition-all -translate-x-[0.3rem] ${
                highContrast
                  ? 'bg-foreground text-background font-bold border-2 border-foreground ring-2 ring-ring'
                  : 'text-white hover:bg-white/15 dark:text-foreground dark:hover:bg-secondary focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-ring'
              }`}
            >
              <Contrast className="h-5 w-5" />
            </Button>
          </div>

          <NavLink
            to="/"
            end
            onClick={closeMenu}
            className={`flex items-center gap-3 text-3xl font-bold tracking-tight whitespace-nowrap transition-opacity hover:opacity-90 rounded-lg outline-none focus-visible:ring-2 ${
              highContrast
                ? 'text-foreground focus-visible:ring-ring'
                : 'text-white dark:text-foreground focus-visible:ring-white dark:focus-visible:ring-ring'
            }`}
            aria-label="The Movie Database home page"
          >
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg shadow-xs transition-colors shrink-0 ${
              highContrast
                ? 'border-2 border-foreground bg-background text-foreground'
                : 'border border-white/30 bg-white/20 text-white dark:bg-primary/20 dark:text-primary dark:border-primary/30'
            }`}>
              <Film className="h-5 w-5" aria-hidden="true" />
            </div>
            <GradientText
              disabled={highContrast}
              angle="160deg"
              colors={
                theme === 'dark'
                  ? ['#86efac', '#fdba74', '#ffffff', '#fed7aa', '#a7f3d0', '#86efac']
                  : ['#ffffff', '#fed7aa', '#fef9c3', '#fdba74', '#ffffff']
              }
              animationSpeed={6}
            >
              {APP_NAME}
            </GradientText>
          </NavLink>
        </div>

        {/* Desktop Navigation (>= 640px) */}
        <nav aria-label="Main Navigation" className="hidden sm:flex items-center gap-2">
          <NavLink
            to="/"
            end
            state={{ direction: 'left' }}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-ring ${
                isActive
                  ? highContrast
                    ? 'border-2 border-foreground bg-foreground text-background font-bold'
                    : 'bg-white/20 text-white border border-white/30 shadow-xs dark:bg-secondary dark:text-foreground dark:border-border font-bold'
                  : highContrast
                    ? 'text-foreground hover:bg-foreground hover:text-background'
                    : 'text-white/80 hover:text-white hover:bg-white/15 active:bg-white/20 dark:text-muted-foreground dark:hover:bg-secondary dark:hover:text-foreground'
              }`
            }
          >
            <Home className="h-4 w-4" aria-hidden="true" />
            <span>Home</span>
          </NavLink>

          <NavLink
            to="/about"
            end
            state={{ direction: 'right' }}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-ring ${
                isActive
                  ? highContrast
                    ? 'border-2 border-foreground bg-foreground text-background font-bold'
                    : 'bg-white/20 text-white border border-white/30 shadow-xs dark:bg-secondary dark:text-foreground dark:border-border font-bold'
                  : highContrast
                    ? 'text-foreground hover:bg-foreground hover:text-background'
                    : 'text-white/80 hover:text-white hover:bg-white/15 active:bg-white/20 dark:text-muted-foreground dark:hover:bg-secondary dark:hover:text-foreground'
              }`
            }
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>About</span>
          </NavLink>

          <Button
            variant={highContrast ? 'default' : 'ghost'}
            size="icon"
            onClick={() => {
              closeMenu();
              toggleSettings();
            }}
            aria-label="Settings"
            aria-haspopup="dialog"
            aria-expanded={isSettingsOpen}
            title="Settings"
            className={`rounded-lg h-9 w-9 transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-ring ${
              highContrast
                ? isSettingsOpen
                  ? 'border-2 border-foreground bg-foreground text-background font-bold'
                  : 'text-foreground hover:bg-foreground hover:text-background border-2 border-transparent'
                : isSettingsOpen
                  ? 'bg-white/25 text-white border border-white/40 shadow-xs dark:bg-secondary dark:text-foreground dark:border-border font-bold'
                  : 'text-white/80 hover:text-white hover:bg-white/15 dark:text-muted-foreground dark:hover:bg-secondary dark:hover:text-foreground'
            }`}
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </Button>
        </nav>

        {/* Mobile Navigation Trigger (< 640px) */}
        <div className="relative sm:hidden flex items-center">
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => {
              if (isSettingsOpen) toggleSettings();
              setIsMobileMenuOpen((prev) => !prev);
            }}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation-dropdown"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            className={`relative flex h-10 w-10 flex-col items-center justify-center rounded-xl transition-all outline-none focus-visible:ring-2 focus-visible:ring-white dark:focus-visible:ring-ring ${
              highContrast
                ? 'border-2 border-foreground bg-background text-foreground'
                : 'border border-white/30 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white dark:border-primary/25 dark:bg-emerald-500/5 dark:hover:bg-emerald-500/10 dark:active:bg-emerald-500/15 dark:text-primary shadow-xs'
            }`}
          >
            {/* Animated Hamburger Icon */}
            <span className="relative h-4 w-5 flex flex-col justify-between" aria-hidden="true">
              {/* Top Bar */}
              <span
                className={`block h-0.5 w-full rounded-full transition-transform duration-250 ease-out origin-center ${
                  highContrast
                    ? 'bg-foreground'
                    : 'bg-white dark:bg-primary/80 dark:bg-emerald-400/80 shadow-xs'
                } ${
                  isMobileMenuOpen ? 'translate-y-[7px] rotate-45' : ''
                }`}
              />
              {/* Middle Bar */}
              <span
                className={`block h-0.5 w-full rounded-full transition-opacity duration-200 ease-out ${
                  highContrast
                    ? 'bg-foreground'
                    : 'bg-white dark:bg-primary/70 dark:bg-emerald-400/70 shadow-xs'
                } ${
                  isMobileMenuOpen ? 'opacity-0' : 'opacity-100'
                }`}
              />
              {/* Bottom Bar */}
              <span
                className={`block h-0.5 w-full rounded-full transition-transform duration-250 ease-out origin-center ${
                  highContrast
                    ? 'bg-foreground'
                    : 'bg-white dark:bg-primary/80 dark:bg-emerald-400/80 shadow-xs'
                } ${
                  isMobileMenuOpen ? '-translate-y-[7px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>

          {/* Mobile Dropdown Menu */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  onClick={closeMenu}
                  className="fixed inset-0 top-16 mt-px z-40 bg-black/40 sm:hidden"
                  aria-hidden="true"
                />
                <motion.div
                  ref={menuRef}
                  id="mobile-navigation-dropdown"
                  initial={{ x: '100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '100%' }}
                  transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                  className={`fixed right-0 top-16 mt-px z-50 w-64 origin-top-right overflow-hidden rounded-none rounded-bl-2xl shadow-2xl backdrop-blur-xl ${
                    highContrast
                      ? 'border-2 border-t-0 border-r-0 border-foreground bg-background text-foreground'
                      : 'border-l border-b border-border/80 bg-card/98 text-card-foreground shadow-emerald-950/20'
                  }`}
                  role="menu"
                  aria-label="Mobile Navigation"
                >
                <div className="flex flex-col w-full p-1.5 gap-1">
                  <NavLink
                    to="/"
                    end
                    onClick={closeMenu}
                    state={{ direction: 'left' }}
                    role="menuitem"
                    className={({ isActive }) =>
                      `flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card ${
                        isActive
                          ? highContrast
                            ? 'bg-foreground text-background font-bold'
                            : 'bg-emerald-500/20 text-foreground font-bold hover:bg-emerald-500/40 active:bg-emerald-500/45'
                          : highContrast
                            ? 'text-foreground hover:bg-foreground hover:text-background'
                            : 'text-foreground/80 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 active:bg-black/15 dark:active:bg-white/25'
                      }`
                    }
                  >
                    <Home className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>Home</span>
                  </NavLink>

                  <NavLink
                    to="/about"
                    end
                    onClick={closeMenu}
                    state={{ direction: 'right' }}
                    role="menuitem"
                    className={({ isActive }) =>
                      `flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card ${
                        isActive
                          ? highContrast
                            ? 'bg-foreground text-background font-bold'
                            : 'bg-emerald-500/20 text-foreground font-bold hover:bg-emerald-500/40 active:bg-emerald-500/45'
                          : highContrast
                            ? 'text-foreground hover:bg-foreground hover:text-background'
                            : 'text-foreground/80 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 active:bg-black/15 dark:active:bg-white/25'
                      }`
                    }
                  >
                    <HelpCircle className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>About</span>
                  </NavLink>

                  {/* Separator */}
                  <div
                    className={`my-1 h-px w-full ${
                      highContrast ? 'bg-foreground' : 'bg-border/60'
                    }`}
                    role="separator"
                    aria-orientation="horizontal"
                  />

                  {/* Dark/Light Mode Toggle */}
                  <button
                    type="button"
                    onClick={toggleTheme}
                    role="menuitem"
                    aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                    className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card ${
                      highContrast
                        ? 'text-foreground hover:bg-foreground hover:text-background'
                        : 'text-foreground/80 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 active:bg-black/15 dark:active:bg-white/25'
                    }`}
                  >
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4 shrink-0 text-amber-400" aria-hidden="true" />
                    ) : (
                      <Moon className="h-4 w-4 shrink-0 text-amber-500 dark:text-indigo-400" aria-hidden="true" />
                    )}
                    <span>Dark/Light Mode</span>
                  </button>

                  {/* High Contrast Mode Toggle */}
                  <button
                    type="button"
                    onClick={toggleHighContrast}
                    role="menuitem"
                    aria-pressed={highContrast}
                    aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
                    className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card ${
                      highContrast
                        ? 'border border-foreground bg-foreground text-background font-bold'
                        : 'text-foreground/80 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 active:bg-black/15 dark:active:bg-white/25'
                    }`}
                  >
                    <Contrast className={`h-4 w-4 shrink-0 ${highContrast ? 'text-current' : 'text-primary'}`} aria-hidden="true" />
                    <span>High Contrast Mode</span>
                  </button>

                  {/* Separator */}
                  <div
                    className={`my-1 h-px w-full ${
                      highContrast ? 'bg-foreground' : 'bg-border/60'
                    }`}
                    role="separator"
                    aria-orientation="horizontal"
                  />

                  {/* Settings */}
                  <button
                    type="button"
                    onClick={() => {
                      closeMenu();
                      openSettings();
                    }}
                    role="menuitem"
                    aria-label="Settings"
                    className={`flex items-center gap-3 w-full px-3.5 py-2.5 text-sm font-semibold rounded-lg transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-card ${
                      highContrast
                        ? isSettingsOpen
                          ? 'border border-foreground bg-foreground text-background font-bold'
                          : 'text-foreground hover:bg-foreground hover:text-background'
                        : isSettingsOpen
                          ? 'bg-emerald-500/20 text-foreground font-bold hover:bg-emerald-500/40 active:bg-emerald-500/45'
                          : 'text-foreground/80 hover:text-foreground hover:bg-black/10 dark:hover:bg-white/20 active:bg-black/15 dark:active:bg-white/25'
                    }`}
                  >
                    <Settings className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    <span>Settings</span>
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
        </div>
      </div>
    </header>
  );
}
