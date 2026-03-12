import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft,
  Image as ImageIcon, 
  Tag, 
  DollarSign, 
  Clock, 
  FileText,
  Save,
  Loader2,
  CheckCircle,
  HelpCircle,
  AlertTriangle,
  Zap,
  List
} from 'lucide-react';
import { fetchServiceById, updateService } from '@/models/servicesModel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { toast } from 'react-hot-toast';

const serviceSchema = z.object({
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  description: z.string().min(10, 'La descripción debe tener al menos 10 caracteres'),
  price: z.coerce.number().positive('El precio debe ser un número positivo'),
  duration: z.coerce.number().int().positive('La duración debe ser en minutos'),
  category: z.string().min(1, 'La categoría es obligatoria'),
  imageUrl: z.string().url('Debe ser una URL válida').or(z.literal('')),
  includes: z.string().optional(),
  idealFor: z.string().optional(),
  benefits: z.string().optional(),
  contraindications: z.string().optional().or(z.literal('')),
  intensity: z.preprocess((val) => (val === '' || val === null ? undefined : val), z.coerce.number().min(1).max(5).optional()),
});

const CATEGORIES = [
  'Facial', 'Corporal', 'Masaje', 'Relax', 'Hidratación', 'Exfoliación', 'Aromaterapia'
];

export default function EditServiceView() {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();

  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm({
    resolver: zodResolver(serviceSchema)
  });

  const imageUrl = watch('imageUrl');

  useEffect(() => {
    if (id) loadService(id);
  }, [id]);

  const loadService = async (serviceId: string) => {
    try {
      const service = await fetchServiceById(serviceId);
      if (service) {
        reset({
          name: service.name,
          description: (service as any).description || '',
          price: service.price,
          duration: service.duration,
          category: service.category,
          imageUrl: service.imageUrl,
          includes: (service as any).includes || '',
          idealFor: (service as any).idealFor || '',
          benefits: (service as any).benefits || '',
          contraindications: (service as any).contraindications || '',
          intensity: (service as any).intensity ?? ''
        });
      } else {
        toast.error("Servicio no encontrado");
        navigate('/admin/services');
      }
    } catch (error) {
      toast.error("Error al cargar el servicio");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    if (!id) return;
    setSaving(true);
    try {
      await updateService(id, data);
      toast.success("Servicio actualizado correctamente");
      navigate('/admin/services');
    } catch (error) {
      toast.error("Error al actualizar");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando datos...</div>;

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <Button variant="ghost" className="mb-6" onClick={() => navigate('/admin/services')}>
        <ArrowLeft size={20} className="mr-2" /> Volver a servicios
      </Button>

      <Card>
        <CardHeader>
          <Typography variant="h1" className="text-2xl font-bold">Editar Servicio</Typography>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Nombre del Servicio</label>
                  <div className="relative">
                    <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
                    <Input {...register('name')} className="pl-10" placeholder="Ej: Masaje de Piedras Volcánicas" />
                  </div>
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message as string}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Categoría</label>
                  <select 
                    {...register('category')}
                    className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                  >
                    <option value="">Selecciona categoría</option>
                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category.message as string}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-1 block">Precio ($)</label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                      <Input type="number" {...register('price')} className="pl-10" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-1 block">Duración (min)</label>
                    <div className="relative">
                      <Clock className="absolute left-3 top-3 text-gray-400" size={18} />
                      <Input type="number" {...register('duration')} className="pl-10" />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Descripción</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                    <textarea 
                      {...register('description')}
                      className="w-full min-h-32 pl-10 pr-3 py-2 rounded-md border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all font-sans"
                      placeholder="Describe los beneficios del servicio..."
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-4">
                  <Typography variant="h3" className="text-lg font-semibold">Información Profesional Extra</Typography>
                  
                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      <List size={16} className="text-primary" /> ¿Qué incluye? (Una por línea)
                    </label>
                    <textarea 
                      {...register('includes')}
                      className="w-full min-h-134 px-3 py-2 rounded-md border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all font-sans text-sm"
                      placeholder="Ej: Aceites esenciales&#10;Música ambiental&#10;Bebida de cortesía"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      <HelpCircle size={16} className="text-primary" /> Ideal para...
                    </label>
                    <Input {...register('idealFor')} placeholder="Ej: Personas con estrés, ansiedad, tensión muscular" />
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-1 flex items-center gap-2">
                      <CheckCircle size={16} className="text-primary" /> Beneficios destacados
                    </label>
                    <Input {...register('benefits')} placeholder="Ej: Relajación profunda, mejora de circulación" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center gap-2">
                        <AlertTriangle size={16} className="text-orange-500" /> Contraindicaciones
                      </label>
                      <Input {...register('contraindications')} placeholder="Ej: Embarazo, fracturas recientes" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-1 flex items-center gap-2">
                        <Zap size={16} className="text-yellow-500" /> Intensidad (1-5)
                      </label>
                      <select 
                        {...register('intensity')}
                        className="w-full h-10 px-3 rounded-md border border-gray-200 focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                      >
                        <option value="">No especificado</option>
                        {[1,2,3,4,5].map(i => <option key={i} value={i}>Nivel {i}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-sm font-medium mb-1 block">Imagen del Servicio</label>
                <div className="aspect-video rounded-4xll border-2 border-dashed border-gray-200 flex flex-col items-center justify-center bg-gray-50 overflow-hidden relative group">
                  {imageUrl ? (
                    <img src={imageUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <div className="text-center p-6">
                      <ImageIcon size={48} className="mx-auto text-gray-300 mb-2" />
                      <p className="text-xs text-gray-400">Pega una URL de imagen abajo</p>
                    </div>
                  )}
                </div>
                <div className="relative">
                  <Input {...register('imageUrl')} placeholder="https://ejemplo.com/imagen.jpg" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => navigate('/admin/services')}>Cancelar</Button>
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="animate-spin mr-2" size={18} /> : <Save className="mr-2" size={18} />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
