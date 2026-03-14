<script lang="ts">
	import { ShieldCheck, Database, UserCheck, Bell, ChevronRight, Mail, Phone } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Tratamiento de Datos | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 dark:bg-gray-900 pt-40 pb-32 px-6">
	<div class="max-w-4xl mx-auto space-y-12">
		<!-- Header -->
		<header class="text-center space-y-6">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
				<Database size={14} />
				Protección de Datos
			</div>
			<h1 class="text-5xl md:text-7xl font-black text-gray-900 dark:text-white tracking-tighter leading-none uppercase">
				Tratamiento de <br /> <span class="text-primary italic">Datos Personales</span>
			</h1>
			<p class="text-lg text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
				Conoce cómo recolectamos, procesamos y protegemos tus datos personales en cumplimiento con la Ley de Protección de Datos.
			</p>
		</header>

		<!-- Content Card -->
		<div class="bg-white dark:bg-gray-800 rounded-[48px] shadow-2xl shadow-primary/5 border border-gray-100 dark:border-gray-700 overflow-hidden">
			<div class="p-8 md:p-16 space-y-16">
				<!-- Section 1: Responsable -->
				<section class="grid grid-cols-1 md:grid-cols-12 gap-8 group">
					<div class="md:col-span-1">
						<div class="w-px2 h-12 rounded-4xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
							<UserCheck size={24} />
						</div>
					</div>
					<div class="md:col-span-11 space-y-4">
						<h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
							Responsable del Tratamiento
							<div class="h-1 flex-1 bg-gray-50 dark:bg-gray-700 rounded-full"></div>
						</h2>
						<p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
							<span class="text-primary font-bold">L-SPA</span> es el responsable del tratamiento de sus datos personales. Nuestra empresa está domiciliada en Calle 87c#23-52 y nuestro objetivo es brindarle servicios de bienestar y relajación con la máxima excelencia.
						</p>
					</div>
				</section>

				<!-- Section 2: Datos que recopilamos -->
				<section class="grid grid-cols-1 md:grid-cols-12 gap-8 group">
					<div class="md:col-span-1">
						<div class="w-px2 h-12 rounded-4xl bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
							<Database size={24} />
						</div>
					</div>
					<div class="md:col-span-11 space-y-4">
						<h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
							Datos que Recopilamos
							<div class="h-1 flex-1 bg-gray-50 dark:bg-gray-700 rounded-full"></div>
						</h2>
						<p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium mb-4">
							Recopilamos los siguientes datos personales directamente de usted:
						</p>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
							{#each ['Nombre completo', 'Correo electrónico', 'Número de teléfono', 'Dirección de domicilio', 'Fecha de nacimiento', 'Información de pago'] as item}
								<div class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl">
									<div class="w-2 h-2 rounded-full bg-primary"></div>
									<span class="text-sm font-black text-gray-700 dark:text-gray-300 uppercase">{item}</span>
								</div>
							{/each}
						</div>
					</div>
				</section>

				<!-- Section 3: Finalidad -->
				<section class="grid grid-cols-1 md:grid-cols-12 gap-8 group">
					<div class="md:col-span-1">
						<div class="w-px2 h-12 rounded-4xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
							<ChevronRight size={24} />
						</div>
					</div>
					<div class="md:col-span-11 space-y-4">
						<h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
							Finalidad del Tratamiento
							<div class="h-1 flex-1 bg-gray-50 dark:bg-gray-700 rounded-full"></div>
						</h2>
						<p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
							Sus datos personales serán utilizados exclusivamente para los siguientes propósitos:
						</p>
						<ul class="space-y-3 pt-4">
							{#each ['Gestión de reservas y citas', 'Comunicación sobre servicios y promociones', 'Atención al cliente y soporte', 'Cumplimiento de obligaciones legales', 'Mejora de nuestros servicios'] as item}
								<li class="flex items-center gap-3 text-sm font-black text-gray-500 dark:text-gray-400">
									<ChevronRight size={16} class="text-primary shrink-0" />
									{item}
								</li>
							{/each}
						</ul>
					</div>
				</section>

				<!-- Section 4: Derechos -->
				<section class="grid grid-cols-1 md:grid-cols-12 gap-8 group">
					<div class="md:col-span-1">
						<div class="w-px2 h-12 rounded-4xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
							<Bell size={24} />
						</div>
					</div>
					<div class="md:col-span-11 space-y-4">
						<h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
							Tus Derechos
							<div class="h-1 flex-1 bg-gray-50 dark:bg-gray-700 rounded-full"></div>
						</h2>
						<p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
							Como titular de datos personales, usted tiene los siguientes derechos:
						</p>
						<div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
							{#each ['Acceso a sus datos', 'Rectificación de datos incorrectos', 'Cancelación/supresión de datos', 'Oposición al tratamiento', 'Portabilidad de datos', 'Revocación del consentimiento'] as item}
								<div class="flex items-center gap-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
									<ShieldCheck size={18} class="text-purple-500 shrink-0" />
									<span class="text-sm font-bold text-gray-700 dark:text-gray-300">{item}</span>
								</div>
							{/each}
						</div>
					</div>
				</section>

				<!-- Section 5: Contacto -->
				<section class="grid grid-cols-1 md:grid-cols-12 gap-8 group">
					<div class="md:col-span-1">
						<div class="w-px2 h-12 rounded-4xl bg-primary/10 text-primary flex items-center justify-center group-hover:scale-110 transition-transform">
							<Mail size={24} />
						</div>
					</div>
					<div class="md:col-span-11 space-y-4">
						<h2 class="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-4">
							Ejercicio de Derechos
							<div class="h-1 flex-1 bg-gray-50 dark:bg-gray-700 rounded-full"></div>
						</h2>
						<p class="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">
							Para ejercer cualquiera de sus derechos o realizar consultas sobre el tratamiento de sus datos personales, puede contactarnos a través de:
						</p>
						<div class="flex flex-col md:flex-row gap-4 pt-4">
							<a href="mailto:contacto@l-spa.com" class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
								<Mail size={20} class="text-primary" />
								<span class="font-bold text-gray-700 dark:text-gray-300">contacto@l-spa.com</span>
							</a>
							<a href="tel:+1234567890" class="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl hover:bg-primary/5 dark:hover:bg-primary/10 transition-colors">
								<Phone size={20} class="text-primary" />
								<span class="font-bold text-gray-700 dark:text-gray-300">(123) 456-7890</span>
							</a>
						</div>
					</div>
				</section>
			</div>
			
			<!-- Footer of Card -->
			<div class="bg-gray-900 p-10 text-white flex flex-col md:flex-row justify-between items-center gap-6">
				<div class="flex items-center gap-4">
					<ShieldCheck size={32} class="text-primary-light" />
					<span class="text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Última actualización: Marzo 2024</span>
				</div>
				<button class="px-8 py-3 bg-white/10 hover:bg-white/20 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all border border-white/10">
					Descargar PDF
				</button>
			</div>
		</div>

		<!-- Back Link Or Contact -->
		<div class="text-center">
			<p class="text-sm text-gray-400 dark:text-gray-500 font-medium">
				¿Tienes dudas sobre el tratamiento de tus datos? <a href="/contacto" class="text-primary font-black hover:underline">Contáctanos directamente.</a>
			</p>
		</div>
	</div>
</div>
