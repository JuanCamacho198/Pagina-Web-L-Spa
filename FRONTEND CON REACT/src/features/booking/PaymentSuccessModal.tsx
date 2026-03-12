import { CheckCircle2, X } from "lucide-react";

interface PaymentSuccessModalProps {
  show: boolean;
  onClose: () => void;
  totalAmount: number | string;
}

export default function PaymentSuccessModal({ show, onClose, totalAmount }: PaymentSuccessModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div 
        className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white rounded-[3rem] shadow-2xl border border-gray-100 p-10 md:p-12 text-center max-w-lg w-full animate-in zoom-in-95 duration-300">
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <X size={24} />
        </button>

        <div className="bg-green-50 w-20 h-130 rounded-full flex items-center justify-center mx-auto mb-8">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>

        <h2 className="text-3xl font-black text-gray-900 mb-4">¡Pago Exitoso!</h2>
        
        <p className="text-gray-600 font-medium mb-8 leading-relaxed">
          Tu pago de <strong className="text-primary font-black">{totalAmount}</strong> ha sido procesado de forma segura.
        </p>
        
        <p className="text-sm text-gray-500 mb-10">
          Recibirás una confirmación en tu correo electrónico con los detalles de tu agendamiento.
        </p>

        <button 
          onClick={onClose}
          className="w-full py-5 bg-primary text-white font-black rounded-4xl hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/20"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
