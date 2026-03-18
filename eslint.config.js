import tseslint from 'typescript-eslint';
import eslint from '@eslint/js';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    ignores: [
      'node_modules/',
      'dist/',
      'build/',
      '.svelte-kit/',
      'bun.lock',
      '*.lock',
      '.svelte-kit',
      'apps/backend/dist',
      'apps/frontend/dist'
    ]
  },
  {
    files: ['apps/**/*.ts'],
    ignores: ['apps/backend/dist/**', 'apps/frontend/dist/**']
  }
);