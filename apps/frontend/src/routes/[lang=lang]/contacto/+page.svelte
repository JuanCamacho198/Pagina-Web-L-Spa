<script lang="ts">
	import { Mail, MapPin, Send, MessageCircle, Phone, Clock, ShieldCheck, Sparkles } from 'lucide-svelte';
	import { cn } from '$lib/utils/cn';
	import Button from '$lib/components/ui/Button.svelte';
	import Typography from '$lib/components/ui/Typography.svelte';
	import { toast } from '$lib/stores/toast.svelte';
	import { _ } from 'svelte-i18n';

	let isSubmitting = $state(false);
	
	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		isSubmitting = true;
		
		// Simulación de envío
		await new Promise(resolve => setTimeout(resolve, 2000));
		
		toast.success($_('contact.toast.messageSent'));
		isSubmitting = false;
		(e.target as HTMLFormElement).reset();
	};

	const contactCards = [
		{ 
			icon: Mail, 
			titleKey: 'contact.cards.email.title', 
			value: "info@l-spa.com", 
			href: "mailto:info@l-spa.com",
			color: "bg-primary/10 text-primary",
			hover: "hover:bg-primary"
		},
		{ 
			icon: MessageCircle, 
			titleKey: 'contact.cards.whatsapp.title', 
			value: "+57 300 000 0000", 
			href: "https://wa.me/573000000000",
			color: "bg-emerald-50 text-emerald-500",
			hover: "hover:bg-emerald-500"
		},
		{ 
			icon: MapPin, 
			titleKey: 'contact.cards.location.title', 
			value: "El Poblado, Medellín", 
			href: "#map",
			color: "bg-amber-50 text-amber-600",
			hover: "hover:bg-amber-600"
		}
	];
</script>

