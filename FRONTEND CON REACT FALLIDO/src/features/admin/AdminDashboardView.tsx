import React, { useEffect, useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Users, 
  Settings, 
  TrendingUp, 
  CheckCircle, 
  Clock, 
  XCircle,
  MoreVertical,
  Filter,
  UserPlus,
  ChevronDown,
  RotateCcw
} from 'lucide-react';
import { fetchAllAppointments, updateAppointmentStatus, fetchAdminStats } from '@/models/adminModel';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Typography } from '@/components/ui/Typography';
import { Dropdown } from '@/components/ui/Dropdown';
import { toast } from 'react-hot-toast';

export default function AdminDashboardView() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [apptsData, statsData] = await Promise.all([
        fetchAllAppointments(),
        fetchAdminStats()
      ]);
      setAppointments(apptsData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading admin data:", error);
      toast.error("Error al cargar los datos del panel");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await updateAppointmentStatus(id, newStatus);
      toast.success(`Estado actualizado a ${newStatus}`);
      loadData(); // Recargar datos
    } catch (error) {
      toast.error("Error al actualizar el estado");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed': return <Badge variant="default" className="bg-green-100 text-green-700">Confirmada</Badge>;
      case 'pending': return <Badge variant="default" className="bg-yellow-100 text-yellow-700">Pendiente</Badge>;
      case 'cancelled': return <Badge variant="default" className="bg-red-100 text-red-700">Cancelada</Badge>;
      case 'completed': return <Badge variant="default" className="bg-blue-100 text-blue-700">Completada</Badge>;
      default: return <Badge variant="default">{status}</Badge>;
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando dashboard...</div>;

return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <CalendarIcon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Citas</p>
                <p className="text-2xl font-bold dark:text-white">{stats?.totalAppointments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/40 rounded-full text-green-600 dark:text-green-400">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Clientes</p>
                <p className="text-2xl font-bold dark:text-white">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/40 rounded-full text-purple-600 dark:text-purple-400">
                <Settings size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Servicios</p>
                <p className="text-2xl font-bold dark:text-white">{stats?.totalServices || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 dark:bg-amber-900/40 rounded-full text-amber-600 dark:text-amber-400">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Ingresos Est.</p>
                <p className="text-2xl font-bold dark:text-white">${stats?.estimatedRevenue || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

{/* Recent Appointments Table */}
      <Card className="overflow-visible">
        <CardHeader>
          <div className="flex justify-between items-center">
            <Typography variant="h2" className="text-xl font-semibold">Gestión de Reservas</Typography>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={loadData} className="flex items-center gap-2">
                <RotateCcw size={14} />
                Actualizar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="py-4 font-medium text-gray-500 dark:text-gray-400">Cliente</th>
                  <th className="py-4 font-medium text-gray-500 dark:text-gray-400">Servicio</th>
                  <th className="py-4 font-medium text-gray-500 dark:text-gray-400">Fecha/Hora</th>
                  <th className="py-4 font-medium text-gray-500 dark:text-gray-400">Estado</th>
                  <th className="py-4 font-medium text-gray-500 dark:text-gray-400 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {appointments.slice(0, 10).map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 dark:text-white">{appt.userName}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{appt.userEmail}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white">{appt.serviceName}</span>
                        <span className="text-xs text-primary font-medium">${appt.servicePrice}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900 dark:text-white">{new Date(appt.appointmentDate).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{appt.appointmentTime}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {getStatusBadge(appt.status)}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end">
                        <Dropdown
                          align="right"
                          trigger={
                            <Button variant="ghost" size="sm" className="hover:bg-gray-100 flex gap-2">
                              Gestionar
                              <ChevronDown size={14} />
                            </Button>
                          }
                          items={[
                            { label: 'Confirmar', onClick: () => handleStatusChange(appt.id, 'confirmed'), icon: <CheckCircle size={14} className="text-green-500" /> },
                            { label: 'Completar', onClick: () => handleStatusChange(appt.id, 'completed'), icon: <CheckCircle size={14} className="text-blue-500" /> },
                            { label: 'Pendiente', onClick: () => handleStatusChange(appt.id, 'pending'), icon: <Clock size={14} className="text-yellow-500" /> },
                            { label: 'Cancelar', onClick: () => handleStatusChange(appt.id, 'cancelled'), icon: <XCircle size={14} className="text-red-500" />, variant: 'danger' },
                          ]}
                        />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
