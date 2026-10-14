import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ChevronDown, Check, X } from 'lucide-react';
import { SUPPORTED_REGIONS } from '../../config/regions';
import { useTheme } from '../../contexts/ThemeContext';

export function CountryFlag({
  code,
  name,
  className = 'w-5 h-3.5',
}: {
  code: string;
  name: string;
  className?: string;
}) {
  const [error, setError] = useState(false);
  const lowerCode = code.toLowerCase();

  if (error) {
    return (
      <span className="text-[10px] font-bold opacity-80 shrink-0" aria-hidden="true">
        [{code}]
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/28x21/${lowerCode}.png`}
      srcSet={`https://flagcdn.com/56x42/${lowerCode}.png 2x`}
      width="20"
      height="15"
      alt=""
      aria-hidden="true"
      loading="lazy"
      onError={() => setError(true)}
      className={`rounded-2xs object-cover inline-block shrink-0 border border-black/15 dark:border-white/20 shadow-2xs ${className}`}
    />
  );
}

interface RegionComboboxProps {
  value: string;
  onChange: (regionCode: string) => void;
  id?: string;
}

export function RegionCombobox({ value, onChange, id = 'region-combobox' }: RegionComboboxProps) {
  const { highContrast } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const listboxId = `${id}-listbox`;

  const selectedRegion = SUPPORTED_REGIONS.find((r) => r.code === value) || SUPPORTED_REGIONS[0];

  const filteredRegions = SUPPORTED_REGIONS.filter((r) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      r.name.toLowerCase().includes(q) ||
      r.nativeName.toLowerCase().includes(q) ||
      r.code.toLowerCase().includes(q)
    );
  });

  // Focus search input when combobox opens
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 40);
      return () => clearTimeout(timer);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Click outside listener
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Escape key capture when combobox is open: close combobox only without closing parent drawer
  useEffect(() => {
    if (!isOpen) return;

    const handleEscapeCapture = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleEscapeCapture, true);
    return () => window.removeEventListener('keydown', handleEscapeCapture, true);
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(false);
      triggerRef.current?.focus();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredRegions.length - 1 ? prev + 1 : 0));
      return;
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredRegions.length - 1));
      return;
    }

    if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < filteredRegions.length) {
      e.preventDefault();
      const chosen = filteredRegions[highlightedIndex];
      if (chosen) {
        onChange(chosen.code);
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const selectRegion = (code: string) => {
    onChange(code);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  return (
    <div ref={containerRef} className="relative w-full" onKeyDown={handleKeyDown}>
      {/* Combobox Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        id={id}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label={`Select country. Current country is ${selectedRegion.name}`}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`w-full h-11 px-3.5 flex items-center justify-between text-sm font-semibold rounded-xl transition-all cursor-pointer outline-none focus-visible:ring-2 ${
          highContrast
            ? 'border-2 border-foreground bg-background text-foreground focus-visible:ring-foreground'
            : isOpen
              ? 'border-primary ring-2 ring-primary/20 bg-background text-foreground'
              : 'border border-border bg-muted/40 hover:bg-muted/70 text-foreground focus-visible:ring-primary focus-visible:border-primary'
        }`}
      >
        <div className="flex items-center gap-2.5 truncate">
          <CountryFlag code={selectedRegion.code} name={selectedRegion.name} className="w-5 h-3.5 shadow-2xs" />
          <span className="truncate">{selectedRegion.name}</span>
          <span className="text-xs font-normal text-muted-foreground shrink-0">({selectedRegion.code})</span>
        </div>
        <ChevronDown
          className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-foreground' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Combobox Dropdown Popover */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className={`absolute left-0 right-0 top-full mt-1.5 z-50 rounded-xl overflow-hidden shadow-2xl ${
              highContrast
                ? 'border-2 border-foreground bg-background text-foreground'
                : 'border border-border bg-popover text-popover-foreground shadow-emerald-950/25'
            }`}
          >
            {/* Search Input Filter */}
            <div className={`p-2 border-b flex items-center gap-2 ${
              highContrast ? 'border-foreground bg-background' : 'border-border/60 bg-muted/30'
            }`}>
              <Search className="h-4 w-4 shrink-0 text-muted-foreground ml-1" aria-hidden="true" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
                placeholder="Search country or code..."
                aria-label="Search country or country code"
                className="w-full bg-transparent text-xs sm:text-sm font-medium placeholder:text-muted-foreground focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    searchInputRef.current?.focus();
                  }}
                  aria-label="Clear search"
                  className="p-1 rounded-md text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            {/* Countries List */}
            <ul
              ref={listRef}
              id={listboxId}
              role="listbox"
              aria-label="Countries and regions"
              className="max-h-60 overflow-y-auto p-1 divide-y divide-border/20 focus:outline-none"
            >
              {filteredRegions.length === 0 ? (
                <li className="px-3 py-6 text-center text-xs text-muted-foreground">
                  No countries found matching "{searchQuery}"
                </li>
              ) : (
                filteredRegions.map((r, index) => {
                  const isSelected = r.code === value;
                  const isHighlighted = index === highlightedIndex;

                  return (
                    <li
                      key={r.code}
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => selectRegion(r.code)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      className={`flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg cursor-pointer transition-colors ${
                        isSelected
                          ? highContrast
                            ? 'bg-foreground text-background font-bold'
                            : 'bg-primary/15 text-primary font-bold'
                          : isHighlighted
                            ? highContrast
                              ? 'bg-foreground/20 text-foreground'
                              : 'bg-muted text-foreground'
                            : 'text-foreground/90 hover:bg-muted'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <CountryFlag code={r.code} name={r.name} className="w-5 h-3.5 shadow-2xs" />
                        <span className="truncate">{r.name}</span>
                        {r.nativeName && r.nativeName !== r.name && (
                          <span className="text-[11px] font-normal text-muted-foreground truncate hidden sm:inline">
                            • {r.nativeName}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                          ({r.code})
                        </span>
                      </div>

                      {isSelected && (
                        <Check className="h-4 w-4 shrink-0 text-primary ml-2" aria-hidden="true" />
                      )}
                    </li>
                  );
                })
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
