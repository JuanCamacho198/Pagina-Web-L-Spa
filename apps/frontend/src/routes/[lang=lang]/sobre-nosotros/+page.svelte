<script lang="ts">
import { page as pageStore } from '$app/stores';
import { cn } from '$lib/utils/cn';
import Button from '$lib/components/ui/Button.svelte';
import { getLocalizedPath } from '$lib/i18n/utils';
import bannerImage from '$lib/assets/banners/bannerSpa.avif';
import { 
Sparkles, 
Coffee, 
ShieldCheck, 
MapPin, 
Award, 
Feather, 
Heart, 
ArrowDown,
Droplets
} from 'lucide-svelte';

let currentLang = $derived($pageStore.params.lang || 'es');

const pillars = [
{
icon: Sparkles,
title: "Innovación Terapéutica",
desc: "Fusionamos la sabiduría ancestral con tecnología wellness de vanguardia para ofrecerte resultados transformadores y medibles desde la primera sesión.",
color: "text-primary dark:text-primary-light"
},
{
icon: Coffee,
title: "Hospitalidad 7 Estrellas",
desc: "Nos anticipamos a tus necesidades. Cada detalle, desde el aroma al ingresar hasta la temperatura de tu camilla, está meticulosamente orquestado.",
color: "text-rose-500"
},
{
icon: ShieldCheck,
title: "Santuario Seguro",
desc: "Tu privacidad y tranquilidad son inquebrantables. Operamos bajo los más estrictos estándares de bioseguridad y confidencialidad.",
color: "text-emerald-500"
}
];
</script>

<svelte:head>
<title>La Esencia | L-SPA Medellín</title>
<meta name="description" content="Descubre la filosofía detrás de L-SPA, el refugio de bienestar y transformación más exclusivo de Medellín." />
</svelte:head>

<div class="min-h-screen bg-[#FAFAFA] dark:bg-[#0A0A0B] transition-colors duration-1000 selection:bg-primary/20 selection:text-primary-dark">

<!-- Hero Editorial -->
<section class="relative min-h-[90vh] flex flex-col justify-end pb-24 overflow-hidden">
<!-- Background Image with mix-blend for cinematic feel -->
<div class="absolute inset-0 z-0">
<img
src={bannerImage}
alt="L-SPA Essence Retreat"
class="w-full h-full object-cover brightness-[0.7] dark:brightness-[0.4] saturate-50 scale-105 animate-in fade-in zoom-in-105 duration-[3s]"
/>
<div class="absolute inset-0 bg-linear-to-t from-[#FAFAFA] via-[#FAFAFA]/50 dark:from-[#0A0A0B] dark:via-[#0A0A0B]/80 to-transparent"></div>
</div>

<div class="relative z-10 max-w-350 mx-auto w-full px-6 lg:px-12">
<div class="mb-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
<div class="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-gray-900/10 dark:border-white/10 text-[10px] font-bold uppercase tracking-[0.3em] text-gray-900 dark:text-white bg-white/10 backdrop-blur-md mb-8">
<Feather size={14} class="text-primary dark:text-primary-light" />
Nuestra Identidad
</div>

<h1 class="text-6xl md:text-8xl lg:text-[9rem] font-display text-gray-900 dark:text-white leading-[0.85] tracking-tighter mix-blend-normal">
El Arte del <br /> 
<span class="italic font-light text-primary dark:text-primary-light">Bienestar.</span>
</h1>
</div>

<div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-end border-t border-gray-900/10 dark:border-white/10 pt-10 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
<p class="text-xl md:text-2xl text-gray-700 dark:text-gray-300 font-light leading-relaxed max-w-xl">
No somos un destino, somos el <strong class="font-medium text-gray-900 dark:text-white">punto de partida</strong> hacia tu mejor versión. Bienvenidos al santuario de paz definitivo en Medellín.
</p>
<div class="flex md:justify-end">
<div class="w-16 h-16 rounded-full border border-gray-900/10 dark:border-white/20 flex items-center justify-center animate-bounce duration-3000">
<ArrowDown size={24} class="text-gray-400" strokeWidth={1} />
</div>
</div>
</div>
</div>
</section>

<!-- Filosofía: Bento Grid Asimétrico -->
<section class="max-w-350 mx-auto px-6 lg:px-12 py-32">
<div class="grid grid-cols-1 lg:grid-cols-12 gap-8">

<!-- Misión Col -->
<div class="lg:col-span-7 bg-white dark:bg-[#121213] rounded-[40px] p-12 lg:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-none border border-gray-100 dark:border-white/5 relative overflow-hidden group">
<div class="absolute -right-20 -top-20 w-96 h-96 bg-primary/5 dark:bg-primary-dark/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-[3s]"></div>

<div class="relative z-10 h-full flex flex-col justify-between">
<div class="mb-24">
<h2 class="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8">Nuestra Misión</h2>
<p class="text-4xl md:text-5xl font-display text-gray-900 dark:text-white leading-[1.1]">
Redefinir el concepto del <span class="italic text-primary dark:text-primary-light font-light">cuidado personal</span>, elevándolo a una experiencia artística y transformadora.
</p>
</div>

