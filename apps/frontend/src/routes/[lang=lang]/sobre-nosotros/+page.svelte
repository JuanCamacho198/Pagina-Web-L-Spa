<script lang="ts">
	import { Target, Eye, ShieldCheck, Heart, Sparkles, Coffee, ChevronRight, Award, MapPin } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Typography from '$lib/components/ui/Typography.svelte';
	import { cn } from '$lib/utils/cn';
	import bannerImage from '$lib/assets/banners/bannerSpa.avif';
	import { page } from '$app/stores';
	import { getLocalizedPath } from '$lib/i18n/utils';

	let currentLang = $derived($page.params.lang || 'es');

	const pillars = [
		{ 
			icon: Sparkles, 
			title: "Innovación Wellness", 
			desc: "Constantemente actualizamos nuestras técnicas para ofrecerte lo último en terapias de relajación y belleza.",
			color: "text-primary-light"
		},
		{ 
			icon: Coffee, 
			title: "Atención Exclusiva", 
			desc: "Personalización absoluta. Entendemos tus necesidades incluso antes de que las expreses.",
			color: "text-rose-400"
		},
		{ 
			icon: ShieldCheck, 
			title: "Compromiso Humano", 
			desc: "Profesionalismo inquebrantable que genera confianza duradera en cada experiencia.",
			color: "text-emerald-400"
		}
	];
</script>

<svelte:head>
	<title>Sobre Nosotros | La Esencia de L-SPA Medellín</title>
	<meta name="description" content="Conoce la misión, visión y los valores que hacen de L-SPA el santuario de bienestar más exclusivo de Medellín." />
</svelte:head>

