import React from 'react';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';
import Footer from '@/components/layout/Footer';

const CookiePolicyView: React.FC = () => {
  return (
    <>
      <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <Typography variant="h1" className="mb-8">Política de Cookies</Typography>
        <Card className="p-8 space-y-6">
          <section>
            <Typography variant="h4" className="mb-3 text-primary">¿Qué son las cookies?</Typography>
            <Typography className="text-gray-600">
              Las cookies son pequeños archivos de texto que se almacenan en su dispositivo cuando visita nuestro sitio web. Ayudan a que el sitio funcione correctamente y nos permiten mejorar su experiencia de navegación.
            </Typography>
          </section>
          <section>
            <Typography variant="h4" className="mb-3 text-primary">¿Cómo las usamos?</Typography>
            <Typography className="text-gray-600">
              En L-Spa utilizamos cookies técnicas para mantener su sesión iniciada, cookies de personalización para recordar sus preferencias y cookies de análisis para entender cómo interactúa con nuestro sitio.
            </Typography>
          </section>
          <section>
            <Typography variant="h4" className="mb-3 text-primary">Gestión de cookies</Typography>
            <Typography className="text-gray-600">
              Usted puede permitir, bloquear o eliminar las cookies instaladas en su equipo mediante la configuración de las opciones del navegador instalado en su computadora.
            </Typography>
          </section>
        </Card>
      </div>
    </div>
    <Footer />
    </>
  );
};


export default CookiePolicyView;
