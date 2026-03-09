import { Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import Footer from '@/components/layout/Footer';

export default function ContactView() {
  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Header */}
      <section className="bg-primary pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            Estamos para <span className="text-white/80 italic">Escucharte</span>
          </h1>
          <p className="text-xl text-white/90 max-w-2xl mx-auto font-medium">
            ¿Tienes dudas o quieres agendar una experiencia personalizada? Nuestro equipo de expertos está listo para asesorarte.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-12 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:bg-primary transition-colors duration-500">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-6 group-hover:bg-white/20 group-hover:text-white transition-all">
                <Mail size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-white">Correo Electrónico</h3>
              <a href="mailto:info@l-spa.com" className="text-primary font-bold group-hover:text-white/90">
                info@l-spa.com
              </a>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center group hover:bg-green-500 transition-colors duration-500">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-green-500 mb-6 group-hover:bg-white/20 group-hover:text-white transition-all">
                <MessageCircle size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2 group-hover:text-white">WhatsApp</h3>
              <a 
                href="https://wa.me/573000000000" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-green-600 font-bold group-hover:text-white/90"
              >
                +57 300 000 0000
              </a>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-100 flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600 mb-6">
                <MapPin size={32} />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-2">Ubicación</h3>
              <p className="text-gray-500 font-medium">Cra. 36 #8a-40, El Poblado<br/>Medellín, Antioquia</p>
            </div>
          </div>

          {/* Interactive Map & Form */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white p-4 rounded-[3rem] shadow-2xl shadow-gray-200/60 border border-white overflow-hidden h-125 relative">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d891.3024654937047!2d-75.56598343906558!3d6.208142145211063!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e442829c522fdb3%3A0x5abdd43099235c76!2sCra.%2036%20%238a-40%2C%20El%20Poblado%2C%20Medell%C3%ADn%2C%20El%20Poblado%2C%20Medell%C3%ADn%2C%20Antioquia!5e0!3m2!1ses-419!2sco!4v1727018084186!5m2!1ses-419!2sco"
                className="w-full h-full rounded-[2.5rem] grayscale hover:grayscale-0 transition-all duration-700"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                title="L-Spa Location"
              ></iframe>
            </div>

            <div className="bg-white dark:bg-gray-800 p-10 md:p-12 rounded-[3rem] shadow-xl border border-gray-100 dark:border-gray-700">
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                  <Send className="text-primary dark:text-primary-light" /> Enviar Mensaje
                </h2>
                <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">Nombre Completo</label>
                    <input type="text" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-medium text-gray-900 dark:text-white" placeholder="Ej. Juan Pérez" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">Email</label>
                    <input type="email" className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-medium text-gray-900 dark:text-white" placeholder="juan@ejemplo.com" />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-sm font-black text-gray-700 dark:text-gray-300 uppercase tracking-wider">Mensaje</label>
                    <textarea rows={4} className="w-full px-6 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary transition-all font-medium text-gray-900 dark:text-white resize-none" placeholder="¿En qué podemos ayudarte?"></textarea>
                  </div>
                  <button className="md:col-span-2 py-5 bg-primary text-white font-black rounded-2xl hover:bg-primary-dark transition-all transform hover:-translate-y-1 shadow-lg shadow-primary/20">
                    Enviar Información
                  </button>
                </form>
            </div>
          </div>
        </div>
      </section>
      </div>
      <Footer />
    </>
  );
}


