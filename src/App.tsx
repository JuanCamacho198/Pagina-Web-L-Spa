import React, { Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { CartProvider } from '@/context/CartContext';
import { ThemeProvider } from '@/context/ThemeContext';
import NavBar from '@/components/layout/NavBar';
import ProfileView from '@/features/profile/ProfileView';
import ServiceDetailView from '@/features/catalog/components/ServiceDetailView'; 

// Vistas principales
import LoginView from '@/features/auth/LoginView';
import RegisterView from '@/features/auth/RegisterView';
import HomeView from '@/features/catalog/HomeView';

import PoliticasCancelacionView from '@/features/static/CancellationPolicyView';
import DataPrivacyPolicyView from '@/features/static/DataPrivacyPolicyView';
import ImportantReservationInfoView from '@/features/static/ImportantReservationInfoView';
import FaqView from '@/features/static/FaqView';
import CookiePolicyView from '@/features/static/CookiePolicyView';
import PrivacyPolicyView from '@/features/static/PrivacyPolicyView';

import ServicesView from '@/features/catalog/ServicesView';
import CheckoutView from '@/features/booking/CheckoutView';
import CitasView from '@/features/booking/CitasView';
import PaymentView from '@/features/booking/PaymentView';
import SuccessView from '@/features/booking/SuccessView';
import CartView from '@/features/booking/CartView';

import ContactView from '@/features/static/ContactView';
import AboutView from '@/features/static/AboutView';

import { AuthSync } from '@/components/shared/AuthSync';
import ErrorBoundary from '@/components/ErrorBoundary';

const AdminLayout = lazy(() => import('@/features/admin/AdminLayout'));
const AdminDashboardView = lazy(() => import('@/features/admin/AdminDashboardView'));
const AdminBookingsView = lazy(() => import('@/features/admin/AdminBookingsView'));
const AdminServicesListView = lazy(() => import('@/features/admin/AdminServicesListView'));
const AdminUsersListView = lazy(() => import('@/features/admin/AdminUsersListView'));
const CreateServiceView = lazy(() => import('@/features/admin/CreateServiceView'));
const EditServiceView = lazy(() => import('@/features/admin/EditServiceView'));
const NavbarSettingsView = lazy(() => import('@/features/admin/NavbarSettingsView'));
const FooterSettingsView = lazy(() => import('@/features/admin/FooterSettingsView'));
const SocialLinksView = lazy(() => import('@/features/admin/SocialLinksView'));
const AdminRoute = lazy(() => import('@/components/shared/AdminRoute'));

const AdminLoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

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
    <ThemeProvider>
      <CartProvider>
        <Router>
          <AuthSync />
          <NavBar user={user} />
        {/* rutas de la aplicación */}
        <Routes>
          {/* RUTA HOME UNIFICADA */}
          <Route path="/" element={<HomeView />} />
          <Route path="/home" element={<Navigate to="/" replace />} />

          {/* Rutas compartidas (Públicas y Privadas) */}
          <Route path="/services" element={<ServicesView />} />
          <Route path="/service/:slug" element={<ServiceDetailView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/about-us" element={<AboutView />} />
          <Route path="/cancellation-policies" element={<PoliticasCancelacionView />} />
          <Route path="/data-privacy" element={<DataPrivacyPolicyView />} />
          <Route path="/politica-datos" element={<Navigate to="/data-privacy" replace />} />
          <Route path="/reservation-info" element={<ImportantReservationInfoView />} />
          <Route path="/informacion-reserva" element={<Navigate to="/reservation-info" replace />} />
          <Route path="/faq" element={<FaqView />} />
          <Route path="/preguntas-frecuentes" element={<Navigate to="/faq" replace />} />
          <Route path="/cookies" element={<CookiePolicyView />} />
          <Route path="/privacidad" element={<PrivacyPolicyView />} />
          <Route path="/politicas-cancelacion" element={<PoliticasCancelacionView />} />

          {/* Bloque condicional para rutas protegidas */}
          {isAuthenticated ? (
            <>
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/checkout" element={<CheckoutView />} />
              <Route path="/appointments" element={<CitasView />} />
              <Route path="/payment" element={<PaymentView />} />
              <Route path="/payment-confirmation" element={<SuccessView />} />
              <Route path="/cart" element={<CartView />} />

{/* Rutas de Administración Protegidas por Rol */}
              <Route element={<ErrorBoundary><Suspense fallback={<AdminLoadingSpinner />}><AdminRoute /></Suspense></ErrorBoundary>}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboardView />} />
                  <Route path="bookings" element={<AdminBookingsView />} />
                  <Route path="users" element={<AdminUsersListView />} />
                  <Route path="services" element={<AdminServicesListView />} />
                  <Route path="services/new" element={<CreateServiceView />} />
                  <Route path="services/edit/:id" element={<EditServiceView />} />
                  <Route path="navbar" element={<NavbarSettingsView />} />
                  <Route path="footer" element={<FooterSettingsView />} />
                  <Route path="social" element={<SocialLinksView />} />
                </Route>
              </Route>
            </>
          ) : (
            <>
              {/* Redirecciones para usuarios no autenticados en rutas privadas */}
              <Route path="/checkout" element={<Navigate to="/login" replace />} />
              <Route path="/appointments" element={<Navigate to="/login" replace />} />
              <Route path="/profile" element={<Navigate to="/login" replace />} />
              <Route path="/cart" element={<Navigate to="/login" replace />} />
              <Route path="/admin/*" element={<Navigate to="/" replace />} />
            </>
          )}

{/* Fallback para cualquier ruta no definida */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes> 
      </Router>
    </CartProvider>
    </ThemeProvider>
  );
}
