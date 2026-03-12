import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
	plugins: [
		sveltekit(),
		tailwindcss()
	],
	ssr: {
		noExternal: ['better-auth', '@better-auth/utils', 'better-auth/svelte', '@better-auth/core', '@better-auth/infra']
	}
});
