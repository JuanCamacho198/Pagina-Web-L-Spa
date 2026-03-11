import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, Sparkles, Users, Clock, Info } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function FaqView() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      q: "¿Qué incluye mi ritual o experiencia?",
      a: "Cada ritual incluye diferentes zonas húmedas, masajes, exfoliaciones, mascarillas y experiencias sensoriales. Puedes revisar el detalle en la página de servicios o en la confirmación de tu reserva.",
      icon: Sparkles
    },
    {
      q: "¿Puedo asistir acompañado?",
      a: "Sí, tenemos rituales individuales, en pareja y grupales. Algunos planes están diseñados exclusivamente para compartir.",
      icon: Users
    },
    {
      q: "¿Debo llevar algo para mi reserva?",
      a: "Solo necesitas traer tu traje de baño y sandalias cómodas. Nosotros te proporcionamos bata, toalla, casillero y demás implementos necesarios.",
      icon: Info
    },
    {
      q: "¿Con cuánta anticipación debo llegar?",
      a: "Recomendamos llegar con al menos 15 minutos de anticipación para garantizar que puedas disfrutar tu experiencia completa y sin contratiempos.",
      icon: Clock
    },
    {
      q: "¿Está permitido ingresar con alimentos o bebidas?",
      a: "No. En Grupo L-Spa te ofrecemos bebidas especiales como vino o té según el ritual, pero no está permitido ingresar con alimentos o bebidas del exterior.",
      icon: Info
    },
    {
        q: "¿Hay parqueadero disponible?",
        a: "Sí, contamos con parqueadero gratuito para nuestros clientes. Sin embargo, Grupo L-Spa no se hace responsable por objetos dejados en los vehículos.",
        icon: Info
    },
    {
        q: "¿Pueden asistir menores de edad?",
        a: "No, nuestras experiencias están diseñadas para mayores de edad. En algunos casos específicos podemos aceptar mayores de 16 años acompañados por un adulto.",
        icon: Info
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-4">
            <HelpCircle size={16} /> Centro de Ayuda
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
            Preguntas <span className="text-primary italic">Frecuentes</span>
          </h1>
          <p className="text-lg text-gray-500 font-medium italic">
            Resolvemos tus dudas para que tu única preocupación sea relajarte.
          </p>
        </div>

        {/* Accordion */}
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div 
              key={idx} 
              className={`bg-white rounded-4xlxl border transition-all duration-300 overflow-hidden ${
                openIndex === idx ? 'border-primary shadow-xl shadow-primary/5' : 'border-gray-100 shadow-sm hover:border-gray-200'
              }`}
            >
              <button 
                onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-4xll transition-colors ${openIndex === idx ? 'bg-primary text-white' : 'bg-gray-50 text-gray-400 group-hover:text-primary'}`}>
                    <faq.icon size={20} />
                  </div>
                  <span className={`text-lg font-black tracking-tight transition-colors ${openIndex === idx ? 'text-gray-900' : 'text-gray-700'}`}>
                    {faq.q}
                  </span>
                </div>
                {openIndex === idx ? <ChevronUp className="text-primary" /> : <ChevronDown className="text-gray-300" />}
              </button>
              
              {openIndex === idx && (
                <div className="px-6 md:px-20 pb-8 animate-in slide-in-from-top-2 duration-300">
                  <p className="text-gray-600 font-medium leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support CTA */}
        <div className="mt-16 p-10 bg-gray-900 rounded-[3rem] text-center text-white relative overflow-hidden">
           <div className="absolute top-0 left-0 w-full h-full bg-primary/5 pointer-events-none"></div>
           <h3 className="text-2xl font-black mb-4 tracking-tight">¿No encontraste lo que buscabas?</h3>
           <p className="text-gray-400 font-medium mb-8">Nuestro equipo de soporte está disponible vía WhatsApp para ayudarte.</p>
           <button className="px-8 py-4 bg-primary text-white font-black rounded-4xlxl hover:scale-105 transition-transform shadow-lg shadow-primary/20">
             Hablar con un Asesor
           </button>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}


