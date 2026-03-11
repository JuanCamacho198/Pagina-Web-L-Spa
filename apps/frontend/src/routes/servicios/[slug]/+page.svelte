<script lang="ts">
	import { page } from '$app/state';
	import { cn } from '$lib/utils/cn';
	import Button from '$components/Button.svelte';
	import Typography from '$components/Typography.svelte';
	import TypographyElement from '$components/Typography.svelte';
	import Badge from '$components/Badge.svelte';
	import StarRating from '$components/StarRating.svelte';
	import ServiceCard from '$components/ServiceCard.svelte';
	import ReviewSection from '$components/ReviewSection.svelte';
	import { toast } from '$components/Toast.svelte';
	import { 
		ShoppingCart, 
		Calendar, 
		Clock, 
		Tag, 
		Sparkles, 
		ChevronLeft, 
		Award, 
		CheckCircle2, 
		ShieldCheck, 
		MapPin 
	} from 'lucide-svelte';

	let { data } = $props();
	let service = $derived(data.service);
	let recommendations = $derived(data.recommendations || []);

	let isAddingToCart = $state(false);

	const handleAddToCart = async () => {
		isAddingToCart = true;
		try {
			// En un entorno real, obtendríamos el user del auth state
			// Para propósitos de este ejemplo mantenemos la estructura
			const response = await fetch('/api/users/cart', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					serviceId: service.id,
					auth0Id: 'temp_user_id' // Reemplazar con Auth0 real
				})
			});

			if (response.ok) {
				toast.success(`${service.name} añadido al carrito`);
			} else {
				throw new Error('Error al añadir');
			}
		} catch (e) {
			toast.error('No se pudo añadir al carrito');
		} finally {
			isAddingToCart = false;
		}
	};
</script>

<svelte:head>
	<title>{service.name} - L-SPA</title>
	<meta name="description" content={service.description} />
</svelte:head>

