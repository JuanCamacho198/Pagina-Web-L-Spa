<script lang="ts">
  import { cn } from '$lib/utils/cn';

  interface Props {
    class?: string;
    variant?: 'rectangular' | 'circular' | 'text';
  }

  let { class: className = '', variant = 'rectangular' }: Props = $props();

  const variantClasses = {
    rectangular: 'rounded-4xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  };
</script>

<div
  class={cn(
    "animate-pulse bg-gray-200/80",
    variantClasses[variant],
    className
  )}
></div>
