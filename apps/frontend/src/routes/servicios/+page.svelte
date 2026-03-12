<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils/cn';
	import ServiceCard from '$components/ServiceCard.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import Dropdown from '$components/Dropdown.svelte';
	import Button from '$components/Button.svelte';
	import Typography from '$components/Typography.svelte';
	import Skeleton from '$components/Skeleton.svelte';
	import { Filter, SortAsc, ChevronDown, Sparkles } from 'lucide-svelte';

	let { data } = $props();
	let services = $derived(data.services || []);

	let searchTerm = $state('');
	let selectedCategory = $state('Todos');
	let sortOption = $state('default');

	const categories = $derived(services.length > 0 ? ['Todos', ...new Set(services.map((s) => s.category || 'Sin Categoría'))] : ['Todos']);

	const filteredServices = $derived(
		services
			.filter((s) => {
				const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
				const matchesCategory = selectedCategory === 'Todos' || (s.category || 'Sin Categoría') === selectedCategory;
				return matchesSearch && matchesCategory;
			})
			.sort((a, b) => {
				if (sortOption === 'nombre-asc') return a.name.localeCompare(b.name);
				if (sortOption === 'nombre-desc') return b.name.localeCompare(a.name);
				if (sortOption === 'precio-asc') return Number(a.price) - Number(b.price);
				if (sortOption === 'precio-desc') return Number(b.price) - Number(a.price);
				return 0;
			})
	);

	let isCatOpen = $state(false);
	let isSortOpen = $state(false);

	const sortOptions = [
		{ label: 'Destacados', value: 'default' },
		{ label: 'Nombre A-Z', value: 'nombre-asc' },
		{ label: 'Nombre Z-A', value: 'nombre-desc' },
		{ label: 'Precio: Menor a Mayor', value: 'precio-asc' },
		{ label: 'Precio: Mayor a Menor', value: 'precio-desc' }
	];

	function handleCatClick(cat) {
		selectedCategory = cat;
		isCatOpen = false;
	}

	function handleSortClick(value) {
		sortOption = value;
		isSortOpen = false;
	}

	const categoryDropdownItems = $derived(
		categories.map((cat) => ({
			label: cat,
			onClick: () => handleCatClick(cat)
		}))
	);

	const sortDropdownItems = $derived(
		sortOptions.map((opt) => ({
			label: opt.label,
			onClick: () => handleSortClick(opt.value)
		}))
	);

	function closeAll() {
		isCatOpen = false;
		isSortOpen = false;
	}
</script>

<div class="min-h-screen bg-white/50 flex flex-col pt-12">
	<section class="max-w-7xl mx-auto px-6 lg:px-8 w-full pb-24">
		<!-- Filters -->
		<div
			class="bg-white/80 backdrop-blur-2xl rounded-[40px] shadow-2xl shadow-primary/5 border border-white/50 p-8 mb-16 flex flex-col lg:flex-row gap-8 items-center justify-between transition-all hover:shadow-primary/10"
		>
			<div class="w-full lg:max-w-md">
				<SearchBar bind:value={searchTerm} placeholder="¿Qué experiencia buscas?..." />
			</div>

			<div class="flex flex-wrap gap-4 w-full lg:w-auto items-center justify-center lg:justify-end">
				<!-- Category -->
				<div class="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-3xl border border-gray-100">
					<Filter size={20} class="text-primary" />
					<Dropdown items={categoryDropdownItems}>
						{#snippet trigger()}
							<button class="flex items-center gap-3 font-bold text-gray-700 text-sm py-1 px-2 outline-none cursor-pointer">
								{selectedCategory}
								<ChevronDown size={16} class="text-primary opacity-50" />
							</button>
						{/snippet}
					</Dropdown>
				</div>

				<!-- Sort -->
				<div class="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-3xl border border-gray-100">
					<SortAsc size={20} class="text-primary" />
					<Dropdown items={sortDropdownItems}>
						{#snippet trigger()}
							<button class="flex items-center gap-3 font-bold text-gray-700 text-sm py-1 px-2 outline-none cursor-pointer">
								{sortOptions.find((o) => o.value === sortOption)?.label || 'Ordenar'}
								<ChevronDown size={16} class="text-primary opacity-50" />
							</button>
						{/snippet}
					</Dropdown>
				</div>
			</div>
		</div>

		<!-- Services Grid -->
		{#if filteredServices.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
				{#each filteredServices as service (service.id)}
					<div class="animate-in fade-in zoom-in-95 duration-500">
						<ServiceCard {service} />
					</div>
				{/each}
			</div>
		{:else}
			<!-- No results -->
			<div class="text-center py-32 bg-white rounded-[40px] border border-gray-100 shadow-sm">
				<div class="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center mx-auto mb-8">
					<Filter size={48} class="text-primary/20" />
				</div>
				<Typography variant="h3" class="text-gray-900 font-bold mb-4">No encontramos servicios</Typography>
				<p class="text-gray-500 font-medium mb-10 max-w-md mx-auto">
					No hay resultados para "{searchTerm}" en {selectedCategory}. Intenta con otros filtros.
				</p>
				<Button
					onclick={() => {
						searchTerm = '';
						selectedCategory = 'Todos';
					}}
					class="rounded-2xl px-8 py-4 font-bold"
				>
					Limpiar Filtros
				</Button>
			</div>
		{/if}
	</section>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 0% 0%, hsla(327, 67%, 33%, 0.03) 0, transparent 50%),
			radial-gradient(at 50% 0%, hsla(327, 67%, 33%, 0.02) 0, transparent 50%),
			radial-gradient(at 100% 0%, hsla(327, 67%, 33%, 0.03) 0, transparent 50%);
		background-attachment: fixed;
	}
</style>
