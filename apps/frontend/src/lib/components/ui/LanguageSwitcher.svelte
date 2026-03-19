<script lang="ts">
	import { locale } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';

	let isOpen = $state(false);
	let dropdownRef: HTMLDivElement;

	const locales = [
		{ code: 'es', name: 'Español', flag: '🇪🇸' },
		{ code: 'en', name: 'English', flag: '🇺🇸' }
	];

	// Get current locale safely
	function getCurrentLocale() {
		const current = $locale;
		return locales.find((l) => l.code === current) || locales[0];
	}

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

	function toggleDropdown() {
		isOpen = !isOpen;
	}

	function handleClickOutside(event: MouseEvent) {
		if (isOpen && dropdownRef && !dropdownRef.contains(event.target as Node)) {
			isOpen = false;
		}
	}
</script>

<svelte:window onclick={handleClickOutside} />

<div class="language-switcher relative" bind:this={dropdownRef}>
	<button
		type="button"
		class="flex items-center justify-center w-10 h-10 text-lg rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
		onclick={toggleDropdown}
		aria-label="Change language"
		aria-expanded={isOpen}
		aria-haspopup="listbox"
	>
		{getCurrentLocale().flag}
	</button>

	{#if isOpen}
		<div
			role="listbox"
			class="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-2 z-9999"
			transition:fade={{ duration: 150 }}
		>
			{#each locales as loc}
				<button
					type="button"
					role="option"
					aria-selected={loc.code === $locale}
					class="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-primary/5 dark:hover:bg-gray-700 transition-colors {loc.code === $locale ? 'bg-primary/10 font-semibold text-primary' : 'text-gray-700 dark:text-gray-200'}"
					onclick={() => switchLanguage(loc.code)}
				>
					<span class="text-xl">{loc.flag}</span>
					<span>{loc.name}</span>
					{#if loc.code === $locale}
						<svg class="ml-auto w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
							<path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
						</svg>
					{/if}
				</button>
			{/each}
		</div>
	{/if}
</div>

<style>
	.language-switcher {
		position: relative;
	}
</style>