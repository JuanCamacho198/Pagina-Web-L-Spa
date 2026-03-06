import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { db, cartItems, users } from '../../db';
import { eq } from 'drizzle-orm';
import {
  fetchCurrentUser,
  saveProfileChanges,
  deleteCurrentUser
} from '../../controllers/userController';
import { auth, signOut } from '@/lib/auth';
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
  CheckCircle2
} from 'lucide-react';

interface Profile {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  fechaNacimiento?: string;
}

export default function ProfileView() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState('');
  const [editingField, setEditingField] = useState<string | null>(null);
  const [form, setForm] = useState<Profile>({ 
    nombre: '', 
    apellido: '', 
    email: '', 
    telefono: '', 
    fechaNacimiento: '' 
  });
  const [activeTab, setActiveTab] = useState<'personal' | 'favoritos' | 'configuracion'>('personal');
  const [favoriteServices, setFavoriteServices] = useState<any[]>([]);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchCurrentUser((data: any) => setProfile(data), setError);
  }, []);

  useEffect(() => {
    if (profile) {
      setForm({
        nombre: profile.nombre || '',
        apellido: profile.apellido || '',
        email: profile.email || '',
        telefono: profile.telefono || '',
        fechaNacimiento: profile.fechaNacimiento || ''
      });
    }
  }, [profile]);

  const fetchFavoriteServices = async () => {
    if (!auth.currentUser) return;
    try {
      // Obtener el ID del usuario en Postgres
      const userResult = await db.select({ id: users.id })
        .from(users)
        .where(eq(users.firebaseUid, auth.currentUser.uid))
        .limit(1);

      if (userResult.length === 0) return;
      const userId = userResult[0].id;

      // Consultar el carrito en Postgres
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSave = async (field: keyof Profile) => {
    setIsSaving(true);
    await saveProfileChanges(
      { [field]: form[field] },
      () => {
        setEditingField(null);
        fetchCurrentUser((data: any) => setProfile(data), setError);
        showNotification('Perfil actualizado correctamente');
        setIsSaving(false);
      },
      (msg) => {
        setError(msg);
        showNotification('Error al actualizar el perfil', 'error');
        setIsSaving(false);
      }
    );
  };

  const handleLogout = async () => {
    try {
      await signOut();
      showNotification('Sesión cerrada correctamente');
      navigate('/', { replace: true });
    } catch (error: any) {
      showNotification('Error al cerrar sesión', 'error');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) return;
    await deleteCurrentUser(
      () => {
        showNotification('Cuenta eliminada correctamente');
        navigate('/', { replace: true });
      },
      (msg) => {
        setError(msg);
        showNotification('Error al eliminar la cuenta', 'error');
      }
    );
  };

  if (!profile && !error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-primary mb-4" size={40} />
        <p className="text-gray-500 font-medium">Cargando tu perfil...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        
        {/* Notificación flotante */}
        {notification && (
          <div className={`fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300 ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3`}>
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <ShieldAlert size={20} />}
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 p-1 rounded-full">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header con gradiente suave */}
        <div className="bg-white rounded-[2.5rem] p-8 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 sm:block hidden"></div>
          
          <div className="relative">
            <div className="w-32 h-32 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border-4 border-white shadow-xl overflow-hidden group">
              {profile?.nombre ? (
                <span className="text-5xl font-black group-hover:scale-110 transition-transform duration-500">
                  {profile.nombre.charAt(0).toUpperCase()}
                </span>
              ) : (
                <UserCircle size={80} strokeWidth={1} />
              )}
            </div>
            <div className="absolute -bottom-2 -right-2 bg-green-500 w-6 h-6 rounded-full border-4 border-white shadow-sm" title="En línea"></div>
          </div>

          <div className="text-center md:text-left grow">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none mb-2">
              {profile?.nombre} {profile?.apellido}
            </h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4 text-sm font-medium text-gray-500">
              <span className="flex items-center gap-1.5"><Mail size={14} className="text-primary" /> {profile?.email}</span>
              {profile?.telefono && <span className="flex items-center gap-1.5"><Phone size={14} className="text-primary" /> {profile.telefono}</span>}
            </div>
          </div>

          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-red-50 text-gray-600 hover:text-red-500 rounded-2xl font-bold transition-all border border-gray-100 group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            Cerrar Sesión
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex p-1.5 bg-white rounded-2xl shadow-sm border border-gray-100 mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'personal', label: 'Datos Personales', icon: User },
            { id: 'favoritos', label: 'Mi Carrito', icon: ShoppingBag },
            { id: 'configuracion', label: 'Ajustes', icon: Settings },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm whitespace-nowrap transition-all flex-1 justify-center ${
                activeTab === tab.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-[1.02]' 
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          
          {activeTab === 'personal' && (
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                Información de contacto
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { id: 'nombre', label: 'Nombre', icon: User, value: profile?.nombre },
                  { id: 'apellido', label: 'Apellido', icon: User, value: profile?.apellido },
                  { id: 'telefono', label: 'Teléfono', icon: Phone, value: profile?.telefono },
                ].map((field) => (
                  <div key={field.id} className="group">
                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">
                      {field.label}
                    </label>
                    
                    {editingField === field.id ? (
                      <div className="space-y-3">
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                            <field.icon size={18} />
                          </div>
                          <input 
                            name={field.id}
                            value={form[field.id as keyof Profile]}
                            onChange={handleChange}
                            autoFocus
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-primary/20 rounded-2xl focus:border-primary outline-none transition-all font-bold text-gray-700"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button 
                            disabled={isSaving}
                            onClick={() => handleSave(field.id as keyof Profile)}
                            className="flex-1 bg-primary text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors disabled:opacity-50"
                          >
                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />} Guardar
                          </button>
                          <button 
                            onClick={() => setEditingField(null)}
                            className="px-4 py-3 bg-gray-100 text-gray-500 rounded-xl font-bold hover:bg-gray-200"
                          >
                            <X size={18} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-4 bg-gray-50/50 rounded-2xl border border-transparent group-hover:border-gray-100 group-hover:bg-white transition-all">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white shadow-sm border border-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                            <field.icon size={18} />
                          </div>
                          <span className="font-bold text-gray-700">{field.value || 'No definido'}</span>
                        </div>
                        <button 
                          onClick={() => setEditingField(field.id)}
                          className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-primary hover:bg-primary/5 transition-all opacity-0 group-hover:opacity-100"
                        >
                          <Edit3 size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                ))}

                <div className="group opacity-70">
                  <label className="text-xs font-black text-gray-400 uppercase tracking-widest ml-1 mb-2 block">Email</label>
                  <div className="flex items-center justify-between p-4 bg-gray-100/50 rounded-2xl border border-transparent cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white/50 border border-gray-100 rounded-xl flex items-center justify-center text-gray-400">
                        <Mail size={18} />
                      </div>
                      <span className="font-bold text-gray-500 italic">{profile?.email}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favoritos' && (
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                En mi Carrito
              </h2>
              
              {favoriteServices.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteServices.map((service) => (
                    <div key={service.id} className="p-5 border border-gray-100 rounded-3xl hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all group flex items-center gap-4">
                      <div className="w-16 h-16 bg-gray-50 rounded-2xl shrink-0 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                        <ShoppingBag size={24} />
                      </div>
                      <div className="grow min-w-0">
                        <h4 className="font-black text-gray-900 truncate">{service.Nombre}</h4>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="text-sm font-bold text-primary">
                            ${parseFloat(String(service.Precio || 0)).toLocaleString('es-CO')}
                          </span>
                          {service.Duracion && (
                            <span className="text-[10px] font-bold text-gray-400 uppercase flex items-center gap-1">
                              <Clock size={10} /> {service.Duracion} min
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate(`/services`)}
                        className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-primary/10 hover:text-primary transition-all"
                      >
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                    <ShoppingBag size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h3>
                  <p className="text-gray-500 mb-8">Descubre nuestras experiencias de spa y empieza a consentirte.</p>
                  <button 
                    onClick={() => navigate('/services')}
                    className="btn btn-primary px-10 py-4 shadow-xl shadow-primary/20"
                  >
                    Ver Servicios
                  </button>
                </div>
              )}
            </div>
          )}

          {activeTab === 'configuracion' && (
            <div className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black text-gray-900 mb-8 flex items-center gap-3">
                <div className="w-1.5 h-8 bg-primary rounded-full"></div>
                Zona de seguridad
              </h2>

              <div className="space-y-6">
                <div className="p-6 border border-red-50 bg-red-50/20 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div>
                    <h3 className="font-black text-red-600 mb-1 flex items-center gap-2">
                       Eliminar mi cuenta
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed max-w-md">
                      Al eliminar tu cuenta se perderá todo tu historial de citas y preferencias personales. Esta acción es irreversible.
                    </p>
                  </div>
                  <button 
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-red-600 text-red-600 hover:text-white border-2 border-red-100 hover:border-red-600 font-black rounded-2xl transition-all shadow-sm"
                  >
                    <Trash2 size={20} />
                    Eliminar Permanente
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}