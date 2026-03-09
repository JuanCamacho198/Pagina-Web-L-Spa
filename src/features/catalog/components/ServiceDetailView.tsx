// src/features/catalog/components/ServiceDetailView.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { db, cartItems, users } from '../../../db';
import { eq } from 'drizzle-orm';
import { fetchServiceByName, fetchServices } from '../../../models/servicesModel';
import { Service } from '../../../types';
import { ShoppingCart, Calendar, Clock, Tag, X, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import CloudinaryImage from '../../../components/CloudinaryImage';
import JsonLd from '../../../components/JsonLd';
import ReviewList from './ReviewList';
import ReviewForm from './ReviewForm';

const isCloudinaryUrl = (url: string): boolean => {
  return url?.includes('cloudinary.com') || url?.startsWith('https://res.cloudinary.com');
};

const extractPublicId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/upload\/(?:v\d+\/)?(.+?)(?:\.|_)/);
  return match ? match[1] : null;
};

const ServiceDetailView = () => {
  const { id } = useParams<{ id: string }>(); // 'id' ahora es el slug del nombre
  const { user, isAuthenticated } = useAuth0();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendedServices, setRecommendedServices] = useState<Service[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [reviewKey, setReviewKey] = useState(0); // Para forzar el refresco de las reseñas
  const navigate = useNavigate();

  const handleReviewSubmitted = () => {
    setReviewKey(prev => prev + 1);
  };

  // Función para mostrar notificaciones
  const showNotification = (message: string, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        // Buscamos por nombre (slug) en lugar de UUID
        const fetchedService = await fetchServiceByName(id);

        if (fetchedService) {
          setService(fetchedService);

          // Obtener otros servicios sugeridos
          const allServices = await fetchServices();
          const otrosServicios = allServices.filter(s => s.id !== fetchedService.id);

          // Limitar a 3 servicios aleatorios
          const seleccionados = otrosServicios
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

          setRecommendedServices(seleccionados);
        } else {
          setError('Servicio no encontrado.');
        }
      } catch (err: any) {
        console.error('Error al obtener el servicio:', err);
        setError('Error al cargar el servicio.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = async () => { 
    if (service) {
      if (isAuthenticated && user?.sub) {
        setIsAddingToCart(true);
        try {
          // Buscamos el ID del usuario en Postgres por auth0Id
          const userResult = await db.select({ id: users.id })
            .from(users)
            .where(eq(users.auth0Id, user.sub))
            .limit(1);

          if (userResult.length === 0) {
            throw new Error("Usuario no encontrado en la base de datos.");
          }

          const userId = userResult[0].id;

          // Añadir al carrito en Postgres
          await db.insert(cartItems).values({
            userId: userId,
            serviceId: service.id,
          });

          showNotification(`✅ ${service.name} ha sido añadido al carrito exitosamente`, 'success');
        } catch (e: any) {
          console.error('Error añadiendo al Carrito', e);
          showNotification('❌ Error al añadir el servicio al carrito. Inténtalo de nuevo.', 'error');
        } finally {
          setIsAddingToCart(false);
        }
      } else {
        showNotification('🔐 Necesitas iniciar sesión para añadir servicios al carrito', 'warning'); 
      }
    }
  };
  const handleBuyNow = () => { 
    if (service) {
      navigate(`/checkout?serviceId=${service.id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-500 font-medium">Cargando detalles del servicio...</p>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50">
        <div className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Vaya! Algo salió mal</h2>
          <p className="text-gray-500 mb-6">{error || 'No se ha seleccionado ningún servicio.'}</p>
          <button onClick={() => navigate('/services')} className="btn btn-primary w-full">
            Ver otros servicios
          </button>
        </div>
      </div>
    );
  }

return (
    <>
      <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "LocalBusiness",
        "name": "L-Spa",
        "image": "https://l-spa.com/logo.png",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Medellín",
          "addressRegion": "Antioquia",
          "addressCountry": "CO"
        },
        "telephone": "+57-300-123-4567",
        "priceRange": "$$",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "20:00"
          },
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Saturday", "Sunday"],
            "opens": "10:00",
            "closes": "18:00"
          }
        ]
      }} />
      
      {service && <JsonLd data={{
        "@context": "https://schema.org",
        "@type": "Service",
        "name": service.name,
        "description": `Disfruta de nuestro servicio de ${service.name}. Un oasis de relajación en Medellín.`,
        "provider": {
          "@type": "LocalBusiness",
          "name": "L-Spa",
          "image": "https://l-spa.com/logo.png"
        },
        "areaServed": {
          "@type": "City",
          "name": "Medellín"
        },
        "priceSpecification": {
          "@type": "PriceSpecification",
          "price": service.price,
          "priceCurrency": "COP"
        },
        "serviceType": service.category,
        "duration": `PT${service.duration}M`
      }} />}
      
      <div className="min-h-screen bg-gray-50 pb-20">
      <Helmet>
        <title>{service.name} - Luxury Spa Medellín</title>
        <meta name="description" content={`Disfruta de nuestro servicio de ${service.name}. Un oasis de relajación en Medellín.`} />
        <meta property="og:title" content={`${service.name} - Luxury Spa`} />
        <meta property="og:description" content={`Reserva hoy tu ${service.name} y experimenta el mejor spa en Medellín.`} />
        {service.imageUrl && <meta property="og:image" content={service.imageUrl} />}
      </Helmet>

      {/* Notificaciones */}
      {notification && (
        <div className="fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border ${
            notification.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : 
            notification.type === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-800' : 
            'bg-red-50 border-red-200 text-red-800'
          }`}>
            {notification.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-4 opacity-50 hover:opacity-100 Transition-all">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="bg-primary pt-32 pb-48 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 items-center text-center md:text-left text-white">
          <div className="flex-1 space-y-4">
             <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold tracking-widest uppercase">
               {service.category}
             </span>
             <h1 className="text-4xl md:text-6xl font-black tracking-tight">{service.name}</h1>
          </div>
          <div className="text-3xl md:text-5xl font-black">
            {Number(service.price || 0).toLocaleString('es-CO', {
              style: 'currency',
              currency: 'COP',
              minimumFractionDigits: 0,
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 -mt-32">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Imagen y Características */}
          <div className="lg:col-span-2 space-y-8">
             <div className="bg-white p-4 rounded-[3rem] shadow-2xl border border-white overflow-hidden aspect-video relative group">
                 {service.imageUrl && isCloudinaryUrl(service.imageUrl) ? (
                   <CloudinaryImage
                     publicId={extractPublicId(service.imageUrl) || ''}
                     className="w-full h-full object-cover rounded-[2.5rem] transition-transform duration-700 group-hover:scale-105"
                     options={{ width: 1200, height: 675, crop: 'fill' }}
                     alt={service.name}
                   />
                 ) : (
                   <img 
                     src={service.imageUrl || `/assets/${service.imageFileName}`} 
                     alt={service.name} 
                     className="w-full h-full object-cover rounded-[2.5rem] transition-transform duration-700 group-hover:scale-105"
                   />
                 )}
              </div>

             <div className="bg-white p-10 md:p-12 rounded-[3rem] shadow-xl border border-gray-100">
                <h3 className="text-2xl font-black text-gray-900 mb-6">Sobre esta experiencia</h3>
                <p className="text-lg text-gray-600 leading-relaxed mb-8">
                  Sumérgete en un oasis de relajación con nuestro exclusivo tratamiento de {(service.name || '').toLowerCase()}. 
                  Diseñado para revitalizar cuerpo y mente, esta experiencia combina técnicas ancestrales con lo último en bienestar.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                   <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                      <Clock className="text-primary" size={24} />
                      <div className="text-sm font-bold text-gray-700">{service.duration} min</div>
                   </div>
                   <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-2xl">
                      <Tag className="text-primary" size={24} />
                      <div className="text-sm font-bold text-gray-700">{service.category}</div>
                   </div>
                </div>
             </div>
          </div>

          {/* Sidebar Acciones */}
          <div className="space-y-6">
             <div className="sticky top-28 bg-white p-8 rounded-[2.5rem] shadow-2xl border border-primary/10 space-y-6">
                <div className="text-center">
                   <div className="text-sm text-gray-500 uppercase font-black tracking-widest mb-1">Precio Total</div>
                   <div className="text-4xl font-black text-primary">
                      {Number(service.price || 0).toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                      })}
                   </div>
                </div>

                <div className="space-y-4 pt-4">
                   <button 
                    onClick={handleBuyNow}
                    className="w-full py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/20 flex items-center justify-center gap-3"
                   >
                     <Calendar size={22} />
                     Reservar Ahora
                   </button>
                   
                   <button 
                    onClick={handleAddToCart}
                    disabled={isAddingToCart}
                    className="w-full py-5 border-2 border-primary text-primary font-black rounded-2xl hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1 flex items-center justify-center gap-3 disabled:opacity-50"
                   >
                     {isAddingToCart ? (
                       <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                     ) : <ShoppingCart size={22} />}
                     Añadir al Carrito
                   </button>
                </div>

                <div className="pt-6 border-t border-gray-100 flex items-center gap-2 text-primary font-bold justify-center">
                   <span className="text-sm">Transacción 100% Segura</span>
                </div>
             </div>
          </div>
        </div>

        {/* Recomendados */}
        <section className="mt-24">
          <h3 className="text-3xl font-black text-gray-900 mb-10 flex items-center gap-4">
             <Sparkles className="text-primary" /> También te podría encantar
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {recommendedServices.map((rec) => (
              <div 
                key={rec.id} 
                className="group bg-white rounded-[2.5rem] shadow-lg border border-gray-100 overflow-hidden cursor-pointer hover:-translate-y-2 transition-all duration-300"
                onClick={() => navigate(`/service/${rec.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')}`)}
              >
                <div className="h-48 overflow-hidden relative">
                  {rec.imageUrl && isCloudinaryUrl(rec.imageUrl) ? (
                    <CloudinaryImage
                      publicId={extractPublicId(rec.imageUrl) || ''}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      options={{ width: 400, height: 192, crop: 'fill' }}
                      alt={rec.name}
                    />
                  ) : (
                    <img 
                      src={rec.imageUrl || `/assets/${rec.imageFileName}`} 
                      alt={rec.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    />
                  )}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur rounded-full text-xs font-bold text-primary shadow-sm">
                    {rec.category}
                  </div>
                </div>
                <div className="p-6">
                  <h4 className="text-xl font-black text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">{rec.name}</h4>
                  <p className="text-lg font-bold text-primary">${Number(rec.price || 0).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Sección de Reseñas */}
        <section className="mt-32 pt-16 border-t border-gray-100">
           <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              <div>
                 <h3 className="text-3xl font-black text-gray-900 mb-4 flex items-center gap-4">
                    Reseñas de Clientes
                 </h3>
                 <p className="text-lg text-gray-500 mb-10 font-medium">
                    Lo que nuestros visitantes opinan sobre su experiencia en L-Spa.
                 </p>
                 <ReviewList key={reviewKey} serviceId={service.id} />
              </div>
              
              <div className="sticky top-28">
                 <ReviewForm 
                    serviceId={service.id} 
                    onReviewSubmitted={handleReviewSubmitted} 
                 />
              </div>
           </div>
        </section>
      </div>
    </div>

    </>
  );
};

export default ServiceDetailView;