<div class="flex items-center gap-6">
<div class="w-14 h-14 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center border border-gray-100 dark:border-white/10">
<Droplets size={24} class="text-primary dark:text-primary-light" strokeWidth={1.5} />
</div>
<p class="text-gray-500 dark:text-gray-400 font-light max-w-sm">
Diseñamos protocolos exclusivos donde la quietud mental y la vitalidad física colisionan en perfecta armonía.
</p>
</div>
</div>
</div>

<!-- Visión Col & Stats -->
<div class="lg:col-span-5 flex flex-col gap-8">

<div class="bg-gray-900 dark:bg-[#1A1A1B] rounded-[40px] p-12 flex-1 shadow-2xl relative overflow-hidden group">
<!-- Darker thematic card -->
<div class="absolute inset-0 bg-linear-to-br from-primary/20 to-transparent mix-blend-overlay"></div>
<div class="relative z-10">
<h2 class="text-[10px] font-bold uppercase tracking-[0.4em] text-gray-400 mb-8">La Visión</h2>
<p class="text-3xl font-display text-white leading-tight mb-8">
Convertirnos en el oasis urbano <span class="italic text-primary-light font-light">referente de la élite latinoamericana</span>.
</p>
<p class="text-gray-400 font-light text-sm">
Ser el refugio innegociable de quienes entienden que detenerse es el mayor lujo de esta era.
</p>
</div>
</div>

<div class="grid grid-cols-2 gap-4">
<div class="bg-white dark:bg-[#121213] rounded-[32px] p-8 border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
<span class="text-5xl font-display text-primary dark:text-primary-light mb-2">98%</span>
<span class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Satisfacción</span>
</div>
<div class="bg-white dark:bg-[#121213] rounded-[32px] p-8 border border-gray-100 dark:border-white/5 flex flex-col items-center justify-center text-center">
<span class="text-5xl font-display text-gray-900 dark:text-white mb-2">+5k</span>
<span class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Experiencias</span>
</div>
</div>

</div>
</div>
</section>

<!-- Los 3 Pilares -->
<section class="max-w-350 mx-auto px-6 lg:px-12 py-24 border-t border-gray-200 dark:border-white/5">
<div class="mb-20">
<h2 class="text-5xl md:text-6xl font-display text-gray-900 dark:text-white mb-6">El Código <span class="italic text-gray-400 font-light">L-SPA</span></h2>
<p class="text-xl text-gray-500 dark:text-gray-400 font-light max-w-2xl">Los tres dogmas que rigen cada interacción, silencio y terapia dentro de nuestro santuario.</p>
</div>

<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
{#each pillars as pillar}
<div class="bg-transparent dark:bg-[#0A0A0B] p-10 lg:p-12 rounded-[40px] border border-gray-200 dark:border-white/10 hover:bg-white dark:hover:bg-[#121213] transition-all duration-700 group hover:shadow-xl dark:shadow-none hover:-translate-y-2">
<div class="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mb-10 group-hover:scale-110 transition-transform duration-500 border border-gray-100 dark:border-white/5">
<pillar.icon size={28} class={pillar.color} strokeWidth={1.5} />
</div>
<h3 class="text-2xl font-display text-gray-900 dark:text-white mb-4 line-clamp-1">{pillar.title}</h3>
<div class="h-px w-12 bg-gray-200 dark:bg-white/10 mb-6 group-hover:w-full transition-all duration-1000"></div>
<p class="text-gray-500 dark:text-gray-400 font-light leading-relaxed">
{pillar.desc}
</p>
</div>
{/each}
</div>
</section>

<!-- Experiencia y Ubicación Cinematográfica -->
<section class="relative h-[80vh] min-h-150 mt-24">
<div class="absolute inset-0">
<img
src={bannerImage}
alt="Ubicación L-SPA"
class="w-full h-full object-cover brightness-50 dark:brightness-25 grayscale-30"
/>
</div>

<div class="absolute inset-0 bg-linear-to-r from-[#0A0A0B]/90 via-[#0A0A0B]/50 to-transparent"></div>

<div class="relative z-10 max-w-350 mx-auto px-6 lg:px-12 h-full flex flex-col justify-center">
<div class="max-w-xl">
<div class="inline-flex items-center gap-2 text-white mb-8">
<MapPin size={18} class="text-primary-light" />
<span class="text-[10px] font-bold uppercase tracking-[0.3em]">El Destino Final</span>
</div>

<h2 class="text-5xl md:text-7xl font-display text-white mb-8 leading-tight">
Tu Refugio en la <br/>
<span class="italic text-primary-light font-light">Ciudad de la Eterna Primavera</span>
</h2>

<p class="text-gray-300 font-light text-lg mb-12 leading-relaxed">
Escondido estratégicamente en el corazón de Medellín. Un umbral diseñado para dejar el caos urbano atrás y sumergirte en el silencio profundo.
</p>

<Button 
href={getLocalizedPath('/servicios', currentLang)}
class="rounded-full bg-white text-gray-900 hover:bg-gray-100 px-10 py-6 font-bold text-[10px] uppercase tracking-[0.3em] transition-transform hover:-translate-y-1"
>
Comenzar el Viaje
</Button>
</div>
</div>
</section>
</div>

<style>
:global(body) {
background-attachment: fixed;
}
</style>
