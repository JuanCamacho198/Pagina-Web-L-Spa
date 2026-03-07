import React from 'react';
import { useNavbarStore } from '@context/NavbarStore';
import { Card } from '@components/ui/Card';
import { Button } from '@components/ui/Button';
import { Input } from '@components/ui/Input';
import { Typography } from '@components/ui/Typography';
import { Image, Type, Eye, RefreshCw, Save } from 'lucide-react';
import logoLocal from '@assets/logos/LOGO.svg';
import { cn } from '@/lib/utils';

export default function NavbarSettingsView() {
  const { 
    logoUrl, 
    brandText, 
    showLogo, 
    showText,
    logoSize,
    textSize,
    fontFamily,
    customFontUrl,
    setLogoUrl,
    setBrandText,
    setShowLogo,
    setShowText,
    setLogoSize,
    setTextSize,
    setFontFamily,
    setCustomFontUrl,
    reset
  } = useNavbarStore();

  const handleFontUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        setCustomFontUrl(url);
        setFontFamily('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <Typography variant="h1" className="text-3xl font-black text-gray-900">Configuración del Navbar</Typography>
          <p className="text-gray-500 mt-1">Personaliza el logo y el nombre de tu marca en la barra de navegación.</p>
        </div>
        <Button 
          variant="outline" 
          onClick={reset}
          className="flex items-center gap-2 border-red-100 text-red-600 hover:bg-red-50 hover:border-red-200"
        >
          <RefreshCw size={18} />
          Restaurar por defecto
        </Button>
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
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="bg-gray-50/50 border-gray-200 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5 text-xs">Altura Logo (px)</label>
                  <Input 
                    type="number"
                    value={logoSize}
                    onChange={(e) => setLogoSize(Number(e.target.value))}
                    min="10"
                    max="100"
                    className="bg-gray-50/50 border-gray-200"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1.5 text-xs">Tamaño Texto (px)</label>
                  <Input 
                    type="number"
                    value={textSize}
                    onChange={(e) => setTextSize(Number(e.target.value))}
                    min="10"
                    max="60"
                    className="bg-gray-50/50 border-gray-200"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1.5">Fuente del Texto</label>
                <div className="flex flex-col gap-3">
                  <select 
                    value={fontFamily}
                    onChange={(e) => setFontFamily(e.target.value as any)}
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
                    {customFontUrl && (
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
                    value={brandText}
                    onChange={(e) => setBrandText(e.target.value)}
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
                  checked={showLogo} 
                  onChange={(e) => setShowLogo(e.target.checked)}
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
                  checked={showText} 
                  onChange={(e) => setShowText(e.target.checked)}
                  className="w-5 h-5 accent-primary cursor-pointer"
                />
              </label>
            </div>
          </Card>
        </div>

        {/* Vista Previa */}
        <div className="lg:sticky lg:top-24 space-y-6">
          <Card className="overflow-hidden border-2 border-primary/20 shadow-xl shadow-primary/5">
            <div className="bg-primary/5 px-6 py-4 border-b border-primary/10 flex justify-between items-center">
               <Typography variant="h3" className="text-sm font-black text-primary uppercase tracking-widest">
                 Previsualización en tiempo real
               </Typography>
               <span className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-yellow-400"></span>
                  <span className="w-2.5 h-2.5 rounded-full bg-green-400"></span>
               </span>
            </div>
            
            <div className="bg-white/40 backdrop-blur-md p-12 flex items-center justify-center min-h-50 border-b border-gray-100">
               <div className="flex items-center group cursor-default">
                  {showLogo && (
                    <div className="flex items-center justify-center mr-3 scale-150 transform transition-transform group-hover:scale-160">
                      <img 
                        src={logoUrl || logoLocal} 
                        alt="Preview Logo" 
                        style={{ height: `${logoSize}px` }}
                        className="w-auto" 
                      />
                    </div>
                  )}
                  {showText && (
                    <span 
                      style={{ 
                        fontSize: `${textSize}px`,
                        fontFamily: fontFamily === 'custom' ? 'CustomNavbarFont' : fontFamily === 'serif' ? 'serif' : fontFamily === 'mono' ? 'monospace' : 'inherit'
                      }}
                      className={cn(
                        "font-black bg-linear-to-r from-primary to-primary-dark bg-clip-text text-transparent tracking-tighter uppercase ml-2",
                        fontFamily === 'serif' && "font-serif"
                      )}
                    >
                       {brandText}
                    </span>
                  )}
               </div>
            </div>

            <div className="p-6 bg-gray-50 border-t border-gray-100">
               <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                     <div className="h-2 w-2/3 bg-gray-200 rounded-full"></div>
                     <div className="h-2 w-full bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
               </div>
            </div>
          </Card>

          <Card className="p-6 bg-primary text-white overflow-hidden relative group">
             <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:rotate-12 transition-transform">
                <Save size={120} />
             </div>
             <p className="text-sm font-medium opacity-90 mb-2 uppercase tracking-widest">Estado del Guardado</p>
             <h4 className="text-2xl font-black mb-4 tracking-tight">Cambios Instantáneos</h4>
             <p className="text-sm text-primary-light leading-relaxed">
               Tus ajustes se guardan automáticamente en el navegador y se aplican a todo el sitio web de inmediato.
             </p>
          </Card>
        </div>
      </div>
    </div>
  );
}