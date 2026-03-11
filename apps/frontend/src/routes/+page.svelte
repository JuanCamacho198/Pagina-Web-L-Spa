<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		Star, 
		Clock, 
		MapPin, 
		ChevronLeft, 
		ChevronRight, 
		ArrowRight, 
		Sparkles, 
		ShieldCheck, 
		Heart,
		MoveRight
	} from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import Typography from '$lib/components/Typography.svelte';
	import Badge from '$lib/components/Badge.svelte';
	import { cn } from '$lib/utils/cn';

	let { data } = $props();
	let services = $state(data.services || []);
	let activeIndex = $state(0);
	const totalCarouselImages = 3;

	// Carousel items data
	const carouselItems = [
		{ id: 1, title: 'Ambientes de Paz', desc: 'Instalaciones diseñadas para tu desconexión total.', image: '/src/assets/banners/bannerSpa.avif' },
		{ id: 2, title: 'Tecnología Wellness', desc: 'Los mejores equipos y tratamientos en Medellín.', image: '/src/assets/banners/bannerSpa.avif' },
		{ id: 3, title: 'Personal Experto', desc: 'Tu bienestar en manos de profesionales certificados.', image: '/src/assets/banners/bannerSpa.avif' }
	];

	const nextSlide = () => {
		activeIndex = (activeIndex + 1) % totalCarouselImages;
	};

	const prevSlide = () => {
		activeIndex = (activeIndex - 1 + totalCarouselImages) % totalCarouselImages;
	};

	onMount(() => {
		const interval = setInterval(nextSlide, 8000);
		return () => clearInterval(interval);
	});
</script>

<svelte:head>
	<title>L-SPA | Bienestar y Relajación Premium en Medellín</title>
	<meta name="description" content="Descubre una experiencia única de bienestar y belleza en el corazón de Medellín. Reserva masajes, tratamientos faciales y corporales." />
</svelte:head>

