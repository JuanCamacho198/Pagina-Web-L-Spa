import { toast } from '$lib/stores/toast.svelte';

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

        this.isSubmitting = true;
        try {
            const response = await fetch('http://localhost:3000/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    serviceId: this.serviceId,
                    rating: this.rating,
                    comment: this.comment,
                    // En un sistema real vendría de la sesión de Auth0
                    userName: 'Usuario de Prueba' 
                })
            });

            if (response.ok) {
                toast.success('¡Gracias por tu reseña!');
                this.rating = 0;
                this.comment = '';
                this.onSuccess();
            } else {
                throw new Error('Error al enviar reseña');
            }
        } catch (error) {
            console.error('Review submission error:', error);
            toast.error('No pudimos enviar tu reseña en este momento.');
        } finally {
            this.isSubmitting = false;
        }
    };

    updateRating = (val: number) => {
        this.rating = val;
    };
}
