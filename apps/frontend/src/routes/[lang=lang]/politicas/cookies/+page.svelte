<script lang="ts">
	import { Cookie, Settings, Eye, HelpCircle, ChevronRight, PieChart } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Políticas de Cookies | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-40 pb-32 px-6">
	<div class="max-w-4xl mx-auto space-y-12">
		<!-- Header -->
		<header class="text-center space-y-8 animate-in fade-in slide-in-from-top-12 duration-1000">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
				<Cookie size={14} />
				Experiencia Digital Personalizada
			</div>
			<h1 class="font-display text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none uppercase">
				Política de <br /> <span class="text-primary italic">Cookies</span>
			</h1>
			<p class="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
				Utilizamos tecnología avanzada para que tu navegación sea tan fluida y personalizada como nuestros tratamientos en sede.
			</p>
		</header>

		<!-- Content Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
			<!-- Essential -->
			<div class="bg-white dark:bg-gray-800 p-12 rounded-[56px] shadow-2xl shadow-primary/5 border border-gray-100 dark:border-gray-700 space-y-8 group hover:-translate-y-2 transition-transform duration-500">
				<div class="w-px6 h-16 rounded-4xl bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500 shadow-sm">
					<Settings size={32} strokeWidth={2.5} />
				</div>
				<div class="space-y-4">
					<h3 class="font-display text-2xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">¿Qué son las Cookies?</h3>
					<div class="h-1 w-px2 bg-primary rounded-full group-hover:w-full transition-all duration-700"></div>
				</div>
				<p class="text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
					Las <span class="text-primary font-bold italic">Cookies</span> son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. Ayudan a que el sitio funcione correctamente y nos permiten mejorar sustancialmente su experiencia de navegación premium.
				</p>
			</div>

			<!-- Analytics -->
			<div class="bg-gray-900 dark:bg-gray-950 p-12 rounded-[56px] text-white space-y-8 group hover:-translate-y-2 transition-transform duration-500 relative overflow-hidden">
				<div class="absolute -bottom-10 -right-10 opacity-10 group-hover:scale-125 transition-transform duration-1000">
					<PieChart size={200} />
				</div>
				<div class="w-px6 h-16 rounded-4xl bg-white/10 text-primary-light flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all duration-500">
					<PieChart size={32} strokeWidth={2.5} />
				</div>
				<div class="space-y-4">
					<h3 class="font-display text-2xl font-black tracking-tight leading-none uppercase">¿Cómo las usamos?</h3>
					<div class="h-1 w-px2 bg-primary-light rounded-full group-hover:w-full transition-all duration-700"></div>
				</div>
				<ul class="space-y-4 relative z-10">
					{#each ['Mantenimiento de sesión segura', 'Recordatorio de preferencias de reserva', 'Análisis estadístico anónimo', 'Optimización de tiempos de carga'] as item}
						<li class="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest opacity-70 group-hover:opacity-100 transition-opacity">
							<div class="w-px.5 h-1.5 rounded-full bg-primary-light"></div>
							{item}
						</li>
					{/each}
				</ul>
			</div>
		</div>

		<!-- Management Section -->
		<div class="bg-white dark:bg-gray-800 p-12 md:p-20 rounded-spa-xxl shadow-2xl shadow-primary/5 border border-gray-100 dark:border-gray-700 relative overflow-hidden group">
			<div class="flex flex-col md:flex-row items-center gap-12 relative z-10">
				<div class="w-32 h-32 rounded-[40px] bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0 rotate-12 group-hover:rotate-0 transition-transform duration-700">
					<HelpCircle size={64} strokeWidth={1.5} />
				</div>
				<div class="space-y-6 text-center md:text-left">
					<h3 class="font-display text-3xl font-black text-gray-900 dark:text-white tracking-tight leading-none uppercase">Gestión de <span class="italic text-primary">Preferencias</span></h3>
					<p class="text-gray-500 dark:text-gray-400 font-medium leading-relaxed max-w-pxl">
						Usted tiene el control total. Puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador. Tenga en cuenta que deshabilitarlas podría limitar el acceso a ciertas funcionalidades de nuestra plataforma de reservas.
					</p>
					<div class="flex flex-wrap gap-4 justify-center md:justify-start">
						{#each ['Chrome', 'Safari', 'Firefox', 'Edge'] as browser}
							<span class="px-5 py-2 bg-gray-50 dark:bg-gray-700 rounded-full text-[9px] font-black text-gray-400 dark:text-gray-300 group-hover:text-primary transition-colors duration-500 border border-gray-100 dark:border-gray-600">{browser.toUpperCase()}</span>
						{/each}
					</div>
				</div>
			</div>
		</div>

		<!-- Trust Footer -->
		<div class="text-center">
			<p class="text-[10px] font-black uppercase tracking-[0.5em] text-gray-300">
				L-SPA WORLDWIDE PRIVACY STANDARDS 2024
			</p>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 100% 0%, hsla(327, 67%, 33%, 0.04) 0, transparent 40%);
        background-attachment: fixed;
	}
</style>
