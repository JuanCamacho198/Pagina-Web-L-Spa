<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { 
		Calendar, 
		Users,
		LogOut,
		ChevronRight,
		Check,
		X,
		Clock,
		User,
		Scissors
	} from 'lucide-svelte';

	const session = authClient.useSession();

	// Redirect if not authenticated
	$effect(() => {
		if (browser && !$session.isPending && !$session.data) {
			goto('/login');
		}
	});

	$: currentPath = $page.url.pathname;

	async function handleLogout() {
		await authClient.signOut();
		goto('/');
	}

	// Today's bookings for this employee
	const todayBookings = [
		{ 
			id: '1', 
			time: '09:00',
			client: 'María González',
			service: 'Masaje Relajante',
			duration: 60,
			status: 'completed',
			notes: 'Cliente frecuente'
		},
		{ 
			id: '2', 
			time: '10:30',
			client: 'Carlos Ruiz',
			service: 'Tratamiento Facial',
			duration: 45,
			status: 'in-progress',
			notes: 'Primera vez'
		},
		{ 
			id: '3', 
			time: '14:00',
			client: 'Ana López',
			service: 'Aromaterapia',
			duration: 90,
			status: 'confirmed',
			notes: 'Prefiere aceite de lavanda'
		},
		{ 
			id: '4', 
			time: '16:00',
			client: 'Luis Fernando',
			service: 'Masaje Deportivo',
			duration: 75,
			status: 'pending',
			notes: ''
		},
	];

	const upcomingBookings = [
		{ 
			id: '5', 
			date: '15 Mar',
			time: '10:00',
			client: 'Sofia Pérez',
			service: 'Masaje Relajante',
			duration: 60,
		},
		{ 
			id: '6', 
			date: '15 Mar',
			time: '14:00',
			client: 'Jorge Wilson',
			service: 'Tratamiento Facial',
			duration: 45,
		},
		{ 
			id: '7', 
			date: '16 Mar',
			time: '11:00',
			client: 'Laura Díaz',
			service: 'Aromaterapia',
			duration: 90,
		},
	];

	function getStatusColor(status: string) {
		switch(status) {
			case 'completed': return 'bg-emerald-50 text-emerald-600';
			case 'in-progress': return 'bg-blue-50 text-blue-600';
			case 'confirmed': return 'bg-purple-50 text-purple-600';
			case 'pending': return 'bg-amber-50 text-amber-600';
			default: return 'bg-gray-50 text-gray-600';
		}
	}

	function getStatusLabel(status: string) {
		switch(status) {
			case 'completed': return 'Completada';
			case 'in-progress': return 'En progreso';
			case 'confirmed': return 'Confirmada';
			case 'pending': return 'Pendiente';
			default: return status;
		}
	}
</script>

<svelte:head>
	<title>Panel Empleados | L-SPA</title>
</svelte:head>

{#if $session.isPending}
	<div class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="text-center">
			<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
			<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Cargando...</p>
		</div>
	</div>
{:else if $session.data}
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
				<!-- Date Header -->
				<div class="mb-8">
					<h2 class="text-2xl font-black text-gray-900 uppercase">Viernes, 14 de Marzo</h2>
					<p class="text-gray-500">4 citas programadas para hoy</p>
				</div>

				<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
					<!-- Today's Timeline -->
					<div class="lg:col-span-2 space-y-6">
						<h3 class="text-lg font-black text-gray-900 uppercase flex items-center gap-2">
							<Clock size={20} class="text-primary" />
							Citas de Hoy
						</h3>

						<div class="space-y-4">
							{#each todayBookings as booking}
								<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
									<div class="flex items-start gap-6">
										<!-- Time -->
										<div class="w-20 text-center">
											<p class="text-2xl font-black text-gray-900">{booking.time}</p>
											<p class="text-xs text-gray-400">{booking.duration} min</p>
										</div>

										<!-- Content -->
										<div class="flex-1">
											<div class="flex items-start justify-between mb-2">
												<div>
													<h4 class="text-lg font-black text-gray-900">{booking.client}</h4>
													<p class="text-gray-500">{booking.service}</p>
												</div>
												<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest {getStatusColor(booking.status)}">
													{getStatusLabel(booking.status)}
												</span>
											</div>
											
											{#if booking.notes}
												<p class="text-sm text-gray-400 bg-gray-50 rounded-xl p-3 mt-3">
													{booking.notes}
												</p>
											{/if}

											<!-- Actions -->
											<div class="flex items-center gap-3 mt-4">
												{#if booking.status === 'pending'}
													<button class="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-primary/90 transition-colors">
														<Check size={16} />
														Iniciar
													</button>
													<button class="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-600 rounded-xl text-sm font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
														<X size={16} />
														Cancelar
													</button>
												{:else if booking.status === 'in-progress'}
													<button class="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white rounded-xl text-sm font-black uppercase tracking-widest hover:bg-emerald-600 transition-colors">
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
					</div>

					<!-- Sidebar - Upcoming -->
					<div class="space-y-6">
						<h3 class="text-lg font-black text-gray-900 uppercase flex items-center gap-2">
							<Calendar size={20} class="text-primary" />
							Próximas Citas
						</h3>

						<div class="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4">
							{#each upcomingBookings as booking}
								<div class="p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
									<div class="flex items-center justify-between mb-2">
										<span class="text-sm font-black text-gray-900">{booking.date}</span>
										<span class="text-sm font-medium text-gray-500">{booking.time}</span>
									</div>
									<p class="font-black text-gray-700">{booking.client}</p>
									<p class="text-sm text-gray-500">{booking.service}</p>
								</div>
							{/each}
						</div>

						<!-- Quick Stats -->
						<div class="bg-linear-to-br from-primary to-primary/80 rounded-3xl p-6 text-white">
							<h4 class="text-[10px] font-black uppercase tracking-widest opacity-80 mb-4">Resumen del Día</h4>
							<div class="grid grid-cols-2 gap-4">
								<div>
									<p class="text-3xl font-black">4</p>
									<p class="text-xs opacity-80">Citas</p>
								</div>
								<div>
									<p class="text-3xl font-black">4.5h</p>
									<p class="text-xs opacity-80">Trabajo</p>
								</div>
								<div>
									<p class="text-3xl font-black">$295k</p>
									<p class="text-xs opacity-80">Ingresos</p>
								</div>
								<div>
									<p class="text-3xl font-black">3</p>
									<p class="text-xs opacity-80">Clientes</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
{:else}
	<div class="min-h-screen flex items-center justify-center bg-gray-50">
		<div class="text-center">
			<Shield size={48} class="mx-auto mb-4 text-gray-300" />
			<p class="text-gray-500">No tienes acceso a este panel</p>
			<a href="/login" class="text-primary font-black">Iniciar sesión</a>
		</div>
	</div>
{/if}
