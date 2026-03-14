<script lang="ts">
  import { cn } from '$lib/utils/cn';

  type Props = {
    class?: string;
    variant?: 'rectangular' | 'circular' | 'text';
  };

  let props: Props = $props();

  const variantClasses = {
    rectangular: 'rounded-4xl',
    circular: 'rounded-full',
    text: 'rounded-md h-4 w-full',
  };
</script>

<div class={cn("animate-pulse bg-gray-200/80", variantClasses[props.variant ?? 'rectangular'], props.class ?? '')}></div>
