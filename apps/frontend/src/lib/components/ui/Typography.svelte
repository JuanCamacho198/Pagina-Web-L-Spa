<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { HTMLAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  let { 
    variant = 'p', 
    as, 
    class: className = '', 
    children,
    ...rest 
  } = $props<HTMLAttributes<HTMLElement> & {
    variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'p' | 'lead' | 'small';
    as?: string;
    children?: Snippet;
    class?: string;
  }>();

  const variants = {
    h1: 'font-display text-4xl font-extrabold tracking-tight lg:text-5xl text-gray-900',
    h2: 'font-display text-3xl font-semibold tracking-tight first:mt-0 text-gray-800',
    h3: 'font-display text-2xl font-semibold tracking-tight text-gray-800',
    h4: 'font-display text-xl font-semibold tracking-tight text-gray-800',
    p: 'font-sans leading-7 [&:not(:first-child)]:mt-6 text-gray-700',
    lead: 'font-sans text-xl text-gray-600',
    small: 'font-sans text-sm font-medium leading-none text-gray-500',
  };

  let tag = $derived(as || (['h1', 'h2', 'h3', 'h4'].includes(variant) ? variant : 'p'));
</script>

<svelte:element
  this={tag}
  class={cn(variants[variant], className)}
  {...rest}
>
  {@render children?.()}
</svelte:element>
