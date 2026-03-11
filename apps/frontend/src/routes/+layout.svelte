<script lang="ts">
  import '../app.css';
  import Button from '$components/Button.svelte';
  import Toast from '$components/Toast.svelte';
  import { onMount, setContext } from 'svelte';
  import { initAuth, isAuthenticated, user, isLoading, login, logout } from '$lib/auth';
  import { cart, cartCount } from '$lib/cart';
  import { User, LogOut, Settings, Calendar, Heart, ShieldCheck, ShoppingCart } from 'lucide-svelte';
  
  let { data, children } = $props();

  onMount(() => {
    initAuth();
  });

  // Load cart when authentication status changes
  $effect(() => {
    if (!$isLoading) {
      cart.load();
    }
  });
</script>

<Toast />

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
          {#if $cartCount > 0}
            <span class="absolute top-0 right-0 w-5 h-5 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-full border-2 border-white scale-100 group-hover:scale-110 transition-transform">
              {$cartCount}
            </span>
          {/if}
        </a>

        {#if $isLoading}
          <div class="w-8 h-8 rounded-full border-2 border-primary/20 border-t-primary animate-spin"></div>
        {:else if $isAuthenticated}
          <!-- User Profile Dropdown -->
          <div class="relative group">
            <button class="flex items-center gap-3 p-1.5 pr-4 bg-gray-50 rounded-full hover:bg-white border border-transparent hover:border-gray-100 transition-all shadow-sm">
              <img src={$user?.picture} alt={$user?.name} class="w-8 h-8 rounded-full border border-white shadow-sm" />
              <span class="text-[10px] font-black uppercase tracking-widest text-gray-600">{$user?.nickname || $user?.name}</span>
            </button>
            
            <div class="absolute right-0 top-full mt-4 w-64 bg-white rounded-4xl shadow-2xl border border-gray-100 p-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 translate-y-2 group-hover:translate-y-0 scale-95 group-hover:scale-100 z-50">
              <div class="p-6 border-b border-gray-50 mb-3 text-center">
                 <p class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 mb-1">Tu Cuenta Premium</p>
                 <p class="text-sm font-black text-gray-900 truncate">{$user?.email}</p>
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
                <button onclick={logout} class="w-full flex items-center gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-50 rounded-2xl transition-all">
                  <LogOut size={16} /> Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        {:else}
          <button onclick={login} class="text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-primary transition-colors px-6">
            LOGIN
          </button>
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

  <footer class="bg-gray-900 pt-32 pb-20 px-6 overflow-hidden relative">
    <!-- Footer Decor -->
    <div class="absolute bottom-0 right-0 p-32 opacity-10 rotate-12 pointer-events-none scale-150">
      <ShieldCheck size={500} class="text-white" />
    </div>

    <div class="max-w-7xl mx-auto relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
        <div class="space-y-10">
          <div class="flex items-center gap-4">
             <div class="w-12 h-12 bg-white text-gray-900 rounded-2xl flex items-center justify-center font-black">L</div>
             <span class="text-3xl font-black tracking-tighter text-white uppercase italic">SPA</span>
          </div>
          <p class="text-primary-light/60 font-medium text-lg leading-relaxed max-w-xs">
            Un refugio de paz y lujo en el corazón de El Poblado. Donde el bienestar se encuentra con la excelencia.
          </p>
        </div>

        <div class="space-y-8">
          <h4 class="text-primary-light text-xs font-black uppercase tracking-[0.3em]">Nuestros Servicios</h4>
          <ul class="space-y-6">
            {#each ['Masajes de Lujo', 'Rituales Ancestrales', 'Tratamientos Faciales', 'Experiencias Duo'] as service}
              <li><a href="/servicios" class="text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">{service}</a></li>
            {/each}
          </ul>
        </div>

        <div class="space-y-8">
          <h4 class="text-primary-light text-xs font-black uppercase tracking-[0.3em]">Información Legal</h4>
          <ul class="space-y-6 text-white/50 text-sm font-bold uppercase tracking-widest">
            <li><a href="/politicas/privacidad" class="hover:text-white transition-colors">Privacidad</a></li>
            <li><a href="/politicas/cookies" class="hover:text-white transition-colors">Cookies</a></li>
            <li><a href="/politicas/cancelacion" class="hover:text-white transition-colors">Reservas</a></li>
          </ul>
        </div>

        <div class="space-y-8">
          <h4 class="text-primary-light text-xs font-black uppercase tracking-[0.3em]">Boletín VIP</h4>
          <div class="flex flex-col gap-6">
            <p class="text-white/40 text-[10px] font-black uppercase tracking-widest">Suscríbete para recibir ofertas exclusivas.</p>
            <div class="flex p-2 bg-white/5 rounded-3xl border border-white/10">
              <input type="email" placeholder="email@luxury.com" class="bg-transparent border-none outline-none text-white px-6 w-full text-sm font-bold" />
              <button class="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-900 hover:scale-105 transition-transform">
                <ShieldCheck size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="pt-20 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
        <p class="text-[10px] font-black uppercase tracking-[0.4em] text-white/20">© 2026 L-SPA MEDELLÍN. TODOS LOS DERECHOS RESERVADOS.</p>
        <div class="flex gap-10 opacity-30">
          <Heart size={16} class="text-white" />
          <ShieldCheck size={16} class="text-white" />
          <Settings size={16} class="text-white" />
        </div>
      </div>
    </div>
  </footer>
</div>

<Toast />

<style>
  :global(.text-primary) {
    color: #8C1B58;
  }
  :global(.bg-primary) {
    background-color: #8C1B58;
  }
</style>
