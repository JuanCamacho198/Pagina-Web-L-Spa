import React, { useEffect, useState, useMemo } from 'react';
import { 
  Calendar,
  Users,
  Search,
  Filter,
  CheckCircle,
  Clock,
  XCircle,
  RotateCcw,
  ChevronDown,
  Eye,
  Scissors,
  DollarSign,
  CalendarDays
} from 'lucide-react';
import { fetchAllAppointments, updateAppointmentStatus } from '@/models/adminModel';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Typography } from '@/components/ui/Typography';
import { Input } from '@/components/ui/Input';
import { Dropdown } from '@/components/ui/Dropdown';
import { toast } from 'react-hot-toast';

type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

interface Appointment {
  id: string;
  userName: string;
  userEmail: string;
  serviceName: string;
  servicePrice: number | string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  createdAt?: string | Date;
}

const statusConfig = {
  pending: { label: 'Pendiente', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
  confirmed: { label: 'Confirmada', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  completed: { label: 'Completada', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'bg-red-100 text-red-700', icon: XCircle },
};

const statusFilters = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendientes' },
  { value: 'confirmed', label: 'Confirmadas' },
  { value: 'completed', label: 'Completadas' },
  { value: 'cancelled', label: 'Canceladas' },
];

export default function AdminBookingsView() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('');

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    try {
      const data = await fetchAllAppointments();
      setAppointments(data);
    } catch (error) {
      console.error("Error loading appointments:", error);
      toast.error("Error al cargar las reservas");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      toast.success(`Reserva ${newStatus === 'confirmed' ? 'confirmada' : newStatus === 'completed' ? 'completada' : newStatus === 'cancelled' ? 'cancelada' : 'actualizada'}`);
      loadAppointments();
    } catch (error) {
      toast.error("Error al actualizar el estado");
    }
  };

  // Filter appointments
  const filteredAppointments = useMemo(() => {
    return appointments.filter(apt => {
      // Status filter
      if (statusFilter !== 'all' && apt.status !== statusFilter) return false;
      
      // Search filter
      if (searchTerm) {
        const search = searchTerm.toLowerCase();
        const matchesSearch = 
          apt.userName?.toLowerCase().includes(search) ||
          apt.userEmail?.toLowerCase().includes(search) ||
          apt.serviceName?.toLowerCase().includes(search);
        if (!matchesSearch) return false;
      }
      
      // Date filter
      if (dateFilter) {
        const aptDate = new Date(apt.appointmentDate).toISOString().split('T')[0];
        if (aptDate !== dateFilter) return false;
      }
      
      return true;
    });
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = appointments.length;
    const confirmed = appointments.filter(a => a.status === 'confirmed').length;
    const pending = appointments.filter(a => a.status === 'pending').length;
    const completed = appointments.filter(a => a.status === 'completed').length;
    const cancelled = appointments.filter(a => a.status === 'cancelled').length;
    const revenue = appointments
      .filter(a => a.status === 'completed')
      .reduce((sum, a) => sum + Number(a.servicePrice || 0), 0);
    
    return { total, confirmed, pending, completed, cancelled, revenue };
  }, [appointments]);

  const getStatusBadge = (status: string) => {
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config?.icon || Clock;
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config?.color || 'bg-gray-100 text-gray-700'}`}>
        <Icon size={12} />
        {config?.label || status}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Typography variant="h1" className="text-2xl font-bold">Gestión de Reservas</Typography>
          <p className="text-gray-500">{filteredAppointments.length} reservas</p>
        </div>
        <Button variant="outline" onClick={loadAppointments} className="flex items-center gap-2">
          <RotateCcw size={18} />
          Actualizar
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100/50 border-blue-100">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-500 rounded-lg text-white">
                <Calendar size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-700">{stats.total}</p>
                <p className="text-xs text-blue-600 font-medium">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100/50 border-yellow-100">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-500 rounded-lg text-white">
                <Clock size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-yellow-700">{stats.pending}</p>
                <p className="text-xs text-yellow-600 font-medium">Pendientes</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100/50 border-green-100">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-500 rounded-lg text-white">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-700">{stats.confirmed}</p>
                <p className="text-xs text-green-600 font-medium">Confirmadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100/50 border-indigo-100">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-500 rounded-lg text-white">
                <CheckCircle size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-indigo-700">{stats.completed}</p>
                <p className="text-xs text-indigo-600 font-medium">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 border-emerald-100">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-500 rounded-lg text-white">
                <DollarSign size={18} />
              </div>
              <div>
                <p className="text-2xl font-bold text-emerald-700">${stats.revenue.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 font-medium">Ingresos</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input
                placeholder="Buscar por cliente, servicio o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50/50"
              />
            </div>

            {/* Status Filter */}
            <div className="flex gap-2 flex-wrap">
              {statusFilters.map(filter => (
                <Button
                  key={filter.value}
                  variant={statusFilter === filter.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setStatusFilter(filter.value)}
                  className="text-xs"
                >
                  {filter.label}
                </Button>
              ))}
            </div>

            {/* Date Filter */}
            <Input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-auto bg-gray-50/50"
            />
          </div>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Servicio</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="text-left py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="text-right py-4 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <CalendarDays size={48} className="mx-auto mb-4 text-gray-300" />
                    <p>No se encontraron reservas</p>
                  </td>
                </tr>
              ) : (
                filteredAppointments.map(apt => (
                  <tr key={apt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                          {apt.userName?.charAt(0).toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{apt.userName}</p>
                          <p className="text-xs text-gray-500">{apt.userEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <Scissors size={16} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">{apt.serviceName}</p>
                          <p className="text-sm text-primary font-bold">${apt.servicePrice}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        <CalendarDays size={16} className="text-gray-400" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {new Date(apt.appointmentDate).toLocaleDateString('es-ES', { 
                              weekday: 'short', 
                              month: 'short', 
                              day: 'numeric' 
                            })}
                          </p>
                          <p className="text-xs text-gray-500">{apt.appointmentTime}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(apt.status)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Dropdown
                        align="right"
                        trigger={
                          <Button variant="ghost" size="sm" className="flex items-center gap-2">
                            Gestionar
                            <ChevronDown size={14} />
                          </Button>
                        }
                        items={[
                          { 
                            label: 'Confirmar', 
                            onClick: () => handleStatusChange(apt.id, 'confirmed'), 
                            icon: <CheckCircle size={14} className="text-green-500" /> 
                          },
                          { 
                            label: 'Completar', 
                            onClick: () => handleStatusChange(apt.id, 'completed'), 
                            icon: <CheckCircle size={14} className="text-blue-500" /> 
                          },
                          { 
                            label: 'Marcar Pendiente', 
                            onClick: () => handleStatusChange(apt.id, 'pending'), 
                            icon: <Clock size={14} className="text-yellow-500" /> 
                          },
                          { 
                            label: 'Cancelar', 
                            onClick: () => handleStatusChange(apt.id, 'cancelled'), 
                            icon: <XCircle size={14} className="text-red-500" />,
                            variant: 'danger'
                          },
                        ]}
                      />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
