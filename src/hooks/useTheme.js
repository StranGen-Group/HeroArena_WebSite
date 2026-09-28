import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'theme';

const initialTheme = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  } catch (e) {
    // private mode/blocked storage, or no matchMedia support — fail safe to light
    return 'light';
  }
};

const useTheme = () => {
  const [theme, setTheme] = useState(initialTheme);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((current) => {
      const next = current === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        // storage unavailable — the attribute still flips for this session
      }
      return next;
    });
  }, []);

  return { theme, toggleTheme };
};

export default useTheme;
