import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { fetchAppointments, deleteAppointment } from '../../models/citasModel';
import { 
  Calendar, 
  Clock, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  Loader2, 
  Plus, 
  X,
  History,
  Info
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Appointment {
  id: string;
  serviceName: string;
  appointmentDate: string;
  appointmentTime: string;
  createdAt: any;
  status?: string;
}

export default function CitasView() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth0();
  const [citas, setCitas] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalId, setModalId] = useState<string | null>(null);
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    async function load() {
      if (authLoading) return;
      
      if (!isAuthenticated || !user?.sub) {
        setError('Inicia sesión para ver tus citas.');
        setLoading(false);
        return;
      }

      try {
        const list = await fetchAppointments(user.sub);
        setCitas(list as Appointment[]);
      } catch (err: any) {
        setError('No pudimos recuperar tus citas. Inténtalo de nuevo más tarde.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user, isAuthenticated, authLoading]);

  const confirmCancel = async () => {
    if (!modalId) return;
    setCancelingId(modalId);
    try {
      await deleteAppointment(modalId);
      setCitas(prev => prev.filter(cita => cita.id !== modalId));
      showNotification('Tu cita ha sido cancelada exitosamente.');
    } catch (err: any) {
      showNotification('Hubo un error al cancelar la cita.', 'error');
    } finally {
      setModalId(null);
      setCancelingId(null);
    }
  };

  const getAppointmentStatus = (cita: Appointment) => {
    const now = new Date();
    const [year, month, day] = cita.appointmentDate.split('-').map(Number);
    const [hours, minutes] = (cita.appointmentTime || '00:00').split(':').map(val => parseInt(val));
    const appointmentDate = new Date(year, month - 1, day, hours, minutes);

    if (appointmentDate < now) {
      return { status: 'completada', label: 'Completada', color: 'bg-green-100 text-green-700 border-green-200' };
    } else if (appointmentDate.toDateString() === now.toDateString()) {
      return { status: 'hoy', label: 'Para Hoy', color: 'bg-amber-100 text-amber-700 border-amber-200' };
    } else {
      return { status: 'programada', label: 'Próxima', color: 'bg-blue-100 text-blue-700 border-blue-200' };
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <Loader2 className="animate-spin text-primary mb-4" size={48} />
        <p className="text-gray-500 font-medium animate-pulse">Consultando tu agenda de bienestar...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        
        {/* Notificaciones */}
        {notification && (
          <div className={`fixed top-24 right-4 z-50 animate-in slide-in-from-right duration-300 ${
            notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'
          } text-white px-6 py-4 rounded-4xlxl shadow-2xl flex items-center gap-3`}>
            {notification.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
            <span className="font-medium">{notification.message}</span>
            <button onClick={() => setNotification(null)} className="ml-2 hover:bg-white/20 p-1 rounded-full transition-colors">
              <X size={16} />
            </button>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Mis Citas</h1>
            <p className="text-gray-500 mt-2 text-lg">Administra tus momentos de relajación y cuidado personal.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-4xlxl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-4xll flex items-center justify-center text-primary font-bold">
                {citas.length}
              </div>
              <div className="text-xs uppercase font-bold text-gray-400 tracking-widest leading-none">
                Total<br/>Reservas
              </div>
            </div>
            <button 
              onClick={() => navigate('/services')}
              className="btn btn-primary px-6 flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Plus size={20} />
              Nueva Cita
            </button>
          </div>
        </div>

        {error ? (
          <div className="bg-white rounded-4xlxl p-12 text-center shadow-sm border border-gray-100 max-w-lg mx-auto">
            <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertCircle size={40} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ops! Algo salió mal</h2>
            <p className="text-gray-500 mb-8">{error}</p>
            <button onClick={() => window.location.reload()} className="btn btn-primary px-8">Reintentar</button>
          </div>
        ) : citas.length === 0 ? (
          <div className="bg-white rounded-4xlxl p-20 text-center shadow-sm border border-gray-100">
            <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-8 text-gray-300">
              <Calendar size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">No tienes citas aún</h2>
            <p className="text-gray-500 max-w-md mx-auto mb-10 text-lg leading-relaxed">
              Tómate un descanso. Explora nuestros servicios y reserva tu próximo momento de paz.
            </p>
            <button 
              onClick={() => navigate('/services')}
              className="btn btn-primary px-10 py-4 text-lg shadow-xl shadow-primary/20"
            >
              Ver Servicios Disponibles
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-700">
            {citas.map(cita => {
              const status = getAppointmentStatus(cita);
              return (
                <div key={cita.id} className="bg-white rounded-4xlxl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group self-start">
                  <div className="p-6 grow">
                    <div className="flex justify-between items-start mb-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${status.color}`}>
                        {status.label}
                      </span>
                      {status.status === 'completada' && (
                        <CheckCircle2 size={18} className="text-green-500" />
                      )}
                    </div>
                    
                    <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                      {cita.serviceName || 'Servicio Premium'}
                    </h3>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="w-10 h-10 bg-gray-50 rounded-4xll flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                          <Calendar size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Fecha</p>
                          <p className="text-sm font-bold text-gray-700">{cita.appointmentDate}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4 text-gray-600">
                        <div className="w-10 h-10 bg-gray-50 rounded-4xll flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                          <Clock size={18} />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Hora</p>
                          <p className="text-sm font-bold text-gray-700">{cita.appointmentTime || '--:--'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
                    {status.status !== 'completada' ? (
                      <button 
                        onClick={() => setModalId(cita.id)}
                        disabled={cancelingId === cita.id}
                        className="text-gray-400 hover:text-red-500 text-sm font-bold flex items-center gap-2 transition-colors disabled:opacity-50"
                      >
                        {cancelingId === cita.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                        Cancelar
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs font-medium italic flex items-center gap-1">
                        <History size={14} /> Finalizada
                      </span>
                    )}
                    <button 
                      onClick={() => navigate(`/services`)} // O a detalle si existiera
                      className="text-primary hover:translate-x-1 transition-transform p-1"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Modal Confirmación */}
        {modalId && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="bg-white rounded-4xl max-w-sm w-full p-8 shadow-2xl animate-in zoom-in duration-300 text-center">
              <div className="w-16 h-16 bg-red-100 rounded-4xlxl flex items-center justify-center mx-auto mb-6 text-red-600">
                <Info size={32} />
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-3">¿Cancelar Cita?</h2>
              <p className="text-gray-500 mb-8 leading-relaxed">
                Esta acción cancelará tu reserva de forma permanente. ¿Estás seguro de que deseas continuar?
              </p>
              <div className="flex flex-col gap-3">
                <button 
                  onClick={confirmCancel}
                  disabled={cancelingId === modalId}
                  className="w-full py-4 bg-red-600 text-white font-bold rounded-4xlxl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {cancelingId === modalId ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : 'Sí, cancelar cita'}
                </button>
                <button 
                  onClick={() => setModalId(null)}
                  className="w-full py-4 text-gray-400 font-bold hover:text-gray-600 transition-colors"
                >
                  No, mantener reserva
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
