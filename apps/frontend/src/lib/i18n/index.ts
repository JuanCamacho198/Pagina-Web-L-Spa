import { browser } from '$app/environment';
import { init, register, getLocaleFromNavigator } from 'svelte-i18n';

register('en', () => import('./locales/en.json'));
register('es', () => import('./locales/es.json'));

const defaultLocale = 'es';

function getInitialLocale(): string {
	if (!browser) return defaultLocale;
	const navLang = navigator.language.slice(0, 2);
	return navLang === 'es' || navLang === 'en' ? navLang : defaultLocale;
}

init({
	fallbackLocale: defaultLocale,
	initialLocale: getInitialLocale(),
});
