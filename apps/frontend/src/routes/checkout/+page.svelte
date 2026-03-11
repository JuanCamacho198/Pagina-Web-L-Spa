<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { 
		ChevronLeft, 
		CreditCard, 
		User, 
		Mail, 
		Phone, 
		IdCard, 
		Calendar as CalendarIcon, 
		MessageSquare, 
		Loader2,
		Clock,
		ArrowRight,
		ShieldCheck,
		Package,
		AlertCircle
	} from 'lucide-svelte';
	import Button from '$components/Button.svelte';
	import Typography from '$components/Typography.svelte';
	import Badge from '$components/Badge.svelte';
	import { toast } from '$components/Toast.svelte';
	import { goto } from '$app/navigation';

	interface Props {
		data: any;
	}

	let { data }: Props = $props();

	let currentStep = $state(0);
	let isSubmitting = $state(false);

	// Form values using Runes
	let formData = $state({
		name: '',
		lastName: '',
		email: '',
		phone: '',
		userCC: '',
		preferredDate: '',
		preferredTime: '',
		notes: ''
	});

	let errors = $state<Record<string, string>>({});

	const steps = [
		{ id: 1, label: 'Tus Datos', description: 'Información personal' },
		{ id: 2, label: 'Agenda', description: 'Fecha y hora' },
		{ id: 3, label: 'Confirma', description: 'Finalizar reserva' }
	];

	const total = $derived(data.itemsToCheckout.reduce((acc: number, item: any) => acc + (Number(item.servicePrice || item.price) || 0), 0));

	const validateStep = () => {
		errors = {};
		if (currentStep === 0) {
			if (!formData.name) errors.name = 'El nombre es requerido';
			if (!formData.lastName) errors.lastName = 'El apellido es requerido';
			if (!formData.email) errors.email = 'Email inválido';
			if (!formData.phone) errors.phone = 'Teléfono requerido';
			if (!formData.userCC) errors.userCC = 'Identificación requerida';
		} else if (currentStep === 1) {
			if (!formData.preferredDate) errors.preferredDate = 'Selecciona una fecha';
			if (!formData.preferredTime) errors.preferredTime = 'Selecciona una hora';
		}

		if (Object.keys(errors).length === 0) {
			currentStep++;
			window.scrollTo({ top: 0, behavior: 'smooth' });
			return true;
		}
		toast.error('Por favor completa los campos requeridos');
		return false;
	};

	const handleSubmit = async () => {
		isSubmitting = true;
		try {
			// Mocking the appointment creation
			for (const item of data.itemsToCheckout) {
				const res = await fetch(`http://localhost:3000/api/appointments`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						serviceId: item.id || item.serviceId,
						appointmentDate: formData.preferredDate,
						appointmentTime: formData.preferredTime,
						auth0Id: 'temp_user_id'
					})
				});
				if (!res.ok) throw new Error('Error al crear cita');
			}

			// Clear cart if it was a full checkout
			if (!data.serviceIdFromUrl) {
				await fetch(`http://localhost:3000/api/users/cart?auth0Id=temp_user_id`, { method: 'DELETE' });
			}

			toast.success('¡Cita reservada con éxito!');
			goto('/payment-confirmation');
		} catch (e) {
			toast.error('Ocurrió un error al procesar tu reserva');
		} finally {
			isSubmitting = false;
		}
	};

	const prevStep = () => {
		if (currentStep > 0) currentStep--;
	};
</script>

