<script lang="ts">
  import { Star, Clock, MapPin, ChevronLeft, ChevronRight, Sparkles, MoveRight } from 'lucide-svelte';
  import { isAuthenticated, login } from '$lib/auth';
  import Button from '$lib/components/ui/Button.svelte';
  import bannerSpa from '../lib/assets/banners/bannerSpa.avif';
  import { onMount } from 'svelte';

  let { data } = $props();
  
  // State
  let activeIndex = $state(0);
  const totalImages = 3;

  // Auto-carousel
  onMount(() => {
    const interval = setInterval(() => {
      activeIndex = (activeIndex + 1) % totalImages;
    }, 5000);
    return () => clearInterval(interval);
  });

  const handlePrev = () => {
    activeIndex = (activeIndex - 1 + totalImages) % totalImages;
  };

  const handleNext = () => {
    activeIndex = (activeIndex + 1) % totalImages;
  };

  const featuredServices = [
    {
      id: 1,
      name: "Masaje Relajante",
      description: "Una experiencia de relajación total para tu cuerpo y mente.",
      price: 120000,
      duration: 60,
      imageUrl: bannerSpa 
    },
    {
      id: 2,
      name: "Tratamiento Facial",
      description: "Luce una piel radiante y renovada con nuestros expertos.",
      price: 150000,
      duration: 45,
      imageUrl: bannerSpa
    },
    {
      id: 3,
      name: "Circuito de Hidroterapia",
      description: "Benefíciate del poder del agua en nuestras modernas instalaciones.",
      price: 80000,
      duration: 90,
      imageUrl: bannerSpa
    }
  ];
</script>

<svelte:head>
  <title>L-SPA | Bienestar y Relajación Premium en Medellín</title>
  <meta name="description" content="Descubre una experiencia única de bienestar y belleza en el corazón de Medellín. Reserva masajes, tratamientos faciales y corporales." />
</svelte:head>

