import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2, ArrowRight, ShieldCheck } from 'lucide-react';

const LoginView: React.FC = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading) {
      loginWithRedirect();
    }
  }, [isLoading, loginWithRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
          <ShieldCheck size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Redirigiendo...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Estamos conectando con nuestro portal seguro de autenticación.
        </p>
        <div className="flex justify-center mt-8">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
        <button 
          onClick={() => loginWithRedirect()}
          className="mt-8 flex items-center justify-center w-full py-3 px-4 rounded-xl text-white bg-primary hover:bg-primary-dark transition-colors font-bold shadow-lg shadow-primary/20"
        >
          Si no eres redirigido, haz clic aquí
          <ArrowRight className="ml-2" size={18} />
        </button>
      </div>
    </div>
  );
};

export default LoginView;

