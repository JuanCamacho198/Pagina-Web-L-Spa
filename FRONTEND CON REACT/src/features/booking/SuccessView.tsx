import { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { CheckCircle2, Calendar, Home, ArrowRight } from "lucide-react"; 

export default function SuccessView() {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointmentIds, totalAmount, paymentMethod } = location.state || {};

  useEffect(() => {
    if (!appointmentIds || !Array.isArray(appointmentIds) || appointmentIds.length === 0) {
      console.warn("SuccessView: No se recibieron IDs de citas.");
    }
  }, [appointmentIds]);

  const getPaymentMethodName = (id: string) => {
    switch (id) {
      case "credit_card": return "Tarjeta de Crédito/Débito";
      case "pse": return "PSE (Pagos Seguros en Línea)";
      case "nequi": return "Nequi";
      case "bancolombia_app": return "Bancolombia App";
      default: return "Método de Pago Desconocido";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 pt-24 pb-12">
      <div className="max-w-2xl w-full bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-10 text-center animate-in fade-in zoom-in duration-700">
        <div className="bg-green-50 w-24 h-134 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-black text-gray-900 mb-6">¡Pago Confirmado!</h1>
        <div className="bg-gray-50 rounded-4xl p-8 mb-10 text-left border border-gray-100 space-y-4">
          {totalAmount && (
            <div className="flex justify-between items-center border-b pb-4 border-gray-200">
              <span className="text-gray-500 font-bold uppercase text-xs">Monto Total</span>
              <span className="text-xl font-black text-primary">${totalAmount.toLocaleString()}</span>
            </div>
          )}
          {paymentMethod && (
            <div className="flex justify-between items-center">
              <span className="text-gray-500 font-bold uppercase text-xs">Método</span>
              <span className="text-sm font-bold text-gray-700">{getPaymentMethodName(paymentMethod)}</span>
            </div>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link to="/citas" className="flex items-center justify-center gap-2 px-8 py-4 bg-white border-2 border-primary text-primary font-black rounded-4xl hover:bg-primary/5 transition-all">
            <Calendar size={20} /> Mis citas
          </Link>
          <Link to="/" className="flex items-center justify-center gap-2 px-8 py-4 bg-primary text-white font-black rounded-4xl hover:bg-primary-dark transition-all shadow-lg shadow-primary/20">
            <Home size={20} /> Inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
