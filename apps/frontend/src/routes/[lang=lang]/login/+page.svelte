<svelte:head>
  <title>Login | L-SPA Premium Wellness</title>
</svelte:head>

<script lang="ts">
  import AuthForm from '$components/forms/AuthForm.svelte';
  import { ShieldCheck, } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { getLocalizedPath } from '$lib/i18n/utils';

  let currentLang = $derived($page.params.lang || 'es');
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,#8C1B5808_0%,transparent_40%),radial-gradient(circle_at_bottom_left,#8C1B5805_0%,transparent_40%)]">
  <h1 class="sr-only">L-SPA - Iniciar Sesión</h1>
  <div class="mb-12 animate-fade-in-down">
    <a href={getLocalizedPath('/', currentLang)} class="flex flex-col items-center gap-4">
      <div class="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 transform hover:scale-110 transition-transform duration-500">
        <ShieldCheck size={32} />
      </div>
      <span class="font-display text-4xl font-black tracking-tighter text-gray-900 uppercase">L-SPA</span>
    </a>
  </div>

  <div class="w-full max-w-md animate-fade-in-up">
    <AuthForm />
  </div>

  <p class="mt-12 text-sm font-medium text-gray-400">
    &copy; 2026 L-SPA. Todos los derechos reservados.
  </p>
</div>

<style>
  @keyframes fade-in-down {
    from { opacity: 0; transform: translateY(-20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in-down { animation: fade-in-down 0.8s ease-out; }
  .animate-fade-in-up { animation: fade-in-up 1s ease-out both; animation-delay: 0.2s; }
</style>
