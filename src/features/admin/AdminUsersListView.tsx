import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Shield, 
  User as UserIcon, 
  Mail, 
  Calendar,
  ChevronRight,
  RefreshCw,
} from 'lucide-react';
import { fetchAllUsers, updateUserRole } from '@/models/adminModel';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Typography } from '@/components/ui/Typography';
import { SearchBar } from '@/components/ui/SearchBar';
import { toast } from 'react-hot-toast';

export default function AdminUsersListView() {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(user => 
      (user.firstName?.toLowerCase() || '').includes(term) ||
      (user.lastName?.toLowerCase() || '').includes(term) ||
      (user.email?.toLowerCase() || '').includes(term)
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const usersData = await fetchAllUsers();
      setUsers(usersData);
      setFilteredUsers(usersData);
    } catch (error) {
      console.error("Error loading users:", error);
      toast.error("Error al cargar los usuarios");
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, currentRole: string) => {
    const roles: ('admin' | 'employee' | 'customer')[] = ['customer', 'employee', 'admin'];
    const nextRoleIndex = (roles.indexOf(currentRole as any) + 1) % roles.length;
    const nextRole = roles[nextRoleIndex];

    try {
      await updateUserRole(userId, nextRole);
      toast.success(`Rol actualizado a ${nextRole}`);
      loadUsers();
    } catch (error) {
      toast.error("Error al actualizar el rol");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin': return <Badge variant="default" className="bg-purple-100 text-purple-700">Administrador</Badge>;
      case 'employee': return <Badge variant="default" className="bg-blue-100 text-blue-700">Empleado</Badge>;
      case 'customer': return <Badge variant="default" className="bg-green-100 text-green-700">Cliente</Badge>;
      default: return <Badge variant="default">{role}</Badge>;
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <Typography variant="h1" className="text-3xl font-bold flex items-center gap-2">
            <Users size={32} />
            Gestión de Usuarios
          </Typography>
          <Typography variant="h1" className="text-gray-500 mt-1">
            Administra los roles y personal del spa.
          </Typography>
        </div>
        <Button variant="outline" onClick={loadUsers} className="flex gap-2">
          <RefreshCw size={18} />
          Actualizar
        </Button>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <SearchBar 
            value={searchTerm} 
            onChange={setSearchTerm} 
            placeholder="Buscar por nombre o correo electrónico..."
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No se encontraron usuarios que coincidan con la búsqueda.
          </div>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-center p-4 gap-4">
                  <div className="bg-gray-100 p-3 rounded-full">
                    <UserIcon size={24} className="text-gray-600" />
                  </div>
                  
                  <div className="flex-1 min-w-0 text-center sm:text-left">
                    <Typography variant="h3" className="text-lg font-semibold truncate">
                      {user.firstName} {user.lastName}
                    </Typography>
                    <div className="flex flex-wrap justify-center sm:justify-start gap-3 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Mail size={14} />
                        {user.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar size={14} />
                        Desde {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    {getRoleBadge(user.role)}
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRoleChange(user.id, user.role)}
                    >
                      Cambiar Rol
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
