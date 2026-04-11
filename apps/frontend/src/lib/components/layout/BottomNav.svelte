<script lang="ts">
  import { Home, CalendarDays, ShoppingCart, Sparkles } from 'lucide-svelte';
  import { getLocalizedPath } from '$lib/i18n/utils';

  interface Props {
    currentLang: string;
    labels?: {
      home: string;
      services: string;
      bookings: string;
      profileOrCart: string;
      navAria: string;
    };
  }

  let {
    currentLang,
    labels = {
      home: 'Inicio',
      services: 'Servicios',
      bookings: 'Reservas',
      profileOrCart: 'Carrito',
      navAria: 'Navegacion inferior'
    }
  }: Props = $props();

  const links = $derived([
    {
      label: labels.home,
      href: getLocalizedPath('/', currentLang),
      icon: Home,
      aria: labels.home
    },
    {
      label: labels.services,
      href: getLocalizedPath('/servicios', currentLang),
      icon: Sparkles,
      aria: labels.services
    },
    {
      label: labels.bookings,
      href: getLocalizedPath('/mis-reservas', currentLang),
      icon: CalendarDays,
      aria: labels.bookings
    },
    {
      label: labels.profileOrCart,
      href: getLocalizedPath('/carrito', currentLang),
      icon: ShoppingCart,
      aria: labels.profileOrCart
    }
  ]);
</script>

<nav
  aria-label={labels.navAria}
  class="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-md lg:hidden"
  style="padding-bottom: max(env(safe-area-inset-bottom), 0px);"
>
  <ul class="mx-auto grid h-16 max-w-2xl grid-cols-4">
    {#each links as link}
      <li>
        <a
          href={link.href}
          aria-label={link.aria}
          class="flex h-full w-full min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 text-[10px] font-black uppercase tracking-[0.18em] text-gray-600 transition-colors duration-300 hover:text-primary"
        >
          <link.icon size={18} aria-hidden="true" />
          <span>{link.label}</span>
        </a>
      </li>
    {/each}
  </ul>
</nav>
