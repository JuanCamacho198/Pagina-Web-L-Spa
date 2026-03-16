import { apiClient } from '$lib/api';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
  try {
    // Intentamos cargar la configuración global (Footer, Logos, etc)
    // El endpoint real es /config/:id, usamos 'footer' como fallback o 'global'
    const siteConfig = await apiClient.get('/config/footer').catch(() => null);
    return {
      siteConfig: siteConfig || {
        title: 'L-SPA',
        footer: 'Bienestar y relajación total.'
      }
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
