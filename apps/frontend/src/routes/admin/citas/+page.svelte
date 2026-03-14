<script lang="ts">
	import { onMount } from 'svelte';
	import { Search, Calendar as CalendarIcon, Clock, Check, X, MoreVertical, Loader2 } from 'lucide-svelte';
	import { adminApi, type Appointment, type AppointmentStats } from '$lib/api/admin';

	// Data from API
	let appointments: Appointment[] = $state([]);
	let stats: AppointmentStats | null = $state(null);
	let loading = $state(true);
	let actionLoading = $state<string | null>(null);

	// Filters
	let searchQuery = $state('');
	let statusFilter = $state('all');
	let dateFilter = $state('');

	// Load data from API
	async function loadData() {
		loading = true;
		try {
			const [appointmentsData, statsData] = await Promise.all([
				adminApi.getAppointments(),
				adminApi.getAppointmentStats()
			]);
			appointments = appointmentsData;
			stats = statsData;
		} catch (error) {
			console.error('Error loading appointments:', error);
		} finally {
			loading = false;
		}
	}

	// Filtered appointments
	let filteredAppointments = $derived(
		appointments.filter(booking => {
			const searchLower = searchQuery.toLowerCase();
			const matchesSearch = !searchQuery || 
				(booking.userName || '').toLowerCase().includes(searchLower) ||
				(booking.userEmail || '').toLowerCase().includes(searchLower) ||
				(booking.serviceName || '').toLowerCase().includes(searchLower);
			const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
			const matchesDate = !dateFilter || booking.appointmentDate === dateFilter;
			return matchesSearch && matchesStatus && matchesDate;
		})
	);

	// Computed stats
	let statsData = $derived({
		total: stats?.total || 0,
		confirmed: stats?.confirmed || 0,
		pending: stats?.pending || 0,
		completed: stats?.completed || 0
	});

	function getStatusColor(status: string) {
		switch(status) {
			case 'confirmed': return 'bg-emerald-50 text-emerald-600 border-emerald-200';
			case 'pending': return 'bg-amber-50 text-amber-600 border-amber-200';
			case 'completed': return 'bg-blue-50 text-blue-600 border-blue-200';
			case 'cancelled': return 'bg-rose-50 text-rose-600 border-rose-200';
			default: return 'bg-gray-50 text-gray-600 border-gray-200';
		}
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

	function formatPrice(price: number | undefined) {
		if (!price) return '--';
		return new Intl.NumberFormat('es-CO', { 
			style: 'currency', 
			currency: 'COP',
			minimumFractionDigits: 0
		}).format(price);
	}

	async function confirmBooking(id: string) {
		actionLoading = id;
		try {
			const result = await adminApi.confirmAppointment(id);
			if (result) {
				appointments = appointments.map(b => 
					b.id === id ? { ...b, status: 'confirmed' } : b
				);
			}
		} catch (error) {
			console.error('Error confirming appointment:', error);
		} finally {
			actionLoading = null;
		}
	}

	async function cancelBooking(id: string) {
		actionLoading = id;
		try {
			const result = await adminApi.cancelAppointment(id);
			if (result) {
				appointments = appointments.map(b => 
					b.id === id ? { ...b, status: 'cancelled' } : b
				);
			}
		} catch (error) {
			console.error('Error cancelling appointment:', error);
		} finally {
			actionLoading = null;
		}
	}

	onMount(() => {
		loadData();
	});
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Citas</h1>
			<p class="text-gray-500 font-medium mt-1">Gestiona todas las reservas del spa</p>
		</div>
		<div class="flex items-center gap-4">
			<button 
				onclick={loadData}
				disabled={loading}
				class="flex items-center gap-2 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors disabled:opacity-50"
			>
				{#if loading}
					<Loader2 size={14} class="animate-spin" />
				{/if}
				Actualizar
			</button>
			<button class="flex items-center gap-3 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors">
				<CalendarIcon size={18} />
				Ver Calendario
			</button>
		</div>
	</div>

	{#if loading && !stats}
		<!-- Loading State -->
		<div class="flex items-center justify-center py-20">
			<div class="flex flex-col items-center gap-4">
				<Loader2 size={40} class="text-primary animate-spin" />
				<p class="text-gray-500 font-medium">Cargando citas...</p>
			</div>
		</div>
	{:else}
		<!-- Stats -->
		<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
			<div class="bg-white rounded-2xl p-6 border border-gray-100">
				<p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Citas</p>
				<p class="text-3xl font-black text-gray-900">{statsData.total}</p>
			</div>
			<div class="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
				<p class="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Confirmadas</p>
				<p class="text-3xl font-black text-emerald-700">{statsData.confirmed}</p>
			</div>
			<div class="bg-amber-50 rounded-2xl p-6 border border-amber-100">
				<p class="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Pendientes</p>
				<p class="text-3xl font-black text-amber-700">{statsData.pending}</p>
			</div>
			<div class="bg-blue-50 rounded-2xl p-6 border border-blue-100">
				<p class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Completadas</p>
				<p class="text-3xl font-black text-blue-700">{statsData.completed}</p>
			</div>
		</div>

		<!-- Filters -->
		<div class="flex items-center gap-4 flex-wrap">
			<div class="flex-1 min-w-75 relative">
				<Search size={18} class="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
				<input 
					type="text" 
					placeholder="Buscar por cliente o servicio..." 
					bind:value={searchQuery}
					class="w-full pl-14 pr-6 py-4 rounded-2xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
				/>
			</div>
			<select 
				bind:value={statusFilter}
				class="px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary outline-none font-medium bg-white"
			>
				<option value="all">Todos los estados</option>
				<option value="pending">Pendientes</option>
				<option value="confirmed">Confirmadas</option>
				<option value="completed">Completadas</option>
				<option value="cancelled">Canceladas</option>
			</select>
			<input 
				type="date" 
				bind:value={dateFilter}
				class="px-6 py-4 rounded-2xl border border-gray-200 focus:border-primary outline-none font-medium bg-white"
			/>
		</div>

		<!-- Bookings Table -->
		<div class="bg-white rounded-4xl shadow-sm border border-gray-100 overflow-hidden">
			<table class="w-full">
				<thead class="bg-gray-50 border-b border-gray-100">
					<tr>
						<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Cliente</th>
						<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Servicio</th>
						<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha y Hora</th>
						<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
						<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Precio</th>
						<th class="px-6 py-5"></th>
					</tr>
				</thead>
				<tbody class="divide-y divide-gray-50">
					{#each filteredAppointments as booking}
						<tr class="hover:bg-gray-50 transition-colors">
							<td class="px-6 py-5">
								<div>
									<p class="font-black text-gray-900">{booking.userName || 'Cliente'}</p>
									<p class="text-sm text-gray-500">{booking.userPhone || booking.userEmail || '--'}</p>
								</div>
							</td>
							<td class="px-6 py-5">
								<p class="font-medium text-gray-900">{booking.serviceName || 'Servicio'}</p>
								<p class="text-sm text-gray-500">{booking.serviceDuration || '--'} min</p>
							</td>
							<td class="px-6 py-5">
								<div class="flex items-center gap-2 text-gray-600">
									<CalendarIcon size={16} />
									<span class="font-medium">{booking.appointmentDate}</span>
								</div>
								<div class="flex items-center gap-2 text-gray-500 mt-1">
									<Clock size={14} />
									<span class="text-sm">{booking.appointmentTime}</span>
								</div>
							</td>
							<td class="px-6 py-5">
								<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border {getStatusColor(booking.status)}">
									{getStatusLabel(booking.status)}
								</span>
							</td>
							<td class="px-6 py-5">
								<p class="font-black text-gray-900">{formatPrice(booking.servicePrice)}</p>
							</td>
							<td class="px-6 py-5">
								<div class="flex items-center gap-2">
									{#if booking.status === 'pending'}
										<button 
											onclick={() => confirmBooking(booking.id)}
											disabled={actionLoading === booking.id}
											class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors disabled:opacity-50" 
											title="Confirmar"
										>
											{#if actionLoading === booking.id}
												<Loader2 size={18} class="animate-spin" />
											{:else}
												<Check size={18} />
											{/if}
										</button>
										<button 
											onclick={() => cancelBooking(booking.id)}
											disabled={actionLoading === booking.id}
											class="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors disabled:opacity-50" 
											title="Cancelar"
										>
											{#if actionLoading === booking.id}
												<Loader2 size={18} class="animate-spin" />
											{:else}
												<X size={18} />
											{/if}
										</button>
									{/if}
									<button class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors" title="Más opciones">
										<MoreVertical size={18} />
									</button>
								</div>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>

			{#if filteredAppointments.length === 0}
				<div class="py-20 text-center">
					<p class="text-gray-400 font-medium">No se encontraron reservas</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
