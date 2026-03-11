<script lang="ts">
	import { Mail, MapPin, Send, MessageCircle, Phone, Clock, ShieldCheck, Sparkles } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import * as Button from '$lib/components/Button.svelte';
	import * as Typography from '$lib/components/Typography.svelte';
	import { toast } from '$lib/components/Toast.svelte';

	let isSubmitting = $state(false);
	
	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		isSubmitting = true;
		
		// Simulación de envío
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		toast.success('¡Mensaje enviado con éxito! Te contactaremos pronto.');
		isSubmitting = false;
		(e.target as HTMLFormElement).reset();
	};

	const contactCards = [
		{ 
			icon: Mail, 
			title: "Correo Electrónico", 
			value: "info@l-spa.com", 
			href: "mailto:info@l-spa.com",
			color: "bg-primary/10 text-primary",
			hover: "hover:bg-primary"
		},
		{ 
			icon: MessageCircle, 
			title: "WhatsApp Business", 
			value: "+57 300 000 0000", 
			href: "https://wa.me/573000000000",
			color: "bg-emerald-50 text-emerald-500",
			hover: "hover:bg-emerald-500"
		},
		{ 
			icon: MapPin, 
			title: "Nuestra Sede", 
			value: "El Poblado, Medellín", 
			href: "#map",
			color: "bg-amber-50 text-amber-600",
			hover: "hover:bg-amber-600"
		}
	];
</script>

