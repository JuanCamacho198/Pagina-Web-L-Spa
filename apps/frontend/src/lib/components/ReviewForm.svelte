<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import StarRating from './StarRating.svelte';
  import Button from './Button.svelte';
  import Typography from './Typography.svelte';
  import { toast } from './Toast.svelte';
  import { MessageSquare, Send, Sparkles } from 'lucide-svelte';

  interface Props {
    serviceId: string;
    onSubmitted: () => void;
  }

  let { serviceId, onSubmitted }: Props = $props();
  
  let rating = $state(0);
  let comment = $state('');
  let isSubmitting = $state(false);

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault();
    if (rating === 0) {
      toast.warning('Por favor selecciona una calificación');
      return;
    }
    if (comment.length < 10) {
      toast.warning('Tu comentario debe tener al menos 10 caracteres');
      return;
    }

    isSubmitting = true;
    try {
      const response = await fetch('http://localhost:3000/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId,
          rating,
          comment,
          // En un sistema real vendría de la sesión de Auth0
          userName: 'Usuario de Prueba' 
        })
      });

      if (response.ok) {
        toast.success('¡Gracias por tu reseña!');
        rating = 0;
        comment = '';
        onSubmitted();
      } else {
        throw new Error('Error al enviar reseña');
      }
    } catch (e) {
      toast.error('No pudimos enviar tu reseña en este momento.');
    } finally {
      isSubmitting = false;
    }
  };
</script>

<form onsubmit={handleSubmit} class="space-y-10 group">
  <div class="space-y-6">
    <div class="flex items-center gap-4">
      <div class="h-10 w-10 rounded-2xl bg-white border border-gray-100 shadow-sm flex items-center justify-center text-primary transform group-hover:rotate-12 transition-transform duration-500">
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
            rating={rating} 
            onRatingChange={(val) => (rating = val)} 
            size={32}
          />
        </div>
      </div>

      <div class="mt-10 space-y-4">
        <div class="relative group/field">
          <textarea
            bind:value={comment}
            placeholder="Comparte los detalles de tu experiencia..."
            class="w-full min-h-40 p-6 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-primary/20 focus:bg-white focus:outline-none transition-all duration-300 font-medium text-gray-700 resize-none shadow-inner"
            required
          ></textarea>
          <div class="absolute right-6 bottom-6 h-1 w-10 bg-primary/20 rounded-full transition-all group-focus-within/field:w-20 group-focus-within/field:bg-primary opacity-20"></div>
        </div>
        
        <p class="text-[10px] text-gray-400 font-bold uppercase tracking-widest pl-4">
          Mínimo 10 caracteres • {comment.length} caracteres
        </p>
      </div>
    </div>
  </div>

  <Button
    type="submit"
    class="w-full py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-primary/20 hover:shadow-primary/40 active:scale-95 transition-all duration-300 group-hover:-translate-y-1"
    isLoading={isSubmitting}
  >
    Publicar Experiencia
    <Send size={20} class="ml-3 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
  </Button>
</form>
