import React, { useState, useEffect, useMemo, ChangeEvent, FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
  Package
} from 'lucide-react';

interface CheckoutItem {
  id: string;
  serviceId?: string;
  Nombre: string;
  Precio: string | number;
  imageFileName?: string;
  imagenURL?: string;
  Duracion?: number;
  cantidad: number;
}

export default function CheckoutView() {
  const [itemsToCheckout, setItemsToCheckout] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dateError, setDateError] = useState('');
  
  const today = new Date();
  const minDate = today.toISOString().split('T')[0];

  const maxDateObj = new Date();
  maxDateObj.setDate(today.getDate() + 30);
  const maxDate = maxDateObj.toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    name: '',
    lastName: '',
    email: '',
    phone: '',
    userCC: '',
    preferredDate: '',
    preferredTime: '',
    notes: '',
  });

  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, clearCart, loadCartFromDb } = useCart();
  const serviceIdFromUrl = new URLSearchParams(location.search).get('serviceId');

  const groupedItems = useMemo<CheckoutItem[]>(() => {
    return itemsToCheckout.reduce((acc: CheckoutItem[], item) => {
      const sId = item.serviceId || item.id;
      const existing = acc.find(i => (i.serviceId === sId || i.id === sId));

      if (existing) {
        existing.cantidad += 1;
      } else {
        const price = typeof item.Precio === 'string' ? parseFloat(item.Precio) : (item.Precio || 0);
        acc.push({
          ...item,
          Precio: price,
          cantidad: 1,
          serviceId: sId
        });
      }
      return acc;
    }, []);
  }, [itemsToCheckout]);

  useEffect(() => {
    const processItems = async () => {
      setLoading(true);
      setError('');
      try {
        if (serviceIdFromUrl) {
          const singleService = await fetchServiceById(serviceIdFromUrl);
          if (singleService) {
            // Adaptamos el servicio al formato de CheckoutItem
            const adaptedService = {
              ...singleService,
              imageFileName: singleService.imageFileName || singleService.imagenURL
            };
            setItemsToCheckout([adaptedService]);
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
  }, [serviceIdFromUrl]);

  useEffect(() => {
    if (!serviceIdFromUrl && cartItems && cartItems.length > 0) {
      setItemsToCheckout(cartItems);
    } else if (!serviceIdFromUrl && (!cartItems || cartItems.length === 0) && !loading) {
      setItemsToCheckout([]);
      setError("Tu carrito está vacío.");
    }
  }, [cartItems, serviceIdFromUrl, loading]);

  const total = groupedItems.reduce((sum, item) => sum + (parseFloat(String(item.Precio || 0)) * item.cantidad), 0);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    if (name === 'preferredDate') {
      const selectedDate = new Date(value);
      const day = selectedDate.getDay(); 
      if (day === 0) { // Sunday
        setDateError('Los domingos no abrimos. Por favor elige otro día.');
        return;
      } else {
        setDateError('');
      }
    }
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    setError('');
    setIsSubmitting(true);

    if (!formData.name || !formData.email || !formData.preferredDate || !formData.preferredTime) {
      setError("Por favor completa todos los campos requeridos.");
      setIsSubmitting(false);
      return;
    }

    try {
      const savedAppointmentIds = [];
      for (const item of groupedItems) {
        const appointmentDataToSave = {
          serviceId: item.serviceId,
          serviceName: item.Nombre,
          servicePrice: item.Precio,
          userName: formData.name,
          userLastName: formData.lastName,
          userEmail: formData.email,
          userPhone: formData.phone,
          userCC: formData.userCC,
          notes: formData.notes,
          appointmentDate: formData.preferredDate,
          appointmentTime: formData.preferredTime,
          status: 'Pending Payment',
          createdAt: new Date(),
        };
        const newAppointmentId = await addAppointment(appointmentDataToSave);
        savedAppointmentIds.push(newAppointmentId);
      }

      if (!serviceIdFromUrl) {
        await clearCart();
      }

      navigate('/pago', {
        state: {
          appointmentIds: savedAppointmentIds,
          totalAmount: total,
          schedulingDetails: formData,
        },
      });
    } catch (submitError) {
      console.error("Error al agendar:", submitError);
      setError("Error al procesar la reserva. Inténtalo de nuevo.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 text-center">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-500 font-medium">Preparando los detalles de tu reserva...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center text-gray-500 hover:text-primary mb-8 transition-colors group"
        >
          <ChevronLeft size={20} className="mr-1 group-hover:-translate-x-1 transition-transform" />
          Volver atrás
        </button>

        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Finalizar Reserva</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Formulario */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Sección Datos Personales */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <User size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Datos del cliente</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Nombre</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <User size={16} />
                      </div>
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Tu nombre"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Apellido</label>
                    <input 
                      type="text" 
                      name="lastName" 
                      value={formData.lastName} 
                      onChange={handleInputChange} 
                      required 
                      placeholder="Tu apellido"
                      className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Documento de Identidad (CC)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <IdCard size={16} />
                      </div>
                      <input 
                        type="text" 
                        name="userCC" 
                        value={formData.userCC} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Número de cédula"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Teléfono</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Phone size={16} />
                      </div>
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="Ej: 3001234567"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                      />
                    </div>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Correo Electrónico</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Mail size={16} />
                      </div>
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        required 
                        placeholder="tu@email.com"
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Sección Cita */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                    <Calendar size={20} />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Programación de la cita</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Fecha Preferida</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Calendar size={16} />
                      </div>
                      <input
                        type="date"
                        name="preferredDate"
                        value={formData.preferredDate}
                        onChange={handleInputChange}
                        required
                        min={minDate}
                        max={maxDate}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none cursor-pointer" 
                      />
                    </div>
                    {dateError && <p className="text-red-500 text-xs mt-1 ml-1 font-medium">{dateError}</p>}
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Hora Selecta</label>
                    <TimePicker
                      selectedDate={formData.preferredDate}
                      durationMinutes={itemsToCheckout.length > 0 ? itemsToCheckout[0].Duracion || 60 : 60}
                      value={formData.preferredTime}
                      onChange={(val) => handleInputChange({ target: { name: 'preferredTime', value: val } })}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-bold text-gray-700 ml-1">Notas u observaciones (opcional)</label>
                    <div className="relative">
                      <div className="absolute top-3 left-3 text-gray-400">
                        <MessageSquare size={16} />
                      </div>
                      <textarea 
                        name="notes" 
                        value={formData.notes} 
                        onChange={handleInputChange} 
                        placeholder="Cuéntanos si tienes alguna alergia o requerimiento especial..."
                        rows={3}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none resize-none" 
                      />
                    </div>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 text-red-600">
                    <AlertCircle size={18} />
                  </div>
                  <p className="text-sm font-medium">{error}</p>
                </div>
              )}

              <button 
                type="submit" 
                disabled={isSubmitting || groupedItems.length === 0}
                className="w-full btn btn-primary py-5 text-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/20 lg:hidden"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={24} className="animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard size={20} />
                    Proceder al Pago (${total.toLocaleString('es-CO')})
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Resumen Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-3xl p-6 shadow-xl border border-gray-100 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Package size={20} />
                </div>
                <h2 className="text-xl font-bold text-gray-900">Tu pedido</h2>
              </div>

              <div className="space-y-4 mb-8">
                {groupedItems.map((item, idx) => (
                  <div key={item.serviceId + idx} className="flex gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors group">
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                      {item.imageFileName || item.imagenURL ? (
                        <img 
                          src={`/assets/${item.imageFileName || item.imagenURL}`} 
                          alt={item.Nombre} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Package size={20} />
                        </div>
                      )}
                    </div>
                    <div className="flex-grow min-w-0">
                      <h4 className="font-bold text-gray-900 truncate">{item.Nombre}</h4>
                      <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                        <Clock size={12} className="text-primary" /> {item.Duracion || 60} min
                      </p>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-400 font-medium">x{item.cantidad}</span>
                        <span className="text-primary font-bold">${(parseFloat(String(item.Precio)).toLocaleString('es-CO'))}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-3 pt-6 border-t border-gray-100">
                <div className="flex justify-between text-gray-500 text-sm px-2">
                  <span>Subtotal</span>
                  <span>${total.toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between text-gray-900 font-black text-xl px-2 py-4 bg-gray-50 rounded-2xl mt-4">
                  <span>Total</span>
                  <span className="text-primary underline decoration-primary/20 decoration-4 underline-offset-4">${total.toLocaleString('es-CO')}</span>
                </div>
              </div>

              <button 
                type="button" 
                onClick={(e) => {
                  const form = document.querySelector('form');
                  if (form) form.requestSubmit();
                }}
                disabled={isSubmitting || groupedItems.length === 0}
                className="w-full btn btn-primary py-4 mt-8 flex items-center justify-center gap-3 shadow-xl shadow-primary/20 hidden lg:flex"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CreditCard size={18} />
                    Pagar Ahora
                    <ArrowRight size={16} />
                  </>
                )}
              </button>

              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-3 text-gray-400 text-[10px] uppercase font-bold tracking-wider mb-4">
                  <ShieldCheck size={14} className="text-green-500" />
                  Transacción protegida
                </div>
                <p className="text-[10px] text-gray-400 leading-relaxed text-center">
                  Toda tu información está cifrada. Al continuar, aceptas el procesamiento seguro de pagos.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper icons
function AlertCircle({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  );
}

