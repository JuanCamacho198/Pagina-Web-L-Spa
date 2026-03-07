import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, CreditCard, Wallet, Smartphone, Landmark, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import PaymentSuccessModal from '@/features/booking/PaymentSuccessModal';

// --- IMÁGENES (Manteniendo las rutas actuales) ---
import creditCardImage from '@/assets/epayco-pagos.png';
import pseImage from '@/assets/PSE.png';
import Nequi from '@/assets/Nequi.png';
import bancolombia from '@/assets/bancolombia.png';

const AVAILABLE_PAYMENT_METHODS = [
  { id: 'credit_card', name: 'Tarjeta Crédito/Débito', image: creditCardImage, icon: CreditCard },
  { id: 'pse', name: 'PSE (Pagos en Línea)', image: pseImage, icon: Landmark },
  { id: 'nequi', name: 'Nequi', image: Nequi, icon: Smartphone },
  { id: 'bancolombia_app', name: 'Bancolombia App', image: bancolombia, icon: Wallet },
];

export default function PaymentView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { appointmentIds, totalAmount, schedulingDetails } = location.state || {};

  useEffect(() => {
    if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0 || totalAmount === undefined) {
      setError("No se pudo procesar el pago. Información incompleta.");
      setLoading(false);
      return;
    }

    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [appointmentIds, totalAmount]);

  const handlePaymentSubmit = async () => {
    if (!selectedPaymentMethod) {
      setError("Por favor, selecciona un método de pago.");
      return;
    }

    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    setShowSuccessModal(true);
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/confirmacion-pago', {
      state: { appointmentIds, totalAmount, schedulingDetails, paymentMethod: selectedPaymentMethod, paymentStatus: 'success' },
    });
  };

  if (loading && !showSuccessModal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500 font-black animate-pulse">Procesando pasarela segura...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Main Payment Section */}
          <div className="lg:col-span-3 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-xl shadow-gray-200/50 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Lock size={20} />
                </div>
                <div>
                  <h1 className="text-2xl font-black text-gray-900 tracking-tight">Caja Segura</h1>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Encriptación SSL de 256 bits</p>
                </div>
              </div>

              <h2 className="text-sm font-black text-gray-700 uppercase tracking-widest mb-6 border-b pb-4 border-gray-100">
                Selecciona Método de Pago
              </h2>

              <div className="grid grid-cols-1 gap-4">
                {AVAILABLE_PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`relative flex items-center p-5 rounded-2xl border-2 cursor-pointer transition-all duration-300 group ${
                      selectedPaymentMethod === method.id 
                      ? 'border-primary bg-primary/5 shadow-md animate-in zoom-in-95 duration-200' 
                      : 'border-gray-100 bg-white hover:border-gray-200'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      className="hidden"
                      onChange={(e) => {
                        setSelectedPaymentMethod(e.target.value);
                        setError('');
                      }}
                    />
                    <div className="flex items-center gap-4 w-full">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                        selectedPaymentMethod === method.id ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400'
                      }`}>
                        <method.icon size={24} />
                      </div>
                      <div className="flex-1">
                        <span className="block font-black text-gray-900 leading-none mb-1">{method.name}</span>
                        <img src={method.image} alt={method.name} className="h-4 object-contain opacity-60" />
                      </div>
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedPaymentMethod === method.id ? 'border-primary bg-primary shadow-lg scale-110' : 'border-gray-200'
                      }`}>
                        {selectedPaymentMethod === method.id && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                    </div>
                  </label>
                ))}
              </div>

              {error && (
                <div className="mt-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm font-bold border border-red-100 animate-bounce">
                  {error}
                </div>
              )}

              <button
                onClick={handlePaymentSubmit}
                disabled={!selectedPaymentMethod}
                className="w-full mt-8 py-5 bg-gray-900 text-white font-black rounded-4xl hover:bg-black transition-all transform hover:-translate-y-1 shadow-2xl disabled:opacity-50 disabled:grayscale disabled:hover:translate-y-0"
              >
                Confirmar Pago de {totalAmount} COL
              </button>
            </div>
            
            <div className="flex items-center justify-center gap-6 opacity-30">
                <img src="/assets/epayco-pagos.png" className="h-6 grayscale" alt="Secure" />
                <div className="h-4 w-px bg-gray-400"></div>
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-600">Transacción 100% Protegida</p>
            </div>
          </div>

          {/* Sidebar Summary */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gray-900 rounded-[2.5rem] p-8 text-white shadow-2xl shadow-gray-300 relative overflow-hidden">
               <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary opacity-20 blur-3xl rounded-full"></div>
               <h2 className="text-xl font-black mb-6 tracking-tight flex items-center gap-2">
                 <ShieldCheck className="text-primary" /> Resumen de Orden
               </h2>
               <div className="space-y-4 mb-8">
                  <div className="flex justify-between items-center text-gray-400 font-medium">
                    <span>Servicios Seleccionados</span>
                    <span className="text-white font-black">{appointmentIds.length}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-400 font-medium">
                    <span>Sede</span>
                    <span className="text-white font-black">{schedulingDetails?.sede || 'El Poblado'}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">Total a Pagar</p>
                      <p className="text-3xl font-black text-white">{totalAmount} <span className="text-sm text-primary">COL</span></p>
                    </div>
                  </div>
               </div>
               
               <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                  <p className="text-[10px] leading-relaxed text-gray-400 font-bold uppercase tracking-tighter">
                    Al proceder con el pago, aceptas nuestras <span className="text-primary">Políticas de Cancelación</span> y <span className="text-primary">Privacidad de Datos</span>.
                  </p>
               </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-gray-100 flex items-center gap-4">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                <ShieldCheck size={24} />
              </div>
              <div>
                <p className="text-xs font-black text-gray-400 uppercase tracking-widest leading-none mb-1">Tu Seguridad es Primero</p>
                <p className="text-sm font-bold text-gray-700 italic">Nunca compartimos tus datos bancarios.</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <PaymentSuccessModal
        show={showSuccessModal}
        onClose={handleCloseSuccessModal}
        totalAmount={totalAmount}
      />
    </div>
  );
}
