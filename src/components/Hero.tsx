'use client';

import { ArrowRight, Sparkles } from 'lucide-react';
import { smoothScrollTo } from '@/lib/scroll';

export default function Hero() {
  return (
    <section id="inicio" className="pt-20 min-h-screen flex items-center justify-center bg-gradient-to-b from-secondary via-background to-background relative overflow-hidden">
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 py-20 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary border border-primary/20 rounded-full mb-6 fade-in shadow-md">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Catálogo Educativo 2025</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance leading-tight tracking-tight slide-in-left">
            Aprender jugando,
            <span className="italic block text-primary">crecer feliz</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed slide-in-right">
            Material didáctico y juguetes educativos certificados para jardines infantiles y kinder en todo Chile
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center scale-in">
            <button onClick={() => smoothScrollTo('productos')} className="group inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Ver Catálogo
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
            <button onClick={() => smoothScrollTo('contacto')} className="inline-flex items-center justify-center px-8 py-4 border-2 border-border bg-card text-foreground font-medium rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105">
              Solicitar Asesoría
            </button>
          </div>

          {/* Indicador de scroll */}
          <div className="mt-20 flex justify-center">
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-primary/40 shadow-sm rounded-full p-1 bg-background/50">
                <div className="w-1 h-3 bg-primary rounded-full mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
