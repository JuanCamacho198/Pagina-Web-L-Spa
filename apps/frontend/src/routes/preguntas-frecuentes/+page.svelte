<script lang="ts">
	import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Users, Clock, Info, MessageCircle, ArrowRight } from 'lucide-svelte';

	let openIndex = $state<number | null>(null);

	const faqs = [
		{
			q: "¿Qué incluye mi ritual o experiencia?",
			a: "Cada ritual incluye una secuencia curada de zonas húmedas, masajes terapéuticos, exfoliaciones botánicas y mascarillas nutritivas. El detalle exacto se encuentra en la descripción de cada servicio en nuestro catálogo digital y se adjunta en tu confirmación de reserva.",
			icon: Sparkles,
			color: "bg-amber-50 text-amber-600"
		},
		{
			q: "¿Puedo asistir acompañado?",
			a: "Absolutamente. Contamos con suites privadas diseñadas específicamente para rituales en pareja, así como áreas sociales para experiencias grupales y eventos corporativos de bienestar.",
			icon: Users,
			color: "bg-blue-50 text-blue-600"
		},
		{
			q: "¿Debo llevar algo para mi reserva?",
			a: "Solo requerimos que traigas tu traje de baño y calzado cómodo. L-SPA te proporciona batas de seda, toallas de alto gramaje, sandalias personalizadas y casilleros de seguridad con tecnología biométrica.",
			icon: Info,
			color: "bg-primary/10 text-primary"
		},
		{
			q: "¿Con cuánta anticipación debo llegar?",
			a: "Para sumergirte completamente en la atmósfera L-SPA, recomendamos llegar 20 minutos antes de tu cita. Esto te permitirá realizar el proceso de check-in sin afanes y disfrutar de nuestra infusión de bienvenida.",
			icon: Clock,
			color: "bg-emerald-50 text-emerald-600"
		},
		{
			q: "¿Está permitido ingresar con alimentos?",
			a: "No es necesario. Ofrecemos una carta selecta de hidratación, tés orgánicos y copas de cortesía según el plan elegido. No se permite el ingreso de alimentos o bebidas externas para preservar la pureza sensorial del ambiente.",
			icon: Info,
			color: "bg-rose-50 text-rose-600"
		},
		{
			q: "¿Hay parqueadero disponible?",
			a: "Contamos con servicio de estacionamiento privado y gratuito con vigilancia 24/7 para todos nuestros huéspedes durante su estancia en el spa.",
			icon: Info,
			color: "bg-gray-100 text-gray-900"
		},
		{
			q: "¿Pueden asistir menores de edad?",
			a: "Nuestras experiencias están optimizadas para adultos. Sin embargo, aceptamos jóvenes desde los 16 años siempre que estén bajo la supervisión directa de un adulto responsable durante todo el recorrido.",
			icon: Users,
			color: "bg-purple-50 text-purple-600"
		}
	];

	function toggle(idx: number) {
		openIndex = openIndex === idx ? null : idx;
	}
</script>

<svelte:head>
	<title>Preguntas Frecuentes | L-SPA Wellness</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/30 pt-40 pb-32 px-6">
	<div class="max-w-4xl mx-auto space-y-20">
		<!-- Header -->
		<div class="text-center space-y-8 animate-in fade-in slide-in-from-top-12 duration-1000">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white shadow-sm border border-gray-100 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
				<HelpCircle size={14} />
				Explora tus dudas
			</div>
			<h1 class="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] uppercase">
				PREGUNTAS <br /> <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary-dark to-primary italic">FRECUENTES</span>
			</h1>
			<p class="text-xl text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
				Todo lo que necesitas saber antes de sumergirte en la experiencia L-SPA.
			</p>
		</div>

		<!-- List -->
		<div class="grid grid-cols-1 gap-4">
			{#each faqs as faq, idx}
				<div 
					class="bg-white rounded-[40px] border transition-all duration-700 overflow-hidden group shadow-2xl flex flex-col"
					style="box-shadow: {openIndex === idx ? '0 25px 50px -12px rgba(88, 28, 45, 0.08)' : '0 10px 15px -3px rgba(0, 0, 0, 0.02)'}; border-color: {openIndex === idx ? 'rgba(88, 28, 45, 0.1)' : '#f3f4f6'}"
				>
					<button 
						onclick={() => toggle(idx)}
						class="w-full p-8 md:p-10 flex items-center justify-between text-left group transition-all"
					>
						<div class="flex items-center gap-6 md:gap-8">
							<div class="w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 {openIndex === idx ? 'bg-primary text-white rotate-6' : faq.color + ' group-hover:scale-110 shadow-sm'}">
								<faq.icon size={28} strokeWidth={2.5} />
							</div>
							<div class="space-y-1">
								<span class="text-[9px] font-black uppercase tracking-widest text-gray-300">Consulta 0{idx + 1}</span>
								<h3 class="text-xl md:text-2xl font-black tracking-tight leading-tight text-gray-900">
									{faq.q}
								</h3>
							</div>
						</div>
						
						<div class="w-12 h-12 rounded-full border border-gray-100 flex items-center justify-center transition-all duration-500 {openIndex === idx ? 'bg-primary border-primary text-white rotate-180' : 'text-gray-300 group-hover:border-primary group-hover:text-primary'}">
							<ChevronDown size={24} />
						</div>
					</button>
					
					{#if openIndex === idx}
						<div class="px-8 md:px-[6.5rem] pb-12 animate-in slide-in-from-top-4 duration-500">
							<div class="h-1 w-full bg-gray-50 rounded-full mb-8 opacity-50"></div>
							<p class="text-lg text-gray-500 font-medium leading-relaxed max-w-2xl">
								{faq.a}
							</p>
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Support CTA -->
		<div class="bg-gray-900 rounded-[64px] p-12 md:p-20 text-center relative overflow-hidden group">
			<div class="absolute inset-0 opacity-20 pointer-events-none">
				<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary rounded-full blur-[120px] group-hover:scale-110 transition-transform duration-1000"></div>
			</div>

			<div class="relative z-10 space-y-10">
				<div class="w-20 h-20 bg-white/10 rounded-3xl mx-auto flex items-center justify-center text-primary-light">
					<MessageCircle size={40} />
				</div>
				<div class="space-y-4">
					<h2 class="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-none">¿Sigues con dudas?</h2>
					<p class="text-primary-light/60 font-medium text-lg max-w-md mx-auto italic">Estamos a un solo clic de distancia para asesorarte de forma personalizada.</p>
				</div>
				<a 
					href="/contacto"
					class="inline-flex items-center gap-4 px-10 py-5 bg-white text-gray-900 font-black rounded-full hover:bg-primary hover:text-white transition-all duration-500 group/btn shadow-2xl"
				>
					HABLAR CON UN ASESOR
					<ArrowRight size={20} class="group-hover/btn:translate-x-2 transition-transform" />
				</a>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 0% 0%, hsla(327, 67%, 33%, 0.05) 0, transparent 40%);
        background-attachment: fixed;
	}
</style>
