import React from 'react';
import { ShieldCheck, Eye, FileText, UserCheck, Mail, Clock, Check } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function DataPrivacyPolicyView() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-[3rem] p-10 md:p-16 shadow-xl shadow-gray-200/50 border border-gray-100 mb-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
          <div className="relative z-10">
            <div className="w-16 h-16 bg-primary/10 rounded-4xl flex items-center justify-center text-primary mb-8">
              <ShieldCheck size={32} />
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-6 tracking-tight">
              Política de <span className="text-primary italic">Privacidad</span>
            </h1>
            <p className="text-lg text-gray-600 font-medium leading-relaxed">
              En <strong className="text-gray-900">Grupo L-Spa (NIT 900.983.715-1)</strong>, la protección de tus datos es nuestra prioridad. Cumplimos estrictamente con la normativa colombiana de tratamiento de información personal.
            </p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="space-y-8">
          {/* Section 1 */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <Eye className="text-primary" /> 1. Finalidad del Tratamiento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Cumplimiento del objeto contractual.",
                "Invitaciones a eventos y lanzamientos.",
                "Gestión de trámites y reclamaciones.",
                "Encuestas de satisfacción y mejora.",
                "Contactabilidad comercial y fidelización.",
                "Envío de facturación electrónica."
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-4xl border border-gray-100 italic font-bold text-gray-600 text-sm">
                   <div className="w-2 h-2 rounded-full bg-primary shrink-0"></div>
                   {item}
                </div>
              ))}
            </div>
          </div>

          {/* Section 2 */}
          <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-gray-100">
            <h2 className="text-2xl font-black text-gray-900 mb-6 flex items-center gap-3">
              <UserCheck className="text-primary" /> 2. Tus Derechos como Titular
            </h2>
            <ul className="space-y-4">
              {[
                { t: "Gratuidad", d: "Acceso gratuito a tus datos tratados." },
                { t: "Actualización", d: "Conocer, actualizar y rectificar información parcial o inexacta." },
                { t: "Autorización", d: "Solicitar prueba de la autorización otorgada." },
                { t: "Supresión", d: "Solicitar la eliminación de datos cuando no exista deber legal de conservarlos." }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0 mt-1">
                    <Check size={14} className="stroke-[4px]" />
                  </div>
                  <div>
                    <h4 className="font-black text-gray-900 uppercase text-xs tracking-widest">{item.t}</h4>
                    <p className="text-gray-600 font-medium">{item.d}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Area */}
          <div className="bg-primary rounded-[2.5rem] p-10 md:p-12 text-white shadow-2xl shadow-primary/20">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="w-20 h-20 bg-white/20 rounded-4xl flex items-center justify-center shrink-0">
                <Mail size={40} />
              </div>
              <div>
                <h3 className="text-2xl font-black mb-2 tracking-tight text-white">¿Dudas sobre tus datos?</h3>
                <p className="text-primary-light font-medium mb-4">Escríbenos a nuestro canal oficial de atención al titular:</p>
                <a href="mailto:l-spa@hotmail.com" className="text-xl font-black underline decoration-white/30 hover:decoration-white transition-all">
                  l-spa@hotmail.com
                </a>
              </div>
            </div>
          </div>

          {/* Validity */}
          <div className="text-center pt-8">
            <p className="text-gray-400 text-sm font-bold flex items-center justify-center gap-2">
              <Clock size={16} /> Vigente desde el 01 de enero de 2022
            </p>
          </div>
        </div>
      </div>
      </div>
      <Footer />
    </>
  );
}


