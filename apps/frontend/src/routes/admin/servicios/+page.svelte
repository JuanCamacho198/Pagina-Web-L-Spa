<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, Plus, Edit, Trash2, Eye, Clock, Star, ToggleLeft, ToggleRight, Loader2, X } from 'lucide-svelte';
	import { adminApi, type Service } from '$lib/api/admin';
	import Skeleton from 'boneyard-js/svelte';

	// Data from API
	let services: Service[] = $state([]);
	let loading = $state(true);
	let actionLoading = $state<string | null>(null);

	// Filters
	let searchQuery = $state('');
	let selectedCategory = $state('all');

	// Modal state
	let showModal = $state(false);
	let editingService = $state<Service | null>(null);
	let saving = $state(false);

	// Form data
	let formData = $state({
		name: '',
		description: '',
		price: 0,
		duration: 60,
		category: 'masajes',
		imageUrl: '',
		active: true
	});

	// Categories
	const categories = ['masajes', 'facial', 'terapias', 'spa'];

	// Load data from API
	async function loadData() {
		loading = true;
		try {
			services = await adminApi.getServices();
		} catch (error) {
			console.error('Error loading services:', error);
		} finally {
			loading = false;
		}
	}

	// Filtered services
	let filteredServices = $derived(
		services.filter(service => {
			const matchesSearch = !searchQuery || 
				service.name.toLowerCase().includes(searchQuery.toLowerCase());
			const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
			return matchesSearch && matchesCategory;
		})
	);

	let formatPrice = $derived((price: number) => {
		return new Intl.NumberFormat('es-CO', { 
			style: 'currency', 
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(price);
	});

	function getCategoryLabel(category: string) {
		const labels: Record<string, string> = {
			masajes: 'Masajes',
			facial: 'Tratamientos Faciales',
			terapias: 'Terapias',
			spa: 'Spa'
		};
		return labels[category] || category;
	}

	function openCreateModal() {
		editingService = null;
		formData = {
			name: '',
			description: '',
			price: 0,
			duration: 60,
			category: 'masajes',
			imageUrl: '',
			active: true
		};
		showModal = true;
	}

	function openEditModal(service: Service) {
		editingService = service;
		formData = {
			name: service.name,
			description: service.description || '',
			price: typeof service.price === 'string' ? parseFloat(service.price) : service.price,
			duration: service.duration,
			category: service.category,
			imageUrl: service.imageUrl || '',
			active: service.active
		};
		showModal = true;
	}

	async function saveService() {
		saving = true;
		try {
			if (editingService) {
				// Update existing service
				const result = await adminApi.updateService(editingService.id, formData);
				if (result) {
					services = services.map(s => s.id === editingService!.id ? result : s);
				}
			} else {
				// Create new service
				const result = await adminApi.createService(formData);
				if (result) {
					services = [...services, result];
				}
			}
			showModal = false;
		} catch (error) {
			console.error('Error saving service:', error);
		} finally {
			saving = false;
		}
	}

	async function toggleActive(service: Service) {
		actionLoading = service.id;
		try {
			const result = await adminApi.toggleServiceActive(service.id, !service.active);
			if (result) {
				services = services.map(s => s.id === service.id ? result : s);
			}
		} catch (error) {
			console.error('Error toggling service:', error);
		} finally {
			actionLoading = null;
		}
	}

	async function deleteService(service: Service) {
		if (!confirm(`¿Estás seguro de eliminar "${service.name}"?`)) return;
		
		actionLoading = service.id;
		try {
			const success = await adminApi.deleteService(service.id);
			if (success) {
				services = services.filter(s => s.id !== service.id);
			}
		} catch (error) {
			console.error('Error deleting service:', error);
		} finally {
			actionLoading = null;
		}
	}

	onMount(() => {
		loadData();
	});

	let isLoading = $derived(loading);
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-display font-black text-gray-900 dark:text-white tracking-tight uppercase">Servicios</h1>
			<p class="text-gray-500 dark:text-gray-400 font-medium mt-1">Gestiona los servicios del spa</p>
		</div>
		<div class="flex items-center gap-4">
			<button 
				onclick={loadData}
				disabled={loading}
				class="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
			>
				{#if loading}
					<Loader2 size={14} class="animate-spin" />
				{/if}
				Actualizar
			</button>
			<button 
				onclick={openCreateModal}
				class="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
			>
				<Plus size={18} />
				Nuevo Servicio
			</button>
		</div>
	</div>

	<!-- Filters -->
		<div class="flex items-center gap-4">
			<div class="flex-1 relative">
				<Search size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
				<input 
					type="text" 
					placeholder="Buscar servicios..." 
					bind:value={searchQuery}
					class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
				/>
			</div>
			<select 
				bind:value={selectedCategory}
				class="px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:border-primary outline-none font-medium bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
			>
				<option value="all">Todas las categorías</option>
				{#each categories as category}
					<option value={category}>{getCategoryLabel(category)}</option>
				{/each}
			</select>
		</div>

	<!-- Services Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
			{#each filteredServices as service}
				<div class="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl shadow-primary/5 border border-secondary/20 overflow-hidden transition-all duration-500 hover:-translate-y-2 {service.active ? '' : 'opacity-60'}">
					<!-- Image -->
					<div class="relative h-48 overflow-hidden">
						<img 
							src={service.imageUrl || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'} 
							alt={service.name}
							class="w-full h-full object-cover"
						/>
						<div class="absolute top-4 right-4 flex items-center gap-2">
							<button 
								onclick={() => toggleActive(service)}
								disabled={actionLoading === service.id}
								class="p-2 bg-white/90 dark:bg-gray-700/90 rounded-xl shadow-lg hover:bg-white dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
							>
								{#if actionLoading === service.id}
									<Loader2 size={24} class="animate-spin" />
								{:else if service.active}
									<ToggleRight size={24} class="text-emerald-500" />
								{:else}
									<ToggleLeft size={24} class="text-gray-400" />
								{/if}
							</button>
						</div>
						<div class="absolute top-4 left-4">
							<span class="px-4 py-2 bg-white/90 dark:bg-gray-700/90 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">
								{getCategoryLabel(service.category)}
							</span>
						</div>
					</div>

					<!-- Content -->
					<div class="p-6">
						<div class="flex items-start justify-between mb-4">
							<h3 class="text-xl font-black text-gray-900 dark:text-white">{service.name}</h3>
						</div>
						
						<p class="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2">{service.description || 'Sin descripción'}</p>
						
						<div class="flex items-center justify-between mb-6">
							<div class="flex items-center gap-2 text-gray-400">
								<Clock size={16} />
								<span class="text-sm font-medium">{service.duration} min</span>
							</div>
							<p class="text-2xl font-black text-primary">{formatPrice(typeof service.price === 'string' ? parseFloat(service.price) : service.price)}</p>
						</div>

						<div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
							<p class="text-sm text-gray-400">{service.active ? 'Activo' : 'Inactivo'}</p>
							<div class="flex items-center gap-2">
								<button 
									onclick={() => openEditModal(service)}
									class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-xl transition-colors duration-500" 
									title="Editar"
								>
									<Edit size={18} />
								</button>
								<button 
									onclick={() => deleteService(service)}
									disabled={actionLoading === service.id}
									class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-xl transition-colors duration-500 disabled:opacity-50" 
									title="Eliminar"
								>
									<Trash2 size={18} />
								</button>
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>

		{#if filteredServices.length === 0}
			<div class="bg-white dark:bg-gray-800 rounded-3xl p-20 text-center shadow-2xl shadow-primary/5 border border-secondary/20">
				<p class="text-gray-400 dark:text-gray-500 font-medium">No se encontraron servicios</p>
			</div>
	{/if}
	</div>

	<!-- Modal -->
{#if showModal}
	<div class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
		<div class="bg-white dark:bg-gray-800 rounded-4xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
			<!-- Header -->
			<div class="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
				<h2 class="text-xl font-black text-gray-900 dark:text-white uppercase">
					{editingService ? 'Editar Servicio' : 'Nuevo Servicio'}
				</h2>
				<button 
					onclick={() => showModal = false}
					class="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-colors"
				>
					<X size={20} />
				</button>
			</div>

			<!-- Form -->
			<div class="p-6 space-y-4">
				<div>
					<label for="name" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Nombre</label>
					<input 
						id="name"
						type="text" 
						bind:value={formData.name}
						class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
						placeholder="Nombre del servicio"
					/>
				</div>

				<div>
					<label for="description" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Descripción</label>
					<textarea 
						id="description"
						bind:value={formData.description}
						rows="3"
						class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium resize-none"
						placeholder="Descripción del servicio"
					></textarea>
				</div>

				<div class="grid grid-cols-2 gap-4">
					<div>
						<label for="price" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Precio (COP)</label>
						<input 
							id="price"
							type="number" 
							bind:value={formData.price}
							class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							placeholder="85000"
						/>
					</div>
					<div>
						<label for="duration" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Duración (min)</label>
						<input 
							id="duration"
							type="number" 
							bind:value={formData.duration}
							class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							placeholder="60"
						/>
					</div>
				</div>

				<div>
					<label for="category" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Categoría</label>
					<select 
						id="category"
						bind:value={formData.category}
						class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 focus:border-primary outline-none font-medium bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
					>
						{#each categories as category}
							<option value={category}>{getCategoryLabel(category)}</option>
						{/each}
					</select>
				</div>

				<div>
					<label for="imageUrl" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">URL de Imagen</label>
					<input 
						id="imageUrl"
						type="url" 
						bind:value={formData.imageUrl}
						class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
						placeholder="https://..."
					/>
				</div>

				<label class="flex items-center gap-3 cursor-pointer">
					<input 
						type="checkbox" 
						bind:checked={formData.active}
						class="w-5 h-5 rounded text-primary focus:ring-primary"
					/>
					<span class="font-medium text-gray-900 dark:text-white">Servicio activo</span>
				</label>
			</div>

			<!-- Footer -->
			<div class="flex items-center justify-end gap-4 p-6 border-t border-gray-100 dark:border-gray-700">
				<button 
					onclick={() => showModal = false}
					class="px-6 py-3 text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-700 rounded-2xl transition-colors"
				>
					Cancelar
				</button>
				<button 
					onclick={saveService}
					disabled={saving || !formData.name || !formData.price}
					class="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors disabled:opacity-50"
				>
					{#if saving}
						<Loader2 size={18} class="animate-spin" />
					{/if}
					{editingService ? 'Guardar Cambios' : 'Crear Servicio'}
				</button>
			</div>
		</div>
	</div>
{/if}
