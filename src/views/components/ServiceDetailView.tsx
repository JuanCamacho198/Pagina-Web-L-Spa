// src/views/components/ServiceDetailView.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db, cartItems, users } from '../../db';
import { eq } from 'drizzle-orm';
import { getAuth } from '@/lib/auth';
import { fetchServiceById, fetchServices } from '../../models/servicesModel';
import { Service } from '../../types';
import styles from '../../styles/ServiceDetailView.module.css';

const ServiceDetailView = () => {
  const { id } = useParams<{ id: string }>();
  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recommendedServices, setRecommendedServices] = useState<Service[]>([]);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();
  const auth = getAuth();

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
        const fetchedService = await fetchServiceById(id);

        if (fetchedService) {
          setService(fetchedService);

          // Obtener otros servicios sugeridos
          const allServices = await fetchServices();
          const otrosServicios = allServices.filter(s => s.id !== id);

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
      const currentUser = auth.currentUser;
      if (currentUser) {
        setIsAddingToCart(true);
        try {
          // Buscamos el ID del usuario en Postgres
          const userResult = await db.select({ id: users.id })
            .from(users)
            .where(eq(users.firebaseUid, currentUser.uid))
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

          showNotification(`✅ ${service.Nombre} ha sido añadido al carrito exitosamente`, 'success');
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

  if (loading) return <p className="p-8 text-center text-gray-500">Cargando detalles del servicio...</p>;
  if (error) return <p className="p-8 text-center text-red-500">Error: {error}</p>;
  if (!service) return <p className="p-8 text-center text-gray-500">No se ha seleccionado ningún servicio.</p>;

  return (
    <>
      {notification && (
        <div className={`${styles.notification} ${styles['notification-' + notification.type]}`}>
          <div className={styles['notification-content']}>
            <span className={styles['notification-message']}>{notification.message}</span>
            <button 
              className={styles['notification-close']} 
              onClick={() => setNotification(null)}
              aria-label="Cerrar notificación"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <div className={styles['service-detail']}>
        <h2 className={styles['service-detail-title']}>{service.Nombre}</h2>

        <div className={styles['service-detail-content']}>
          <div className={styles['service-detail-left']}>
            <div className={styles['service-detail-image-container']}>
              {service.imagenURL && (
                <img src={service.imagenURL} alt={service.Nombre} className={styles['service-detail-image']} />
              )}
            </div>

            <div className={styles['service-detail-info']}>
              <p className={styles['service-detail-price']}>
                Precio: {service.Precio.toLocaleString('es-CO', {
                  style: 'currency',
                  currency: 'COP',
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 0,
                })}
              </p>
              
              <div className={styles['service-detail-meta']}>
                <span className={styles['service-detail-duration']}>
                  ⏱ Duración: {service.Duracion}
                </span>
                <span className={styles['service-detail-category']}>
                  🏷 Categoría: {service.Categoria}
                </span>
              </div>
            </div>
          </div>

          <div className={styles['service-detail-right']}>
            <div className={styles['service-detail-description']}>
              <h3>Sobre este servicio</h3>
              <p>Disfruta de una experiencia única de relajación y bienestar en Luxury Spa. Nuestros profesionales se encargarán de brindarte la mejor atención.</p>
            </div>

            <div className={styles['service-detail-actions']}>
              <button 
                className={styles['btn-add-cart']} 
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Añadiendo...' : 'Añadir al carrito'}
              </button>
              <button className={styles['btn-buy-now']} onClick={handleBuyNow}>
                Reservar Ahora
              </button>
            </div>
          </div>
        </div>

        <div className={styles['recommended-services']}>
          <h3>También te puede interesar</h3>
          <div className={styles['recommended-grid']}>
            {recommendedServices.map((rec) => (
              <div 
                key={rec.id} 
                className={styles['recommended-card']}
                onClick={() => navigate(`/service-detail/${rec.id}`)}
              >
                <img src={rec.imagenURL} alt={rec.Nombre} />
                <h4>{rec.Nombre}</h4>
                <p>${rec.Precio.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ServiceDetailView;
