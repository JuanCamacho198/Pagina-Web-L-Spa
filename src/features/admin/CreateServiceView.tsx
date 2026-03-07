import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Image as ImageIcon, 
  Tag, 
  DollarSign, 
  Clock, 
  FileText, 
  X, 
  UploadCloud,
  CheckCircle2,
  AlertCircle as AlertIcon,
} from 'lucide-react';
import { createService } from '@/models/servicesModel';
import { ServiceFormValues } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';

// Esquema de validación con Zod
const serviceSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.coerce.number().positive('El precio debe ser un número positivo'),
  duration: z.coerce.number().int().positive('La duración debe ser en minutos'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  imageUrl: z.string().url('Debe ser una URL válida de imagen').optional().or(z.literal('')),
});

const CATEGORIES = [
  'Facial', 
  'Corporal', 
  'Masaje', 
  'Relax', 
  'Hidratación', 
  'Exfoliación', 
  'Aromaterapia'
];

export default function CreateServiceView() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<ServiceFormValues>({
    resolver: zodResolver(serviceSchema) as any,
    defaultValues: {
      category: '',
      imageUrl: ''
    }
  });

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('imageUrl', url);
    if (url.match(/\.(jpeg|jpg|gif|png|webp|avif)$/) != null || url.startsWith('http')) {
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  const onSubmit = async (data: ServiceFormValues) => {
    setLoading(true);
    setError(null);
    try {
      await createService({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        imageUrl: data.imageUrl || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80',
        duration: data.duration
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/services'), 2000);
    } catch (err: any) {
      setError(err.message || 'Ocurrió un error al crear el servicio');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center p-12 space-y-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold text-gray-900">¡Éxito!</h2>
            <p className="text-gray-500">El servicio ha sido creado correctamente.</p>
          </div>
          <p className="text-sm text-gray-400 italic">Redirigiendo al catálogo...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-10">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <button 
              onClick={() => navigate(-1)} 
              className="flex items-center gap-2 text-sm font-semibold text-primary"
            >
              <X size={16} /> Volver
            </button>
            <h1 className="text-4xl font-black text-gray-900">
              Crear Nuevo <span className="text-primary italic">Servicio</span>
            </h1>
            <p className="text-gray-500 font-medium">Agrega una nueva experiencia de bienestar a tu catálogo</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-gray-400" />
                  Detalles Generales
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                <Input
                  label="Nombre del Servicio"
                  {...register('name')}
                  placeholder="Ej: Masaje Relajante Premium"
                  error={errors.name?.message}
                />

                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Descripción</label>
                  <textarea
                    {...register('description')}
                    placeholder="Describe los beneficios..."
                    rows={4}
                    className={`w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-gray-400 text-gray-700 resize-none ${errors.description ? 'border-red-500' : ''}`}
                  />
                  {errors.description && <p className="text-xs text-red-500 ml-1 font-medium">{errors.description.message}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="Precio (USD)"
                    type="number"
                    step="0.01"
                    icon={<DollarSign size={18} />}
                    {...register('price')}
                    placeholder="0.00"
                    error={errors.price?.message}
                  />
                  <Input
                    label="Duración (min)"
                    type="number"
                    icon={<Clock size={18} />}
                    {...register('duration')}
                    placeholder="60"
                    error={errors.duration?.message}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-gray-400" />
                  Categorización
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setValue('category', cat)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        watch('category') === cat 
                        ? 'bg-primary text-white shadow-md scale-105' 
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                {errors.category && <p className="text-xs text-red-500 ml-1 font-medium">{errors.category.message}</p>}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5 text-gray-400" />
                  Imagen del Servicio
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-square w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <button 
                        type="button"
                        onClick={() => { setImagePreview(null); setValue('imageUrl', ''); }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-lg hover:bg-red-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <UploadCloud className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-xs text-gray-500">Pega una URL de imagen abajo</p>
                    </div>
                  )}
                </div>

                <Input
                  label="URL de la Imagen"
                  {...register('imageUrl')}
                  onChange={handleImageUrlChange}
                  placeholder="https://images.unsplash.com/..."
                  error={errors.imageUrl?.message}
                />
              </CardContent>
            </Card>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-700">
                <AlertIcon className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              className="w-full py-6 text-lg font-bold"
              isLoading={loading}
            >
              <PlusCircle size={20} className="mr-2" />
              Publicar Servicio
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
