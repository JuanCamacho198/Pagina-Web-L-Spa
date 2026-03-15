<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  let { 
    variant = 'primary', 
    size = 'md', 
    isLoading = false, 
    href,
    class: className = '', 
    children,
    ...rest 
  } = $props<HTMLButtonAttributes & {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'sm' | 'md' | 'lg';
    isLoading?: boolean;
    href?: string;
    children?: Snippet;
  }>();

  const variantStyles = {
    primary: 'bg-primary text-white hover:bg-primary-light shadow-lg hover:shadow-xl hover:-translate-y-0.5',
    secondary: 'bg-secondary text-primary hover:bg-secondary/80 focus:ring-secondary/20',
    outline: 'border-2 border-primary text-primary hover:bg-primary/5',
    ghost: 'text-primary-dark hover:bg-secondary/50',
    accent: 'bg-accent text-white hover:bg-accent/90',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs uppercase tracking-wider',
    md: 'px-8 py-4 text-sm uppercase tracking-widest',
    lg: 'px-12 py-5 text-base uppercase tracking-[0.2em]',
  };

  const styles = $derived(cn(
    'inline-flex items-center justify-center font-bold transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-full focus:ring-4 focus:ring-primary/20 outline-none',
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
