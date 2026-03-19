<script lang="ts">
  import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin, Clock, ShieldCheck } from 'lucide-svelte';
  import { page } from '$app/stores';
  import { getLocalizedPath } from '$lib/i18n/utils';
  import { getBrandingWithDefaults, DEFAULT_BRANDING, type BrandingConfig } from '$lib/config/branding';
  import { _ } from 'svelte-i18n';
  import logoImage from '$lib/assets/logos/LOGO4x-sinfondo.png';

  // Accept branding prop or load defaults
  interface Props {
    branding?: BrandingConfig;
  }
  
  let { branding }: Props = $props();
  
  // Use provided branding or load from localStorage
  let currentBranding = $derived(branding || getBrandingWithDefaults());

  let currentLang = $derived($page.params.lang || 'es');

  const currentYear = new Date().getFullYear();

  const config = {
    description: "Tu refugio de bienestar y relajación. Expertos en masajes, tratamientos faciales y cuidado personal.",
    social: { 
      facebook: "https://facebook.com/lspa", 
      instagram: "https://instagram.com/lspa", 
      whatsapp: "https://wa.me/1234567890" 
    },
    logoSize: 48
  };

  const sectionTitleClass = "text-lg font-display font-bold mb-4 text-primary-light";
  const linkClass = "text-gray-400 hover:text-white transition-colors duration-500 text-sm";
  const iconLinkClass = "bg-primary/20 p-2 rounded-full hover:bg-primary transition-all duration-500 transform hover:scale-110 flex items-center justify-center text-primary-light hover:text-white";
</script>

<footer class="bg-slate-900 text-white pt-16 pb-8" aria-label="Información del pie de página">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      
      <!-- Brand Section -->
      <div class="space-y-4">
        <div class="flex items-center gap-3">
          {#if currentBranding.customLogo}
            <img 
              src={currentBranding.customLogo} 
              alt="L-SPA logo" 
              loading="lazy"
              decoding="async"
              class="w-auto brightness-110 object-contain"
              style="height: {currentBranding.logoSize}px"
            />
          {:else}
            <enhanced:img 
              src={logoImage}
              alt="L-SPA logo" 
              class="w-auto brightness-110 object-contain" 
              style="height: {currentBranding.logoSize}px"
            />
          {/if}
          <h4 class="text-xl font-bold tracking-tight uppercase">L-SPA</h4>
        </div>
        <p class="text-gray-400 text-sm leading-relaxed">
          {currentBranding.footerText || DEFAULT_BRANDING.footerText}
        </p>
        <div class="flex gap-4 pt-2">
          <a href={config.social.facebook} class={iconLinkClass} aria-label="Facebook"><Facebook size={20} /></a>
          <a href={config.social.instagram} class={iconLinkClass} aria-label="Instagram"><Instagram size={20} /></a>
          <a href={config.social.whatsapp} class={iconLinkClass} aria-label="WhatsApp"><MessageCircle size={20} /></a>
        </div>
      </div>

      <!-- Contact Section -->
      <div>
        <h4 class={sectionTitleClass}>{$_('footer.contactSection.title')}</h4>
        <ul class="space-y-3">
          <li class="flex items-start gap-3 text-sm text-gray-400">
            <MapPin size={18} class="text-primary shrink-0" />
            <span>{$_('footer.contactSection.address')}</span>
          </li>
          <li class="flex items-center gap-3 text-sm text-gray-400">
            <Phone size={18} class="text-primary shrink-0" />
            <span>{$_('footer.contactSection.phone')}</span>
          </li>
          <li class="flex items-center gap-3 text-sm text-gray-400">
            <Mail size={18} class="text-primary shrink-0" />
            <a href="mailto:contacto@l-spa.com" class="hover:text-white">{$_('footer.contactSection.email')}</a>
          </li>
        </ul>
      </div>

      <!-- Hours Section -->
      <div>
        <h4 class={sectionTitleClass}>{$_('footer.hoursSection.title')}</h4>
        <ul class="space-y-2">
          <li class="flex items-center gap-3 text-sm text-gray-400">
            <Clock size={16} class="text-primary" />
            <div class="flex flex-col">
              <span>{$_('footer.hoursSection.weekdays')}</span>
              <span class="text-white font-medium">{$_('footer.hoursSection.weekdaysTime')}</span>
            </div>
          </li>
          <li class="flex flex-col gap-1 text-sm text-gray-400 pl-7">
            <span>{$_('footer.hoursSection.saturday')}</span>
            <span class="text-white font-medium">{$_('footer.hoursSection.saturdayTime')}</span>
          </li>
          <li class="flex flex-col gap-1 text-sm text-gray-400 pl-7">
            <span>{$_('footer.hoursSection.sunday')}</span>
            <span class="text-red-400 font-medium">{$_('footer.hoursSection.closed')}</span>
          </li>
        </ul>
      </div>

      <!-- Navigation Section -->
      <div>
        <h4 class={sectionTitleClass}>{$_('footer.infoSection.title')}</h4>
        <ul class="space-y-2">
          <li><a href={getLocalizedPath('/politicas/cancelacion', currentLang)} class={linkClass}>{$_('footer.infoSection.cancellationPolicy')}</a></li>
          <li><a href={getLocalizedPath('/politicas/datos', currentLang)} class={linkClass}>{$_('footer.infoSection.dataTreatment')}</a></li>
          <li><a href={getLocalizedPath('/informacion-importante', currentLang)} class={linkClass}>{$_('footer.infoSection.bookingInfo')}</a></li>
          <li><a href={getLocalizedPath('/preguntas-frecuentes', currentLang)} class={linkClass}>{$_('footer.infoSection.faq')}</a></li>
          <li class="pt-2"><a href={getLocalizedPath('/politicas/cookies', currentLang)} class={linkClass}>{$_('footer.infoSection.cookies')}</a></li>
          <li><a href={getLocalizedPath('/politicas/privacidad', currentLang)} class={linkClass}>{$_('footer.infoSection.privacy')}</a></li>
        </ul>
      </div>

    </div>

    <div class="pt-8 mt-8 border-t border-gray-800 text-center">
      <p class="text-gray-500 text-xs">
        © {currentYear} L-Spa. {$_('footer.rights')}
      </p>
    </div>
  </div>
</footer>
