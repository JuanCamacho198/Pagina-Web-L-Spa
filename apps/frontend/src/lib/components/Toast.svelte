<script lang="ts" module>
  export type ToastType = 'success' | 'error' | 'info' | 'warning';
  
  export interface Toast {
    id: string;
    message: string;
    type: ToastType;
  }

  // Estado global para los toasts usando un rune de Svelte 5
  export let toasts = $state<Toast[]>([]);

  export function addToast(message, type = 'info') {
    const id = Math.random().toString(36).substring(2, 9);
    toasts.push({ id, message, type });
    
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  }

  export function removeToast(id) {
    const index = toasts.findIndex(t => t.id === id);
    if (index !== -1) {
      toasts.splice(index, 1);
    }
  }

  export const toast = {
    success: function(msg) { addToast(msg, 'success') },
    error: function(msg) { addToast(msg, 'error') },
    info: function(msg) { addToast(msg, 'info') },
    warning: function(msg) { addToast(msg, 'warning') },
  };
</script>

<script lang="ts">
  import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-svelte';
  import { cn } from '$lib/utils/cn';
  import { flip } from 'svelte/animate';
  import { fly, fade } from 'svelte/transition';

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };
</script>

<div class="fixed bottom-6 right-6 z-200 flex flex-col gap-3 max-w-95 w-full pointer-events-none">
  {#each toasts as t (t.id)}
    <div 
      animate:flip={{ duration: 300 }}
      in:fly={{ x: 100, duration: 400, opacity: 0 }}
      out:fade={{ duration: 200 }}
      class={cn(
        "pointer-events-auto flex items-start gap-4 p-4 border rounded-3xl shadow-2xl backdrop-blur-sm transition-all relative overflow-hidden",
        t.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-800 shadow-emerald-100' :
        t.type === 'error' ? 'bg-rose-50 border-rose-100 text-rose-800 shadow-rose-100' :
        t.type === 'info' ? 'bg-sky-50 border-sky-100 text-sky-800 shadow-sky-100' :
        'bg-amber-50 border-amber-100 text-amber-800 shadow-amber-100'
      )}
    >
      <!-- Accent Line -->
      <div class={cn("absolute left-0 top-0 bottom-0 w-1.5", 
        t.type === 'success' ? 'bg-emerald-500' :
        t.type === 'error' ? 'bg-rose-500' :
        t.type === 'info' ? 'bg-sky-500' :
        'bg-amber-500'
      )}></div>

      <div class={cn("shrink-0 mt-0.5", 
        t.type === 'success' ? 'text-emerald-500' :
        t.type === 'error' ? 'text-rose-500' :
        t.type === 'info' ? 'text-sky-500' :
        'text-amber-500'
      )}>
        {#if icons[t.type]}
          {@const Icon = icons[t.type]}
          <Icon size={24} strokeWidth={2.5} />
        {/if}
      </div>
      
      <div class="flex-1">
        <p class="text-[14px] font-bold leading-tight">
          {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
        </p>
        <p class="text-[13px] font-medium opacity-90 leading-snug mt-1">
          {t.message}
        </p>
      </div>

      <button 
        onclick={() => removeToast(t.id)}
        aria-label="Cerrar notificación"
        class="shrink-0 p-1.5 text-black/20 hover:text-black/60 rounded-xl hover:bg-black/5 transition-all active:scale-90"
      >
        <X size={18} />
      </button>
    </div>
  {/each}
</div>
