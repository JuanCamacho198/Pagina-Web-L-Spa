<script lang="ts">
	import { Target, Eye, ShieldCheck, Heart, Sparkles, Coffee, ChevronRight, Award, MapPin } from 'lucide-svelte';
	import Button from '$lib/components/Button.svelte';
	import Typography from '$lib/components/Typography.svelte';
	import { cn } from '$lib/utils/cn';

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
			<img 
				src="/src/assets/banners/bannerSpa.avif" 
				alt="L-SPA Essence" 
				class="w-full h-full object-cover brightness-[0.4] saturate-[0.8]"
			/>
			<div class="absolute inset-0 bg-linear-to-b from-transparent via-primary/10 to-white"></div>
		</div>
		
		<div class="relative z-10 text-center px-6 max-w-4xl space-y-8 animate-in fade-in zoom-in duration-1000">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
				<Award size={14} class="text-primary-light" />
				EXCELENCIA EN BIENESTAR
			</div>
			
			<h1 class="text-6xl md:text-8xl font-black text-white leading-none tracking-tighter drop-shadow-2xl">
				NUESTRA <br /> <span class="text-transparent bg-clip-text bg-linear-to-r from-primary-light via-white to-primary-light/60">ESENCIA</span>
			</h1>
			
			<p class="text-xl md:text-2xl text-gray-200 font-medium leading-relaxed max-w-2xl mx-auto drop-shadow-lg">
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
				<div class="relative w-full max-w-md aspect-4/5 bg-gray-50 rounded-[64px] overflow-hidden shadow-2xl shadow-primary/10 border border-gray-100">
					<img 
						src="/src/assets/banners/bannerSpa.avif" 
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
					<div class="inline-flex items-center gap-4 px-6 py-2 bg-primary/5 text-primary rounded-full text-[10px] font-black uppercase tracking-[0.3em] border border-primary/10">
						<Target size={16} /> Nuestra Misión
					</div>
					<h2 class="text-5xl md:text-6xl font-black text-gray-900 tracking-tighter leading-[0.9]">
						Compromiso con tu <br /> <span class="text-primary italic">Transformación Digital</span>
					</h2>
					<p class="text-xl text-gray-500 font-medium leading-relaxed">
						En <strong class="text-gray-900 font-black">L-SPA</strong>, trascendemos lo convencional para ofrecer un servicio integral que fusiona relajación, vitalidad y salud. Nuestra prioridad es la satisfacción total a través de una atención personalizada que evoluciona contigo.
					</p>
				</div>

				<div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
					<div class="p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 flex items-start gap-6 group hover:bg-white hover:shadow-xl transition-all duration-500">
						<div class="h-12 w-px2 bg-white rounded-4xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
							<ShieldCheck size={24} />
						</div>
						<div class="space-y-1">
							<h4 class="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">Certificado</h4>
							<p class="text-xs font-bold text-gray-400 uppercase tracking-tighter">Calidad Garantizada</p>
						</div>
					</div>
					<div class="p-8 bg-gray-50/50 rounded-[40px] border border-gray-100 flex items-start gap-6 group hover:bg-white hover:shadow-xl transition-all duration-500">
						<div class="h-12 w-px2 bg-white rounded-4xl flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
							<Heart size={24} />
						</div>
						<div class="space-y-1">
							<h4 class="text-sm font-black text-gray-900 uppercase tracking-widest leading-none">Empatía</h4>
							<p class="text-xs font-bold text-gray-400 uppercase tracking-tighter">Pasión por el detalle</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Pilares Section -->
	<section class="py-32 px-6 lg:px-8 bg-gray-900 text-white relative overflow-hidden">
		<!-- Decor Circles -->
		<div class="absolute -top-24 -left-24 w-96 h-96 bg-primary opacity-[0.03] rounded-full blur-[100px]"></div>
		<div class="absolute -bottom-24 -right-24 w-96 h-96 bg-primary-light opacity-[0.03] rounded-full blur-[100px]"></div>

		<div class="max-w-7xl mx-auto">
			<div class="text-center space-y-6 mb-24">
				<h2 class="text-xs font-black uppercase tracking-[0.5em] text-primary-light">Nuestros Pilares</h2>
				<p class="text-5xl md:text-7xl font-black tracking-tighter leading-none">FUNDAMENTOS DE <br /> <span class="text-transparent bg-clip-text bg-linear-to-r from-primary-light to-white">LA EXPERIENCIA</span></p>
			</div>

			<div class="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
				{#each pillars as pillar}
					<div class="bg-white/5 backdrop-blur-3xl p-12 rounded-[56px] border border-white/10 group hover:bg-white/10 hover:-translate-y-4 transition-all duration-700">
						<div class={cn("h-130 w-20 rounded-4xl flex items-center justify-center mb-10 shadow-2xl transition-all duration-500 group-hover:rotate-12 group-hover:scale-110", "bg-white/5")}>
							<pillar.icon size={40} strokeWidth={2.5} class={pillar.color} />
						</div>
						<h4 class="text-2xl font-black mb-4 tracking-tight uppercase text-primary-light">{pillar.title}</h4>
						<p class="text-lg text-gray-400 font-medium leading-relaxed group-hover:text-white transition-colors uppercase tracking-tight">
							{pillar.desc}
						</p>
					</div>
				{/each}
			</div>
		</div>
	</section>

	<!-- Ubicación/Experiencia Section -->
	<section class="py-40 px-6 lg:px-8 max-w-7xl mx-auto">
		<div class="rounded-[80px] bg-gray-50 border border-gray-100 p-12 md:p-24 flex flex-col md:flex-row items-center gap-20 relative overflow-hidden group">
			<!-- Abstract Background -->
			<div class="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
			
			<div class="md:w-px/2 space-y-10 relative z-10">
				<div class="space-y-6">
					<div class="flex items-center gap-3 text-primary">
						<MapPin size={24} />
						<span class="text-[10px] font-black uppercase tracking-[0.4em]">Sede Principal</span>
					</div>
					<h2 class="text-5xl font-black text-gray-900 tracking-tighter leading-none uppercase">Ubicación <br /> Estratégica</h2>
					<p class="text-xl text-gray-500 font-medium leading-relaxed">
						Encuentra tu refugio de paz en el sector más exclusivo de <strong class="text-gray-900">Medellín</strong>. Un espacio diseñado para la desconexión total sin salir de la ciudad.
					</p>
				</div>
				
				<div class="flex items-center gap-4">
					<div class="h-13x w-20 bg-gray-200"></div>
					<span class="text-[9px] font-black text-gray-400 uppercase tracking-widest leading-none">Bogotá • Medellín</span>
				</div>
			</div>

			<div class="md:w-px/2 w-full aspect-video rounded-[48px] overflow-hidden shadow-2xl relative">
				<img 
					src="/src/assets/banners/bannerSpa.avif" 
					alt="L-SPA Map/Location" 
					class="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 transition-all duration-1000"
				/>
				<div class="absolute inset-0 flex items-center justify-center">
					<div class="p-8 rounded-full bg-primary/90 text-white shadow-2xl animate-pulse">
						<MapPin size={40} />
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="px-6">
		<div class="max-w-5xl mx-auto bg-primary rounded-[64px] p-20 text-center text-white relative overflow-hidden group">
			<div class="absolute inset-0 bg-black/10 translate-y-full group-hover:translate-y-0 transition-transform duration-700"></div>
			
			<div class="relative z-10 space-y-12">
				<h2 class="text-4xl md:text-6xl font-black tracking-tighter leading-none mb-8">¿LISTO PARA TU <br /> TRANSFORMACIÓN?</h2>
				<div class="flex flex-col sm:flex-row justify-center gap-6">
					<Button 
						href="/contacto"
						class="bg-white text-primary hover:bg-gray-100 px-12 py-6 rounded-[28px] text-lg font-black uppercase tracking-widest shadow-2xl shadow-black/10 group/btn"
					>
						Contáctanos Ahora
						<ChevronRight size={20} class="ml-3 group-hover/btn:translate-x-2 transition-transform" />
					</Button>
					<Button 
						href="/servicios"
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
