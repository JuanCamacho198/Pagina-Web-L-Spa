import React, { useState, useEffect } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Typography } from '@components/ui/Typography';
import { Facebook, Instagram, MessageCircle, Save, CheckCircle, RefreshCw, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SocialLinksSettings {
  facebook: string;
  instagram: string;
  whatsapp: string;
}

export default function SocialLinksView() {
  const [settings, setSettings] = useState<SocialLinksSettings>({
    facebook: '',
    instagram: '',
    whatsapp: ''
  });
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración al iniciar
  useEffect(() => {
    fetch('/api/config?id=social')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.value) {
          setSettings({
            facebook: data.value.facebook || '',
            instagram: data.value.instagram || '',
            whatsapp: data.value.whatsapp || ''
          });
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleSave = async () => {
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'social',
          value: settings
        })
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving social links:', error);
    }
  };

  const handleReset = () => {
    setSettings({
      facebook: '',
      instagram: '',
      whatsapp: ''
    });
  };

  const updateSetting = (key: keyof SocialLinksSettings, value: string) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-4xl border border-gray-100 shadow-sm">
        <div>
          <Typography variant="h1" className="text-2xl font-bold text-gray-900">Redes Sociales</Typography>
          <p className="text-gray-500 mt-1">Configura los enlaces a tus redes sociales.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Limpiar
          </Button>
          <Button 
            onClick={handleSave}
            className={cn(
              "flex items-center gap-2 transition-all duration-300",
              isSaved ? "bg-green-500 hover:bg-green-600" : ""
            )}
          >
            {isSaved ? (
              <>
                <CheckCircle size={18} />
                ¡Guardado!
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Formulario */}
        <div className="space-y-6">
          <Card className="p-6 border-gray-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <LinkIcon size={24} />
              </div>
              <Typography variant="h3" className="text-lg font-bold">Enlaces de Redes Sociales</Typography>
            </div>

            <div className="space-y-4">
              {/* Facebook */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Facebook size={18} className="text-blue-600" />
                  Facebook
                </label>
                <Input 
                  placeholder="https://facebook.com/tupagina"
                  value={settings.facebook}
                  onChange={(e) => updateSetting('facebook', e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus:bg-white"
                />
              </div>

              {/* Instagram */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <Instagram size={18} className="text-pink-600" />
                  Instagram
                </label>
                <Input 
                  placeholder="https://instagram.com/tucuenta"
                  value={settings.instagram}
                  onChange={(e) => updateSetting('instagram', e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus:bg-white"
                />
              </div>

              {/* WhatsApp */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 flex items-center gap-2">
                  <MessageCircle size={18} className="text-green-600" />
                  WhatsApp
                </label>
                <Input 
                  placeholder="https://wa.me/573001234567"
                  value={settings.whatsapp}
                  onChange={(e) => updateSetting('whatsapp', e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus:bg-white"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 border-gray-100 shadow-sm">
            <Typography variant="h4" className="font-bold mb-3">Vista Previa</Typography>
            <div className="flex gap-3 justify-center py-4">
              {settings.facebook && (
                <a 
                  href={settings.facebook} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-px2 h-12 rounded-full bg-blue-600 flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                >
                  <Facebook size={20} />
                </a>
              )}
              {settings.instagram && (
                <a 
                  href={settings.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-px2 h-12 rounded-full bg-linear-to-tr from-yellow-400 via-pink-500 to-purple-600 flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                >
                  <Instagram size={20} />
                </a>
              )}
              {settings.whatsapp && (
                <a 
                  href={settings.whatsapp} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-px2 h-12 rounded-full bg-green-500 flex items-center justify-center text-white hover:bg-green-600 transition-colors"
                >
                  <MessageCircle size={20} />
                </a>
              )}
              {!settings.facebook && !settings.instagram && !settings.whatsapp && (
                <p className="text-gray-400 text-sm">Agrega enlaces para ver la preview</p>
              )}
            </div>
          </Card>
        </div>

        {/* Info */}
        <div className="space-y-6">
          <Card className="p-6 border-gray-100 shadow-sm bg-amber-50/50">
            <Typography variant="h4" className="font-bold text-amber-800 mb-3">¿Dónde se muestran?</Typography>
            <ul className="space-y-2 text-sm text-amber-700">
              <li className="flex items-start gap-2">
                <span className="w-px.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></span>
                Los enlaces aparecen en el Footer del sitio
              </li>
              <li className="flex items-start gap-2">
                <span className="w-px.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></span>
                Se muestran como iconos en la sección de contacto
              </li>
              <li className="flex items-start gap-2">
                <span className="w-px.5 h-1.5 rounded-full bg-amber-500 mt-1.5"></span>
                Solo se muestran si tienen un valor配置ado
              </li>
            </ul>
          </Card>

          <Card className="p-6 border-gray-100 shadow-sm">
            <Typography variant="h4" className="font-bold mb-3">Consejos</Typography>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Usa URLs completas (incluye https://)</li>
              <li>• Para WhatsApp, usa el formato wa.me/número</li>
              <li>• Deja el campo vacío si no tienes esa red</li>
            </ul>
          </Card>
        </div>
      </div>

      {!isSaved && (settings.facebook || settings.instagram || settings.whatsapp) && (
        <div className="px-6 py-4 bg-amber-50 rounded-4xl border border-amber-100 flex items-start gap-3">
          <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 mt-0.5">
            <LinkIcon size={16} />
          </div>
          <div className="text-xs text-amber-800 font-medium">
            Tienes cambios sin guardar. Los visitantes del sitio no los verán hasta que hagas clic en <span className="font-bold">Guardar</span>.
          </div>
        </div>
      )}
    </div>
  );
}
