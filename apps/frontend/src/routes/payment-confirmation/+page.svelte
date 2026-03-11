<script lang="ts">
	import { 
		CheckCircle2, 
		CreditCard, 
		ChevronRight, 
		ArrowRight, 
		Smartphone, 
		ShieldCheck,
		Lock,
		Loader2,
		Sparkles
	} from 'lucide-svelte';
	import Button from '$components/Button.svelte';
	import Typography from '$components/Typography.svelte';
	import { toast } from '$components/Toast.svelte';
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils/cn';

	let selectedMethod = $state('card');
	let isProcessing = $state(false);

	const paymentMethods = [
		{ id: 'card', name: 'Tarjeta Crédito/Débito', icon: CreditCard, color: 'primary' },
		{ id: 'pse', name: 'PSE (Transferencia)', icon: Smartphone, color: 'blue' },
		{ id: 'nequi', name: 'Nequi / Daviplata', icon: Smartphone, color: 'pink' }
	];

	const handlePayment = async () => {
		isProcessing = true;
		
		// Simulación de procesamiento de pago
		setTimeout(() => {
			isProcessing = false;
			toast.success('¡Reserva confirmada y pagada!');
			goto('/reservas');
		}, 2000);
	};
</script>

<svelte:head>
	<title>Confirmación de Pago - L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pb-24 pt-12">
	<div class="max-w-4xl mx-auto px-6 lg:px-8">
		<div class="text-center space-y-4 mb-16">
			<div class="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest border border-emerald-100 shadow-sm animate-bounce">
				<Lock size={14} />
				Pago Seguro Encriptado
			</div>
			<Typography variant="h1" class="text-gray-900 !mb-0 font-black tracking-tighter sm:text-6xl leading-none">
				Finaliza tu Reserva
			</Typography>
			<p class="text-gray-500 font-medium text-lg max-w-xl mx-auto">
				Selecciona tu método de pago preferido para asegurar tu espacio de bienestar.
			</p>
		</div>

		<div class="grid grid-cols-1 md:grid-cols-12 gap-12 items-start">
			<!-- Payment selection -->
			<div class="md:col-span-12 space-y-8">
				<div class="grid grid-cols-1 sm:grid-cols-3 gap-6">
					{#each paymentMethods as method}
						<button 
							onclick={() => selectedMethod = method.id}
							class={cn(
								"p-8 rounded-[40px] border-2 transition-all duration-500 text-center group flex flex-col items-center gap-6 relative overflow-hidden",
								selectedMethod === method.id 
									? "bg-white border-primary shadow-2xl shadow-primary/10 ring-1 ring-primary/20 scale-105" 
									: "bg-white/50 border-gray-100 hover:border-primary/20 hover:bg-white"
							)}
						>
							{#if selectedMethod === method.id}
								<div class="absolute top-4 right-4 text-primary animate-in zoom-in spin-in duration-500">
									<CheckCircle2 size={24} />
								</div>
							{/if}

							<div class={cn(
								"w-16 h-16 rounded-[24px] flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm",
								selectedMethod === method.id ? "bg-primary text-white" : "bg-gray-100 text-gray-400 group-hover:bg-primary/5 group-hover:text-primary"
							)}>
								<method.icon size={32} />
							</div>
							
							<div class="space-y-1">
								<p class={cn(
									"text-[10px] font-black uppercase tracking-widest transition-colors",
									selectedMethod === method.id ? "text-primary" : "text-gray-400"
								)}>{method.name}</p>
								<p class="text-[8px] font-bold text-gray-300 uppercase">Sin comisiones extra</p>
							</div>

							<!-- Decorative circle -->
							<div class="absolute -bottom-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
						</button>
					{/each}
				</div>

				<div class="bg-white rounded-[48px] p-12 shadow-2xl shadow-primary/5 border border-gray-100 relative overflow-hidden">
					<div class="absolute top-0 right-0 p-8 opacity-5">
						<Sparkles size={120} class="text-primary" />
					</div>

					<div class="flex flex-col md:flex-row items-center gap-12 relative z-10">
						<div class="grow space-y-8 w-full">
							<div class="space-y-4">
								<Typography variant="h3" class="text-3xl font-black text-gray-900 tracking-tight leading-none">Resumen del Pago</Typography>
								<div class="h-1 w-20 bg-primary/10 rounded-full"></div>
							</div>

							<div class="space-y-4">
								<div class="flex justify-between items-center bg-gray-50/50 p-6 rounded-[32px] border border-gray-50 group hover:bg-white transition-all shadow-sm">
									<span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Concepto</span>
									<span class="text-sm font-black text-gray-800 tracking-tight">Servicios de Bienestar L-SPA</span>
								</div>
								<div class="flex justify-between items-center bg-gray-50/50 p-6 rounded-[32px] border border-gray-50 group hover:bg-white transition-all shadow-sm">
									<span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Método de Pago</span>
									<span class="text-sm font-black text-primary tracking-tight uppercase tracking-widest text-[10px]">{selectedMethod}</span>
								</div>
								
								<div class="pt-8 flex flex-col items-center">
									<span class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-2">Total a Cancelar</span>
									<span class="text-7xl font-black text-gray-900 tracking-tighter leading-none animate-in zoom-in duration-700">Calculando...</span>
									<p class="text-[8px] font-bold text-emerald-500 uppercase tracking-widest mt-6 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100 flex items-center gap-2">
										<ShieldCheck size={12} />
										IVA Incluido
									</p>
								</div>
							</div>
						</div>

						<div class="w-full md:w-[380px] space-y-8">
							<div class="bg-gray-50/50 rounded-[40px] p-8 border border-gray-50 space-y-6">
								<div class="flex items-center gap-4 opacity-30 grayscale hover:grayscale-0 transition-all cursor-default scale-90">
									<img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" class="h-5" />
									<img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" class="h-8" />
									<img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" class="h-6" />
								</div>
								
								<p class="text-[9px] font-medium text-gray-400 text-center leading-relaxed">
									Al completar este pago, aceptas las <a href="/terminos" class="text-primary font-black underline">Políticas de Cancelación</a> y Términos de Servicio de L-SPA Premium.
								</p>
							</div>

							<Button 
								onclick={handlePayment}
								disabled={isProcessing}
								class="w-full py-7 rounded-[32px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 hover:shadow-primary/50 group shrink-0"
							>
								{#if isProcessing}
									<Loader2 size={24} class="animate-spin mr-3" />
									Validando...
								{:else}
									Proceder al Pago
									<ArrowRight size={24} class="ml-3 group-hover:translate-x-2 transition-transform" />
								{/if}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<div class="mt-16 flex justify-center gap-12 opacity-30">
			<div class="flex items-center gap-3">
				<ShieldCheck size={20} />
				<span class="text-[9px] font-black uppercase tracking-widest">SSL 256-bit</span>
			</div>
			<div class="flex items-center gap-3">
				<CheckCircle2 size={20} />
				<span class="text-[9px] font-black uppercase tracking-widest">PCI Compliant</span>
			</div>
			<div class="flex items-center gap-3">
				<Smartphone size={20} />
				<span class="text-[9px] font-black uppercase tracking-widest">3D Secure</span>
			</div>
		</div>
	</div>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 0% 100%, hsla(327, 67%, 33%, 0.04) 0, transparent 40%),
			radial-gradient(at 100% 0%, hsla(327, 67%, 33%, 0.02) 0, transparent 40%);
		background-attachment: fixed;
	}
</style>
