import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/layout/Footer';
import { fetchServices } from '../../models/servicesModel';
import { ChevronLeft, ChevronRight, Star, Clock, MapPin } from 'lucide-react';
import { Service } from '../../types';

function HomeView() {
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const totalImages = 3;
  const [services, setServices] = useState<Service[]>([]);

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
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="grow">
        
        {/* Hero Section */}
        <section className="relative h-[80vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/src/assets/bannerSpa.avif" 
              alt="L-Spa Banner" 
              className="w-full h-full object-cover brightness-50"
            />
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white w-full">
            <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
              <span className="inline-block px-3 py-1 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/30 text-primary-light text-sm font-medium mb-6">
                Bienvenido al Bienestar
              </span>
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight">
                ¡Bienvenido a <span className="text-primary-light">L-Spa!</span>
              </h1>
              <h2 className="text-2xl md:text-3xl font-light mb-8 text-gray-200">
                Un oasis de relajación en Medellín
              </h2>
              <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-lg">
                Descubre una experiencia única de bienestar y belleza. Reserva hoy y consiéntete como nunca antes.
              </p>
              <div className="flex flex-wrap gap-4">
                <button 
                  onClick={() => navigate('/services')}
                  className="btn btn-primary px-8 py-4 text-lg shadow-xl shadow-primary/20 hover:scale-105 transition-transform"
                >
                  Ver Servicios
                </button>
                <button 
                  onClick={() => navigate('/sobre-nosotros')}
                  className="btn bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 px-8 py-4 text-lg"
                >
                  Conócenos
                </button>
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
                <div key={i} className="card flex flex-col items-center text-center group hover:-translate-y-2 transition-transform duration-300">
                  <div className="mb-4 p-4 bg-primary/5 rounded-full group-hover:bg-primary/10 transition-colors">
                    {item.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestras Instalaciones</h2>
              <div className="h-1.5 w-20 bg-primary mx-auto rounded-full"></div>
            </div>
            
            <div className="relative group overflow-hidden rounded-2xl shadow-2xl">
              <div className="flex transition-transform duration-700 ease-in-out" style={{ transform: `translateX(-${activeIndex * 100}%)` }}>
                {[1, 2, 3].map((num) => (
                    <div key={num} className="min-w-full h-125">
                        <img 
                        src={`/assets/carrusel${num}.jpg`} 
                        alt={`Carrusel ${num}`} 
                        className="w-full h-full object-cover"
                        />
                    </div>
                ))}
              </div>
              
              <button 
                onClick={handlePrev}
                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/40 backdrop-blur-md text-gray-800 hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/40 backdrop-blur-md text-gray-800 hover:bg-white/80 transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight size={24} />
              </button>
            </div>
          </div>
        </section>

        {/* Featured Services Section */}
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-end mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Servicios Destacados</h2>
                <p className="text-gray-600">Lo mejor de nuestra selección para ti.</p>
              </div>
              <button onClick={() => navigate('/services')} className="text-primary font-semibold flex items-center gap-2 hover:underline">
                Ver todos <ChevronRight size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.slice(0, 3).map((s) => (
                <div
                  key={s.id}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer"
                  onClick={() => navigate(`/servicio/${s.id}`)}
                >
                  <div className="relative h-64 overflow-hidden">
                    {s.imagenURL ? (
                      <img
                        src={s.imagenURL}
                        alt={s.Nombre}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-400">📋</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                        <span className="text-white font-medium flex items-center gap-2">Explorar servicio <ChevronRight size={16} /></span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-primary transition-colors">{s.Nombre}</h4>
                    <p className="text-2xl font-bold text-primary">
                      {typeof s.Precio === 'number'
                        ? s.Precio.toLocaleString('es-CO', {
                            style: 'currency',
                            currency: 'COP',
                            minimumFractionDigits: 0,
                          })
                        : 'Precio no disponible'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

export default HomeView;

