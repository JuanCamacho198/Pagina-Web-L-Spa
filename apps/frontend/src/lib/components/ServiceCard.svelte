<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import StarRating from './StarRating.svelte';
  import Badge from './Badge.svelte';
  import { ArrowRight, Clock, ShoppingBag, Check } from 'lucide-svelte';
  import { slugify } from '$lib/utils/text';
  import { handleAddToCartLogic } from './ServiceCardLogic';
  import type { Service } from '$lib/types/service';

  let { service, class: className = '' } = $props<{
    service: Service;
    class?: string;
  }>();

  let isAdded = $state(false);

  const handleAddToCart = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleAddToCartLogic(service, (val) => isAdded = val);
  };
</script>

<a 
  href="/servicios/{slugify(service.name)}"
  class={cn(
    "group relative bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full",
    className
  )}
>
  <div class="relative h-64 overflow-hidden">
    {#if service.imageUrl || service.image_url}
      <img 
        src={service.imageUrl || service.image_url} 
        alt={service.name}
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    {:else if service.imageFileName}
      <img 
        src="/assets/{service.imageFileName}" 
        alt={service.name}
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    {:else}
      <div class="w-full h-full bg-gray-100 flex items-center justify-center">
        <span class="text-gray-400 font-medium">Sin imagen</span>
      </div>
    {/if}
    
    <div class="absolute top-4 left-4">
      <Badge variant="primary" class="bg-white/90 backdrop-blur-md text-primary font-bold shadow-lg border-none px-4 py-2 rounded-2xl">
        {service.category || 'General'}
      </Badge>
    </div>

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
        <button 
          onclick={handleAddToCart}
          disabled={isAdded}
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
