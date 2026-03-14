<script lang="ts">
	import { 
		Users, 
		Scissors, 
		Calendar, 
		DollarSign, 
		TrendingUp, 
		TrendingDown,
		ArrowUpRight,
		ArrowDownRight
	} from 'lucide-svelte';

	// Mock data - en producción vendría de la API
	const stats = [
		{ 
			label: 'Usuarios Totales', 
			value: '1,234', 
			change: '+12%', 
			trend: 'up',
			icon: Users,
			color: 'bg-blue-50 text-blue-500'
		},
		{ 
			label: 'Servicios Activos', 
			value: '48', 
			change: '+3', 
			trend: 'up',
			icon: Scissors,
			color: 'bg-purple-50 text-purple-500'
		},
		{ 
			label: 'Citas Este Mes', 
			value: '156', 
			change: '+8%', 
			trend: 'up',
			icon: Calendar,
			color: 'bg-amber-50 text-amber-500'
		},
		{ 
			label: 'Ingresos del Mes', 
			value: '$12,450', 
			change: '+23%', 
			trend: 'up',
			icon: DollarSign,
			color: 'bg-emerald-50 text-emerald-500'
		},
	];

	const recentBookings = [
		{ 
			client: 'María González', 
			service: 'Masaje Relajante', 
			date: '14 Mar 2026', 
			time: '10:00 AM',
			status: 'confirmed'
		},
		{ 
			client: 'Carlos Ruiz', 
			service: 'Tratamiento Facial', 
			date: '14 Mar 2026', 
			time: '2:00 PM',
			status: 'pending'
		},
		{ 
			client: 'Ana Martínez', 
			service: 'Aromaterapia', 
			date: '15 Mar 2026', 
			time: '11:00 AM',
			status: 'confirmed'
		},
		{ 
			client: 'Luis Fernando', 
			service: 'Masaje Deportivo', 
			date: '15 Mar 2026', 
			time: '4:00 PM',
			status: 'pending'
		},
	];

	const topServices = [
		{ name: 'Masaje Relajante', bookings: 45, revenue: '$4,500' },
		{ name: 'Tratamiento Facial', bookings: 32, revenue: '$3,200' },
		{ name: 'Aromaterapia', bookings: 28, revenue: '$2,800' },
		{ name: 'Masaje Deportivo', bookings: 21, revenue: '$2,100' },
	];

	function getStatusColor(status: string) {
		switch(status) {
			case 'confirmed': return 'bg-emerald-50 text-emerald-600';
			case 'pending': return 'bg-amber-50 text-amber-600';
			case 'cancelled': return 'bg-rose-50 text-rose-600';
			default: return 'bg-gray-50 text-gray-600';
		}
	}
</script>

<div class="space-y-8">
	<!-- Header -->
	<div class="flex items-center justify-between">
		<div>
			<h1 class="text-3xl font-black text-gray-900 tracking-tight uppercase">Dashboard</h1>
			<p class="text-gray-500 font-medium mt-1">Bienvenido al panel de administración</p>
		</div>
		<div class="flex items-center gap-4">
			<span class="text-[10px] font-black uppercase tracking-widest text-gray-400">Última actualización: Ahora</span>
		</div>
	</div>

	<!-- Stats Grid -->
	<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
		{#each stats as stat}
			<div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
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
				<p class="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">{stat.label}</p>
				<p class="text-3xl font-black text-gray-900 tracking-tighter">{stat.value}</p>
			</div>
		{/each}
	</div>

	<!-- Content Grid -->
	<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
		<!-- Recent Bookings -->
		<div class="lg:col-span-2 bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
			<div class="flex items-center justify-between mb-8">
				<h2 class="text-xl font-black text-gray-900 uppercase">Próximas Citas</h2>
				<a href="/admin/citas" class="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver todas</a>
			</div>
			
			<div class="space-y-4">
				{#each recentBookings as booking}
					<div class="flex items-center justify-between p-6 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
						<div class="flex items-center gap-4">
							<div class="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black">
								{booking.client.charAt(0)}
							</div>
							<div>
								<p class="font-black text-gray-900">{booking.client}</p>
								<p class="text-sm text-gray-500">{booking.service}</p>
							</div>
						</div>
						<div class="flex items-center gap-6">
							<div class="text-right">
								<p class="font-black text-gray-900">{booking.date}</p>
								<p class="text-sm text-gray-500">{booking.time}</p>
							</div>
							<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest {getStatusColor(booking.status)}">
								{booking.status === 'confirmed' ? 'Confirmada' : 'Pendiente'}
							</span>
						</div>
					</div>
				{/each}
			</div>
		</div>

		<!-- Top Services -->
		<div class="bg-white rounded-[32px] p-8 shadow-sm border border-gray-100">
			<div class="flex items-center justify-between mb-8">
				<h2 class="text-xl font-black text-gray-900 uppercase">Servicios Populares</h2>
				<a href="/admin/servicios" class="text-[10px] font-black uppercase tracking-widest text-primary hover:underline">Ver todos</a>
			</div>
			
			<div class="space-y-4">
				{#each topServices as service, i}
					<div class="flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-colors">
						<span class="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-black">{i + 1}</span>
						<div class="flex-1">
							<p class="font-black text-gray-900">{service.name}</p>
							<p class="text-sm text-gray-500">{service.bookings} reservas</p>
						</div>
						<p class="text-primary font-black">{service.revenue}</p>
					</div>
				{/each}
			</div>
		</div>
	</div>
</div>
