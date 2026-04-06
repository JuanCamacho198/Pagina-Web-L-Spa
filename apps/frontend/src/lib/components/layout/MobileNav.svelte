<script lang="ts">
  import { Menu, X } from 'lucide-svelte';

  type NavLink = {
    name: string;
    path: string;
  };

  interface Props {
    links: NavLink[];
    navLabel?: string;
    openMenuLabel?: string;
    closeMenuLabel?: string;
  }

  let {
    links,
    navLabel = 'Mobile navigation',
    openMenuLabel = 'Open menu',
    closeMenuLabel = 'Close menu'
  }: Props = $props();

  const drawerId = 'mobile-navigation-drawer';
  const drawerTitleId = 'mobile-navigation-title';
  let isOpen = $state(false);

  function closeDrawer() {
    isOpen = false;
  }

  function toggleDrawer() {
    isOpen = !isOpen;
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeDrawer();
    }
  }

  $effect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    if (isOpen) {
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  });

  $effect(() => {
    if (typeof window === 'undefined' || !isOpen) {
      return;
    }

    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeDrawer();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  });
</script>

<div class="lg:hidden">
  <button
    type="button"
    class="inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800"
    aria-controls={drawerId}
    aria-expanded={isOpen}
    aria-haspopup="dialog"
    aria-label={isOpen ? closeMenuLabel : openMenuLabel}
    onclick={toggleDrawer}
  >
    {#if isOpen}
      <X size={22} aria-hidden="true" />
    {:else}
      <Menu size={22} aria-hidden="true" />
    {/if}
  </button>

  <div
    role="dialog"
    aria-modal="true"
    aria-labelledby={drawerTitleId}
    class={`fixed inset-0 z-[70] bg-black/45 transition-opacity duration-300 ease-out ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
    onclick={handleBackdropClick}
    aria-hidden={!isOpen}
  >
    <nav
      id={drawerId}
      class={`absolute right-0 top-0 h-full w-72 max-w-[85vw] border-l border-primary/10 bg-white p-6 shadow-2xl transition-transform duration-300 ease-out dark:border-gray-700 dark:bg-gray-900 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      aria-label={navLabel}
    >
      <div class="mb-6 flex items-center justify-between">
        <p id={drawerTitleId} class="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">Menu</p>
        <button
          type="button"
          class="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors duration-300 hover:bg-gray-100 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800"
          aria-label={closeMenuLabel}
          onclick={closeDrawer}
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      <ul class="space-y-1" role="list">
        {#each links as link}
          <li>
            <a
              href={link.path}
              class="block rounded-xl px-4 py-3 text-xs font-black uppercase tracking-[0.25em] text-gray-600 transition-colors duration-300 hover:bg-primary/8 hover:text-primary dark:text-gray-300 dark:hover:bg-gray-800"
              onclick={closeDrawer}
            >
              {link.name}
            </a>
          </li>
        {/each}
      </ul>
    </nav>
  </div>
</div>
