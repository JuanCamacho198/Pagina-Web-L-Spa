<script lang="ts">
  import '../app.css';
  import Button from '$lib/components/ui/Button.svelte';
  import Toaster from '$lib/components/feedback/Toast.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { onMount } from 'svelte';
  import { authClient } from '$lib/auth-client';
  import { initializeErrorHandling } from '$lib/error-handlers';
  import { User, LogOut, Settings, Calendar, Heart, ShieldCheck, ShoppingCart, LayoutDashboard, Scissors, Sun, Moon } from 'lucide-svelte';
  import { cart, cartStore } from '$lib/cart';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
  import { getTheme, setTheme, toggleTheme, initTheme, type Theme } from '$lib/theme';
  import { getBrandingWithDefaults, type BrandingConfig } from '$lib/config/branding';
  import { resolvedMetadata, seoStore, BASE_URL, SITE_NAME, TWITTER_HANDLE } from '$lib/seo';
  import LanguageSwitcher from '$lib/components/ui/LanguageSwitcher.svelte';
  import '$lib/i18n';
  import { _ } from 'svelte-i18n';

  import { page } from '$app/stores';
  
  let { data, children } = $props();
  const session = authClient.useSession();
  const queryClient = new QueryClient();
  
  // Check if we're in admin section
  let isAdminSection = $derived($page.url.pathname.startsWith('/admin'));
  
  // Theme state
  let currentTheme = $state<Theme>('light');
  
  // Branding state
  let branding = $state<BrandingConfig>(getBrandingWithDefaults());
  
  // Reactive cart count - subscribe to store and convert to Svelte 5 reactive
  let cartItemsList = $state<any[]>([]);
  let currentCartCount = $derived(cartItemsList.reduce((acc, item) => acc + item.quantity, 0));
  
  // Subscribe to cart store
  onMount(() => {
    // Initialize theme
    initTheme();
    currentTheme = getTheme();
    
    // Load branding config
    branding = getBrandingWithDefaults();
    
    // Initialize client-side error handlers
    initializeErrorHandling();
    
    // Reset SEO metadata for each navigation
    seoStore.reset();
    
    const unsubscribe = cartStore.subscribe((items) => {
      cartItemsList = items;
    });
    return unsubscribe;
  });

  // Load cart when session changes
  $effect(function() {
    if (!$session.isPending) {
      cart.load();
    }
  });
  
  function handleToggleTheme() {
    currentTheme = toggleTheme();
  }
</script>

