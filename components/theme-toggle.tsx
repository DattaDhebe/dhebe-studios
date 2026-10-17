'use client';

import { useTheme } from '@/lib/hooks/useTheme';
import { UiIcon } from './ui-icon';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={theme === 'dark'}
      className="icon-button theme-toggle"
    >
      <UiIcon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}