<div class="min-h-screen bg-white overflow-hidden pb-24">
	<!-- Hero Section -->
	<section class="relative h-[65vh] flex items-center justify-center overflow-hidden">
		<div class="absolute inset-0 z-0 scale-110">
			<enhanced:img 
				src={bannerImage}
				alt="L-SPA Essence" 
				class="w-full h-full object-cover brightness-[0.4] saturate-[0.8]"
			/>
			<div class="absolute inset-0 bg-linear-to-b from-transparent via-primary/10 to-white"></div>
		</div>
		
		<div class="relative z-10 text-center px-6 max-w-4xl space-y-8 animate-in fade-in zoom-in duration-1000 mt-20">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/20 backdrop-blur-xl border border-white/30 text-white text-xs uppercase tracking-[0.3em] font-medium shadow-2xl">
				<Award size={14} class="text-secondary" />
				Excelencia en Bienestar
			</div>
			
			<h1 class="text-6xl md:text-8xl font-display text-white leading-tight drop-shadow-2xl">
				Nuestra <br /> <span class="italic text-secondary font-light">Esencia</span>
			</h1>
			
			<p class="text-lg md:text-xl text-gray-100 font-light leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
				Más que un spa, somos un santuario dedicado a restaurar tu equilibrio vital y belleza natural en el corazón de Medellín.
			</p>
		</div>
		
		<!-- Scroll Indicator -->
		<div class="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-primary animate-bounce opacity-30">
			<div class="h-12 w-pxx bg-current"></div>
		</div>
	</section>

	<!-- Misión y Visión Section -->
	<section class="py-32 px-6 lg:px-8 max-w-7xl mx-auto">
		<div class="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
			<!-- Media Side (Abstract Decor) -->
			<div class="relative order-2 lg:order-1 flex justify-center lg:justify-start">
				<div class="relative w-full max-w-md aspect-4/5/5 bg-gray-50 rounded-spa-xxl overflow-hidden shadow-2xl shadow-primary/10 border border-gray-100">
					<enhanced:img 
						src={bannerImage}
						alt="L-SPA Interior" 
						class="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
					/>
					<div class="absolute inset-0 bg-primary/20 mix-blend-multiply opacity-30 hover:opacity-0 transition-opacity"></div>
				</div>
				<!-- Floating Badges -->
				<div class="absolute -top-10 -right-10 bg-white p-8 rounded-[40px] shadow-2xl shadow-primary/10 border border-gray-100 flex flex-col items-center gap-4 animate-in slide-in-from-right duration-1000">
					<div class="h-16 w-px6 bg-primary rounded-4xl flex items-center justify-center text-white">
						<Eye size={32} />
					</div>
					<div class="text-center">
						<p class="text-[9px] font-black text-primary uppercase tracking-[0.2em]">Visión 2026</p>
						<p class="text-lg font-black text-gray-900 tracking-tight">Referente <br /> Regional</p>
					</div>
				</div>
			</div>

			<!-- Content Side -->
			<div class="space-y-12 order-1 lg:order-2">
				<div class="space-y-6">
					<div class="inline-flex items-center gap-4 px-5 py-2 bg-secondary/30 text-primary-dark rounded-full text-xs uppercase tracking-[0.2em] border border-secondary font-medium">
						<Target size={16} strokeWidth={1.5} /> Nuestra Misión
					</div>
					<h2 class="text-4xl md:text-5xl font-display text-gray-900 leading-[1.2]">
						Compromiso con tu <br /> <span class="text-primary italic">Transformación Personal</span>
					</h2>
					<p class="text-lg text-gray-600 font-light leading-loose">
						En <strong class="text-primary-dark font-normal">L-SPA</strong>, trascendemos lo convencional para ofrecer un servicio integral que fusiona relajación, vitalidad y salud. Nuestra prioridad es la satisfacción total a través de una atención personalizada que evoluciona contigo.
					</p>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
					<div class="p-8 bg-white rounded-spa-xl border border-secondary/30 flex items-start gap-6 group hover:bg-secondary/10 hover:shadow-spa transition-all duration-700">
						<div class="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
							<ShieldCheck size={20} strokeWidth={1.5} />
						</div>
						<div class="space-y-2">
							<h4 class="text-sm font-medium text-gray-900 uppercase tracking-widest">Certificado</h4>
							<p class="text-xs font-light text-gray-500 uppercase tracking-widest">Calidad Garantizada</p>
						</div>
					</div>
					<div class="p-8 bg-white rounded-spa-xl border border-secondary/30 flex items-start gap-6 group hover:bg-secondary/10 hover:shadow-spa transition-all duration-700">
						<div class="h-12 w-12 bg-secondary rounded-full flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform duration-500">
							<Heart size={20} strokeWidth={1.5} />
						</div>
						<div class="space-y-2">
							<h4 class="text-sm font-medium text-gray-900 uppercase tracking-widest">Empatía</h4>
							<p class="text-xs font-light text-gray-500 uppercase tracking-widest">Pasión por el detalle</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Pilares Section -->
	<section class="py-32 px-6 lg:px-8 bg-primary-dark text-white relative overflow-hidden">
		<!-- Decor Circles -->
		<div class="absolute -top-24 -left-24 w-120 h-120 bg-primary opacity-20 rounded-full blur-[120px]"></div>
		<div class="absolute -bottom-24 -right-24 w-120 h-120 bg-secondary opacity-10 rounded-full blur-[120px]"></div>

		<div class="max-w-7xl mx-auto">
			<div class="text-center space-y-6 mb-24 relative z-10">
				<h2 class="text-xs font-medium uppercase tracking-[0.5em] text-accent">Nuestros Pilares</h2>
				<p class="text-4xl md:text-6xl font-display leading-[1.2]">Fundamentos de <br /> <span class="text-secondary italic font-light">la Experiencia</span></p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
				{#each pillars as pillar}
					<div class="bg-white/5 backdrop-blur-md p-12 rounded-spa-xl border border-white/10 group hover:bg-white/10 hover:-translate-y-2 transition-all duration-700 shadow-2xl">
						<div class={cn("h-16 w-16 rounded-full flex items-center justify-center mb-8 bg-white/10 transition-all duration-500 group-hover:scale-110", pillar.color)}>
							<pillar.icon size={28} strokeWidth={1.5} />
						</div>
						<h4 class="text-2xl font-display mb-4 text-white">{pillar.title}</h4>
						<p class="text-sm text-gray-300 font-light leading-loose">
							{pillar.desc}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Ubicación/Experiencia Section -->
	<section class="py-40 px-6 lg:px-8 max-w-7xl mx-auto">
		<div class="rounded-spa-xxl bg-white border border-secondary/50 p-12 md:p-24 flex flex-col md:flex-row items-center gap-20 relative overflow-hidden group shadow-spa">
			<!-- Abstract Background -->
			<div class="absolute -bottom-20 -left-20 w-80 h-80 bg-secondary/50 rounded-full blur-[80px] group-hover:scale-125 transition-transform duration-2000"></div>
			
			<div class="md:w-1/2 space-y-10 relative z-10">
				<div class="space-y-6">
					<div class="flex items-center gap-3 text-primary-dark">
						<MapPin size={20} strokeWidth={1.5} />
						<span class="text-xs font-medium uppercase tracking-[0.3em]">Sede Principal</span>
					</div>
					<h2 class="text-4xl md:text-5xl font-display text-gray-900 leading-[1.2]">Ubicación <br /><span class="italic text-primary">Estratégica</span></h2>
					<p class="text-lg text-gray-600 font-light leading-loose">
						Encuentra tu refugio de paz en el sector más exclusivo de <strong class="text-primary-dark font-normal">Medellín</strong>. Un espacio diseñado para la desconexión total sin salir de la ciudad.
					</p>
				</div>
				
				<div class="flex items-center gap-6">
					<div class="h-px w-24 bg-secondary"></div>
					<span class="text-xs font-medium text-gray-400 uppercase tracking-widest">Bogotá • Medellín</span>
				</div>
			</div>

			<div class="md:w-1/2 w-full aspect-video rounded-spa-xl overflow-hidden shadow-spa relative">
				<enhanced:img 
					src={bannerImage}
					alt="L-SPA Map/Location" 
					class="w-full h-full object-cover grayscale-30% brightness-90 hover:grayscale-0 transition-all duration-2000 hover:scale-105"
				/>
				<div class="absolute inset-0 flex items-center justify-center pointer-events-none">
					<div class="p-6 rounded-full bg-primary/90 text-white shadow-2xl animate-pulse backdrop-blur-sm">
						<MapPin size={32} strokeWidth={1.5} />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="px-6">
		<div class="max-w-5xl mx-auto bg-primary rounded-spa-xxl p-20 text-center text-white relative overflow-hidden group">
			<div class="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
			
			<div class="relative z-10 space-y-12">
				<h2 class="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8">¿LISTO PARA TU <br /> TRANSFORMACIÓN?</h2>
				<div class="flex flex-col sm:flex-row justify-center gap-6">
					<Button 
						href={getLocalizedPath('/contacto', currentLang)}
						class="bg-white text-primary hover:bg-gray-100 px-12 py-6 rounded-[28px] text-lg font-black uppercase tracking-widest shadow-2xl shadow-black/10 group/btn"
					>
						Contáctanos Ahora
						<ChevronRight size={20} class="ml-3 group-hover/btn:translate-x-2 transition-transform" />
					</Button>
					<Button 
						href={getLocalizedPath('/servicios', currentLang)}
						class="bg-transparent border-2 border-white/30 text-white hover:bg-white/10 px-12 py-6 rounded-[28px] text-lg font-black uppercase tracking-widest"
					>
						Explorar Servicios
					</Button>
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
