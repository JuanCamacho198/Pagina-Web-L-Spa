import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import Footer from '@components/layout/Footer';
import { fetchServices } from '@models/servicesModel';
import { Star, Clock, MapPin, ChevronLeft, ChevronRight } from 'lucide-react';
import { Service } from '@/types/';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Typography } from '@/components/ui/Typography';
import bannerSpa from '@/assets/banners/bannerSpa.avif';

function HomeView() {
  const navigate = useNavigate();
  const { loginWithRedirect, isAuthenticated } = useAuth0();
  const [services, setServices] = useState<Service[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const totalImages = 3;

  useEffect(() => {
    async function loadServices() {
      const data = await fetchServices();
      setServices(data as Service[] || []);
    }
    loadServices();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % totalImages);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handlePrev = () => {
    setActiveIndex((prevIndex) => (prevIndex - 1 + totalImages) % totalImages);
  };

  const handleNext = () => {
    setActiveIndex((prevIndex) => (prevIndex + 1) % totalImages);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <main className="grow">
        
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src={bannerSpa} 
              alt="L-SPA Banner" 
              loading="lazy"
              className="w-full h-full object-cover brightness-50"
            />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
              <Badge variant="default" className="bg-primary/20 backdrop-blur-sm border-primary/30 text-primary-light mb-6 px-4 py-1.5 text-sm uppercase tracking-wider">
                Bienvenido al Bienestar
              </Badge>
              
              <Typography variant="h1" className="mb-6 leading-tight">
                ¡Bienvenido a <span className="text-primary-light">L-Spa!</span>
              </Typography>
              
              <Typography variant="h2" className="font-light mb-8 text-gray-200 border-none">
                Un oasis de relajación en Medellín
              </Typography>
              
              <Typography variant="lead" className="text-gray-200! mb-10 max-w-lg">
                Descubre una experiencia única de bienestar y belleza. Reserva hoy y consiéntete como nunca antes.
              </Typography>

              <div className="flex flex-wrap gap-4">
                <Button 
                  size="lg"
                  onClick={() => navigate('/services')}
                  className="px-8 py-6 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                  Ver Servicios
                </Button>
                {isAuthenticated ? (
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => navigate('/about-us')}
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg"
                  >
                    Conócenos
                  </Button>
                ) : (
                  <Button 
                    variant="outline"
                    size="lg"
                    onClick={() => loginWithRedirect()}
                    className="bg-white/10 backdrop-blur-md border-white/20 text-white hover:bg-white/20 px-8 py-6 text-lg font-bold"
                  >
                    INICIAR SESIÓN
                  </Button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Info Cards Section */}
        <section className="py-20 -mt-16 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { icon: <Star className="text-primary" />, title: "Calidad Premium", desc: "Tratamientos exclusivos con los mejores productos." },
                { icon: <Clock className="text-primary" />, title: "Tu Tiempo", desc: "Flexibilidad horaria para adaptarnos a tu ritmo de vida." },
                { icon: <MapPin className="text-primary" />, title: "Ubicación Ideal", desc: "Un refugio de paz en el corazón de Medellín." }
              ].map((item, i) => (
                <Card key={i} className="flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300 p-8 border-none shadow-xl shadow-gray-200/50">
                  <div className="mb-6 p-4 bg-primary/5 rounded-2xl group-hover:bg-primary/10 transition-colors">
                    {React.cloneElement(item.icon as React.ReactElement, { size: 32 } as any)}
                  </div>
                  <Typography variant="h4" className="mb-3 text-gray-800">{item.title}</Typography>
                  <Typography className="text-gray-500 text-sm leading-relaxed mt-0">{item.desc}</Typography>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="py-20 bg-white dark:bg-gray-900">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Typography variant="h2" className="text-gray-900 dark:text-white border-none mb-4">Nuestras Instalaciones</Typography>
              <div className="h-1.5 w-20 bg-primary mx-auto rounded-full"></div>
            </div>

            <div className="relative group overflow-hidden rounded-3xl shadow-2xl border-none">
              <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {[1, 2, 3].map((num) => (
                  <div key={num} className="min-w-full h-80 sm:h-100 md:h-137.5 relative">
                    <img
                      src={`/assets/carrusel${num}.jpg`}
                      alt={`Instalación ${num}`}
                      loading="lazy"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                  </div>
                ))}
              </div>

              <button
                onClick={handlePrev}
                className="absolute left-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/30 backdrop-blur-lg text-white hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/20"
              >
                <ChevronLeft size={28} />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-6 top-1/2 -translate-y-1/2 p-4 rounded-full bg-white/30 backdrop-blur-lg text-white hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 shadow-lg border border-white/20"
              >
                <ChevronRight size={28} />
              </button>

              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {[...Array(totalImages)].map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${activeIndex === i ? 'w-10 bg-primary' : 'w-2.5 bg-white/50'}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Featured Services Section (Preview) */}
        {services.length > 0 && (
          <section className="py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-end mb-12">
                <div>
                  <Typography variant="h2" className="text-gray-900 dark:text-white border-none">Nuestros Servicios</Typography>
                  <Typography className="text-gray-500 mt-2">Experiencias diseñadas para tu renovación total.</Typography>
                </div>
                <Button variant="outline" onClick={() => navigate('/services')}>Ver todos</Button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.slice(0, 3).map((service) => (
                  <Card key={service.id} className="overflow-hidden group border-none shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl">
                    <div className="h-64 overflow-hidden relative">
                      <img 
                        src={service.imageUrl || '/placeholder-spa.jpg'} 
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute top-4 right-4">
                        <Badge variant="default" className="bg-white/90 backdrop-blur-sm border-none text-primary font-bold px-3 py-1">
                          ${service.price}
                        </Badge>
                      </div>
                    </div>
                    <div className="p-8">
                      <div className="flex items-center gap-2 mb-3">
                        <Clock size={14} className="text-gray-400" />
                        <Typography variant="small" className="text-gray-400">{service.duration} min</Typography>
                      </div>
                      <Typography variant="h4" className="mb-2 text-gray-800">{service.name}</Typography>
                      <Typography className="text-gray-500 text-sm line-clamp-2 mt-0 mb-6">
                        {service.description}
                      </Typography>
                      <Button 
                        variant="secondary" 
                        className="w-full rounded-2xl group-hover:bg-primary group-hover:text-white transition-colors"
                        onClick={() => navigate(`/services`)}
                      >
                        Reservar Ahora
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default HomeView;
