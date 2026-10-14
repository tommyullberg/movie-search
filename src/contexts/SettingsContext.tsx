import { createContext, useContext, useEffect, useState, ReactNode, useMemo } from 'react';
import {
  SUPPORTED_REGIONS,
  StreamingProvider,
  getProvidersForRegion,
  detectBrowserRegion,
} from '../config/regions';

interface SettingsContextType {
  region: string;
  regionName: string;
  regionFlag: string;
  allProvidersEnabled: boolean;
  selectedProviderIds: number[];
  isSettingsOpen: boolean;
  availableProviders: StreamingProvider[];
  activeProviders: StreamingProvider[];
  setRegion: (region: string) => void;
  setAllProvidersEnabled: (enabled: boolean) => void;
  toggleProvider: (providerId: number) => void;
  selectAllProviders: () => void;
  openSettings: () => void;
  closeSettings: () => void;
  toggleSettings: () => void;
  clearAllUserData: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const REGION_STORAGE_KEY = 'movie-search-region';

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [region, setRegionState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(REGION_STORAGE_KEY);
      if (saved && SUPPORTED_REGIONS.some((r) => r.code === saved)) {
        return saved;
      }
    } catch (e) {
      console.warn('Could not read saved region from localStorage', e);
    }
    return detectBrowserRegion();
  });

  const [allProvidersEnabled, setAllProvidersEnabledState] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(`movie-search-all-providers-${region}`);
      if (saved !== null) {
        return saved === 'true';
      }
    } catch (e) {
      console.warn('Could not read all providers preference', e);
    }
    return true; // Default is true ("All providers")
  });

  const [selectedProviderIds, setSelectedProviderIds] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(`movie-search-custom-providers-${region}`);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Could not read custom providers from localStorage', e);
    }
    return getProvidersForRegion(region).map((p) => p.id);
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Synchronize available and active providers when region changes
  const availableProviders = useMemo(() => {
    return getProvidersForRegion(region);
  }, [region]);

  const activeProviders = useMemo(() => {
    if (allProvidersEnabled) {
      return availableProviders;
    }
    return availableProviders.filter((p) => selectedProviderIds.includes(p.id));
  }, [availableProviders, allProvidersEnabled, selectedProviderIds]);

  // When changing region, update state and load that region's provider settings
  const handleSetRegion = (newRegion: string) => {
    setRegionState(newRegion);
    try {
      localStorage.setItem(REGION_STORAGE_KEY, newRegion);
      const savedAll = localStorage.getItem(`movie-search-all-providers-${newRegion}`);
      const isAll = savedAll !== null ? savedAll === 'true' : true;
      setAllProvidersEnabledState(isAll);

      const savedCustom = localStorage.getItem(`movie-search-custom-providers-${newRegion}`);
      if (savedCustom) {
        setSelectedProviderIds(JSON.parse(savedCustom));
      } else {
        setSelectedProviderIds(getProvidersForRegion(newRegion).map((p) => p.id));
      }
    } catch (e) {
      console.warn('Error saving region preference', e);
    }
  };

  const handleSetAllProvidersEnabled = (enabled: boolean) => {
    setAllProvidersEnabledState(enabled);
    try {
      localStorage.setItem(`movie-search-all-providers-${region}`, String(enabled));
      if (enabled) {
        setSelectedProviderIds(availableProviders.map((p) => p.id));
        localStorage.setItem(
          `movie-search-custom-providers-${region}`,
          JSON.stringify(availableProviders.map((p) => p.id))
        );
      }
    } catch (e) {
      console.warn('Error saving all providers preference', e);
    }
  };

  const handleToggleProvider = (providerId: number) => {
    let nextIds: number[];
    if (allProvidersEnabled) {
      // If was all enabled, deselecting this one makes it custom without this one
      nextIds = availableProviders.map((p) => p.id).filter((id) => id !== providerId);
      setAllProvidersEnabledState(false);
      try {
        localStorage.setItem(`movie-search-all-providers-${region}`, 'false');
      } catch (e) {
        console.warn(e);
      }
    } else {
      if (selectedProviderIds.includes(providerId)) {
        nextIds = selectedProviderIds.filter((id) => id !== providerId);
      } else {
        nextIds = [...selectedProviderIds, providerId];
        // If all available are now selected, mark all enabled
        if (availableProviders.every((p) => nextIds.includes(p.id))) {
          setAllProvidersEnabledState(true);
          try {
            localStorage.setItem(`movie-search-all-providers-${region}`, 'true');
          } catch (e) {
            console.warn(e);
          }
        }
      }
    }

    setSelectedProviderIds(nextIds);
    try {
      localStorage.setItem(`movie-search-custom-providers-${region}`, JSON.stringify(nextIds));
    } catch (e) {
      console.warn('Error saving custom provider IDs', e);
    }
  };

  const handleSelectAllProviders = () => {
    handleSetAllProvidersEnabled(true);
  };

  const clearAllUserData = () => {
    try {
      // Clear known local storage keys
      const keysToRemove = [
        'movie-search-watchlist',
        'movie-search-watched',
        'movie-search-reviews',
        'movie-search-library-sort',
        'movie-search-region',
        'movie-search-advanced-open',
        'app-theme',
        'app-high-contrast',
      ];
      keysToRemove.forEach((k) => localStorage.removeItem(k));

      // Remove any provider preferences
      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key && (key.startsWith('movie-search-all-providers-') || key.startsWith('movie-search-custom-providers-'))) {
          localStorage.removeItem(key);
        }
      }

      // Reset internal settings to defaults
      const defaultRegion = detectBrowserRegion();
      setRegionState(defaultRegion);
      setAllProvidersEnabledState(true);
      setSelectedProviderIds(getProvidersForRegion(defaultRegion).map((p) => p.id));

      // Dispatch storage event so other contexts know
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error('Failed to clear user data', e);
    }
  };

  const currentRegionMeta = useMemo(() => {
    return (
      SUPPORTED_REGIONS.find((r) => r.code === region) || {
        code: region,
        name: region,
        nativeName: region,
        flag: '🌐',
      }
    );
  }, [region]);

  return (
    <SettingsContext.Provider
      value={{
        region,
        regionName: currentRegionMeta.name,
        regionFlag: currentRegionMeta.flag,
        allProvidersEnabled,
        selectedProviderIds,
        isSettingsOpen,
        availableProviders,
        activeProviders,
        setRegion: handleSetRegion,
        setAllProvidersEnabled: handleSetAllProvidersEnabled,
        toggleProvider: handleToggleProvider,
        selectAllProviders: handleSelectAllProviders,
        openSettings: () => setIsSettingsOpen(true),
        closeSettings: () => setIsSettingsOpen(false),
        toggleSettings: () => setIsSettingsOpen((prev) => !prev),
        clearAllUserData,
      }}
    >
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
