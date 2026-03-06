import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth0 } from '@auth0/auth0-react';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  LogOut, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Clock,
  Sparkles as SparkleIcon,
  User as UserIcon,
  Settings,
  ShoppingBag,
  Edit3
} from 'lucide-react';
import { fetchUserProfile, saveProfileChanges } from '../../controllers/userController';
import { UserProfile } from '../../types';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Typography } from '../../components/ui/Typography';
import { Badge } from '../../components/ui/Badge';

const profileSchema = z.object({
  firstName: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo no válido'),
  phone: z.string().min(7, 'Mínimo 7 dígitos').regex(/^[0-9+ ]+$/, 'Solo números'),
  birthDate: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileView() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'citas' | 'configuracion'>('personal');
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadProfile = async () => {
    if (!user?.sub) return;
    try {
      const data = await fetchUserProfile(user.sub);
      if (data) {
        setProfile(data as UserProfile);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadProfile();
    }
  }, [user, isAuthenticated, authLoading]);

  useEffect(() => {
    if (profile) {
      reset({
        firstName: profile.firstName || '',
        lastName: profile.lastName || '',
        email: profile.email || '',
        phone: profile.phone || '',
        birthDate: profile.birthDate || '',
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    if (!user?.sub) return;
    setIsSaving(true);
    try {
      await saveProfileChanges(user.sub, data);
      await loadProfile();
      showNotification('Perfil actualizado correctamente');
    } catch (err: any) {
      showNotification(err.message || 'Error al actualizar el perfil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full p-8 text-center bg-white shadow-xl rounded-3xl">
          <Typography variant="h2" className="mb-4">Tu Sesión ha expirado</Typography>
          <Typography className="mb-8 text-gray-500">Por favor, inicia sesión para ver tu perfil.</Typography>
          <Button onClick={() => navigate('/login')} className="w-full py-6">Iniciar Sesión</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header Profile Section */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 rounded-3xl bg-linear-to-r from-primary/10 to-primary/20 flex items-center justify-center text-primary overflow-hidden shadow-inner transform group-hover:scale-105 transition-all duration-300">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  <UserIcon size={64} className="opacity-40" />
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 bg-white p-2 rounded-xl shadow-lg text-primary border border-gray-50 transform hover:scale-110 transition-transform cursor-pointer">
                <Edit3 size={18} />
              </div>
            </div>
            
            <div className="text-center md:text-left grow">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-2">
                <Typography variant="h1" className="text-3xl font-bold text-gray-900 border-none m-0">
                  {profile?.firstName ? `${profile.firstName} ${profile.lastName}` : user?.name}
                </Typography>
                <Badge variant="default" className="bg-primary/10 text-primary border-none px-4 py-1 flex items-center gap-1.5 rounded-full capitalize">
                  <ShieldCheck size={14} />
                  {profile?.role || 'Cliente'}
                </Badge>
              </div>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-gray-500">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-primary/60" />
                  <Typography variant="small" className="font-normal text-gray-500">{user?.email}</Typography>
                </div>
                {profile?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-primary/60" />
                    <Typography variant="small" className="font-normal text-gray-500">{profile.phone}</Typography>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="rounded-2xl border-gray-200" onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
                <LogOut size={18} className="mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Tabs */}
          <div className="lg:col-span-3 space-y-2">
            {[
              { id: 'personal', label: 'Datos Personales', icon: <UserIcon size={20} /> },
              { id: 'citas', label: 'Mis Citas', icon: <Clock size={20} /> },
              { id: 'configuracion', label: 'Configuración', icon: <Settings size={20} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all duration-300 ${
                  activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 font-bold translate-x-1' 
                  : 'text-gray-500 hover:bg-white hover:text-primary border border-transparent'
                }`}
              >
                {tab.icon}
                {tab.label}
                {activeTab === tab.id && <ChevronRight className="ml-auto" size={16} />}
              </button>
            ))}
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9">
            {notification && (
              <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 animate-in fade-in slide-in-from-top-4 ${
                notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'
              }`}>
                {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
                <span className="font-medium">{notification.message}</span>
              </div>
            )}

            {activeTab === 'personal' && (
              <Card className="bg-white p-8 rounded-3xl border-none shadow-xl shadow-gray-200/50">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <Typography variant="h3">Información Personal</Typography>
                    <Typography className="text-gray-500 mt-1">Mantén tus datos actualizados para una mejor experiencia.</Typography>
                  </div>
                  <div className="p-3 bg-primary/5 rounded-2xl text-primary">
                    <Edit3 size={24} />
                  </div>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Typography variant="small" className="text-gray-700 ml-1">Nombre</Typography>
                      <Input 
                        {...register('firstName')} 
                        placeholder="Tu nombre" 
                        error={errors.firstName?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Typography variant="small" className="text-gray-700 ml-1">Apellido</Typography>
                      <Input 
                        {...register('lastName')} 
                        placeholder="Tu apellido" 
                        error={errors.lastName?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Typography variant="small" className="text-gray-700 ml-1">Correo Electrónico</Typography>
                    <Input 
                      {...register('email')} 
                      readOnly 
                      className="bg-gray-50/50 cursor-not-allowed border-gray-100 text-gray-400"
                    />
                    <Typography variant="small" className="text-gray-400 text-xs ml-1 flex items-center gap-1">
                      <AlertCircle size={10} /> El email no puede ser modificado.
                    </Typography>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Typography variant="small" className="text-gray-700 ml-1">Teléfono Móvil</Typography>
                      <Input 
                        {...register('phone')} 
                        placeholder="+57 321..." 
                        error={errors.phone?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Typography variant="small" className="text-gray-700 ml-1">Fecha de Nacimiento</Typography>
                      <Input 
                        type="date" 
                        {...register('birthDate')} 
                        error={errors.birthDate?.message}
                      />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-gray-50 flex justify-end">
                    <Button 
                      type="submit" 
                      disabled={isSaving}
                      className="px-10 py-6 rounded-2xl shadow-xl shadow-primary/20 min-w-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="mr-2 animate-spin" size={18} />
                          Guardando...
                        </>
                      ) : (
                        'Guardar Cambios'
                      )}
                    </Button>
                  </div>
                </form>
              </Card>
            )}

            {activeTab === 'citas' && (
              <div className="space-y-6">
                <Card className="p-8 text-center bg-white shadow-xl rounded-3xl border-none">
                  <div className="w-20 h-20 bg-primary/5 rounded-full flex items-center justify-center text-primary mx-auto mb-6">
                    <ShoppingBag size={40} />
                  </div>
                  <Typography variant="h3">Mis Citas</Typography>
                  <Typography className="text-gray-500 mb-8 max-w-sm mx-auto">Pronto podrás ver el historial de tus citas y servicios realizados aquí.</Typography>
                  <Button onClick={() => navigate('/appointments')} variant="outline" className="px-8 border-gray-100">
                    Ir al Calendario
                  </Button>
                </Card>
              </div>
            )}

            {activeTab === 'configuracion' && (
              <Card className="p-8 bg-white shadow-xl rounded-3xl border-none">
                <Typography variant="h3" className="mb-6">Privacidad y Seguridad</Typography>
                <div className="space-y-4">
                  {[
                    { title: 'Notificaciones por Email', desc: 'Recibe recordatorios de tus citas.', status: true },
                    { title: 'Perfil Público', desc: 'Permite que otros vean tu progreso (Premium).', status: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-4 border-b border-gray-50 last:border-none">
                      <div>
                        <Typography className="font-bold text-gray-800 m-0">{item.title}</Typography>
                        <Typography variant="small" className="text-gray-500 mt-1">{item.desc}</Typography>
                      </div>
                      <div className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-all duration-300 ${item.status ? 'bg-primary' : 'bg-gray-200'}`}>
                        <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-300 ${item.status ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

