<script lang="ts">
  import '../app.css';
  import Button from '$components/Button.svelte';
  import Toast from '$components/Toast.svelte';
  
  let { data, children } = $props();
</script>

<div class="app-container min-h-screen flex flex-col">
  <header class="navbar bg-white shadow-sm sticky top-0 z-50 p-4">
    <div class="max-w-7xl mx-auto flex justify-between items-center w-full">
      <a href="/" class="text-2xl font-serif font-bold tracking-tight text-primary uppercase">L-SPA</a>
      
      <nav class="hidden md:flex space-x-8 text-sm font-medium uppercase tracking-widest">
        <a href="/servicios" class="hover:text-primary transition-colors">Servicios</a>
        <a href="/nosotros" class="hover:text-primary transition-colors">Nosotros</a>
        <a href="/contacto" class="hover:text-primary transition-colors">Contacto</a>
      </nav>

      <div class="flex items-center space-x-4">
        <Button variant="ghost">Login</Button>
        <Button href="/booking">Reservar</Button>
      </div>
    </div>
  </header>

  <main class="flex-grow">
    {@render children?.()}
  </main>

  <footer class="bg-gray-50 border-t py-12 px-4">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 class="font-serif font-bold text-lg mb-4">L-SPA</h3>
        <p class="text-gray-500 text-sm">Bienestar y relajación total para tu cuerpo y mente.</p>
      </div>
      <div>
        <h4 class="font-bold text-xs uppercase tracking-widest mb-4">Servicios</h4>
        <ul class="space-y-2 text-sm text-gray-600">
          <li>Masajes</li>
          <li>Faciales</li>
          <li>Terapias</li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-xs uppercase tracking-widest mb-4">Legales</h4>
        <ul class="space-y-2 text-sm text-gray-600">
          <li>Políticas</li>
          <li>Cookies</li>
        </ul>
      </div>
      <div>
        <h4 class="font-bold text-xs uppercase tracking-widest mb-4">Contacto</h4>
        <p class="text-sm text-gray-600">Calle X, Ciudad Y<br>Tel: +123 456 789</p>
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
