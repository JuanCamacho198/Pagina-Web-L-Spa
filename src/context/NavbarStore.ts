import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavbarSettings {
  logoUrl: string;
  brandText: string;
  showLogo: boolean;
  showText: boolean;
  setLogoUrl: (url: string) => void;
  setBrandText: (text: string) => void;
  setShowLogo: (show: boolean) => void;
  setShowText: (show: boolean) => void;
  reset: () => void;
}

const DEFAULT_SETTINGS = {
  logoUrl: '', // Si está vacío, usará el logo local por defecto
  brandText: 'L-SPA',
  showLogo: true,
  showText: true,
};

export const useNavbarStore = create<NavbarSettings>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setLogoUrl: (url) => set({ logoUrl: url }),
      setBrandText: (text) => set({ brandText: text }),
      setShowLogo: (show) => set({ showLogo: show }),
      setShowText: (show) => set({ showText: show }),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'navbar-settings',
    }
  )
);
