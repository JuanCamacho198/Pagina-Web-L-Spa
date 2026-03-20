<script lang="ts">
	import { authClient, apiClient } from '$lib/auth-client';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getLocalizedPath } from '$lib/i18n/utils';
	import { Calendar, Clock, MapPin, Check, X, AlertCircle, RefreshCw } from 'lucide-svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import type { Appointment } from '@l-spa/shared-types';

	const session = authClient.useSession();
	let currentLang = $derived($page.params.lang || 'es');

	const userId = $derived($session.data?.user?.id || '');

	const appointmentsQuery = createQuery(() => ({
		queryKey: ['user-appointments', userId],
		queryFn: () => apiClient.getUserAppointments(userId),
		enabled: !!userId,
		staleTime: 1000 * 60,
	}));

	let appointments = $derived($appointmentsQuery.data || []);

	function formatDate(dateStr: string) {
		const date = new Date(dateStr);
		return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
	}

	function formatPrice(price: number | undefined) {
		if (!price) return '';
		return '$' + price.toLocaleString('es-CO');
	}

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
			<div class="mb-12">
				<h1 class="text-4xl font-black text-gray-900 uppercase tracking-tighter">Mis <span class="text-primary">Reservas</span></h1>
				<p class="text-gray-500 mt-2">Gestiona tus citas programadas</p>
			</div>

			{#if $appointmentsQuery.isLoading}
				<div class="space-y-6">
					{#each [1, 2, 3] as _}
						<div class="bg-white rounded-spa-xl p-8 shadow-sm border border-gray-100 animate-pulse">
							<div class="flex flex-col md:flex-row md:items-center gap-6">
								<div class="w-24 h-24 bg-gray-200 rounded-3xl"></div>
								<div class="flex-1 space-y-4">
									<div class="h-6 bg-gray-200 rounded w-1/3"></div>
									<div class="h-4 bg-gray-200 rounded w-1/4"></div>
									<div class="flex gap-4">
										<div class="h-4 bg-gray-200 rounded w-24"></div>
										<div class="h-4 bg-gray-200 rounded w-32"></div>
									</div>
								</div>
							</div>
						</div>
					{/each}
				</div>
			{:else if $appointmentsQuery.isError}
				<div class="bg-rose-50 border border-rose-200 rounded-spa-xl p-12 text-center">
					<AlertCircle size={48} class="mx-auto mb-4 text-rose-400" />
					<p class="text-rose-600 font-black mb-6">Error al cargar tus reservas</p>
					<button 
						onclick={() => $appointmentsQuery.refetch()}
						class="inline-flex items-center gap-2 px-8 py-4 bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-colors"
					>
						<RefreshCw size={16} />
						Reintentar
					</button>
				</div>
			{:else if appointments.length === 0}
				<div class="bg-white rounded-spa-xl p-12 text-center shadow-sm border border-gray-100">
					<Calendar size={48} class="mx-auto mb-4 text-gray-300" />
					<p class="text-gray-500 font-medium">No tienes reservas programadas</p>
					<a href={getLocalizedPath('/servicios', currentLang)} class="inline-block mt-4 px-8 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors">
						Ver Servicios
					</a>
				</div>
			{:else}
				<div class="space-y-6">
					{#each appointments as appointment}
						{@const dateParts = formatDate(appointment.appointmentDate).split(' ')}
						<div class="bg-white rounded-spa-xl p-8 shadow-sm border border-gray-100">
							<div class="flex flex-col md:flex-row md:items-center gap-6">
								<div class="w-24 h-24 bg-primary/5 rounded-3xl flex flex-col items-center justify-center">
									<span class="text-[10px] font-black uppercase text-primary">{dateParts[1]}</span>
									<span class="text-3xl font-black text-primary">{dateParts[0]}</span>
									<span class="text-[10px] font-black uppercase text-primary/60">{dateParts[2]}</span>
								</div>

								<div class="flex-1">
									<div class="flex items-start justify-between mb-4">
										<div>
											<h3 class="text-xl font-black text-gray-900 uppercase">{appointment.serviceName || 'Servicio'}</h3>
											{#if appointment.userName}
												<p class="text-gray-500">con {appointment.userName}</p>
											{/if}
										</div>
										<span class="px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border {getStatusColor(appointment.status)}">
											{getStatusLabel(appointment.status)}
										</span>
									</div>

									<div class="flex flex-wrap items-center gap-6 text-sm text-gray-500">
										<div class="flex items-center gap-2">
											<Clock size={16} />
											{appointment.appointmentTime} ({appointment.serviceDuration || 60} min)
										</div>
										<div class="font-black text-gray-900">{formatPrice(appointment.servicePrice)}</div>
									</div>
								</div>

								<div class="flex gap-3">
									{#if appointment.status === 'pending'}
										<button class="px-6 py-3 border border-gray-200 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors">
											Cancelar
										</button>
									{:else if appointment.status === 'completed'}
										<a href={getLocalizedPath('/servicios', currentLang)} class="px-6 py-3 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/90 transition-colors">
											Reservar de nuevo
										</a>
									{/if}
								</div>
							</div>
						</div>
					{/each}
				</div>
			{/if}
		</div>
	{/if}
</div>
