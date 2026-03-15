<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  let { 
    id = "textarea-" + Math.floor(Math.random() * 1000000),
    label, 
    error, 
    errorId,
    value = $bindable(), 
    class: className = '',
    rows = 4,
    ...rest 
  } = $props<HTMLTextareaAttributes & {
    id?: string;
    label?: string;
    error?: string;
    errorId?: string;
    value?: string;
    placeholder?: string;
    class?: string;
    rows?: number;
  }>();

  const resolvedErrorId = $derived(errorId ?? (error ? `${id}-error` : undefined));
</script>

<div class="w-full space-y-1.5">
  {#if label}
    <label for={id} class="text-sm font-semibold text-gray-700 ml-1">
      {label}
    </label>
  {/if}
  <textarea
    {id}
    {rows}
    aria-describedby={resolvedErrorId}
    class={cn(
      'w-full bg-gray-50 border-0 border-b-2 border-secondary px-4 py-3 outline-none transition-all focus:border-primary focus:ring-0 placeholder:text-gray-400 text-gray-700 resize-none',
      error && 'border-red-500 focus:border-red-500 focus:ring-red-100',
      className
    )}
    bind:value
    {...rest}
  ></textarea>
  {#if error}
    <p id={resolvedErrorId} class="text-xs text-red-500 ml-1 mt-1 flex items-center gap-1" role="alert" aria-live="polite">
      <span>{error}</span>
    </p>
  {/if}
</div>