<script lang="ts">
  import { Star, Clock, MapPin, ChevronLeft, ChevronRight, Sparkles, MoveRight } from 'lucide-svelte';
  import { authClient } from '$lib/auth-client';
  import Button from '$lib/components/ui/Button.svelte';
  import { onMount } from 'svelte';
  import bannerImage from '$lib/assets/banners/bannerSpa.avif';
  import { seoStore, BASE_URL } from '$lib/seo';
  import { page } from '$app/stores';
  import { getLocalizedPath } from '$lib/i18n/utils';
  import { _ } from 'svelte-i18n';
  import Skeleton from 'boneyard-js/svelte';

  let { data } = $props();
  
  // Use authClient session like the layout does
  const session = authClient.useSession();
  
  let currentLang = $derived($page.params.lang || 'es');
  
  // Set homepage metadata
  $effect(() => {
    seoStore.setPageMetadata({
      title: $_('home.title'),
      description: 'L-Spa - Bienestar y Relajación Premium en Medellín. Descubre una experiencia única de spa con masajes, tratamientos faciales y corporales.',
      image: `${BASE_URL}/assets/carrusel1.jpg`,
      url: BASE_URL,
      type: 'website'
    });
  });
  
  // Carousel images from static/assets (served from /assets/)
  const carouselImages = [
    '/assets/carrusel1.jpg',
    '/assets/carrusel2.jpg', 
    '/assets/carrusel3.jpg'
  ];
  
  // State
  let activeIndex = $state(0);
  const totalImages = carouselImages.length;

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

  // Use dynamic services from server data
  const featuredServices = $derived(
    (data.services || []).slice(0, 3).map(service => ({
      ...service,
      price: Number(service.price) || 0,
      duration: service.duration || 60
    }))
  );

  let isLoading = $state(false);
</script>

<svelte:head>
  <link rel="preload" as="image" href={bannerImage} type="image/avif" fetchpriority="high" />
</svelte:head>

