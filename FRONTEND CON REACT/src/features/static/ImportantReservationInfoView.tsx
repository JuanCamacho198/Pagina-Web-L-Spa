import React from 'react';
import { AlertCircle, ShieldAlert, Sparkles, MapPin, Watch, Wine, Info } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function ImportantReservationInfoView() {
  const points = [
    {
      icon: ShieldAlert,
      title: "Objetos de Valor",
      desc: "No es necesario asistir con objetos de valor como cadenas, anillos o relojes. Interfieren con el servicio y no nos hacemos responsables por pérdidas."
    },
    {
      icon: Watch,
      title: "Puntualidad",
      desc: "Llega 15 minutos antes. El tráfico en El Poblado es impredecible. Tu puntualidad garantiza el tiempo completo de tu ritual."
    },
    {
      icon: MapPin,
      title: "Verifica tu Sede",
      desc: "Contamos con 2 sedes en El Poblado. Asegúrate de llegar a la elegida en tu reserva."
    },
    {
      icon: Info,
      title: "Indumentaria",
      desc: "Asiste con traje de baño y sandalias cómodas. Te proporcionaremos bata y toalla."
    },
    {
      icon: AlertCircle,
      title: "Restricciones",
      desc: "No se permite el ingreso de alimentos, bebidas del exterior ni sustancias alucinógenas."
    },
    {
        icon: Sparkles,
        title: "Cuidado de Instalaciones",
        desc: "Evita manipular perillas de saunas o turcos. Elementos quebrados (copas/platos) serán cargados a tu cuenta."
    }
  ];

  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-32 pb-24 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-[4rem] p-10 md:p-20 shadow-2xl shadow-gray-200/50 border border-gray-100 relative">
          {/* Background Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50 rounded-full -mr-32 -mt-32 blur-3xl opacity-50"></div>
          
          <div className="relative z-10">
            <header className="mb-20">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest mb-6">
                <AlertCircle size={14} /> Importante
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6 tracking-tight">
                Información para <span className="text-amber-600 italic">tu Visita</span>
              </h1>
              <p className="text-xl text-gray-500 font-medium leading-relaxed max-w-3xl">
                Queremos que disfrutes cada segundo de tu estancia. Por favor, lee estas recomendaciones y compártelas con tus acompañantes.
              </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
              {points.map((p, i) => (
                <div key={i} className="group relative">
                  <div className="absolute -top-10 left-0 text-[8rem] font-black text-gray-50 -z-10 select-none group-hover:text-amber-50 transition-colors duration-500">
                    {i + 1}
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="w-12 h-12 bg-gray-900 text-white rounded-4xll flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                      <p.icon size={22} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 tracking-tight">{p.title}</h3>
                    <p className="text-gray-500 leading-relaxed font-bold italic text-sm">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-20 p-8 bg-gray-50 rounded-[2.5rem] border border-dashed border-gray-300 flex flex-col md:flex-row items-center gap-6">
               <div className="w-16 h-16 bg-white rounded-4xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                  <Wine size={32} />
               </div>
               <p className="text-gray-600 font-medium italic text-center md:text-left">
                 "Recuerda que estamos para brindarte una experiencia de lujo. El respeto por las normas garantiza un ambiente de paz para todos nuestros visitantes."
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Footer />
    </>
  );
}

