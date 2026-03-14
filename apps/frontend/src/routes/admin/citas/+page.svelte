<script lang="ts">
	import { Search, Filter, Calendar as CalendarIcon, Clock, User, Scissors, Check, X, MoreVertical } from 'lucide-svelte';

	// Mock bookings data
	let bookings = [
		{ 
			id: '1', 
			client: 'María González',
			clientEmail: 'maria@email.com',
			clientPhone: '+57 300 123 4567',
			service: 'Masaje Relajante',
			employee: 'Ana Martínez',
			date: '2026-03-14',
			time: '10:00',
			duration: 60,
			price: 85000,
			status: 'confirmed',
			notes: ''
		},
		{ 
			id: '2', 
			client: 'Carlos Ruiz',
			clientEmail: 'carlos@email.com',
			clientPhone: '+57 301 234 5678',
			service: 'Tratamiento Facial',
			employee: 'Ana Martínez',
			date: '2026-03-14',
			time: '14:00',
			duration: 45,
			price: 95000,
			status: 'pending',
			notes: 'Primera vez, necesita valoración'
		},
		{ 
			id: '3', 
			client: 'Ana López',
			clientEmail: 'ana@email.com',
			clientPhone: '+57 302 345 6789',
			service: 'Aromaterapia',
			employee: 'Sofia Pérez',
			date: '2026-03-15',
			time: '11:00',
			duration: 90,
			price: 120000,
			status: 'confirmed',
			notes: 'Prefiere aceite de lavanda'
		},
		{ 
			id: '4', 
			client: 'Luis Fernando',
			clientEmail: 'luis@email.com',
			clientPhone: '+57 303 456 7890',
			service: 'Masaje Deportivo',
			employee: 'Carlos Díaz',
			date: '2026-03-15',
			time: '16:00',
			duration: 75,
			price: 110000,
			status: 'pending',
			notes: ''
		},
		{ 
			id: '5', 
			client: 'Sofia Martín',
			clientEmail: 'sofia.m@email.com',
			clientPhone: '+57 304 567 8901',
			service: 'Masaje Relajante',
			employee: 'Ana Martínez',
			date: '2026-03-13',
			time: '09:00',
			duration: 60,
			price: 85000,
			status: 'completed',
			notes: 'Cliente frecuente'
		},
		{ 
			id: '6', 
			client: 'Jorge Wilson',
			clientEmail: 'jorge@email.com',
			clientPhone: '+57 305 678 9012',
			service: 'Tratamiento Facial',
			employee: 'Sofia Pérez',
			date: '2026-03-13',
			time: '15:00',
			duration: 45,
			price: 95000,
			status: 'cancelled',
			notes: 'Canceló por enfermedad'
		},
	];

	let searchQuery = '';
	let statusFilter = 'all';
	let dateFilter = '';

	$: filteredBookings = bookings.filter(booking => {
		const matchesSearch = booking.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
							  booking.service.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
		const matchesDate = !dateFilter || booking.date === dateFilter;
		return matchesSearch && matchesStatus && matchesDate;
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

	function formatPrice(price: number) {
		return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(price);
	}

	function confirmBooking(id: string) {
		bookings = bookings.map(b => b.id === id ? { ...b, status: 'confirmed' } : b);
	}

	function cancelBooking(id: string) {
		bookings = bookings.map(b => b.id === id ? { ...b, status: 'cancelled' } : b);
	}
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Citas</h1>
			<p class="text-gray-500 font-medium mt-1">Gestiona todas las reservas del spa</p>
		</div>
		<div class="flex items-center gap-4">
			<button class="flex items-center gap-3 px-6 py-4 bg-white border border-gray-200 text-gray-700 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 transition-colors">
				<CalendarIcon size={18} />
				Ver Calendario
			</button>
		</div>
	</div>

	<!-- Stats -->
	<div class="grid grid-cols-1 md:grid-cols-4 gap-4">
		<div class="bg-white rounded-2xl p-6 border border-gray-100">
			<p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">Total Citas</p>
			<p class="text-3xl font-black text-gray-900">{bookings.length}</p>
		</div>
		<div class="bg-emerald-50 rounded-2xl p-6 border border-emerald-100">
			<p class="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-2">Confirmadas</p>
			<p class="text-3xl font-black text-emerald-700">{bookings.filter(b => b.status === 'confirmed').length}</p>
		</div>
		<div class="bg-amber-50 rounded-2xl p-6 border border-amber-100">
			<p class="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-2">Pendientes</p>
			<p class="text-3xl font-black text-amber-700">{bookings.filter(b => b.status === 'pending').length}</p>
		</div>
		<div class="bg-blue-50 rounded-2xl p-6 border border-blue-100">
			<p class="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2">Completadas</p>
			<p class="text-3xl font-black text-blue-700">{bookings.filter(b => b.status === 'completed').length}</p>
		</div>
	</div>

	<!-- Filters -->
	<div class="flex items-center gap-4 flex-wrap">
		<div class="flex-1 min-w-[300px] relative">
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
	<div class="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
		<table class="w-full">
			<thead class="bg-gray-50 border-b border-gray-100">
				<tr>
					<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Cliente</th>
					<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Servicio</th>
					<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Empleado</th>
					<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Fecha y Hora</th>
					<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Estado</th>
					<th class="text-left px-6 py-5 text-[10px] font-black uppercase tracking-widest text-gray-400">Precio</th>
					<th class="px-6 py-5"></th>
				</tr>
			</thead>
			<tbody class="divide-y divide-gray-50">
				{#each filteredBookings as booking}
					<tr class="hover:bg-gray-50 transition-colors">
						<td class="px-6 py-5">
							<div>
								<p class="font-black text-gray-900">{booking.client}</p>
								<p class="text-sm text-gray-500">{booking.clientPhone}</p>
							</div>
						</td>
						<td class="px-6 py-5">
							<p class="font-medium text-gray-900">{booking.service}</p>
							<p class="text-sm text-gray-500">{booking.duration} min</p>
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-3">
								<img 
									src={`https://ui-avatars.com/api/?name=${booking.employee}`}
									alt={booking.employee}
									class="w-8 h-8 rounded-full"
								/>
								<span class="font-medium text-gray-900">{booking.employee}</span>
							</div>
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-2 text-gray-600">
								<CalendarIcon size={16} />
								<span class="font-medium">{booking.date}</span>
							</div>
							<div class="flex items-center gap-2 text-gray-500 mt-1">
								<Clock size={14} />
								<span class="text-sm">{booking.time}</span>
							</div>
						</td>
						<td class="px-6 py-5">
							<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border {getStatusColor(booking.status)}">
								{getStatusLabel(booking.status)}
							</span>
						</td>
						<td class="px-6 py-5">
							<p class="font-black text-gray-900">{formatPrice(booking.price)}</p>
						</td>
						<td class="px-6 py-5">
							<div class="flex items-center gap-2">
								{#if booking.status === 'pending'}
									<button 
										onclick={() => confirmBooking(booking.id)}
										class="p-2 text-emerald-500 hover:bg-emerald-50 rounded-xl transition-colors" 
										title="Confirmar"
									>
										<Check size={18} />
									</button>
									<button 
										onclick={() => cancelBooking(booking.id)}
										class="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors" 
										title="Cancelar"
									>
										<X size={18} />
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

		{#if filteredBookings.length === 0}
			<div class="py-20 text-center">
				<p class="text-gray-400 font-medium">No se encontraron reservas</p>
			</div>
		{/if}
	</div>
</div>
