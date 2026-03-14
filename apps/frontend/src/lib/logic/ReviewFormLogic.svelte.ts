import { toast } from '$lib/stores/toast.svelte';
import { useQueryClient, createMutation } from '@tanstack/svelte-query';

export interface ReviewFormProps {
    serviceId: string;
    onSubmitted: () => void;
}

export class ReviewFormLogic {
    rating = $state(0);
    comment = $state('');
    isSubmitting = $state(false);
    serviceId: string;
    onSuccess: () => void;
    queryClient = useQueryClient();

    mutation = createMutation({
        mutationFn: async (reviewData: any) => {
            const response = await fetch('http://localhost:3000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reviewData)
            });
            if (!response.ok) throw new Error('Error al enviar reseña');
            return response.json();
        },
        onSuccess: () => {
            this.queryClient.invalidateQueries({ queryKey: ['reviews', this.serviceId] });
            toast.success('¡Gracias por tu reseña!');
            this.rating = 0;
            this.comment = '';
            this.onSuccess();
        },
        onError: (error) => {
            console.error('Review submission error:', error);
            toast.error('No pudimos enviar tu reseña en este momento.');
        }
    });

    constructor(props: ReviewFormProps) {
        this.serviceId = props.serviceId;
        this.onSuccess = props.onSubmitted;
    }

    handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        
        if (this.rating === 0) {
            toast.warning('Por favor selecciona una calificación');
            return;
        }
        
        if (this.comment.length < 10) {
            toast.warning('Tu comentario debe tener al menos 10 caracteres');
            return;
        }

        $this.mutation.mutate({
            serviceId: this.serviceId,
            rating: this.rating,
            comment: this.comment,
            userName: 'Usuario de Prueba' 
        });
    };

    updateRating = (val: number) => {
        this.rating = val;
    };

    // Helper para el estado de carga
    get loading() {
        return $this.mutation.isPending;
    }
}
