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
  Filter
} from 'lucide-react';
import { fetchAllAppointments, updateAppointmentStatus, fetchAdminStats } from '@/models/adminModel';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Typography } from '@/components/ui/Typography';
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
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="flex justify-between items-center">
        <Typography variant="h1" className="text-3xl font-bold">Panel de Administración</Typography>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData}>Actualizar</Button>
          <Button onClick={() => window.location.href = '/admin/services/new'}>Nuevo Servicio</Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full text-blue-600">
                <CalendarIcon size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Total Citas</p>
                <p className="text-2xl font-bold">{stats?.totalAppointments || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full text-green-600">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Clientes</p>
                <p className="text-2xl font-bold">{stats?.totalUsers || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-100 rounded-full text-purple-600">
                <Settings size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Servicios</p>
                <p className="text-2xl font-bold">{stats?.totalServices || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-amber-100 rounded-full text-amber-600">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm text-gray-500">Ingresos Est.</p>
                <p className="text-2xl font-bold">${stats?.estimatedRevenue || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Appointments Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <Typography variant="h2" className="text-xl font-semibold">Gestión de Reservas</Typography>
            <Button variant="ghost" size="sm">Ver todas</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="py-4 font-medium text-gray-500">Cliente</th>
                  <th className="py-4 font-medium text-gray-500">Servicio</th>
                  <th className="py-4 font-medium text-gray-500">Fecha/Hora</th>
                  <th className="py-4 font-medium text-gray-500">Estado</th>
                  <th className="py-4 font-medium text-gray-500 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {appointments.slice(0, 10).map((appt) => (
                  <tr key={appt.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900">{appt.userName}</span>
                        <span className="text-xs text-gray-500">{appt.userEmail}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{appt.serviceName}</span>
                        <span className="text-xs text-primary font-medium">${appt.servicePrice}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      <div className="flex flex-col">
                        <span className="text-gray-900">{new Date(appt.appointmentDate).toLocaleDateString()}</span>
                        <span className="text-xs text-gray-500">{appt.appointmentTime}</span>
                      </div>
                    </td>
                    <td className="py-4">
                      {getStatusBadge(appt.status)}
                    </td>
                    <td className="py-4 text-right">
                      <div className="flex justify-end gap-2">
                        {appt.status === 'pending' && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="bg-green-50 text-green-600 hover:bg-green-100"
                            onClick={() => handleStatusChange(appt.id, 'confirmed')}
                          >
                            <CheckCircle size={16} />
                          </Button>
                        )}
                        {appt.status !== 'completed' && appt.status !== 'cancelled' && (
                          <>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100"
                              onClick={() => handleStatusChange(appt.id, 'completed')}
                            >
                              <CheckCircle size={16} />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="bg-red-50 text-red-600 hover:bg-red-100"
                              onClick={() => handleStatusChange(appt.id, 'cancelled')}
                            >
                              <XCircle size={16} />
                            </Button>
                          </>
                        )}
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
