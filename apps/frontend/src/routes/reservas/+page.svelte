<script lang="ts">
	import { cn } from '$lib/utils/cn';
	import { 
		Calendar as CalendarIcon, 
		Clock, 
		Trash2, 
		AlertCircle, 
		CheckCircle2, 
		ChevronRight, 
		Loader2, 
		Plus, 
		History,
		Sparkles
	} from 'lucide-svelte';
	import Button from '$components/Button.svelte';
	import Typography from '$components/Typography.svelte';
	import Badge from '$components/Badge.svelte';
	import Modal from '$components/Modal.svelte';
	import { toast } from '$components/Toast.svelte';

	let { data } = $props();
	let appointments = $state(data.appointments || []);
	let isLoading = $state(false);
	let error = $state(data.error || '');
	
	let modalId = $state<string | null>(null);
	let cancelingId = $state<string | null>(null);

	const getAppointmentStatus = (cita: any) => {
		const now = new Date();
		const [year, month, day] = cita.appointmentDate.split('-').map(Number);
		const [hours, minutes] = (cita.appointmentTime || '00:00').split(':').map(val => parseInt(val));
		const appointmentDate = new Date(year, month - 1, day, hours, minutes);

		if (appointmentDate < now) {
			return { status: 'completada', label: 'Completada', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
		} else if (appointmentDate.toDateString() === now.toDateString()) {
			return { status: 'hoy', label: 'Para Hoy', color: 'bg-amber-50 text-amber-700 border-amber-100' };
		} else {
			return { status: 'programada', label: 'Próxima', color: 'bg-sky-50 text-sky-700 border-sky-100' };
		}
	};

	const handleCancel = async () => {
		if (!modalId) return;
		cancelingId = modalId;
		try {
			const res = await fetch(`http://localhost:3000/api/appointments/${modalId}`, {
				method: 'DELETE'
			});
			if (res.ok) {
				appointments = appointments.filter(a => a.id !== modalId);
				toast.success('Cita cancelada correctamente');
			} else {
				throw new Error();
			}
		} catch (e) {
			toast.error('No pudimos cancelar la cita');
		} finally {
			modalId = null;
			cancelingId = null;
		}
	};
</script>

<svelte:head>
	<title>Mis Reservas - L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-white/50 pb-24 pt-12">
	<div class="max-w-7xl mx-auto px-6 lg:px-8">
		<!-- Header -->
		<header class="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
			<div class="space-y-4">
				<div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/10">
					<CalendarIcon size={14} />
					Agenda Personal
				</div>
				<Typography variant="h1" class="text-gray-900 mb-0! font-black tracking-tighter sm:text-6xl leading-none">
					Mis Reservas
				</Typography>
				<p class="text-gray-500 font-medium text-lg max-w-xl">
					Administra tus momentos de relajación y cuidado personal en un solo lugar.
				</p>
			</div>
			
			<div class="flex items-center gap-6">
				<div class="bg-white p-6 rounded-4xl border border-gray-100 shadow-xl shadow-primary/5 flex items-center gap-5 transition-all hover:scale-105">
					<div class="w-14 h-14 bg-primary rounded-4xlxl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-primary/30">
						{appointments.length}
					</div>
					<div>
						<span class="block text-[10px] uppercase font-black text-gray-400 tracking-widest leading-none mb-1">Total</span>
						<span class="text-gray-900 font-bold text-lg">Sesiones</span>
					</div>
				</div>
				<Button href="/servicios" class="rounded-4xlxl px-8 py-5 font-black uppercase tracking-widest shadow-2xl shadow-primary/20">
					<Plus size={20} class="mr-2" />
					Nuevo
				</Button>
			</div>
		</header>

		{#if error}
			<div class="bg-white rounded-[40px] p-20 text-center shadow-2xl shadow-rose-100/50 border border-rose-50 max-w-2xl mx-auto animate-in fade-in zoom-in duration-500">
				<div class="w-24 h-24 bg-rose-50 rounded-4xl flex items-center justify-center mx-auto mb-8 text-rose-500">
					<AlertCircle size={48} />
				</div>
				<Typography variant="h2" class="text-gray-900 font-black mb-4 tracking-tight">¡Vaya! Tenemos un problema</Typography>
				<p class="text-gray-500 font-medium mb-12 text-lg leading-relaxed">{error}</p>
				<Button onclick={() => window.location.reload()} class="rounded-4xlxl px-10 py-5">Intentar de nuevo</Button>
			</div>
		{:else if appointments.length === 0}
			<div class="bg-white rounded-[40px] p-32 text-center shadow-2xl shadow-primary/5 border border-gray-100 animate-in fade-in zoom-in duration-700">
				<div class="w-32 h-32 bg-gray-50 rounded-[48px] flex items-center justify-center mx-auto mb-10 text-gray-200 group-hover:scale-110 transition-transform">
					<CalendarIcon size={64} />
				</div>
				<Typography variant="h2" class="text-gray-900 font-black mb-6 tracking-tight sm:text-4xl">No tienes citas programadas</Typography>
				<p class="text-gray-500 max-w-md mx-auto mb-12 text-lg font-medium leading-relaxed">
					Tómate un descanso. Explora nuestras experiencias exclusivas y reserva tu próximo momento de paz.
				</p>
				<Button href="/servicios" class="rounded-4xlxl px-12 py-6 text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/30">
					Explorar Servicios
				</Button>
			</div>
		{:else}
			<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12 animate-in fade-in duration-700">
				{#each appointments as cita (cita.id)}
					{@const status = getAppointmentStatus(cita)}
					<div class="bg-white rounded-[40px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col group self-start hover:-translate-y-2">
						<div class="p-10 grow">
							<div class="flex justify-between items-start mb-8">
								<Badge class={cn("rounded-4xlxl px-4 py-2 font-black uppercase tracking-widest text-[10px] border-none shadow-sm", status.color)}>
									{status.label}
								</Badge>
								{#if status.status === 'completada'}
									<div class="h-10 w-10 flex items-center justify-center rounded-4xlxl bg-emerald-50 text-emerald-500">
										<CheckCircle2 size={24} />
									</div>
								{:else if status.status === 'hoy'}
									<div class="h-10 w-10 flex items-center justify-center rounded-4xlxl bg-amber-50 text-amber-500 animate-pulse">
										<Sparkles size={24} />
									</div>
								{/if}
							</div>
							
							<h3 class="text-2xl font-black text-gray-900 mb-8 group-hover:text-primary transition-colors line-clamp-2 leading-tight tracking-tight">
								{cita.serviceName || 'Servicio Premium'}
							</h3>
							
							<div class="space-y-6">
								<div class="flex items-center gap-5">
									<div class="w-12 h-12 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
										<CalendarIcon size={22} />
									</div>
									<div>
										<p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Fecha</p>
										<p class="text-base font-black text-gray-800 leading-none">{cita.appointmentDate}</p>
									</div>
								</div>
								
								<div class="flex items-center gap-5">
									<div class="w-12 h-12 bg-gray-50 rounded-[20px] flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
										<Clock size={22} />
									</div>
									<div>
										<p class="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Hora</p>
										<p class="text-base font-black text-gray-800 leading-none">{cita.appointmentTime || '--:--'}</p>
									</div>
								</div>
							</div>
						</div>

						<div class="px-10 py-6 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
							{#if status.status !== 'completada'}
								<button 
									onclick={() => (modalId = cita.id)}
									disabled={cancelingId === cita.id}
									class="text-gray-400 hover:text-rose-500 text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all active:scale-95 disabled:opacity-50"
								>
									{#if cancelingId === cita.id}
										<Loader2 size={16} class="animate-spin" />
									{:else}
										<Trash2 size={16} />
									{/if}
									Cancelar
								</button>
							{:else}
								<span class="text-gray-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 italic">
									<History size={14} /> Finalizada
								</span>
							{/if}
							
							<a 
								href="/servicios"
								class="h-10 w-10 flex items-center justify-center rounded-4xlxl bg-white border border-gray-100 text-primary shadow-sm hover:scale-110 active:scale-90 transition-all"
							>
								<ChevronRight size={22} strokeWidth={2.5} />
							</a>
						</div>
					</div>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Modal
	isOpen={modalId !== null}
	onClose={() => (modalId = null)}
	title="Cancelar Reserva"
	size="sm"
>
	<div class="text-center p-4">
		<div class="w-20 h-20 bg-rose-50 rounded-[28px] flex items-center justify-center mx-auto mb-6 text-rose-500">
			<Trash2 size={40} />
		</div>
		<Typography variant="h3" class="text-gray-900 font-black mb-3">¿Estás seguro?</Typography>
		<p class="text-gray-500 font-medium mb-8 leading-relaxed">
			Esta acción no se puede deshacer. Tu espacio reservado quedará disponible para otros clientes.
		</p>
	</div>
	{#snippet footer()}
		<Button variant="ghost" onclick={() => (modalId = null)} class="rounded-4xlxl font-black uppercase tracking-widest">No, mantener</Button>
		<Button onclick={handleCancel} isLoading={cancelingId !== null} class="rounded-4xlxl px-8 bg-rose-500 hover:bg-rose-600 shadow-rose-200 font-black uppercase tracking-widest">Sí, cancelar</Button>
	{/snippet}
</Modal>

<style>
	:global(body) {
		background-image: radial-gradient(at 0% 0%, hsla(327, 67%, 33%, 0.03) 0, transparent 50%),
			radial-gradient(at 100% 100%, hsla(327, 67%, 33%, 0.02) 0, transparent 50%);
		background-attachment: fixed;
	}
</style>
