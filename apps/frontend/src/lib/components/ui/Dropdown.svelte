<script lang="ts">
  import { cn } from '$lib/utils/cn';

  let { 
    items = [], 
    trigger, 
    align = 'left', 
    class: className = '' 
  } = $props<{
    items?: any[];
    trigger: any;
    align?: 'left' | 'right' | 'center';
    class?: string;
  }>();

  let isOpen = $state(false);
  let dropdownRef = $state<HTMLElement | null>(null);

  const toggle = () => (isOpen = !isOpen);
  const close = () => (isOpen = false);

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      close();
    }
  };

  $effect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  });
</script>

<div class={cn("relative inline-block", className)} bind:this={dropdownRef}>
  <button
    onclick={toggle}
    onkeydown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), toggle())}
    type="button"
    class="cursor-pointer outline-none"
    aria-expanded={isOpen}
    aria-haspopup="true"
  >
    {@render trigger()}
  </button>

  {#if isOpen}
    <div 
      class={cn(
        "absolute top-full mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl p-2 min-w-50 z-50",
        "animate-in fade-in zoom-in-95 duration-200 ease-out",
        align === 'right' ? 'right-0' : 'left-0'
      )}
    >
      <div class="flex flex-col gap-1 text-sm">
        {#each items as item}
          <button
            onclick={() => {
              item.onClick();
              close();
            }}
            class={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all w-full text-left font-medium",
              item.variant === 'danger' 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-600 hover:bg-gray-50 active:scale-95'
            )}
          >
            {item.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
