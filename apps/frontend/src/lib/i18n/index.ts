import { browser } from '$app/environment';
import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('es', () => import('./locales/es.json'));

const defaultLocale = 'es';

init({
	fallbackLocale: defaultLocale,
	initialLocale: browser ? getLocaleFromNavigator() : defaultLocale,
});
