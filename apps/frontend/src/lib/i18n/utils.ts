const SUPPORTED_LOCALES = ['en', 'es'] as const;

export function getLocalizedPath(path: string, lang: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `/${lang}${cleanPath}`;
}

export function isValidLocale(locale: string): boolean {
  return SUPPORTED_LOCALES.includes(locale as typeof SUPPORTED_LOCALES[number]);
}
