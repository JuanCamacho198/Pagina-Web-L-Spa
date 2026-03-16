<script lang="ts">
  import { page } from '$app/stores';
  import { isAppError, type AppError } from '$lib/errors/types';
  import { ShieldX, Home, RefreshCw, Wifi, WifiOff, Lock, Server, AlertTriangle } from 'lucide-svelte';

  let { error } = $props();

  let isDev = $derived(import.meta.env.DEV);
  
  let errorData = $derived.by(() => {
    if (!error) return null;
    
    if (isAppError(error)) {
      return error as AppError;
    }
    
    if (error instanceof Error) {
      return {
        code: 'UNKNOWN_ERROR',
        message: error.message,
        status: (error as any)?.status,
        details: undefined,
        originalError: error,
      } as AppError;
    }
    
    if (typeof error === 'object' && error !== null) {
      const err = error as Record<string, unknown>;
      return {
        code: (err?.message as string)?.includes('auth') ? 'AUTH_ERROR' : 'UNKNOWN_ERROR',
        message: String(err?.message || 'An error occurred'),
        status: err?.status as number | undefined,
        details: err?.details as Record<string, unknown> | undefined,
        originalError: error,
      } as AppError;
    }
    
    return null;
  });

  let errorCode = $derived(errorData?.code || 'UNKNOWN_ERROR');
  let errorMessage = $derived(errorData?.message || 'An unexpected error occurred');
  let errorStatus = $derived(errorData?.status);
  let errorDetails = $derived(errorData?.details);
  let originalError = $derived(errorData?.originalError);

  function getErrorIcon(code: string) {
    switch (code) {
      case 'AUTH_ERROR': return Lock;
      case 'NETWORK_ERROR': return WifiOff;
      case 'RATE_LIMIT_ERROR': return AlertTriangle;
      case 'SERVER_ERROR': return Server;
      case 'VALIDATION_ERROR': return AlertTriangle;
      default: return ShieldX;
    }
  }

  function getErrorTitle(code: string): string {
    switch (code) {
      case 'AUTH_ERROR': return 'Error de Autenticación';
      case 'NETWORK_ERROR': return 'Error de Conexión';
      case 'RATE_LIMIT_ERROR': return 'Demasiadas Solicitudes';
      case 'SERVER_ERROR': return 'Error del Servidor';
      case 'VALIDATION_ERROR': return 'Error de Validación';
      default: return 'Algo Salió Mal';
    }
  }

  function getErrorDescription(code: string): string {
    switch (code) {
      case 'AUTH_ERROR': return 'Tu sesión ha expirado o no tienes permiso para acceder a este recurso.';
      case 'NETWORK_ERROR': return 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      case 'RATE_LIMIT_ERROR': return 'Has hecho demasiadas solicitudes. Por favor, espera un momento.';
      case 'SERVER_ERROR': return 'El servidor encontró un problema. Nuestro equipo ha sido notificado.';
      case 'VALIDATION_ERROR': return 'Los datos proporcionados no son válidos. Por favor, verifica la información.';
      default: return 'Ocurrió un error inesperado. Por favor, intenta de nuevo.';
    }
  }

  const ErrorIcon = $derived(getErrorIcon(errorCode));
</script>

<div class="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-gray-50 dark:bg-gray-900">
  <div class="max-w-lg w-full text-center">
    <div class="relative mb-8">
      <div class="w-24 h-24 mx-auto bg-linear-to-br from-rose-100 to-rose-200 dark:from-rose-900/30 dark:to-rose-800/20 rounded-full flex items-center justify-center shadow-xl shadow-rose-500/10">
        <ErrorIcon size={48} class="text-rose-500" />
      </div>
      {#if errorStatus}
        <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-sm font-black px-4 py-1 rounded-full">
          {errorStatus}
        </div>
      {/if}
    </div>

    <h1 class="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
      {getErrorTitle(errorCode)}
    </h1>

    <p class="text-gray-600 dark:text-gray-400 text-lg mb-8 leading-relaxed">
      {errorMessage || getErrorDescription(errorCode)}
    </p>

    {#if errorDetails && isDev}
      <div class="mb-8 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl text-left">
        <p class="text-amber-800 dark:text-amber-200 text-sm font-bold mb-2">Detalles del Error:</p>
        <pre class="text-xs text-amber-700 dark:text-amber-300 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(errorDetails, null, 2)}</pre>
      </div>
    {/if}

    {#if isDev && originalError}
      <div class="mb-8 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-left">
        <p class="text-red-800 dark:text-red-200 text-sm font-bold mb-2">Error Original:</p>
        {#if originalError instanceof Error}
          <p class="text-xs text-red-700 dark:text-red-300 font-mono mb-2">{originalError.name}: {originalError.message}</p>
          {#if originalError.stack}
            <pre class="text-xs text-red-600 dark:text-red-400 overflow-x-auto whitespace-pre-wrap max-h-48">{originalError.stack}</pre>
          {/if}
        {:else}
          <pre class="text-xs text-red-700 dark:text-red-300 overflow-x-auto whitespace-pre-wrap">{JSON.stringify(originalError, null, 2)}</pre>
        {/if}
      </div>
    {/if}

    <div class="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onclick={() => window.location.reload()}
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white font-black text-sm uppercase tracking-wider rounded-xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 hover:shadow-primary/40 hover:-translate-y-0.5"
      >
        <RefreshCw size={18} />
        Reintentar
      </button>
      
      <a
        href="/"
        class="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-black text-sm uppercase tracking-wider rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
      >
        <Home size={18} />
        Volver al Inicio
      </a>
    </div>

    {#if !isDev}
      <p class="mt-8 text-xs text-gray-400">
        Si el problema persiste, contacta al soporte técnico.
      </p>
    {/if}
  </div>
</div>
