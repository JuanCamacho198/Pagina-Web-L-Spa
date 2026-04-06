const SUPPORTED_LOCALES = ['en', 'es'] as const;
const DEFAULT_LOCALE = 'es';

export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

function normalizePath(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return cleanPath === '' ? '/' : cleanPath;
}

export function isValidLocale(locale: string): locale is SupportedLocale {
  return SUPPORTED_LOCALES.includes(locale as SupportedLocale);
}

export function normalizeLocale(locale?: string | null): SupportedLocale {
  if (!locale) return DEFAULT_LOCALE;
  return isValidLocale(locale) ? locale : DEFAULT_LOCALE;
}

export function extractLocaleFromPath(path: string): SupportedLocale | null {
  const normalized = normalizePath(path);
  const [segment] = normalized.split('/').filter(Boolean);
  if (!segment) return null;
  return isValidLocale(segment) ? segment : null;
}

export function stripLocaleFromPath(path: string): string {
  const normalized = normalizePath(path);
  const locale = extractLocaleFromPath(normalized);

  if (!locale) return normalized;

  const withoutLocale = normalized.replace(`/${locale}`, '');
  return withoutLocale === '' ? '/' : withoutLocale;
}

export function getLocalizedPath(path: string, lang: string): string {
  const locale = normalizeLocale(lang);
  const cleanPath = stripLocaleFromPath(path);

  if (cleanPath === '/') {
    return `/${locale}`;
  }

  return `/${locale}${cleanPath}`;
}

export function resolveActiveLocale(options: {
  urlLocale?: string | null;
  cookieLocale?: string | null;
}): SupportedLocale {
  if (options.urlLocale && isValidLocale(options.urlLocale)) {
    return options.urlLocale;
  }

  if (options.cookieLocale && isValidLocale(options.cookieLocale)) {
    return options.cookieLocale;
  }

  return DEFAULT_LOCALE;
}

export function normalizeLocalizedReturnTo(
  returnTo: string | null | undefined,
  fallbackLocale: string,
  fallbackPath = '/'
): string {
  const activeLocale = normalizeLocale(fallbackLocale);
  if (!returnTo) {
    return getLocalizedPath(fallbackPath, activeLocale);
  }

  const trimmed = returnTo.trim();
  if (trimmed === '' || trimmed.startsWith('//') || /^https?:\/\//i.test(trimmed)) {
    return getLocalizedPath(fallbackPath, activeLocale);
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed, 'http://local');
  } catch {
    return getLocalizedPath(fallbackPath, activeLocale);
  }

  const safePath = parsed.pathname.startsWith('/') ? parsed.pathname : '/';
  const localeInPath = extractLocaleFromPath(safePath);
  const query = parsed.search || '';
  const hash = parsed.hash || '';

  if (localeInPath) {
    return `${safePath}${query}${hash}`;
  }

  return `${getLocalizedPath(safePath, activeLocale)}${query}${hash}`;
}
