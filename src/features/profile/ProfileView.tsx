import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth0 } from '@auth0/auth0-react';
import { db, cartItems, users } from '../../db';
import { eq } from 'drizzle-orm';
import {
  fetchUserProfile,
  saveProfileChanges,
  deleteCurrentUser
} from '../../controllers/userController';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  LogOut, 
  Trash2, 
  Edit3, 
  Check, 
  X, 
  ShoppingBag, 
  Settings, 
  UserCircle,
  Clock,
  ChevronRight,
  ShieldAlert,
  Loader2,
  CheckCircle2,
  AlertCircle
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
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento?: string;
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
    if (!user?.sub) return;
    try {
      const userResult = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.auth0Id, user.sub))
        .limit(1);

      if (userResult.length === 0) return;
      const userId = userResult[0].id;

      const result = await db.select()
        .from(cartItems)
        .where(eq(cartItems.userId, userId));

      setFavoriteServices(result);
    } catch (error) {
      console.error('Error fetching favorite services from Postgres:', error);
    }
  };

  useEffect(() => {
    if (activeTab === 'favoritos') {
      fetchFavoriteServices();
    }
  }, [activeTab]);

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

  return (
    <div className="min-h-screen bg-gray-50/50 pt-24 pb-12 px-4">
       <div className="max-w-4xl mx-auto">
         <div className="bg-white rounded-3xl p-8 shadow-sm">
           <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
           {error && <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6">{error}</div>}
           {notification && <div className={`${notification.type === 'success' ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} p-4 rounded-xl mb-6`}>{notification.message}</div>}
           
           <div className="space-y-4">
             <div className="p-4 border border-gray-100 rounded-2xl flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Nombre</p>
                  <p className="font-semibold">{profile?.nombre}</p>
                </div>
                <button onClick={() => setEditingField('nombre')} className="text-primary hover:bg-primary/10 p-2 rounded-lg">
                  <Edit3 size={18} />
                </button>
             </div>
             {/* ... otros campos del perfil ... */}

             <button 
               onClick={handleSignOut} 
               className="mt-8 flex items-center gap-2 text-red-600 hover:bg-red-50 px-4 py-2 rounded-xl transition-colors"
             >
               <LogOut size={20} /> Cerrar sesión
             </button>
           </div>
         </div>
       </div>
    </div>
  );
}
