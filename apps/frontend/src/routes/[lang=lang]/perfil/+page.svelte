<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { PUBLIC_API_URL } from '$env/static/public';
	import { User, Mail, ShieldCheck, LogOut, Heart, Calendar, MapPin, Camera, ShoppingBag } from 'lucide-svelte';
	import Button from '$lib/components/ui/Button.svelte';
	import Skeleton from 'boneyard-js/svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	// Use Better Auth session directly
	const session = authClient.useSession();

	// API URL
	const API_URL = PUBLIC_API_URL || 'http://localhost:3000/api/v1';

	// Profile data state
	let profileData = $state<any>(null);
	let loading = $state(true);
	let error = $state('');
	let isLoading = $derived($session.isPending || loading);

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

{#snippet fallback()}
	<div class="max-w-5xl mx-auto space-y-8 py-8">
		<div class="h-72 rounded-spa-xxl bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 animate-pulse"></div>
		<div class="h-80 rounded-spa-xl bg-white dark:bg-[#1A1A1A] border border-gray-100 dark:border-white/5 animate-pulse"></div>
	</div>
{/snippet}

<div class="min-h-screen bg-[#FAFAFA] dark:bg-[#121212] transition-colors duration-700 pt-40 pb-32 px-6">
	<Skeleton loading={isLoading} name="profile-page" {fallback}>
		{#if $session.data}
			<div class="max-w-5xl mx-auto space-y-12">
			<!-- Profile Hero Card -->
			<div class="bg-white dark:bg-[#1A1A1A] rounded-spa-xxl shadow-spa dark:shadow-none border border-gray-50 dark:border-white/5 overflow-hidden relative group/hero transition-colors duration-700">
				<div class="absolute inset-0 bg-primary/5 dark:bg-primary-dark/20 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-1000"></div>
				
				<div class="p-12 md:p-20 relative z-10 w-full">
					<div class="flex flex-col md:flex-row items-center gap-12">
						<!-- Avatar with Upload Hover -->
						<div class="relative group">
							<div class="w-48 h-48 rounded-spa-xl overflow-hidden border-4 border-white dark:border-[#2A2A2A] shadow-xl relative transition-colors duration-500">
								<img src={profileData?.user?.image || $session.data?.user.image || `https://ui-avatars.com/api/?name=${$session.data?.user.name}&background=8C1B58&color=fff`} alt={$session.data?.user.name} class="w-full h-full object-cover" />
								<div class="absolute inset-0 bg-primary-dark/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer">
									<Camera size={40} strokeWidth={1.5} class="text-white" />
								</div>
							</div>
							<div class="absolute -bottom-4 -right-4 w-14 h-14 bg-primary dark:bg-primary-light text-white rounded-full flex items-center justify-center shadow-lg transition-colors">
								<ShieldCheck size={24} strokeWidth={1.5} />
							</div>
						</div>

						<!-- Bio Info -->
						<div class="flex-1 text-center md:text-left space-y-6">
							<div class="space-y-4">
								<div class="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-secondary/30 dark:bg-white/5 text-primary-dark dark:text-primary-light text-[10px] font-medium uppercase tracking-[0.3em] border border-secondary dark:border-white/10 transition-colors">
									{profileData?.user?.role === 'admin' ? 'Administrador' : profileData?.user?.role === 'employee' ? 'Empleado' : 'Cliente Premium'}
								</div>
								<h1 class="text-5xl md:text-7xl font-display text-gray-900 dark:text-white leading-[1.1] transition-colors">
									{profileData?.user?.name?.split(' ')[0] || $session.data?.user.name?.split(' ')[0]} <br /> <span class="text-primary dark:text-primary-light italic font-light">{profileData?.user?.name?.split(' ').slice(1).join(' ') || $session.data?.user.name?.split(' ').slice(1).join(' ')}</span>
								</h1>
							</div>
							
							<div class="flex flex-wrap justify-center md:justify-start gap-8">
								<div class="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-light text-sm transition-colors">
									<Mail size={18} strokeWidth={1.5} class="text-primary dark:text-secondary" />
									{profileData?.user?.email || $session.data?.user.email}
								</div>
								{#if profileData?.user?.phone}
									<div class="flex items-center gap-3 text-gray-500 dark:text-gray-400 font-light text-sm transition-colors">
										<MapPin size={18} strokeWidth={1.5} class="text-primary dark:text-secondary" />
										{profileData.user.phone}
									</div>
								{/if}
							</div>
						</div>
					</div>
				</div>

				<!-- Stats Floor -->
				<div class="bg-primary-dark dark:bg-[#121212]/50 p-10 md:px-20 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-primary/20 dark:border-white/5 transition-colors">
					<div class="flex items-center gap-6 group/stat">
						<div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-secondary group-hover/stat:bg-secondary group-hover/stat:text-primary-dark transition-all duration-500">
							<Calendar size={20} strokeWidth={1.5} />
						</div>
						<div>
							<p class="text-[10px] font-medium uppercase tracking-[0.2em] text-secondary/70 dark:text-gray-400">Citas Realizadas</p>
							<p class="text-3xl font-display text-white tracking-tight mt-1">{profileData?.stats?.appointmentsCount || 0}</p>
						</div>
					</div>
					<div class="flex items-center gap-6 group/stat">
						<div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-secondary group-hover/stat:bg-secondary group-hover/stat:text-primary-dark transition-all duration-500">
							<Heart size={20} strokeWidth={1.5} />
						</div>
						<div>
							<p class="text-[10px] font-medium uppercase tracking-[0.2em] text-secondary/70 dark:text-gray-400">Favoritos</p>
							<p class="text-3xl font-display text-white tracking-tight mt-1">{profileData?.stats?.favoritesCount || 0}</p>
						</div>
					</div>
					<div class="flex items-center gap-6 group/stat">
						<div class="w-14 h-14 bg-white/10 rounded-full flex items-center justify-center text-secondary group-hover/stat:bg-secondary group-hover/stat:text-primary-dark transition-all duration-500">
							<ShoppingBag size={20} strokeWidth={1.5} />
						</div>
						<div>
							<p class="text-[10px] font-medium uppercase tracking-[0.2em] text-secondary/70 dark:text-gray-400">En Carrito</p>
							<p class="text-3xl font-display text-white tracking-tight mt-1">{profileData?.stats?.cartCount || 0}</p>
						</div>
					</div>
				</div>
			</div>

			<!-- Interaction Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
				<!-- Settings / Account -->
				<div class="lg:col-span-12 bg-white dark:bg-[#1A1A1A] rounded-spa-xl p-12 shadow-spa dark:shadow-none border border-gray-50 dark:border-white/5 transition-colors duration-700">
					<div class="flex items-center justify-between mb-12">
						<h2 class="text-3xl font-display text-gray-900 dark:text-white transition-colors">Gestión de <span class="text-primary dark:text-primary-light italic">Cuenta</span></h2>
						<Button variant="ghost" class="text-xs font-medium tracking-[0.2em] uppercase text-gray-500 hover:text-primary dark:text-gray-400 dark:hover:text-white">Editar Perfil</Button>
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
								class="p-8 rounded-spa-lg border border-gray-100 dark:border-white/5 flex items-start gap-6 hover:bg-gray-50 dark:hover:bg-white/5 hover:border-primary/20 dark:hover:border-primary/20 transition-all text-left group"
							>
								<div class="p-4 rounded-full {item.danger ? 'bg-red-50/50 dark:bg-red-500/10 text-red-400' : 'bg-secondary/30  text-primary-dark dark:text-gray-400 group-hover:bg-primary group-hover:text-white dark:group-hover:bg-primary-light dark:group-hover:text-primary-dark'} transition-all duration-500 shadow-sm group-hover:scale-110">
									<item.icon size={20} strokeWidth={1.5} />
								</div>
								<div class="space-y-1 mt-1">
									<h4 class="text-sm font-medium uppercase tracking-widest text-gray-900 dark:text-white transition-colors">{item.title}</h4>
									<p class="text-xs font-light text-gray-500 dark:text-gray-400 transition-colors">{item.desc}</p>
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
				<p class="text-[10px] font-medium uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">Redirigiendo a login...</p>
			</div>
		{/if}
	</Skeleton>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 0% 100%, hsla(327, 67%, 33%, 0.03) 0, transparent 40%);
		background-attachment: fixed;
	}
	:global(.dark body) {
		background-image: radial-gradient(at 0% 100%, hsla(327, 67%, 33%, 0.1) 0, transparent 40%);
	}
</style>
