<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
    children?: any;
  }

  let { 
    hoverable = false, 
    class: className = '', 
    children,
    ...rest 
  }: Props = $props();
</script>

<div
  class={cn(
    'bg-white rounded-4xl border border-gray-100 shadow-sm overflow-visible',
    hoverable && 'transition-all hover:shadow-md hover:border-primary/20',
    className
  )}
  {...rest}
>
  {@render children?.()}
</div>
