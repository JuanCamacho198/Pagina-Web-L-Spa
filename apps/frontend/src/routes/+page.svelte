<script lang="ts">
  import { Star, Clock, MapPin, ChevronLeft, ChevronRight, Sparkles, MoveRight } from 'lucide-svelte';
  import { isAuthenticated, login } from '$lib/auth';
  import Button from '$lib/components/Button.svelte';
  import bannerSpa from '../lib/assets/banners/bannerSpa.avif';

  let { data } = $props();
  
  // State
  let activeIndex = $state(0);
  const totalImages = 3;

  // Auto-carousel
  import { onMount } from 'svelte';
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

  // Featured services data (simulated for now, can be updated from page load)
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

<div class="grow">
  <!-- Hero Section -->
  <section class="relative h-[80vh] flex items-center overflow-hidden">
    <div class="absolute inset-0 z-0">
      <img 
        src={bannerSpa} 
        alt="L-SPA Banner" 
        loading="lazy"
        class="w-full h-full object-cover brightness-[0.45] saturate-[0.8]"
      />
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/60"></div>
    </div>
    
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
      <div class="max-w-4xl space-y-10 animate-in fade-in slide-in-from-left-12 duration-1000">
        <div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl">
          <Sparkles size={14} class="text-primary-light" />
          L-SPA PREMIUM EXPERIENCE
        </div>
        
        <div class="space-y-6">
          <h1 class="text-6xl sm:text-8xl md:text-9xl font-black leading-[0.85] tracking-tighter drop-shadow-2xl">
            ¡BIENVENIDO A <br />
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-primary-light via-white to-primary-light/60">L-SPA!</span>
          </h1>
          <p class="text-xl sm:text-2xl font-medium text-gray-300 max-w-2xl leading-relaxed drop-shadow-lg">
            Un oasis de relajación en Medellín. Descubre una experiencia única de bienestar y belleza diseñada para tu renovación total.
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-center gap-6 pt-4">
          <Button 
            href="/servicios"
            class="w-full sm:w-auto px-12 py-7 rounded-4xl text-lg font-black uppercase tracking-widest shadow-2xl shadow-primary/40 group overflow-hidden relative"
          >
            <span class="relative z-10 flex items-center gap-3">
              Explorar Servicios
              <MoveRight size={24} class="group-hover:translate-x-2 transition-transform duration-500" />
            </span>
            <div class="absolute inset-0 bg-white/10 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
          </Button>
          
          {#if !$isAuthenticated}
            <button onclick={login} class="group flex items-center gap-4 text-white font-black text-sm uppercase tracking-[0.2em] hover:text-primary-light transition-colors">
              <div class="h-14 w-14 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md group-hover:border-primary-light transition-all group-hover:scale-110">
                <ChevronRight size={20} />
              </div>
              INICIAR SESIÓN
            </button>
          {:else}
            <a href="/sobre-nosotros" class="group flex items-center gap-4 text-white font-black text-sm uppercase tracking-[0.2em] hover:text-primary-light transition-colors">
              <div class="h-14 w-14 rounded-2xl flex items-center justify-center border border-white/30 backdrop-blur-md group-hover:border-primary-light transition-all group-hover:scale-110">
                <ChevronRight size={20} />
              </div>
              Conócenos
            </a>
          {/if}
        </div>
      </div>
    </div>
  </section>

  <!-- Info Cards Section -->
  <section class="py-20 -mt-16 relative z-20">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each [
          { icon: Star, title: "Calidad Premium", desc: "Tratamientos exclusivos con los mejores productos." },
          { icon: Clock, title: "Tu Tiempo", desc: "Flexibilidad horaria para adaptarnos a tu ritmo de vida." },
          { icon: MapPin, title: "Ubicación Ideal", desc: "Un refugio de paz en el corazón de Medellín." }
        ] as item}
          <div class="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 p-8 rounded-[3rem] bg-white dark:bg-gray-800 shadow-2xl shadow-primary/5">
            <div class="mb-6 p-5 bg-primary/5 rounded-2xl group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <item.icon size={32} class="transition-colors" />
            </div>
            <h4 class="text-xl font-black mb-3 text-gray-800 dark:text-gray-100 uppercase tracking-widest">{item.title}</h4>
            <p class="text-gray-500 dark:text-gray-400 text-sm font-medium leading-relaxed mt-0">{item.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Carousel Section -->
  <section class="py-20 bg-white dark:bg-gray-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-black text-gray-900 dark:text-white mb-6 uppercase tracking-[0.25em]">Nuestras Instalaciones</h2>
        <div class="h-1.5 w-32 bg-primary mx-auto rounded-full"></div>
      </div>

      <div class="relative group overflow-hidden rounded-[4rem] shadow-2xl border border-gray-100 dark:border-gray-800">
        <div class="flex transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1)" style="transform: translateX(-{activeIndex * 100}%)">
          {#each [1, 2, 3] as num}
            <div class="min-w-full h-[600px] relative">
              <img
                src={bannerSpa}
                alt="Instalación {num}"
                loading="lazy"
                class="w-full h-full object-cover"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div class="absolute bottom-16 left-16 text-white max-w-xl">
                 <p class="text-primary-light font-black uppercase tracking-[0.4em] mb-4 text-xs">Premium Wellness</p>
                 <h3 class="text-4xl font-black uppercase tracking-tighter">Ambiente de Paz y Renovación</h3>
              </div>
            </div>
          {/each}
        </div>

        <button
          onclick={handlePrev}
          aria-label="Imagen anterior"
          class="absolute left-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 shadow-2xl border border-white/20 flex items-center justify-center translate-x-10 group-hover:translate-x-0 group-hover:duration-500"
        >
          <ChevronLeft size={32} />
        </button>
        <button
          onclick={handleNext}
          aria-label="Siguiente imagen"
          class="absolute right-10 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-white/10 backdrop-blur-xl text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 shadow-2xl border border-white/20 flex items-center justify-center -translate-x-10 group-hover:translate-x-0 group-hover:duration-500"
        >
          <ChevronRight size={32} />
        </button>

        <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
          {#each Array(totalImages) as _, i}
            <button
              onclick={() => activeIndex = i}
              aria-label="Ir a la imagen {i + 1}"
              class="h-1.5 rounded-full transition-all duration-500 {activeIndex === i ? 'w-16 bg-primary' : 'w-4 bg-white/30 hover:bg-white/50'}"
            ></button>
          {/each}
        </div>
      </div>
    </div>
  </section>

  <!-- Featured Services Section -->
  <section class="py-32">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col md:flex-row justify-between items-end gap-8 mb-20">
        <div class="max-w-2xl">
          <h2 class="text-5xl font-black text-gray-900 dark:text-white uppercase tracking-[0.2em] mb-6">Nuestros Servicios</h2>
          <p class="text-gray-500 dark:text-gray-400 text-lg uppercase tracking-widest font-bold leading-relaxed">Experiencias sensoriales diseñadas para tu bienestar absoluto.</p>
        </div>
        <a href="/servicios" class="group flex items-center gap-4 px-10 py-5 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-black uppercase tracking-widest text-xs rounded-3xl hover:bg-primary hover:text-white transition-all shadow-xl shadow-gray-200/50">
          Ver Catálogo Completo
          <MoveRight size={18} class="group-hover:translate-x-2 transition-transform" />
        </a>
      </div>
      
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {#each featuredServices as service}
          <div class="overflow-hidden group border-none shadow-2xl hover:shadow-primary/10 transition-all duration-700 rounded-[3.5rem] bg-white dark:bg-gray-800 translate-y-0 hover:-translate-y-4">
            <div class="h-80 overflow-hidden relative">
              <img 
                src={service.imageUrl} 
                alt={service.name}
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
              />
              <div class="absolute top-8 right-8">
                <div class="bg-white/95 backdrop-blur-xl text-primary font-black px-6 py-3 rounded-3xl shadow-2xl text-xl scale-100 group-hover:scale-110 transition-transform duration-500">
                  ${service.price.toLocaleString()}
                </div>
              </div>
            </div>
            <div class="p-10">
              <div class="flex items-center gap-3 mb-4">
                <div class="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Clock size={16} />
                </div>
                <span class="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">{service.duration} MINUTOS</span>
              </div>
              <h4 class="text-3xl font-black mb-4 text-gray-900 dark:text-white uppercase tracking-tighter leading-none">{service.name}</h4>
              <p class="text-gray-500 dark:text-gray-400 text-sm leading-relaxed mb-10 font-medium">
                {service.description}
              </p>
              <Button 
                href="/servicios" 
                class="w-full rounded-[2rem] py-6 font-black uppercase tracking-[0.25em] text-[10px] shadow-xl group-hover:shadow-primary/40 transition-all"
              >
                RESERVAR AHORA
              </Button>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>
</div>
