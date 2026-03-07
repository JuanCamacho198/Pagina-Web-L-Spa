import React from 'react';
import { Typography } from '@/components/ui/Typography';
import { Card } from '@/components/ui/Card';

const PrivacyPolicyView: React.FC = () => {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4">
        <Typography variant="h1" className="mb-8">Políticas de Privacidad</Typography>
        <Card className="p-8 space-y-6">
          <section>
            <Typography variant="h4" className="mb-3 text-primary">Introducción</Typography>
            <Typography className="text-gray-600">
              En L-Spa, nos tomamos muy en serio la privacidad de sus datos personales. Esta política explica cómo recopilamos, usamos y protegemos su información.
            </Typography>
          </section>
          <section>
            <Typography variant="h4" className="mb-3 text-primary">Datos que recopilamos</Typography>
            <Typography className="text-gray-600">
              Recopilamos información básica como su nombre, correo electrónico y número de teléfono únicamente cuando usted se registra en nuestra plataforma o realiza una reserva.
            </Typography>
          </section>
          <section>
            <Typography variant="h4" className="mb-3 text-primary">Seguridad</Typography>
            <Typography className="text-gray-600">
              Implementamos medidas de seguridad técnicas y administrativas para garantizar la confidencialidad de sus datos. No compartimos su información personal con terceros sin su consentimiento.
            </Typography>
          </section>
        </Card>
      </div>
    </div>
  );
};

export default PrivacyPolicyView;