<svelte:head>
	<title>{$_('contact.title')} | L-SPA Premium Wellness Medellín</title>
	<meta name="description" content={$_('contact.subtitle')} />
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pb-32">
	<!-- Hero Section -->
	<section class="bg-primary-dark pt-40 pb-32 px-6 relative overflow-hidden">
		<!-- Decor -->
		<div class="absolute top-0 right-0 w-160 h-160 bg-primary/20 opacity-50 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
		<div class="absolute bottom-0 left-0 w-64 h-64 bg-secondary opacity-10 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl"></div>
		
		<div class="max-w-7xl mx-auto text-center relative z-10 space-y-8 animate-in fade-in slide-in-from-top-12 duration-1000">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/20 bg-white/5 text-white text-xs font-medium uppercase tracking-[0.3em]">
				<Sparkles size={14} class="text-secondary" />
				<span>{$_('contact.hero.badge')}</span>
			</div>
			<h1 class="text-5xl md:text-7xl font-display text-white tracking-tight leading-tight">
				{$_('contact.hero.headline')}
			</h1>
			<p class="text-lg text-gray-300 max-w-2xl mx-auto font-light leading-relaxed">
				{$_('contact.subtitle')}
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
							"bg-white p-10 rounded-spa-xl shadow-spa border border-gray-50 flex flex-col items-center text-center group transition-all duration-700 hover:-translate-y-2",
							card.hover
						)}
					>
						<div class={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-all duration-500 group-hover:bg-white/20 group-hover:text-white group-hover:scale-110 shadow-sm", card.color)}>
							<card.icon size={26} strokeWidth={1.5} />
						</div>
						<h3 class="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 mb-3 group-hover:text-white transition-colors">{$_(card.titleKey)}</h3>
						<p class="text-xl font-display text-gray-900 group-hover:text-white transition-colors">
							{card.value}
						</p>
					</a>
				{/each}

				<!-- Extra Info Box -->
				<div class="bg-primary-dark rounded-spa-xl p-10 text-white space-y-8 relative overflow-hidden group shadow-spa">
					<div class="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform duration-2000">
						<Clock size={100} strokeWidth={1} />
					</div>
					<h4 class="text-lg font-display tracking-wide border-l-2 border-secondary pl-4">{$_('contact.hours.title')}</h4>
					<div class="space-y-5 font-light text-sm">
						<div class="flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
							<span class="uppercase tracking-widest text-[10px]">{$_('contact.hours.weekdays')}</span>
							<span>{$_('contact.hours.openTime')}</span>
						</div>
						<div class="flex justify-between items-center opacity-80 group-hover:opacity-100 transition-opacity">
							<span class="uppercase tracking-widest text-[10px]">{$_('contact.hours.saturday')}</span>
							<span>{$_('contact.hours.saturdayTime')}</span>
						</div>
						<div class="flex justify-between items-center text-secondary font-medium">
							<span class="uppercase tracking-widest text-[10px]">{$_('contact.hours.sunday')}</span>
							<span>{$_('contact.hours.closed')}</span>
						</div>
					</div>
				</div>
			</div>

			<!-- Form & Map -->
			<div class="lg:col-span-8 space-y-12">
				<div id="map" class="bg-white p-4 rounded-spa-xl shadow-spa border border-gray-50 overflow-hidden h-120 relative group">
					<iframe
						src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d891.3024654937047!2d-75.56598343906558!3d6.208142145211063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e442829c522fdb3%3A0x5abdd43099235c76!2sCra.%2036%20%238a-40%2C%20El%20Poblado%2C%20Medell%C3%ADn%2C%20El%20Poblado%2C%20Medell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses-419!2sco!4v1727018084186!5m2!1ses-419!2sco"
						class="w-full h-full rounded-spa-lg grayscale-40 hover:grayscale-0 transition-all duration-2000"
						style="border: 0"
						allowfullscreen={true}
						loading="lazy"
						title="L-Spa Location"
					></iframe>
				</div>

				<div class="bg-white p-12 md:p-20 rounded-spa-xxl shadow-spa border border-gray-50 relative overflow-hidden group">
					<!-- Bg Icon -->
					<div class="absolute -bottom-20 -right-20 opacity-[0.02] -rotate-12 group-hover:rotate-0 transition-all duration-2000">
						<Send size={400} strokeWidth={1} class="text-primary-dark" />
					</div>

					<div class="relative z-10 space-y-12">
						<div class="space-y-6">
							<h2 class="text-4xl md:text-5xl font-display text-gray-900 leading-[1.2]">{$_('contact.form.title')}</h2>
							<div class="h-px w-24 bg-primary"></div>
						</div>

						<form onsubmit={handleSubmit} class="space-y-10 group/form">
							<div class="grid grid-cols-1 md:grid-cols-2 gap-10">
								<div class="space-y-2">
									<label for="name" class="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{$_('contact.form.name.label')}</label>
									<input 
										id="name"
										required
										type="text" 
										class="w-full py-4 bg-transparent border-0 border-b border-gray-200 focus:border-primary focus:ring-0 transition-all outline-none font-light text-gray-900 placeholder:text-gray-300" 
										placeholder={$_('contact.form.name.placeholder')} 
									/>
								</div>
								<div class="space-y-2">
									<label for="email" class="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{$_('contact.form.email.label')}</label>
									<input 
										id="email"
										required
										type="email" 
										class="w-full py-4 bg-transparent border-0 border-b border-gray-200 focus:border-primary focus:ring-0 transition-all outline-none font-light text-gray-900 placeholder:text-gray-300" 
										placeholder={$_('contact.form.email.placeholder')} 
									/>
								</div>
							</div>
							
							<div class="space-y-2">
								<label for="message" class="text-xs font-medium uppercase tracking-[0.2em] text-gray-500">{$_('contact.form.message.label')}</label>
								<textarea 
									id="message"
									required
									rows={4} 
									class="w-full py-4 bg-transparent border-0 border-b border-gray-200 focus:border-primary focus:ring-0 transition-all outline-none font-light text-gray-900 placeholder:text-gray-300 resize-none" 
									placeholder={$_('contact.form.message.placeholder')}
								></textarea>
							</div>

							<Button 
								type="submit"
								disabled={isSubmitting}
								class="w-full md:w-auto px-12 py-5 rounded-full font-medium text-xs uppercase tracking-[0.2em] shadow-spa group-hover/form:shadow-spa-hover disabled:opacity-50 mt-4 transition-all duration-500"
							>
								{#if isSubmitting}
									<div class="flex items-center justify-center gap-3">
										<div class="h-4 w-4 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
										{$_('contact.form.submitting')}
									</div>
								{:else}
									<span class="flex items-center justify-center gap-4">
										{$_('contact.form.submit')}
										<Send size={16} strokeWidth={2} class="group-hover/form:translate-x-2 group-hover/form:-translate-y-2 transition-transform duration-500" />
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
