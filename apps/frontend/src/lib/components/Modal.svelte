<script lang="ts">
  import { X } from 'lucide-svelte';
  import { cn } from '$lib/utils/cn';
  import Typography from './Typography.svelte';
  import type { Snippet } from 'svelte';

  interface Props {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: Snippet;
    footer?: Snippet;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  }

  let { 
    isOpen, 
    onClose, 
    title, 
    children, 
    footer, 
    size = 'md' 
  }: Props = $props();

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-[95%] h-[95%]',
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) onClose();
  };

  $effect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEscape);
    } else {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEscape);
    }
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 sm:pb-24">
    <!-- Overlay -->
    <div 
      class="absolute inset-0 bg-black/40 backdrop-blur-md transition-opacity animate-in fade-in duration-300"
      onclick={onClose}
      aria-hidden="true"
    />
    
    <!-- Modal Content -->
    <div 
      class={cn(
        "relative w-full bg-white shadow-2xl rounded-[32px] overflow-hidden transition-all transform animate-in fade-in zoom-in-95 duration-200",
        sizeClasses[size]
      )}
    >
      <div class="flex items-center justify-between p-6 sm:px-8 border-b border-gray-100">
        <Typography variant="h4" class="!mb-0 font-bold text-gray-900">
          {title}
        </Typography>
        <button 
          onclick={onClose}
          class="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-2xl transition-all active:scale-90"
        >
          <X size={24} />
        </button>
      </div>

      <div class="p-6 sm:p-8 overflow-y-auto max-h-[calc(100vh-16rem)]">
        {@render children()}
      </div>

      {#if footer}
        <div class="p-6 sm:px-8 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          {@render footer()}
        </div>
      {/if}
    </div>
  </div>
{/if}
