<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import StarRating from '../ui/StarRating.svelte';
  import Button from '../ui/Button.svelte';
  import { Sparkles, Send } from 'lucide-svelte';
  import { ReviewFormLogic, type ReviewFormProps } from '$lib/logic/ReviewFormLogic';

  let props: ReviewFormProps = $props();
  const logic = new ReviewFormLogic(props);
</script>

<form onsubmit={logic.handleSubmit} class="space-y-10 group">
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <div class="h-10 w-10 rounded-full bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary transform group-hover:rotate-12 transition-transform duration-500">
        <Sparkles size={20} />
      </div>
      <div>
        <h3 class="text-xl font-black text-gray-900 leading-none mb-1 tracking-tight">Escribir Reseña</h3>
        <p class="text-[10px] font-black uppercase tracking-widest text-gray-400 opacity-60">Tu opinión nos ayuda a mejorar</p>
      </div>
    </div>

    <div class="bg-white/80 backdrop-blur-md p-8 rounded-[28px] border border-white/50 shadow-2xl shadow-primary/5 transition-all hover:bg-white duration-500">
      <div class="flex flex-col items-center gap-6 text-center">
        <span class="text-xs font-black uppercase tracking-widest text-primary/60">¿Cómo fue tu experiencia?</span>
        <div class="scale-125 transform transition-transform duration-500 hover:scale-150">
          <StarRating 
            rating={logic.rating} 
            onRatingChange={logic.updateRating} 
            size={32}
          />
        </div>
      </div>

      <div class="mt-10 space-y-4">
        <div class="relative group/field">
          <textarea
            bind:value={logic.comment}
            placeholder="Comparte los detalles de tu experiencia..."
            class="w-full min-h-40 p-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all duration-300 font-medium text-gray-700 resize-none shadow-inner"
            required
          ></textarea>
          <div class="absolute right-6 bottom-6 h-1 w-0 bg-primary/20 rounded-full transition-all group-focus-within/field:w-20 group-focus-within/field:bg-primary opacity-20"></div>
        </div>
        
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-4">
          Mínimo 10 caracteres • {logic.comment.length} caracteres
        </p>
      </div>
    </div>
  </div>

  <Button
    type="submit"
    class="w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all duration-300 group-hover:-translate-y-1"
    isLoading={logic.isSubmitting}
  >
    Publicar Experiencia
    <Send size={20} class="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
  </Button>
</form>
