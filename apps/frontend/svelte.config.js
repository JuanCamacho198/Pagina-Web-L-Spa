import adapter from '@sveltejs/adapter-vercel';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			runtime: 'nodejs22.x'
		}),
		alias: {
			$components: 'src/lib/components',
			$assets: 'src/lib/assets',
			$actions: 'src/lib/actions',
			$stores: 'src/lib/stores',
			$utils: 'src/lib/utils'
		},
		prerender: {
			entries: ['/[lang]', '/[lang]/servicios', '/[lang]/politicas']
		}
	}
};

export default config;
