'use client';

import { Building2, Mail, MessageSquare, User } from 'lucide-react';
import { useState } from 'react';

export default function Newsletter() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Funcionalidad pendiente - por ahora solo previene el envío
    console.log('Datos del formulario:', formData);
  };

  return (
    <section id="contacto" className="py-8 sm:py-12 md:py-16 lg:py-20 bg-secondary/30">
      <div className="container mx-auto px-3 sm:px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8 lg:mb-10 fade-in">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold mb-2 md:mb-3">Solicita una Cotización</h2>
            <p className="text-muted-foreground text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto px-2">
              Completa el formulario y nos pondremos en contacto contigo a la brevedad
            </p>
          </div>

          {/* Formulario */}
          <div className="bg-card border-2 border-border rounded-xl md:rounded-2xl lg:rounded-3xl p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 shadow-xl scale-in">
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4 md:space-y-5">
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5">
                <div className="space-y-1">
                  <label htmlFor="firstName" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base bg-background border-2 border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="lastName" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                    Apellido
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Tu apellido"
                    className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base bg-background border-2 border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    required
                  />
                </div>
              </div>

              {/* Empresa */}
              <div className="space-y-1">
                <label htmlFor="company" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  Institución / Empresa
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Nombre de tu jardín o kinder"
                  className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base bg-background border-2 border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="email" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="tu@email.com"
                  className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base bg-background border-2 border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Mensaje */}
              <div className="space-y-1">
                <label htmlFor="message" className="text-xs sm:text-sm font-medium flex items-center gap-1.5">
                  <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                  Mensaje
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Cuéntanos qué productos te interesan..."
                  rows={3}
                  className="w-full px-2.5 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 text-xs sm:text-sm md:text-base bg-background border-2 border-border rounded-lg sm:rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                  required
                />
              </div>

              {/* Botón de envío */}
              <div className="pt-1 sm:pt-2 md:pt-3">
                <button
                  type="submit"
                  className="w-full px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-3.5 text-xs sm:text-sm md:text-base bg-primary text-primary-foreground font-semibold rounded-full border-2 border-primary/30 hover:border-primary hover:shadow-2xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-1.5 sm:gap-2"
                >
                  <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" />
                  <span className="hidden sm:inline">Enviar Solicitud de Cotización</span>
                  <span className="sm:hidden">Enviar Cotización</span>
                </button>
              </div>

              {/* Nota */}
              <p className="text-center text-[10px] sm:text-xs md:text-sm text-muted-foreground pt-0.5 sm:pt-1">
                Respuesta en 24 horas hábiles
              </p>
            </form>
          </div>
          {/* Información adicional */}
          <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10 grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 md:gap-4 lg:gap-5 text-center">
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-card border border-border rounded-lg md:rounded-xl lg:rounded-2xl">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Mail className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">Respuesta Rápida</h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">En menos de 24 horas</p>
            </div>
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-card border border-border rounded-lg md:rounded-xl lg:rounded-2xl">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <Building2 className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">Asesoría Personalizada</h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Según tus necesidades</p>
            </div>
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-card border border-border rounded-lg md:rounded-xl lg:rounded-2xl">
              <div className="w-10 h-10 sm:w-11 sm:h-11 md:w-12 md:h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-2 sm:mb-3">
                <MessageSquare className="w-5 h-5 sm:w-5.5 sm:h-5.5 md:w-6 md:h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-0.5 sm:mb-1 text-xs sm:text-sm md:text-base">Sin Compromiso</h3>
              <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground">Cotización gratuita</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
