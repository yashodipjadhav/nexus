import { useEffect, useState } from "react";

/**
 * Custom hook to debounce fast changing values (e.g. search queries)
 * @param {any} value
 * @param {number} delay in milliseconds
 * @returns {any} debounced value
 */
export default function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}