<svelte:head>
  <title>{resolvedMetadata.title}</title>
  <meta name="description" content={resolvedMetadata.description} />
  <meta name="keywords" content={resolvedMetadata.keywords} />
  {#if resolvedMetadata.noindex}
    <meta name="robots" content="noindex, nofollow" />
  {/if}
  <link rel="canonical" href={resolvedMetadata.canonical} />
  
  <link rel="alternate" hreflang="es" href={`${BASE_URL}/es`} />
  <link rel="alternate" hreflang="en" href={`${BASE_URL}/en`} />
  <link rel="alternate" hreflang="x-default" href={`${BASE_URL}/es`} />

  <!-- Open Graph -->
  <meta property="og:type" content={resolvedMetadata.type} />
  <meta property="og:title" content={resolvedMetadata.title} />
  <meta property="og:description" content={resolvedMetadata.description} />
  <meta property="og:image" content={resolvedMetadata.image} />
  <meta property="og:url" content={resolvedMetadata.url} />
  <meta property="og:site_name" content={SITE_NAME} />
  {#if resolvedMetadata.publishedTime}
    <meta property="article:published_time" content={resolvedMetadata.publishedTime} />
  {/if}
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content={TWITTER_HANDLE} />
  <meta name="twitter:title" content={resolvedMetadata.title} />
  <meta name="twitter:description" content={resolvedMetadata.description} />
  <meta name="twitter:image" content={resolvedMetadata.image} />
</svelte:head>

<QueryClientProvider client={queryClient}>
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-black focus:text-xs focus:uppercase focus:tracking-widest">
    Saltar al contenido principal
  </a>
  <div class="app-container min-h-screen flex flex-col font-sans selection:bg-primary/10">
    <header class="navbar bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-secondary/30 sticky top-0 z-50 px-6 py-4 transition-all duration-500">
    <div class="max-w-7xl mx-auto flex justify-between items-center w-full">
      <a href="/" class="group flex items-center gap-3">
        {#if branding.customLogo}
          <img 
            src={branding.customLogo} 
            alt="Logo" 
            class="h-10 w-auto object-contain brightness-110"
            style="height: {branding.logoSize}px"
          />
        {:else}
          <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-transform duration-500 shadow-lg shadow-primary/20">
            <ShieldCheck size={20} />
          </div>
        {/if}
        <span class="text-2xl font-display font-black tracking-tighter text-gray-900 dark:text-white uppercase">{branding.navbarText}</span>
      </a>
      
      <nav class="hidden lg:flex items-center gap-10" aria-label="Navegación principal">
        {#each [
          { name: $_('nav.services') || 'Servicios', path: '/servicios' },
          { name: 'Reservas', path: '/informacion-importante' },
          { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
          { name: $_('nav.contact') || 'Contacto', path: '/contacto' }
        ] as link}
          <a href={link.path} class="text-[10px] font-sans font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-all duration-500 relative overflow-hidden group">
            {link.name}
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500"></span>
          </a>
        {/each}
      </nav>

      <div class="flex items-center gap-4">
        <LanguageSwitcher />
        <!-- Dark Mode Toggle -->
        <button 
          onclick={handleToggleTheme}
          class="p-2 text-gray-400 hover:text-primary dark:text-gray-400 dark:hover:text-yellow-400 transition-colors duration-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          aria-label="Cambiar tema"
        >
          {#if currentTheme === 'dark'}
            <Moon size={24} aria-hidden="true" />
          {:else}
            <Sun size={24} aria-hidden="true" />
          {/if}
        </button>

        <!-- Shopping Cart Icon -->
        <a href="/carrito" class="relative p-2 text-gray-400 hover:text-primary transition-colors duration-500 group" aria-label={currentCartCount > 0 ? `Carrito (${currentCartCount} artículos)` : 'Ver carrito de compras'}>
          <ShoppingCart size={24} />
          {#if currentCartCount > 0}
            <span class="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white scale-100 group-hover:scale-110 transition-transform">
              {currentCartCount}
            </span>
          {/if}
        </a>

        <!-- Show login button immediately while session loads, replace with user info once loaded -->
        {#if $session.data}
          <!-- User Profile Dropdown -->
          <div class="relative group">
            <button class="flex items-center gap-3 p-1.5 pr-4 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all shadow-sm">
              <img src={$session.data?.user.image || `https://ui-avatars.com/api/?name=${$session.data?.user.name}`} alt={$session.data?.user.name} class="w-8 h-8 rounded-full border border-white dark:border-gray-600 shadow-sm" />
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">{$session.data?.user.name}</span>
            </button>
            
            <div class="absolute right-0 top-full mt-4 w-64 bg-white dark:bg-gray-800 rounded-4xl shadow-2xl border border-gray-100 dark:border-gray-700 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-500 translate-y-2 group-hover:translate-y-0 scale-95 group-hover:scale-100 z-50">
              <div class="p-6 border-b border-gray-50 dark:border-gray-700 mb-3 text-center">
                 <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Tu Cuenta Premium</p>
                 <p class="text-sm font-black text-gray-900 dark:text-white truncate">{$session.data?.user.email}</p>
              </div>
              <div class="space-y-1">
                <a href="/perfil" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary rounded-2xl transition-all">
                  <User size={16} /> Perfil
                </a>
                <a href="/mis-reservas" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary rounded-2xl transition-all">
                  <Calendar size={16} /> Mis Citas
                </a>
                <a href="/favoritos" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary rounded-2xl transition-all">
                  <Heart size={16} /> Favoritos
                </a>
                <!-- Admin/Staff Links -->
                <div class="border-t border-gray-100 dark:border-gray-700 my-2 pt-2">
                  <a href="/staff" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all">
                    <Scissors size={16} /> Panel Empleado
                  </a>
                  <a href="/admin" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all">
                    <LayoutDashboard size={16} /> Panel Admin
                  </a>
                </div>
                <button type="button" onclick={() => authClient.signOut()} class="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all">
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        {:else}
          <a href="/login" class="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-500 px-4">
            LOGIN
          </a>
          <a href="/registro" class="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-white bg-primary hover:bg-primary/90 transition-all duration-500 px-6 py-3 rounded-full shadow-lg shadow-primary/20">
            REGISTRO
          </a>
          
        {/if}
      </div>
    </div>
  </header>

  <main id="main" class="grow bg-white dark:bg-gray-900 transition-colors duration-300">
    {@render children?.()}
  </main>

  {#if !isAdminSection}
    <Footer {branding} />
  {/if}
</div>
<SvelteQueryDevtools initialIsOpen={false} />
</QueryClientProvider>

<Toaster />

<style>
  :global(.text-primary) {
    color: #8C1B58;
  }
  :global(.bg-primary) {
    background-color: #8C1B58;
  }
</style>
