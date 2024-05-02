import { useState, useEffect } from "react";

/**
 * useLocalStorageState
 * Custom hook to manage state with localStorage persistence.
 * @param key The key to use for storing the state in localStorage.
 * @param defaultValue The default value to initialize the state with if no value is found in localStorage.
 * @returns A tuple containing the state value and a function to update the state.
 */
export const useLocalStorageState = <T extends unknown>(
  key: string,
  defaultValue: T,
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  // Retrieve the value from localStorage, or use the default value if not found.
  const [state, setState] = useState<T>(() => {
    if (typeof window !== "undefined") {
      const storedValue = localStorage.getItem(key);
      return storedValue ? JSON.parse(storedValue) : defaultValue;
    }
    return defaultValue;
  });

  // Update localStorage whenever the state changes.
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(key, JSON.stringify(state));
    }
  }, [key, state]);

  return [state, setState];
};

/**
 * useScoreFilters
 * Custom hook to manage and update score filters state.
 */
export const useScoreFilters = () => {
  const [guitarFilter, setGuitarFilter] = useState(false);
  const [bassFilter, setBassFilter] = useState(false);
  const [ukuleleFilter, setUkuleleFilter] = useState(false);
  const [hardModeFilter, setHardModeFilter] = useState(false);

  // Ensure only one instrument filter is active at any given time
  useEffect(() => {
    if (guitarFilter) {
      setBassFilter(false);
      setUkuleleFilter(false);
    } else if (bassFilter) {
      setGuitarFilter(false);
      setUkuleleFilter(false);
    } else if (ukuleleFilter) {
      setGuitarFilter(false);
      setBassFilter(false);
    }
  }, [guitarFilter, bassFilter, ukuleleFilter]);

  // Turn off all filters
  const resetFilters = () => {
    setGuitarFilter(false);
    setBassFilter(false);
    setUkuleleFilter(false);
    setHardModeFilter(false);
  };

  const filters = {
    guitar: guitarFilter,
    bass: bassFilter,
    ukulele: ukuleleFilter,
    hardMode: hardModeFilter,
  };

  const noActiveFilters =
    !guitarFilter && !bassFilter && !ukuleleFilter && !hardModeFilter;

  return {
    filters,
    noActiveFilters,
    setGuitarFilter,
    setBassFilter,
    setUkuleleFilter,
    setHardModeFilter,
    resetFilters,
  };
};

/**
 * useOnlineStatus
 * Custom hook to check if the user is connected to the internet.
 * $isOnline will change to false if the user goes offline and true if the user goes online.
 */
export const useOnlineStatus = () => {
  // Defaults to undefined - this is the 'loading' state
  const [isOnline, setIsOnline] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    // Only run in the client
    if (typeof window !== "undefined") {
      const handleOnlineStatus = () => {
        setIsOnline(navigator.onLine);
      };
      // Add event listeners
      window.addEventListener("online", handleOnlineStatus);
      window.addEventListener("offline", handleOnlineStatus);
      // Set online status on initial load
      setIsOnline(navigator.onLine);
      return () => {
        window.removeEventListener("online", handleOnlineStatus);
        window.removeEventListener("offline", handleOnlineStatus);
      };
    }
  }, []);

  return { isOnline };
};
