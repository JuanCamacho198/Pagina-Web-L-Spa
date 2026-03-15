<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { HTMLAttributes } from 'svelte/elements';

  let { 
    hoverable = false, 
    class: className = '', 
    children,
    ...rest 
  } = $props<HTMLAttributes<HTMLDivElement> & {
    hoverable?: boolean;
    children?: any;
  }>();
</script>

<div
  class={cn(
    'bg-white rounded-spa-xl border border-secondary/20 shadow-spa overflow-visible transition-all duration-500',
    hoverable && 'hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary/10',
    className
  )}
  {...rest}
>
  {@render children?.()}
</div>
