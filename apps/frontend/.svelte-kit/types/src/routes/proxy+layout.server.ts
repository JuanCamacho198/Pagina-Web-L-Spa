// @ts-nocheck
import { apiFetch } from '$lib/utils/api';
import type { LayoutServerLoad } from './$types';

export const load = async () => {
  try {
    // Intentamos cargar la configuración global (Footer, Logos, etc)
    const siteConfig = await apiFetch('/config/global');
    return {
      siteConfig
    };
  } catch (err) {
    console.error('Error loading global site config:', err);
    return {
      siteConfig: {
        title: 'L-SPA',
        footer: 'Bienestar y relajación total.'
      }
    };
  }
};
;null as any as LayoutServerLoad;