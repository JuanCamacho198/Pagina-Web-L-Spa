<script lang="ts">
  import '../../app.css';
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
  import { seoStore, BASE_URL, SITE_NAME, TWITTER_HANDLE } from '$lib/seo';
  import LanguageSwitcher from '$lib/components/ui/LanguageSwitcher.svelte';
  import '$lib/i18n';
  import { _, isLoading } from 'svelte-i18n';
  import spaLogo from '$lib/assets/logos/LOGO4x-sinfondo.png';

  import { page } from '$app/stores';
  import { getLocalizedPath } from '$lib/i18n/utils';
  
  let { data, children } = $props();
  const session = authClient.useSession();
  const queryClient = new QueryClient();
  
  let currentLang = $derived($page.params.lang || 'es');
  
  // Check if we're in admin section
  let isAdminSection = $derived($page.url.pathname.startsWith('/admin'));
  
  // SEO metadata derived from store
  let resolvedMetadata = $derived(seoStore.resolved);
  
  // Theme state
  let currentTheme = $state<Theme>('light');
  
  // Branding state
  let branding = $state<BrandingConfig>(getBrandingWithDefaults());
  
  // Reactive cart count - subscribe to store and convert to Svelte 5 reactive
  let cartItemsList = $state<any[]>([]);
  let currentCartCount = $derived(cartItemsList.reduce((acc, item) => acc + item.quantity, 0));
  
  // User menu dropdown state
  let isUserMenuOpen = $state(false);
  let userMenuRef = $state<HTMLElement | null>(null);
  
  function handleUserMenuClickOutside(event: MouseEvent) {
    if (isUserMenuOpen && userMenuRef && !userMenuRef.contains(event.target as Node)) {
      isUserMenuOpen = false;
    }
  }
  
  // Navigation items - created dynamically when i18n is ready
  let navItems = $derived($isLoading ? [] : [
    { name: $_('nav.services'), path: getLocalizedPath('/servicios', currentLang) },
    { name: $_('nav.bookings'), path: getLocalizedPath('/informacion-importante', currentLang) },
    { name: $_('nav.about'), path: getLocalizedPath('/sobre-nosotros', currentLang) },
    { name: $_('nav.contact'), path: getLocalizedPath('/contacto', currentLang) }
  ]);
  
  // Loading text
  let loadingText = $derived($isLoading ? 'Loading...' : $_('common.loading'));
  let skipToMainText = $derived($isLoading ? 'Skip to main content' : $_('layout.skipToMain'));
  let cartLabel = $derived($isLoading ? 'Cart' : (currentCartCount > 0 ? `${currentCartCount} items in cart` : 'View shopping cart'));
  
  // User menu translations
  let userMenuTexts = $derived($isLoading ? {
    role: 'Client',
    profile: 'Profile',
    bookings: 'Bookings',
    favorites: 'Favorites',
    logout: 'Logout'
  } : {
    role: $_('profile.roles.client'),
    profile: $_('nav.profile'),
    bookings: $_('nav.bookings'),
    favorites: $_('nav.favorites'),
    logout: $_('nav.logout')
  });
  
  // Auth button texts
  let authTexts = $derived($isLoading ? {
    login: 'Login',
    register: 'Register'
  } : {
    login: $_('nav.login'),
    register: $_('auth.register.title')
  });
  
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
    
    // Set API URL globally for client-side modules (like cart.ts)
    if (data.publicApiUrl) {
      (window as any).__PUBLIC_API_URL__ = data.publicApiUrl;
    }
    
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

<svelte:window onclick={handleUserMenuClickOutside} />

