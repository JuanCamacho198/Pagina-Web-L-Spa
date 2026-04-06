import { describe, expect, test } from 'bun:test';
import {
  extractLocaleFromPath,
  getLocalizedPath,
  normalizeLocalizedReturnTo,
  resolveActiveLocale,
  stripLocaleFromPath
} from '../../../src/lib/i18n/utils';

describe('i18n utils', () => {
  test('getLocalizedPath keeps one locale prefix', () => {
    expect(getLocalizedPath('/login', 'es')).toBe('/es/login');
    expect(getLocalizedPath('/en/login', 'es')).toBe('/es/login');
    expect(getLocalizedPath('/', 'en')).toBe('/en');
  });

  test('extractLocaleFromPath and stripLocaleFromPath work with locale routes', () => {
    expect(extractLocaleFromPath('/es/login')).toBe('es');
    expect(extractLocaleFromPath('/admin')).toBeNull();
    expect(stripLocaleFromPath('/en/registro')).toBe('/registro');
    expect(stripLocaleFromPath('/')).toBe('/');
  });

  test('resolveActiveLocale follows url > cookie > es precedence', () => {
    expect(resolveActiveLocale({ urlLocale: 'en', cookieLocale: 'es' })).toBe('en');
    expect(resolveActiveLocale({ urlLocale: 'pt', cookieLocale: 'en' })).toBe('en');
    expect(resolveActiveLocale({ urlLocale: undefined, cookieLocale: 'pt' })).toBe('es');
  });

  test('normalizeLocalizedReturnTo keeps safe locale and blocks external redirects', () => {
    expect(normalizeLocalizedReturnTo('/en/perfil?tab=1', 'es', '/')).toBe('/en/perfil?tab=1');
    expect(normalizeLocalizedReturnTo('/perfil?tab=1', 'es', '/')).toBe('/es/perfil?tab=1');
    expect(normalizeLocalizedReturnTo('https://evil.com', 'en', '/')).toBe('/en');
    expect(normalizeLocalizedReturnTo('//evil.com/path', 'es', '/login')).toBe('/es/login');
  });
});
