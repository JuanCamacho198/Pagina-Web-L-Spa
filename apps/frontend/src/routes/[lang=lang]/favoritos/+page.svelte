<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { Heart, Clock, Star, Trash2, ShoppingBag } from 'lucide-svelte';
	import { fetchFavorites, removeFromFavorites, favoritesStore } from '$lib/favorites';
	import Button from '$lib/components/ui/Button.svelte';

	const session = authClient.useSession();
	
	let loading = $state(true);

	// Load favorites on mount
	onMount(async () => {
		if ($session.data) {
			await fetchFavorites();
		}
		loading = false;
	});

	// Redirect if not authenticated
	$effect(() => {
		if (browser && !$session.isPending && !$session.data) {
			goto('/login');
		}
	});

	// Refresh favorites when session loads
	$effect(() => {
		if ($session.data) {
			fetchFavorites();
		}
	});

	async function handleRemove(serviceId: string) {
		await removeFromFavorites(serviceId);
	}

	function formatPrice(price: string) {
		return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(parseFloat(price));
	}
</script>

<svelte:head>
	<title>Mis Favoritos | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pt-40 pb-32 px-6">
	<div class="max-w-7xl mx-auto space-y-12">
		<!-- Header -->
		<header class="text-center space-y-8">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
				<Heart size={14} />
				Tus Preferidos
			</div>
			<h1 class="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] uppercase">
				SERVICIOS <br /> <span class="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-dark to-primary italic">FAVORITOS</span>
			</h1>
		</header>

		{#if loading}
			<div class="flex items-center justify-center py-20">
				<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
			</div>
		{:else if $favoritesStore.length === 0}
			<div class="bg-white rounded-spa-xxl p-20 text-center space-y-10 shadow-2xl shadow-primary/5 border border-gray-100 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-700">
				<div class="w-24 h-134 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
					<Heart size={48} />
				</div>
				<div class="space-y-4">
					<h2 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Aún no tienes favoritos</h2>
					<p class="text-gray-400 font-medium max-w-sm mx-auto">Explora nuestros rituales y guarda tus favoritos para encontrar rápido lo que más te gusta.</p>
				</div>
				<Button href="/servicios" class="px-10 py-5 rounded-full shadow-xl shadow-primary/20">
					DESCUBRIR SERVICIOS
				</Button>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
				{#each $favoritesStore as favorite (favorite.id)}
					<div class="bg-white rounded-spa-xl shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden group">
						<!-- Image -->
						<div class="aspect-4/3 relative overflow-hidden">
							<img 
								src={favorite.service?.imageUrl || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400'} 
								alt={favorite.service?.name}
								class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
							/>
							<button 
								onclick={() => handleRemove(favorite.serviceId)}
								aria-label="Eliminar {favorite.service?.name} de favoritos"
								class="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center text-rose-500 hover:bg-rose-500 hover:text-white transition-all shadow-lg"
							>
								<Trash2 size={18} />
							</button>
						</div>
						
						<!-- Content -->
						<div class="p-8 space-y-4">
							<div class="flex items-center gap-2">
								<span class="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
									{favorite.service?.category || 'Servicio'}
								</span>
							</div>
							
							<h3 class="text-xl font-black text-gray-900 tracking-tight uppercase group-hover:text-primary transition-colors">
								{favorite.service?.name}
							</h3>
							
							<p class="text-sm text-gray-400 line-clamp-2">
								{favorite.service?.description}
							</p>
							
							<div class="flex items-center justify-between pt-4 border-t border-gray-50">
								<div class="flex items-center gap-2 text-gray-400 text-sm font-bold">
									<Clock size={16} />
									{favorite.service?.duration} min
								</div>
								<div class="text-xl font-black text-primary">
									{formatPrice(favorite.service?.price || '0')}
								</div>
							</div>
							
							<Button href="/servicios/{favorite.serviceId}" class="w-full mt-4">
								VER DETALLES
							</Button>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<style>
	.line-clamp-2 {
		display: -webkit-box;
			-webkit-line-clamp: 2;
			line-clamp: 2;
			-webkit-box-orient: vertical;
		overflow: hidden;
	}
</style>
