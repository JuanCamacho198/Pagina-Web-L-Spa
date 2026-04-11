<script lang="ts">
import { page as pageStore } from '$app/stores';
import { cn } from '$lib/utils/cn';
import Button from '$lib/components/ui/Button.svelte';
import Typography from '$lib/components/ui/Typography.svelte';
import Badge from '$lib/components/ui/Badge.svelte';
import OptimizedImage from '$lib/components/ui/OptimizedImage.svelte';
import ReviewSection from '$lib/components/services/ReviewSection.svelte';
import ServiceCard from '$lib/components/services/ServiceCard.svelte';
import Skeleton from 'boneyard-js/svelte';
import { toast } from '$lib/stores/toast.svelte';
import { cart } from '$lib/cart';
import { addToFavorites, checkIsFavorite, removeFromFavorites } from '$lib/favorites';
import { onMount } from 'svelte';
import { getLocalizedPath } from '$lib/i18n/utils';
  import { _ } from 'svelte-i18n';
  import Breadcrumb from '$lib/components/layout/Breadcrumb.svelte';
import { 
ShoppingCart, 
Clock,  
Sparkles, 
ChevronLeft, 
ShieldCheck, 
HandHelping,
Waves,
HeartPulse,
ArrowRight,
Heart,
Activity,
CheckCircle2,
AlertTriangle,
Target
} from 'lucide-svelte';

let { data } = $props();
let service = $derived(data.service);
let recommendations = $derived(data.recommendations || []);

let currentLang = $derived($pageStore.params.lang || 'es');

let isAddingToCart = $state(false);
let isFavorite = $state(false);

// Check if service is favorite on mount
onMount(async () => {
if (service?.id) {
isFavorite = await checkIsFavorite(service.id);
}
});

const handleAddToCart = async () => {
isAddingToCart = true;
try {
await cart.addItem({
serviceId: service.id,
slug: $pageStore.params.slug,
name: service.name,
price: Number(service.price),
image: service.imageUrl || service.image_url || ''
});
toast.success(`${service.name} añadido al santuario (carrito)`);
} catch (e) {
console.error('Error adding to cart:', e);
toast.error('No se pudo añadir al carrito');
} finally {
isAddingToCart = false;
}
};

const handleToggleFavorite = async () => {
if (!service?.id) return;

const newFavoriteState = !isFavorite;
isFavorite = newFavoriteState;

toast.success(newFavoriteState ? `${service.name} guardado en tus deseos` : `${service.name} eliminado de tus deseos`);

try {
if (newFavoriteState) {
await addToFavorites(service.id);
} else {
await removeFromFavorites(service.id);
}
} catch (e) {
console.error('Error toggling favorite:', e);
isFavorite = !newFavoriteState;
toast.error('Error al actualizar deseos');
}
};

// Helper function for lists stored as strings (comma or newline separated)
const parseList = (text: string | null | undefined) => {
if (!text) return [];
return text.split(/,|\n/).map(item => item.trim()).filter(item => item.length > 0);
};

let benefitsList = $derived(parseList(service.benefits));
let includesList = $derived(parseList(service.includes));
let idealForList = $derived(parseList(service.idealFor));
let contraindicationsList = $derived(parseList(service.contraindications));
let isLoading = $derived(!service?.id);
</script>

<svelte:head>
<title>{service.name} | Experiencia L-SPA</title>
<meta name="description" content={service.description} />
</svelte:head>

