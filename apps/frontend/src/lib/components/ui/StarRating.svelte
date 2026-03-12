<script lang="ts">
  import { Star } from 'lucide-svelte';
  import { cn } from '$lib/utils/cn';
  import { calculateStarState } from '$lib/logic/StarRatingLogic';

  interface Props {
    rating: number;
    maxRating?: number;
    onRatingChange?: (rating: number) => void;
    readonly?: boolean;
    size?: number;
  }

  let { 
    rating, 
    maxRating = 5, 
    onRatingChange = () => {}, 
    readonly = false, 
    size = 24 
  }: Props = $props();

  let hoverRating = $state(0);

  const handleClick = (value: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(value);
    }
  };
</script>

<div 
  role="group" 
  aria-label="Calificación con estrellas" 
  class="flex items-center gap-1.5" 
  onmouseleave={() => !readonly && (hoverRating = 0)}
>
  {#each Array(maxRating) as _, index}
    {@const { starValue, isActive } = calculateStarState(index, hoverRating, rating)}
    
    <button
      type="button"
      disabled={readonly}
      onclick={() => handleClick(starValue)}
      onmouseenter={() => !readonly && (hoverRating = starValue)}
      class={cn(
        "transition-all duration-300 transform outline-none",
        readonly ? 'cursor-default' : 'cursor-pointer hover:scale-125 active:scale-95 focus:ring-4 focus:ring-amber-100 rounded-full p-0.5',
        isActive && !readonly && "scale-110"
      )}
      aria-label="Calificar con {starValue} de {maxRating} estrellas"
    >
      <Star
        size={size}
        class={cn(
          "transition-all duration-300",
          isActive 
            ? 'fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]' 
            : 'text-gray-200'
        )}
      />
    </button>
  {/each}
</div>
