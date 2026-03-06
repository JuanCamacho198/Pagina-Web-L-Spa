import React from 'react';
import { CalendarX, Receipt, CreditCard, Clock, RotateCcw, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function CancellationPolicyView() {
  const sections = [
    {
      icon: Receipt,
      title: "Facturación Electrónica",
      content: "Al adquirir un servicio por cualquier canal (Web, WhatsApp o Presencial), debe indicarnos si la factura electrónica se emitirá a nombre del comprador o de un tercero. Por defecto, se emitirá a nombre del titular registrado en el canal de compra."
    },
    {
      icon: CreditCard,
      title: "Pagos Protegidos",
      content: "Para pagos con tarjeta de crédito, solicitamos adjuntar su documento de identidad o pasaporte para validar la titularidad y garantizar la seguridad de su transacción."
    },
    {
      icon: ShieldCheck,
      title: "Confirmación de Reserva",
      content: "La reserva se hace efectiva con el pago mínimo del 50% del valor total. En promociones 2x1 vigentes, se requiere el pago del 100% para confirmar el cupo."
    },
    {
      icon: Clock,
      title: "Modificaciones y Tiempos",
      content: "Puede modificar su reserva libremente con anticipación de: 24h hábiles (Lunes a Viernes) o 48h (Sábados, Domingos y Festivos).",
      list: [
        "Cancelación < límite: Cargo del 30% del valor total.",
        "Cancelación 3h - 12h antes: Cargo del 40% del valor total.",
        "No asistencia (No Show): Pérdida total del valor pagado."
      ]
    },
    {
      icon: RotateCcw,
      title: "Política de Devoluciones",
      content: "Para tarifas normales, devoluciones disponibles hasta 5 días después de la compra (cargo 15% administrativo).",
      highlight: "En promociones 2x1 no hay devoluciones en dinero, pero el saldo queda vigente por 6 meses en un bono virtual."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <section className="bg-gray-900 pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 skew-x-12 transform translate-x-1/4"></div>
        <div className="max-w-5xl mx-auto relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 text-primary rounded-full text-xs font-black uppercase tracking-widest mb-6">
            <AlertTriangle size={14} /> Información Legal
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Políticas de <span className="text-primary italic">Reserva</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl font-medium leading-relaxed">
            Nuestra transparencia es la base de tu confianza. Lee atentamente nuestras normas de funcionamiento para garantizarte la mejor experiencia.
          </p>
        </div>
      </section>

      {/* Content Grid */}
      <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sections.map((section, idx) => (
            <div key={idx} className="p-8 rounded-[2.5rem] border border-gray-100 bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 group">
              <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                <section.icon size={28} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-4 tracking-tight">{section.title}</h3>
              <p className="text-gray-600 font-medium leading-relaxed mb-4">
                {section.content}
              </p>
              {section.list && (
                <ul className="space-y-2">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm font-bold text-gray-500">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {section.highlight && (
                <div className="mt-4 p-4 bg-primary/5 rounded-2xl border-l-4 border-primary italic text-sm font-bold text-primary-dark">
                  {section.highlight}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="pb-24 px-4 text-center">
        <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-[2.5rem] border border-dashed border-gray-200">
           <p className="text-gray-500 font-medium text-sm leading-relaxed">
             Al reservar en <strong className="text-gray-900">Luxury Spa</strong>, el cliente acepta tácitamente todas las condiciones aquí expresadas. Estas políticas rigen para asegurar la sostenibilidad y calidad de nuestro servicio.
           </p>
        </div>
      </section>
    </div>
  );
}

