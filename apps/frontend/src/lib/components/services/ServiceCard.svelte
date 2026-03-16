<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import StarRating from '../ui/StarRating.svelte';
  import Badge from '../ui/Badge.svelte';
  import { ArrowRight, Clock, ShoppingBag, Check, Heart } from 'lucide-svelte';
  import { slugify } from '$lib/utils/text';
  import { handleAddToCartLogic } from '$lib/logic/ServiceCardLogic';
  import { addToFavorites, checkIsFavorite, removeFromFavorites } from '$lib/favorites';
  import { toast } from '$lib/stores/toast.svelte';
  import { onMount } from 'svelte';
  import type { Service } from '$lib/types/service';

  let { service, class: className = '' } = $props<{
    service: Service;
    class?: string;
  }>();

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
  href="/servicios/{slugify(service.name)}"
  class={cn(
    "group relative bg-white rounded-spa-xl overflow-hidden border border-secondary/20 shadow-2xl shadow-primary/5 hover:shadow-primary/10 transition-all duration-500 hover:-translate-y-2 flex flex-col h-full",
    className
  )}
>
  <div class="relative h-64 overflow-hidden">
    {#if service.imageUrl || service.image_url}
      <img 
        src={service.imageUrl || service.image_url} 
        alt={service.name}
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    {:else if service.imageFileName}
      <img 
        src="/assets/{service.imageFileName}" 
        alt={service.name}
        loading="lazy"
        decoding="async"
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
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
      class="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-md shadow-lg transition-all duration-300 hover:scale-110"
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

    <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-2">
      <StarRating rating={4.5} size={14} readonly />
      <span class="text-xs font-bold text-gray-800">4.5</span>
    </div>
  </div>

  <div class="p-8 flex flex-col flex-1">
    <div class="mb-4">
      <div class="flex items-center justify-between gap-2 mb-2">
        <h3 class="text-2xl font-black text-gray-900 group-hover:text-primary transition-colors line-clamp-1">
          {service.name}
        </h3>
        <div class="p-2 bg-gray-50 rounded-xl group-hover:bg-primary group-hover:text-white transition-all duration-300">
           <ArrowRight size={18} class="group-hover:translate-x-0.5 transition-transform" />
        </div>
      </div>
      <p class="text-gray-500 text-sm leading-relaxed line-clamp-2 font-medium">
        {service.description || 'Disfruta de una experiencia única de bienestar y relajación diseñada especialmente para ti.'}
      </p>
    </div>

    <div class="flex flex-wrap gap-4 mb-8 mt-auto">
      <div class="flex items-center gap-2 text-gray-400 bg-gray-50/50 px-3 py-1.5 rounded-xl">
        <Clock size={14} class="text-primary/60" />
        <span class="text-[10px] font-black uppercase tracking-wider">{service.duration || 60} min</span>
      </div>
    </div>

    <div class="flex items-center justify-between gap-4 pt-6 border-t border-gray-100">
      <div class="flex flex-col">
        <span class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Inversión</span>
        <span class="text-2xl font-black text-gray-900">
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
            "h-12 w-12 flex items-center justify-center rounded-2xl border transition-all duration-300 shadow-sm",
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
