import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import { CartProvider } from '@/context/CartContext';
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

import ServicesView from '@/features/catalog/ServicesView';
import CheckoutView from '@/features/booking/CheckoutView';
import CitasView from '@/features/booking/CitasView';
import PaymentView from '@/features/booking/PaymentView';
import SuccessView from '@/features/booking/SuccessView';
import CartView from '@/features/booking/CartView';

import ContactView from '@/features/static/ContactView';
import AboutView from '@/features/static/AboutView';

import AdminDashboardView from '@/features/admin/AdminDashboardView';
import AdminServicesListView from '@/features/admin/AdminServicesListView';
import AdminUsersListView from '@/features/admin/AdminUsersListView';
import CreateServiceView from '@/features/admin/CreateServiceView';
import EditServiceView from '@/features/admin/EditServiceView';
import NavbarSettingsView from '@/features/admin/NavbarSettingsView';

import { AuthSync } from '@/components/shared/AuthSync';

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
          {/* RUTA HOME UNIFICADA */}
          <Route path="/" element={<HomeView />} />
          <Route path="/home" element={<Navigate to="/" replace />} />

          {/* Rutas compartidas (Públicas y Privadas) */}
          <Route path="/services" element={<ServicesView />} />
          <Route path="/contact" element={<ContactView />} />
          <Route path="/about-us" element={<AboutView />} />
          <Route path="/cancellation-policies" element={<PoliticasCancelacionView />} />
          <Route path="/data-privacy" element={<DataPrivacyPolicyView />} />
          <Route path="/reservation-info" element={<ImportantReservationInfoView />} />
          <Route path="/faq" element={<FaqView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/service/:id" element={<ServiceDetailView />} />

          {/* Bloque condicional para rutas protegidas */}
          {isAuthenticated ? (
            <>
              <Route path="/profile" element={<ProfileView />} />
              <Route path="/checkout" element={<CheckoutView />} />
              <Route path="/appointments" element={<CitasView />} />
              <Route path="/payment" element={<PaymentView />} />
              <Route path="/payment-confirmation" element={<SuccessView />} />
              <Route path="/cart" element={<CartView />} />

              {/* Rutas de Administración */}
              <Route path="/admin" element={<AdminDashboardView />} />
              <Route path="/admin/users" element={<AdminUsersListView />} />
              <Route path="/admin/services" element={<AdminServicesListView />} />
              <Route path="/admin/services/new" element={<CreateServiceView />} />
              <Route path="/admin/services/edit/:id" element={<EditServiceView />} />
              <Route path="/admin/navbar" element={<NavbarSettingsView />} />
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
  ); 
}
