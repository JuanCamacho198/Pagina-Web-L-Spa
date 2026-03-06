import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { CartProvider } from './context/CartContext';
import NavBar from './components/layout/NavBar';
import ProfileView from './features/profile/ProfileView';
import ServiceDetailView from './features/catalog/components/ServiceDetailView'; 

// Vistas principales
import PublicHomeView from './features/static/PublicHomeView';
import LoginView from './features/auth/LoginView';
import RegisterView from './features/auth/RegisterView';
import HomeView from './features/catalog/HomeView';

import PoliticasCancelacionView from './features/static/CancellationPolicyView';
import DataPrivacyPolicyView from './features/static/DataPrivacyPolicyView';
import ImportantReservationInfoView from './features/static/ImportantReservationInfoView';
import FaqView from './features/static/FaqView';

import ServicesView from './features/catalog/ServicesView';
import CheckoutView from './features/booking/CheckoutView';
import CitasView from './features/booking/CitasView';
import PaymentView from './features/booking/PaymentView';
import SuccessView from './features/booking/SuccessView';
import CartView from './features/booking/CartView';

import ContactView from './features/static/ContactView';
import AboutView from './features/static/AboutView';

export default function App() {
  const { user, isAuthenticated, isLoading } = useAuth0();

  // Si aún estamos verificando el estado de autenticación, muestra un mensaje de carga
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    // se envolvio toda la aplicación con CartProvider para que cualquier componente pueda usar useCart
    <CartProvider>
      <Router>
        <NavBar user={user} />
        {/* rutas de la aplicación */}
        <Routes>
          {/* rutas para usuarios NO autenticados */}
          {!isAuthenticated ? (
            <>
              {/* RUTAS PÚBLICAS */}
              <Route path="/" element={<PublicHomeView />} />
              <Route path="/login" element={<LoginView />} />
              <Route path="/register" element={<RegisterView />} />
              <Route path="/services" element={<ServicesView />} />
              <Route path="/contact" element={<ContactView />} />
              <Route path="/sobre-nosotros" element={<AboutView />} />
              <Route path="/politicas-cancelacion" element={<PoliticasCancelacionView />} />
              <Route path="/politica-datos" element={<DataPrivacyPolicyView />} />
              <Route path="/informacion-reserva" element={<ImportantReservationInfoView />} />
              <Route path="/preguntas-frecuentes" element={<FaqView />} />
              

              {/* Redirecciona las rutas privadas si el usuario no está autenticado */}
              <Route path="/checkout" element={<Navigate to="/login" replace />} />
              <Route path="/citas" element={<Navigate to="/login" replace />} />
              <Route path="/pago" element={<Navigate to="/login" replace />} />
              <Route path="/confirmacion-pago" element={<Navigate to="/login" replace />} />
              <Route path="/carrito" element={<Navigate to="/login" replace />} />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            /* Bloque de rutas para usuarios SÍ autenticados */
            <>
              {/* RUTAS PRIVADAS */}
              <Route path="/" element={<Navigate to="/home" replace />} />

              {/* Rutas accesibles solo para usuarios autenticados */}
              <Route path="/home" element={<HomeView />} />
              <Route path="/contact" element={<ContactView />} />

              {/* Pasamos el usuario al ProfileView si lo necesita */}
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/services" element={<ServicesView/>} />
              <Route path="/checkout" element={<CheckoutView />} />
              <Route path="/citas" element={<CitasView />} />
              <Route path="/pago" element={<PaymentView />} />
              <Route path="/confirmacion-pago" element={<SuccessView />} />
              <Route path="/carrito" element={<CartView />} />
              <Route path="/politicas-cancelacion" element={<PoliticasCancelacionView />} />
              <Route path="/politica-datos" element={<DataPrivacyPolicyView />} />
              <Route path="/informacion-reserva" element={<ImportantReservationInfoView />} />
              <Route path="/preguntas-frecuentes" element={<FaqView />} />

              {/* Cualquier otra ruta no definida en este bloque para autenticados ➔ redirige a /home */}
              <Route path="*" element={<Navigate to="/home" replace />} />
              
            </>
          )}
          {/* Esta ruta debe estar fuera del bloque condicional de autenticación */}
          <Route path="/servicio/:id" element={<ServiceDetailView />} />
        </Routes> 
      </Router>
    </CartProvider>
  ); 
}

    />
  );
}

/**
 * Wrapper para RegisterView para poder usar useNavigate y estado de error
 */
function RegisterRoute() {
  const navigate = useNavigate();
  const [registrationError, setRegistrationError] = useState('');

  // Esta función se pasaría a RegisterView para ser llamada al enviar el formulario
  const handleRegister = async (nombre: string, apellido: string, email: string, password: string) => {
    // registroUsuario debe estar definido en tu authController.js y manejar navegación y errores
    await registroUsuario(
      nombre,
      apellido,
      email,
      password,
      navigate,
      setRegistrationError
    );
  };

  return (
    <RegisterView
      onRegister={handleRegister} // Pasamos la función de registro como prop
      error={registrationError} // Pasamos el estado de error como prop
    />
  );
}