<script lang="ts">
	import { locale, locales } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	const switchLanguage = (newLocale: string) => {
		locale.set(newLocale);
		
		// Optional: update URL if using [[lang=lang]] routing strategy
		const path = $page.url.pathname;
		const segments = path.split('/').filter(Boolean);
		
		if (segments[0] === 'en' || segments[0] === 'es') {
			segments[0] = newLocale;
		} else {
			segments.unshift(newLocale);
		}
		
		// Keep the query parameters
		goto(`/${segments.join('/')}${$page.url.search}`, { invalidateAll: true });
	};
</script>

<div class="flex items-center space-x-2">
	<button 
		class="px-2 py-1 text-sm rounded hover:bg-gray-200 {$locale === 'es' ? 'font-bold underline' : ''}" 
		on:click={() => switchLanguage('es')}
	>
		ES
	</button>
	<span>|</span>
	<button 
		class="px-2 py-1 text-sm rounded hover:bg-gray-200 {$locale === 'en' ? 'font-bold underline' : ''}" 
		on:click={() => switchLanguage('en')}
	>
		EN
	</button>
</div>
