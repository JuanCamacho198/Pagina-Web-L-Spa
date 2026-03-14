<script lang="ts">
  import '../app.css';
  import Button from '$lib/components/ui/Button.svelte';
  import Toaster from '$lib/components/feedback/Toast.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { onMount } from 'svelte';
  import { authClient } from '$lib/auth-client';
  import { User, LogOut, Settings, Calendar, Heart, ShieldCheck, ShoppingCart, LayoutDashboard, Scissors } from 'lucide-svelte';
  import { cart, cartStore } from '$lib/cart';
  import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
  import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

  let { data, children } = $props();
  const session = authClient.useSession();
  const queryClient = new QueryClient();
  
  // Reactive cart count - subscribe to store and convert to Svelte 5 reactive
  let cartItemsList = $state<any[]>([]);
  let currentCartCount = $derived(cartItemsList.reduce((acc, item) => acc + item.quantity, 0));
  
  // Subscribe to cart store
  onMount(() => {
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
</script>

<QueryClientProvider client={queryClient}>
  <div class="app-container min-h-screen flex flex-col font-sans selection:bg-primary/10">
    <header class="navbar bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50 px-6 py-4 transition-all duration-500">
    <div class="max-w-7xl mx-auto flex justify-between items-center w-full">
      <a href="/" class="group flex items-center gap-3">
        <div class="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white scale-100 group-hover:scale-110 transition-transform shadow-lg shadow-primary/20">
          <ShieldCheck size={20} />
        </div>
        <span class="text-2xl font-black tracking-tighter text-gray-900 uppercase">L-SPA</span>
      </a>
      
      <nav class="hidden lg:flex items-center gap-10">
        {#each [
          { name: 'Servicios', path: '/servicios' },
          { name: 'Reservas', path: '/informacion-importante' },
          { name: 'Sobre Nosotros', path: '/sobre-nosotros' },
          { name: 'Contacto', path: '/contacto' }
        ] as link}
          <a href={link.path} class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-primary transition-all relative overflow-hidden group">
            {link.name}
            <span class="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500"></span>
          </a>
        {/each}
      </nav>

      <div class="flex items-center gap-4">
        <!-- Shopping Cart Icon -->
        <a href="/carrito" class="relative p-2 text-gray-400 hover:text-primary transition-colors group">
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
            <button class="flex items-center gap-3 p-1.5 pr-4 bg-gray-50 rounded-full hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-sm">
              <img src={$session.data?.user.image || `https://ui-avatars.com/api/?name=${$session.data?.user.name}`} alt={$session.data?.user.name} class="w-8 h-8 rounded-full border border-white shadow-sm" />
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-600">{$session.data?.user.name}</span>
            </button>
            
            <div class="absolute right-0 top-full mt-4 w-64 bg-white rounded-4xl shadow-2xl border border-gray-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 scale-95 group-hover:scale-100 z-50">
              <div class="p-6 border-b border-gray-50 mb-3 text-center">
                 <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Tu Cuenta Premium</p>
                 <p class="text-sm font-black text-gray-900 truncate">{$session.data?.user.email}</p>
              </div>
              <div class="space-y-1">
                <a href="/perfil" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-primary rounded-2xl transition-all">
                  <User size={16} /> Perfil
                </a>
                <a href="/mis-reservas" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-primary rounded-2xl transition-all">
                  <Calendar size={16} /> Mis Citas
                </a>
                <a href="/favoritos" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:bg-gray-50 hover:text-primary rounded-2xl transition-all">
                  <Heart size={16} /> Favoritos
                </a>
                <!-- Admin/Staff Links -->
                <div class="border-t border-gray-100 my-2 pt-2">
                  <a href="/staff" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all">
                    <Scissors size={16} /> Panel Empleado
                  </a>
                  <a href="/admin" class="flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/5 rounded-2xl transition-all">
                    <LayoutDashboard size={16} /> Panel Admin
                  </a>
                </div>
                <button type="button" onclick={() => authClient.signOut()} class="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        {:else}
          <a href="/login" class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-primary transition-colors px-6">
            LOGIN
          </a>
          <Button href="/servicios" class="hidden sm:flex px-8 rounded-full shadow-lg shadow-primary/20">
            RESERVAR AHORA
          </Button>
        {/if}
      </div>
    </div>
  </header>

  <main class="grow bg-white">
    {@render children?.()}
  </main>

  <Footer />
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