<div class="min-h-screen bg-gray-50/30 pb-24 pt-8">
	<div class="max-w-7xl mx-auto px-6 lg:px-8">
		<!-- Back Button -->
		<a
			href="/servicios"
			class="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-bold text-sm mb-12 group uppercase tracking-widest"
		>
			<div class="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:scale-110 group-hover:bg-primary/5 transition-all">
				<ChevronLeft size={20} />
			</div>
			Volver a servicios
		</a>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
			<!-- Media Section -->
			<div class="lg:col-span-6 space-y-8 animate-in fade-in slide-in-from-left duration-700">
				<div class="relative group">
					<div class="aspect-square rounded-[48px] overflow-hidden shadow-2xl border-4 border-white transform transition-transform duration-700 group-hover:scale-[1.02]">
						{#if service.image_url}
							<img
								src={service.image_url}
								alt={service.name}
								class="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
							/>
						{:else}
							<div class="w-full h-full bg-gray-100 flex items-center justify-center">
								<Sparkles size={64} class="text-gray-200" />
							</div>
						{/if}
					</div>

					<!-- Floating Badges -->
					<div class="absolute -top-6 -right-6 h-24 w-24 bg-primary rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center border-4 border-white rotate-12 group-hover:rotate-0 transition-all duration-500">
						<div class="text-center text-white">
							<span class="block text-[10px] font-black uppercase tracking-tighter opacity-80 leading-none">Top Rated</span>
							<span class="text-xl font-black leading-none">4.5</span>
						</div>
					</div>
				</div>

				<!-- Stats Chips -->
				<div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<div class="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm text-center group hover:bg-primary/5 transition-all flex flex-col items-center">
						<Clock class="text-primary mb-3" size={24} />
						<span class="block text-xl font-black text-gray-900 leading-none">{service.duration}</span>
						<span class="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">minutos</span>
					</div>
					<div class="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm text-center group hover:bg-primary/5 transition-all flex flex-col items-center">
						<Award class="text-primary mb-3" size={24} />
						<span class="block text-xl font-black text-gray-900 leading-none">Elite</span>
						<span class="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">Categoría</span>
					</div>
					<div class="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm text-center group hover:bg-primary/5 transition-all flex flex-col items-center">
						<ShieldCheck class="text-primary mb-3" size={24} />
						<span class="block text-xl font-black text-gray-900 leading-none">Cert.</span>
						<span class="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">Seguridad</span>
					</div>
					<div class="bg-white p-6 rounded-4xl border border-gray-100 shadow-sm text-center group hover:bg-primary/5 transition-all flex flex-col items-center">
						<MapPin class="text-primary mb-3" size={24} />
						<span class="block text-xl font-black text-gray-900 leading-none">Spa</span>
						<span class="text-[9px] font-black uppercase tracking-widest text-gray-400 mt-2">Ubicación</span>
					</div>
				</div>
			</div>

			<!-- Info Section -->
			<div class="lg:col-span-6 space-y-12 animate-in fade-in slide-in-from-right duration-700 delay-200">
				<div>
					<div class="flex items-center gap-3 mb-6">
						<Badge variant="primary" class="rounded-2xl px-5 py-2.5 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/10 border-none">
							{service.category || 'General'}
						</Badge>
						<div class="flex items-center gap-2 bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100/50">
							<StarRating rating={4.5} size={14} readonly />
							<span class="text-xs font-black text-amber-700">(48)</span>
						</div>
					</div>

					<Typography variant="h1" class="text-gray-900 !mb-6 font-black tracking-tighter sm:text-7xl leading-none">
						{service.name}
					</Typography>
					
					<p class="text-gray-500 font-medium text-lg leading-relaxed max-w-xl">
						{service.description || 'Una experiencia única diseñada para rejuvenecer cuerpo y mente en el ambiente más exclusivo.'}
					</p>
				</div>

				<!-- Pricing & Action -->
				<div class="bg-white rounded-[40px] p-10 border border-gray-100 shadow-2xl shadow-primary/5 relative overflow-hidden group">
					<!-- Bg Decor -->
					<div class="absolute -bottom-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
					
					<div class="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-8">
						<div class="text-center sm:text-left">
							<span class="block text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Inversión Bienestar</span>
							<div class="flex items-end gap-2">
								<span class="text-5xl font-black text-gray-900 leading-none">${service.price}</span>
								<span class="text-sm font-bold text-gray-400 mb-1.5 uppercase tracking-widest">mxn</span>
							</div>
						</div>

						<div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
							<Button
								variant="outline"
								class="rounded-3xl border-2 border-primary/20 hover:border-primary px-8 py-5 font-black text-sm uppercase tracking-widest order-2 sm:order-1 active:scale-95"
								onclick={handleAddToCart}
								isLoading={isAddingToCart}
							>
								<ShoppingCart size={20} class="mr-3" />
								Añadir
							</Button>
							<Button
								href="/booking?serviceId={service.id}"
								class="rounded-3xl px-10 py-5 font-black text-sm uppercase tracking-[0.15em] shadow-2xl shadow-primary/30 order-1 sm:order-2 active:scale-95"
							>
								Reservar Ahora
								<Sparkles size={20} class="ml-3 group-hover:animate-spin" />
							</Button>
						</div>
					</div>
				</div>

				<!-- Guarantees -->
				<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
					<div class="flex items-start gap-4 p-4 rounded-3xl bg-green-50/50 border border-green-100/50">
						<div class="h-10 w-10 shrink-0 rounded-2xl bg-white border border-green-100 shadow-sm flex items-center justify-center text-green-500">
							<CheckCircle2 size={24} />
						</div>
						<div>
							<h4 class="text-sm font-black text-gray-900 uppercase tracking-wider">Satisfacción</h4>
							<p class="text-[11px] font-medium text-gray-500 mt-1 leading-tight">Garantizamos una experiencia de relajación total.</p>
						</div>
					</div>
					<div class="flex items-start gap-4 p-4 rounded-3xl bg-primary/5 border border-primary/10">
						<div class="h-10 w-10 shrink-0 rounded-2xl bg-white border border-primary/10 shadow-sm flex items-center justify-center text-primary">
							<Sparkles size={24} />
						</div>
						<div>
							<h4 class="text-sm font-black text-gray-900 uppercase tracking-wider">Premium</h4>
							<p class="text-[11px] font-medium text-gray-500 mt-1 leading-tight">Uso exclusivo de productos de alta gama.</p>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Reviews Section -->
		<div class="mt-32">
			<ReviewSection serviceId={service.id} />
		</div>

		<!-- Recommendations -->
		<div class="mt-40">
			<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
				<div class="max-w-xl">
					<div class="h-1.5 w-16 bg-primary rounded-full mb-6"></div>
					<Typography variant="h2" class="text-gray-900 !mb-4 font-black tracking-tighter sm:text-5xl leading-none">
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
