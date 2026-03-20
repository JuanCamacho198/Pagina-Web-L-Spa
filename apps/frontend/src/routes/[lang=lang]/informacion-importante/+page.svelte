<script lang="ts">
	import { AlertCircle, ShieldAlert, Sparkles, MapPin, Watch, Wine, Info, ArrowUpRight, CheckCircle2 } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { getLocalizedPath } from '$lib/i18n/utils';

	let currentLang = $derived($page.params.lang || 'es');

	const points = [
		{
			icon: ShieldAlert,
			title: "Objetos de Valor",
			desc: "No es necesario asistir con objetos de valor. Interfieren con el servicio y L-SPA no se hace responsable por pérdidas accidentales.",
			color: "text-primary-dark bg-secondary"
		},
		{
			icon: Watch,
			title: "Puntualidad Elite",
			desc: "Llega 20 minutos antes. El tráfico de la ciudad es impredecible. Tu puntualidad garantiza el tiempo sagrado de tu ritual.",
			color: "text-primary-dark bg-secondary"
		},
		{
			icon: MapPin,
			title: "Verifica tu Sede",
			desc: "Contamos con múltiples sedes exclusivas en El Poblado. Asegúrate de llegar al santuario elegido en tu reserva.",
			color: "text-primary-dark bg-secondary"
		},
		{
			icon: Info,
			title: "Indumentaria",
			desc: "Asiste con traje de baño y sandalias cómodas. Nosotros te proporcionaremos batas de seda blanca y toallas orgánicas.",
			color: "text-primary-dark bg-secondary"
		},
		{
			icon: AlertCircle,
			title: "Restricciones",
			desc: "Ambiente libre de humo. No se permite el ingreso de alimentos, bebidas externas ni sustancias que alteren los sentidos.",
			color: "text-primary-dark bg-secondary"
		},
		{
			icon: Sparkles,
			title: "Santuario de Paz",
			desc: "Mantenemos un ambiente de pleno silencio. El uso indebido de los equipos o decoración será responsabilidad de cada huésped.",
			color: "text-primary-dark bg-secondary"
		}
	];
</script>

<svelte:head>
	<title>Información Importante | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-[#FAFAFA] dark:bg-[#121212] transition-colors duration-700 pt-40 pb-32 px-6 overflow-hidden">
	<div class="max-w-7xl mx-auto">
		<!-- Main Container Card -->
		<div class="bg-white dark:bg-[#1A1A1A] rounded-spa-xxl shadow-spa dark:shadow-none border border-gray-50 dark:border-white/5 relative overflow-hidden group/main transition-colors duration-700">
			
			<!-- Elegant Background Decor -->
			<div class="absolute top-0 right-0 w-125 h-125 bg-secondary dark:bg-white/5 rounded-full -mr-64 -mt-64 blur-[120px] transition-transform duration-2000 group-hover/main:scale-110"></div>
			<div class="absolute bottom-0 left-0 w-100 h-100 bg-primary/5 dark:bg-primary/10 rounded-full -ml-40 -mb-40 blur-[100px]"></div>

			<div class="p-10 md:p-24 relative z-10">
				<!-- Header Section -->
				<header class="max-w-3xl mb-24 space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
					<div class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-secondary dark:border-white/10 text-primary-light dark:text-primary-light text-xs uppercase tracking-[0.2em] font-medium transition-colors">
						<AlertCircle size={14} strokeWidth={1.5} />
						<span>Guía de Protocolos</span>
					</div>
					<h1 class="text-5xl md:text-7xl font-display text-gray-900 dark:text-white tracking-tight leading-[1.1] transition-colors">
						Información <br /> <span class="italic text-primary-dark dark:text-primary-light font-light">Para tu Visita</span>
					</h1>
					<p class="text-lg text-gray-500 dark:text-gray-400 leading-relaxed max-w-2xl font-light transition-colors">
						Queremos que cada segundo en nuestro santuario sea perfecto. Por favor, lee estas recomendaciones para garantizar una experiencia de paz absoluta y armonía compartida.
					</p>
				</header>

				<!-- Points Grid -->
				<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
					{#each points as point, i}
						<div class="group relative animate-in fade-in slide-in-from-bottom-8 duration-1000" style="animation-delay: {i * 150}ms">
							<!-- Large Elegant Number -->
							<div class="absolute -top-12 -left-6 text-8xl font-display text-secondary/30 dark:text-white/5 -z-10 group-hover:text-primary/10 dark:group-hover:text-primary/20 transition-colors duration-700 select-none">
								0{i + 1}
							</div>
							
							<div class="space-y-6">
								<div class="flex items-center justify-between">
									<div class="w-14 h-14 rounded-full flex items-center justify-center transition-all duration-500 group-hover:shadow-spa dark:group-hover:shadow-none dark:bg-white/5 dark:text-primary-light {point.color}">
										<point.icon size={24} strokeWidth={1.5} />
									</div>
									<ArrowUpRight size={20} class="text-gray-300 dark:text-gray-600 group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-500" />
								</div>
								
								<div class="space-y-3">
									<h3 class="text-2xl font-display text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors duration-500">
										{point.title}
									</h3>
									<p class="text-sm text-gray-600 dark:text-gray-400 leading-loose font-light transition-colors">
										{point.desc}
									</p>
								</div>
							</div>
						</div>
					{/each}
				</div>

				<!-- Elegant Footer Area -->
				<footer class="mt-32 p-12 bg-primary-dark dark:bg-[#121212] rounded-spa-xl text-white flex flex-col md:flex-row items-center gap-12 group/footer overflow-hidden relative shadow-spa dark:shadow-none dark:border dark:border-white/5 transition-colors duration-700">
					<div class="absolute top-0 right-0 p-10 opacity-5 group-hover/footer:scale-125 transition-transform duration-2000 rotate-12">
						<Wine size={200} strokeWidth={1} />
					</div>
					
					<div class="space-y-4 text-center md:text-left flex-1 relative z-10">
						<div class="flex items-center gap-3 justify-center md:justify-start text-accent dark:text-primary-light">
							<CheckCircle2 size={16} strokeWidth={1.5} />
							<span class="text-xs uppercase tracking-[0.3em] font-medium">Compromiso L-SPA</span>
						</div>
						<p class="text-2xl font-display italic text-secondary dark:text-gray-300 leading-relaxed max-w-2xl transition-colors">
							"El respeto por estas directrices asegura un ambiente de serenidad y lujo para todos nuestros distinguidos visitantes."
						</p>
					</div>

					<div class="relative z-10 shrink-0">
						<a 
							href={getLocalizedPath('/contacto', currentLang)} 
							class="px-8 py-4 bg-white dark:bg-primary-dark text-primary-dark dark:text-white text-sm uppercase tracking-[0.2em] font-medium rounded-full hover:bg-secondary dark:hover:bg-primary transition-colors duration-500 flex items-center gap-3 shadow-sm hover:shadow-md"
						>
							Consultas Específicas
						</a>
					</div>
				</footer>
			</div>
		</div>

		<!-- Bottom Brand Mark -->
		<div class="mt-16 flex justify-center opacity-30 hover:opacity-100 transition-opacity duration-700">
			<div class="flex items-center gap-8 text-primary-dark dark:text-white">
				{#each ['MEDELLÍN', 'SANTUARIO', 'BIENESTAR', 'EL POBLADO'] as tag}
					<span class="text-[10px] uppercase tracking-[0.4em] font-medium">{tag}</span>
				{/each}
			</div>
		</div>
	</div>
</div>
