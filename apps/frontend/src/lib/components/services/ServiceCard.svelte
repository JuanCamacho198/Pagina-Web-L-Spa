<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import StarRating from '../ui/StarRating.svelte';
  import Badge from '../ui/Badge.svelte';
  import OptimizedImage from '../ui/OptimizedImage.svelte';
  import { ArrowRight, Clock, ShoppingBag, Check, Heart } from 'lucide-svelte';
  import { slugify } from '$lib/utils/text';
  import { handleAddToCartLogic } from '$lib/logic/ServiceCardLogic';
  import { addToFavorites, checkIsFavorite, removeFromFavorites } from '$lib/favorites';
  import { toast } from '$lib/stores/toast.svelte';
  import { onMount } from 'svelte';
  import type { Service } from '$lib/types/service';
  import { page } from '$app/stores';
  import { getLocalizedPath } from '$lib/i18n/utils';

  let { service, class: className = '' } = $props<{
    service: Service;
    class?: string;
  }>();

  let currentLang = $derived($page.params.lang || 'es');

  let isAdded = $state(false);
  let isFavorite = $state(false);

  // Check if service is favorite on mount
  onMount(async () => {
    if (service?.id) {
      isFavorite = await checkIsFavorite(service.id);
    }
  });

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCartLogic(service, (val) => isAdded = val);
  };

  const handleToggleFavorite = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!service?.id) return;
    
    // Optimistic update - toggle immediately
    const newFavoriteState = !isFavorite;
    isFavorite = newFavoriteState;
    
    // Show toast
    toast.success(newFavoriteState ? `${service.name} añadido a favoritos` : `${service.name} eliminado de favoritos`);
    
    // Send to API in background
    try {
      if (newFavoriteState) {
        await addToFavorites(service.id);
      } else {
        await removeFromFavorites(service.id);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Revert on error
      isFavorite = !newFavoriteState;
      toast.error('Error al actualizar favoritos');
    }
  };
</script>

<a 
  href={getLocalizedPath(`/servicios/${slugify(service.name)}`, currentLang)}
  class={cn(
    "group relative bg-white rounded-spa-xl overflow-hidden border border-secondary/20 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full",
    className
  )}
>
  <div class="relative h-56 overflow-hidden sm:h-60 lg:h-64">
    {#if service.imageUrl || service.image_url || service.imageFileName}
      <OptimizedImage 
        src={service.imageUrl || service.image_url || ''} 
        cloudinaryId={service.cloudinaryId}
        alt={service.name}
        class="w-full h-full transition-transform duration-700 group-hover:scale-110"
      />
    {:else}
      <div class="w-full h-full bg-gray-100 flex items-center justify-center">
        <span class="text-gray-400 font-medium">Sin imagen</span>
      </div>
    {/if}
    
    <div class="absolute top-4 left-4">
      <Badge variant="default" class="bg-white/90 backdrop-blur-md text-primary font-bold shadow-lg border-none px-4 py-2 rounded-2xl">
        {service.category || 'General'}
      </Badge>
    </div>

    <!-- Favorite Button - Top Right -->
    <button 
      onclick={handleToggleFavorite}
      class="absolute right-3 top-3 z-10 flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-full bg-white/90 shadow-lg backdrop-blur-md transition-all duration-300 hover:scale-110 sm:right-4 sm:top-4"
      aria-label={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      <Heart 
        size={18} 
        class={cn(
          "transition-all duration-300",
          isFavorite ? "fill-rose-500 text-rose-500" : "text-gray-400 hover:text-rose-500"
        )} 
      />
    </button>

    <div class="absolute bottom-3 right-3 flex items-center gap-2 rounded-2xl bg-white/90 px-3 py-1.5 shadow-lg backdrop-blur-md sm:bottom-4 sm:right-4">
      <StarRating rating={4.5} size={14} readonly />
      <span class="text-xs font-bold text-gray-800">4.5</span>
    </div>
  </div>

  <div class="flex flex-1 flex-col p-5 sm:p-6 lg:p-8">
    <div class="mb-3 sm:mb-4">
      <div class="mb-2 flex items-center justify-between gap-2">
        <h3 class="line-clamp-1 text-xl font-black text-gray-900 transition-colors group-hover:text-primary lg:text-2xl">
          {service.name}
        </h3>
        <div class="rounded-xl bg-gray-50 p-2 transition-all duration-300 group-hover:bg-primary group-hover:text-white">
           <ArrowRight size={18} class="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
      <p class="line-clamp-2 text-[13px] font-medium leading-relaxed text-gray-500 sm:text-sm">
        {service.description || 'Disfruta de una experiencia única de bienestar y relajación diseñada especialmente para ti.'}
      </p>
    </div>

    <div class="mt-auto mb-6 flex flex-wrap gap-3 sm:mb-8 sm:gap-4">
      <div class="flex items-center gap-2 rounded-xl bg-gray-50/50 px-3 py-1.5 text-gray-400">
        <Clock size={14} class="text-primary/60" />
        <span class="text-[10px] font-black uppercase tracking-wider">{service.duration || 60} min</span>
      </div>
    </div>

    <div class="flex items-center justify-between gap-3 border-t border-gray-100 pt-4 sm:gap-4 sm:pt-6">
      <div class="flex flex-col">
        <span class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Inversión</span>
        <span class="text-xl font-black text-gray-900 lg:text-2xl">
          {Number(service.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 })}
        </span>
      </div>
      
      <div class="flex items-center gap-3">
        <!-- Add to Cart Button -->
        <button 
          onclick={handleAddToCart}
          disabled={isAdded}
          aria-label={isAdded ? 'Añadido al carrito' : 'Añadir al carrito'}
          class={cn(
            "flex h-11 w-11 min-h-[44px] min-w-[44px] items-center justify-center rounded-2xl border transition-all duration-300 shadow-sm lg:h-12 lg:w-12",
            isAdded 
              ? "bg-emerald-50 border-emerald-100 text-emerald-500 scale-95" 
              : "bg-white border-gray-100 text-gray-400 hover:bg-primary hover:border-primary hover:text-white hover:shadow-lg hover:shadow-primary/20"
          )}
        >
          {#if isAdded}
            <div class="animate-in zoom-in duration-300">
               <Check size={20} strokeWidth={3} class="text-emerald-500" />
            </div>
          {:else}
            <ShoppingBag size={20} strokeWidth={2.5} />
          {/if}
        </button>
      </div>
    </div>
  </div>
</a>
