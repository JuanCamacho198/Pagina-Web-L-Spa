<script lang="ts">
	import { cart, cartSubtotal, cartCount } from '$lib/cart';
	import { authClient } from '$lib/auth-client';
	import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles, ShieldCheck, Heart, ChevronLeft, Lock } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
	import { slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	import { getLocalizedPath } from '$lib/i18n/utils';
	import { _ } from 'svelte-i18n';

	const session = authClient.useSession();
	let currentLang = $derived($page.params.lang || 'es');

	const handleCheckout = () => {
		// Next phase: redirect to booking stepper or flow
		window.location.href = getLocalizedPath('/checkout', currentLang);
	};
	
	// Load cart when page mounts
	onMount(() => {
		cart.load();
	});
</script>

<svelte:head>
	<title>Tu Carrito de Bienestar | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-[#FAFAFA] dark:bg-[#121212] transition-colors duration-700 pt-40 pb-32 px-6">
	<div class="max-w-7xl mx-auto space-y-12">
		<Breadcrumb items={[
		  { label: $_('breadcrumbs.home'), href: getLocalizedPath('/', currentLang) },
		  { label: $_('breadcrumbs.carrito') }
		]} class="mb-4" />

		<!-- Back Button -->
		<a
			href={getLocalizedPath('/servicios', currentLang)}
			class="inline-flex items-center gap-4 text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary-light transition-all text-xs font-medium uppercase tracking-[0.2em] mb-1 group"
		>
			<div class="h-10 w-10 flex items-center justify-center rounded-full bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 shadow-sm group-hover:-translate-x-2 transition-transform duration-500">
				<ChevronLeft size={16} strokeWidth={1.5} />
			</div>
			Seguir explorando
		</a>

		<!-- Header -->
		<header class="text-center space-y-8">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-secondary/30 dark:bg-primary-dark/20 text-primary-dark dark:text-primary-light text-[10px] font-medium uppercase tracking-[0.4em] border border-secondary/50 dark:border-primary/20">
				<ShoppingBag size={14} strokeWidth={1.5} />
				Tu Selección de Lujo
			</div>
			<h1 class="text-5xl md:text-7xl font-display text-gray-900 dark:text-white leading-[1.1]">
				Carrito de <br /> <span class="italic text-primary dark:text-primary-light font-light">Bienestar</span>
			</h1>
		</header>

		{#if $cartCount === 0}
			<div class="bg-white dark:bg-[#1A1A1A] rounded-spa-xl p-20 text-center space-y-10 shadow-spa border border-gray-50 dark:border-white/5 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-700 transition-colors">
				<div class="w-24 h-24 bg-gray-50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto text-gray-300 dark:text-gray-500">
					<ShoppingBag size={40} strokeWidth={1} />
				</div>
				<div class="space-y-4">
					<h2 class="text-3xl font-display text-gray-900 dark:text-white">Tu carrito está vacío</h2>
					<p class="text-gray-500 dark:text-gray-400 font-light text-lg max-w-md mx-auto">Explora nuestros rituales y selecciona la experiencia que transformará tu estado de bienestar.</p>
				</div>
				<Button href={getLocalizedPath('/servicios', currentLang)} class="px-10 py-4 rounded-full text-xs uppercase tracking-[0.2em] font-medium shadow-spa mt-4">
					Descubrir Servicios
				</Button>
			</div>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
				<!-- Items List -->
				<div class="lg:col-span-8 space-y-6">
					{#each $cart as item (item.serviceId)}
						<div 
							transition:slide={{ duration: 500 }}
							class="bg-white dark:bg-[#1A1A1A] p-8 rounded-spa-xl shadow-spa border border-gray-50 dark:border-white/5 flex flex-col md:flex-row items-center gap-10 group transition-colors"
						>
							<!-- Image -->
							<div class="w-40 h-40 rounded-spa-lg overflow-hidden shrink-0 border border-gray-100 dark:border-white/10 group-hover:border-primary/30 transition-colors">
								<img src={item.image} alt={item.name} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-2000ms" />
							</div>

							<!-- Details -->
							<div class="flex-1 space-y-4 text-center md:text-left w-full">
								<div class="space-y-2">
									<h3 class="text-2xl font-display text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary-light transition-colors">{item.name}</h3>
									<p class="text-xs font-medium uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500">Ritual Personalizado</p>
								</div>
								
								<div class="flex items-center justify-center md:justify-start gap-8 mt-6">
									<div class="flex items-center gap-4 bg-gray-50 dark:bg-white/5 p-2 rounded-full border border-gray-100 dark:border-white/5">
										<button 
											onclick={() => cart.updateQuantity(item.serviceId, item.quantity - 1)}
											aria-label="Disminuir cantidad"
											class="w-10 h-10 rounded-full bg-white dark:bg-[#2A2A2A] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light shadow-sm transition-all"
										>
											<Minus size={16} strokeWidth={1.5} />
										</button>
										<span class="text-sm font-medium w-6 text-center text-gray-900 dark:text-white">{item.quantity}</span>
										<button 
											onclick={() => cart.updateQuantity(item.serviceId, item.quantity + 1)}
											aria-label="Aumentar cantidad"
											class="w-10 h-10 rounded-full bg-white dark:bg-[#2A2A2A] flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-primary-light shadow-sm transition-all"
										>
											<Plus size={16} strokeWidth={1.5} />
										</button>
									</div>

									<p class="text-xl font-light text-gray-900 dark:text-gray-200">${(item.price * item.quantity).toLocaleString()}</p>
								</div>
							</div>

							<!-- Remove -->
							<button 
								onclick={() => cart.removeItem(item.serviceId)}
								aria-label="Eliminar {item.name} del carrito"
								class="p-4 rounded-full bg-red-50/50 dark:bg-red-500/10 text-red-300 dark:text-red-400/50 hover:bg-red-50 dark:hover:bg-red-500/20 hover:text-red-500 transition-all group-hover:scale-105"
							>
								<Trash2 size={20} strokeWidth={1.5} />
							</button>
						</div>
					{/each}

					<div class="pt-10 flex justify-between items-center text-gray-500 dark:text-gray-400 uppercase tracking-[0.2em] text-xs font-medium">
						<span>Total de experiencias: {$cartCount}</span>
						<button onclick={() => cart.clear()} class="hover:text-red-500 dark:hover:text-red-400 transition-colors">Vaciar Carrito</button>
					</div>
				</div>

				<!-- Summary -->
				<div class="lg:col-span-4 lg:sticky lg:top-32 h-fit">
					<div class="bg-primary-dark dark:bg-[#1A1A1A] rounded-spa-xl p-12 text-white space-y-12 relative overflow-hidden shadow-spa dark:border dark:border-white/5 transition-colors">
						<div class="absolute inset-0 bg-primary/20 dark:bg-primary/5 opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"></div>
						
						<h3 class="text-2xl font-display tracking-wide border-l-2 border-secondary pl-6">Resumen del <span class="italic text-secondary font-light">Ritual</span></h3>

						<div class="space-y-6">
							<div class="flex justify-between items-center opacity-80 text-sm font-light">
								<span class="text-xs uppercase tracking-[0.2em]">Subtotal</span>
								<span>${$cartSubtotal.toLocaleString()}</span>
							</div>
							<div class="flex justify-between items-center border-t border-white/10 pt-6">
								<span class="text-sm uppercase tracking-[0.2em] font-medium">Total</span>
								<span class="text-3xl font-display text-white">${$cartSubtotal.toLocaleString()}</span>
							</div>
						</div>

						<div class="space-y-8 pt-8 border-t border-white/10">
							<div class="flex items-start gap-4 text-white/70 dark:text-gray-400 transition-colors text-xs font-light leading-relaxed">
								<Lock size={16} strokeWidth={1.5} class="shrink-0 text-secondary" />
								<p>Transacción 100% segura con encriptación de nivel bancario.</p>
							</div>
							
							<Button 
								onclick={handleCheckout} 
								class="w-full py-5 rounded-full font-medium text-xs uppercase tracking-[0.2em] shadow-spa hover:shadow-spa-hover group/btn bg-white dark:bg-primary text-primary-dark dark:text-white hover:bg-secondary dark:hover:bg-primary-light transition-all duration-500"
							>
								<span class="flex items-center gap-4 justify-center">
									Proceder al Pago
									<ArrowRight size={16} strokeWidth={2} class="group-hover/btn:translate-x-2 transition-transform duration-500" />
								</span>
							</Button>
						</div>
					</div>

					<!-- Trust Badges -->
					<div class="mt-8 grid grid-cols-1 gap-4">
						{#each [
							{ icon: Heart, label: 'Satisfacción Garantizada' },
							{ icon: Sparkles, label: 'Ritual Personalizado' },
							{ icon: ShieldCheck, label: 'Garantía L-SPA Elite' }
						] as badge}
							<div class="bg-white dark:bg-[#1A1A1A] p-6 rounded-spa-lg border border-gray-50 dark:border-white/5 flex items-center gap-5 opacity-80 hover:opacity-100 transition-all group shadow-sm hover:shadow-md dark:shadow-none">
								<div class="w-12 h-12 rounded-full bg-secondary/30 dark:bg-white/5 flex items-center justify-center text-primary-dark dark:text-gray-400 group-hover:bg-secondary dark:group-hover:bg-primary-dark/30 dark:group-hover:text-primary-light transition-all">
									<badge.icon size={18} strokeWidth={1.5} />
								</div>
								<span class="text-[10px] font-medium uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{badge.label}</span>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 100% 0%, hsla(327, 67%, 33%, 0.03) 0, transparent 40%);
        background-attachment: fixed;
	}
	:global(.dark body) {
		background-image: radial-gradient(at 100% 0%, hsla(327, 67%, 33%, 0.1) 0, transparent 40%);
	}
</style>
