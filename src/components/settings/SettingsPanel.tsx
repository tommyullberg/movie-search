import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Settings, Globe, Tv, ShieldCheck, Trash2, AlertTriangle, Check, RefreshCw } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";
import { useTheme } from "../../contexts/ThemeContext";
import { useWatchlist } from "../../contexts/WatchlistContext";
import { SUPPORTED_REGIONS } from "../../config/regions";
import { APP_NAME, APP_VERSION } from "../../config/version";
import { Button } from "../ui/button";

export function SettingsPanel() {
  const {
    region,
    regionName,
    regionFlag,
    allProvidersEnabled,
    selectedProviderIds,
    isSettingsOpen,
    availableProviders,
    setRegion,
    setAllProvidersEnabled,
    toggleProvider,
    selectAllProviders,
    closeSettings,
    clearAllUserData,
  } = useSettings();

  const { highContrast } = useTheme();
  const { clearWatchlist, clearWatched } = useWatchlist();

  const [isConfirmingClear, setIsConfirmingClear] = useState(false);
  const [clearSuccess, setClearSuccess] = useState(false);

  const panelRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Focus management: record previous element and focus close button when panel opens, restore on close
  useEffect(() => {
    if (isSettingsOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement | null;
      setIsConfirmingClear(false);
      setClearSuccess(false);
      const timer = setTimeout(() => {
        closeBtnRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    } else if (previousFocusRef.current) {
      previousFocusRef.current.focus();
    }
  }, [isSettingsOpen]);

  // Keyboard navigation: Escape key to close, Tab focus trapping
  useEffect(() => {
    if (!isSettingsOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeSettings();
        return;
      }

      if (e.key === "Tab" && panelRef.current) {
        const focusableElements = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isSettingsOpen, closeSettings]);

  // Handle clearing all local user data
  const handleConfirmClear = () => {
    clearWatchlist();
    clearWatched();
    clearAllUserData();
    setIsConfirmingClear(false);
    setClearSuccess(true);
    setTimeout(() => {
      setClearSuccess(false);
    }, 4000);
  };

  return (
    <AnimatePresence>
      {isSettingsOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={closeSettings}
            className='fixed inset-0 top-16 mt-px z-40 bg-black/40'
            aria-hidden='true'
          />

          {/* Settings Drawer Panel */}
          <motion.aside
            ref={panelRef}
            id='app-settings-panel'
            role='dialog'
            aria-modal='true'
            aria-label='Application Settings'
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className={`fixed top-16 mt-px right-0 z-50 w-full sm:w-[460px] max-w-[100vw] h-[calc(100vh-4rem-1px)] overflow-y-auto rounded-none rounded-bl-3xl shadow-2xl flex flex-col ${
              highContrast
                ? "border-2 border-t-0 border-r-0 border-foreground bg-background text-foreground"
                : "border-l border-b border-border/80 bg-card text-card-foreground shadow-emerald-950/20"
            }`}>
            {/* Panel Header */}
            <div
              className={`flex items-center justify-between p-4 sm:p-5 border-b sticky top-0 z-10 ${
                highContrast ? "border-foreground bg-background" : "border-border/70 bg-card"
              }`}>
              <div className='flex items-center gap-2.5'>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                    highContrast
                      ? "border-2 border-foreground bg-foreground text-background"
                      : "bg-primary/15 text-primary border border-primary/20"
                  }`}>
                  <Settings className='h-5 w-5' aria-hidden='true' />
                </div>
                <div>
                  <h2 className='text-lg font-bold tracking-tight'>Settings</h2>
                  <p className='text-xs text-muted-foreground'>Country, streaming services and privacy</p>
                </div>
              </div>

              <Button
                ref={closeBtnRef}
                variant='ghost'
                size='icon'
                onClick={closeSettings}
                aria-label='Close settings'
                title='Close settings'
                className={`rounded-full transition-colors ${
                  highContrast
                    ? "border border-foreground hover:bg-foreground hover:text-background"
                    : "hover:bg-muted text-muted-foreground hover:text-foreground"
                }`}>
                <X className='h-5 w-5' aria-hidden='true' />
              </Button>
            </div>

            {/* Panel Body */}
            <div className='flex-1 p-4 sm:p-5 space-y-6'>
              {/* SECTION 1: Country & Region */}
              <section aria-labelledby='settings-country-heading' className='space-y-3'>
                <div className='flex items-center gap-2'>
                  <Globe className='h-4 w-4 text-primary shrink-0' aria-hidden='true' />
                  <h3
                    id='settings-country-heading'
                    className='text-sm font-bold uppercase tracking-wider text-foreground'>
                    Country & Regional Content
                  </h3>
                </div>
                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Select your country to tailor cinema releases (In Theaters) and available streaming services to your
                  region.
                </p>

                <div className='relative'>
                  <label htmlFor='settings-region-select' className='sr-only'>
                    Select country
                  </label>
                  <select
                    id='settings-region-select'
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className={`w-full h-11 px-3.5 pr-10 text-sm font-semibold rounded-xl transition-colors cursor-pointer appearance-none ${
                      highContrast
                        ? "border-2 border-foreground bg-background text-foreground focus:ring-2 focus:ring-foreground"
                        : "border border-border bg-muted/40 hover:bg-muted/70 text-foreground focus:ring-2 focus:ring-primary focus:border-primary focus:outline-none"
                    }`}>
                    {SUPPORTED_REGIONS.map((r) => (
                      <option key={r.code} value={r.code} className='bg-popover text-popover-foreground'>
                        {r.flag} {r.name} ({r.code})
                      </option>
                    ))}
                  </select>
                  <span className='absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-xs font-bold text-muted-foreground'>
                    ▼
                  </span>
                </div>

                <div className='flex items-center gap-2 pt-1'>
                  <span className='text-xs text-muted-foreground'>Active region:</span>
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                      highContrast
                        ? "border border-foreground bg-foreground text-background"
                        : "bg-primary/10 text-primary border border-primary/20"
                    }`}>
                    <span>{regionFlag}</span>
                    <span>
                      {regionName} ({region})
                    </span>
                  </span>
                </div>
              </section>

              {/* SECTION 2: Streaming Services */}
              <section aria-labelledby='settings-streaming-heading' className='space-y-3.5'>
                <div className='flex items-center justify-between'>
                  <div className='flex items-center gap-2'>
                    <Tv className='h-4 w-4 text-primary shrink-0' aria-hidden='true' />
                    <h3
                      id='settings-streaming-heading'
                      className='text-sm font-bold uppercase tracking-wider text-foreground'>
                      Streaming Services ({region})
                    </h3>
                  </div>

                  {!allProvidersEnabled && (
                    <button
                      type='button'
                      onClick={selectAllProviders}
                      className='text-xs font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary rounded'>
                      Select all
                    </button>
                  )}
                </div>

                <p className='text-xs text-muted-foreground leading-relaxed'>
                  Choose which streaming services to display in movie details and in search filters.
                </p>

                {/* Master "All Providers" Option */}
                <div
                  className={`p-3 rounded-xl transition-colors ${
                    allProvidersEnabled
                      ? highContrast
                        ? "border-2 border-foreground bg-foreground text-background font-bold"
                        : "bg-primary/15 border border-primary/30 text-foreground"
                      : highContrast
                        ? "border-2 border-foreground bg-background text-foreground"
                        : "bg-muted/40 border border-border text-foreground hover:bg-muted/60"
                  }`}>
                  <label className='flex items-center justify-between gap-3 cursor-pointer select-none'>
                    <div className='flex items-center gap-2.5'>
                      <input
                        type='checkbox'
                        checked={allProvidersEnabled}
                        onChange={(e) => setAllProvidersEnabled(e.target.checked)}
                        className='h-4 w-4 rounded accent-primary cursor-pointer focus:ring-2 focus:ring-primary'
                        aria-label={`All providers in ${regionName}`}
                      />
                      <span className='text-sm font-bold'>All Providers in {regionName} (Default)</span>
                    </div>
                    {allProvidersEnabled && <span className='text-xs font-semibold opacity-90'>Active</span>}
                  </label>
                </div>

                {/* Individual Providers Checkbox Grid */}
                <div className='grid grid-cols-2 gap-2 pt-1'>
                  {availableProviders.map((provider) => {
                    const isChecked = allProvidersEnabled || selectedProviderIds.includes(provider.id);
                    return (
                      <label
                        key={provider.id}
                        className={`flex items-center gap-2.5 p-2.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors border select-none ${
                          isChecked
                            ? highContrast
                              ? "border-foreground bg-foreground text-background font-bold"
                              : "border-primary/40 bg-primary/10 text-foreground hover:bg-primary/20"
                            : highContrast
                              ? "border-foreground/50 bg-background text-foreground opacity-60"
                              : "border-border bg-card/60 text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                        }`}>
                        <input
                          type='checkbox'
                          checked={isChecked}
                          onChange={() => toggleProvider(provider.id)}
                          className='h-3.5 w-3.5 rounded accent-primary cursor-pointer focus:ring-2 focus:ring-primary'
                          aria-label={`Toggle ${provider.name}`}
                        />
                        <span className='truncate'>{provider.name}</span>
                      </label>
                    );
                  })}
                </div>
              </section>

              {/* DIVIDER */}
              <div
                className={`h-px w-full ${highContrast ? "bg-foreground" : "bg-border/70"}`}
                role='separator'
                aria-orientation='horizontal'
              />

              {/* SECTION 3: Privacy & Data Storage */}
              <section aria-labelledby='settings-privacy-heading' className='space-y-4'>
                <div className='flex items-center gap-2'>
                  <ShieldCheck className='h-4 w-4 text-emerald-500 shrink-0' aria-hidden='true' />
                  <h3
                    id='settings-privacy-heading'
                    className='text-sm font-bold uppercase tracking-wider text-foreground'>
                    Privacy & Stored Data
                  </h3>
                </div>

                <div
                  className={`p-3.5 rounded-xl text-xs space-y-2 leading-relaxed ${
                    highContrast
                      ? "border-2 border-foreground bg-background text-foreground"
                      : "bg-muted/40 border border-border/80 text-muted-foreground"
                  }`}>
                  <p className='font-semibold text-foreground'>No Tracking Cookies or External Data Profiling</p>
                  <p>
                    This application uses your browser's local storage (LocalStorage) strictly to remember your
                    preferences (theme, high-contrast mode, selected country, streaming filters, watchlist, and watched
                    movies).
                  </p>
                  <p>No cookies are set, no personal data is collected, and nothing is shared with third parties.</p>
                </div>

                {/* Clear Stored Data Area */}
                {!isConfirmingClear ? (
                  <div>
                    <Button
                      type='button'
                      variant='outline'
                      onClick={() => setIsConfirmingClear(true)}
                      className={`w-full h-10 rounded-xl font-bold text-xs gap-2 transition-all ${
                        highContrast
                          ? "border-2 border-foreground hover:bg-foreground hover:text-background"
                          : "border-red-500/30 text-red-600 dark:text-red-400 hover:bg-red-500/10 hover:border-red-500/50"
                      }`}>
                      <Trash2 className='h-4 w-4' aria-hidden='true' />
                      <span>Clear All Stored Data</span>
                    </Button>
                  </div>
                ) : (
                  <div
                    className={`p-4 rounded-xl space-y-3 animate-in fade-in zoom-in-95 duration-150 ${
                      highContrast
                        ? "border-2 border-foreground bg-foreground text-background font-bold"
                        : "border-2 border-red-500/60 bg-red-500/10 text-foreground"
                    }`}>
                    <div className='flex items-start gap-2.5'>
                      <AlertTriangle className='h-5 w-5 text-red-500 shrink-0 mt-0.5' aria-hidden='true' />
                      <div>
                        <h4 className='text-sm font-bold text-red-600 dark:text-red-400'>Confirm Data Clearance</h4>
                        <p className='text-xs text-muted-foreground mt-1'>
                          Are you sure you want to delete all stored data? This will clear your Watchlist, Watched
                          movies, custom reviews, and reset all settings to defaults. This action cannot be undone.
                        </p>
                      </div>
                    </div>

                    <div className='flex items-center gap-2 pt-1'>
                      <Button
                        type='button'
                        variant='destructive'
                        size='sm'
                        onClick={handleConfirmClear}
                        className='flex-1 font-bold text-xs h-9'>
                        Yes, Delete Everything
                      </Button>
                      <Button
                        type='button'
                        variant='ghost'
                        size='sm'
                        onClick={() => setIsConfirmingClear(false)}
                        className='font-bold text-xs h-9'>
                        Cancel
                      </Button>
                    </div>
                  </div>
                )}

                {clearSuccess && (
                  <div className='p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2'>
                    <Check className='h-4 w-4 shrink-0 text-emerald-500' />
                    <span>All local data has been successfully cleared.</span>
                  </div>
                )}
              </section>
            </div>

            {/* Panel Footer */}
            <div
              className={`p-2 border-t text-center text-[11px] text-muted-foreground ${
                highContrast ? "border-foreground bg-background" : "border-border/50 bg-card/60"
              }`}>
              {APP_NAME} • Version {APP_VERSION} • Data provided by TMDB & JustWatch
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
