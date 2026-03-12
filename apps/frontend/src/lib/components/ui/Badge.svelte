<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { HTMLAttributes } from 'svelte/elements';

  interface Props extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'outline' | 'destructive';
    children?: any;
    class?: string;
  }

  let props: Props = $props();
  let { 
    variant = 'default', 
    class: className = '', 
    children,
    ...rest 
  } = props;

  const variants = {
    default: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    outline: 'border-gray-200 text-gray-600 bg-transparent',
    destructive: 'bg-red-50 text-red-600 border-red-100',
  };
</script>

<span
  class={cn(
    'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
    variants[variant],
    className
  )}
  {...rest}
>
  {@render children?.()}
</span>
