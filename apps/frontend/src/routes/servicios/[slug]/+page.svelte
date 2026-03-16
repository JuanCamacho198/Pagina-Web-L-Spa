<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils/cn';
	import Button from '$lib/components/ui/Button.svelte';
	import Typography from '$lib/components/ui/Typography.svelte';
	import Badge from '$lib/components/ui/Badge.svelte';
	import StarRating from '$lib/components/ui/StarRating.svelte';
	import ServiceCard from '$lib/components/services/ServiceCard.svelte';
	import ReviewSection from '$lib/components/services/ReviewSection.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { cart } from '$lib/cart';
	import { addToFavorites, checkIsFavorite, removeFromFavorites } from '$lib/favorites';
	import { onMount } from 'svelte';
	import { 
		ShoppingCart, 
		Clock,  
		Sparkles, 
		ChevronLeft, 
		ShieldCheck, 
		HandHelping,
		Waves,
		HeartPulse,
		ArrowRight,
		Heart
	} from 'lucide-svelte';

	let { data } = $props();
	let service = $derived(data.service);
	let recommendations = $derived(data.recommendations || []);

	let isAddingToCart = $state(false);
	let isFavorite = $state(false);

	// Check if service is favorite on mount
	onMount(async () => {
		if (service?.id) {
			isFavorite = await checkIsFavorite(service.id);
		}
	});

	const features = $derived([
		{ icon: HandHelping, label: 'Atención Personalizada' },
		{ icon: Waves, label: 'Ambiente Relajante' },
		{ icon: HeartPulse, label: 'Bienestar Holístico' },
	]);

	const handleAddToCart = async () => {
		isAddingToCart = true;
		try {
			await cart.addItem({
				serviceId: service.id,
				slug: page.params.slug,
				name: service.name,
				price: Number(service.price),
				image: service.imageUrl || service.image_url || ''
			});
			toast.success(`${service.name} añadido al carrito`);
		} catch (e) {
			console.error('Error adding to cart:', e);
			toast.error('No se pudo añadir al carrito');
		} finally {
			isAddingToCart = false;
		}
	};

	const handleToggleFavorite = async () => {
		if (!service?.id) return;
		
		// Optimistic update - toggle immediately
		const newFavoriteState = !isFavorite;
		isFavorite = newFavoriteState;
		
		// Show toast
		toast.success(newFavoriteState ? `${service.name} añadido a favoritos` : `${service.name} eliminado de favoritos`);
		
		// Send to API in background
		try {
			if (newFavoriteState) {
				await addToFavorites(service.id);
			} else {
				await removeFromFavorites(service.id);
			}
		} catch (e) {
			console.error('Error toggling favorite:', e);
			// Revert on error
			isFavorite = !newFavoriteState;
			toast.error('Error al actualizar favoritos');
		}
	};
</script>

<svelte:head>
	<title>{service.name} - L-SPA</title>
	<meta name="description" content={service.description} />
</svelte:head>

