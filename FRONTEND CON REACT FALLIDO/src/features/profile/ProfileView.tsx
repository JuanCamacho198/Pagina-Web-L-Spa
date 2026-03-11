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
import { fetchUserProfile, saveProfileChanges } from '@/controllers/userController';
import { UserProfile, Appointment } from '@/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Typography } from '@/components/ui/Typography';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { cn } from '@/lib/utils';
import { fetchAppointments, deleteAppointment } from '@/models/citasModel';

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loadingCitas, setLoadingCitas] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'personal' | 'citas' | 'configuracion'>('personal');
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<string | null>(null);
  
  const { success, error: toastError } = useToast();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
  });

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

  const loadAppointments = async () => {
    if (!user?.sub) return;
    setLoadingCitas(true);
    try {
      const data = await fetchAppointments(user.sub);
      setAppointments(data);
    } catch (err: any) {
      toastError("Error al cargar citas");
    } finally {
      setLoadingCitas(false);
    }
  };

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      loadProfile();
      if (activeTab === 'citas') {
        loadAppointments();
      }
    }
  }, [user, isAuthenticated, authLoading, activeTab]);

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
      success('Perfil actualizado correctamente');
    } catch (err: any) {
      toastError(err.message || 'Error al actualizar el perfil');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = (id: string) => {
    setAppointmentToDelete(id);
    setIsModalOpen(true);
  };

  const confirmCancel = async () => {
    if (!appointmentToDelete) return;
    try {
      await deleteAppointment(appointmentToDelete);
      setAppointments(prev => prev.filter(a => a.id !== appointmentToDelete));
      success("Cita cancelada con éxito");
    } catch (err: any) {
      toastError("No se pudo cancelar la cita");
    } finally {
      setIsModalOpen(false);
      setAppointmentToDelete(null);
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
            {activeTab === 'personal' && (
              <Card className="bg-white p-8 rounded-3xl border-none shadow-xl shadow-gray-200/50 animate-in fade-in slide-in-from-right-4 duration-500">
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
                      <Typography variant="small" className="text-gray-700 ml-1 font-semibold">Nombre</Typography>
                      <Input 
                        {...register('firstName')} 
                        placeholder="Tu nombre" 
                        error={errors.firstName?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Typography variant="small" className="text-gray-700 ml-1 font-semibold">Apellido</Typography>
                      <Input 
                        {...register('lastName')} 
                        placeholder="Tu apellido" 
                        error={errors.lastName?.message}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Typography variant="small" className="text-gray-700 ml-1 font-semibold">Correo Electrónico</Typography>
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
                      <Typography variant="small" className="text-gray-700 ml-1 font-semibold">Teléfono Móvil</Typography>
                      <Input 
                        {...register('phone')} 
                        placeholder="+57 321..." 
                        error={errors.phone?.message}
                      />
                    </div>
                    <div className="space-y-2">
                      <Typography variant="small" className="text-gray-700 ml-1 font-semibold">Fecha de Nacimiento</Typography>
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
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="flex items-center justify-between mb-4 px-2">
                  <Typography variant="h3" className="m-0">Mis Citas</Typography>
                  <Button onClick={() => navigate('/services')} variant="ghost" size="sm" className="text-primary hover:bg-primary/5 rounded-xl font-bold">
                    + Nueva Reserva
                  </Button>
                </div>

                {loadingCitas ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl shadow-sm border border-gray-100">
                      <Loader2 className="animate-spin text-primary mb-4" size={40} />
                      <p className="text-gray-500 font-medium">Buscando tus reservas...</p>
                    </div>
                ) : appointments.length > 0 ? (
                  <div className="grid gap-4">
                    {appointments.map((cita) => (
                      <Card key={cita.id} className="p-6 bg-white border-none shadow-md hover:shadow-lg transition-shadow rounded-3xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <SparkleIcon size={32} />
                          </div>
                          <div>
                            <Typography className="font-bold text-lg md:text-xl m-0 text-gray-900 border-none">{cita.serviceName || 'Servicio de Spa'}</Typography>
                            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                              <span className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                                <Calendar size={14} className="text-primary/60" /> {cita.appointmentDate}
                              </span>
                              <span className="text-sm text-gray-500 flex items-center gap-1.5 font-medium">
                                <Clock size={14} className="text-primary/60" /> {cita.appointmentTime}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full md:w-auto mt-2 md:mt-0 justify-between md:justify-end border-t md:border-t-0 pt-4 md:pt-0">
                          <Badge className={cn(
                            "px-4 py-1.5 rounded-full font-bold uppercase tracking-wider text-[10px] border-none",
                            cita.status === 'pending' ? "bg-amber-100 text-amber-700" : "bg-green-100 text-green-700"
                          )}>
                            {cita.status === 'pending' ? 'Pendiente' : 'Confirmada'}
                          </Badge>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleCancelClick(cita.id)}
                            className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl font-bold"
                          >
                            Cancelar
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card className="p-12 text-center bg-white shadow-xl rounded-3xl border-none">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-6 border-2 border-dashed border-gray-200">
                      <ShoppingBag size={48} />
                    </div>
                    <Typography variant="h3">Aún no tienes citas</Typography>
                    <Typography className="text-gray-500 mb-8 max-w-sm mx-auto">Tus próximas experiencias de relajación aparecerán aquí cuando reserves un servicio.</Typography>
                    <Button onClick={() => navigate('/services')} className="px-10 py-6 rounded-2xl shadow-xl shadow-primary/20">
                      Explorar Servicios
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {activeTab === 'configuracion' && (
              <Card className="p-8 bg-white shadow-xl rounded-3xl border-none animate-in fade-in slide-in-from-right-4 duration-500">
                <Typography variant="h3" className="mb-6">Privacidad y Seguridad</Typography>
                <div className="space-y-4">
                  {[
                    { title: 'Notificaciones por Email', desc: 'Recibe recordatorios de tus citas.', status: true },
                    { title: 'Perfil Público', desc: 'Permite que otros vean tu progreso (Premium).', status: false },
                    { title: 'Seguridad en dos pasos', desc: 'Protege tu cuenta con verificación adicional.', status: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-6 border-b border-gray-50 last:border-none">
                      <div>
                        <Typography className="font-bold text-gray-800 m-0 text-lg">{item.title}</Typography>
                        <Typography variant="small" className="text-gray-500 mt-1">{item.desc}</Typography>
                      </div>
                      <div className={`w-14 h-8 rounded-full p-1 cursor-pointer transition-all duration-300 ${item.status ? 'bg-primary shadow-inner shadow-primary-dark/20' : 'bg-gray-200'}`}>
                        <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-transform duration-300 ${item.status ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Cancelar Cita"
        footer={
          <div className="flex gap-4 w-full">
            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="flex-1 rounded-2xl">Mantener Cita</Button>
            <Button variant="danger" onClick={confirmCancel} className="flex-1 rounded-2xl shadow-lg shadow-red-100">Sí, Cancelar</Button>
          </div>
        }
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={32} />
          </div>
          <Typography variant="h4" className="mb-2">¿Estás seguro?</Typography>
          <Typography className="text-gray-500">
            Esta acción no se puede deshacer. Tu espacio quedará disponible para otros clientes.
          </Typography>
        </div>
      </Modal>
    </div>
  );
}

