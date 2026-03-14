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
  
  // Smooth transition: fade out briefly, change class, fade in
  const html = document.documentElement;
  
  html.style.transition = 'none';
  html.classList.remove('light', 'dark');
  html.classList.add(theme);
  
  // Force reflow to apply the class change
  void html.offsetHeight;
  
  // Restore transitions with a smooth animation
  html.style.transition = 'background-color 0.3s ease, color 0.3s ease';
}

export function initTheme(): void {
  if (!browser) return;
  const theme = getTheme();
  applyTheme(theme);
}
