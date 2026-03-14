<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Heart, Clock, Star, Trash2 } from 'lucide-svelte';

	const session = authClient.useSession();

	// Redirect if not authenticated
	$effect(() => {
		if (browser && !$session.isPending && !$session.data) {
			goto('/login');
		}
	});

	// Mock favorite services
	const favorites = [
		{ 
			id: '1', 
			name: 'Masaje Relajante',
			description: 'Masaje suave para aliviar el estrés y la tensión muscular',
			duration: 60,
			price: 85000,
			rating: 4.8,
			image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'
		},
		{ 
			id: '2', 
			name: 'Tratamiento Facial',
			description: 'Limpieza facial profunda con productos premium',
			duration: 45,
			price: 95000,
			rating: 4.9,
			image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400'
		},
		{ 
			id: '3', 
			name: 'Aromaterapia',
			description: 'Terapia con aceites esenciales para relajación total',
			duration: 90,
			price: 120000,
			rating: 4.7,
			image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=400'
		},
	];

	function formatPrice(price: number) {
		return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
	}
</script>

<svelte:head>
	<title>Mis Favoritos | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pt-32 pb-20 px-6">
	{#if $session.isPending}
		<div class="max-w-4xl mx-auto flex flex-col items-center justify-center py-20">
			<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
			<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-4">Cargando...</p>
		</div>
	{:else if $session.data}
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-12">
				<h1 class="text-4xl font-black text-gray-900 uppercase tracking-tighter">Mis <span class="text-primary">Favoritos</span></h1>
				<p class="text-gray-500 mt-2">Servicios guardados para después</p>
			</div>

			{#if favorites.length > 0}
				<!-- Favorites Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{#each favorites as service}
						<div class="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden group">
							<!-- Image -->
							<div class="relative h-40 overflow-hidden">
								<img 
									src={service.image} 
									alt={service.name}
									class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
								/>
								<button class="absolute top-4 right-4 p-2 bg-white/90 rounded-full shadow-lg hover:bg-rose-50 hover:text-rose-500 transition-colors">
									<Heart size={18} fill="currentColor" class="text-rose-500" />
								</button>
							</div>

							<!-- Content -->
							<div class="p-6">
								<h3 class="text-lg font-black text-gray-900 mb-2">{service.name}</h3>
								<p class="text-sm text-gray-500 mb-4 line-clamp-2">{service.description}</p>
								
								<div class="flex items-center justify-between mb-4">
									<div class="flex items-center gap-1 text-amber-500">
										<Star size={14} fill="currentColor" />
										<span class="text-sm font-black">{service.rating}</span>
									</div>
									<div class="flex items-center gap-1 text-gray-400">
										<Clock size={14} />
										<span class="text-sm">{service.duration} min</span>
									</div>
								</div>

								<div class="flex items-center justify-between">
									<p class="text-xl font-black text-primary">{formatPrice(service.price)}</p>
									<a 
										href="/servicios/{service.id}"
										class="px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors"
									>
										Reservar
									</a>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else}
				<!-- Empty State -->
				<div class="bg-white rounded-[48px] p-12 text-center shadow-sm border border-gray-100">
					<Heart size={48} class="mx-auto mb-4 text-gray-300" />
					<p class="text-gray-500 font-medium mb-4">No tienes servicios favoritos aún</p>
					<a href="/servicios" class="inline-block px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors">
						Explorar Servicios
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>
