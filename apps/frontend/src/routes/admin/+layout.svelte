<script lang="ts">
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth-client';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { theme, getTheme, toggleTheme, initTheme, type Theme } from '$lib/theme';
	import { 
		LayoutDashboard, 
		Users, 
		Scissors, 
		Settings, 
		LogOut,
		Calendar,
		ChevronRight,
		ShieldCheck,
		Sparkles,
		Sun,
		Moon
	} from 'lucide-svelte';

	let { children } = $props();
	const session = authClient.useSession();

	// Dark mode state
	let currentTheme = $state<Theme>('light');

	// Initialize theme
	onMount(() => {
		initTheme();
		currentTheme = getTheme();
	});

	// Navigation items for admin
	const adminNavItems = [
		{ href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
		{ href: '/admin/usuarios', label: 'Usuarios', icon: Users },
		{ href: '/admin/servicios', label: 'Servicios', icon: Scissors },
		{ href: '/admin/citas', label: 'Citas', icon: Calendar },
		{ href: '/admin/configuracion', label: 'Configuración', icon: Settings },
	];

	// Redirect if not authenticated and check role
	$effect(() => {
		if (browser && !$session.isPending && !$session.data) {
			goto('/login');
		}
	});

	// Get current path using $derived
	let currentPath = $derived($page.url.pathname);

	// Logout handler
	async function handleLogout() {
		await authClient.signOut();
		goto('/');
	}

	function isActive(href: string) {
		if (href === '/admin') {
			return currentPath === '/admin';
		}
		return currentPath.startsWith(href);
	}

	function handleToggleTheme() {
		currentTheme = toggleTheme();
	}
</script>

<svelte:head>
	<title>Admin | L-SPA</title>
</svelte:head>

{#if $session.isPending}
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div class="text-center">
			<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">Cargando...</p>
		</div>
	</div>
{:else if $session.data}
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
		<!-- Sidebar -->
		<aside class="w-72 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 fixed h-full flex flex-col transition-colors">
			<!-- Logo & Theme Toggle -->
			<div class="p-8 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
				<a href="/admin" class="flex items-center gap-3">
					<div class="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white">
						<Sparkles size={24} />
					</div>
					<div>
						<span class="text-lg font-black tracking-tighter text-gray-900 dark:text-white uppercase">L-SPA</span>
						<p class="text-[10px] font-black uppercase tracking-widest text-primary">Panel Admin</p>
					</div>
				</a>
				<button 
					onclick={handleToggleTheme}
					class="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
					title={currentTheme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
				>
					{#if currentTheme === 'dark'}
						<Sun size={20} class="text-amber-400" />
					{:else}
						<Moon size={20} class="text-gray-400" />
					{/if}
				</button>
			</div>

			<!-- Navigation -->
			<nav class="flex-1 p-6 space-y-2">
				{#each adminNavItems as item}
					<a 
						href={item.href}
						class="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 {isActive(item.href) ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'}"
					>
						<item.icon size={20} />
						<span class="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
						{#if isActive(item.href)}
							<ChevronRight size={16} class="ml-auto" />
						{/if}
					</a>
				{/each}
			</nav>

			<!-- User Info & Logout -->
			<div class="p-6 border-t border-gray-100 dark:border-gray-700">
				<div class="flex items-center gap-4 mb-4">
					<img 
						src={$session.data?.user.image || `https://ui-avatars.com/api/?name=${$session.data?.user.name}`} 
						alt={$session.data?.user.name}
						class="w-12 h-12 rounded-full border-2 border-white dark:border-gray-600 shadow-sm"
					/>
					<div class="flex-1 min-w-0">
						<p class="text-sm font-black text-gray-900 dark:text-white truncate">{$session.data?.user.name}</p>
						<p class="text-[10px] font-medium text-gray-400 dark:text-gray-500 truncate">{$session.data?.user.email}</p>
					</div>
				</div>
				<button 
					onclick={handleLogout}
					class="w-full flex items-center gap-3 px-6 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-colors"
				>
					<LogOut size={18} />
					<span class="text-[10px] font-black uppercase tracking-widest">Cerrar Sesión</span>
				</button>
			</div>
		</aside>

		<!-- Main Content -->
		<main class="flex-1 ml-72 p-8">
			{@render children?.()}
		</main>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div class="text-center">
			<ShieldCheck size={48} class="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
			<p class="text-gray-500 dark:text-gray-400">No tienes acceso a este panel</p>
			<a href="/login" class="text-primary font-black">Iniciar sesión</a>
		</div>
	</div>
{/if}