{#snippet fallback()}
<div class="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] transition-colors duration-1000 selection:bg-primary/20 selection:text-primary-dark pb-32">
<section class="max-w-7xl mx-auto pt-32 pb-16 px-6">
<div class="h-4 w-40 rounded bg-gray-200 dark:bg-white/10 animate-pulse mb-8"></div>
<div class="space-y-4 max-w-2xl">
<div class="h-4 w-32 rounded bg-gray-200 dark:bg-white/10 animate-pulse"></div>
<div class="h-16 w-full rounded bg-gray-200 dark:bg-white/10 animate-pulse"></div>
</div>
</section>
<section class="max-w-7xl mx-auto px-6 lg:px-12 mb-24 grid grid-cols-1 lg:grid-cols-12 gap-8">
<div class="lg:col-span-8 h-96 rounded-[40px] bg-gray-200 dark:bg-white/10 animate-pulse"></div>
<div class="lg:col-span-4 h-96 rounded-[40px] bg-gray-200 dark:bg-white/10 animate-pulse"></div>
</section>
</div>
{/snippet}

<Skeleton loading={isLoading} name="service-detail-page" {fallback}>
<div class="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] transition-colors duration-1000 selection:bg-primary/20 selection:text-primary-dark pb-32">
<!-- Hero Header Content -->
<div class="pt-32 pb-16 px-6 max-w-7xl mx-auto">
<Breadcrumb items={[
  { label: $_('breadcrumbs.home'), href: getLocalizedPath('/', currentLang) },
  { label: $_('breadcrumbs.servicios'), href: getLocalizedPath('/servicios', currentLang) },
  { label: service.name }
]} class="mb-12" />

<div class="space-y-6 max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-150">
<div class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gray-200 dark:border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-600 dark:text-gray-300 bg-white/50 dark:bg-white/5 backdrop-blur-sm">
{service.category || 'Bienestar Exclusivo'}
</div>

<h1 class="text-5xl md:text-7xl lg:text-[6rem] font-display leading-[0.95] text-gray-900 dark:text-white tracking-tight">
{service.name.split(' ')[0]} <br/> <span class="italic text-primary dark:text-primary-light font-light">{service.name.split(' ').slice(1).join(' ') || 'Exclusivo'}</span>
</h1>
</div>
</div>

<!-- Epic Visual & Action Box -->
<section class="max-w-350 mx-auto px-6 lg:px-12 mb-24">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

<!-- Visual Feature Left -->
<div class="lg:col-span-8 relative group rounded-[40px] overflow-hidden shadow-2xl dark:shadow-none animate-in fade-in zoom-in-95 duration-1000 delay-300">
<div class="aspect-4/3 w-full">
{#if service.imageUrl || service.image_url || service.imageFileName}
<OptimizedImage
src={service.imageUrl || service.image_url || ''}
cloudinaryId={service.cloudinaryId}
alt={service.name}
priority={true}
class="w-full h-full group-hover:scale-105 transition-transform duration-[3s] ease-out brightness-95 dark:brightness-80"
/>
{:else}
<div class="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center">
<Sparkles size={80} class="text-primary/20 dark:text-white/10 animate-pulse" />
</div>
{/if}

<!-- Inner Gradient -->
<div class="absolute inset-0 bg-linear-to-t from-gray-900/80 via-transparent to-transparent opacity-80"></div>

<div class="absolute bottom-10 left-10 text-white flex items-center gap-6">
<div class="w-16 h-16 rounded-full border border-white/30 backdrop-blur-md flex items-center justify-center shadow-xl">
<Clock size={28} class="text-white" strokeWidth={1.5} />
</div>
<div>
<p class="text-[10px] font-bold tracking-[0.3em] uppercase opacity-80">Duración</p>
<p class="text-3xl font-display">{service.duration || 60} <span class="text-xl italic">Min</span></p>
</div>
</div>
</div>
</div>

<!-- Booking Floating Panel -->
<div class="lg:col-span-4 bg-white dark:bg-[#121213] rounded-[40px] p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 dark:border-white/5 top-32 sticky animate-in fade-in slide-in-from-right duration-1000 delay-500">
<p class="text-gray-500 dark:text-gray-400 font-light text-lg mb-8 leading-relaxed">
{service.description || 'Una experiencia transformadora diseñada con protocolos globales para tu renovación absoluta.'}
</p>

<div class="flex items-end gap-3 mb-10 pb-10 border-b border-gray-100 dark:border-white/10">
<span class="text-5xl font-display text-gray-900 dark:text-white tracking-tight leading-none">
{Number(service.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
</span>
<span class="text-[10px] font-bold text-gray-400 dark:text-gray-600 uppercase tracking-[0.2em] mb-1">Inversión</span>
</div>

<div class="space-y-4">
<Button
	href={getLocalizedPath(`/checkout?serviceId=${service.id}`, currentLang)}
	class="w-full rounded-full bg-primary hover:bg-primary-dark text-white px-8 py-6 font-bold text-xs uppercase tracking-[0.3em] shadow-xl hover:shadow-primary/30 hover:-translate-y-1 transition-all h-auto cursor-pointer"
>
	Reservar Retiro
</Button>

<div class="grid grid-cols-2 gap-4">
<button
onclick={handleAddToCart}
disabled={isAddingToCart}
class="w-full rounded-full bg-gray-50 dark:bg-white/5 hover:bg-gray-100 dark:hover:bg-white/10 border border-gray-100 dark:border-white/5 py-4 font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 text-gray-600 dark:text-gray-300"
>
{#if isAddingToCart}
  <div class="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
{:else}
  <ShoppingCart size={16} />
{/if}
Añadir
</button>
<button
onclick={handleToggleFavorite}
class="w-full rounded-full py-4 font-bold text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 border {isFavorite ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-500' : 'bg-white border-gray-200 dark:border-white/20 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-white/40'}"
>
<Heart size={16} class={isFavorite ? 'fill-current' : ''} />
{isFavorite ? 'Guardado' : 'Deseo'}
</button>
</div>
</div>
</div>
</div>
</section>

<!-- The Details Anatomy -->
<section class="max-w-7xl mx-auto px-6 pt-10 pb-32">
<div class="text-center mb-16 space-y-4">
<h2 class="text-xs font-bold uppercase tracking-[0.4em] text-primary dark:text-primary-light">Anatomía de la Sesión</h2>
<div class="h-px w-24 bg-linear-to-r from-transparent via-primary/50 to-transparent mx-auto"></div>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-24">

<!-- Left Column: Includes & Benefits -->
<div class="space-y-16">
<!-- Inclusions -->
{#if includesList.length > 0}
<div>
<div class="flex items-center gap-4 mb-8">
<div class="w-12 h-12 rounded-full bg-primary/10 dark:bg-primary-dark/30 flex items-center justify-center text-primary dark:text-primary-light">
<Sparkles size={24} strokeWidth={1.5} />
</div>
<h3 class="text-3xl font-display text-gray-900 dark:text-white">¿Qué Incluye?</h3>
</div>
<ul class="space-y-4">
{#each includesList as item}
<li class="flex items-start gap-4 group">
<CheckCircle2 size={20} class="text-secondary dark:text-white/40 shrink-0 mt-1" strokeWidth={1.5} />
<span class="text-gray-600 dark:text-gray-300 font-light text-lg leading-relaxed group-hover:text-gray-900 dark:group-hover:text-white transition-colors">{item}</span>
</li>
{/each}
</ul>
</div>
{/if}

<!-- Benefits -->
{#if benefitsList.length > 0}
<div>
<div class="flex items-center gap-4 mb-8">
<div class="w-12 h-12 rounded-full bg-secondary/20 dark:bg-white/5 flex items-center justify-center text-secondary-dark dark:text-secondary-light">
<HeartPulse size={24} strokeWidth={1.5} />
</div>
<h3 class="text-3xl font-display text-gray-900 dark:text-white">Beneficios</h3>
</div>
<ul class="space-y-4">
{#each benefitsList as benefit}
<li class="flex items-start gap-4">
<div class="w-2 h-2 rounded-full bg-primary mt-2.5 shrink-0"></div>
<span class="text-gray-600 dark:text-gray-300 font-light text-lg leading-relaxed">{benefit}</span>
</li>
{/each}
</ul>
</div>
{/if}
</div>

<!-- Right Column: Ideal For, Intensity, Constraints -->
<div class="space-y-16">
<!-- Intensity & Ideal For -->
<div class="bg-white dark:bg-[#121213] rounded-[40px] p-10 lg:p-12 border border-gray-100 dark:border-white/5 shadow-xl shadow-primary/5 dark:shadow-none">

<div class="mb-12">
<h4 class="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3">
<Activity size={16} class="text-primary"/> Nivel de Intensidad
</h4>
<div class="flex gap-2">
{#each [1,2,3,4,5] as level}
<div class="h-3 flex-1 rounded-full {level <= (service.intensity || 3) ? 'bg-primary dark:bg-primary-light' : 'bg-gray-100 dark:bg-white/10'} transition-all duration-500"></div>
{/each}
</div>
<p class="text-xs font-light text-gray-500 dark:text-gray-400 mt-3 text-right">
{service.intensity === 1 ? 'Muy Suave' : service.intensity === 2 ? 'Relajante' : service.intensity === 3 ? 'Equilibrado' : service.intensity === 4 ? 'Profundo' : 'Terapéutico Intenso'}
</p>
</div>

{#if idealForList.length > 0}
<div>
<h4 class="text-[10px] font-bold uppercase tracking-[0.3em] text-gray-400 mb-6 flex items-center gap-3">
<Target size={16} class="text-secondary"/> Ideal Para
</h4>
<div class="flex flex-wrap gap-3">
{#each idealForList as target}
<span class="px-5 py-2 rounded-full bg-gray-50 dark:bg-white/5 text-gray-700 dark:text-gray-300 text-sm font-light border border-gray-100 dark:border-white/10">
{target}
</span>
{/each}
</div>
</div>
{/if}
</div>

<!-- Contraindications -->
{#if contraindicationsList.length > 0}
<div class="bg-rose-50/50 dark:bg-rose-950/10 rounded-[32px] p-10 border border-rose-100 dark:border-rose-900/30">
<div class="flex items-center gap-4 mb-6 text-rose-500 dark:text-rose-400">
<AlertTriangle size={24} strokeWidth={1.5} />
<h3 class="text-xl font-display">Contraindicaciones</h3>
</div>
<ul class="space-y-3">
{#each contraindicationsList as warning}
<li class="flex items-start gap-3 text-rose-900/70 dark:text-rose-200/70 font-light">
<span class="text-rose-400 mt-1.5">•</span> {warning}
</li>
{/each}
</ul>
<p class="mt-6 text-xs text-rose-800/50 dark:text-rose-300/40 italic">
* Si presentas alguna de estas condiciones, por favor consulta con nuestro equipo médico antes de reservar.
</p>
</div>
{/if}

</div>
</div>
</section>

<!-- Review Section (Untouched logic, styled container) -->
<section class="max-w-350 mx-auto mb-32 px-6 lg:px-12">
<div class="bg-white dark:bg-[#121213] rounded-[40px] p-8 lg:p-16 border border-gray-100 dark:border-white/5 shadow-2xl shadow-primary/5 dark:shadow-none min-h-100">
<div class="text-center mb-12">
<h2 class="text-4xl font-display text-gray-900 dark:text-white mb-4">Voces de <span class="italic text-primary dark:text-primary-light">Paz</span></h2>
<p class="text-gray-500 dark:text-gray-400 font-light">Experiencias reales de quienes han vivido este ritual.</p>
</div>
<!-- Logic remains exactly the same inside the component -->
<ReviewSection serviceId={service.id} />
</div>
</section>

<!-- Recommendations -->
{#if recommendations.length > 0}
<section class="max-w-7xl mx-auto px-6">
<div class="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
<div class="max-w-xl">
<div class="h-px w-24 bg-primary dark:bg-primary-light mb-8"></div>
<Typography variant="h2" class="text-gray-900 dark:text-white mb-4! font-display text-4xl sm:text-5xl leading-none">
Continúa tu <span class="italic font-light">Viaje</span>
</Typography>
<p class="text-gray-500 dark:text-gray-400 font-light">Otras experiencias exclusivas diseñadas para elevar tu bienestar.</p>
</div>
<Button variant="ghost" href={getLocalizedPath('/servicios', currentLang)} class="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-white group">
Ver Catálogo Completo
<ChevronLeft size={16} class="ml-2 rotate-180 transition-transform group-hover:translate-x-1" />
</Button>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-10">
{#each recommendations as recommended (recommended.id)}
<ServiceCard service={recommended} />
{/each}
</div>
</section>
{/if}
</div>
</Skeleton>

<style>
:global(body) {
background-attachment: fixed;
}
</style>
