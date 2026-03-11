<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import StarRating from './StarRating.svelte';
  import Button from './Button.svelte';
  import Badge from './Badge.svelte';
  import { ArrowRight, Clock, Banknote, ShoppingBag, Check } from 'lucide-svelte';
  import type { Service } from '@l-spa/shared-types/services';
  import { cart } from '$lib/cart';
  import { toast } from './Toast.svelte';

  interface Props {
    service: Service;
    class?: string;
  }

  let { service, class: className = '' } = $props<Props>();

  let isAdded = $state(false);

  const handleAddToCart = () => {
    cart.addItem({
      serviceId: service.id,
      slug: slugify(service.name),
      name: service.name,
      price: Number(service.price),
      image: service.image_url || ''
    });
    
    isAdded = true;
    toast.success(`${service.name} añadido al carrito`);
    
    setTimeout(() => {
      isAdded = false;
    }, 2000);
  };

  const slugify = (name: string) => 
    name.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, '-');
</script>

<div class={cn(
  "group relative bg-white rounded-4xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col h-full",
  className
)}>
  <!-- Image Container -->
  <div class="relative h-64 overflow-hidden">
    {#if service.image_url}
      <img 
        src={service.image_url} 
        alt={service.name}
        class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
    {:else}
      <div class="w-full h-full bg-gray-100 flex items-center justify-center">
        <span class="text-gray-400 font-medium">Sin imagen</span>
      </div>
    {/if}
    
    <!-- Category Badge Over Image -->
    <div class="absolute top-4 left-4">
      <Badge variant="primary" class="bg-white/90 backdrop-blur-md text-primary font-bold shadow-lg border-none px-4 py-2 rounded-2xl">
        {service.category || 'General'}
      </Badge>
    </div>

    <!-- Rating Overlay -->
    <div class="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-2xl shadow-lg flex items-center gap-2">
      <StarRating rating={4.5} size={14} readonly />
      <span class="text-xs font-bold text-gray-800">4.5</span>
    </div>
  </div>

  <!-- Content -->
  <div class="p-8 flex flex-col flex-1">
    <div class="mb-4">
      <h3 class="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-1">
        {service.name}
      </h3>
      <p class="text-gray-500 text-sm leading-relaxed line-clamp-3 font-medium">
        {service.description || 'Disfruta de una experiencia única de bienestar y relajación diseñada especialmente para ti.'}
      </p>
    </div>

    <!-- Features -->
    <div class="flex flex-wrap gap-4 mb-8 mt-auto">
      <div class="flex items-center gap-2 text-gray-400">
        <Clock size={16} class="text-primary/60" />
        <span class="text-xs font-bold uppercase tracking-wider">{service.duration || 60} min</span>
      </div>
      <div class="flex items-center gap-2 text-gray-400">
        <Banknote size={16} class="text-primary/60" />
        <span class="text-xs font-bold uppercase tracking-wider">${service.price} MXN</span>
      </div>
    </div>

    <!-- Action -->
    <div class="flex items-center justify-between gap-4 pt-6 border-t border-gray-50">
      <div class="flex flex-col">
        <span class="text-[10px] uppercase tracking-widest text-gray-400 font-bold">Desde</span>
        <span class="text-xl font-black text-gray-900">${service.price}</span>
      </div>
      
      <div class="flex items-center gap-2">
        <button 
          onclick={handleAddToCart}
          disabled={isAdded}
          class={cn(
            "p-3 rounded-2xl border transition-all duration-300",
            isAdded 
              ? "bg-emerald-50 border-emerald-100 text-emerald-500 scale-95" 
              : "bg-gray-50 border-gray-100 text-gray-400 hover:bg-primary/5 hover:border-primary/20 hover:text-primary"
          )}
          aria-label="Añadir al carrito"
        >
          {#if isAdded}
            <div class="animate-in zoom-in duration-300">
               <Check size={20} strokeWidth={3} />
            </div>
          {:else}
            <ShoppingBag size={20} strokeWidth={2.5} />
          {/if}
        </button>

        <Button 
          href="/servicios/{slugify(service.name)}"
          class="rounded-2xl px-6 py-3 font-bold shadow-xl shadow-primary/10 group-hover:shadow-primary/20"
        >
          Detalles
          <ArrowRight size={18} class="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  </div>
</div>
