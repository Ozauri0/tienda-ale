'use client';

import { FormEvent, useState } from 'react';
import { Mail, Send } from 'lucide-react';

export default function Newsletter() {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aquí iría la lógica para suscribir al newsletter
    console.log('Suscripción:', email);
    setEmail('');
  };

  return (
    <section id="contacto" className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
      {/* Elementos decorativos */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-foreground/10 border-2 border-primary-foreground/20 rounded-full mb-6 shadow-lg">
            <Mail className="w-8 h-8" />
          </div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Mantente Informado</h2>
          <p className="text-primary-foreground/80 text-lg mb-8">
            Recibe novedades, ofertas especiales para instituciones y recursos pedagógicos gratuitos
          </p>
          
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <input 
                type="email" 
                placeholder="tu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-6 py-4 bg-primary-foreground text-primary rounded-full border-2 border-primary-foreground/20 focus:outline-none focus:ring-4 focus:ring-primary-foreground/30 focus:border-primary-foreground/40 shadow-md transition-all"
                required
              />
            </div>
            <button 
              type="submit" 
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-foreground text-primary font-medium rounded-full border-2 border-primary-foreground/30 hover:scale-105 hover:shadow-2xl hover:border-primary-foreground/50 transition-all duration-300 shadow-lg"
            >
              Suscribirse
              <Send className="w-4 h-4" />
            </button>
          </form>
          
          <p className="text-sm text-primary-foreground/60 mt-6">
            Al suscribirte, aceptas recibir comunicaciones y material educativo gratuito
          </p>
        </div>
      </div>
    </section>
  );
}
