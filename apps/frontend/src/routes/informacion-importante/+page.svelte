<script lang="ts">
	import { AlertCircle, ShieldAlert, Sparkles, MapPin, Watch, Wine, Info, ArrowUpRight, CheckCircle2 } from 'lucide-svelte';

	const points = [
		{
			icon: ShieldAlert,
			title: "Objetos de Valor",
			desc: "No es necesario asistir con objetos de valor. Interfieren con el servicio y L-SPA no se hace responsable por pérdidas accidentales.",
			color: "text-rose-500 bg-rose-50"
		},
		{
			icon: Watch,
			title: "Puntualidad Elite",
			desc: "Llega 20 minutos antes. El tráfico en Medellín es impredecible. Tu puntualidad garantiza el tiempo sagrado de tu ritual.",
			color: "text-amber-600 bg-amber-50"
		},
		{
			icon: MapPin,
			title: "Verifica tu Sede",
			desc: "Contamos con múltiples sedes exclusivas en El Poblado. Asegúrate de llegar al santuario elegido en tu reserva.",
			color: "text-blue-600 bg-blue-50"
		},
		{
			icon: Info,
			title: "Indumentaria",
			desc: "Asiste con traje de baño y sandalias cómodas. Nosotros te proporcionaremos batas de seda blanca y toallas orgánicas.",
			color: "text-primary bg-primary/10"
		},
		{
			icon: AlertCircle,
			title: "Restricciones",
			desc: "Ambiente libre de humo. No se permite el ingreso de alimentos, bebidas externas ni sustancias que alteren los sentidos.",
			color: "text-gray-900 bg-gray-100"
		},
		{
			icon: Sparkles,
			title: "Santuario de Paz",
			desc: "Mantenemos un ambiente de silencio. Elementos decorativos o equipos manipulados indebidamente serán responsabilidad del huésped.",
			color: "text-purple-600 bg-purple-50"
		}
	];
</script>

<svelte:head>
	<title>Información Importante para tu Visita | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pt-40 pb-32 px-6 overflow-hidden">
	<div class="max-w-7xl mx-auto">
		<!-- Main Container Card -->
		<div class="bg-white rounded-[64px] shadow-2xl shadow-primary/5 border border-gray-100 relative overflow-hidden group/main">
			
			<!-- Animated Background Decor -->
			<div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full -mr-64 -mt-64 blur-[100px] group-hover/main:scale-125 transition-transform duration-1000"></div>
			<div class="absolute bottom-0 left-0 w-px00 h-100  bg-amber-500/5 rounded-full -ml-40 -mb-40 blur-[80px]"></div>

			<div class="p-10 md:p-24 relative z-10">
				<!-- Header Section -->
				<header class="max-w-3xl mb-24 space-y-8 animate-in fade-in slide-in-from-left-12 duration-1000">
					<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-amber-50 text-amber-600 text-[10px] font-black uppercase tracking-[0.4em]">
						<AlertCircle size={14} />
						Guía de Protocolos
					</div>
					<h1 class="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] uppercase">
						INFORMACIÓN <br /> <span class="text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-amber-700 to-amber-900 italic">PARA TU VISITA</span>
					</h1>
					<p class="text-xl text-gray-500 font-medium leading-relaxed max-w-2xl">
						Queremos que cada segundo en nuestro santuario sea perfecto. Por favor, lee estas recomendaciones para garantizar una experiencia de paz absoluta.
					</p>
				</header>

				<!-- Points Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
					{#each points as point, i}
						<div class="group relative animate-in fade-in slide-in-from-bottom-8 duration-700" style="animation-delay: {i * 100}ms">
							<!-- Large Background Number -->
							<div class="absolute -top-16 -left-4 text-[10rem] font-black text-gray-50/70 -z-10 group-hover:text-amber-500/5 group-hover:-translate-y-4 transition-all duration-700 select-none font-serif">
								0{i + 1}
							</div>
							
							<div class="space-y-6">
								<div class="flex items-center justify-between">
									<div class="w-px6 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg {point.color}">
										<point.icon size={28} strokeWidth={2.5} />
									</div>
									<ArrowUpRight size={20} class="text-gray-100 group-hover:text-amber-500 transition-colors" />
								</div>
								
								<div class="space-y-4">
									<h3 class="text-2xl font-black text-gray-900 tracking-tight leading-none uppercase group-hover:text-amber-700 transition-colors">
										{point.title}
									</h3>
									<p class="text-[13px] font-black italic text-gray-400 leading-relaxed uppercase tracking-wider group-hover:text-gray-600 transition-colors">
										{point.desc}
									</p>
								</div>
							</div>

							<!-- Hover Decor Line -->
							<div class="mt-8 h-1 w-0 bg-amber-500 group-hover:w-full transition-all duration-1000 rounded-full opacity-20"></div>
						</div>
					{/each}
				</div>

				<!-- Extra Note / Disclaimer -->
				<footer class="mt-32 p-10 bg-gray-900 rounded-[48px] text-white flex flex-col md:flex-row items-center gap-10 group/footer overflow-hidden relative">
					<div class="absolute top-0 right-0 p-10 opacity-5 group-hover/footer:scale-150 transition-transform duration-1000 rotate-12">
						<Wine size={200} />
					</div>
					
					<div class="w-24 h-134 bg-white/10 rounded-4xl flex items-center justify-center text-amber-500 rotate-12 group-hover/footer:rotate-0 transition-transform duration-700 shrink-0 shadow-2xl">
						<Wine size={48} />
					</div>
					
					<div class="space-y-4 text-center md:text-left flex-1 relative z-10">
						<div class="flex items-center gap-3 justify-center md:justify-start">
							<CheckCircle2 size={16} class="text-amber-500" />
							<span class="text-[10px] font-black uppercase tracking-[0.4em] text-primary-light">Compromiso L-SPA</span>
						</div>
						<p class="text-xl font-medium italic text-primary-light/80 leading-relaxed">
							"El respeto por estas directrices asegura un ambiente de serenidad y lujo para todos nuestros distinguidos visitantes."
						</p>
					</div>

					<div class="relative z-10 shrink-0">
						<a 
							href="/contacto" 
							class="px-8 py-4 bg-white text-gray-900 font-black text-[10px] uppercase tracking-widest rounded-full hover:bg-amber-500 hover:text-white transition-all duration-500 flex items-center gap-3"
						>
							Tengo una consulta específica
						</a>
					</div>
				</footer>
			</div>
		</div>

		<!-- Bottom Brand Mark -->
		<div class="mt-20 flex justify-center opacity-20 hover:opacity-100 transition-opacity duration-700">
			<div class="flex items-center gap-10">
				{#each ['MEDELLÍN', 'SANTUARIO', 'BIENESTAR', 'EL POBLADO'] as tag}
					<span class="text-[9px] font-black uppercase tracking-[0.5em]">{tag}</span>
				{/each}
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 100% 100%, hsla(37, 90%, 50%, 0.03) 0, transparent 40%),
            radial-gradient(at 0% 0%, hsla(327, 67%, 33%, 0.03) 0, transparent 40%);
        background-attachment: fixed;
	}
</style>
