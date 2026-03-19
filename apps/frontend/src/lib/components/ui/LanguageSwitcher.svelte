<script lang="ts">
	import { locale } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade, scale } from 'svelte/transition';
	import { getLocalizedPath } from '$lib/i18n/utils';

	let isOpen = $state(false);

	const locales = [
		{ code: 'es', name: 'Español', flag: '🇪🇸' },
		{ code: 'en', name: 'English', flag: '🇬🇧' }
	];

	let currentLocale = $derived(locales.find((l) => l.code === $locale) || locales[0]);

	function switchLanguage(newLocale: string) {
		locale.set(newLocale);
		document.cookie = `lang=${newLocale}; path=/; max-age=31536000`;

		const path = $page.url.pathname;
		const segments = path.split('/').filter(Boolean);

		if (segments[0] === 'en' || segments[0] === 'es') {
			segments[0] = newLocale;
		} else {
			segments.unshift(newLocale);
		}

		goto(`/${segments.join('/')}${$page.url.search}`, { invalidateAll: true });
		isOpen = false;
	}

	function handleClickOutside(event: MouseEvent) {
		const target = event.target as HTMLElement;
		if (isOpen && !target.closest('.language-switcher')) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="language-switcher relative">
	<button
		type="button"
		class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
		onclick={(e) => { e.stopPropagation(); isOpen = !isOpen; }}
		aria-label="Cambiar idioma"
		aria-expanded={isOpen}
	>
		<span class="text-lg">{currentLocale.flag}</span>
		<span class="font-medium">{currentLocale.code.toUpperCase()}</span>
		<svg
			class="w-4 h-4 transition-transform duration-200 {isOpen ? 'rotate-180' : ''}"
			fill="none"
			stroke="currentColor"
			viewBox="0 0 24 24"
		>
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
		</svg>
	</button>

	{#if isOpen}
		<div
			class="absolute right-0 top-full mt-2 w-40 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-1 z-50"
			transition:fade={{ duration: 150 }}
		>
			{#each locales as loc}
				<button
					type="button"
					class="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors {loc.code === $locale ? 'bg-gray-50 dark:bg-gray-700 font-medium' : ''}"
					onclick={() => switchLanguage(loc.code)}
				>
					<span class="text-lg">{loc.flag}</span>
					<span>{loc.name}</span>
				</button>
			{/each}
		</div>
	{/if}
</div>