import React, { useEffect, useState } from 'react';
import { fetchServices, deleteService } from '@/models/servicesModel';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Edit2, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

export default function AdminServicesListView() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const data = await fetchServices();
      setServices(data);
    } catch (error) {
      toast.error("Error al cargar servicios");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este servicio?")) return;
    try {
      await deleteService(id);
      toast.success("Servicio eliminado");
      loadServices();
    } catch (error) {
      toast.error("Error al eliminar");
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando servicios...</div>;

return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Typography variant="h1" className="text-2xl font-bold">Gestión de Servicios</Typography>
        <Button onClick={() => navigate('/admin/services/new')}>
          <Plus size={18} className="mr-2" /> Nuevo Servicio
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <Card key={service.id} className="overflow-hidden group">
            <div className="h-48 overflow-hidden relative">
              <img 
                src={service.imageUrl || 'https://via.placeholder.com/400x300?text=L-SPA'} 
                alt={service.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute top-2 right-2 flex gap-2">
                <Button 
                  size="sm" 
                  className="bg-white/90 hover:bg-white text-gray-700 shadow-sm"
                  onClick={() => navigate(`/admin/services/edit/${service.id}`)}
                >
                  <Edit2 size={16} />
                </Button>
                <Button 
                  size="sm" 
                  variant="danger"
                  className="bg-red-500/90 hover:bg-red-500 text-white shadow-sm"
                  onClick={() => handleDelete(service.id)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            <CardContent className="pt-4">
              <div className="flex justify-between items-start mb-2">
                <Typography variant="h3" className="text-lg font-bold">{service.name}</Typography>
                <Typography className="text-primary font-bold">${service.price}</Typography>
              </div>
              <Typography variant="p" className="text-gray-500 line-clamp-2 mb-4 mt-0!">
                {service.description}
              </Typography>
              <div className="flex items-center text-xs text-gray-400 gap-4">
                <span className="bg-gray-100 px-2 py-1 rounded">{service.category}</span>
                <span>{service.duration} min</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
