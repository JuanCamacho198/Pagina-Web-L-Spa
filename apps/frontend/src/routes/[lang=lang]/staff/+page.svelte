<script lang="ts">
	import { authClient, apiClient } from '$lib/auth-client';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getLocalizedPath } from '$lib/i18n/utils';
	import { getRbacDecision } from '$lib/auth/rbac';
	import { toast } from '$lib/stores/toast.svelte';
	import { get } from 'svelte/store';
	import { _, isLoading as i18nLoading } from 'svelte-i18n';
	import { 
		Calendar, 
		Users,
		LogOut,
		ChevronRight,
		Check,
		X,
		Clock,
		User,
		Scissors,
		Shield,
		Loader2
	} from 'lucide-svelte';
	import Skeleton from 'boneyard-js/svelte';

	const session = authClient.useSession();
	let currentLang = $derived($page.params.lang || 'es');
	let userRole = $state<'admin' | 'employee' | 'customer' | null>(null);
	let roleResolved = $state(false);

	type EmployeeAppointment = {
		id: string;
		serviceId: string;
		serviceName: string;
		serviceDuration: number;
		servicePrice: string;
		appointmentDate: string;
		appointmentTime: string;
		status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
		userName: string;
		userEmail: string;
		userPhone: string;
	};

	let todayBookings = $state<EmployeeAppointment[]>([]);
	let upcomingBookings = $state<EmployeeAppointment[]>([]);
	let isLoading = $state(true);
	let error = $state<string | null>(null);

	const uiText = $derived($i18nLoading ? {
		loading: 'Loading...',
		unauthorizedTitle: 'No access to staff panel',
		unauthorizedDescription: 'Your account does not have staff permissions.',
		backHome: 'Back to home',
		goAdmin: 'Go to admin panel',
		signIn: 'Sign in'
	} : {
		loading: $_('common.loading'),
		unauthorizedTitle: $_('auth.access.staffDeniedTitle'),
		unauthorizedDescription: $_('auth.access.staffDeniedDescription'),
		backHome: $_('auth.access.backHome'),
		goAdmin: $_('auth.access.goAdmin'),
		signIn: $_('nav.login')
	});

	const accessDecision = $derived(
		getRbacDecision('staff', userRole, Boolean($session.data))
	);

	function t(key: string, fallback: string): string {
		const translate = get(_);
		const value = translate(key);
		return typeof value === 'string' && value !== key ? value : fallback;
	}

	// Redirect if not authenticated
	$effect(() => {
		if (browser && !$session.isPending && !$session.data) {
			const returnTo = encodeURIComponent(getLocalizedPath('/staff', currentLang));
			goto(`${getLocalizedPath('/login', currentLang)}?returnTo=${returnTo}`, { replaceState: true });
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

	// Fetch appointments on mount when session is ready
	$effect(() => {
		if (!browser || $session.isPending) return;
		if (!$session.data?.user?.id) return;
		
		fetchAppointments($session.data.user.id);
	});

	async function fetchAppointments(auth0Id: string) {
		isLoading = true;
		error = null;
		
		try {
			const today = new Date().toISOString().split('T')[0];
			const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
			const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];

			const [todayResponse, upcomingResponse] = await Promise.all([
				apiClient.get<EmployeeAppointment[]>(`/appointments/employee/${auth0Id}?startDate=${today}&endDate=${today}`),
				apiClient.get<EmployeeAppointment[]>(`/appointments/employee/${auth0Id}?startDate=${tomorrow}&endDate=${nextWeek}`)
			]);

			todayBookings = todayResponse || [];
			upcomingBookings = upcomingResponse || [];
		} catch (err) {
			console.error('Error fetching appointments:', err);
			error = 'Error al cargar las citas';
		} finally {
			isLoading = false;
		}
	}

	async function updateAppointmentStatus(id: string, newStatus: 'confirmed' | 'completed' | 'cancelled') {
		try {
			await apiClient.patch(`/appointments/${id}/status`, { status: newStatus });
			
			// Refetch appointments to update UI
			if ($session.data?.user?.id) {
				await fetchAppointments($session.data.user.id);
			}
		} catch (err) {
			console.error('Error updating appointment status:', err);
			error = 'Error al actualizar el estado de la cita';
		}
	}

	async function handleLogout() {
		try {
			const { error } = await authClient.signOut();

			if (error) {
				throw error;
			}

			toast.success(
				t('auth.toast.logout.success.message', 'Your session has ended successfully.'),
				t('auth.toast.logout.success.title', 'Signed out')
			);

			goto(getLocalizedPath('/', currentLang), { replaceState: true, invalidateAll: true });
		} catch {
			toast.error(
				t('auth.toast.logout.error.message', 'We could not sign you out. Please try again.'),
				t('auth.toast.logout.error.title', 'Sign out failed')
			);
		}
	}

	function getStatusColor(status: string) {
		switch(status) {
			case 'completed': return 'bg-emerald-50 text-emerald-600';
			case 'confirmed': return 'bg-blue-50 text-blue-600';
			case 'pending': return 'bg-amber-50 text-amber-600';
			case 'cancelled': return 'bg-rose-50 text-rose-600';
			default: return 'bg-gray-50 text-gray-600';
		}
	}

	function getStatusLabel(status: string) {
		switch(status) {
			case 'completed': return 'Completada';
			case 'confirmed': return 'Confirmada';
			case 'pending': return 'Pendiente';
			case 'cancelled': return 'Cancelada';
			default: return status;
		}
	}

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' }).replace('.', '');
	}
</script>

<svelte:head>
	<title>Panel Empleados | L-SPA</title>
</svelte:head>

{#if $session.isPending || !roleResolved}
	<div class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="text-center">
			<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">{uiText.loading}</p>
		</div>
	</div>
{:else if accessDecision.authorized}
	<div class="min-h-screen bg-linear-to-br from-gray-50 to-gray-100">
		<!-- Top Header -->
		<header class="bg-white border-b border-gray-200 px-8 py-4">
			<div class="flex items-center justify-between">
				<div class="flex items-center gap-4">
					<div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white">
						<Scissors size={20} />
					</div>
					<div>
						<h1 class="text-lg font-black text-gray-900 uppercase tracking-tight">Panel de Empleados</h1>
						<p class="text-xs text-gray-500">L-SPA Experience</p>
					</div>
				</div>
				<div class="flex items-center gap-4">
					<div class="flex items-center gap-3">
						<img 
							src={$session.data?.user.image || `https://ui-avatars.com/api/?name=${$session.data?.user.name}`}
							alt={$session.data?.user.name}
							loading="lazy"
							decoding="async"
							class="w-10 h-10 rounded-full border-2 border-white shadow-sm"
						/>
						<div class="text-right">
							<p class="text-sm font-black text-gray-900">{$session.data?.user.name}</p>
							<p class="text-xs text-gray-500">Empleado</p>
						</div>
					</div>
					<button 
						onclick={handleLogout}
						class="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
						title="Cerrar Sesión"
					>
						<LogOut size={20} />
					</button>
				</div>
			</div>
		</header>

		<main class="p-8">
			<div class="max-w-6xl mx-auto">
				{#snippet fallback()}
					<div class="flex items-center justify-center py-20">
						<div class="text-center">
							<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
							<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Cargando...</p>
						</div>
					</div>
				{/snippet}

				<Skeleton loading={isLoading} {fallback}>
				{#if isLoading}
					<div class="flex items-center justify-center py-20">
						<div class="text-center">
							<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
							<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Cargando...</p>
						</div>
					</div>
				{:else if error}
					<div class="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center">
						<p class="text-rose-600 font-black">{error}</p>
					</div>
				{:else}
					<!-- Date Header -->
					<div class="mb-8">
						<h2 class="text-2xl font-black text-gray-900 uppercase">{new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
						<p class="text-gray-500">{todayBookings.length} citas programadas para hoy</p>
					</div>

					<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
						<!-- Today's Timeline -->
						<div class="lg:col-span-2 space-y-6">
							<h3 class="text-lg font-black text-gray-900 uppercase flex items-center gap-2">
								<Clock size={20} class="text-primary" />
								Citas de Hoy
							</h3>

							{#if todayBookings.length === 0}
								<div class="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 text-center">
									<p class="text-gray-500">No hay citas programadas para hoy</p>
								</div>
							{:else}
								<div class="space-y-4">
									{#each todayBookings as booking}
										<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
											<div class="flex items-start gap-6">
												<!-- Time -->
												<div class="w-20 text-center">
													<p class="text-2xl font-black text-gray-900">{booking.appointmentTime}</p>
													<p class="text-xs text-gray-400">{booking.serviceDuration} min</p>
												</div>

												<!-- Content -->
												<div class="flex-1">
													<div class="flex items-start justify-between mb-2">
														<div>
															<h4 class="text-lg font-black text-gray-900">{booking.userName}</h4>
															<p class="text-gray-500">{booking.serviceName}</p>
														</div>
														<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest {getStatusColor(booking.status)}">
															{getStatusLabel(booking.status)}
														</span>
													</div>
													
													{#if booking.userPhone}
														<p class="text-sm text-gray-400 bg-gray-50 rounded-xl p-3 mt-3">
															Tel: {booking.userPhone}
														</p>
													{/if}

													<!-- Actions -->
													<div class="flex items-center gap-3 mt-4">
														{#if booking.status === 'pending'}
															<button 
																onclick={() => updateAppointmentStatus(booking.id, 'confirmed')}
																class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 transition-colors"
															>
																<Check size={16} />
																Iniciar
															</button>
															<button 
																onclick={() => updateAppointmentStatus(booking.id, 'cancelled')}
																class="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
															>
																<X size={16} />
																Cancelar
															</button>
														{:else if booking.status === 'confirmed'}
															<button 
																onclick={() => updateAppointmentStatus(booking.id, 'completed')}
																class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors"
															>
																<Check size={16} />
																Completar
															</button>
														{/if}
													</div>
												</div>
											</div>
										</div>
									{/each}
								</div>
							{/if}
						</div>

						<!-- Sidebar - Upcoming -->
						<div class="space-y-6">
							<h3 class="text-lg font-black text-gray-900 uppercase flex items-center gap-2">
								<Calendar size={20} class="text-primary" />
								Próximas Citas
							</h3>

							{#if upcomingBookings.length === 0}
								<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 text-center">
									<p class="text-gray-500 text-sm">No hay citas próximas</p>
								</div>
							{:else}
								<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
									{#each upcomingBookings as booking}
										<div class="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
											<div class="flex items-center justify-between mb-2">
												<span class="text-sm font-black text-gray-900">{formatDate(booking.appointmentDate)}</span>
												<span class="text-sm font-medium text-gray-500">{booking.appointmentTime}</span>
											</div>
											<p class="font-black text-gray-700">{booking.userName}</p>
											<p class="text-sm text-gray-500">{booking.serviceName}</p>
										</div>
									{/each}
								</div>
							{/if}

							<!-- Quick Stats -->
							<div class="bg-linear-to-br from-primary to-primary/80 rounded-3xl p-6 text-white">
								<h4 class="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">Resumen del Día</h4>
								<div class="grid grid-cols-2 gap-4">
									<div>
										<p class="text-3xl font-black">{todayBookings.length}</p>
										<p class="text-xs opacity-80">Citas</p>
									</div>
									<div>
										<p class="text-3xl font-black">{todayBookings.reduce((acc, b) => acc + b.serviceDuration, 0) / 60}h</p>
										<p class="text-xs opacity-80">Trabajo</p>
									</div>
									<div>
										<p class="text-3xl font-black">${todayBookings.reduce((acc, b) => acc + parseFloat(b.servicePrice || '0'), 0).toLocaleString('es-CL')}</p>
										<p class="text-xs opacity-80">Ingresos</p>
									</div>
									<div>
										<p class="text-3xl font-black">{new Set(todayBookings.map(b => b.userName)).size}</p>
										<p class="text-xs opacity-80">Clientes</p>
									</div>
								</div>
							</div>
						</div>
					</div>
				{/if}
				</Skeleton>
			</div>
		</main>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="text-center max-w-md px-6">
			<Shield size={48} class="mx-auto mb-4 text-gray-300" />
			<p class="text-lg font-black text-gray-800 mb-2">{uiText.unauthorizedTitle}</p>
			<p class="text-sm text-gray-500 mb-6">{uiText.unauthorizedDescription}</p>
			<div class="flex items-center justify-center gap-3">
				<a href={getLocalizedPath('/', currentLang)} class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-secondary/40 text-gray-600 hover:bg-secondary/20 transition-colors">{uiText.backHome}</a>
				{#if userRole === 'admin'}
					<a href="/admin" class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-colors">{uiText.goAdmin}</a>
				{:else}
					<a href={getLocalizedPath('/login', currentLang)} class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest bg-primary text-white hover:bg-primary/90 transition-colors">{uiText.signIn}</a>
				{/if}
			</div>
		</div>
	</div>
{/if}
