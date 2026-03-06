import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchServiceById } from '../../models/servicesModel';
import { addAppointment } from '../../models/citasModel';
import { useCart } from '../../context/CartContext';
import TimePicker from './TimePicker';
import { 
  ChevronLeft, 
  CreditCard, 
  User, 
  Mail, 
  Phone, 
  IdCard, 
  Calendar, 
  MessageSquare, 
  Loader2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Package,
  AlertCircle as AlertIcon
} from 'lucide-react';
import { CheckoutFormValues } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Typography } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';

const checkoutSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresa un correo electrónico válido'),
  phone: z.string().min(7, 'El teléfono debe tener al menos 7 dígitos').regex(/^[0-9+ ]+$/, 'Solo números, espacio y +'),
  userCC: z.string().min(5, 'La identificación debe tener al menos 5 caracteres'),
  preferredDate: z.string().min(1, 'Debes seleccionar una fecha'),
  preferredTime: z.string().min(1, 'Debes seleccionar una hora'),
  notes: z.string().optional(),
});

export default function CheckoutView() {
  const { user, isAuthenticated } = useAuth0();
  const [itemsToCheckout, setItemsToCheckout] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];
  const maxDateObj = new Date();
  maxDateObj.setDate(today.getDate() + 30);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart, loadCartFromDb } = useCart();
  const serviceIdFromUrl = new URLSearchParams(location.search).get('serviceId');

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      name: '',
      lastName: '',
      email: '',
      phone: '',
      userCC: '',
      preferredDate: '',
      preferredTime: '',
      notes: '',
    }
  });

  const preferredDate = watch('preferredDate');
  const preferredTime = watch('preferredTime');

  useEffect(() => {
    const processItems = async () => {
      setLoading(true);
      setError('');
      try {
        if (serviceIdFromUrl) {
          const singleService = await fetchServiceById(serviceIdFromUrl);
          if (singleService) {
            setItemsToCheckout([singleService]);
          } else {
            setError("El servicio no fue encontrado.");
          }
        } else {
          await loadCartFromDb();
        }
      } catch (err) {
        console.error("Error al cargar servicios:", err);
        setError("Error al cargar los servicios.");
      } finally {
        setLoading(false);
      }
    };
    processItems();
  }, [serviceIdFromUrl, loadCartFromDb]);

  useEffect(() => {
    if (!serviceIdFromUrl && cartItems && cartItems.length > 0) {
      setItemsToCheckout(cartItems);
    }
  }, [serviceIdFromUrl, cartItems]);

  const onCheckoutSubmit = async (formData: CheckoutFormValues) => {
    if (!isAuthenticated || !user?.sub) {
      navigate('/login');
      return;
    }

    setIsSubmitting(true);
    try {
      for (const item of itemsToCheckout) {
        await addAppointment({
          serviceId: item.id,
          appointmentDate: formData.preferredDate,
          appointmentTime: formData.preferredTime,
        }, user.sub);
      }
      
      if (!serviceIdFromUrl) {
         await clearCart();
      }
      
      navigate('/success');
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al procesar tu reserva.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const total = itemsToCheckout.reduce((acc, item) => acc + (parseFloat(item.price as string) || 0), 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Button 
          variant="outline" 
          onClick={() => navigate(-1)}
          className="mb-8 border-none bg-white/50 hover:bg-white transition-colors"
        >
          <ChevronLeft className="mr-2" size={18} />
          Volver
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <Card className="p-8 border-none shadow-xl shadow-gray-200/50 rounded-3xl">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary font-bold">01</div>
                <div>
                  <Typography variant="h3" className="m-0">Datos Personales</Typography>
                  <Typography variant="small" className="text-gray-500">Información para tu cita</Typography>
                </div>
              </div>

              <form onSubmit={handleSubmit(onCheckoutSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Nombre"
                    {...register('name')}
                    placeholder="Juan"
                    icon={<User size={18} />}
                    error={errors.name?.message}
                  />
                  <Input 
                    label="Apellido"
                    {...register('lastName')}
                    placeholder="Pérez"
                    icon={<User size={18} />}
                    error={errors.lastName?.message}
                  />
                </div>

                <Input 
                  label="Correo Electrónico"
                  {...register('email')}
                  placeholder="juan@email.com"
                  icon={<Mail size={18} />}
                  error={errors.email?.message}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Identificación (CC)"
                    {...register('userCC')}
                    placeholder="12345678"
                    icon={<IdCard size={18} />}
                    error={errors.userCC?.message}
                  />
                  <Input 
                    label="Teléfono"
                    {...register('phone')}
                    placeholder="321..."
                    icon={<Phone size={18} />}
                    error={errors.phone?.message}
                  />
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary font-bold">02</div>
                    <div>
                      <Typography variant="h3" className="m-0">Programación</Typography>
                      <Typography variant="small" className="text-gray-500">¿Cuándo deseas tu servicio?</Typography>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input 
                      label="Fecha"
                      type="date"
                      min={minDate}
                      max={maxDate}
                      {...register('preferredDate')}
                      icon={<Calendar size={18} />}
                      error={errors.preferredDate?.message}
                    />
                    
                    <div className="space-y-1.5">
                      <Typography variant="small" className="text-sm font-semibold text-gray-700 ml-1">Hora</Typography>
                      <TimePicker 
                        selectedDate={preferredDate}
                        value={preferredTime}
                        onChange={(val) => setValue('preferredTime', val, { shouldValidate: true })}
                      />
                      {errors.preferredTime && <Typography variant="small" className="text-red-500 text-xs ml-1">{errors.preferredTime.message}</Typography>}
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-gray-50">
                  <Input 
                    label="Notas adicionales"
                    {...register('notes')}
                    placeholder="¿Alguna consideración especial?"
                    icon={<MessageSquare size={18} />}
                  />
                </div>

                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full py-8 text-lg rounded-2xl shadow-xl shadow-primary/20 mt-8"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 animate-spin" size={20} />
                      Procesando Reserva...
                    </>
                  ) : (
                    <>
                      Confirmar Reserva
                      <ArrowRight className="ml-2" size={20} />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>

          {/* Sumary Side */}
          <div className="lg:col-span-5 space-y-6">
            <Typography variant="h3">Resumen del Pedido</Typography>
            <div className="space-y-4">
              {itemsToCheckout.map((item) => (
                <Card key={item.id} className="p-4 border-none shadow-lg rounded-2xl bg-white flex gap-4 overflow-hidden group">
                  <div className="w-24 h-24 rounded-xl overflow-hidden shrink-0">
                    <img 
                      src={item.imageUrl || '/placeholder-spa.jpg'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="flex flex-col justify-center grow">
                    <Typography variant="h4" className="text-gray-800 text-lg m-0">{item.name}</Typography>
                    <div className="flex items-center gap-3 mt-1 text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock size={12} />
                        <Typography variant="small" className="m-0">{item.duration} min</Typography>
                      </div>
                      <Typography variant="small" className="font-bold text-primary">${item.price}</Typography>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <Card className="p-8 bg-linear-to-br from-gray-900 to-gray-800 text-white rounded-3xl border-none shadow-2xl">
              <div className="space-y-4 border-b border-white/10 pb-6 mb-6">
                <div className="flex justify-between items-center opacity-80">
                  <Typography className="m-0 text-white">Subtotal</Typography>
                  <Typography className="m-0 text-white">${total}</Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography className="m-0 text-white">Servicio</Typography>
                  <Badge variant="default" className="bg-primary/20 border-primary/30 text-primary-light">Gratis</Badge>
                </div>
              </div>
              <div className="flex justify-between items-center mb-8">
                <Typography variant="h2" className="m-0 text-white border-none">Total</Typography>
                <Typography variant="h2" className="m-0 text-primary-light border-none">${total}</Typography>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl flex items-center gap-3 text-sm opacity-60">
                <ShieldCheck size={18} />
                Pago seguro protegido por encriptación SSL.
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
