import { useEffect, useState } from 'react';

export function useTheme(storageKey = 'app-theme') {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  useEffect(() => {
    let preferredTheme: 'light' | 'dark' = document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored === 'light' || stored === 'dark') preferredTheme = stored;
    } catch { /* Theme switching still works when storage is unavailable. */ }
    setTheme(preferredTheme);
    document.documentElement.dataset.theme = preferredTheme;
  }, [storageKey]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    try { localStorage.setItem(storageKey, nextTheme); } catch { /* Storage can be blocked by the browser. */ }
  };
  return { theme, toggleTheme };
}
