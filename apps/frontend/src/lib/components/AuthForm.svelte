<script lang="ts">
  import { authClient } from '$lib/auth-client';
  import { toast } from '$lib/components/Toast.svelte';
  import Button from './Button.svelte';
  import Input from './Input.svelte';
  import Typography from './Typography.svelte';
  import { Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-svelte';

  let isLogin = $state(true);
  let isLoading = $state(false);

  let email = $state('');
  let password = $state('');
  let name = $state('');

  const handleAuth = async (e: Event) => {
    e.preventDefault();
    isLoading = true;

    try {
      if (isLogin) {
        const { data, error } = await authClient.signIn.email({
          email,
          password,
        });
        if (error) {
          toast.error(error.message || 'Error al iniciar sesión');
        } else {
          toast.success('¡Bienvenido de nuevo!');
          window.location.reload();
        }
      } else {
        const { data, error } = await authClient.signUp.email({
          email,
          password,
          name,
        });
        if (error) {
          toast.error(error.message || 'Error al registrarte');
        } else {
          toast.success('Cuenta creada con éxito');
          isLogin = true;
        }
      }
    } catch (e) {
      toast.error('Ocurrió un error inesperado');
    } finally {
      isLoading = false;
    }
  };
</script>

<div class="w-full max-w-md mx-auto p-8 bg-white rounded-4xl border border-gray-100 shadow-2xl">
  <div class="text-center mb-8">
    <Typography variant="h2" class="text-3xl mb-2">
      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
    </Typography>
    <Typography variant="body" class="text-gray-500">
      {isLogin ? 'Entra a tu oasis de relajación' : 'Únete a la experiencia de L-SPA'}
    </Typography>
  </div>

  <form onsubmit={handleAuth} class="space-y-6">
    {#if !isLogin}
      <Input
        label="Nombre Completo"
        placeholder="Juan Pérez"
        bind:value={name}
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
      bind:value={email}
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
      bind:value={password}
      required
    >
      {#snippet icon()}
        <Lock size={18} />
      {/snippet}
    </Input>

    <Button type="submit" class="w-full py-4 rounded-2xl group" disabled={isLoading}>
      {#if isLoading}
        <Loader2 class="animate-spin mr-2" size={20} />
        Cargando...
      {:else}
        {isLogin ? 'Entrar' : 'Registrarme'}
        <ArrowRight class="ml-2 group-hover:translate-x-1 transition-transform" size={18} />
      {/if}
    </Button>
  </form>

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