<svelte:head>
	<title>Finalizar Reserva - L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pb-24 pt-12">
	<div class="max-w-7xl mx-auto px-6 lg:px-8">
		<!-- Back -->
		<button
			onclick={() => history.back()}
			class="inline-flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-bold text-sm mb-12 group uppercase tracking-widest"
		>
			<div class="h-10 w-10 flex items-center justify-center rounded-2xl bg-white border border-gray-100 shadow-sm group-hover:scale-110 group-hover:bg-primary/5 transition-all">
				<ChevronLeft size={20} />
			</div>
			Regresar
		</button>

		<div class="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
			<!-- Main Form Area -->
			<div class="lg:col-span-8 space-y-12">
				<!-- Stepper Custom implementation -->
				<div class="flex justify-between items-start max-w-2xl mx-auto mb-16 relative">
					<div class="absolute top-5 left-0 w-full h-0.5 bg-gray-100 -z-10"></div>
					<div 
						class="absolute top-5 left-0 h-0.5 bg-primary transition-all duration-500 -z-10"
						style="width: {(currentStep / (steps.length - 1)) * 100}%"
					></div>

					{#each steps as step, i}
						<div class="flex flex-col items-center gap-4">
							<div class={cn(
								"w-10 h-10 rounded-2xl flex items-center justify-center font-black transition-all duration-500 ring-8 ring-white",
								currentStep >= i ? "bg-primary text-white scale-110 shadow-xl shadow-primary/20" : "bg-white text-gray-300 border border-gray-100 shadow-sm"
							)}>
								{step.id}
							</div>
							<div class="text-center">
								<p class={cn("text-[10px] font-black uppercase tracking-widest", currentStep >= i ? "text-primary" : "text-gray-400")}>{step.label}</p>
							</div>
						</div>
					{/each}
				</div>

				<div class="bg-white rounded-[48px] p-8 sm:p-12 shadow-2xl shadow-primary/5 border border-gray-100 min-h-[500px] flex flex-col">
					{#if currentStep === 0}
						<!-- Step 1: Personal Data -->
						<div class="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
							<div class="space-y-2">
								<Typography variant="h2" class="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase tracking-wides mb-2 block">Paso 01</Typography>
								<Typography variant="h2" class="text-3xl font-black text-gray-900 tracking-tight leading-none">Tus Datos Personales</Typography>
								<p class="text-gray-400 font-medium text-sm">Necesitamos esta información para confirmar tu identidad en el spa.</p>
							</div>

							<div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
								<div class="space-y-2">
									<label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Nombre</label>
									<div class="relative group">
										<User class="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
										<input 
											type="text" 
											bind:value={formData.name} 
											placeholder="Ej. Juan"
											class={cn("w-full pl-12 pr-6 py-4 rounded-3xl bg-gray-50 border-none ring-1 transition-all outline-none", errors.name ? "ring-rose-200 focus:ring-rose-500" : "ring-gray-100 focus:ring-primary/20")}
										/>
									</div>
								</div>
								<div class="space-y-2">
									<label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Apellido</label>
									<div class="relative group">
										<User class="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
										<input 
											type="text" 
											bind:value={formData.lastName}
											placeholder="Ej. Camacho"
											class={cn("w-full pl-12 pr-6 py-4 rounded-3xl bg-gray-50 border-none ring-1 transition-all outline-none", errors.lastName ? "ring-rose-200 focus:ring-rose-500" : "ring-gray-100 focus:ring-primary/20")}
										/>
									</div>
								</div>
								<div class="space-y-2">
									<label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Email</label>
									<div class="relative group">
										<Mail class="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
										<input 
											type="email" 
											bind:value={formData.email}
											placeholder="juan@ejemplo.com"
											class={cn("w-full pl-12 pr-6 py-4 rounded-3xl bg-gray-50 border-none ring-1 transition-all outline-none", errors.email ? "ring-rose-200 focus:ring-rose-500" : "ring-gray-100 focus:ring-primary/20")}
										/>
									</div>
								</div>
								<div class="space-y-2">
									<label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Teléfono</label>
									<div class="relative group">
										<Phone class="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
										<input 
											type="tel" 
											bind:value={formData.phone}
											placeholder="+57 321..."
											class={cn("w-full pl-12 pr-6 py-4 rounded-3xl bg-gray-50 border-none ring-1 transition-all outline-none", errors.phone ? "ring-rose-200 focus:ring-rose-500" : "ring-gray-100 focus:ring-primary/20")}
										/>
									</div>
								</div>
								<div class="sm:col-span-2 space-y-2">
									<label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Identificación (C.C)</label>
									<div class="relative group">
										<IdCard class="absolute left-4 top-4 text-gray-300 group-focus-within:text-primary transition-colors" size={20} />
										<input 
											type="text" 
											bind:value={formData.userCC}
											placeholder="123456789"
											class={cn("w-full pl-12 pr-6 py-4 rounded-3xl bg-gray-50 border-none ring-1 transition-all outline-none", errors.userCC ? "ring-rose-200 focus:ring-rose-500" : "ring-gray-100 focus:ring-primary/20")}
										/>
									</div>
								</div>
							</div>
						</div>
					{:else if currentStep === 1}
						<!-- Step 2: Agenda -->
						<div class="space-y-8 animate-in fade-in slide-in-from-bottom duration-500">
							<div class="space-y-2">
								<Typography variant="h2" class="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase tracking-widest text-xs text-primary mb-2 block">Paso 02</Typography>
								<Typography variant="h2" class="text-3xl font-black text-gray-900 tracking-tight leading-none">Agenda tu Experiencia</Typography>
								<p class="text-gray-400 font-medium text-sm">Selecciona el momento perfecto para tu bienestar.</p>
							</div>

							<div class="grid grid-cols-1 md:grid-cols-2 gap-12">
								<div class="space-y-4 text-center">
									<label class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Fecha de Reserva</label>
									<input 
										type="date" 
										bind:value={formData.preferredDate}
										min={new Date().toISOString().split('T')[0]}
										class="w-full p-4 rounded-3xl bg-gray-50 border-none ring-1 ring-gray-100 focus:ring-primary/20 transition-all outline-none"
									/>
								</div>
								
								<div class="space-y-4">
									<label class="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-4">Hora Disponible</label>
									<div class="grid grid-cols-2 gap-3">
										{#each ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'] as time}
											<button 
												onclick={() => formData.preferredTime = time}
												class={cn(
													"py-3 rounded-2xl font-black text-xs transition-all duration-300 border uppercase tracking-widest",
													formData.preferredTime === time 
														? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-105" 
														: "bg-white text-gray-500 border-gray-100 hover:border-primary/30"
												)}
											>
												{time}
											</button>
										{/each}
									</div>
								</div>
							</div>
						</div>
					{:else}
						<!-- Step 3: Confirmation -->
						<div class="space-y-8 animate-in fade-in slide-in-from-bottom duration-500 text-center sm:text-left">
							<div class="space-y-2">
								<Typography variant="h2" class="text-3xl font-black text-gray-900 tracking-tight leading-none uppercase tracking-widest text-xs text-primary mb-2 block">Paso 03</Typography>
								<Typography variant="h2" class="text-3xl font-black text-gray-900 tracking-tight leading-none">Confirmar Reserva</Typography>
								<p class="text-gray-400 font-medium text-sm">Por favor revisa que todo sea correcto.</p>
							</div>

							<div class="bg-gray-50/50 rounded-[40px] p-8 border border-gray-100 space-y-6">
								<div class="flex items-center gap-6 pb-6 border-b border-gray-100">
									<div class="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
										<User size={32} />
									</div>
									<div class="grow">
										<p class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Cliente</p>
										<p class="text-xl font-black text-gray-900">{formData.name} {formData.lastName}</p>
									</div>
								</div>

								<div class="flex items-center gap-6 pb-6 border-b border-gray-100">
									<div class="h-16 w-16 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm">
										<CalendarIcon size={32} />
									</div>
									<div class="grow">
										<p class="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Cita Programada</p>
										<p class="text-xl font-black text-gray-900 capitalize">{formData.preferredDate} a las {formData.preferredTime}</p>
									</div>
								</div>
								
								<div class="space-y-4 pt-4">
									<label class="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-4">Notas adicionales (opcional)</label>
									<textarea 
										bind:value={formData.notes}
										placeholder="¿Alguna petición especial?"
										class="w-full p-6 rounded-3xl bg-white border-none ring-1 ring-gray-100 focus:ring-primary/20 transition-all outline-none min-h-[120px]"
									></textarea>
								</div>
							</div>
						</div>
					{/if}

					<!-- Nav Buttons -->
					<div class="mt-auto pt-12 flex justify-between items-center">
						{#if currentStep > 0}
							<button 
								onclick={prevStep}
								class="px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors flex items-center gap-2"
							>
								<ChevronLeft size={16} />
								Atrás
							</button>
						{:else}
							<div></div>
						{/if}

						{#if currentStep < 2}
							<Button 
								onclick={validateStep}
								class="px-12 py-4 rounded-3xl font-black uppercase tracking-widest shadow-xl shadow-primary/20"
							>
								Continuar
								<ArrowRight size={18} class="ml-2" />
							</Button>
						{:else}
							<Button 
								onclick={handleSubmit}
								class="px-16 py-6 rounded-[28px] font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-95"
								disabled={isSubmitting}
							>
								{#if isSubmitting}
									<Loader2 size={24} class="animate-spin mr-3" />
									Procesando...
								{:else}
									Confirmar Bienestar
									<ShieldCheck size={24} class="ml-3" />
								{/if}
							</Button>
						{/if}
					</div>
				</div>
			</div>

			<!-- Sidebar Summary -->
			<div class="lg:col-span-4 sticky top-12">
				<div class="bg-white rounded-[48px] p-10 shadow-2xl shadow-primary/5 border border-gray-100 relative overflow-hidden group">
					<div class="absolute -top-12 -right-12 w-48 h-48 bg-primary/5 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-150"></div>
					
					<h2 class="text-2xl font-black text-gray-900 mb-8 tracking-tight relative z-10 flex items-center gap-3">
						<Package size={24} class="text-primary" />
						Tu Selección
					</h2>
					
					<div class="space-y-6 mb-10 relative z-10">
						{#each data.itemsToCheckout as item}
							<div class="flex items-center gap-4 bg-gray-50/50 p-4 rounded-3xl border border-gray-50 group/item hover:bg-white transition-all shadow-sm">
								<div class="w-14 h-14 rounded-2xl ring-1 ring-gray-100 overflow-hidden shrink-0">
									<img src={item.imageUrl || '/src/assets/banners/bannerSpa.avif'} alt={item.serviceName || item.name} class="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" />
								</div>
								<div class="grow">
									<p class="text-[10px] font-black text-gray-900 uppercase tracking-tight block truncate max-w-[150px]">{item.serviceName || item.name}</p>
									<p class="text-xs font-bold text-primary">${Number(item.servicePrice || item.price).toLocaleString()}</p>
								</div>
							</div>
						{/each}

						<div class="h-1.5 w-full bg-gray-50 rounded-full my-8"></div>
						
						<div class="flex flex-col gap-2 items-center">
							<span class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total Inversión</span>
							<span class="text-5xl font-black text-gray-900 tracking-tighter leading-none">${total.toLocaleString()}</span>
						</div>
					</div>

					<div class="space-y-4 relative z-10">
						<div class="flex items-center gap-4 bg-emerald-50 p-5 rounded-3xl border border-emerald-100/50 group/shield">
							<ShieldCheck class="text-emerald-500 shrink-0 group-hover/shield:scale-110 transition-transform" size={24} />
							<div class="space-y-1">
								<p class="text-[10px] font-black uppercase tracking-widest text-emerald-800">Garantía L-SPA</p>
								<p class="text-[8px] font-bold text-emerald-600 leading-tight uppercase">Tu satisfacción es nuestra mayor prioridad en cada sesión.</p>
							</div>
						</div>
					</div>
				</div>
				
				<div class="mt-8 bg-black/[0.02] p-8 rounded-[40px] border border-gray-100 text-center">
					<p class="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] leading-relaxed">
						L-SPA Premium Wellness Experience • Bogotá, Colombia
					</p>
				</div>
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
