<script lang="ts">
	import { onMount } from 'svelte';
	import { authClient } from '$lib/auth-client';
	import { apiClient } from '$lib/auth-client';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getTheme, toggleTheme, initTheme, type Theme } from '$lib/theme';
	import { getLocalizedPath, resolveActiveLocale } from '$lib/i18n/utils';
	import { getRbacDecision } from '$lib/auth/rbac';
	import { toast } from '$lib/stores/toast.svelte';
	import { get } from 'svelte/store';
	import { _, isLoading } from 'svelte-i18n';
	import { 
		LayoutDashboard, 
		Users, 
		Scissors, 
		Settings, 
		LogOut,
		Calendar,
		ChevronRight,
		ShieldCheck,
		Sun,
		Moon
	} from 'lucide-svelte';
	import spaLogo from '$lib/assets/logos/LOGO4x-sinfondo.png';
	import Toaster from '$lib/components/feedback/Toast.svelte';

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

	let userRole = $state<'admin' | 'employee' | 'customer' | null>(null);
	let roleResolved = $state(false);

	function getCookieLocale(): string | null {
		if (typeof document === 'undefined') return null;

		const raw = document.cookie
			.split('; ')
			.find((chunk) => chunk.startsWith('lang='))
			?.split('=')[1];

		return raw ?? null;
	}

	function getActiveLocale(): string {
		return resolveActiveLocale({
			urlLocale: null,
			cookieLocale: getCookieLocale()
		});
	}

	const uiText = $derived($isLoading ? {
		loading: 'Loading...',
		unauthorizedTitle: 'No access to admin panel',
		unauthorizedDescription: 'Your account does not have administrator permissions.',
		backHome: 'Go to home',
		goStaff: 'Go to staff panel',
		signIn: 'Sign in'
	} : {
		loading: $_('common.loading'),
		unauthorizedTitle: $_('auth.access.adminDeniedTitle'),
		unauthorizedDescription: $_('auth.access.adminDeniedDescription'),
		backHome: $_('auth.access.backHome'),
		goStaff: $_('auth.access.goStaff'),
		signIn: $_('nav.login')
	});

	const accessDecision = $derived(
		getRbacDecision('admin', userRole, Boolean($session.data))
	);

	function t(key: string, fallback: string): string {
		const translate = get(_);
		const value = translate(key);
		return typeof value === 'string' && value !== key ? value : fallback;
	}

	// Redirect if not authenticated and check role
	$effect(() => {
		if (!browser || $session.isPending) return;

		if (!$session.data) {
			const locale = getActiveLocale();
			const returnTo = encodeURIComponent('/admin');
			goto(`${getLocalizedPath('/login', locale)}?returnTo=${returnTo}`, { replaceState: true });
		}
	});

	$effect(() => {
		if (!browser || $session.isPending) return;

		if (!$session.data?.user?.id) {
			userRole = null;
			roleResolved = true;
			return;
		}

		roleResolved = false;

		(async () => {
			try {
				const profile = await apiClient.get<{ role?: 'admin' | 'employee' | 'customer' }>(`/users/${$session.data?.user?.id}`);
				userRole = profile?.role ?? null;
			} catch {
				userRole = null;
			} finally {
				roleResolved = true;
			}
		})();
	});

	// Get current path using $derived
	let currentPath = $derived($page.url.pathname);

	// Logout handler
	async function handleLogout() {
		const locale = getActiveLocale();

		try {
			const { error } = await authClient.signOut();

			if (error) {
				throw error;
			}

			toast.success(
				t('auth.toast.logout.success.message', 'Your session has ended successfully.'),
				t('auth.toast.logout.success.title', 'Signed out')
			);

			goto(getLocalizedPath('/', locale), { replaceState: true, invalidateAll: true });
		} catch {
			toast.error(
				t('auth.toast.logout.error.message', 'We could not sign you out. Please try again.'),
				t('auth.toast.logout.error.title', 'Sign out failed')
			);
		}
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

{#if $session.isPending || !roleResolved}
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div class="text-center">
			<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 dark:text-gray-500">{uiText.loading}</p>
		</div>
	</div>
{:else if accessDecision.authorized}
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex">
		<!-- Sidebar -->
		<aside class="w-72 bg-white dark:bg-gray-800 border-r border-secondary/20 fixed h-full flex flex-col transition-colors duration-500">
			<!-- Logo & Theme Toggle -->
			<div class="p-8 border-b border-secondary/20 flex items-center justify-between">
				<a href="/" class="flex items-center gap-3">
					<img src={spaLogo} alt="L-SPA Logo" class="h-12 w-auto object-contain" />
					<div>
						<span class="text-lg font-display font-black tracking-tighter text-gray-900 dark:text-white uppercase">L-SPA</span>
						<p class="text-[10px] font-black uppercase tracking-widest text-primary">Panel Admin</p>
					</div>
				</a>
				<button 
					onclick={handleToggleTheme}
					class="p-2 rounded-xl hover:bg-secondary/30 transition-colors duration-500"
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
						class="flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 {isActive(item.href) ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-gray-500 dark:text-gray-400 hover:bg-secondary/30 hover:text-gray-900 dark:hover:text-white'}"
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
			<div class="p-6 border-t border-secondary/20">
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
					class="w-full flex items-center gap-3 px-6 py-3 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-2xl transition-colors duration-500"
				>
					<LogOut size={18} />
					<span class="text-[10px] font-black uppercase tracking-widest">Cerrar Sesión</span>
				</button>
			</div>
		</aside>

		<!-- Main Content -->
		<main id="main" class="flex-1 ml-72 p-8">
			{@render children?.()}
		</main>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
		<div class="text-center max-w-md px-6">
			<ShieldCheck size={48} class="mx-auto mb-4 text-gray-300 dark:text-gray-600" />
			<p class="text-lg font-black text-gray-800 dark:text-gray-200 mb-2">{uiText.unauthorizedTitle}</p>
			<p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{uiText.unauthorizedDescription}</p>
			<div class="flex items-center justify-center gap-3">
				<a href={getLocalizedPath('/', getActiveLocale())} class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/40 text-gray-600 dark:text-gray-300 hover:bg-secondary/20 transition-colors">{uiText.backHome}</a>
				{#if userRole === 'employee'}
					<a href={getLocalizedPath('/staff', getActiveLocale())} class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-colors">{uiText.goStaff}</a>
				{:else}
					<a href={getLocalizedPath('/login', getActiveLocale())} class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-colors">{uiText.signIn}</a>
				{/if}
			</div>
		</div>
	</div>
{/if}

<Toaster />
