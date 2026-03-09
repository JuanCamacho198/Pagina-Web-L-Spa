import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllServices } from '@/controllers/servicesController';
import Footer from '@/components/layout/Footer';
import { Filter, SortAsc, MessageCircle, ArrowRight, Search, ChevronDown } from 'lucide-react';
import { Service } from '@/types';
import { ServiceCardSkeleton } from '@/components/ui/Skeleton';
import { SearchBar } from '@/components/ui/SearchBar';
import { Dropdown } from '@/components/ui/Dropdown';
import { Button } from '@/components/ui/Button';
import CloudinaryImage from '@/components/CloudinaryImage';

const isCloudinaryUrl = (url: string): boolean => {
  return url?.includes('cloudinary.com') || url?.startsWith('https://res.cloudinary.com');
};

const extractPublicId = (url: string): string | null => {
  if (!url) return null;
  const match = url.match(/upload\/(?:v\d+\/)?(.+?)(?:\.|_)/);
  return match ? match[1] : null;
};

export default function ServicesView() {
  const [services, setServices] = useState<Service[]>([]);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortOption, setSortOption] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const categories = ['Todos', ...new Set(services.map(service => service.category || 'Sin Categoría'))];

  useEffect(() => {
    setIsLoading(true);
    getAllServices((data: any[]) => {
      setServices(data);
      setIsLoading(false);
    }, (err: string) => {
      setError(err);
      setIsLoading(false);
    });
  }, []);

  const goToServiceDetail = (name: string) => {
    const slug = name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-');
    navigate(`/service/${slug}`);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center bg-red-50 p-8 rounded-2xl border border-red-100 max-w-md">
          <p className="text-red-600 font-medium mb-4">Error al cargar servicios: {error}</p>
          <button onClick={() => window.location.reload()} className="btn btn-primary">Reintentar</button>
        </div>
      </div>
    );
  }

  let filteredServices = [...services];

  if (selectedCategory !== 'Todos') {
    filteredServices = filteredServices.filter(service => (service.category || 'Sin Categoría') === selectedCategory);
  }

  if (searchTerm) {
    filteredServices = filteredServices.filter(service => 
      (service.name || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortOption === 'nombre-asc') {
    filteredServices.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
  } else if (sortOption === 'nombre-desc') {
    filteredServices.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
  } else if (sortOption === 'precio-asc') {
    filteredServices.sort((a, b) => Number(a.price || 0) - Number(b.price || 0));
  } else if (sortOption === 'precio-desc') {
    filteredServices.sort((a, b) => Number(b.price || 0) - Number(a.price || 0));
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full grow">
        
        <header className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">Nuestros Servicios</h1>
          <div className="h-1.5 w-24 bg-primary mx-auto rounded-full mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Disfruta de nuestros tratamientos diseñados para tu relajación total.
          </p>
        </header>

        {/* Filtros y Búsqueda */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-12 flex flex-col lg:flex-row gap-6 items-center justify-between">
          
          <div className="w-full lg:max-w-xs">
            <SearchBar 
              value={searchTerm} 
              onChange={setSearchTerm} 
              placeholder="Buscar servicio..."
            />
          </div>

          <div className="flex flex-wrap gap-6 w-full lg:w-auto items-center">
            {/* Categoría */}
            <div className="flex items-center gap-3">
              <Filter size={18} className="text-primary" />
              <Dropdown
                align="left"
                trigger={
                  <Button variant="ghost" size="sm" className="flex gap-2 font-medium text-gray-700">
                    {selectedCategory}
                    <ChevronDown size={14} />
                  </Button>
                }
                items={categories.map(cat => ({
                  label: cat,
                  onClick: () => setSelectedCategory(cat)
                }))}
              />
            </div>

            {/* Orden */}
            <div className="flex items-center gap-3 border-l border-gray-200 pl-6">
              <SortAsc size={18} className="text-primary" />
              <Dropdown
                align="left"
                trigger={
                  <Button variant="ghost" size="sm" className="flex gap-2 font-medium text-gray-700">
                    {sortOption === 'nombre-asc' ? 'Nombre A-Z' :
                     sortOption === 'nombre-desc' ? 'Nombre Z-A' :
                     sortOption === 'precio-asc' ? 'Precio: Menor a Mayor' :
                     sortOption === 'precio-desc' ? 'Precio: Mayor a Menor' :
                     'Ordenar por'}
                    <ChevronDown size={14} />
                  </Button>
                }
                items={[
                  { label: 'Nombre A-Z', onClick: () => setSortOption('nombre-asc') },
                  { label: 'Nombre Z-A', onClick: () => setSortOption('nombre-desc') },
                  { label: 'Precio: Menor a Mayor', onClick: () => setSortOption('precio-asc') },
                  { label: 'Precio: Mayor a Menor', onClick: () => setSortOption('precio-desc') },
                ]}
              />
            </div>
          </div>

          <div className="text-sm font-medium text-gray-400 whitespace-nowrap">
            {filteredServices.length} {filteredServices.length === 1 ? 'servicio' : 'servicios'}
          </div>
        </div>

        {/* Grid de Servicios */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <ServiceCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredServices.map(service => (
              <div
                key={service.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-transparent hover:border-primary/50 dark:border-gray-700 cursor-pointer"
                onClick={() => goToServiceDetail(service.name)} 
              >
                <div className="relative h-56 overflow-hidden bg-gray-100">
                  {service.imageUrl && isCloudinaryUrl(service.imageUrl) ? (
                    <CloudinaryImage
                      publicId={extractPublicId(service.imageUrl) || ''}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      options={{ width: 400, height: 224, crop: 'fill' }}
                      alt={service.name}
                    />
                  ) : (
                    <img
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      src={service.imageUrl || `/assets/${service.imageFileName}`}
                      alt={service.name}
                      loading="lazy"
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary uppercase tracking-wider shadow-sm">
                      {service.category}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h2 className="text-lg font-bold text-gray-900 mb-2 truncate group-hover:text-primary transition-colors">{service.name}</h2>
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-xl font-black text-primary">
                      {Number(service.price || 0).toLocaleString('es-CO', {
                        style: 'currency',
                        currency: 'COP',
                        minimumFractionDigits: 0,
                      })}
                    </p>
                    <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                      <ArrowRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-white rounded-3xl border border-dashed border-gray-300">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-full mb-6 text-gray-300">
              <Search size={40} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">No encontramos resultados</h3>
            <p className="text-gray-500">Intenta ajustar tus filtros o tu búsqueda.</p>
            <button 
              onClick={() => { setSelectedCategory('Todos'); setSearchTerm(''); setSortOption(''); }}
              className="mt-6 font-semibold hover:underline text-primary"
            >
              Limpiar todos los filtros
            </button>
          </div>
        )}
      </section>

      {/* Info WhatsApp Section */}
      <section className="bg-primary overflow-hidden relative mt-16">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,var(--tw-gradient-stops))] from-white to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10 flex flex-col md:flex-row items-center justify-between gap-12 text-white">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-3xl font-bold mb-6">Reserva en segundos por WhatsApp</h3>
            <div className="space-y-4 text-white">
              <p className="flex items-center gap-3 justify-center md:justify-start">
                <span className="w-2.5 h-2.5 bg-secondary rounded-full shadow-sm"></span>
                Atención personalizada e inmediata
              </p>
              <p className="flex items-center gap-3 justify-center md:justify-start">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Respondemos en menos de 5 minutos
              </p>
              <p className="flex items-center gap-3 justify-center md:justify-start">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                Venta online 24/7
              </p>
            </div>
          </div>
          
          <div className="flex flex-col items-center gap-4 bg-white/10 dark:bg-gray-800/20 backdrop-blur-md p-8 rounded-3xl border border-white/20 dark:border-gray-700/50 shadow-2xl">
            <MessageCircle size={48} className="animate-bounce" />
            <div className="text-center">
              <p className="text-sm font-medium opacity-80 mb-1">Escríbenos al</p>
              <p className="text-2xl font-black mb-6">+57 300 320 8295</p>
            </div>
            <a
              href="https://wa.me/573003208295"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:bg-gray-100 transition-all flex items-center gap-3 shadow-xl"
            >
              Ir a WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}