<script lang="ts">
  import { onMount } from 'svelte';
  import StarRating from './StarRating.svelte';
  import Typography from './Typography.svelte';
  import Skeleton from './Skeleton.svelte';
  import { User, MessageSquare, Calendar } from 'lucide-svelte';

  interface Review {
    id: string;
    userName: string;
    comment: string;
    rating: number;
    createdAt: string;
  }

  interface Props {
    serviceId: string;
    key?: number;
  }

  let { serviceId, key = 0 }: Props = $props();
  let reviews = $state<Review[]>([]);
  let isLoading = $state(true);

  const fetchReviews = async () => {
    isLoading = true;
    try {
      const response = await fetch(`http://localhost:3000/api/reviews?serviceId=${serviceId}`);
      if (response.ok) {
        reviews = await response.json();
      }
    } catch (e) {
      console.error('Error fetching reviews:', e);
    } finally {
      isLoading = false;
    }
  };

  $effect(() => {
    // Re-fetch when serviceId or key changes
    if (serviceId || key) {
        fetchReviews();
    }
  });
</script>

<div class="space-y-8">
  {#if isLoading}
    {#each Array(3) as _}
        <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm animate-pulse">
            <div class="flex items-center gap-4 mb-4">
                <Skeleton variant="circular" class="w-12 h-12" />
                <div class="space-y-2 flex-1">
                    <Skeleton variant="text" class="w-24 h-4" />
                    <Skeleton variant="text" class="w-16 h-3" />
                </div>
            </div>
            <Skeleton variant="text" class="w-full h-4" />
            <Skeleton variant="text" class="w-3/4 h-4 mt-2" />
        </div>
    {/each}
  {:else if reviews.length === 0}
    <div class="text-center py-20 bg-gray-50/50 rounded-[40px] border border-dashed border-gray-200">
      <MessageSquare size={48} class="text-gray-200 mx-auto mb-6" />
      <h3 class="text-xl font-bold text-gray-900 mb-2">Sin reseñas aún</h3>
      <p class="text-gray-400 font-medium max-w-xs mx-auto">Sé el primero en compartir tu experiencia sobre este servicio.</p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-6">
      {#each reviews as review (review.id)}
        <div class="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm hover:shadow-xl hover:scale-[1.01] transition-all duration-500 group">
          <div class="flex items-center justify-between gap-4 mb-6">
            <div class="flex items-center gap-4">
              <div class="h-14 w-14 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-500 border border-primary/10">
                <User size={28} />
              </div>
              <div>
                <h4 class="text-base font-black text-gray-900 leading-none mb-1">{review.userName || 'Usuario Anónimo'}</h4>
                <div class="flex items-center gap-2">
                  <Calendar size={12} class="text-primary/50" />
                  <span class="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div class="bg-amber-50 px-4 py-2 rounded-2xl border border-amber-100/50 flex items-center gap-2">
              <StarRating rating={review.rating} size={14} readonly />
              <span class="text-xs font-black text-amber-700">{review.rating}</span>
            </div>
          </div>
          
          <div class="relative pl-10">
            <div class="absolute left-0 top-0 text-5xl font-serif text-primary/10 leading-none">“</div>
            <p class="text-gray-600 font-medium leading-relaxed italic z-10 relative">
              {review.comment}
            </p>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
