'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { User, IdCard, Mail, Save, ArrowLeft, Eye, EyeOff, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function PerfilPage() {
  const router = useRouter();
  const { user, token, isAuthenticated, isLoading, login } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    apellidoPaterno: '',
    apellidoMaterno: '',
    rut: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  // Cargar datos del usuario
  useEffect(() => {
    if (user) {
      setFormData({
        nombre: user.nombre,
        apellidoPaterno: user.apellidoPaterno,
        apellidoMaterno: user.apellidoMaterno || '',
        rut: user.rut,
        email: user.email,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
    setSuccess('');
  };

  const formatRUT = (value: string) => {
    const cleaned = value.replace(/[^0-9kK]/g, '');
    if (cleaned.length <= 1) return cleaned;
    const body = cleaned.slice(0, -1);
    const dv = cleaned.slice(-1);
    const formattedBody = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formattedBody}-${dv}`;
  };

  const handleRUTChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatRUT(e.target.value);
    setFormData({
      ...formData,
      rut: formatted,
    });
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');
    setSuccess('');

    // Validar contraseñas si se está intentando cambiar
    if (formData.newPassword || formData.confirmNewPassword) {
      if (!formData.currentPassword) {
        setError('Debes ingresar tu contraseña actual para cambiarla');
        setIsSaving(false);
        return;
      }

      if (formData.newPassword !== formData.confirmNewPassword) {
        setError('Las contraseñas nuevas no coinciden');
        setIsSaving(false);
        return;
      }

      if (formData.newPassword.length < 6) {
        setError('La nueva contraseña debe tener al menos 6 caracteres');
        setIsSaving(false);
        return;
      }
    }

    try {
      // Preparar datos a enviar
      const dataToSend: any = {
        nombre: formData.nombre,
        apellidoPaterno: formData.apellidoPaterno,
        apellidoMaterno: formData.apellidoMaterno,
        rut: formData.rut,
        email: formData.email,
      };

      // Solo incluir contraseñas si se están cambiando
      if (formData.newPassword) {
        dataToSend.currentPassword = formData.currentPassword;
        dataToSend.newPassword = formData.newPassword;
      }

      const response = await fetch(API_ENDPOINTS.PROFILE, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al actualizar perfil');
      }

      // Actualizar usuario en el contexto
      login(data.data.user, token!);

      setSuccess('Perfil actualizado correctamente');
      
      // Limpiar campos de contraseña
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    } catch (err: any) {
      setError(err.message || 'Error al actualizar perfil');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-6 sm:py-12">
        <div className="max-w-3xl mx-auto">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-3 sm:mb-4"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Mi Perfil</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Actualiza tu información personal
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-card border border-border rounded-2xl shadow-lg p-5 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              {/* Messages */}
              {error && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm">
                  {error}
                </div>
              )}
              
              {success && (
                <div className="bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400 rounded-xl p-4 text-sm">
                  {success}
                </div>
              )}

              {/* Información Personal */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Información Personal</h2>
                
                <div className="space-y-4">
                  {/* Nombre y Apellidos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                        Nombre <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          id="nombre"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="apellidoPaterno" className="block text-sm font-medium mb-2">
                        Apellido Paterno <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          id="apellidoPaterno"
                          name="apellidoPaterno"
                          value={formData.apellidoPaterno}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Apellido Materno */}
                  <div>
                    <label htmlFor="apellidoMaterno" className="block text-sm font-medium mb-2">
                      Apellido Materno
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type="text"
                        id="apellidoMaterno"
                        name="apellidoMaterno"
                        value={formData.apellidoMaterno}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base"
                      />
                    </div>
                  </div>

                  {/* RUT y Email */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="rut" className="block text-sm font-medium mb-2">
                        RUT <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <IdCard className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="text"
                          id="rut"
                          name="rut"
                          value={formData.rut}
                          onChange={handleRUTChange}
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Cambiar Contraseña */}
              <div className="pt-4 sm:pt-6 border-t border-border">
                <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Cambiar Contraseña</h2>
                <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                  Deja estos campos vacíos si no deseas cambiar tu contraseña
                </p>
                
                <div className="space-y-4">
                  {/* Contraseña Actual */}
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-2">
                      Contraseña Actual
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  {/* Nueva Contraseña */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                        Nueva Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="newPassword"
                          name="newPassword"
                          value={formData.newPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-12 py-2.5 sm:py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base"
                          minLength={6}
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="confirmNewPassword" className="block text-sm font-medium mb-2">
                        Confirmar Nueva Contraseña
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          id="confirmNewPassword"
                          name="confirmNewPassword"
                          value={formData.confirmNewPassword}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 sm:py-3 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all text-base"
                          minLength={6}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 sm:pt-6">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="w-full flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 sm:py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  <Save className="w-5 h-5" />
                  {isSaving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
