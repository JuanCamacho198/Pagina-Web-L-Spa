import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate
} from 'react-router-dom';
import { auth } from './lib/auth';
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

// --- Importa los controladores ---
import { loginUsuario, registroUsuario } from './controllers/authController';

export default function App() {
  //saber si ya se verificó el estado de autenticación 
  const [userChecked, setUserChecked] = useState(false);
  // usuario autenticado
  const [user, setUser] = useState(null);

  // Efecto para suscribirse a los cambios en el estado de autenticación de Firebase
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(u => {
      setUser(u); // Actualiza el estado 'user' (será null si no hay usuario)
      setUserChecked(true); // Marca como verificada la autenticación inicial
    });
    // Limpia la suscripción cuando el componente App se desmonta
    return unsubscribe;
  }, []); // El array vacío asegura que este efecto se ejecuta solo una vez al montar


  // Si aún estamos verificando el estado de autenticación, muestra un mensaje de carga
  if (!userChecked) {
    return <div>Cargando…</div>;
  }
  return (
    // se envolvio toda la aplicación con CartProvider para que cualquier componente pueda usar useCart
    <CartProvider>
      <Router>
        <NavBar user={user} />
        {/* rutas de la aplicación */}
        <Routes>
          {/* rutas para usuarios NO autenticados (user es null) */}
          {!user ? (
            <>
              {/* RUTAS PÚBLICAS */}
              <Route path="/" element={<PublicHomeView />} />
              <Route path="/login" element={<LoginRoute />} />
              <Route path="/register" element={<RegisterRoute />} />
              <Route path="/services" element={<ServicesView />} />
              <Route path="/contact" element={<ContactView />} />
              <Route path="/sobre-nosotros" element={<AboutView />} />
              <Route path="/politicas-cancelacion" element={<PoliticasCancelacionView />} />
              <Route path="/politica-datos" element={<DataPrivacyPolicyView />} />
              <Route path="/informacion-reserva" element={<ImportantReservationInfoView />} />
              <Route path="/preguntas-frecuentes" element={<FaqView />} />
              

              {/* Redirecciona las rutas privadas si el usuario no está autenticado */}
              {/* Si intenta acceder a checkout, citas, pago, confirmación o carrito, lo mandamos al login */}
              <Route path="/checkout" element={<Navigate to="/login" replace />} />
              <Route path="/citas" element={<Navigate to="/login" replace />} />
              <Route path="/pago" element={<Navigate to="/login" replace />} />
              <Route path="/confirmacion-pago" element={<Navigate to="/login" replace />} />
              <Route path="/carrito" element={<Navigate to="/login" replace />} />
              
              {/* Cualquier otra ruta no definida en este bloque para no autenticados ➔ redirige a la landing page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </>
          ) : (
            /* Bloque de rutas para usuarios SÍ autenticados (user no es null) */
            <>
              {/* RUTAS PRIVADAS */}
              {/* Redirige la ruta raíz a /home si el usuario está loggeado */}
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
      </Router> {/* <-- Cierre de Router */}
    </CartProvider>
  ); 
} // <-- Cierre de App


/**
 * Wrapper para LoginView para poder usar useNavigate y estado de error
 * Usamos esto si LoginView o RegisterView necesitan hooks de Router como useNavigate
 * o si queremos pasar lógica específica desde App.
 */
function LoginRoute() {
  const navigate = useNavigate();
  const [loginError, setLoginError] = useState('');

  // Esta función se pasaría a LoginView para ser llamada al enviar el formulario
  const handleLogin = async (email, password) => {
    // loginUsuario debe estar definido en tu authController.js y debe manejar la navegación y errores
    await loginUsuario(email, password, navigate, setLoginError);
  };

  return (
    <LoginView
      onLogin={handleLogin} // Pasamos la función de login como prop
      error={loginError} // Pasamos el estado de error como prop
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