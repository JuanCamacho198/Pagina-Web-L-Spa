// src/features/static/PublicHomeView.tsx

import Footer from '../../components/layout/Footer';
import { Link } from 'react-router-dom';

export default function PublicHomeView() {
  return (
    <>
      <div className="bg-[#dac794] min-h-screen">
        {/* Banner principal */}
        <header className="grid grid-cols-1 md:grid-cols-2 items-center gap-8 py-16 px-8">
          <div className="animate-in fade-in slide-in-from-left duration-700">
            <h1 className="text-5xl font-bold mb-4 text-[#3A3831]">¡Bienvenido a L-Spa!</h1>
            <h2 className="text-3xl font-semibold mb-4 text-[#3A3831]">Spa exclusivo en Medellín</h2>
            <p className="text-lg mb-8 text-[#3A3831] leading-relaxed">
              Sumérgete en un oasis de relajación y belleza. Experimenta
              tratamientos exclusivos diseñados para revitalizarte. ¡Reserva ahora
              y déjate consentir!
            </p>
            <div className="flex gap-4">
              <Link to="/contacto" className="px-6 py-3 rounded-lg font-medium bg-[#3A3831] text-[#F5E8D0] hover:bg-[#2E2C28] transition-colors">
                ¿Quieres Conocernos?
              </Link>
              <Link to="/servicios" className="px-6 py-3 rounded-lg font-medium border-2 border-[#3A3831] text-[#3A3831] hover:bg-[#3A3831] hover:text-[#F5E8D0] transition-colors">
                Ver Servicios
              </Link>
            </div>
          </div>
          <div className="hidden md:block animate-in fade-in slide-in-from-right duration-700">
            <img 
              src="/src/assets/bannerSpa.avif" 
              alt="Spa" 
              loading="lazy"
              className="w-full h-auto rounded-tl-[80px] rounded-bl-[80px] rounded-tr-lg rounded-br-lg shadow-2xl"
            />
          </div>
        </header>

        {/* Segundo bloque de información */}
        <section className="flex flex-wrap justify-center gap-8 p-8 pb-16">
          <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:-translate-y-1 transition-transform max-w-sm flex-1">
            <h3 className="text-xl font-bold text-gray-800">Más de 5 años ofreciendo servicios</h3>
          </div>
          <div className="bg-white rounded-xl p-8 text-center shadow-lg hover:-translate-y-1 transition-transform max-w-sm flex-1">
            <h3 className="text-xl font-bold text-gray-800">Encuéntranos en Calle87c #23-52</h3>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}