<svelte:head>
	<title>Contacto | L-SPA Premium Wellness Medellín</title>
	<meta name="description" content="¿Tienes dudas? Contáctanos para agendar tu cita de bienestar en Medellín. Estamos listos para asesorarte." />
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pb-32">
	<!-- Hero Section -->
	<section class="bg-primary pt-40 pb-32 px-6 relative overflow-hidden">
		<!-- Decor -->
		<div class="absolute top-0 right-0 w-200 h-200 bg-white opacity-[0.03] rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-black opacity-5 rounded-full -translate-x-1/2 translate-y-1/2"></div>
		
		<div class="max-w-7xl mx-auto text-center relative z-10 space-y-8 animate-in fade-in slide-in-from-top-12 duration-1000">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-white/10 text-white text-[10px] font-black uppercase tracking-[0.4em]">
				<Sparkles size={14} />
				Canales de Atención
			</div>
			<h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85]">
				ESTAMOS PARA <br /> <span class="text-transparent bg-clip-text bg-linear-to-r from-primary-light via-white to-primary-light/60">ESCUCHARTE</span>
			</h1>
			<p class="text-xl text-primary-light/90 max-w-2xl mx-auto font-medium leading-relaxed">
				¿Tienes dudas o quieres agendar una experiencia personalizada? Nuestro equipo de expertos está listo para asesorarte en tu viaje de bienestar.
			</p>
		</div>
	</section>

	<section class="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
		<div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
			<!-- Contact Sidebar -->
			<div class="lg:col-span-4 space-y-6">
				{#each contactCards as card}
					<a 
						href={card.href}
						class={cn(
							"bg-white p-10 rounded-[48px] shadow-2xl shadow-primary/5 border border-gray-100 flex flex-col items-center text-center group transition-all duration-700 hover:-translate-y-2",
							card.hover
						)}
					>
						<div class={cn("w-20 h-20 rounded-3xl flex items-center justify-center mb-8 transition-all duration-500 group-hover:bg-white/20 group-hover:text-white group-hover:scale-110 shadow-sm", card.color)}>
							<card.icon size={36} strokeWidth={2.5} />
						</div>
						<h3 class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2 group-hover:text-white transition-colors">{card.title}</h3>
						<p class="text-2xl font-black text-gray-900 group-hover:text-white transition-colors tracking-tight">{card.value}</p>
					</a>
				{/each}

				<!-- Extra Info Box -->
				<div class="bg-gray-900 rounded-[48px] p-10 text-white space-y-8 relative overflow-hidden group">
					<div class="absolute top-0 right-0 p-8 opacity-20 group-hover:scale-125 transition-transform duration-1000">
						<Clock size={80} />
					</div>
					<h4 class="text-lg font-black tracking-tight border-l-4 border-primary pl-6">Horarios de Atención</h4>
					<div class="space-y-4">
						<div class="flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
							<span class="text-[10px] font-black uppercase tracking-widest leading-none">Lunes - Viernes</span>
							<span class="text-sm font-black">09:00 - 20:00</span>
						</div>
						<div class="flex justify-between items-center opacity-70 group-hover:opacity-100 transition-opacity">
							<span class="text-[10px] font-black uppercase tracking-widest">Sábados</span>
							<span class="text-sm font-black">10:00 - 18:00</span>
						</div>
						<div class="flex justify-between items-center text-primary-light font-black">
							<span class="text-[10px] uppercase tracking-widest">Domingos</span>
							<span class="text-sm">Cerrado</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Form & Map -->
			<div class="lg:col-span-8 space-y-12">
				<div id="map" class="bg-white p-6 rounded-[56px] shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden h-125 relative group">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d891.3024654937047!2d-75.56598343906558!3d6.208142145211063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e442829c522fdb3%3A0x5abdd43099235c76!2sCra.%2036%20%238a-40%2C%20El%20Poblado%2C%20Medell%C3%ADn%2C%20El%20Poblado%2C%20Medell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses-419!2sco!4v1727018084186!5m2!1ses-419!2sco"
						class="w-full h-full rounded-[40px] grayscale hover:grayscale-0 transition-all duration-1000"
						style="border: 0"
						allowfullscreen={true}
						loading="lazy"
						title="L-Spa Location"
					></iframe>
				</div>

				<div class="bg-white p-12 md:p-20 rounded-[64px] shadow-2xl shadow-primary/5 border border-gray-100 relative overflow-hidden group">
					<!-- Bg Icon -->
					<div class="absolute -bottom-20 -right-20 opacity-5 -rotate-12 group-hover:rotate-0 transition-all duration-1000">
						<Send size={300} class="text-primary" />
					</div>

					<div class="relative z-10 space-y-12">
						<div class="space-y-4">
							<h2 class="text-4xl md:text-5xl font-black text-gray-900 tracking-tighter leading-none uppercase">Envíanos un <br /> <span class="text-primary italic">Mensaje Privado</span></h2>
							<div class="h-1.5 w-24 bg-primary rounded-full"></div>
						</div>

						<form onsubmit={handleSubmit} class="space-y-8">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-8">
								<div class="space-y-3">
									<label for="name" class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Tu Nombre</label>
									<input 
										id="name"
										required
										type="text" 
										class="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl ring-1 ring-gray-100 focus:ring-primary/20 transition-all outline-none font-bold text-gray-900" 
										placeholder="Ej. Juan Pérez" 
									/>
								</div>
								<div class="space-y-3">
									<label for="email" class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">Correo Electrónico</label>
									<input 
										id="email"
										required
										type="email" 
										class="w-full px-8 py-5 bg-gray-50 border-none rounded-3xl ring-1 ring-gray-100 focus:ring-primary/20 transition-all outline-none font-bold text-gray-900" 
										placeholder="juan@ejemplo.com" 
									/>
								</div>
							</div>
							
							<div class="space-y-3">
								<label for="message" class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-4">¿En qué podemos ayudarte?</label>
								<textarea 
									id="message"
									required
									rows={5} 
									class="w-full px-8 py-6 bg-gray-50 border-none rounded-4xl ring-1 ring-gray-100 focus:ring-primary/20 transition-all outline-none font-bold text-gray-900 resize-none" 
									placeholder="Describe tu consulta..."
								></textarea>
							</div>

							<Button 
								type="submit"
								disabled={isSubmitting}
								class="w-full py-7 rounded-4xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 group disabled:opacity-50"
							>
								{#if isSubmitting}
									<div class="flex items-center gap-3">
										<div class="h-5 w-5 border-2 border-white border-t-transparent animate-spin rounded-full"></div>
										PROCESANDO...
									</div>
								{:else}
									<span class="flex items-center gap-4">
										Enviar Información
										<Send size={20} class="group-hover:translate-x-3 group-hover:-translate-y-3 transition-transform duration-500" />
									</span>
								{/if}
							</Button>
						</form>
					</div>
				</div>
			</div>
		</div>

		<!-- Trust Badges -->
		<div class="mt-24 grid grid-cols-2 md:grid-cols-4 gap-8">
			{#each [
				{ icon: ShieldCheck, text: "DATOS SEGUROS" },
				{ icon: Send, text: "RESPUESTA < 24H" },
				{ icon: Sparkles, text: "ATENCIÓN VIP" },
				{ icon: Phone, text: "SOPORTE 24/7" }
			] as badge}
				<div class="flex flex-col items-center gap-4 opacity-30 hover:opacity-100 transition-opacity cursor-default group">
					<badge.icon size={24} class="text-primary group-hover:scale-110 transition-transform" />
					<span class="text-[9px] font-black uppercase tracking-[0.3em]">{badge.text}</span>
				</div>
			{/each}
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
