import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

type LocaleTree = Record<string, unknown>;

function loadLocale(locale: 'en' | 'es'): LocaleTree {
  const filePath = join(import.meta.dir, `../src/lib/i18n/locales/${locale}.json`);
  return JSON.parse(readFileSync(filePath, 'utf8')) as LocaleTree;
}

function getPathValue(root: LocaleTree, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object' && key in (acc as Record<string, unknown>)) {
      return (acc as Record<string, unknown>)[key];
    }
    return undefined;
  }, root);
}

describe('auth toast i18n contract', () => {
  const requiredPaths = [
    'auth.toast.login.error.invalidCredentials',
    'auth.toast.login.error.emailNotVerified',
    'auth.toast.login.error.rateLimited',
    'auth.toast.login.error.server',
    'auth.toast.register.error.emailInUse',
    'auth.toast.register.error.weakPassword',
    'auth.toast.register.error.rateLimited',
    'auth.toast.register.error.server',
    'auth.toast.logout.success.title',
    'auth.toast.logout.success.message',
    'auth.toast.logout.error.title',
    'auth.toast.logout.error.message'
  ] as const;

  test('english locale provides all required auth toast keys', () => {
    const en = loadLocale('en');

    for (const path of requiredPaths) {
      const value = getPathValue(en, path);
      expect(typeof value).toBe('string');
      expect((value as string).length).toBeGreaterThan(0);
    }
  });

  test('spanish locale provides all required auth toast keys', () => {
    const es = loadLocale('es');

    for (const path of requiredPaths) {
      const value = getPathValue(es, path);
      expect(typeof value).toBe('string');
      expect((value as string).length).toBeGreaterThan(0);
    }
  });
});
