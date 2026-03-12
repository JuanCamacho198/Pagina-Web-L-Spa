<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { HTMLInputAttributes } from 'svelte/elements';

  let { 
    id = "input-" + Math.floor(Math.random() * 1000000),
    label, 
    error, 
    value = $bindable(), 
    class: className = '',
    type = 'text',
    ...rest 
  } = $props<HTMLInputAttributes & {
    id?: string;
    label?: string;
    error?: string;
    value?: string | number;
    placeholder?: string;
    class?: string;
    type?: string;
  }>();
</script>

<div class="w-full space-y-1.5">
  {#if label}
    <label for={id} class="text-sm font-semibold text-gray-700 ml-1">
      {label}
    </label>
  {/if}
  <div class="relative group">
    <input
      {id}
      {type}
      class={cn(
        'w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400 text-gray-700',
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
