<script lang="ts">
  import { onMount } from 'svelte';
  import { cn } from '$lib/utils/cn';
  import type { Snippet } from 'svelte';

  interface DropdownItem {
    label: string;
    onClick: () => void;
    icon?: any; // Lucide icons
    variant?: 'default' | 'danger';
  }

  interface Props {
    trigger: Snippet;
    items: DropdownItem[];
    align?: 'left' | 'right';
    class?: string;
  }

  let { trigger, items, align = 'right', class: className = '' } = $props();

  let isOpen = $state(false);
  let dropdownRef = $state(null);

  const toggle = () => (isOpen = !isOpen);
  const close = () => (isOpen = false);

  const handleClickOutside = (event) => {
    if (dropdownRef && !dropdownRef.contains(event.target)) {
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
  <div 
    onclick={toggle}
    onkeydown={(e) => e.key === 'Enter' && toggle()}
    role="button"
    tabindex="0"
    class="cursor-pointer outline-none"
  >
    {@render trigger()}
  </div>

  {#if isOpen}
    <div 
      class={cn(
        "absolute top-full mt-2 bg-white border border-gray-100 rounded-4xl shadow-2xl p-2 min-w-45 z-50",
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
              "flex items-center gap-3 px-3 py-2.5 rounded-4xll transition-all w-full text-left font-medium",
              item.variant === 'danger' 
                ? 'text-red-500 hover:bg-red-50' 
                : 'text-gray-600 hover:bg-gray-50 active:scale-95'
            )}
          >
            {#if item.icon}
              <span class="shrink-0 opacity-70">
                <item.icon size={18} />
              </span>
            {/if}
            {item.label}
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>