<QueryClientProvider client={queryClient}>
  {#if $isLoading}
    <!-- Loading state while i18n initializes -->
    <div class="min-h-screen flex items-center justify-center bg-white">
      <div class="animate-pulse flex flex-col items-center gap-4">
        <div class="w-12 h-12 bg-primary/20 rounded-xl"></div>
        <div class="text-primary font-medium">{loadingText}</div>
      </div>
    </div>
  {:else}
  <a href="#main" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-primary focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-black focus:text-xs focus:uppercase focus:tracking-widest">
    {skipToMainText}
  </a>
  <div class="app-container min-h-screen flex flex-col font-sans selection:bg-primary/10">
    <header class="navbar bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-secondary/30 sticky top-0 z-50 px-6 py-4 transition-all duration-500">
    <div class="max-w-7xl mx-auto flex justify-between items-center w-full">
      <a href={getLocalizedPath('/', currentLang)} class="group flex items-center gap-3">
        {#if branding.customLogo}
          <img 
            src={branding.customLogo} 
            alt="L-SPA Logo" 
            class="h-10 w-auto object-contain brightness-110"
            style="height: {branding.logoSize}px"
          />
        {:else}
          <img 
            src={spaLogo} 
            alt="L-SPA Logo" 
            class="h-12 w-auto object-contain"
          />
        {/if}
        <span class="text-2xl font-display font-black tracking-tighter text-gray-900 dark:text-white uppercase">{branding.navbarText}</span>
      </a>
      
      <nav class="hidden lg:flex items-center gap-10" aria-label="Main navigation">
        {#each navItems as link}
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
          aria-label="Toggle theme"
        >
          {#if currentTheme === 'dark'}
            <Moon size={24} aria-hidden="true" />
          {:else}
            <Sun size={24} aria-hidden="true" />
          {/if}
        </button>

        <!-- Shopping Cart Icon -->
        <a href={getLocalizedPath('/carrito', currentLang)} class="relative p-2 text-gray-400 hover:text-primary transition-colors duration-500 group" aria-label={cartLabel}>
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
          <div class="relative" bind:this={userMenuRef}>
            <button 
              onclick={() => { isUserMenuOpen = !isUserMenuOpen; }}
              class="flex items-center gap-3 p-1.5 pr-4 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-white dark:hover:bg-gray-700 border border-transparent hover:border-gray-100 dark:hover:border-gray-600 transition-all shadow-sm cursor-pointer"
            >
              <img src={$session.data?.user.image || `https://ui-avatars.com/api/?name=${$session.data?.user.name}`} alt={$session.data?.user.name} class="w-8 h-8 rounded-full border border-white dark:border-gray-600 shadow-sm" />
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-600 dark:text-gray-300">{$session.data?.user.name}</span>
            </button>
            
            {#if isUserMenuOpen}
              <div class="absolute right-0 top-full mt-2 w-64 bg-white dark:bg-gray-800 rounded-4xl shadow-2xl border border-gray-100 dark:border-gray-700 p-3 z-9999">
                <div class="p-6 border-b border-gray-50 dark:border-gray-700 mb-3 text-center">
                   <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">{userMenuTexts.role}</p>
                   <p class="text-sm font-black text-gray-900 dark:text-white truncate">{$session.data?.user.email}</p>
                </div>
                <div class="space-y-1">
                  <a href={getLocalizedPath('/perfil', currentLang)} onclick={() => isUserMenuOpen = false} class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary rounded-2xl transition-all">
                    <User size={16} /> {userMenuTexts.profile}
                  </a>
                  <a href={getLocalizedPath('/mis-reservas', currentLang)} onclick={() => isUserMenuOpen = false} class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary rounded-2xl transition-all">
                    <Calendar size={16} /> {userMenuTexts.bookings}
                  </a>
                  <a href={getLocalizedPath('/favoritos', currentLang)} onclick={() => isUserMenuOpen = false} class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary rounded-2xl transition-all">
                    <Heart size={16} /> {userMenuTexts.favorites}
                  </a>
                  <!-- Admin/Staff Links -->
                  <div class="border-t border-gray-100 dark:border-gray-700 my-2 pt-2">
                    <a href={getLocalizedPath('/staff', currentLang)} onclick={() => isUserMenuOpen = false} class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all">
                      <Scissors size={16} /> Staff Panel
                    </a>
                    <a href="/admin" onclick={() => isUserMenuOpen = false} class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all">
                      <LayoutDashboard size={16} /> Admin Panel
                    </a>
                  </div>
                  <button type="button" onclick={() => { authClient.signOut(); isUserMenuOpen = false; }} class="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all">
                    <LogOut size={16} /> {userMenuTexts.logout}
                  </button>
                </div>
              </div>
            {/if}
          </div>
        {:else}
          <a href={getLocalizedPath('/login', currentLang)} class="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-gray-600 dark:text-gray-400 hover:text-primary transition-colors duration-500 px-4">
            {authTexts.login}
          </a>
          <a href={getLocalizedPath('/registro', currentLang)} class="text-[10px] font-sans font-black uppercase tracking-[0.4em] text-white bg-primary hover:bg-primary/90 transition-all duration-500 px-6 py-3 rounded-full shadow-lg shadow-primary/20">
            {authTexts.register}
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
{/if}
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
