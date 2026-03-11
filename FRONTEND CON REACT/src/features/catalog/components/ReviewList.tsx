import useSWR from 'swr';
import { fetcher } from '@/lib/fetcher';
import StarRating from '../../../components/ui/StarRating';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, MessageSquare } from 'lucide-react';

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
  };
}

interface ReviewListProps {
  serviceId: string;
}

const ReviewList: React.FC<ReviewListProps> = ({ serviceId }) => {
  const { data: reviews = [], error, isLoading } = useSWR<Review[]>(
    serviceId ? `/api/reviews?serviceId=${serviceId}` : null,
    fetcher
  );

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-4xlxl text-center">
        {error.message || 'Error al cargar las reseñas'}
      </div>
    );
  }

  if (reviews.length === 0) {
    return (
      <div className="text-center p-12 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-300">
        <MessageSquare className="mx-auto text-gray-300 mb-4" size={48} />
        <h4 className="text-xl font-bold text-gray-600">Aún no hay reseñas</h4>
        <p className="text-gray-500">Sé el primero en compartir tu experiencia.</p>
      </div>
    );
  }

  const averageRating = reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length;

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 p-6 bg-white rounded-4xlxl border border-gray-100 shadow-sm">
        <div className="text-center">
          <div className="text-5xl font-black text-primary">{averageRating.toFixed(1)}</div>
          <div className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Puntuación</div>
        </div>
        <div className="h-12 w-px bg-gray-100"></div>
        <div className="flex-1">
          <StarRating rating={Math.round(averageRating)} readonly size={20} />
          <p className="text-sm text-gray-500 mt-1 font-medium">Basado en {reviews.length} {reviews.length === 1 ? 'reseña' : 'reseñas'}</p>
        </div>
      </div>

      <div className="grid gap-6">
        {reviews.map((review) => (
          <div key={review.id} className="bg-white p-6 rounded-4xl shadow-sm border border-gray-50 hover:border-primary/20 transition-colors">
            <div className="flex justify-between items-start mb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                  <User size={20} />
                </div>
                <div>
                  <h5 className="font-bold text-gray-900 leading-tight">
                    {review.user.firstName} {review.user.lastName}
                  </h5>
                  <span className="text-xs text-gray-400 font-medium">
                    {format(new Date(review.createdAt), "d 'de' MMMM, yyyy", { locale: es })}
                  </span>
                </div>
              </div>
              <StarRating rating={review.rating} readonly size={16} />
            </div>
            {review.comment && (
              <p className="text-gray-600 leading-relaxed font-medium">
                "{review.comment}"
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReviewList;
