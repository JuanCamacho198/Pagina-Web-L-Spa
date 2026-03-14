import { browser } from '$app/environment';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'lspa-theme';

function getSystemPreference(): Theme {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function getStoredTheme(): Theme | null {
  if (!browser) return null;
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return null;
}

export function getTheme(): Theme {
  return getStoredTheme() ?? getSystemPreference();
}

export function setTheme(theme: Theme): void {
  if (!browser) return;
  localStorage.setItem(STORAGE_KEY, theme);
  applyTheme(theme);
}

export function toggleTheme(): Theme {
  const current = getTheme();
  const newTheme: Theme = current === 'dark' ? 'light' : 'dark';
  setTheme(newTheme);
  return newTheme;
}

export function applyTheme(theme: Theme): void {
  if (!browser) return;
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
}

export function initTheme(): void {
  if (!browser) return;
  const theme = getTheme();
  applyTheme(theme);
}
