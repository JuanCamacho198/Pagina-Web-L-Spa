import { describe, expect, test } from 'bun:test';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const profilePagePath = join(import.meta.dir, '../src/routes/[lang=lang]/perfil/+page.svelte');

function loadProfileSource(): string {
  return readFileSync(profilePagePath, 'utf8');
}

describe('profile logout parity contract', () => {
  test('uses localized logout toast keys', () => {
    const source = loadProfileSource();

    expect(source).toContain('auth.toast.logout.success.title');
    expect(source).toContain('auth.toast.logout.success.message');
    expect(source).toContain('auth.toast.logout.error.title');
    expect(source).toContain('auth.toast.logout.error.message');
  });

  test('preserves locale in logout redirect and avoids root hardcode', () => {
    const source = loadProfileSource();

    expect(source).toContain("goto(getLocalizedPath('/', activeLocale)");
    expect(source).not.toContain("goto('/')");
  });
});
