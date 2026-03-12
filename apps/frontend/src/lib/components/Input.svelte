<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    label?: string;
    error?: string;
    icon?: any;
    value?: string | number | string[] | null | undefined;
  }

  let { 
    id = `input-${Math.random().toString(36).substring(2, 9)}`,
    label, 
    error, 
    icon, 
    value = $bindable(), 
    class: className = '', 
    ...rest 
  }: Props = $props();
</script>

<div class="w-full space-y-1.5">
  {#if label}
    <label for={id} class="text-sm font-semibold text-gray-700 ml-1">
      {label}
    </label>
  {/if}
  <div class="relative group">
    {#if icon}
      <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
        {@render icon?.()}
      </div>
    {/if}
    <input
      id={id}
      class={cn(
        'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400 text-gray-700',
        icon && 'pl-10',
        error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
        className
      )}
      bind:value
      {...rest}
    />
  </div>
  {#if error}
    <p class="text-xs text-red-500 ml-1 mt-1 flex items-center gap-1">
      <span>{error}</span>
    </p>
  {/if}
</div>