<div class="flex flex-col min-h-screen overflow-hidden">
	<!-- Hero Section -->
	<section class="relative h-[95vh] flex items-center justify-center overflow-hidden">
		<!-- Background with Parallax effect simulation -->
		<div class="absolute inset-0 z-0 scale-110 motion-safe:animate-[pulse_10s_ease-in-out_infinite]">
			<img 
				src="/src/assets/banners/bannerSpa.avif" 
				alt="L-SPA Luxury Environment" 
				class="w-full h-full object-cover brightness-[0.45] saturate-[0.8]"
			/>
			<div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
		</div>
		
		<div class="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 text-white text-center sm:text-left w-full">
			<div class="max-w-4xl space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
				<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
					<Sparkles size={14} class="text-primary-light" />
					L-SPA PREMIUM EXPERIENCE
				</div>
				
				<div class="space-y-6">
					<h1 class="text-6xl sm:text-8xl md:text-9xl font-black leading-[0.85] tracking-tighter drop-shadow-2xl">
						REINVENTA <br />
						<span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-white to-primary-light/60">TU CALMA</span>
					</h1>
					<p class="text-xl sm:text-2xl font-medium text-gray-300 max-w-2xl leading-relaxed drop-shadow-lg">
						Un refugio exclusivo de relajación en el corazón de Medellín. Sumérgete en un viaje sensorial diseñado para tu renovación total.
					</p>
				</div>

				<div class="flex flex-col sm:flex-row items-center gap-6 pt-4">
					<Button 
						href="/servicios"
						class="w-full sm:w-auto px-12 py-7 rounded-4xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 group overflow-hidden relative"
					>
						<span class="relative z-10 flex items-center gap-3">
							Explorar Servicios
							<MoveRight size={24} class="group-hover:translate-x-2 transition-transform duration-500" />
						</span>
						<div class="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
					</Button>
					
					<button class="group flex items-center gap-4 text-white font-black text-sm uppercase tracking-[0.2em] hover:text-primary-light transition-colors">
						<div class="h-14 w-14 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md group-hover:border-primary-light transition-all group-hover:scale-110">
							<ChevronRight size={20} />
						</div>
						Ver Video Tour
					</button>
				</div>
			</div>
		</div>

		<!-- Bottom Indicators -->
		<div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex items-center gap-12 text-white/40 text-[9px] font-black uppercase tracking-[0.3em]  lg:flex mt-12">
			<div class="flex items-center gap-3"><span class="h-px w-8 bg-current"></span> MEDELLÍN</div>
			<div class="flex items-center gap-3"><span class="h-px w-8 bg-current"></span> PREMIUM SPA</div>
			<div class="flex items-center gap-3"><span class="h-px w-8 bg-current"></span> EXCLUSIVO</div>
		</div>
	</section>

	<!-- Features grid -->
	<section class="py-32 -mt-24 relative z-20 px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<div class="grid grid-cols-1 md:grid-cols-3 gap-8">
				{#each [
					{ icon: Star, title: "CALIDAD PREMIERE", desc: "El bienestar más exclusivo de la ciudad.", color: "bg-primary" },
					{ icon: Clock, title: "TIEMPO PARA TI", desc: "Flexibilidad horaria pensada para tu ritmo.", color: "bg-gray-900" },
					{ icon: MapPin, title: "UBICACIÓN IDEAL", desc: "Tu escondite secreto en Medellín.", color: "bg-primary-900" }
				] as item, i}
					<div 
						class="bg-white rounded-[48px] p-12 shadow-2xl shadow-gray-200/50 border border-gray-100 group hover:-translate-y-4 transition-all duration-700 relative overflow-hidden"
						style="transition-delay: {i * 100}ms"
					>
						<div class="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full translate-x-16 -translate-y-16 group-hover:bg-primary/5 transition-colors"></div>
						
						<div class={cn("h-20 w-20 rounded-[28px] flex items-center justify-center text-white mb-10 shadow-2xl shadow-primary/20 group-hover:rotate-15 transition-all duration-500", item.color)}>
							<item.icon size={36} strokeWidth={2.5} />
						</div>
						
						<h3 class="text-xs font-black uppercase tracking-[0.3em] text-primary mb-3">{item.title}</h3>
						<p class="text-3xl font-black text-gray-900 tracking-tight leading-tight mb-4">
							{item.desc}
						</p>
						<p class="text-gray-400 font-medium leading-relaxed">
							Cada detalle ha sido cuidadosamente curado para garantizar que tu visita sea inolvidable y transformadora.
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Carousel Gallery -->
	<section class="py-32 bg-gray-900 text-white relative overflow-hidden">
		<!-- Decor -->
		<div class="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
			<div class="absolute top-1/4 left-1/4 w-96 h-96 bg-primary rounded-full blur-[150px]"></div>
		</div>

		<div class="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
			<div class="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
				<div class="space-y-4">
					<div class="h-1 w-20 bg-primary-light rounded-full"></div>
					<h2 class="text-5xl md:text-7xl font-black tracking-tighter leading-none">NUESTROS <br /> ESPACIOS</h2>
				</div>
				<p class="text-gray-400 font-medium max-w-sm text-lg border-l-2 border-primary/30 pl-8">
					Una arquitectura de tranquilidad pensada para deleitar todos tus sentidos.
				</p>
			</div>

			<div class="relative group h-[70vh] rounded-[64px] overflow-hidden shadow-2xl">
				<div 
					class="flex h-full transition-transform duration-1000 ease-out" 
					style="transform: translateX(-{activeIndex * 100}%)"
				>
					{#each carouselItems as item}
						<div class="min-w-full h-full relative">
							<img src={item.image} alt={item.title} class="w-full h-full object-cover saturate-[0.8]" />
							<div class="absolute inset-0 bg-linear-to-t from-gray-950 via-gray-950/20 to-transparent"></div>
							
							<div class="absolute bottom-20 left-20 max-w-md animate-in fade-in slide-in-from-bottom-10 duration-700">
								<h3 class="text-white text-5xl font-black tracking-tighter mb-4">{item.title}</h3>
								<p class="text-gray-400 text-xl font-medium">{item.desc}</p>
							</div>
						</div>
					{/each}
				</div>

				<!-- Navigation -->
				<div class="absolute right-12 bottom-12 flex items-center gap-4">
					<button 
						onclick={prevSlide}
						class="h-16 w-16 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-primary transition-all active:scale-90"
					>
						<ChevronLeft size={24} />
					</button>
					<button 
						onclick={nextSlide}
						class="h-16 w-16 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:bg-primary transition-all active:scale-90"
					>
						<ChevronRight size={24} />
					</button>
				</div>
			</div>
		</div>
	</section>

	<!-- Featured Services (Hono Data) -->
	<section class="py-40 px-6 lg:px-8">
		<div class="max-w-7xl mx-auto">
			<div class="text-center mb-24 space-y-6">
				<div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.3em] border border-primary/10">
					Descubre la excelencia
				</div>
				<h2 class="text-6xl md:text-8xl font-black tracking-tighter leading-none text-gray-900">
					EXPERIENCIAS <br /> <span class="text-primary">DESTACADAS</span>
				</h2>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-12">
				{#each services as service, i}
					<div class="group relative bg-white rounded-[56px] overflow-hidden border border-gray-100 shadow-xl hover:shadow-primary/5 transition-all duration-700 hover:-translate-y-4">
						<div class="h-100 overflow-hidden relative">
							<img 
								src={service.imageUrl || '/src/assets/banners/bannerSpa.avif'} 
								alt={service.name} 
								class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
							/>
							<div class="absolute top-8 right-8">
								<div class="bg-white/95 backdrop-blur shadow-2xl px-6 py-2 rounded-2xl font-black text-primary tracking-widest text-[10px] uppercase">
									${Number(service.price).toLocaleString()}
								</div>
							</div>
						</div>

						<div class="p-10 space-y-6">
							<div class="flex items-center justify-between">
								<div class="flex items-center gap-3 text-gray-400 font-black text-[9px] uppercase tracking-widest">
									<Clock size={14} class="text-primary-light" />
									{service.duration} MIN
								</div>
								<div class="flex items-center gap-1 text-primary">
									{#each Array(5) as _}
										<Star size={10} fill="currentColor" />
									{/each}
								</div>
							</div>

							<div class="space-y-3">
								<h4 class="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors tracking-tight leading-none uppercase">
									{service.name}
								</h4>
								<p class="text-gray-400 font-medium text-sm line-clamp-2 leading-relaxed">
									{service.description}
								</p>
							</div>

							<Button 
								href="/servicios"
								class="w-full py-5 rounded-3xl font-black text-[10px] uppercase tracking-[0.2em] transform transition-transform group-hover:scale-[1.02]"
							>
								Reservar Sesión
							</Button>
						</div>
					</div>
				{/each}
			</div>

			<div class="mt-24 text-center">
				<a href="/servicios" class="inline-flex items-center gap-4 px-12 py-5 rounded-full border-2 border-gray-100 hover:border-primary font-black text-[10px] uppercase tracking-[0.3em] transition-all group">
					Ver Catálogo Completo
					<div class="h-8 w-8 rounded-full bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
						<ArrowRight size={14} />
					</div>
				</a>
			</div>
		</div>
	</section>

	<!-- Call to Action -->
	<section class="mb-32 px-6">
		<div class="max-w-7xl mx-auto bg-primary rounded-[64px] p-20 md:p-32 text-center text-white relative overflow-hidden group">
			<!-- Decor -->
			<div class="absolute top-0 right-0 w-150 h-150 bg-white opacity-[0.03] rounded-full translate-x-1/2 -translate-y-1/2 transition-transform duration-[2s] group-hover:scale-125"></div>
			<div class="absolute bottom-0 left-0 w-100 h-100 bg-black opacity-[0.05] rounded-full -translate-x-1/4 translate-y-1/4"></div>

			<div class="relative z-10 space-y-12">
				<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-white/10 uppercase tracking-[0.4em] text-[10px] font-black mb-4">
					Únete a la membresía
				</div>
				<h2 class="text-6xl md:text-8xl font-black tracking-tighter leading-tight drop-shadow-2xl">
					COMIENZA TU <br /> VIAJE DE BIENESTAR
				</h2>
				<p class="text-primary-light text-xl md:text-2xl font-medium max-w-xl mx-auto leading-relaxed">
					Regístrate hoy y recibe una consulta personalizada gratuita en tu primera visita.
				</p>
				<div class="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
					<Button class="bg-white text-primary hover:bg-gray-100 px-16 py-6 rounded-[28px] text-lg font-black uppercase tracking-widest shadow-2xl">
						Crear Cuenta Premium
					</Button>
					<span class="text-white/40 font-black uppercase tracking-widest text-[10px]">Ó contáctanos</span>
				</div>
			</div>
		</div>
	</section>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 0% 100%, hsla(327, 67%, 33%, 0.04) 0, transparent 40%),
			radial-gradient(at 100% 0%, hsla(327, 67%, 33%, 0.02) 0, transparent 40%);
		background-attachment: fixed;
	}
</style>
