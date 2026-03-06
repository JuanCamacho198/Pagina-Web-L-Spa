import React, { useEffect } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import { Loader2, ArrowRight, UserPlus } from 'lucide-react';

const RegisterView: React.FC = () => {
  const { loginWithRedirect, isLoading } = useAuth0();

  useEffect(() => {
    if (!isLoading) {
      loginWithRedirect({
        authorizationParams: {
          screen_hint: 'signup',
        },
      });
    }
  }, [isLoading, loginWithRedirect]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mx-auto mb-6">
          <UserPlus size={40} />
        </div>
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          Creando tu cuenta...
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Te estamos redirigiendo a nuestra página de registro seguro.
        </p>
        <div className="flex justify-center mt-8">
          <Loader2 className="animate-spin text-primary" size={32} />
        </div>
        <button 
          onClick={() => loginWithRedirect({ authorizationParams: { screen_hint: 'signup' } })}
          className="mt-8 flex items-center justify-center w-full py-3 px-4 rounded-xl text-white bg-primary hover:bg-primary-dark transition-colors font-bold shadow-lg shadow-primary/20"
        >
          Si no eres redirigido, haz clic aquí
          <ArrowRight className="ml-2" size={18} />
        </button>
      </div>
    </div>
  );
};

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
