import React, { useState, useEffect } from 'react';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Typography } from '@components/ui/Typography';
import { Image, Save, CheckCircle, RefreshCw, Layout } from 'lucide-react';
import { cn } from '@/lib/utils';
import Footer from '@/components/layout/Footer';

interface FooterSettings {
  logoUrl: string;
  description: string;
  logoSize: number;
}

export default function FooterSettingsView() {
  const [settings, setSettings] = useState<FooterSettings>({
    logoUrl: '',
    description: '',
    logoSize: 48
  });
  
  const [isSaved, setIsSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar configuración al iniciar
  useEffect(() => {
    fetch('/api/config?id=footer')
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data && data.value) {
          setSettings({
            logoUrl: data.value.logoUrl || '',
            description: data.value.description || '',
            logoSize: data.value.logoSize || 48
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
          id: 'footer',
          value: settings
        })
      });
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error('Error saving footer:', error);
    }
  };

  const handleReset = () => {
    setSettings({
      logoUrl: '',
      description: '',
      logoSize: 48
    });
  };

  const updateSetting = (key: keyof FooterSettings, value: string | number) => {
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
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white/50 backdrop-blur-md p-6 rounded-4xl border border-gray-100 shadow-sm">
        <div>
          <Typography variant="h1" className="text-2xl font-bold text-gray-900">Configuración del Footer</Typography>
          <p className="text-gray-500 mt-1">Personaliza la sección inferior de tu sitio web.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2"
          >
            <RefreshCw size={18} />
            Restaurar
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
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Image size={24} />
              </div>
              <Typography variant="h3" className="text-lg font-bold">Identidad Visual</Typography>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col">
                <label className="text-sm font-bold text-gray-700 mb-1.5">
                  URL del Logo
                </label>
                <Input 
                  placeholder="https://ejemplo.com/footer-logo.png"
                  value={settings.logoUrl}
                  onChange={(e) => updateSetting('logoUrl', e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus:bg-white"
                />
                <span className="text-xs text-gray-400 mt-1">Deja vacío para usar el logo por defecto</span>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1.5 text-xs">Altura Logo (px)</label>
                <Input 
                  type="number"
                  value={settings.logoSize}
                  onChange={(e) => updateSetting('logoSize', Number(e.target.value))}
                  min="20"
                  max="200"
                  className="bg-gray-50/50 border-gray-200"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Descripción</label>
                <textarea 
                  placeholder="Tu descripción breve..."
                  value={settings.description}
                  onChange={(e) => updateSetting('description', e.target.value)}
                  rows={4}
                  className="w-full px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-4xll focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all text-sm resize-none"
                />
                <span className="text-xs text-gray-400 mt-1">Aparece debajo del logo en el footer</span>
              </div>
            </div>
          </Card>

          {/* Info */}
          <Card className="p-6 border-gray-100 shadow-sm bg-blue-50/50">
            <Typography variant="h4" className="font-bold text-blue-800 mb-3">Nota</Typography>
            <p className="text-sm text-blue-700">
              Las redes sociales se configuran en la página de <span className="font-semibold">Enlaces Sociales</span>.
            </p>
          </Card>
        </div>

        {/* Vista Previa */}
        <div className="lg:sticky lg:top-6">
          <Card className="overflow-hidden border-2 border-gray-200 shadow-xl">
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 flex justify-between items-center">
              <Typography variant="h3" className="text-xs font-black text-gray-300 uppercase tracking-widest">
                Vista Previa Footer
              </Typography>
              <div className="flex gap-1.5">
                <span className="w-2 h-13 rounded-full bg-red-400"></span>
                <span className="w-2 h-13 rounded-full bg-yellow-400"></span>
                <span className="w-2 h-13 rounded-full bg-green-400"></span>
              </div>
            </div>
            
            <div className="p-4 bg-gray-900">
              <div className="pointer-events-none transform scale-90 origin-center">
                <Footer previewSettings={settings} />
              </div>
            </div>

            <div className="p-4 bg-gray-50 text-center">
              <p className="text-xs text-gray-400">Vista previa en tamaño real</p>
            </div>
          </Card>

          {!isSaved && (settings.logoUrl || settings.description) && (
            <div className="mt-4 px-4 py-3 bg-amber-50 rounded-4xl border border-amber-100 flex items-start gap-3">
              <div className="p-1 bg-amber-100 rounded-lg text-amber-600 mt-0.5">
                <Layout size={14} />
              </div>
              <div className="text-xs text-amber-800 font-medium">
                Tienes cambios sin guardar.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
