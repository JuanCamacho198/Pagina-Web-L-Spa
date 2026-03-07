import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface NavbarSettings {
  logoUrl: string;
  brandText: string;
  showLogo: boolean;
  showText: boolean;
  logoSize: number;
  textSize: number;
  fontFamily: string;
  customFontUrl: string;
  setLogoUrl: (url: string) => void;
  setBrandText: (text: string) => void;
  setShowLogo: (show: boolean) => void;
  setShowText: (show: boolean) => void;
  setLogoSize: (size: number) => void;
  setTextSize: (size: number) => void;
  setFontFamily: (font: string) => void;
  setCustomFontUrl: (url: string) => void;
  reset: () => void;
}

const DEFAULT_SETTINGS = {
  logoUrl: '', // Si está vacío, usará el logo local por defecto
  brandText: 'L-SPA',
  showLogo: true,
  showText: true,
  logoSize: 40,
  textSize: 24,
  fontFamily: 'sans',
  customFontUrl: '',
};

export const useNavbarStore = create<NavbarSettings>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      setLogoUrl: (url) => set({ logoUrl: url }),
      setBrandText: (text) => set({ brandText: text }),
      setShowLogo: (show) => set({ showLogo: show }),
      setShowText: (show) => set({ showText: show }),
      setLogoSize: (size) => set({ logoSize: size }),
      setTextSize: (size) => set({ textSize: size }),
      setFontFamily: (font) => set({ fontFamily: font }),
      setCustomFontUrl: (url) => set({ customFontUrl: url }),
      reset: () => set(DEFAULT_SETTINGS),
    }),
    {
      name: 'navbar-settings',
    }
  )
);
