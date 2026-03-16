<script lang="ts">
	import { ShieldCheck, Lock, Eye, FileText, ChevronRight } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Políticas de Privacidad | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-40 pb-32 px-6">
	<div class="max-w-4xl mx-auto space-y-12">
		<!-- Header -->
		<header class="text-center space-y-6">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
				<ShieldCheck size={14} />
				Seguridad y Transparencia
			</div>
			<h1 class="font-display text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none uppercase">
				Políticas de <br /> <span class="text-primary italic">Privacidad</span>
			</h1>
			<p class="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
				En L-SPA, su confianza es nuestro activo más valioso. Por ello, protegemos su información con los más altos estándares de seguridad.
			</p>
		</header>

		<!-- Content Card -->
		<div class="bg-white dark:bg-gray-800 rounded-spa-xl shadow-2xl shadow-primary/5 border border-gray-100 dark:border-gray-700 overflow-hidden">
			<div class="p-8 md:p-16 space-y-16">
				<!-- Section 1 -->
				<section class="grid grid-cols-1 md:grid-cols-12 gap-8 group">
					<div class="md:col-span-1">
						<div class="w-px2 h-12 rounded-4xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
							<Eye size={24} />
						</div>
					</div>
					<div class="md:col-span-11 space-y-4">
						<h2 class="font-display text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
							Introducción
							<div class="h-1 flex-1 bg-gray-50 dark:bg-gray-700 rounded-full"></div>
						</h2>
						<p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
							En <span class="text-primary font-bold">L-SPA</span>, nos tomamos muy en serio la privacidad de sus datos personales. Esta política explica cómo recopilamos, usamos y protegemos su información en cumplimiento con las normativas vigentes de protección de datos.
						</p>
					</div>
				</section>

				<!-- Section 2 -->
				<section class="grid grid-cols-1 md:grid-cols-12 gap-8 group">
					<div class="md:col-span-1">
						<div class="w-px2 h-12 rounded-4xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
							<FileText size={24} />
						</div>
					</div>
					<div class="md:col-span-11 space-y-4">
						<h2 class="font-display text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
							Datos que recopilamos
							<div class="h-1 flex-1 bg-gray-50 dark:bg-gray-700 rounded-full"></div>
						</h2>
						<p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
							Recopilamos información básica como su <span class="bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded text-primary text-sm font-bold">nombre completo</span>, <span class="bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded text-primary text-sm font-bold">correo electrónico</span> y <span class="bg-gray-50 dark:bg-gray-700 px-2 py-1 rounded text-primary text-sm font-bold">número de teléfono</span> únicamente cuando usted se registra en nuestra plataforma o realiza una reserva de servicios.
						</p>
					</div>
				</section>

				<!-- Section 3 -->
				<section class="grid grid-cols-1 md:grid-cols-12 gap-8 group">
					<div class="md:col-span-1">
						<div class="w-px2 h-12 rounded-4xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
							<Lock size={24} />
						</div>
					</div>
					<div class="md:col-span-11 space-y-4">
						<h2 class="font-display text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
							Seguridad de la Información
							<div class="h-1 flex-1 bg-gray-50 dark:bg-gray-700 rounded-full"></div>
						</h2>
						<p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
							Implementamos medidas de seguridad técnicas, físicas y administrativas para garantizar la confidencialidad de sus datos. No vendemos ni compartimos su información personal con terceros bajo ninguna circunstancia sin su consentimiento explícito.
						</p>
						<ul class="space-y-3 pt-4">
							{#each ['Encriptación de datos extremo a extremo', 'Acceso restringido a personal autorizado', 'Monitoreo constante de vulnerabilidades'] as item}
								<li class="flex items-center gap-3 text-sm font-black text-gray-400 dark:text-gray-500">
									<ChevronRight size={16} class="text-primary" />
									{item.toUpperCase()}
								</li>
							{/each}
						</ul>
					</div>
				</section>
			</div>
			
			<!-- Footer of Card -->
			<div class="bg-gray-900 dark:bg-gray-950 p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
				<div class="flex items-center gap-4">
					<ShieldCheck size={32} class="text-primary-light" />
					<span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Última actualización: Marzo 2024</span>
				</div>
				<button class="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500 border border-white/10">
					Descargar PDF
				</button>
			</div>
		</div>

		<!-- Back Link Or Contact -->
		<div class="text-center">
			<p class="text-sm text-gray-400 dark:text-gray-500 font-medium">
				¿Tienes dudas sobre tus datos? <a href="/contacto" class="text-primary font-black hover:underline">Contáctanos directamente.</a>
			</p>
		</div>
	</div>
</div>
