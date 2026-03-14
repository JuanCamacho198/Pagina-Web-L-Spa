<script lang="ts">
	import { Search, Plus, Edit, Trash2, Eye, Clock, DollarSign, Star, ToggleLeft, ToggleRight } from 'lucide-svelte';

	// Mock services data
	let services = [
		{ 
			id: '1', 
			name: 'Masaje Relajante', 
			description: 'Masaje suave para aliviar el estrés y la tensión muscular',
			duration: 60,
			price: 85000,
			category: 'masajes',
			rating: 4.8,
			bookings: 156,
			active: true,
			image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'
		},
		{ 
			id: '2', 
			name: 'Tratamiento Facial', 
			description: 'Limpieza facial profunda con productos premium',
			duration: 45,
			price: 95000,
			category: 'facial',
			rating: 4.9,
			bookings: 132,
			active: true,
			image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
		},
		{ 
			id: '3', 
			name: 'Aromaterapia', 
			description: 'Terapia con aceites esenciales para relajación total',
			duration: 90,
			price: 120000,
			category: 'terapias',
			rating: 4.7,
			bookings: 98,
			active: true,
			image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400'
		},
		{ 
			id: '4', 
			name: 'Masaje Deportivo', 
			description: 'Masaje intensivo para atletas y personas activas',
			duration: 75,
			price: 110000,
			category: 'masajes',
			rating: 4.6,
			bookings: 87,
			active: true,
			image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400'
		},
		{ 
			id: '5', 
			name: 'Baño de Vapor', 
			description: 'Sesión de vapor con aceites esenciales',
			duration: 30,
			price: 45000,
			category: 'spa',
			rating: 4.5,
			bookings: 64,
			active: false,
			image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'
		},
	];

	let searchQuery = '';
	let selectedCategory = 'all';
	let showModal = false;
	let editingService = null;

	$: filteredServices = services.filter(service => {
		const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
		return matchesSearch && matchesCategory;
	});

	const categories = ['all', 'masajes', 'facial', 'terapias', 'spa'];

	function formatPrice(price: number) {
		return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
	}

	function getCategoryLabel(category: string) {
		const labels: Record<string, string> = {
			masajes: 'Masajes',
			facial: 'Tratamientos Faciales',
			terapias: 'Terapias',
			spa: 'Spa'
		};
		return labels[category] || category;
	}
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Servicios</h1>
			<p class="text-gray-500 font-medium mt-1">Gestiona los servicios del spa</p>
		</div>
		<button 
			onclick={() => { showModal = true; editingService = null; }}
			class="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
		>
			<Plus size={18} />
			Nuevo Servicio
		</button>
	</div>

	<!-- Filters -->
	<div class="flex items-center gap-4">
		<div class="flex-1 relative">
			<Search size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
			<input 
				type="text" 
				placeholder="Buscar servicios..." 
				bind:value={searchQuery}
				class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
			/>
		</div>
		<select 
			bind:value={selectedCategory}
			class="px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary outline-none font-medium bg-white"
		>
			{#each categories as category}
				<option value={category}>
					{category === 'all' ? 'Todas las categorías' : getCategoryLabel(category)}
				</option>
			{/each}
		</select>
	</div>

	<!-- Services Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		{#each filteredServices as service}
			<div class="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow {service.active ? '' : 'opacity-60'}">
				<!-- Image -->
				<div class="relative h-48 overflow-hidden">
					<img 
						src={service.image} 
						alt={service.name}
						class="w-full h-full object-cover"
					/>
					<div class="absolute top-4 right-4 flex items-center gap-2">
						<button class="p-2 bg-white/90 rounded-xl shadow-lg hover:bg-white transition-colors">
							{#if service.active}
								<ToggleRight size={24} class="text-emerald-500" />
							{:else}
								<ToggleLeft size={24} class="text-gray-400" />
							{/if}
						</button>
					</div>
					<div class="absolute top-4 left-4">
						<span class="px-4 py-2 bg-white/90 rounded-full text-[10px] font-black uppercase tracking-widest text-gray-600">
							{getCategoryLabel(service.category)}
						</span>
					</div>
				</div>

				<!-- Content -->
				<div class="p-6">
					<div class="flex items-start justify-between mb-4">
						<h3 class="text-xl font-black text-gray-900">{service.name}</h3>
						<div class="flex items-center gap-1 text-amber-500">
							<Star size={16} fill="currentColor" />
							<span class="font-black text-sm">{service.rating}</span>
						</div>
					</div>
					
					<p class="text-gray-500 text-sm mb-6 line-clamp-2">{service.description}</p>
					
					<div class="flex items-center justify-between mb-6">
						<div class="flex items-center gap-2 text-gray-400">
							<Clock size={16} />
							<span class="text-sm font-medium">{service.duration} min</span>
						</div>
						<p class="text-2xl font-black text-primary">{formatPrice(service.price)}</p>
					</div>

					<div class="flex items-center justify-between pt-4 border-t border-gray-100">
						<p class="text-sm text-gray-400">{service.bookings} reservas</p>
						<div class="flex items-center gap-2">
							<button class="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-colors" title="Ver">
								<Eye size={18} />
							</button>
							<button class="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-colors" title="Editar">
								<Edit size={18} />
							</button>
							<button class="p-2 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" title="Eliminar">
								<Trash2 size={18} />
							</button>
						</div>
					</div>
				</div>
			</div>
		{/each}
	</div>

	{#if filteredServices.length === 0}
		<div class="bg-white rounded-4xl p-20 text-center shadow-sm border border-gray-100">
			<p class="text-gray-400 font-medium">No se encontraron servicios</p>
		</div>
	{/if}
</div>
