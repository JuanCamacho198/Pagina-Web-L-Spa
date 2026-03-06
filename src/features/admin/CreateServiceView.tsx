// src/features/admin/CreateServiceView.tsx
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
  AlertCircle,
  Loader2
} from 'lucide-react';
import { createService } from '../../models/servicesModel';

// Esquema de validación con Zod
const serviceSchema = z.object({
  nombre: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  descripcion: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  precio: z.coerce.number().positive('El precio debe ser un número positivo'),
  duracion: z.coerce.number().int().positive('La duración debe ser en minutos'),
  categoria: z.string().min(1, 'La categoría es obligatoria'),
  imagenURL: z.string().url('Debe ser una URL válida de imagen').or(z.string().min(0)),
});

type ServiceFormValues = z.infer<typeof serviceSchema>;

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
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      categoria: '',
      imagenURL: ''
    }
  });

  const imageUrl = watch('imagenURL');

  // Función para manejar el cambio de imagen por URL
  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setValue('imagenURL', url);
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
      // Mapeamos los campos del formulario a los que espera el modelo (basado en lo visto en ServiceDetailView)
      // Ajuste según schema.ts: Nombre, Descripcion, Precio, Categoria, imagenURL, Duracion
      await createService({
        Nombre: data.nombre,
        Descripcion: data.descripcion,
        Precio: data.precio,
        Categoria: data.categoria,
        imagenURL: data.imagenURL || 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&q=80',
        Duracion: data.duracion
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
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-sm w-full text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle2 className="text-green-600 w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">¡Servicio Creado!</h2>
          <p className="text-gray-600">El nuevo servicio ha sido añadido al catálogo correctamente.</p>
          <div className="pt-4">
            <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-3 bg-primary/10 rounded-xl">
            <PlusCircle className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Crear Nuevo Servicio</h1>
            <p className="text-gray-500">Completa la información para el catálogo del SPA</p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Columna Izquierda: Información Principal */}
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Detalles Generales
              </h3>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Nombre del Servicio</label>
                <input
                  {...register('nombre')}
                  placeholder="Ej: Masaje Relajante Premium"
                  className={`w-full px-4 py-2 rounded-xl border ${errors.nombre ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-primary outline-none transition-all`}
                />
                {errors.nombre && <p className="text-xs text-red-500 mt-1">{errors.nombre.message}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Descripción</label>
                <textarea
                  {...register('descripcion')}
                  placeholder="Describe los beneficios y el procedimiento..."
                  rows={4}
                  className={`w-full px-4 py-2 rounded-xl border ${errors.descripcion ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-primary outline-none transition-all resize-none`}
                />
                {errors.descripcion && <p className="text-xs text-red-500 mt-1">{errors.descripcion.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Precio (USD)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      {...register('precio')}
                      placeholder="0.00"
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border ${errors.precio ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-primary outline-none`}
                    />
                  </div>
                  {errors.precio && <p className="text-xs text-red-500 mt-1">{errors.precio.message}</p>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Duración (min)</label>
                  <div className="relative">
                    <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="number"
                      {...register('duracion')}
                      placeholder="60"
                      className={`w-full pl-10 pr-4 py-2 rounded-xl border ${errors.duracion ? 'border-red-500 bg-red-50' : 'border-gray-200'} focus:ring-2 focus:ring-primary outline-none`}
                    />
                  </div>
                  {errors.duracion && <p className="text-xs text-red-500 mt-1">{errors.duracion.message}</p>}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Tag className="w-5 h-5 text-gray-400" />
                Categorización
              </h3>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setValue('categoria', cat)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      watch('categoria') === cat 
                      ? 'bg-primary text-white shadow-md scale-105' 
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              {errors.categoria && <p className="text-xs text-red-500 mt-1">{errors.categoria.message}</p>}
            </div>
          </div>

          {/* Columna Derecha: Multimedia y Acción */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-gray-400" />
                Imagen del Servicio
              </h3>
              
              <div className="space-y-4">
                <div className="aspect-square w-full bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden relative group">
                  {imagePreview ? (
                    <>
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                      <button 
                        type="button"
                        onClick={() => { setImagePreview(null); setValue('imagenURL', ''); }}
                        className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur rounded-full text-red-500 shadow-lg hover:bg-red-50 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    </>
                  ) : (
                    <div className="text-center p-6 space-y-2">
                      <UploadCloud className="w-12 h-12 text-gray-400 mx-auto" />
                      <p className="text-xs text-gray-500">Pega una URL de imagen abajo para ver la vista previa</p>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">URL de la Imagen</label>
                  <input
                    {...register('imagenURL')}
                    onChange={handleImageUrlChange}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full px-4 py-2 text-sm rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                  />
                  {errors.imagenURL && <p className="text-xs text-red-500 mt-1">{errors.imagenURL.message}</p>}
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3 text-red-700 animate-shake">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white rounded-2xl font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Procesando...</span>
                </>
              ) : (
                <>
                  <PlusCircle size={20} />
                  <span>Publicar Servicio</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full py-3 bg-white text-gray-600 border border-gray-200 rounded-2xl font-medium hover:bg-gray-50 transition-all"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
