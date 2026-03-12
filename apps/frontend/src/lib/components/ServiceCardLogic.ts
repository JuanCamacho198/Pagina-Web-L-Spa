import { cart } from '$lib/cart';
import { toast } from '$lib/stores/toast.svelte';
import { slugify } from '$lib/utils/text';
import type { Service } from '$lib/types/service';

export const handleAddToCartLogic = (service: Service, setIsAdded: (val: boolean) => void) => {
  cart.addItem({
    serviceId: service.id,
    slug: slugify(service.name),
    name: service.name || "Servicio",
    price: Number(service.price) || 0,
    image: service.imageUrl || service.image_url || ''
  });
  
  setIsAdded(true);
  toast.success(`${service.name} añadido al carrito`);
  
  setTimeout(() => {
    setIsAdded(false);
  }, 2000);
};
