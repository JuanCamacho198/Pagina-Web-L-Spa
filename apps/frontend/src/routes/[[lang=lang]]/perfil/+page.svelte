<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { User, Mail, ShieldCheck, LogOut, Heart, Calendar, MapPin, Camera, ShoppingBag } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Use Better Auth session directly
	const session = authClient.useSession();

	// API URL
	const API_URL = 'http://localhost:3000/api/v1';

	// Profile data state
	let profileData = $state<any>(null);
	let loading = $state(true);
	let error = $state('');

	// Fetch profile data from API
	async function fetchProfileData() {
		if (!browser || !$session.data?.user?.id) return;
		
		try {
			const response = await fetch(`${API_URL}/users/profile/stats`, {
				headers: {
					'X-User-ID': $session.data.user.id,
				},
				credentials: 'include',
			});
			
			if (response.ok) {
				const data = await response.json();
				profileData = data;
			} else {
				error = 'Error al cargar datos del perfil';
			}
		} catch (e) {
			console.error('Error fetching profile:', e);
			error = 'Error al conectar con el servidor';
		} finally {
			loading = false;
		}
	}

	// Fetch data when session is ready
	$effect(() => {
		if (!$session.isPending && $session.data) {
			fetchProfileData();
		}
	});

	// Redirect if not authenticated
	$effect(() => {
		if (browser && !$session.isPending && !$session.data) {
			goto('/login');
		}
	});

	// Logout handler
	async function handleLogout() {
		await authClient.signOut();
		goto('/');
	}
</script>

<svelte:head>
	<title>Mi Perfil | L-SPA Experience</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pt-40 pb-32 px-6">
	{#if $session.isPending || loading}
		<div class="max-w-4xl mx-auto flex flex-col items-center justify-center py-40 gap-6">
			<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
			<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Autenticando Santuario...</p>
		</div>
	{:else if $session.data}
		<div class="max-w-5xl mx-auto space-y-12">
			<!-- Profile Hero Card -->
			<div class="bg-white rounded-spa-xxl shadow-2xl shadow-primary/5 border border-gray-100 overflow-hidden relative group/hero">
				<div class="absolute inset-0 bg-primary/5 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-1000"></div>
				
				<div class="p-12 md:p-20 relative z-10">
					<div class="flex flex-col md:flex-row items-center gap-12">
						<!-- Avatar with Upload Hover -->
						<div class="relative group">
							<div class="w-48 h-48 rounded-[56px] overflow-hidden border-4 border-white shadow-2xl relative">
								<img src={profileData?.user?.image || $session.data?.user.image || `https://ui-avatars.com/api/?name=${$session.data?.user.name}`} alt={$session.data?.user.name} class="w-full h-full object-cover" />
								<div class="absolute inset-0 bg-gray-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
									<Camera size={40} class="text-white" />
								</div>
							</div>
							<div class="absolute -bottom-4 -right-4 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-xl">
								<ShieldCheck size={28} />
							</div>
						</div>

						<!-- Bio Info -->
						<div class="flex-1 text-center md:text-left space-y-6">
							<div class="space-y-2">
								<div class="inline-flex items-center gap-2 px-6 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em]">
									{profileData?.user?.role === 'admin' ? 'Administrador' : profileData?.user?.role === 'employee' ? 'Empleado' : 'Cliente Premium'}
								</div>
								<h1 class="text-5xl md:text-7xl font-black text-gray-900 tracking-tighter leading-none uppercase">
									{profileData?.user?.name?.split(' ')[0] || $session.data?.user.name?.split(' ')[0]} <br /> <span class="text-primary italic">{profileData?.user?.name?.split(' ').slice(1).join(' ') || $session.data?.user.name?.split(' ').slice(1).join(' ')}</span>
								</h1>
							</div>
							
							<div class="flex flex-wrap justify-center md:justify-start gap-8">
								<div class="flex items-center gap-3 text-gray-400 font-bold text-sm">
									<Mail size={18} class="text-primary" />
									{profileData?.user?.email || $session.data?.user.email}
								</div>
								{#if profileData?.user?.phone}
									<div class="flex items-center gap-3 text-gray-400 font-bold text-sm">
										<MapPin size={18} class="text-primary" />
										{profileData.user.phone}
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- Stats Floor -->
				<div class="bg-gray-900 p-10 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-12">
					<div class="flex items-center gap-6 group/stat">
						<div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-primary group-hover/stat:bg-primary group-hover/stat:text-white transition-all duration-500">
							<Calendar size={24} />
						</div>
						<div>
							<p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Citas Realizadas</p>
							<p class="text-2xl font-black text-white tracking-tight">{profileData?.stats?.appointmentsCount || 0}</p>
						</div>
					</div>
					<div class="flex items-center gap-6 group/stat">
						<div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-primary group-hover/stat:bg-primary group-hover/stat:text-white transition-all duration-500">
							<Heart size={24} />
						</div>
						<div>
							<p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">Favoritos</p>
							<p class="text-2xl font-black text-white tracking-tight">{profileData?.stats?.favoritesCount || 0}</p>
						</div>
					</div>
					<div class="flex items-center gap-6 group/stat">
						<div class="w-14 h-14 bg-white/5 rounded-full flex items-center justify-center text-primary group-hover/stat:bg-primary group-hover/stat:text-white transition-all duration-500">
							<ShoppingBag size={24} />
						</div>
						<div>
							<p class="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">En Carrito</p>
							<p class="text-2xl font-black text-white tracking-tight">{profileData?.stats?.cartCount || 0}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Interaction Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<!-- Settings / Account -->
				<div class="lg:col-span-12 bg-white rounded-spa-xl p-12 shadow-2xl shadow-primary/5 border border-gray-100">
					<div class="flex items-center justify-between mb-12">
						<h2 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Gestión de <span class="text-primary italic">Cuenta</span></h2>
						<Button variant="ghost" class="text-[10px] font-black tracking-widest uppercase">Editar Perfil</Button>
					</div>

					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						{#each [
							{ title: 'Seguridad', desc: 'Contraseña y verificación de dos pasos', icon: ShieldCheck },
							{ title: 'Preferencias', desc: 'Notificaciones y aromas favoritos', icon: Heart },
							{ title: 'Historial', desc: 'Ver todos tus rituales pasados', icon: Calendar },
							{ title: 'Cerrar Sesión', desc: 'Salir de tu cuenta de forma segura', icon: LogOut, action: handleLogout, danger: true }
						] as item}
							<button 
								onclick={item.action}
								class="p-8 rounded-4xl border border-gray-50 flex items-start gap-6 hover:bg-gray-50 hover:border-primary/20 transition-all text-left group"
							>
								<div class="p-4 rounded-4xl {item.danger ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-400 group-hover:bg-primary group-hover:text-white'} transition-all duration-500">
									<item.icon size={24} />
								</div>
								<div>
									<h4 class="text-lg font-black text-gray-900 tracking-tight">{item.title.toUpperCase()}</h4>
									<p class="text-sm font-medium text-gray-400">{item.desc}</p>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{:else}
		<!-- Not authenticated, show redirect message -->
		<div class="max-w-4xl mx-auto flex flex-col items-center justify-center py-40 gap-6">
			<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Redirigiendo a login...</p>
		</div>
	{/if}
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 0% 100%, hsla(327, 67%, 33%, 0.05) 0, transparent 40%);
        background-attachment: fixed;
	}
</style>
