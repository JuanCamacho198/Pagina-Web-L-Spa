<script lang="ts">
	import { CalendarX, Receipt, CreditCard, Clock, RotateCcw, AlertTriangle, ShieldCheck, ChevronRight, Info } from 'lucide-svelte';

	const sections = [
		{
			icon: Receipt,
			title: "Facturación Electrónica",
			content: "Al adquirir un servicio por cualquier canal (Web, WhatsApp o Presencial), debe indicarnos si la factura electrónica se emitirá a nombre del comprador o de un tercero. Por defecto, se emitirá a nombre del titular registrado en el canal de compra.",
			color: "bg-blue-50 text-blue-600"
		},
		{
			icon: CreditCard,
			title: "Pagos Protegidos",
			content: "Para pagos con tarjeta de crédito, solicitamos adjuntar su documento de identidad o pasaporte para validar la titularidad y garantizar la seguridad de su transacción.",
			color: "bg-emerald-50 text-emerald-600"
		},
		{
			icon: ShieldCheck,
			title: "Confirmación de Reserva",
			content: "La reserva se hace efectiva con el pago mínimo del 50% del valor total. En promociones 2x1 vigentes, se requiere el pago del 100% para confirmar el cupo.",
			color: "bg-primary/10 text-primary"
		},
		{
			icon: Clock,
			title: "Modificaciones y Tiempos",
			content: "Puede modificar su reserva libremente con anticipación de: 24h hábiles (Lunes a Viernes) o 48h (Sábados, Domingos y Festivos).",
			list: [
				"Cancelación < límite: Cargo del 30% del valor total.",
				"Cancelación 3h - 12h antes: Cargo del 40% del valor total.",
				"No asistencia (No Show): Pérdida total del valor pagado."
			],
			color: "bg-amber-50 text-amber-600"
		},
		{
			icon: RotateCcw,
			title: "Política de Devoluciones",
			content: "Para tarifas normales, devoluciones disponibles hasta 5 días después de la compra (cargo 15% administrativo).",
			highlight: "En promociones 2x1 no hay devoluciones en dinero, pero el saldo queda vigente por 6 meses en un bono virtual.",
			color: "bg-purple-50 text-purple-600"
		},
		{
			icon: CalendarX,
			title: "Derecho de Retracto",
			content: "El consumidor podrá ejercer su derecho de retracto en los términos legales (Ley 1480 de 2011), informando oportunamente por nuestros canales oficiales.",
			color: "bg-rose-50 text-rose-600"
		}
	];
</script>

<svelte:head>
	<title>Políticas de Reserva y Cancelación | L-SPA</title>
</svelte:head>

<div class="min-h-screen bg-white">
	<!-- Hero Header -->
	<header class="bg-gray-900 pt-40 pb-32 px-6 relative overflow-hidden">
		<!-- Decor -->
		<div class="absolute inset-0 opacity-10 pointer-events-none overflow-hidden">
			<div class="absolute top-0 right-0 w-150 h-150 bg-primary rounded-full blur-[120px] translate-x-1/2 -translate-y-1/2"></div>
			<div class="absolute bottom-0 left-0 w-100 h-100  bg-primary rounded-full blur-[100px] -translate-x-1/2 translate-y-1/2"></div>
		</div>

		<div class="max-w-7xl mx-auto relative z-10 flex flex-col md:flex-row items-end justify-between gap-12">
			<div class="space-y-8 flex-1 animate-in fade-in slide-in-from-left-12 duration-1000">
				<div class="inline-flex items-center gap-3 px-6 py-2 rounded-full border border-white/10 bg-white/5 text-primary-light text-[10px] font-black uppercase tracking-[0.4em]">
					<AlertTriangle size={14} />
					Normativa y Compromiso
				</div>
				<h1 class="text-6xl md:text-8xl font-black text-white tracking-tighter leading-[0.85] uppercase">
					Políticas de <br /> <span class="text-transparent bg-clip-text bg-linear-to-r from-primary-light via-white to-primary-light/60 italic">Reserva</span>
				</h1>
				<p class="text-xl text-gray-400 max-w-2xl font-medium leading-relaxed">
					Nuestra transparencia es la base de tu confianza. Lee atentamente nuestras normas de funcionamiento para garantizarte la mejor experiencia de lujo.
				</p>
			</div>
			
			<div class="hidden lg:block pb-4">
				<div class="w-48 h-48 rounded-full border border-white/10 flex items-center justify-center p-8 text-white/20 animate-pulse">
					<ShieldCheck size={120} strokeWidth={1} />
				</div>
			</div>
		</div>
	</header>

	<!-- Content Grid -->
	<main class="max-w-7xl mx-auto px-6 py-32">
		<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{#each sections as section, i}
				<div class="p-10 rounded-[48px] border border-gray-100 bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-700 group flex flex-col h-full animate-in fade-in slide-in-from-bottom-8" style="animation-delay: {i * 100}ms">
					<div class="flex items-start justify-between mb-10">
						<div class="w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg {section.color}">
							<section.icon size={32} strokeWidth={2.5} />
						</div>
						<span class="text-[10px] font-black text-gray-200 group-hover:text-primary transition-colors">0{i + 1}</span>
					</div>

					<h3 class="text-2xl font-black text-gray-900 mb-6 tracking-tight leading-none uppercase">{section.title}</h3>
					
					<p class="text-gray-500 font-medium leading-relaxed mb-6 flex-1">
						{section.content}
					</p>

					{#if section.list}
						<ul class="space-y-4 mb-6">
							{#each section.list as item}
								<li class="flex items-start gap-4 text-sm font-black text-gray-400 group-hover:text-gray-600 transition-colors">
									<div class="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0 group-hover:scale-125 transition-transform"></div>
									{item.toUpperCase()}
								</li>
							{/each}
						</ul>
					{/if}

					{#if section.highlight}
						<div class="mt-4 p-6 bg-primary/5 rounded-4xl border-l-4 border-primary italic text-[11px] font-black text-primary leading-tight flex gap-4 items-start">
							<Info size={16} class="shrink-0 mt-0.5" />
							{section.highlight.toUpperCase()}
						</div>
					{/if}
				</div>
			{/each}
		</div>

		<!-- Footer Disclaimer -->
		<div class="mt-32 max-w-3xl mx-auto bg-gray-50 p-12 rounded-[56px] border border-dashed border-gray-200 text-center space-y-6 group">
			<div class="flex justify-center">
				<div class="w-12 h-12 bg-white rounded-full shadow-sm flex items-center justify-center text-gray-300 group-hover:text-primary transition-colors">
					<ShieldCheck size={24} />
				</div>
			</div>
			<p class="text-gray-500 font-medium text-sm leading-relaxed max-w-xl mx-auto">
				Al reservar en <strong class="text-gray-900 font-black">L-SPA</strong>, el cliente acepta tácitamente todas las condiciones aquí expresadas. Estas políticas rigen para asegurar la sostenibilidad y calidad superior de nuestro servicio.
			</p>
			<div class="pt-4 flex justify-center gap-8 opacity-40 grayscale group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700">
				<!-- Mock payment icons or trust badges -->
				<ShieldCheck size={20} />
				<Lock size={20} />
				<RotateCcw size={20} />
			</div>
		</div>
	</main>
</div>

<style>
	:global(body) {
		background-image: radial-gradient(at 0% 100%, hsla(327, 67%, 33%, 0.02) 0, transparent 40%);
        background-attachment: fixed;
	}
</style>
