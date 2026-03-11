<script lang="ts">
  import AuthForm from '$lib/components/AuthForm.svelte';
  import { ShieldCheck } from 'lucide-svelte';
</script>

<div class="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(circle_at_top_right,_#8C1B5808_0%,_transparent_40%),radial-gradient(circle_at_bottom_left,_#8C1B5805_0%,_transparent_40%)]">
  <div class="mb-12 animate-fade-in-down">
    <a href="/" class="flex flex-col items-center gap-4">
      <div class="w-16 h-16 bg-primary rounded-3xl flex items-center justify-center text-white shadow-2xl shadow-primary/30 transform hover:scale-110 transition-transform duration-500">
        <ShieldCheck size={32} />
      </div>
      <span class="text-4xl font-black tracking-tighter text-gray-900 uppercase">L-SPA</span>
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
