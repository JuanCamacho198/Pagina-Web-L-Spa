<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { Save, Building2, MapPin, Phone, Mail, Clock, Globe, Bell, Shield, Palette, Upload, X, Eye, EyeOff, ShieldCheck } from 'lucide-svelte';
	import { 
		loadBrandingConfig, 
		saveBrandingConfig, 
		getBrandingWithDefaults,
		validateImageFile, 
		fileToBase64,
		clearCustomLogo,
		DEFAULT_BRANDING,
		MIN_LOGO_SIZE,
		MAX_LOGO_SIZE,
		type BrandingConfig
	} from '$lib/config/branding';

	const STORAGE_KEY = 'lspa_admin_config';

	// Default config
	const defaultConfig = {
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
		cancellationPolicy: 24,
		bookingInterval: 30,
		
		// Redes sociales
		instagram: 'https://instagram.com/lspa',
		facebook: 'https://facebook.com/lspa',
		twitter: '',
	};

	// Load config from localStorage or use default
	function loadConfig() {
		if (!browser) return defaultConfig;
		
		try {
			const saved = localStorage.getItem(STORAGE_KEY);
			if (saved) {
				return { ...defaultConfig, ...JSON.parse(saved) };
			}
		} catch (e) {
			console.error('Error loading config:', e);
		}
		return defaultConfig;
	}

	// Config data
	let config = $state(loadConfig());

	// Branding state
	let branding = $state<BrandingConfig>(getBrandingWithDefaults());
	let previewBranding = $state<BrandingConfig>(getBrandingWithDefaults());
	let showPreview = $state(true);
	let logoUploadError = $state('');
	let logoPreviewUrl = $state<string | null>(null);
	let dragOver = $state(false);

	// Debounce timer for preview
	let previewDebounceTimer: ReturnType<typeof setTimeout> | null = null;

	let activeTab = $state('general');
	let saving = $state(false);
	let saveSuccess = $state(false);

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

	// Update preview with debounce
	function updatePreview() {
		if (previewDebounceTimer) {
			clearTimeout(previewDebounceTimer);
		}
		previewDebounceTimer = setTimeout(() => {
			previewBranding = { ...branding };
		}, 150);
	}

	// Handle file selection
	async function handleLogoUpload(event: Event) {
		const input = event.target as HTMLInputElement;
		const file = input.files?.[0];
		
		if (!file) return;
		
		// Validate
		const error = validateImageFile(file);
		if (error) {
			logoUploadError = error;
			return;
		}
		
		logoUploadError = '';
		
		try {
			const base64 = await fileToBase64(file);
			branding.customLogo = base64;
			logoPreviewUrl = base64;
			updatePreview();
		} catch (e) {
			logoUploadError = 'Error al procesar la imagen';
		}
	}

	// Handle drag and drop
	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	async function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		
		const file = event.dataTransfer?.files?.[0];
		if (!file) return;
		
		const error = validateImageFile(file);
		if (error) {
			logoUploadError = error;
			return;
		}
		
		logoUploadError = '';
		
		try {
			const base64 = await fileToBase64(file);
			branding.customLogo = base64;
			logoPreviewUrl = base64;
			updatePreview();
		} catch (e) {
			logoUploadError = 'Error al procesar la imagen';
		}
	}

	// Remove logo
	function removeLogo() {
		branding.customLogo = null;
		logoPreviewUrl = null;
		clearCustomLogo();
		updatePreview();
	}

	// Handle input changes for preview
	function handleBrandingInput() {
		updatePreview();
	}

	async function saveConfig() {
		if (!browser) return;
		
		saving = true;
		saveSuccess = false;
		
		try {
			// Save general config
			localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
			
			// Save branding config
			saveBrandingConfig(branding);
			
			// Simulate API delay
			await new Promise(resolve => setTimeout(resolve, 800));
			
			saveSuccess = true;
			setTimeout(() => saveSuccess = false, 3000);
		} catch (e) {
			console.error('Error saving config:', e);
		} finally {
			saving = false;
		}
	}

	onMount(() => {
		// Re-load config on mount (in case of SSR)
		config = loadConfig();
		branding = getBrandingWithDefaults();
		previewBranding = { ...branding };
		logoPreviewUrl = branding.customLogo;
	});
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black text-gray-900 dark:text-white tracking-tight uppercase">Configuración</h1>
			<p class="text-gray-500 dark:text-gray-400 font-medium mt-1">Administra la configuración del spa</p>
		</div>
		<button 
			onclick={saveConfig}
			disabled={saving}
			class="flex items-center gap-3 px-8 py-4 {saveSuccess ? 'bg-emerald-500' : 'bg-primary'} text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:{saveSuccess ? 'bg-emerald-600' : 'bg-primary/90'} transition-colors shadow-lg shadow-primary/20 disabled:opacity-50"
		>
			{#if saving}
				<div class="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
			{:else if saveSuccess}
				<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
				</svg>
			{:else}
				<Save size={18} />
			{/if}
			{saving ? 'Guardando...' : saveSuccess ? 'Guardado!' : 'Guardar Cambios'}
		</button>
	</div>

	<!-- Tabs -->
	<div class="flex items-center gap-2 border-b border-gray-200 dark:border-gray-700 pb-px">
		{#each [
			{ id: 'general', label: 'General', icon: Building2 },
			{ id: 'branding', label: 'Branding', icon: Palette },
			{ id: 'horarios', label: 'Horarios', icon: Clock },
			{ id: 'notificaciones', label: 'Notificaciones', icon: Bell },
			{ id: 'politicas', label: 'Políticas', icon: Shield },
			{ id: 'redes', label: 'Redes Sociales', icon: Globe },
		] as tab}
			<button 
				onclick={() => activeTab = tab.id}
				class="flex items-center gap-2 px-6 py-4 rounded-t-2xl transition-all {activeTab === tab.id ? 'bg-white dark:bg-gray-800 text-primary border-t border-x border-gray-200 dark:border-gray-700 -mb-px' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}"
			>
				<tab.icon size={16} />
				<span class="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
			</button>
		{/each}
	</div>

	<!-- Content -->
	<div class="bg-white dark:bg-gray-800 rounded-b-4xl rounded-tr-4xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
		{#if activeTab === 'general'}
			<div class="max-w-2xl space-y-8">
				<!-- Business Info -->
				<div>
					<h3 class="text-lg font-black text-gray-900 dark:text-white uppercase mb-6">Información del Negocio</h3>
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div class="md:col-span-2">
							<label for="businessName" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Nombre del Negocio</label>
							<input 
								id="businessName"
								type="text" 
								bind:value={config.businessName}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
						<div class="md:col-span-2">
							<label for="tagline" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Tagline</label>
							<input 
								id="tagline"
								type="text" 
								bind:value={config.tagline}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
						<div>
							<label for="email" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Email</label>
							<div class="relative">
								<Mail size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
								<input 
									id="email"
									type="email" 
									bind:value={config.email}
									class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
								/>
							</div>
						</div>
						<div>
							<label for="phone" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Teléfono</label>
							<div class="relative">
								<Phone size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
								<input 
									id="phone"
									type="tel" 
									bind:value={config.phone}
									class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
								/>
							</div>
						</div>
						<div>
							<label for="whatsapp" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">WhatsApp</label>
							<div class="relative">
								<Phone size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
								<input 
									id="whatsapp"
									type="tel" 
									bind:value={config.whatsapp}
									class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
								/>
							</div>
						</div>
						<div class="md:col-span-2">
							<label for="address" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Dirección</label>
							<div class="relative">
								<MapPin size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
								<input 
									id="address"
									type="text" 
									bind:value={config.address}
									class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
								/>
							</div>
						</div>
						<div>
							<label for="city" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Ciudad</label>
							<input 
								id="city"
								type="text" 
								bind:value={config.city}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
						<div>
							<label for="country" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">País</label>
							<input 
								id="country"
								type="text" 
								bind:value={config.country}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'branding'}
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Branding Form -->
				<div class="space-y-8">
					<div>
						<h3 class="text-lg font-black text-gray-900 dark:text-white uppercase mb-6">Personalización del Sitio</h3>
						
						<!-- Navbar Text -->
						<div class="mb-6">
							<label for="navbarText" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Texto del Navbar</label>
							<input 
								id="navbarText"
								type="text" 
								bind:value={branding.navbarText}
								oninput={handleBrandingInput}
								placeholder={DEFAULT_BRANDING.navbarText}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
							<p class="text-xs text-gray-400 mt-2">Texto que aparece en la barra de navegación</p>
						</div>

						<!-- Logo Upload -->
						<div class="mb-6">
							<label class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Logo Personalizado</label>
							
							<!-- Drop Zone -->
							<div 
								class="border-2 border-dashed rounded-2xl p-6 text-center transition-all {dragOver ? 'border-primary bg-primary/5' : 'border-gray-200 dark:border-gray-700'} {logoUploadError ? 'border-red-400' : ''}"
								ondragover={handleDragOver}
								ondragleave={handleDragLeave}
								ondrop={handleDrop}
							>
								{#if logoPreviewUrl || branding.customLogo}
									<div class="relative inline-block">
										<img 
											src={logoPreviewUrl || branding.customLogo} 
											alt="Logo preview" 
											class="max-h-24 mx-auto mb-4 object-contain"
											style="height: {branding.logoSize}px"
										/>
										<button
											type="button"
											onclick={removeLogo}
											class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
										>
											<X size={14} />
										</button>
									</div>
									<p class="text-sm text-gray-500 dark:text-gray-400 mb-4">Logo actual</p>
								{:else}
									<Upload size={32} class="mx-auto text-gray-400 mb-4" />
									<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">
										Arrastra una imagen aquí o
									</p>
								{/if}
								
								<label class="inline-block cursor-pointer">
									<input 
										type="file" 
										accept="image/png,image/jpeg,image/webp"
										onchange={handleLogoUpload}
										class="hidden"
									/>
									<span class="inline-block px-6 py-3 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/90 transition-colors">
										Subir Imagen
									</span>
								</label>
								
								<p class="text-xs text-gray-400 mt-4">PNG, JPG o WebP. Máximo 500KB.</p>
							</div>
							
							{#if logoUploadError}
								<p class="text-red-500 text-sm mt-2">{logoUploadError}</p>
							{/if}
						</div>

						<!-- Logo Size -->
						<div class="mb-6">
							<label for="logoSize" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
								Tamaño del Logo: {branding.logoSize}px
							</label>
							<input 
								id="logoSize"
								type="range"
								min={MIN_LOGO_SIZE}
								max={MAX_LOGO_SIZE}
								bind:value={branding.logoSize}
								oninput={handleBrandingInput}
								class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
							/>
							<div class="flex justify-between text-xs text-gray-400 mt-1">
								<span>{MIN_LOGO_SIZE}px</span>
								<span>{MAX_LOGO_SIZE}px</span>
							</div>
						</div>

						<!-- Footer Text -->
						<div class="mb-6">
							<label for="footerText" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Texto del Footer</label>
							<textarea 
								id="footerText"
								bind:value={branding.footerText}
								oninput={handleBrandingInput}
								rows="4"
								placeholder={DEFAULT_BRANDING.footerText}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium resize-none"
							></textarea>
							<p class="text-xs text-gray-400 mt-2">Descripción que aparece en el pie de página</p>
						</div>
					</div>
				</div>

				<!-- Live Preview -->
				<div class="space-y-6">
					<div class="flex items-center justify-between">
						<h3 class="text-lg font-black text-gray-900 dark:text-white uppercase">Vista Previa</h3>
						<button
							type="button"
							onclick={() => showPreview = !showPreview}
							class="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black text-gray-500 hover:text-primary transition-colors"
						>
							{#if showPreview}
								<EyeOff size={16} />
								Ocultar
							{:else}
								<Eye size={16} />
								Mostrar
							{/if}
						</button>
					</div>
					
					{#if showPreview}
						<div class="border border-gray-200 dark:border-gray-700 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900">
							<!-- Mini Navbar Preview -->
							<div class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
								<div class="flex items-center gap-3">
									{#if previewBranding.customLogo}
										<img 
											src={previewBranding.customLogo} 
											alt="Logo" 
											class="object-contain brightness-110"
											style="height: {previewBranding.logoSize}px"
										/>
									{:else}
										<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
											<Shield size={16} />
										</div>
									{/if}
									<span class="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight">
										{previewBranding.navbarText || DEFAULT_BRANDING.navbarText}
									</span>
								</div>
							</div>
							
							<!-- Preview Content Area -->
							<div class="p-4 min-h-[200px] flex items-center justify-center">
								<p class="text-gray-400 text-sm text-center">Vista previa del contenido</p>
							</div>
							
							<!-- Mini Footer Preview -->
							<div class="bg-gray-900 text-white px-4 py-4">
								<div class="flex items-start gap-3">
									{#if previewBranding.customLogo}
										<img 
											src={previewBranding.customLogo} 
											alt="Logo" 
											class="object-contain brightness-110"
											style="height: {previewBranding.logoSize}px"
										/>
									{:else}
										<div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white shrink-0">
											<Shield size={16} />
										</div>
									{/if}
									<div>
										<span class="text-sm font-bold uppercase">L-SPA</span>
										<p class="text-xs text-gray-400 mt-1 line-clamp-2">
											{previewBranding.footerText || DEFAULT_BRANDING.footerText}
										</p>
									</div>
								</div>
							</div>
						</div>
						
						<p class="text-xs text-gray-400 text-center">
							Esta es una vista previa de cómo se verá tu sitio con los cambios aplicados
						</p>
					{/if}
				</div>
			</div>
		{:else if activeTab === 'horarios'}
			<div class="max-w-2xl space-y-8">
				<div>
					<h3 class="text-lg font-black text-gray-900 dark:text-white uppercase mb-6">Horarios de Atención</h3>
					<div class="space-y-4">
						{#each days as day}
							<div class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700">
								<div class="flex items-center gap-4">
									<span class="w-24 text-sm font-black text-gray-900 dark:text-white">{dayLabels[day]}</span>
								</div>
								<div class="flex items-center gap-4">
									<label class="flex items-center gap-2 cursor-pointer">
										<input 
											type="checkbox" 
											bind:checked={config[day].enabled}
											class="w-5 h-5 rounded text-primary focus:ring-primary"
										/>
										<span class="text-sm text-gray-600 dark:text-gray-400">Abierto</span>
									</label>
									<div class="flex items-center gap-2">
										<input 
											type="time" 
											bind:value={config[day].open}
											disabled={!config[day].enabled}
											class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary outline-none disabled:opacity-50"
										/>
										<span class="text-gray-400">-</span>
										<input 
											type="time" 
											bind:value={config[day].close}
											disabled={!config[day].enabled}
											class="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-primary outline-none disabled:opacity-50"
										/>
									</div>
								</div>
							</div>
						{/each}
					</div>
				</div>
			</div>
		{:else if activeTab === 'notificaciones'}
			<div class="max-w-2xl space-y-8">
				<div>
					<h3 class="text-lg font-black text-gray-900 dark:text-white uppercase mb-6">Notificaciones</h3>
					<div class="space-y-4">
						<label class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 cursor-pointer">
							<div>
								<p class="font-black text-gray-900 dark:text-white">Notificaciones por Email</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">Recibe actualizaciones sobre nuevas reservas</p>
							</div>
							<input 
								type="checkbox" 
								bind:checked={config.emailNotifications}
								class="w-6 h-6 rounded text-primary focus:ring-primary"
							/>
						</label>
						<label class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 cursor-pointer">
							<div>
								<p class="font-black text-gray-900 dark:text-white">Notificaciones por SMS</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">Recibe mensajes de texto con recordatorios</p>
							</div>
							<input 
								type="checkbox" 
								bind:checked={config.smsNotifications}
								class="w-6 h-6 rounded text-primary focus:ring-primary"
							/>
						</label>
						<label class="flex items-center justify-between p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 cursor-pointer">
							<div>
								<p class="font-black text-gray-900 dark:text-white">Notificaciones por WhatsApp</p>
								<p class="text-sm text-gray-500 dark:text-gray-400">Recibe mensajes de WhatsApp con confirmaciones</p>
							</div>
							<input 
								type="checkbox" 
								bind:checked={config.whatsappNotifications}
								class="w-6 h-6 rounded text-primary focus:ring-primary"
							/>
						</label>
					</div>
				</div>
			</div>
		{:else if activeTab === 'politicas'}
			<div class="max-w-2xl space-y-8">
				<div>
					<h3 class="text-lg font-black text-gray-900 dark:text-white uppercase mb-6">Políticas de Reserva</h3>
					<div class="space-y-6">
						<div>
							<label for="cancellationPolicy" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Política de Cancelación (horas)</label>
							<input 
								id="cancellationPolicy"
								type="number" 
								bind:value={config.cancellationPolicy}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Los clientes deben cancelar con al menos esta cantidad de horas de anticipación</p>
						</div>
						<div>
							<label for="bookingInterval" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Intervalo entre Citas (minutos)</label>
							<input 
								id="bookingInterval"
								type="number" 
								bind:value={config.bookingInterval}
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-2">Tiempo mínimo entre el final de una cita y el inicio de la siguiente</p>
						</div>
					</div>
				</div>
			</div>
		{:else if activeTab === 'redes'}
			<div class="max-w-2xl space-y-8">
				<div>
					<h3 class="text-lg font-black text-gray-900 dark:text-white uppercase mb-6">Redes Sociales</h3>
					<div class="space-y-6">
						<div>
							<label for="instagram" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Instagram</label>
							<input 
								id="instagram"
								type="url" 
								bind:value={config.instagram}
								placeholder="https://instagram.com/tu-negocio"
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
						<div>
							<label for="facebook" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Facebook</label>
							<input 
								id="facebook"
								type="url" 
								bind:value={config.facebook}
								placeholder="https://facebook.com/tu-negocio"
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
						<div>
							<label for="twitter" class="block text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">Twitter / X</label>
							<input 
								id="twitter"
								type="url" 
								bind:value={config.twitter}
								placeholder="https://x.com/tu-negocio"
								class="w-full px-6 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
							/>
						</div>
					</div>
				</div>
			</div>
		{/if}
	</div>
</div>