<div class="min-h-screen bg-white pb-32 pt-8">
	<div class="max-w-7xl mx-auto px-6 lg:px-8">
		<!-- Navigation -->
		<nav class="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] mb-12 animate-in fade-in duration-700">
			<a href="/" class="text-gray-400 hover:text-primary transition-colors">Inicio</a>
			<span class="text-gray-200">/</span>
			<a href="/servicios" class="text-gray-400 hover:text-primary transition-colors">Catálogo</a>
			<span class="text-gray-200">/</span>
			<span class="text-primary">{service.name}</span>
		</nav>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 xl:gap-24 items-start">
			<!-- Media Section -->
			<div class="lg:col-span-6 space-y-12 animate-in fade-in slide-in-from-left duration-1000">
				<div class="relative group">
					<!-- Main Image -->
					<div class="aspect-4/5 rounded-[60px] overflow-hidden shadow-2xl border-8 border-white group-hover:shadow-primary/20 transition-all duration-700">
						{#if service.imageUrl || service.image_url}
							<img
								src={service.imageUrl || service.image_url}
								alt={service.name}
								loading="lazy"
								decoding="async"
								class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
							/>
						{:else if service.imageFileName}
							<img
								src="/assets/{service.imageFileName}"
								alt={service.name}
								loading="lazy"
								decoding="async"
								class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
							/>
						{:else}
							<div class="w-full h-full bg-gray-50 flex items-center justify-center">
								<Sparkles size={80} class="text-primary/10 animate-pulse" />
							</div>
						{/if}
					</div>

					<!-- Overlay Badges -->
					<div class="absolute top-10 right-10">
						<div class="h-28 w-28 bg-white/90 backdrop-blur-xl rounded-full shadow-2xl flex flex-col items-center justify-center border-4 border-white/50 -rotate-12 group-hover:rotate-0 transition-all duration-700">
							<span class="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Elite</span>
							<div class="flex items-center gap-1">
								<span class="text-2xl font-black text-gray-900 leading-none">4.9</span>
								<Sparkles size={14} class="text-amber-400 fill-amber-400" />
							</div>
						</div>
					</div>
				</div>

				<!-- Highlights Grid -->
				<div class="grid grid-cols-3 gap-6">
					{#each features as feature}
						<div class="bg-gray-50 p-8 rounded-[40px] border border-gray-100 text-center transition-all duration-500 hover:bg-white hover:shadow-xl hover:shadow-primary/5 group/feat">
							<div class="h-12 w-12 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mx-auto mb-4 group-hover/feat:bg-primary group-hover/feat:text-white transition-colors duration-500">
								<feature.icon size={24} />
							</div>
							<span class="block text-[9px] font-black uppercase tracking-[0.15em] text-gray-400 leading-tight">
								{feature.label}
							</span>
						</div>
					{/each}
				</div>
			</div>

			<!-- Info Section -->
			<div class="lg:col-span-6 space-y-16 animate-in fade-in slide-in-from-right duration-1000 delay-200">
				<div class="space-y-8">
					<div class="flex items-center gap-4">
						<Badge variant="default" class="rounded-2xl px-6 py-3 font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/10 border-none bg-primary text-white">
							{service.category || 'Bienestar'}
						</Badge>
						<div class="h-10 w-px bg-gray-100"></div>
						<div class="flex items-center gap-2">
							<div class="flex -space-x-2">
								{#each [1,2,3] as i}
									<div class="h-8 w-8 rounded-full border-2 border-white bg-gray-100 overflow-hidden ring-1 ring-gray-100">
										<img src="https://i.pravatar.cc/150?u={service.id}{i}" alt="user" loading="lazy" decoding="async" />
									</div>
								{/each}
							</div>
							<span class="text-[11px] font-black text-gray-400 uppercase tracking-widest ml-2">+40 EXPERIENCIAS</span>
						</div>
					</div>

					<Typography variant="h1" class="text-gray-900 mb-0! font-black tracking-tighter text-6xl xl:text-8xl leading-[0.9] sm:leading-[0.9]">
						{service.name}
					</Typography>
					
					<p class="text-gray-500 font-medium text-xl leading-relaxed max-w-xl">
						{service.description || 'Una inmersión profunda en la tranquilidad, diseñada para restaurar tu equilibrio vital con las técnicas más avanzadas.'}
					</p>
				</div>

				<!-- Main Stats -->
				<div class="grid grid-cols-2 gap-8 py-10 border-y border-gray-100">
					<div class="flex items-center gap-6">
						<div class="h-16 w-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary border border-primary/10">
							<Clock size={32} />
						</div>
						<div>
							<span class="block text-2xl font-black text-gray-900 leading-none mb-1">{service.duration} MIN</span>
							<span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Sesión Completa</span>
						</div>
					</div>
					<div class="flex items-center gap-6">
						<div class="h-16 w-16 bg-primary/5 rounded-3xl flex items-center justify-center text-primary border border-primary/10">
							<ShieldCheck size={32} />
						</div>
						<div>
							<span class="block text-2xl font-black text-gray-900 leading-none mb-1">PRO</span>
							<span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Garantía L-SPA</span>
						</div>
					</div>
				</div>

				<!-- Pricing & CTA -->
				<div class="space-y-10">
					<div class="flex items-end gap-3">
						<span class="text-7xl font-black text-gray-900 tracking-tighter leading-none">
							{Number(service.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
						</span>
						<span class="text-sm font-black text-gray-400 uppercase tracking-[0.2em] mb-2 leading-none">/ Inversión</span>
					</div>

					<div class="flex flex-col sm:flex-row gap-6">
						<button
							onclick={handleAddToCart}
							disabled={isAddingToCart}
							class="flex-1 rounded-4xl bg-white border-2 border-primary/20 px-10 py-6 font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/5 hover:border-primary hover:bg-primary/5 transition-all active:scale-95 flex items-center justify-center gap-4 group/btn"
						>
							{#if isAddingToCart}
							  <div class="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
							{:else}
							  <ShoppingCart size={20} class="text-primary group-hover/btn:scale-110 transition-transform" />
							{/if}
							Añadir al Carrito
						</button>
						<!-- Favorite Button -->
						<button
							onclick={handleToggleFavorite}
							class="w-16 h-auto rounded-4xl border-2 flex items-center justify-center gap-2 transition-all active:scale-95 {isFavorite ? 'bg-rose-500 text-white' : 'bg-white border-primary/20 text-gray-400 hover:border-rose-500 hover:text-rose-500'}"
							title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
						>
							<Heart size={20} class={isFavorite ? 'fill-current' : ''} />
						</button>
						<Button
							href="/booking?serviceId={service.id}"
							class="flex-[1.5] rounded-4xl px-12 py-6 font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-primary/40 hover:scale-[1.02] active:scale-95 group/book text-white h-auto"
						>
							RESERVAR AHORA
							<ArrowRight size={20} class="ml-4 group-hover/book:translate-x-2 transition-transform" />
						</Button>
					</div>
				</div>
			</div>
		</div>

		<!-- Review Section -->
		<div class="mt-48 pt-32 border-t border-gray-100">
			<ReviewSection serviceId={service.id} />
		</div>


		<!-- Recommendations -->
		<div class="mt-40">
			<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
				<div class="max-w-xl">
					<div class="h-1.5 w-16 bg-primary rounded-full mb-6"></div>
					<Typography variant="h2" class="text-gray-900 mb-4! font-black tracking-tighter sm:text-5xl leading-none">
						Te puede interesar
					</Typography>
					<p class="text-gray-500 font-medium">Otras experiencias exclusivas diseñadas para elevar tu bienestar.</p>
				</div>
				<Button variant="ghost" href="/servicios" class="font-bold uppercase tracking-widest text-xs group">
					Ver catálogo completo
					<ChevronLeft size={16} class="ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
				</Button>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-10">
				{#each recommendations as recommended (recommended.id)}
					<ServiceCard service={recommended} />
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 100% 0%, hsla(327, 67%, 33%, 0.03) 0, transparent 40%),
			radial-gradient(at 0% 100%, hsla(327, 67%, 33%, 0.02) 0, transparent 40%);
		background-attachment: fixed;
	}
</style>
