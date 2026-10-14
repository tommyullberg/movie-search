import { APP_NAME, APP_VERSION } from '../config/version';
import { useTheme } from '../contexts/ThemeContext';

export function Footer() {
  const { highContrast } = useTheme();

  return (
    <footer
      role="contentinfo"
      aria-label="Site Footer"
      className={`w-full py-3 mt-auto text-center text-xs sm:text-sm transition-colors ${
        highContrast
          ? 'border-t-2 border-foreground bg-background text-foreground font-semibold'
          : 'border-t border-border/60 bg-muted/20 text-muted-foreground'
      }`}
    >
      <div className="container max-w-6xl mx-auto px-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1">
        <span className="font-semibold text-foreground/90">{APP_NAME}</span>
        <span aria-hidden="true" className="opacity-60">•</span>
        <span>Version {APP_VERSION}</span>
        <span aria-hidden="true" className="opacity-60">•</span>
        <span>
          Data provided by{' '}
          <a
            href="https://www.themoviedb.org/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
          >
            TMDB
          </a>{' '}
          &{' '}
          <a
            href="https://www.justwatch.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium underline underline-offset-4 hover:text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
          >
            JustWatch
          </a>
        </span>
      </div>
    </footer>
  );
}
