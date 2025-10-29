import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// --- Generic Type for items that can be tracked ---
type TrackableItem = {
  mal_id: number;
  [key: string]: any; // Allow other properties
};

const TRACKED_ANIME_KEY = 'tracked_anime_ids';

// --- Define the shape of the context data ---
interface TrackedAnimeContextType {
  trackedIds: string[];
  trackAnime: (id: string) => void;
  untrackAnime: (id: string) => void;
  isLoading: boolean;
  showTrackedOnly: boolean;
  setShowTrackedOnly: React.Dispatch<React.SetStateAction<boolean>>;
  getFilteredData: <T extends TrackableItem>(data: T[]) => T[];
}

// --- Create the context with a default value ---
const TrackedAnimeContext = createContext<TrackedAnimeContextType | undefined>(undefined);

// --- Create the Provider component ---
export const TrackedAnimeProvider = ({ children }: { children: ReactNode }) => {
  const [trackedIds, setTrackedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showTrackedOnly, setShowTrackedOnly] = useState(false);

  // Load tracked IDs from storage on initial app load
  useEffect(() => {
    const loadTrackedIds = async () => {
      try {
        const storedIds = await AsyncStorage.getItem(TRACKED_ANIME_KEY);
        if (storedIds !== null) {
          setTrackedIds(JSON.parse(storedIds));
        }
      } catch (error) {
        console.error('Failed to load tracked anime IDs from storage', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadTrackedIds();
  }, []);

  const trackAnime = useCallback((id: string) => {
    setTrackedIds(prevIds => {
      // Prevent adding duplicate IDs
      if (prevIds.includes(id)) {
        return prevIds;
      }
      const newTrackedIds = [...prevIds, id];
      // Update storage asynchronously
      AsyncStorage.setItem(TRACKED_ANIME_KEY, JSON.stringify(newTrackedIds)).catch(error => console.error("Failed to save tracked anime", error));
      return newTrackedIds;
    });
  }, []);

  const untrackAnime = useCallback((id: string) => {
    setTrackedIds(prevIds => {
      const newTrackedIds = prevIds.filter((trackedId) => trackedId !== id);
      // Update storage asynchronously
      AsyncStorage.setItem(TRACKED_ANIME_KEY, JSON.stringify(newTrackedIds)).catch(error => console.error("Failed to save tracked anime", error));
      return newTrackedIds;
    });
  }, []);

  const getFilteredData = useCallback(<T extends TrackableItem>(data: T[]): T[] => {
    if (showTrackedOnly) {
      return data.filter(item => trackedIds.includes(item.mal_id.toString()));
    }
    return data;
  }, [showTrackedOnly, trackedIds]);

  const value = useMemo(() => ({
    trackedIds,
    trackAnime,
    untrackAnime,
    isLoading,
    showTrackedOnly,
    setShowTrackedOnly,
    getFilteredData,
  }), [
    trackedIds, trackAnime, untrackAnime, isLoading, showTrackedOnly, setShowTrackedOnly, getFilteredData
  ]);

  return (
    <TrackedAnimeContext.Provider value={value}>
      {children}
    </TrackedAnimeContext.Provider>
  );
};

// --- Create the custom hook for easy consumption ---
export const useTrackedAnime = () => {
  const context = useContext(TrackedAnimeContext);
  if (context === undefined) {
    throw new Error('useTrackedAnime must be used within a TrackedAnimeProvider');
  }
  return context;
};