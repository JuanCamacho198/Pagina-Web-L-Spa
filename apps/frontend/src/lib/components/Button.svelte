<script lang="ts">
  import { cn } from '$lib/utils/cn'; // Crearemos este helper
  import type { HTMLButtonAttributes } from 'svelte/elements';

  interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    href?: string;
    children?: any;
  }

  let { 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    class: className = '', 
    children,
    ...rest 
  } = $props<Props>();

  const variants = {
    primary: 'bg-primary text-white hover:bg-primary-light shadow-md hover:shadow-lg',
    secondary: 'bg-accent text-white hover:bg-accent/90',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'text-primary-dark hover:bg-secondary',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };
</script>

<button
  class={cn(
    'inline-flex items-center justify-center font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-xl',
    variants[variant],
    sizes[size],
    className
  )}
  disabled={isLoading || rest.disabled}
  {...rest}
>
  {#if isLoading}
    <span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
  {/if}
  {@render children?.()}
</button>
