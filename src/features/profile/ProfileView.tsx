import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth0 } from '@auth0/auth0-react';
import { db, cartItems } from '../../db';
import { eq } from 'drizzle-orm';
import {
  fetchUserProfile,
  saveProfileChanges
} from '../../controllers/userController';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  LogOut, 
  Edit3, 
  ShoppingBag, 
  Settings, 
  Loader2,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Clock,
  Sparkles as SparkleIcon,
  User as UserIcon
} from 'lucide-react';

const profileSchema = z.object({
  nombre: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  apellido: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Correo no válido'),
  telefono: z.string().min(7, 'Mínimo 7 dígitos').regex(/^[0-9+ ]+$/, 'Solo números'),
  fechaNacimiento: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface Profile {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento?: string;
  role: string;
}

export default function ProfileView() {
  const { user, logout, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'personal' | 'favoritos' | 'configuracion'>('personal');
  const [favoriteServices, setFavoriteServices] = useState<any[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
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
        setProfile(data as Profile);
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
        nombre: profile.nombre || '',
        apellido: profile.apellido || '',
        email: profile.email || '',
        telefono: profile.telefono || '',
        fechaNacimiento: profile.fechaNacimiento || ''
      });
    }
  }, [profile, reset]);

  const fetchFavoriteServices = async () => {
    if (!profile?.id) return;
    try {
      const result = await db.select()
        .from(cartItems)
        .where(eq(cartItems.userId, profile.id));

      setFavoriteServices(result);
    } catch (error) {
      console.error('Error fetching favorite services from Postgres:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'favoritos') {
      fetchFavoriteServices();
    }
  }, [activeTab, profile]);

  const onProfileSubmit = async (data: ProfileFormValues) => {
    if (!editingField || !user?.sub) return;
    const field = editingField as keyof ProfileFormValues;
    
    setIsSaving(true);
    try {
      await saveProfileChanges(user.sub, { [field]: data[field] });
      setEditingField(null);
      await loadProfile();
      showNotification('Perfil actualizado correctamente');
    } catch (msg: any) {
      setError(msg.message);
      showNotification('Error al actualizar el perfil', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = () => {
    logout({ logoutParams: { returnTo: window.location.origin } });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  const renderField = (label: string, field: keyof ProfileFormValues, icon: React.ReactNode, value: string | undefined) => {
    const isEditing = editingField === field;

    return (
      <div className="group p-5 border border-gray-100 rounded-3xl hover:border-primary/30 hover:bg-white hover:shadow-sm transition-all duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-500 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
              {icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-500 mb-0.5">{label}</p>
              {isEditing ? (
                <div className="mt-2 flex gap-2 animate-in fade-in slide-in-from-left-2 duration-300">
                  <div className="flex-1 max-w-xs">
                    <input
                      {...register(field)}
                      className={`w-full px-4 py-2 bg-gray-50 border ${errors[field] ? 'border-red-500' : 'border-gray-200'} rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all outline-none text-sm`}
                      autoFocus
                    />
                    {errors[field] && <p className="text-red-500 text-[10px] mt-1 ml-1">{errors[field]?.message}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={handleSubmit(onProfileSubmit)}
                      disabled={isSaving}
                      className="p-2 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <CheckCircle2 size={18} />
                    </button>
                    <button 
                      onClick={() => { setEditingField(null); reset(); }}
                      className="p-2 bg-gray-100 text-gray-500 rounded-xl hover:bg-gray-200 transition-colors"
                    >
                      <AlertCircle size={18} />
                    </button>
                  </div>
                </div>
              ) : (
                <p className="font-semibold text-gray-900">{value || 'No especificado'}</p>
              )}
            </div>
          </div>
          {!isEditing && (
            <button 
              onClick={() => setEditingField(field)}
              className="p-2 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all opacity-0 group-hover:opacity-100"
            >
              <Edit3 size={18} />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full">
                {profile?.role === 'admin' ? 'Administrador' : 'Cliente Premium'}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Hola, <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">{profile?.nombre || user?.nickname}</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium">Gestiona tu bienestar y tus citas desde aquí.</p>
          </div>
          
          <button 
            onClick={handleSignOut}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-red-600 font-bold rounded-2xl border border-red-50 shadow-sm hover:bg-red-50 hover:border-red-100 transition-all duration-300 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>

        {notification && (
          <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 animate-in zoom-in duration-300 ${notification.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            <CheckCircle2 size={20} />
            <p className="text-sm font-bold">{notification.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          <div className="lg:col-span-1 space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
            <button 
              onClick={() => setActiveTab('personal')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'personal' ? 'bg-primary text-white shadow-lg shadow-primary/20 cursor-default' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
            >
              <UserIcon size={20} />
              <span className="font-bold">Información Personal</span>
            </button>
            
            <button 
              onClick={() => setActiveTab('favoritos')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'favoritos' ? 'bg-primary text-white shadow-lg shadow-primary/20 cursor-default' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
            >
              <ShoppingBag size={20} />
              <span className="font-bold">Mis Favoritos</span>
            </button>

            <button 
              onClick={() => setActiveTab('configuracion')}
              className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl transition-all duration-300 ${activeTab === 'configuracion' ? 'bg-primary text-white shadow-lg shadow-primary/20 cursor-default' : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'}`}
            >
              <Settings size={20} />
              <span className="font-bold">Configuración</span>
            </button>
          </div>

          <div className="lg:col-span-3 space-y-8 animate-in fade-in slide-in-from-right-4 duration-500 delay-200">
            
            {activeTab === 'personal' && (
              <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent">
                    <UserIcon size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Perfil de Usuario</h2>
                    <p className="text-sm text-gray-400 font-medium">Información básica y contacto.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {renderField('Nombre', 'nombre', <UserIcon size={20} />, profile?.nombre)}
                  {renderField('Apellido', 'apellido', <UserIcon size={20} />, profile?.apellido)}
                  {renderField('Correo Electrónico', 'email', <Mail size={20} />, profile?.email || user?.email)}
                  {renderField('Teléfono', 'telefono', <Phone size={20} />, profile?.telefono)}
                  {renderField('Fecha de Nacimiento', 'fechaNacimiento', <Calendar size={20} />, profile?.fechaNacimiento)}
                </div>
              </div>
            )}

            {activeTab === 'favoritos' && (
              <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6">
                    <SparkleIcon size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Aún no tienes favoritos</h3>
                  <p className="text-gray-500 max-w-xs mx-auto mb-8">Guarda tus servicios favoritos para agendarlos más rápido la próxima vez.</p>
                  <button 
                    onClick={() => navigate('/services')}
                    className="btn btn-primary px-8 py-3 rounded-2xl font-bold shadow-lg shadow-primary/20"
                  >
                    Ver Servicios
                  </button>
                </div>
              </div>
            )}

            {activeTab === 'configuracion' && (
              <div className="bg-white rounded-[40px] p-8 md:p-10 shadow-xl shadow-gray-200/50 border border-gray-100">
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-500">
                    <Settings size={28} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900">Seguridad</h2>
                    <p className="text-sm text-gray-400 font-medium">Gestiona tu cuenta y privacidad.</p>
                  </div>
                </div>

                <div className="space-y-4">
                   <div className="p-6 border border-gray-100 rounded-3xl flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 text-blue-500 rounded-xl flex items-center justify-center">
                          <ShieldCheck size={20} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900">Cambiar Contraseña</p>
                          <p className="text-xs text-gray-400">Te enviaremos un correo de recuperación.</p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-gray-300 group-hover:text-primary transition-colors" />
                   </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