<div class="grow font-sans bg-gray-50 dark:bg-gray-900 border-t border-secondary/10">
  <!-- Hero Section -->
  <section class="relative min-h-[90vh] flex items-center overflow-hidden bg-gray-900 pb-20">
    <div class="absolute inset-0 z-0">
      <enhanced:img src={bannerImage} alt="L-SPA Banner" loading="eager" fetchpriority="high" decoding="async" class="w-full h-full object-cover opacity-50 mix-blend-overlay" />
      <div class="absolute inset-0 bg-linear-to-b from-black/20 via-black/40 to-black/80"></div>
    </div>
    
    <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full pt-16">
      <div class="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
        <div class="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-xs font-semibold uppercase tracking-[0.3em] shadow-2xl mt-8">
          <Sparkles size={14} class="text-primary-light" />
          {$_('home.hero.badge')}
        </div>
        
        <div class="space-y-4">
          <h1 class="text-4xl sm:text-6xl md:text-7xl font-serif leading-[1.1] drop-shadow-2xl">
            {$_('home.hero.headline')}
          </h1>
          <p class="text-base sm:text-xl font-light text-gray-200 max-w-2xl leading-relaxed drop-shadow-lg font-sans">
            {$_('home.hero.subtitle')}
          </p>
        </div>

        <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 pt-8">
            <Button href={getLocalizedPath('/servicios', currentLang)} class="w-full sm:w-auto px-8 sm:px-10 py-5 rounded-full text-sm font-semibold uppercase tracking-widest shadow-2xl bg-primary hover:bg-primary-light transition-colors group overflow-hidden relative whitespace-nowrap">
            <span class="relative z-10 flex items-center justify-center gap-3">
              {$_('home.hero.exploreServices')}
              <MoveRight size={20} class="group-hover:translate-x-2 transition-transform duration-500" />
            </span>
          </Button>
          
          {#if $session.data}
            <a href={getLocalizedPath('/sobre-nosotros', currentLang)} class="group flex items-center gap-3 sm:gap-4 text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:text-primary-light transition-colors">
              <div class="h-12 w-12 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-md group-hover:border-primary-light transition-all group-hover:scale-105 shrink-0">
                <ChevronRight size={18} />
              </div>
              <span class="whitespace-nowrap">{$_('home.hero.knowUs')}</span>
            </a>
          {:else}
            <a href={getLocalizedPath('/login', currentLang)} class="group flex items-center gap-3 sm:gap-4 text-white font-semibold text-xs sm:text-sm uppercase tracking-[0.15em] sm:tracking-[0.2em] hover:text-primary-light transition-colors">
              <div class="h-12 w-12 rounded-full flex items-center justify-center border border-white/30 backdrop-blur-md group-hover:border-primary-light transition-all group-hover:scale-105 shrink-0">
                <ChevronRight size={18} />
              </div>
              <span class="whitespace-nowrap">{$_('home.hero.login')}</span>
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
          { icon: Star, titleKey: 'home.features.quality.title', descKey: 'home.features.quality.description' },
          { icon: Clock, titleKey: 'home.features.time.title', descKey: 'home.features.time.description' },
          { icon: MapPin, titleKey: 'home.features.location.title', descKey: 'home.features.location.description' }
        ] as item}
          <div class="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-500 p-10 rounded-[2.5rem] bg-white dark:bg-gray-800 shadow-xl shadow-primary/5 border border-secondary/20">
            <div class="mb-6 p-4 bg-secondary/30 rounded-full text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500">
              <item.icon size={28} />
            </div>
            <h4 class="text-xl font-serif mb-3 text-gray-900 dark:text-gray-100">{$_(item.titleKey)}</h4>
            <p class="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed">{$_(item.descKey)}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Carousel Section -->
  <section class="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center mb-16">
        <h2 class="text-4xl sm:text-5xl font-serif text-gray-900 dark:text-white mb-6">{$_('home.facilities.title')}</h2>
        <div class="h-1 w-24 bg-primary mx-auto rounded-full"></div>
      </div>

      <div class="relative group overflow-hidden rounded-spa-xl shadow-2xl border border-gray-100 dark:border-gray-800">
        <div class="flex transition-transform duration-1000 ease-in-out" style="transform: translateX(-{activeIndex * 100}%)">
          {#each carouselImages as img, num}
            <div class="min-w-full h-125 relative">
              <img src={img} alt="Instalación {num + 1}" loading="lazy" class="w-full h-full object-cover" />
              <div class="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent"></div>
              <div class="absolute bottom-12 left-12 md:bottom-16 md:left-16 text-white max-w-xl">
                 <p class="text-primary-light font-semibold uppercase tracking-[0.3em] mb-4 text-xs font-sans">{$_('home.facilities.badge')}</p>
                 <h3 class="text-3xl md:text-4xl font-serif">{$_('home.facilities.headline')}</h3>
              </div>
            </div>
          {/each}
        </div>

        <button onclick={handlePrev} aria-label="Previous image" class="absolute left-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center -translate-x-4 group-hover:translate-x-0 duration-500"><ChevronLeft size={28} /></button>
        <button onclick={handleNext} aria-label="Next image" class="absolute right-6 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full bg-white/20 backdrop-blur-md text-white hover:bg-primary transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center translate-x-4 group-hover:translate-x-0 duration-500"><ChevronRight size={28} /></button>

        <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
          {#each Array(totalImages) as _, i}
            <button onclick={() => activeIndex = i} aria-label="Go to image {i + 1}" class="h-1.5 rounded-full transition-all duration-500 {activeIndex === i ? 'w-12 bg-primary' : 'w-3 bg-white/40 hover:bg-white/70'}"></button>
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
          <h2 class="text-4xl sm:text-5xl font-serif text-gray-900 dark:text-white mb-6">{$_('home.services.title')}</h2>
          <p class="text-gray-600 dark:text-gray-400 text-lg font-light leading-relaxed">{$_('home.services.subtitle')}</p>
        </div>
        <a href={getLocalizedPath('/servicios', currentLang)} class="group flex items-center gap-3 px-8 py-4 bg-white dark:bg-gray-700 text-primary font-semibold uppercase tracking-widest text-xs rounded-full hover:bg-primary hover:text-white transition-all shadow-md">
          {$_('home.services.viewCatalog')}
          <MoveRight size={16} class="group-hover:translate-x-2 transition-transform" />
        </a>
      </div>
      
      {#snippet fallback()}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {#each Array(3) as _}
            <div class="overflow-hidden group border border-secondary/20 shadow-xl transition-all duration-700 rounded-[2.5rem] bg-white dark:bg-gray-900 flex flex-col">
              <div class="h-64 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
              <div class="p-8 flex-1 flex flex-col space-y-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-1/2"></div>
                <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-full"></div>
                <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse w-full mt-auto"></div>
              </div>
            </div>
          {/each}
        </div>
      {/snippet}

      <Skeleton loading={isLoading} {fallback}>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {#each featuredServices as service}
          <div class="overflow-hidden group border border-secondary/20 shadow-xl hover:shadow-2xl transition-all duration-700 rounded-[2.5rem] bg-white dark:bg-gray-900 hover:-translate-y-3 flex flex-col">
            <div class="h-64 overflow-hidden relative">
              <img src={service.imageUrl} alt={service.name} loading="lazy" decoding="async" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" />
              <div class="absolute top-6 right-6">
                <div class="bg-white/95 backdrop-blur-md text-primary font-bold px-5 py-2 rounded-full shadow-lg text-lg">
                  ${service.price.toLocaleString()}
                </div>
              </div>
            </div>
            <div class="p-8 flex-1 flex flex-col">
              <div class="flex items-center gap-2 mb-4">
                <Clock size={16} class="text-primary-light" />
                <span class="text-xs font-semibold uppercase tracking-widest text-gray-500">{service.duration} MIN</span>
              </div>
              <h4 class="text-2xl font-serif mb-3 text-gray-900 dark:text-white">{service.name}</h4>
              <p class="text-gray-600 dark:text-gray-400 text-sm font-light leading-relaxed mb-8 flex-1">
                {service.description}
              </p>
              <Button href={getLocalizedPath('/servicios', currentLang)} class="w-full rounded-full py-4 font-semibold uppercase tracking-widest text-xs bg-gray-100 text-gray-900 hover:bg-primary hover:text-white dark:bg-gray-800 dark:text-white transition-all">
                {$_('home.services.book')}
              </Button>
            </div>
          </div>
        {/each}
      </div>
      </Skeleton>
    </div>
  </section>
</div>
