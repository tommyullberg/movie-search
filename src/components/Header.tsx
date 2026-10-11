import { NavLink } from 'react-router-dom';
import { Home, HelpCircle, Sun, Moon, Film, Contrast } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { Button } from './ui/button';

export function Header() {
  const { theme, highContrast, toggleTheme, toggleHighContrast } = useTheme();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/90 backdrop-blur-md">
      <div className="container mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-2 sm:gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="rounded-full text-foreground hover:bg-secondary"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-amber-400 transition-transform duration-300 hover:rotate-45" />
            ) : (
              <Moon className="h-5 w-5 text-indigo-500 transition-transform duration-300 hover:-rotate-12" />
            )}
          </Button>

          <Button
            variant={highContrast ? 'default' : 'ghost'}
            size="icon"
            onClick={toggleHighContrast}
            aria-label={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
            aria-pressed={highContrast}
            title={highContrast ? 'Disable high contrast mode' : 'Enable high contrast mode'}
            className={`rounded-full transition-all ${
              highContrast
                ? 'bg-primary text-primary-foreground font-bold ring-2 ring-ring'
                : 'text-foreground hover:bg-secondary'
            }`}
          >
            <Contrast className="h-5 w-5" />
          </Button>

          <NavLink
            to="/"
            end
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-foreground transition-opacity hover:opacity-90 ml-1 sm:ml-2"
            aria-label="The Movie Database home page"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/20 text-primary border border-primary/30">
              <Film className="h-5 w-5" aria-hidden="true" />
            </div>
            <span className="hidden sm:inline">The Movie DB</span>
          </NavLink>
        </div>

        <nav aria-label="Main Navigation" className="flex items-center gap-2">
          <NavLink
            to="/"
            end
            state={{ direction: 'left' }}
            className={({ isActive }) =>
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-secondary text-foreground border border-border'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
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
              `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                isActive
                  ? 'bg-secondary text-foreground border border-border'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              }`
            }
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            <span>About</span>
          </NavLink>
        </nav>
      </div>
    </header>
  );
}
