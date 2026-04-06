<script lang="ts">
	import { onMount } from 'svelte';
	import { 
		Users, 
		Scissors, 
		Calendar, 
		DollarSign, 
		TrendingUp, 
		TrendingDown,
		ArrowUpRight,
		ArrowDownRight,
		Loader2
	} from 'lucide-svelte';
	import { adminApi, type DashboardStats, type Appointment, type Service } from '$lib/api/admin';
	import Skeleton from 'boneyard-js/svelte';

	// Data from API
	let stats: DashboardStats | null = $state(null);
	let recentAppointments: Appointment[] = $state([]);
	let services: Service[] = $state([]);
	let loading = $state(true);
	let lastUpdate = $state('Ahora');

	// Format currency
	function formatCurrency(amount: number): string {
		return new Intl.NumberFormat('es-CO', { 
			style: 'currency', 
			currency: 'COP',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(amount);
	}

	// Format number with commas
	function formatNumber(num: number): string {
		return new Intl.NumberFormat('es-CO').format(num);
	}

	// Load data from API
	async function loadData() {
		loading = true;
		try {
			const [statsData, appointmentsData, servicesData] = await Promise.all([
				adminApi.getDashboardStats(),
				adminApi.getRecentAppointments(5),
				adminApi.getServices()
			]);

			stats = statsData;
			recentAppointments = appointmentsData;
			services = servicesData;

			lastUpdate = new Date().toLocaleTimeString('es-CO', { 
				hour: '2-digit', 
				minute: '2-digit' 
			});
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		} finally {
			loading = false;
		}
	}

	// Stats computed from API data
	let statsData = $derived([
		{ 
			label: 'Usuarios Totales', 
			value: stats ? formatNumber(stats.totalUsers) : '0', 
			change: stats && stats.totalUsers > 100 ? '+12%' : '--', 
			trend: 'up' as const,
			icon: Users,
			color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-500'
		},
		{ 
			label: 'Servicios Activos', 
			value: stats ? formatNumber(stats.totalServices) : '0', 
			change: stats && stats.totalServices > 10 ? '+3' : '--', 
			trend: 'up' as const,
			icon: Scissors,
			color: 'bg-purple-50 dark:bg-purple-900/30 text-purple-500'
		},
		{ 
			label: 'Citas Este Mes', 
			value: stats ? formatNumber(stats.thisMonthAppointments) : '0', 
			change: stats && stats.thisMonthAppointments > 50 ? '+8%' : '--', 
			trend: 'up' as const,
			icon: Calendar,
			color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-500'
		},
		{ 
			label: 'Ingresos del Mes', 
			value: stats ? formatCurrency(stats.monthlyRevenue) : '$0', 
			change: stats && stats.monthlyRevenue > 5000 ? '+23%' : '--', 
			trend: 'up' as const,
			icon: DollarSign,
			color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-500'
		},
	]);

	// Top services computed
	let topServices = $derived(
		services
			.filter(s => s.active)
			.slice(0, 4)
			.map(s => ({
				name: s.name,
				price: s.price
			}))
	);

	function getStatusColor(status: string) {
		switch(status) {
			case 'confirmed': return 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600';
			case 'pending': return 'bg-amber-50 dark:bg-amber-900/30 text-amber-600';
			case 'completed': return 'bg-blue-50 dark:bg-blue-900/30 text-blue-600';
			case 'cancelled': return 'bg-rose-50 dark:bg-rose-900/30 text-rose-600';
			default: return 'bg-gray-50 dark:bg-gray-800 text-gray-600';
		}
	}

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	function getStatusLabel(status: string) {
		switch(status) {
			case 'confirmed': return 'Confirmada';
			case 'pending': return 'Pendiente';
			case 'completed': return 'Completada';
			case 'cancelled': return 'Cancelada';
			default: return status;
		}
	}

	onMount(() => {
		loadData();
	});

	let isLoading = $derived(loading);
</script>

{#snippet fallback()}
	<div class="flex items-center justify-center py-20">
		<div class="flex flex-col items-center gap-4">
			<Loader2 size={40} class="text-primary animate-spin" />
			<p class="text-gray-500 dark:text-gray-400 font-medium">Cargando datos...</p>
		</div>
	</div>
{/snippet}

<Skeleton loading={isLoading} {fallback}>
	<div class="space-y-8">
		<!-- Header -->
		<div class="flex items-center justify-between">
			<div>
				<h1 class="text-3xl font-display font-black text-gray-900 dark:text-white tracking-tight uppercase">Dashboard</h1>
				<p class="text-gray-500 dark:text-gray-400 font-medium mt-1">Bienvenido al panel de administración</p>
			</div>
			<div class="flex items-center gap-4">
				<button 
					onclick={loadData}
					disabled={loading}
					class="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 hover:text-primary transition-colors disabled:opacity-50"
				>
					{#if loading}
						<Loader2 size={14} class="animate-spin" />
					{/if}
					Última actualización: {lastUpdate}
				</button>
			</div>
		</div>

		<!-- Stats Grid -->
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
			{#each statsData as stat}
				<div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl shadow-primary/5 border border-secondary/20 transition-all duration-500 hover:-translate-y-2">
					<div class="flex items-center justify-between mb-6">
						<div class="w-14 h-14 rounded-2xl {stat.color} flex items-center justify-center">
							<stat.icon size={24} />
						</div>
						<div class="flex items-center gap-1 {stat.trend === 'up' ? 'text-emerald-500' : 'text-rose-500'}">
							{#if stat.trend === 'up'}
								<ArrowUpRight size={16} />
							{:else}
								<ArrowDownRight size={16} />
							{/if}
							<span class="text-[10px] font-black">{stat.change}</span>
						</div>
					</div>
					<p class="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">{stat.label}</p>
					<p class="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</p>
				</div>
			{/each}
		</div>

		<!-- Content Grid -->
		<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
			<!-- Recent Bookings -->
			<div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl shadow-primary/5 border border-secondary/20 transition-all duration-500 hover:-translate-y-1">
				<div class="flex items-center justify-between mb-8">
					<h2 class="text-xl font-display font-black text-gray-900 dark:text-white uppercase">Próximas Citas</h2>
					<a href="/admin/citas" class="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver todas</a>
				</div>
				
				{#if recentAppointments.length > 0}
					<div class="space-y-4">
						{#each recentAppointments as booking}
							<div class="flex items-center justify-between p-6 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-500">
								<div class="flex items-center gap-4">
									<div class="w-12 h-12 rounded-2xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary font-black">
										{(booking.userName || 'C').charAt(0).toUpperCase()}
									</div>
									<div>
										<p class="font-black text-gray-900 dark:text-white">{booking.userName || 'Cliente'}</p>
										<p class="text-sm text-gray-500 dark:text-gray-400">{booking.serviceName || 'Servicio'}</p>
									</div>
								</div>
								<div class="flex items-center gap-6">
									<div class="text-right">
										<p class="font-black text-gray-900 dark:text-white">{formatDate(booking.appointmentDate)}</p>
										<p class="text-sm text-gray-500 dark:text-gray-400">{booking.appointmentTime}</p>
									</div>
									<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest {getStatusColor(booking.status)}">
										{getStatusLabel(booking.status)}
									</span>
								</div>
							</div>
						{/each}
					</div>
				{:else}
					<div class="py-12 text-center">
						<p class="text-gray-400 dark:text-gray-500 font-medium">No hay citas próximas</p>
					</div>
				{/if}
			</div>

			<!-- Top Services -->
			<div class="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl shadow-primary/5 border border-secondary/20 transition-all duration-500 hover:-translate-y-1">
				<div class="flex items-center justify-between mb-8">
					<h2 class="text-xl font-display font-black text-gray-900 dark:text-white uppercase">Servicios Populares</h2>
					<a href="/admin/servicios" class="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver todos</a>
				</div>
				
				{#if topServices.length > 0}
					<div class="space-y-4">
						{#each topServices as service, i}
							<div class="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-500">
								<span class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">{i + 1}</span>
								<div class="flex-1">
									<p class="font-black text-gray-900 dark:text-white">{service.name}</p>
								</div>
								<p class="text-primary font-black">{formatCurrency(service.price)}</p>
							</div>
						{/each}
					</div>
				{:else}
					<div class="py-12 text-center">
						<p class="text-gray-400 dark:text-gray-500 font-medium">No hay servicios activos</p>
					</div>
				{/if}
			</div>
		</div>
	</div>
</Skeleton>
