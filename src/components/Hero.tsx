import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';

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
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full mb-6 fade-in">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Nueva Colección 2025</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 text-balance leading-tight tracking-tight slide-in-left">
            Transforma tu
            <span className="italic block text-primary">espacio ideal</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed slide-in-right">
            Encuentra artículos únicos y de calidad excepcional que reflejan tu personalidad y elevan cada rincón de tu hogar
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center scale-in">
            <Link href="#productos" className="group inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground font-medium rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300">
              Explorar Colección
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link href="#nosotros" className="inline-flex items-center justify-center px-8 py-4 border-2 border-border bg-card text-foreground font-medium rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105">
              Conoce Nuestra Historia
            </Link>
          </div>

          {/* Indicador de scroll */}
          <div className="mt-20 flex justify-center">
            <div className="animate-bounce">
              <div className="w-6 h-10 border-2 border-primary/30 rounded-full p-1">
                <div className="w-1 h-3 bg-primary rounded-full mx-auto animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
