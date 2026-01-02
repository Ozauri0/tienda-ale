'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Trash2, RefreshCw, UserCheck, UserX, Shield } from 'lucide-react';

interface User {
  _id: string;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  nombreCompleto: string;
  rut: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface UserManagementProps {
  userRole: number;
}

export default function UserManagement({ userRole }: UserManagementProps) {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [error, setError] = useState('');

  const isDueno = userRole === 3;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [search, roleFilter, statusFilter, users]);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch(API_ENDPOINTS.USERS, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener usuarios');
      }

      setUsers(data.data.users);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = [...users];

    // Filtro de búsqueda
    if (search) {
      filtered = filtered.filter(user =>
        user.nombreCompleto.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase()) ||
        user.rut.includes(search)
      );
    }

    // Filtro por rol
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter);
    }

    // Filtro por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.isActive === (statusFilter === 'active'));
    }

    setFilteredUsers(filtered);
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(API_ENDPOINTS.USER_BY_ID(userId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Error al actualizar usuario');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`¿Estás seguro de eliminar al usuario ${userName}?`)) {
      return;
    }

    try {
      const response = await fetch(API_ENDPOINTS.USER_BY_ID(userId), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar usuario');
    }
  };

  const getRoleName = (role: string) => {
    switch (role) {
      case 'dueno': return 'Dueño';
      case 'administrador': return 'Admin';
      case 'usuario': return 'Usuario';
      default: return 'Desconocido';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'dueno': return 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/30';
      case 'administrador': return 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/30';
      case 'usuario': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/30';
      default: return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  const canDelete = (targetRole: string) => {
    if (isDueno) return true; // Dueño puede eliminar a todos
    return targetRole === 'usuario'; // Admin solo puede eliminar usuarios normales
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header con búsqueda y filtros */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Búsqueda */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o RUT..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          {/* Botón refrescar */}
          <button
            onClick={fetchUsers}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-secondary border border-border rounded-xl hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refrescar</span>
          </button>
        </div>

        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="all">Todos los roles</option>
            <option value="usuario">Usuario</option>
            <option value="administrador">Administrador</option>
            <option value="dueno">Dueño</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="flex-1 px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="all">Todos los estados</option>
            <option value="active">Activos</option>
            <option value="inactive">Inactivos</option>
          </select>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-secondary/50 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-xl sm:text-2xl font-bold">{users.length}</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Usuarios</p>
          <p className="text-xl sm:text-2xl font-bold">{users.filter(u => u.role === 'usuario').length}</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Admins</p>
          <p className="text-xl sm:text-2xl font-bold">{users.filter(u => u.role === 'administrador').length}</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Activos</p>
          <p className="text-xl sm:text-2xl font-bold">{users.filter(u => u.isActive).length}</p>
        </div>
      </div>

      {/* Lista de usuarios */}
      <div className="space-y-3">
        {filteredUsers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            No se encontraron usuarios
          </div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-secondary/30 border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold truncate">{user.nombreCompleto}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleColor(user.role)}`}>
                      {getRoleName(user.role)}
                    </span>
                    {user.isActive ? (
                      <UserCheck className="w-4 h-4 text-green-500" />
                    ) : (
                      <UserX className="w-4 h-4 text-red-500" />
                    )}
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p className="truncate">{user.email}</p>
                    <p>RUT: {user.rut}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleToggleStatus(user._id, user.isActive)}
                    className="flex items-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                    title={user.isActive ? 'Desactivar' : 'Activar'}
                  >
                    {user.isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                    <span className="hidden sm:inline">{user.isActive ? 'Desactivar' : 'Activar'}</span>
                  </button>

                  {canDelete(user.role) && (
                    <button
                      onClick={() => handleDeleteUser(user._id, user.nombreCompleto)}
                      className="flex items-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-sm"
                      title="Eliminar"
                    >
                      <Trash2 className="w-4 h-4" />
                      <span className="hidden sm:inline">Eliminar</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
