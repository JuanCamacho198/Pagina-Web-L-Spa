<script lang="ts">
  import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-svelte';
  import Button from '../ui/Button.svelte';
  import Input from '../ui/Input.svelte';
  import Typography from '../ui/Typography.svelte';
  import { AuthFormLogic } from '$lib/logic/AuthFormLogic';

  const logic = new AuthFormLogic();
</script>

<div class="w-full max-w-md mx-auto p-8 bg-white rounded-4xl border border-gray-100 shadow-2xl">
  <div class="text-center mb-8">
    <Typography variant="h2" class="text-3xl mb-2">
      {logic.isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
    </Typography>
    <Typography variant="body" class="text-gray-500">
      {logic.isLogin ? 'Entra a tu oasis de relajación' : 'Únete a la experiencia de L-SPA'}
    </Typography>
  </div>

  <form onsubmit={logic.handleAuth} class="space-y-6">
    {#if !logic.isLogin}
      <Input
        label="Nombre Completo"
        placeholder="Juan Pérez"
        bind:value={logic.name}
        required
      >
        {#snippet icon()}
          <User size={18} />
        {/snippet}
      </Input>
    {/if}

    <Input
      label="Correo Electrónico"
      type="email"
      placeholder="tu@email.com"
      bind:value={logic.email}
      required
    >
      {#snippet icon()}
        <Mail size={18} />
      {/snippet}
    </Input>

    <Input
      label="Contraseña"
      type="password"
      placeholder="••••••••"
      bind:value={logic.password}
      required
    >
      {#snippet icon()}
        <Lock size={18} />
      {/snippet}
    </Input>

    <Button type="submit" class="w-full py-4 rounded-2xl group" disabled={logic.isLoading}>
      {#if logic.isLoading}
        <Loader2 class="animate-spin mr-2" size={20} />
        Cargando...
      {:else}
        {logic.isLogin ? 'Entrar' : 'Registrarme'}
        <ArrowRight class="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
      {/if}
    </Button>
  </form>

  <div class="mt-8 text-center border-t border-gray-100 pt-8">
    <button 
      onclick={logic.toggleMode}
      class="text-sm font-bold text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"
    >
      {logic.isLogin ? '¿No tienes cuenta? Crea una oasis' : '¿Ya eres parte de L-SPA? Entra'}
    </button>
  </div>
</div>

  <div class="mt-8 pt-6 border-t border-gray-100 text-center">
    <button 
      type="button"
      onclick={() => (isLogin = !isLogin)}
      class="text-sm font-bold text-gray-500 hover:text-primary transition-colors"
    >
      {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
    </button>
  </div>
</div>
