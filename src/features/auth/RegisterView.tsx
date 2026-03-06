import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { registroUsuario } from '../../controllers/authController';
import { User, Mail, Lock, UserPlus, ArrowLeft, Loader2 } from 'lucide-react';

interface RegisterViewProps {
  onRegister: (nombre: string, apellido: string, email: string, password: string) => Promise<void>;
  error?: string;
}

const RegisterView: React.FC<RegisterViewProps> = ({ onRegister, error: propError }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const enviarFormulario = async (evento: React.FormEvent) => {
    evento.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await onRegister(nombre, apellido, email, password);
    } catch (err: any) {
      setError(err.message || 'Error al registrar usuario');
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayError = propError || error;

  const inputGroupClass = "group space-y-1";
  const labelClass = "block text-sm font-medium text-gray-700 group-focus-within:text-primary transition-colors";
  const inputClass = "block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all sm:text-sm";
  const iconClass = "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8 bg-[url('/src/assets/bannerSpa.avif')] bg-cover bg-fixed bg-center">
      <div className="absolute inset-0 bg-white/90 backdrop-blur-sm"></div>
      
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100 relative z-10 animate-in fade-in zoom-in duration-500">
        
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-sm font-medium text-primary hover:text-primary-dark transition-colors mb-6 group">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Volver al inicio
          </Link>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Crea tu cuenta
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Únete a L-Spa y empieza a disfrutar del bienestar.
          </p>
        </div>

        {displayError && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl animate-in slide-in-from-top duration-300">
            <div className="flex">
              <div className="shrink-0 text-red-400">⚠️</div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">{displayError}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={enviarFormulario} className="mt-8 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className={inputGroupClass}>
              <label htmlFor="nombre" className={labelClass}>Nombre</label>
              <div className="relative">
                <div className={iconClass}><User size={18} /></div>
                <input
                  type="text"
                  id="nombre"
                  placeholder="Juan"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>

            <div className={inputGroupClass}>
              <label htmlFor="apellido" className={labelClass}>Apellido</label>
              <div className="relative">
                <div className={iconClass}><User size={18} /></div>
                <input
                  type="text"
                  id="apellido"
                  placeholder="Pérez"
                  value={apellido}
                  onChange={(e) => setApellido(e.target.value)}
                  required
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className={inputGroupClass}>
            <label htmlFor="email" className={labelClass}>Correo Electrónico</label>
            <div className="relative">
              <div className={iconClass}><Mail size={18} /></div>
              <input
                type="email"
                id="email"
                placeholder="tu@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>
          </div>

          <div className={inputGroupClass}>
            <label htmlFor="password" className={labelClass}>Contraseña</label>
            <div className="relative">
              <div className={iconClass}><Lock size={18} /></div>
              <input
                type="password"
                id="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <p className="text-xs text-gray-400 pl-1">Mínimo 6 caracteres</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 disabled:opacity-70 active:scale-95"
            >
              <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                {isSubmitting ? (
                  <Loader2 className="animate-spin text-white/50" size={18} />
                ) : (
                  <UserPlus className="text-white/50 group-hover:text-white transition-colors" size={18} />
                )}
              </span>
              {isSubmitting ? "Creando cuenta..." : "Registrarse Ahora"}
            </button>
          </div>
        </form>

        <div className="text-center mt-6">
          <p className="text-sm text-gray-600">
            ¿Ya tienes una cuenta?{" "}
            <Link to="/login" className="font-bold text-primary hover:text-primary-dark transition-colors">
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterView;
