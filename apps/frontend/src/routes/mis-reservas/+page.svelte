<script lang="ts">
	import { authClient } from '$lib/auth-client';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { Calendar, Clock, MapPin, Check, X, AlertCircle } from 'lucide-svelte';

	const session = authClient.useSession();

	// Redirect if not authenticated
	$effect(() => {
		if (browser && !$session.isPending && !$session.data) {
			goto('/login');
		}
	});

	// Mock bookings for the user
	const myBookings = [
		{ 
			id: '1', 
			service: 'Masaje Relajante',
			date: '14 Mar 2026',
			time: '10:00 AM',
			duration: 60,
			price: '$85,000',
			location: 'Sede El Poblado',
			status: 'confirmed',
			therapist: 'Ana Martínez'
		},
		{ 
			id: '2', 
			service: 'Tratamiento Facial',
			date: '20 Mar 2026',
			time: '2:00 PM',
			duration: 45,
			price: '$95,000',
			location: 'Sede El Poblado',
			status: 'pending',
			therapist: 'Sofia Pérez'
		},
		{ 
			id: '3', 
			service: 'Aromaterapia',
			date: '10 Feb 2026',
			time: '11:00 AM',
			duration: 90,
			price: '$120,000',
			location: 'Sede El Poblado',
			status: 'completed',
			therapist: 'Carlos Díaz'
		},
	];

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
</script>

<svelte:head>
	<title>Mis Reservas | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-gray-50/50 pt-32 pb-20 px-6">
	{#if $session.isPending}
		<div class="max-w-4xl mx-auto flex flex-col items-center justify-center py-20">
			<div class="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
			<p class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400 mt-4">Cargando...</p>
		</div>
	{:else if $session.data}
		<div class="max-w-4xl mx-auto">
			<!-- Header -->
			<div class="mb-12">
				<h1 class="text-4xl font-black text-gray-900 uppercase tracking-tighter">Mis <span class="text-primary">Reservas</span></h1>
				<p class="text-gray-500 mt-2">Gestiona tus citas programadas</p>
			</div>

			<!-- Bookings List -->
			<div class="space-y-6">
				{#each myBookings as booking}
					<div class="bg-white rounded-[48px] p-8 shadow-sm border border-gray-100">
						<div class="flex flex-col md:flex-row md:items-center gap-6">
							<!-- Date Box -->
							<div class="w-24 h-24 bg-primary/5 rounded-3xl flex flex-col items-center justify-center">
								<span class="text-[10px] font-black uppercase text-primary">{booking.date.split(' ')[1]}</span>
								<span class="text-3xl font-black text-primary">{booking.date.split(' ')[0]}</span>
								<span class="text-[10px] font-black uppercase text-primary/60">{booking.date.split(' ')[2]}</span>
							</div>

							<!-- Info -->
							<div class="flex-1">
								<div class="flex items-start justify-between mb-4">
									<div>
										<h3 class="text-xl font-black text-gray-900 uppercase">{booking.service}</h3>
										<p class="text-gray-500">con {booking.therapist}</p>
									</div>
									<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border {getStatusColor(booking.status)}">
										{getStatusLabel(booking.status)}
									</span>
								</div>

								<div class="flex flex-wrap items-center gap-6 text-sm text-gray-500">
									<div class="flex items-center gap-2">
										<Clock size={16} />
										{booking.time} ({booking.duration} min)
									</div>
									<div class="flex items-center gap-2">
										<MapPin size={16} />
										{booking.location}
									</div>
									<div class="font-black text-gray-900">{booking.price}</div>
								</div>
							</div>

							<!-- Actions -->
							<div class="flex gap-3">
								{#if booking.status === 'pending'}
									<button class="flex-1 px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors">
										Confirmar
									</button>
									<button class="px-6 py-3 border border-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
										Cancelar
									</button>
								{:else if booking.status === 'confirmed'}
									<button class="px-6 py-3 border border-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
										Reprogramar
									</button>
								{:else if booking.status === 'completed'}
									<a href="/servicios/{booking.id}" class="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors">
										Reservar Again
									</a>
								{/if}
							</div>
						</div>
					</div>
				{/each}
			</div>

			{#if myBookings.length === 0}
				<div class="bg-white rounded-[48px] p-12 text-center shadow-sm border border-gray-100">
					<Calendar size={48} class="mx-auto mb-4 text-gray-300" />
					<p class="text-gray-500 font-medium">No tienes reservas programadas</p>
					<a href="/servicios" class="inline-block mt-4 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors">
						Ver Servicios
					</a>
				</div>
			{/if}
		</div>
	{/if}
</div>
