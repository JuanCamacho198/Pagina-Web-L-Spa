import React, { useState, useEffect } from 'react';
import { useNavbarStore } from '@context/NavbarStore';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Typography } from '@components/ui/Typography';
import { Image, Type, Eye, RefreshCw, Save, CheckCircle, Info, Layout } from 'lucide-react';
import logoLocal from '@assets/logos/LOGO.svg';
import { cn } from '@/lib/utils';
import NavBar from '@/components/layout/NavBar';
import Footer from '@/components/layout/Footer';

export default function NavbarSettingsView() {
  const store = useNavbarStore();
  const { reset } = store;

  // Estado local para la previsualización (no se guarda hasta pulsar "Guardar")
  const [localSettings, setLocalSettings] = useState({
    logoUrl: store.logoUrl,
    brandText: store.brandText,
    showLogo: store.showLogo,
    showText: store.showText,
    logoSize: store.logoSize,
    textSize: store.textSize,
    logoTextSpacing: store.logoTextSpacing,
    fontFamily: store.fontFamily,
    customFontUrl: store.customFontUrl,
  });

  // Estado para el Footer
  const [footerSettings, setFooterSettings] = useState({
    logoUrl: '',
    description: '',
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isLoadingFooter, setIsLoadingFooter] = useState(true);

  // Cargar configuración del footer al iniciar
  useEffect(() => {
    fetch('/api/config?id=footer')
      .then(res => res.json())
      .then(data => {
        if (data && data.value) {
          setFooterSettings({
            logoUrl: data.value.logoUrl || '',
            description: data.value.description || '',
          });
        }
        setIsLoadingFooter(false);
      })
      .catch(() => setIsLoadingFooter(false));
  }, []);

  const handleSave = async () => {
    // Guardar Navbar Store
    store.setLogoUrl(localSettings.logoUrl);
    store.setBrandText(localSettings.brandText);
    store.setShowLogo(localSettings.showLogo);
    store.setShowText(localSettings.showText);
    store.setLogoSize(localSettings.logoSize);
    store.setTextSize(localSettings.textSize);
    store.setLogoTextSpacing(localSettings.logoTextSpacing);
    store.setFontFamily(localSettings.fontFamily);
    store.setCustomFontUrl(localSettings.customFontUrl);
    
    // Guardar Footer Config en API
    try {
      await fetch('/api/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: 'footer',
          value: footerSettings
        })
      });
    } catch (error) {
      console.error('Error saving footer config:', error);
    }
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    reset();
    const defaults = {
      logoUrl: '',
      brandText: 'L-SPA',
      showLogo: true,
      showText: true,
      logoSize: 40,
      textSize: 24,
      logoTextSpacing: 12,
      fontFamily: 'sans',
      customFontUrl: '',
    };
    setLocalSettings(defaults);
  };

  const updateLocal = (key: string, value: any) => {
    setLocalSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        updateLocal('customFontUrl', url);
        updateLocal('fontFamily', 'custom');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center bg-white/50 backdrop-blur-md p-6 rounded-3xl border border-gray-100 sticky top-0 z-30 shadow-sm">
        <div>
          <Typography variant="h1" className="text-3xl font-black text-gray-900">Configuración del Navbar</Typography>
          <p className="text-gray-500 mt-1">Personaliza el logo y el nombre de tu marca en la barra de navegación.</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={handleReset}
            className="flex items-center gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
          >
            <RefreshCw size={18} />
            Restaurar por defecto
          </Button>
          <Button 
            onClick={handleSave}
            className={cn(
              "flex items-center gap-2 transition-all duration-500 min-w-40",
              isSaved ? "bg-green-500 hover:bg-green-600 ring-4 ring-green-100" : "bg-primary hover:bg-primary-dark"
            )}
          >
            {isSaved ? (
              <>
                <CheckCircle size={18} />
                ¡Cambios Guardados!
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar Cambios
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Controles */}
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
                <label className="text-sm font-bold text-gray-700 mb-1.5 flex justify-between items-center">
                  <span>URL del Logo (Opcional)</span>
                  <span className="text-[10px] font-medium bg-gray-100 px-2 py-0.5 rounded text-gray-500 uppercase">External URL</span>
                </label>
                <Input 
                  placeholder="https://ejemplo.com/logo.png"
                  value={localSettings.logoUrl}
                  onChange={(e) => updateLocal('logoUrl', e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5 text-xs">Altura Logo (px)</label>
                  <Input 
                    type="number"
                    value={localSettings.logoSize}
                    onChange={(e) => updateLocal('logoSize', Number(e.target.value))}
                    min="10"
                    max="100"
                    className="bg-gray-50/50 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5 text-xs">Tamaño Texto (px)</label>
                  <Input 
                    type="number"
                    value={localSettings.textSize}
                    onChange={(e) => updateLocal('textSize', Number(e.target.value))}
                    min="10"
                    max="60"
                    className="bg-gray-50/50 border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-1.5 flex justify-between items-center">
                  <span>Espacio Logo - Texto (px)</span>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-full">{localSettings.logoTextSpacing}px</span>
                </label>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.logoTextSpacing}
                  onChange={(e) => updateLocal('logoTextSpacing', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Fuente del Texto</label>
                <div className="flex flex-col gap-3">
                  <select 
                    value={localSettings.fontFamily}
                    onChange={(e) => updateLocal('fontFamily', e.target.value as any)}
                    className="w-full h-10 px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm"
                  >
                    <option value="sans">Sans Serif (Moderna)</option>
                    <option value="serif">Serif (Elegante/Clásica)</option>
                    <option value="mono">Monospace (Técnica)</option>
                    <option value="custom">Personalizada (Subida)</option>
                  </select>
                  
                  <div className="p-4 bg-primary/5 rounded-2xl border border-primary/10">
                    <label className="block text-xs font-black text-primary uppercase tracking-widest mb-2">Subir fuente propia (.ttf, .otf, .woff)</label>
                    <input 
                      type="file" 
                      accept=".ttf,.otf,.woff,.woff2"
                      onChange={handleFontUpload}
                      className="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                    />
                    {localSettings.customFontUrl && (
                      <p className="text-[10px] text-green-600 mt-2 font-bold flex items-center gap-1">
                        <Save size={10} /> Fuente subida correctamente
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Nombre de la Marca</label>
                <div className="flex gap-2">
                   <Input 
                    placeholder="Ej. L-SPA"
                    value={localSettings.brandText}
                    onChange={(e) => updateLocal('brandText', e.target.value)}
                    className="bg-gray-50/50 border-gray-200 focus:bg-white font-serif"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6 border-gray-100 shadow-sm">
             <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary-dark">
                <Eye size={24} />
              </div>
              <Typography variant="h3" className="text-lg font-bold">Visibilidad</Typography>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group">
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    <Image size={20} />
                  </span>
                  <span className="font-semibold text-gray-700">Mostrar Logo</span>
                </span>
                <input 
                  type="checkbox" 
                  checked={localSettings.showLogo} 
                  onChange={(e) => updateLocal('showLogo', e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 rounded-xl border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors group">
                <span className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                    <Type size={20} />
                  </span>
                  <span className="font-semibold text-gray-700">Mostrar Texto</span>
                </span>
                <input 
                  type="checkbox" 
                  checked={localSettings.showText} 
                  onChange={(e) => updateLocal('showText', e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </label>
            </div>
          </Card>

          <Card className="p-6 border-gray-100 shadow-sm animate-in fade-in slide-in-from-left-2 delay-150">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <Layout size={24} />
              </div>
              <Typography variant="h3" className="text-lg font-bold">Configuración del Footer</Typography>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-bold text-gray-700 mb-1.5 block">Logo del Footer (URL)</label>
                <Input 
                  placeholder="https://ejemplo.com/footer-logo.png"
                  value={footerSettings.logoUrl}
                  onChange={(e) => setFooterSettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="bg-gray-50/50 border-gray-200"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-gray-700 mb-1.5 block">Descripción de la Marca (Footer)</label>
                <textarea 
                  placeholder="Ej. Los mejores servicios de SPA y cuidado personal en un solo lugar."
                  value={footerSettings.description}
                  onChange={(e) => setFooterSettings(prev => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  className="w-full h-24 px-3 py-2 bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-primary/20 transition-all font-medium text-sm resize-none"
                />
              </div>
              
              <div className="p-3 bg-blue-50/50 rounded-xl border border-blue-100 flex items-start gap-3">
                 <div className="p-1 bg-blue-100 rounded text-blue-600">
                    <Info size={14} />
                 </div>
                 <p className="text-[11px] text-blue-800 font-medium leading-tight">
                    El footer se actualiza globalmente en todas las páginas del sitio.
                 </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Vista Previa */}
        <div className="lg:sticky lg:top-36 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/20 shadow-xl shadow-primary/5">
            <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
               <Typography variant="h3" className="text-sm font-black text-primary uppercase tracking-widest">
                 Vista Previa (Sin Guardar)
               </Typography>
               <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
               </span>
            </div>
            
            <div className="bg-white/40 backdrop-blur-md border-b border-gray-100 min-h-40 overflow-hidden">
               {/* Usamos el NavBar real pero con los settings locales inyectados */}
               <div className="pointer-events-none transform scale-90 md:scale-100 origin-center">
                  <NavBar user={null} previewSettings={localSettings} />
               </div>
            </div>

            <div className="bg-white/40 backdrop-blur-md border-t border-gray-100 overflow-hidden">
               <div className="pointer-events-none transform scale-75 origin-top">
                  <Footer previewSettings={footerSettings} />
               </div>
            </div>

            <div className="p-8 bg-gray-50/50 flex flex-col items-center text-center">
               <div className="w-16 h-1 bg-gray-200 rounded-full mb-6"></div>
               <Typography variant="h4" className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Diseño del Encabezado</Typography>
               <p className="text-[10px] text-gray-400 max-w-50 leading-relaxed italic">
                 "Así es como se verá el encabezado principal de tu sitio web en todas las páginas."
               </p>
            </div>
          </Card>

          {!isSaved && (
             <div className="px-6 py-4 bg-amber-50 rounded-2xl border border-amber-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                <div className="p-1.5 bg-amber-100 rounded-lg text-amber-600 mt-0.5">
                   <Info size={16} />
                </div>
                <div className="text-xs text-amber-800 font-medium leading-relaxed">
                   Tienes cambios sin guardar. Los visitantes del sitio no los verán hasta que hagas clic en <span className="font-bold underline">Guardar Cambios</span>.
                </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}