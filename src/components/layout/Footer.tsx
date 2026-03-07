import React from 'react';
import logo from '@assets/logos/LOGO4x-sinfondo.png';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, Mail, Phone, MapPin, Clock } from 'lucide-react';

const Footer: React.FC = () => {
  const sectionTitleClass = "text-lg font-bold mb-4 text-primary-light";
  const linkClass = "text-gray-400 hover:text-white transition-colors duration-200 text-sm";
  const iconLinkClass = "bg-gray-800 p-2 rounded-full hover:bg-primary transition-all duration-300 transform hover:scale-110";

  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <img src={logo} alt="L-SPA logo" className="h-12 w-auto brightness-110" />
              <h4 className="text-xl font-bold tracking-tight uppercase">L-SPA</h4>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Tu refugio de bienestar y relajación. Expertos en masajes, tratamientos faciales y cuidado personal.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className={iconLinkClass} aria-label="Facebook"><Facebook size={20} /></a>
              <a href="#" className={iconLinkClass} aria-label="Instagram"><Instagram size={20} /></a>
              <a href="#" className={iconLinkClass} aria-label="WhatsApp"><MessageCircle size={20} /></a>
            </div>
          </div>

          {/* Contact Section */}
          <div>
            <h4 className={sectionTitleClass}>Contacto</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin size={18} className="text-primary shrink-0" />
                <span>Calle 87c#23-52</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone size={18} className="text-primary shrink-0" />
                <span>(123) 456-7890</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail size={18} className="text-primary shrink-0" />
                <a href="mailto:contacto@l-spa.com" className="hover:text-white">contacto@l-spa.com</a>
              </li>
            </ul>
          </div>

          {/* Hours Section */}
          <div>
            <h4 className={sectionTitleClass}>Horario de Atención</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Clock size={16} className="text-primary" />
                <div className="flex flex-col">
                  <span>Lunes a Viernes</span>
                  <span className="text-white font-medium">9:00 AM - 7:00 PM</span>
                </div>
              </li>
              <li className="flex flex-col gap-1 text-sm text-gray-400 pl-7">
                <span>Sábado</span>
                <span className="text-white font-medium">9:00 AM - 4:00 PM</span>
              </li>
              <li className="flex flex-col gap-1 text-sm text-gray-400 pl-7">
                <span>Domingo</span>
                <span className="text-red-400 font-medium">Cerrado</span>
              </li>
            </ul>
          </div>

          {/* Navigation Section */}
          <div>
            <h4 className={sectionTitleClass}>Información</h4>
            <ul className="space-y-2">
              <li><Link to="/politicas-cancelacion" className={linkClass}>Políticas de Cancelación</Link></li>
              <li><Link to="/politica-datos" className={linkClass}>Tratamiento de Datos</Link></li>
              <li><Link to="/informacion-reserva" className={linkClass}>Información de Reserva</Link></li>
              <li><Link to="/preguntas-frecuentes" className={linkClass}>Preguntas Frecuentes</Link></li>
              <li className="pt-2"><Link to="/privacidad" className={linkClass}>Privacidad</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 mt-8 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-xs">
            © {new Date().getFullYear()} L-Spa. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
