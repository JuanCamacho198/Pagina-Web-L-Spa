<script lang="ts">
	import { Save, Building2, MapPin, Phone, Mail, Clock, Globe, DollarSign, Bell, Shield, Palette } from 'lucide-svelte';

	// Config data - en producción vendría de la API
	let config = {
		// Información del negocio
		businessName: 'L-SPA Experience',
		tagline: 'Tu Santuario de Bienestar',
		email: 'contacto@l-spa.com',
		phone: '+57 604 123 4567',
		whatsapp: '+57 300 123 4567',
		address: 'Carrera 43A #1-50, El Poblado',
		city: 'Medellín',
		country: 'Colombia',
		
		// Horarios
		monday: { open: '08:00', close: '20:00', enabled: true },
		tuesday: { open: '08:00', close: '20:00', enabled: true },
		wednesday: { open: '08:00', close: '20:00', enabled: true },
		thursday: { open: '08:00', close: '20:00', enabled: true },
		friday: { open: '08:00', close: '22:00', enabled: true },
		saturday: { open: '09:00', close: '22:00', enabled: true },
		sunday: { open: '10:00', close: '18:00', enabled: false },
		
		// Moneda
		currency: 'COP',
		locale: 'es-CO',
		
		// Notificaciones
		emailNotifications: true,
		smsNotifications: false,
		whatsappNotifications: true,
		
		// Políticas
		cancellationPolicy: 24, // horas de anticipación
		bookingInterval: 30, // minutos entre citas
		
		// Redes sociales
		instagram: 'https://instagram.com/lspa',
		facebook: 'https://facebook.com/lspa',
		twitter: '',
	};

	let activeTab = 'general';
	let saving = false;

	const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
	const dayLabels: Record<string, string> = {
		monday: 'Lunes',
		tuesday: 'Martes',
		wednesday: 'Miércoles',
		thursday: 'Jueves',
		friday: 'Viernes',
		saturday: 'Sábado',
		sunday: 'Domingo',
	};

	async function saveConfig() {
		saving = true;
		// Simular guardado
		await new Promise(resolve => setTimeout(resolve, 1000));
		saving = false;
	}
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Configuración</h1>
			<p class="text-gray-500 font-medium mt-1">Administra la configuración del spa</p>
		</div>
		<button 
			onclick={saveConfig}
			disabled={saving}
			class="flex items-center gap-3 px-8 py-4 bg-primary text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
		>
			{#if saving}
				<div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
			{:else}
				<Save size={18} />
			{/if}
			{saving ? 'Guardando...' : 'Guardar Cambios'}
		</button>
	</div>

	<!-- Tabs -->
	<div class="flex items-center gap-2 border-b border-gray-200 pb-px">
		{#each [
			{ id: 'general', label: 'General', icon: Building2 },
			{ id: 'horarios', label: 'Horarios', icon: Clock },
			{ id: 'notificaciones', label: 'Notificaciones', icon: Bell },
			{ id: 'politicas', label: 'Políticas', icon: Shield },
			{ id: 'redes', label: 'Redes Sociales', icon: Globe },
		] as tab}
			<button 
				onclick={() => activeTab = tab.id}
				class="flex items-center gap-2 px-6 py-4 rounded-t-2xl transition-all {activeTab === tab.id ? 'bg-white text-primary border-t border-x border-gray-200 -mb-px' : 'text-gray-500 hover:text-gray-700'}"
			>
				<tab.icon size={16} />
				<span class="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
			</button>
		{/each}
	</div>

	<!-- Content -->
	<div class="bg-white rounded-b-[32px] rounded-tr-[32px] p-8 shadow-sm border border-gray-100">
		{#if activeTab === 'general'}
			<div class="max-w-2xl space-y-8">
				<!-- Business Info -->
				<div>
					<h3 class="text-lg font-black text-gray-900 uppercase mb-6">Información del Negocio</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="md:col-span-2">
							<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Nombre del Negocio</label>
							<input 
								type="text" 
								bind:value={config.businessName}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
						<div class="md:col-span-2">
							<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Tagline</label>
							<input 
								type="text" 
								bind:value={config.tagline}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
						<div>
							<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Email</label>
							<div class="relative">
								<Mail size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
								<input 
									type="email" 
									bind:value={config.email}
									class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
								/>
							</div>
						</div>
						<div>
							<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Teléfono</label>
							<div class="relative">
								<Phone size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
								<input 
									type="tel" 
									bind:value={config.phone}
									class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
								/>
							</div>
						</div>
						<div>
							<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">WhatsApp</label>
							<div class="relative">
								<Phone size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
								<input 
									type="tel" 
									bind:value={config.whatsapp}
									class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
								/>
							</div>
						</div>
						<div class="md:col-span-2">
							<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Dirección</label>
							<div class="relative">
								<MapPin size={18} class="absolute left-6 top-4 text-gray-400" />
								<input 
									type="text" 
									bind:value={config.address}
									class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
								/>
							</div>
						</div>
						<div>
							<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Ciudad</label>
							<input 
								type="text" 
								bind:value={config.city}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
						<div>
							<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">País</label>
							<input 
								type="text" 
								bind:value={config.country}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'horarios'}
			<div class="max-w-2xl">
				<h3 class="text-lg font-black text-gray-900 uppercase mb-6">Horarios de Atención</h3>
				<div class="space-y-4">
					{#each days as day}
						<div class="flex items-center gap-6 p-6 rounded-2xl bg-gray-50">
							<label class="flex items-center gap-3 cursor-pointer min-w-[160px]">
								<input 
									type="checkbox" 
									bind:checked={config[day].enabled}
									class="w-5 h-5 rounded text-primary focus:ring-primary"
								/>
								<span class="font-black text-gray-900">{dayLabels[day]}</span>
							</label>
							{#if config[day].enabled}
								<div class="flex items-center gap-4 flex-1">
									<input 
										type="time" 
										bind:value={config[day].open}
										class="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none font-medium"
									/>
									<span class="text-gray-400">a</span>
									<input 
										type="time" 
										bind:value={config[day].close}
										class="px-4 py-3 rounded-xl border border-gray-200 focus:border-primary outline-none font-medium"
									/>
								</div>
							{:else}
								<span class="text-gray-400 font-medium">Cerrado</span>
							{/if}
						</div>
					{/each}
				</div>
			</div>
		{:else if activeTab === 'notificaciones'}
			<div class="max-w-2xl">
				<h3 class="text-lg font-black text-gray-900 uppercase mb-6">Preferencias de Notificaciones</h3>
				<div class="space-y-6">
					<label class="flex items-center justify-between p-6 rounded-2xl bg-gray-50 cursor-pointer">
						<div>
							<p class="font-black text-gray-900">Notificaciones por Email</p>
							<p class="text-sm text-gray-500">Recibe confirmaciones y recordatorios por email</p>
						</div>
						<input 
							type="checkbox" 
							bind:checked={config.emailNotifications}
							class="w-6 h-6 rounded text-primary focus:ring-primary"
						/>
					</label>
					<label class="flex items-center justify-between p-6 rounded-2xl bg-gray-50 cursor-pointer">
						<div>
							<p class="font-black text-gray-900">Notificaciones por WhatsApp</p>
							<p class="text-sm text-gray-500">Recibe recordatorios automáticos por WhatsApp</p>
						</div>
						<input 
							type="checkbox" 
							bind:checked={config.whatsappNotifications}
							class="w-6 h-6 rounded text-primary focus:ring-primary"
						/>
					</label>
					<label class="flex items-center justify-between p-6 rounded-2xl bg-gray-50 cursor-pointer">
						<div>
							<p class="font-black text-gray-900">Notificaciones por SMS</p>
							<p class="text-sm text-gray-500">Recibe recordatorios por mensaje de texto</p>
						</div>
						<input 
							type="checkbox" 
							bind:checked={config.smsNotifications}
							class="w-6 h-6 rounded text-primary focus:ring-primary"
						/>
					</label>
				</div>
			</div>
		{:else if activeTab === 'politicas'}
			<div class="max-w-2xl">
				<h3 class="text-lg font-black text-gray-900 uppercase mb-6">Políticas de Reserva</h3>
				<div class="space-y-6">
					<div>
						<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Política de Cancelación (horas)</label>
						<p class="text-sm text-gray-500 mb-2">Los clientes pueden cancelar sin penalización con esta anticipación</p>
						<input 
							type="number" 
							bind:value={config.cancellationPolicy}
							class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
						/>
					</div>
					<div>
						<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Intervalo entre Citas (minutos)</label>
						<p class="text-sm text-gray-500 mb-2">Tiempo mínimo entre el final de una cita y el inicio de la siguiente</p>
						<input 
							type="number" 
							bind:value={config.bookingInterval}
							class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
						/>
					</div>
				</div>
			</div>
		{:else if activeTab === 'redes'}
			<div class="max-w-2xl">
				<h3 class="text-lg font-black text-gray-900 uppercase mb-6">Redes Sociales</h3>
				<div class="space-y-6">
					<div>
						<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Instagram</label>
						<input 
							type="url" 
							bind:value={config.instagram}
							class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							placeholder="https://instagram.com/tu-spa"
						/>
					</div>
					<div>
						<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Facebook</label>
						<input 
							type="url" 
							bind:value={config.facebook}
							class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							placeholder="https://facebook.com/tu-spa"
						/>
					</div>
					<div>
						<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Twitter/X</label>
						<input 
							type="url" 
							bind:value={config.twitter}
							class="w-full px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							placeholder="https://x.com/tu-spa"
						/>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
