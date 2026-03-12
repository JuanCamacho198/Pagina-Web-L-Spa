<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLButtonAttributes {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    href?: string;
    children?: Snippet;
  }

  let { 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    href,
    class: className = '', 
    children,
    ...rest 
  } = $props<Props>();

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary/90 shadow-md hover:shadow-lg',
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

  const styles = $derived(cn(
    'inline-flex items-center justify-center font-bold tracking-tight transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-2xl',
    variantStyles[variant],
    sizes[size],
    className
  ));
</script>

{#if href}
  <a {href} class={styles}>
    {@render children?.()}
  </a>
{:else}
  <button
    class={styles}
    disabled={isLoading || rest.disabled}
    {...rest}
  >
    {#if isLoading}
      <span class="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></span>
    {/if}
    {@render children?.()}
  </button>
{/if}
