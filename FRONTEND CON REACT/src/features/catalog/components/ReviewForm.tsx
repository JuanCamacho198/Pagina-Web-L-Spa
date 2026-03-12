import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import StarRating from '../../../components/ui/StarRating';
import { MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface ReviewFormProps {
  serviceId: string;
  onReviewSubmitted?: () => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ serviceId, onReviewSubmitted }) => {
  const { user, isAuthenticated } = useAuth0();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isEligible, setIsEligible] = useState(false);
  const [checkingEligibility, setCheckingEligibility] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    const checkEligibility = async () => {
      if (!isAuthenticated || !user?.sub || !serviceId) {
        setCheckingEligibility(false);
        return;
      }

      try {
        const response = await fetch(`/api/appointments?auth0Id=${user.sub}`);
        if (response.ok) {
          const appointments = await response.json();
          // Solo elegible si tiene al menos una cita 'completed' para este servicio
          const hasCompletedService = appointments.some(
            (app: any) => app.serviceId === serviceId && app.status === 'completed'
          );
          setIsEligible(hasCompletedService);
        }
      } catch (err) {
        console.error('Error checking review eligibility:', err);
      } finally {
        setCheckingEligibility(false);
      }
    };

    checkEligibility();
  }, [isAuthenticated, user?.sub, serviceId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setNotification({ message: 'Por favor selecciona una calificación', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    try {
      // Obtenemos el ID del usuario desde la API
      const userResponse = await fetch(`/api/users?auth0Id=${user!.sub!}`);
      if (!userResponse.ok) throw new Error('Error al obtener datos del usuario');
      const userResult = await userResponse.json();
      
      const userId = userResult.id;

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, serviceId, rating, comment }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al enviar la reseña');
      }

      setNotification({ message: '¡Gracias por tu reseña!', type: 'success' });
      setRating(0);
      setComment('');
      if (onReviewSubmitted) onReviewSubmitted();
    } catch (err: any) {
      setNotification({ message: err.message, type: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (checkingEligibility) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8 bg-amber-50 rounded-[2.5rem] border border-amber-100 text-center">
        <p className="text-amber-800 font-bold mb-4">Inicia sesión para compartir tu experiencia.</p>
        <button 
          onClick={() => window.location.href = '/login'} 
          className="px-6 py-2 bg-amber-200 text-amber-900 rounded-full font-bold hover:bg-amber-300 transition-colors"
        >
          Iniciar Sesión
        </button>
      </div>
    );
  }

  if (!isEligible) {
    return (
      <div className="p-8 bg-gray-100 rounded-[2.5rem] border border-gray-200 text-center">
        <AlertCircle className="mx-auto text-gray-400 mb-3" size={32} />
        <h5 className="text-lg font-bold text-gray-700">Reseña no disponible</h5>
        <p className="text-gray-500 max-w-sm mx-auto">
          Para dejar una reseña, primero debes completar una reserva de este servicio. 
          ¡Queremos conocer tu opinión real!
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-gray-100">
      <h3 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
        <MessageSquare className="text-primary" /> Comparte tu opinión
      </h3>

      {notification && (
        <div className={`mb-6 p-4 rounded-4xl flex items-center gap-3 font-medium ${
          notification.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'
        }`}>
          {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {notification.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">
            Calificación
          </label>
          <StarRating rating={rating} onRatingChange={setRating} size={32} />
        </div>

        <div>
          <label className="block text-sm font-black text-gray-500 uppercase tracking-widest mb-3">
            Comentario (opcional)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="¿Qué tal fue tu experiencia?..."
            className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-4xl focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all min-h-30"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting || rating === 0}
          className="w-full py-4 bg-primary text-white font-black rounded-4xl hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/20 flex items-center justify-center gap-3 disabled:opacity-50 disabled:transform-none"
        >
          {isSubmitting ? (
            <div className="w-5 h-13 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            <>
              <Send size={20} />
              Enviar Reseña
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ReviewForm;
