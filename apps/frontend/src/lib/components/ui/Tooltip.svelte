<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { Snippet } from 'svelte';

  let { 
    id = "tooltip-" + Math.floor(Math.random() * 1000000),
    content,
    children,
    class: className = '',
    position = 'top'
  } = $props<{
    id?: string;
    content: string;
    children: Snippet;
    class?: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
  }>();

  let isVisible = $state(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  function showTooltip() {
    isVisible = true;
  }

  function hideTooltip() {
    isVisible = false;
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      isVisible = !isVisible;
    } else if (e.key === 'Escape') {
      isVisible = false;
    }
  }
</script>

<span 
  class="relative inline-flex"
  role="button"
  tabindex="0"
  aria-describedby={isVisible ? id : undefined}
  onmouseenter={showTooltip}
  onmouseleave={hideTooltip}
  onfocus={showTooltip}
  onblur={hideTooltip}
  onkeydown={handleKeydown}
>
  {@render children?.()}
  {#if isVisible}
    <span   
      id={id}
      role="tooltip"
      class={cn(
        'absolute z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded-md whitespace-nowrap shadow-lg',
        positionClasses[position],
        className
      )}
    >
      {content}
    </span>
  {/if}
</span>