<div class="grow font-sans bg-gray-50 dark:bg-gray-900 border-t border-secondary/10">
  <!-- Hero Section -->
  <section class="relative h-[85vh] flex items-center overflow-hidden bg-gray-900">
    <div class="absolute inset-0 z-0">
      <img src={bannerSpa} alt="L-SPA Banner" loading="lazy" class="w-full h-full object-cover opacity-50 mix-blend-overlay" />
      <div class="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/80"></div>
    </div>
    
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
      <div class="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.3em] shadow-2xl">
          <Sparkles size={14} class="text-primary-light" />
          L-SPA PREMIUM EXPERIENCE
        </div>
        
        <div class="space-y-4">
          <h1 class="text-5xl sm:text-7xl md:text-8xl font-serif leading-[1.1] drop-shadow-2xl">
            Un oasis de <br />
            <span class="text-primary-light italic font-serif">relajación</span> en Medellín
          </h1>
          <p class="text-lg sm:text-2xl font-light text-gray-200 max-w-2xl leading-relaxed drop-shadow-lg font-sans">
            Descubre una experiencia única de bienestar y belleza diseñada para tu renovación total. Tu momento de paz comienza aquí.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-6 pt-8">
          <Button href="/servicios" class="w-full sm:w-auto px-10 py-5 rounded-full text-sm font-semibold uppercase tracking-widest shadow-2xl bg-primary hover:bg-primary-light transition-colors group overflow-hidden relative">
            <span class="relative z-10 flex items-center gap-3">
              Explorar Servicios
              <MoveRight size={20} class="group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </Button>
          
          {#if !$isAuthenticated}
            <button onclick={login} class="group flex items-center gap-4 text-white font-semibold text-sm uppercase tracking-[0.2em] hover:text-primary-light transition-colors">
              <div class="h-12 w-12 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-md group-hover:border-primary-light transition-all group-hover:scale-105">
                <ChevronRight size={18} />
              </div>
              INICIAR SESIÓN
            </button>
          {:else}
            <a href="/sobre-nosotros" class="group flex items-center gap-4 text-white font-semibold text-sm uppercase tracking-[0.2em] hover:text-primary-light transition-colors">
              <div class="h-12 w-12 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-md group-hover:border-primary-light transition-all group-hover:scale-105">
                <ChevronRight size={18} />
              </div>
              Conócenos
            </a>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Info Cards Section -->
  <section class="py-24 -mt-20 relative z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each [
          { icon: Star, title: "Calidad Premium", desc: "Tratamientos exclusivos y personalizados con estándares internacionales." },
          { icon: Clock, title: "Tu Tiempo", desc: "Flexibilidad horaria diseñada para adaptarse a tu ritmo de vida." },
          { icon: MapPin, title: "Ubicación Ideal", desc: "Un refugio de paz accesible en el corazón urbano de Medellín." }
        ] as item}
          <div class="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500 p-10 rounded-[2.5rem] bg-white dark:bg-gray-800 shadow-xl shadow-primary/5 border border-secondary/20">
            <div class="mb-6 p-4 bg-secondary/30 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <item.icon size={28} />
            </div>
            <h4 class="text-xl font-serif mb-3 text-gray-900 dark:text-gray-100">{item.title}</h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">{item.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Carousel Section -->
  <section class="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-serif text-gray-900 dark:text-white mb-6">Nuestras Instalaciones</h2>
        <div class="h-1 w-24 bg-primary mx-auto rounded-full"></div>
      </div>

      <div class="relative group overflow-hidden rounded-[3rem] shadow-2xl border border-gray-100 dark:border-gray-800">
        <div class="flex transition-transform duration-1000 ease-in-out" style="transform: translateX(-{activeIndex * 100}%)">
          {#each [1, 2, 3] as num}
            <div class="min-w-full h-125 relative">
              <img src={bannerSpa} alt="Instalación {num}" loading="lazy" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-12 left-12 md:bottom-16 md:left-16 text-white max-w-xl">
                 <p class="text-primary-light font-semibold uppercase tracking-[0.3em] mb-4 text-xs font-sans">Premium Wellness</p>
                 <h3 class="text-3xl md:text-4xl font-serif">Ambiente de Paz y Renovación</h3>
              </div>
            </div>
          {/each}
        </div>

        <button onclick={handlePrev} aria-label="Imagen anterior" class="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center -translate-x-4 group-hover:translate-x-0 duration-500"><ChevronLeft size={28} /></button>
        <button onclick={handleNext} aria-label="Siguiente imagen" class="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center translate-x-4 group-hover:translate-x-0 duration-500"><ChevronRight size={28} /></button>

        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {#each Array(totalImages) as _, i}
            <button onclick={() => activeIndex = i} aria-label="Ir a la imagen {i + 1}" class="h-1.5 rounded-full transition-all duration-500 {activeIndex === i ? 'w-12 bg-primary' : 'w-3 bg-white/40 hover:bg-white/70'}"></button>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Services Section -->
  <section class="py-24 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
        <div class="max-w-2xl">
          <h2 class="text-4xl sm:text-5xl font-serif text-gray-900 dark:text-white mb-6">Nuestros Servicios</h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">Experiencias sensoriales diseñadas para tu bienestar absoluto.</p>
        </div>
        <a href="/servicios" class="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-700 text-primary font-semibold uppercase tracking-widest text-xs rounded-full hover:bg-primary hover:text-white transition-all shadow-md">
          Ver Catálogo
          <MoveRight size={16} class="group-hover:translate-x-2 transition-transform" />
        </a>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {#each featuredServices as service}
          <div class="overflow-hidden group border border-secondary/20 shadow-xl hover:shadow-2xl transition-all duration-700 rounded-[2.5rem] bg-white dark:bg-gray-900 hover:-translate-y-3 flex flex-col">
            <div class="h-64 overflow-hidden relative">
              <img src={service.imageUrl} alt={service.name} class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
              <div class="absolute top-6 right-6">
                <div class="bg-white/95 backdrop-blur-md text-primary font-bold px-5 py-2 rounded-full shadow-lg text-lg">
                  ${service.price.toLocaleString()}
                </div>
              </div>
            </div>
            <div class="p-8 flex-1 flex flex-col">
              <div class="flex items-center gap-2 mb-4">
                <Clock size={16} class="text-primary-light" />
                <span class="text-xs font-semibold uppercase tracking-widest text-gray-500">{service.duration} MINUTOS</span>
              </div>
              <h4 class="text-2xl font-serif mb-3 text-gray-900 dark:text-white">{service.name}</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed mb-8 flex-1">
                {service.description}
              </p>
              <Button href="/servicios" class="w-full rounded-full py-4 font-semibold uppercase tracking-widest text-xs bg-gray-100 text-gray-900 hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-white transition-all">
                Reservar
              </Button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
</div>
