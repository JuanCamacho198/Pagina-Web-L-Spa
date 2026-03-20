<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import ServiceCard from '$lib/components/services/ServiceCard.svelte';
	import SearchBar from '$lib/components/forms/SearchBar.svelte';
	import Dropdown from '$lib/components/ui/Dropdown.svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Typography from '$lib/components/ui/Typography.svelte';
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import { Filter, SortAsc, ChevronDown } from 'lucide-svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { apiClient } from '$lib/api';
	import { _ } from 'svelte-i18n';
	import { page } from '$app/stores';
	import { getLocalizedPath } from '$lib/i18n/utils';
	import type { Service } from '@l-spa/shared-types';

	let currentLang = $derived($page.params.lang || 'es');

	let { data } = $props();
	
	const servicesQuery = createQuery(() => ({
		queryKey: ['services'],
		queryFn: () => apiClient.get<Service[]>('/services'),
		initialData: data?.services ?? [],
		staleTime: 1000 * 60 * 5,
	}));

	let services = $derived(servicesQuery.data || []);

	let searchTerm = $state('');
	// Use internal value 'all' to avoid i18n comparison issues
	let selectedCategory = $state('all');
	let sortOption = $state('default');

	const categories = $derived([$_('services.allCategories'), ...new Set(services.map((s) => s.category || 'General'))]);

	const filteredServices = $derived(
		services
			.filter((s) => {
				const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
				const matchesCategory = selectedCategory === 'all' || (s.category || 'General') === selectedCategory;
				return matchesSearch && matchesCategory;
			})
			.sort((a, b) => {
				if (sortOption === 'nameAsc') return a.name.localeCompare(b.name);
				if (sortOption === 'nameDesc') return b.name.localeCompare(a.name);
				if (sortOption === 'priceAsc') return Number(a.price) - Number(b.price);
				if (sortOption === 'priceDesc') return Number(b.price) - Number(a.price);
				return 0;
			})
	);

	const sortOptions = [
		{ label: $_('services.sort.featured'), value: 'default' },
		{ label: $_('services.sort.nameAsc'), value: 'nameAsc' },
		{ label: $_('services.sort.nameDesc'), value: 'nameDesc' },
		{ label: $_('services.sort.priceAsc'), value: 'priceAsc' },
		{ label: $_('services.sort.priceDesc'), value: 'priceDesc' }
	];

	const categoryDropdownItems = $derived(
		categories.map((cat: string) => ({
			label: cat,
			onClick: () => { 
				// Convert display name to internal value
				selectedCategory = cat === $_('services.allCategories') ? 'all' : cat; 
			}
		}))
	);

	// Get display label for selected category
	let selectedCategoryLabel = $derived(
		selectedCategory === 'all' ? $_('services.allCategories') : selectedCategory
	);

	const sortDropdownItems = $derived(
		sortOptions.map((opt) => ({
			label: opt.label,
			onClick: () => { sortOption = opt.value }
		}))
	);
</script>

<div class="servicios-page min-h-screen bg-linear-to-b from-white to-gray-50/50 flex flex-col pt-12 pb-24">
	<section class="max-w-7xl mx-auto px-6 lg:px-8 w-full">
        <!-- Breadcrumb -->
        <Breadcrumb items={[
          { label: $_('breadcrumbs.home'), href: getLocalizedPath('/', currentLang) },
          { label: $_('breadcrumbs.servicios') }
        ]} class="mb-8" />

        <!-- Header -->
        <div class="mb-16">
            <Typography variant="h1" class="text-gray-900 mb-4">{$_('services.title')}</Typography>
            <p class="text-gray-500 max-w-2xl font-medium">{$_('services.subtitle')}</p>
        </div>

		<!-- Filters -->
		<div
			class="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-primary/5 border border-white/50 p-8 mb-16 flex flex-col lg:flex-row gap-8 items-center justify-between transition-all duration-500 hover:shadow-primary/10"
		>
			<div class="w-full lg:max-w-md">
				<SearchBar bind:value={searchTerm} />
			</div>

				<div class="flex flex-wrap gap-4 w-full lg:w-auto items-center justify-center lg:justify-end">
				<!-- Category -->
				<div class="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-3xl border border-gray-100">
					<Filter size={20} class="text-primary" />
					<Dropdown items={categoryDropdownItems}>
						{#snippet trigger()}
							<span class="flex items-center gap-3 font-bold text-gray-700 text-sm py-1 px-2 outline-none cursor-pointer">
								{selectedCategoryLabel}
								<ChevronDown size={16} class="text-primary opacity-50" />
							</span>
						{/snippet}
					</Dropdown>
				</div>

				<!-- Sort -->
				<div class="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-3xl border border-gray-100">
					<SortAsc size={20} class="text-primary" />
					<Dropdown items={sortDropdownItems}>
						{#snippet trigger()}
							<span class="flex items-center gap-3 font-bold text-gray-700 text-sm py-1 px-2 outline-none cursor-pointer">
								{sortOptions.find((o) => o.value === sortOption)?.label || $_('services.sort.sortBy')}
								<ChevronDown size={16} class="text-primary opacity-50" />
							</span>
						{/snippet}
					</Dropdown>
				</div>
			</div>
		</div>

		{#if filteredServices.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
				{#each filteredServices as service (service.id)}
					<div class="animate-in fade-in zoom-in-95 duration-500">
						<ServiceCard {service} />
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
				<div class="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
					<Filter size={48} class="text-primary/20" />
				</div>
				<Typography variant="h3" class="text-gray-900 font-bold mb-4">{$_('services.noResults.title')}</Typography>
				<p class="text-gray-500 font-medium mb-10 max-w-md mx-auto">
					{$_('services.noResults.description').replace('{search}', searchTerm || '""').replace('{category}', selectedCategoryLabel)}
				</p>
				<Button
					onclick={() => {
						searchTerm = '';
						selectedCategory = 'all';
					}}
					class="rounded-2xl px-8 py-4 font-bold"
				>
					{$_('services.noResults.clearFilters')}
				</Button>
			</div>
		{/if}
	</section>
</div>
