import { defineConfig } from 'vitest/config';

export default defineConfig({
  resolve: {
    alias: {
      'bun:test': 'vitest',
    },
  },
  test: {
    include: ['**/*.test.ts', '**/*.spec.ts', '**/*.test.mjs'],
    exclude: ['**/node_modules/**', '**/dist/**', '**/e2e/**'],
    environment: 'node',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.config.ts', '**/*.test.ts', '**/*.spec.ts']
    }
  }
});
