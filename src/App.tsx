import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
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

import CreateServiceView from './features/admin/CreateServiceView';

import { AuthSync } from './components/shared/AuthSync';

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
        <AuthSync />
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
              <Route path="/about-us" element={<AboutView />} />
              <Route path="/cancellation-policies" element={<PoliticasCancelacionView />} />
              <Route path="/data-privacy" element={<DataPrivacyPolicyView />} />
              <Route path="/reservation-info" element={<ImportantReservationInfoView />} />
              <Route path="/faq" element={<FaqView />} />
              

              {/* Redirecciona las rutas privadas si el usuario no está autenticado */}
              <Route path="/checkout" element={<Navigate to="/login" replace />} />
              <Route path="/appointments" element={<Navigate to="/login" replace />} />
              <Route path="/payment" element={<Navigate to="/login" replace />} />
              <Route path="/payment-confirmation" element={<Navigate to="/login" replace />} />
              <Route path="/cart" element={<Navigate to="/login" replace />} />
              
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
              <Route path="/appointments" element={<CitasView />} />
              <Route path="/payment" element={<PaymentView />} />
              <Route path="/payment-confirmation" element={<SuccessView />} />
              <Route path="/cart" element={<CartView />} />

              {/* Solo administradores pueden crear servicios */}
              <Route path="/admin/create-service" element={<CreateServiceView />} />
              <Route path="/admin/create-user" element={<RegisterView />} />

              <Route path="/cancellation-policies" element={<PoliticasCancelacionView />} />
              <Route path="/data-privacy" element={<DataPrivacyPolicyView />} />
              <Route path="/reservation-info" element={<ImportantReservationInfoView />} />
              <Route path="/faq" element={<FaqView />} />

              {/* Cualquier otra ruta no definida en este bloque para autenticados ➔ redirige a /home */}
              <Route path="*" element={<Navigate to="/home" replace />} />
            </>
          )}
          {/* Esta ruta debe estar fuera del bloque condicional de autenticación */}
          <Route path="/service/:id" element={<ServiceDetailView />} />
        </Routes> 
      </Router>
    </CartProvider>
  ); 
}
