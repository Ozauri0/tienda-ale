'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Users, Package, Settings, AlertCircle } from 'lucide-react';
import UserManagement from '@/components/admin/UserManagement';
import ProductManagement from '@/components/admin/ProductManagement';

type TabType = 'users' | 'products';

export default function AdminPanel() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('products');
  const [hasPermission, setHasPermission] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    } else if (user) {
      // Verificar si el usuario es Admin o Dueño
      const isAdmin = user.role === 'administrador' || user.role === 'dueno';
      setHasPermission(isAdmin);
      
      if (!isAdmin) {
        // Redirigir si no tiene permisos
        setTimeout(() => router.push('/'), 2000);
      }
    }
  }, [isLoading, isAuthenticated, user, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user || !hasPermission) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4">
          <div className="bg-card border border-border rounded-2xl shadow-lg p-8 max-w-md w-full text-center">
            <AlertCircle className="w-16 h-16 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Acceso Denegado</h2>
            <p className="text-muted-foreground mb-4">
              No tienes permisos para acceder al panel de administración.
            </p>
            <p className="text-sm text-muted-foreground">
              Serás redirigido al inicio...
            </p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case 'dueno':
        return 'Dueño';
      case 'administrador':
        return 'Administrador';
      case 'usuario':
        return 'Usuario';
      default:
        return 'Usuario';
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 py-6 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-2">
              <Settings className="w-8 h-8 text-primary" />
              <h1 className="text-2xl sm:text-3xl font-bold">Panel de Administración</h1>
            </div>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gestiona usuarios y productos • {getRoleName(user.role)}
            </p>
          </div>

          {/* Tabs */}
          <div className="bg-card border border-border rounded-2xl shadow-lg overflow-hidden">
            {/* Tab Headers */}
            <div className="border-b border-border">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors ${
                    activeTab === 'products'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary text-muted-foreground'
                  }`}
                >
                  <Package className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Productos</span>
                </button>
                <button
                  onClick={() => setActiveTab('users')}
                  className={`flex-1 flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-4 font-medium transition-colors ${
                    activeTab === 'users'
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-secondary text-muted-foreground'
                  }`}
                >
                  <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">Usuarios</span>
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6">
              {activeTab === 'products' && <ProductManagement userRole={user.role} />}
              {activeTab === 'users' && <UserManagement userRole={user.role} />}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
