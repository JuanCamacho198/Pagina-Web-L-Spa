<script lang="ts">
	import { cart, cartSubtotal, cartCount } from '$lib/cart';
	import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, Sparkles, ShieldCheck, Heart, ChevronLeft, Lock } from 'lucide-svelte';
	import Button from '$components/Button.svelte';
	import { slide } from 'svelte/transition';

	const handleCheckout = () => {
		// Next phase: redirect to booking stepper or flow
		window.location.href = '/checkout';
	};
</script>

<svelte:head>
	<title>Tu Carrito de Bienestar | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pt-40 pb-32 px-6">
	<div class="max-w-7xl mx-auto space-y-12">
		<!-- Back Button -->
		<a
			href="/servicios"
			class="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-bold text-sm mb-1 group uppercase tracking-widest"
		>
			<div class="h-10 w-10 flex items-center justify-center rounded-4xlxl bg-white border border-gray-100 shadow-sm group-hover:scale-110 group-hover:bg-primary/5 transition-all">
				<ChevronLeft size={20} />
			</div>
			Seguir explorando
		</a>

		<!-- Header -->
		<header class="text-center space-y-8">
			<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-[0.4em]">
				<ShoppingBag size={14} />
				Tu Selección de Lujo
			</div>
			<h1 class="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter leading-[0.85] uppercase">
				CARRITO DE <br /> <span class="text-transparent bg-clip-text bg-linear-to-r from-primary via-primary-dark to-primary italic">BIENESTAR</span>
			</h1>
		</header>

		{#if $cartCount === 0}
			<div class="bg-white rounded-[64px] p-20 text-center space-y-10 shadow-2xl shadow-primary/5 border border-gray-100 max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-700">
				<div class="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-200">
					<ShoppingBag size={48} />
				</div>
				<div class="space-y-4">
					<h2 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Tu carrito está vacío</h2>
					<p class="text-gray-400 font-medium max-w-sm mx-auto">Explora nuestros rituales y selecciona la experiencia que transformará tu bienestar.</p>
				</div>
				<Button href="/servicios" class="px-10 py-5 rounded-full shadow-xl shadow-primary/20">
					DESCUBRIR SERVICIOS
				</Button>
			</div>
		{:else}
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
				<!-- Items List -->
				<div class="lg:col-span-8 space-y-6">
					{#each $cart as item (item.serviceId)}
						<div 
							transition:slide={{ duration: 500 }}
							class="bg-white p-8 rounded-[40px] shadow-2xl shadow-primary/5 border border-gray-100 flex flex-col md:flex-row items-center gap-10 group"
						>
							<!-- Image -->
							<div class="w-40 h-40 rounded-4xl overflow-hidden shrink-0 border-4 border-gray-50 group-hover:border-primary/20 transition-colors">
								<img src={item.image} alt={item.name} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
							</div>

							<!-- Details -->
							<div class="flex-1 space-y-4 text-center md:text-left w-full">
								<div>
									<h3 class="text-2xl font-black text-gray-900 tracking-tight uppercase group-hover:text-primary transition-colors">{item.name}</h3>
									<p class="text-[10px] font-black uppercase tracking-widest text-gray-400">Ritual Personalizado</p>
								</div>
								
								<div class="flex items-center justify-center md:justify-start gap-8">
									<div class="flex items-center gap-4 bg-gray-50 p-2 rounded-4xlxl border border-gray-100">
										<button 
											onclick={() => cart.updateQuantity(item.serviceId, item.quantity - 1)}
											class="w-8 h-8 rounded-4xll bg-white flex items-center justify-center text-gray-400 hover:text-primary hover:shadow-md transition-all"
										>
											<Minus size={14} />
										</button>
										<span class="text-sm font-black w-4 text-center">{item.quantity}</span>
										<button 
											onclick={() => cart.updateQuantity(item.serviceId, item.quantity + 1)}
											class="w-8 h-8 rounded-4xll bg-white flex items-center justify-center text-gray-400 hover:text-primary hover:shadow-md transition-all"
										>
											<Plus size={14} />
										</button>
									</div>

									<p class="text-xl font-black text-gray-900">${(item.price * item.quantity).toLocaleString()}</p>
								</div>
							</div>

							<!-- Remove -->
							<button 
								onclick={() => cart.removeItem(item.serviceId)}
								class="p-4 rounded-4xlxl bg-gray-50 text-gray-300 hover:bg-rose-50 hover:text-rose-500 transition-all group-hover:scale-105"
							>
								<Trash2 size={24} />
							</button>
						</div>
					{/each}

					<div class="pt-10 flex justify-between items-center text-gray-400 uppercase tracking-widest text-[10px] font-black">
						<span>Total de experiencias: {$cartCount}</span>
						<button onclick={() => cart.clear()} class="hover:text-rose-500 transition-colors">VACIAR CARRITO</button>
					</div>
				</div>

				<!-- Summary -->
				<div class="lg:col-span-4 lg:sticky lg:top-32 h-fit">
					<div class="bg-gray-900 rounded-[56px] p-12 text-white space-y-12 relative overflow-hidden group shadow-2xl shadow-primary/20">
						<div class="absolute inset-0 bg-primary opacity-5 pointer-events-none group-hover:opacity-10 transition-opacity"></div>
						
						<h3 class="text-2xl font-black tracking-tight uppercase border-l-4 border-primary pl-6">Resumen del <span class="italic text-primary-light">Ritual</span></h3>

						<div class="space-y-6">
							<div class="flex justify-between items-center opacity-60">
								<span class="text-[10px] font-black uppercase tracking-[0.2em]">Subtotal</span>
								<span class="text-sm font-black">${$cartSubtotal.toLocaleString()}</span>
							</div>
							<div class="flex justify-between items-center border-t border-white/5 pt-6">
								<span class="text-lg font-black tracking-tight">TOTAL</span>
								<span class="text-3xl font-black text-primary-light">${$cartSubtotal.toLocaleString()}</span>
							</div>
						</div>

						<div class="space-y-6 pt-6 border-t border-white/10">
							<div class="flex items-start gap-4 text-white/40 group-hover:text-white/60 transition-colors">
								<Lock size={20} class="shrink-0 text-primary-light" />
								<p class="text-[9px] font-black uppercase tracking-widest leading-relaxed">Transacción 100% segura con encriptación de nivel bancario.</p>
							</div>
							
							<Button 
								onclick={handleCheckout} 
								class="w-full py-8 rounded-4xl font-black text-sm uppercase tracking-[0.3em] shadow-2xl shadow-primary/30 group/btn bg-white text-gray-900 hover:bg-primary hover:text-white transition-all duration-500"
							>
								<span class="flex items-center gap-4">
									PROCEDER AL PAGO
									<ArrowRight size={20} class="group-hover/btn:translate-x-3 transition-transform duration-500" />
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
							<div class="bg-white p-6 rounded-4xl border border-gray-100 flex items-center gap-4 opacity-70 hover:opacity-100 transition-opacity group">
								<div class="w-10 h-10 rounded-4xll bg-gray-50 flex items-center justify-center text-primary/60 group-hover:bg-primary group-hover:text-white transition-all">
									<badge.icon size={18} />
								</div>
								<span class="text-[9px] font-black uppercase tracking-widest text-gray-500 group-hover:text-gray-900 transition-colors">{badge.label}</span>
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
		background-image: radial-gradient(at 100% 0%, hsla(327, 67%, 33%, 0.05) 0, transparent 40%);
        background-attachment: fixed;
	}
</style>
