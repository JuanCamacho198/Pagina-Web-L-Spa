import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Eye, ShieldCheck, Heart, Sparkles, Coffee } 
from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function AboutView() {
  const navigate = useNavigate();

  return (
    <>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative h-[50vh] flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img 
              src="/src/assets/banners/bannerSpa.avif" 
              alt="L-SPA Banner" 
              loading="lazy"
              className="w-full h-full object-cover brightness-[0.4]"
            />
          </div>
          <div className="relative z-10 text-center px-4 max-w-3xl animate-in fade-in zoom-in duration-700">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Nuestra <span className="text-primary italic">Esencia</span>
            </h1>
            <p className="text-xl text-gray-200 font-medium leading-relaxed">
              Más que un spa, somos un santuario dedicado a restaurar tu equilibrio vital y belleza natural en el corazón de Medellín.
            </p>
          </div>
        </section>

        {/* Misión y Visión Grid */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="space-y-8 animate-in slide-in-from-left duration-700">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-bold uppercase tracking-widest">
                <Target size={16} /> Nuestra Misión
              </div>
              <h2 className="text-4xl font-black text-gray-900 tracking-tight leading-tight">
                Compromiso con tu <span className="text-primary">Bienestar Integral</span>
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                En <strong className="text-gray-900">L-Spa</strong>, nos dedicamos a ofrecer un servicio integral de calidad en relajación, vitalidad, belleza y salud. Nuestra prioridad es la satisfacción total a través de una atención personalizada y eficiente que trasciende lo convencional.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-4 bg-gray-50 rounded-4xlxl border border-gray-100 flex items-start gap-3">
                  <ShieldCheck className="text-primary shrink-0" size={20} />
                  <span className="text-sm font-bold text-gray-700">Calidad Certificada</span>
        
                </div>
                <div className="p-4 bg-gray-50 rounded-4xlxl border border-gray-100 flex items-start gap-3">
                  <Heart className="text-primary shrink-0" size={20} />
                  <span className="text-sm font-bold text-gray-700">Pasión por el Detalle</span>
                </div>
              </div>
            </div>

            <div className="relative animate-in slide-in-from-right duration-700">
              <div className="bg-primary/5 rounded-[3rem] p-10 lg:p-16 border-2 border-dashed border-primary/20">
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary rounded-full text-sm font-bold uppercase tracking-widest shadow-sm mb-8">
                    <Eye size={16} /> Nuestra Visión 2026
                  </div>
                  <h3 className="text-3xl font-black text-gray-900 mb-6 tracking-tight">
                    Referente de <span className="text-primary">Excelencia</span> en Antioquia
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed italic">
                    "Ser reconocidos como el mejor spa de Medellín, destacando por nuestra innovación técnica y el compromiso humano inquebrantable que genera confianza duradera en cada cliente."
                  </p>
              </div>
              {/* Abstract elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-100/30 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Valores */}
        <section className="bg-gray-50 py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Nuestros Pilares</h2>
            <p className="text-gray-500 max-w-2xl mx-auto font-medium">
              Valores que guían cada tratamiento y cada sonrisa que brindamos.
            </p>
          </div>

          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Sparkles, 
                title: "Mejora Continua", 
                desc: "Innovamos constantemente en técnicas de spa para ofrecerte lo último en bienestar." 
              },
              { 
                icon: Coffee, 
                title: "Atención Plus", 
                desc: "Personalización absoluta. Entendemos tus necesidades antes de que las expreses." 
              },
              { 
                icon: ShieldCheck, 
                title: "Confianza", 
                desc: "Transparencia y profesionalismo en cada etapa de tu experiencia con nosotros." 
              }
            ].map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-4xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="w-14 h-14 bg-primary/10 rounded-4xlxl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all">
                  <v.icon size={28} />
                </div>
                <h4 className="text-xl font-black text-gray-900 mb-3">{v.title}</h4>
                <p className="text-gray-500 leading-relaxed font-medium">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-24 px-4 text-center">
          <div className="max-w-4xl mx-auto p-12 md:p-20 bg-primary rounded-[3.5rem] shadow-2xl shadow-primary/30 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-full h-full bg-[url('/src/assets/banners/bannerSpa.avif')] opacity-20 object-cover scale-150 group-hover:scale-125 transition-transform duration-1000"></div>
            <div className="relative z-10">
              <h2 className="text-white text-3xl md:text-5xl font-black mb-8 tracking-tight">
                ¿Listo para tu transformación?
              </h2>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => navigate('/contacto')}
                  className="px-10 py-5 bg-white text-primary font-black rounded-4xlxl hover:scale-105 transition-transform shadow-xl"
                >
                  Contáctanos Ahora
                </button>
                <button 
                  onClick={() => navigate('/services')}
                  className="px-10 py-5 bg-primary-dark text-white font-black rounded-4xlxl border-2 border-white/20 hover:bg-white/10 transition-colors"
                >
                  Explorar Servicios
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
}

