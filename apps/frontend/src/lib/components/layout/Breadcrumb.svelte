<script lang="ts">
  import { ChevronRight } from 'lucide-svelte';

  interface BreadcrumbItem {
    label: string;
    href?: string;
  }

  interface Props {
    items: BreadcrumbItem[];
    class?: string;
  }

  let { items, class: className = '' }: Props = $props();
</script>

<nav class="flex items-center gap-4 text-[10px] font-bold uppercase tracking-[0.3em] animate-in fade-in duration-700 {className}" aria-label="Breadcrumb">
  {#each items as item, i}
    {#if i > 0}
      <ChevronRight size={14} strokeWidth={1.5} class="text-gray-300 dark:text-gray-700 shrink-0" />
    {/if}
    {#if item.href && i < items.length - 1}
      <a
        href={item.href}
        class="text-gray-400 dark:text-gray-500 hover:text-primary dark:hover:text-primary-light transition-colors duration-150"
      >
        {item.label}
      </a>
    {:else}
      <span class="text-primary dark:text-primary-light">{item.label}</span>
    {/if}
  {/each}
</nav>
