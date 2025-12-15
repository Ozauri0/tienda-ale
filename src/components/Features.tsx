import Image from 'next/image';
import { Award, Sparkles, Heart } from 'lucide-react';

export default function Features() {
  return (
    <section id="colecciones" className="py-24 bg-secondary/50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="slide-in-left">
            <span className="text-sm font-semibold tracking-widest uppercase text-primary mb-4 block">Por qué elegirnos</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Calidad que marca la diferencia
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-8">
              Seleccionamos cada artículo pensando en ti. Calidad, diseño y funcionalidad se unen para crear productos que realmente importan.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4 p-4 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-xl shadow-md">
                    <Award className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Calidad Superior</h3>
                  <p className="text-muted-foreground">Cada artículo es seleccionado cuidadosamente para garantizar durabilidad, funcionalidad y estética excepcional.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-xl shadow-md">
                    <Sparkles className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Diseño Único</h3>
                  <p className="text-muted-foreground">Productos con personalidad que transforman espacios ordinarios en lugares extraordinarios.</p>
                </div>
              </div>
              
              <div className="flex gap-4 p-4 bg-card rounded-2xl border border-border hover:shadow-lg transition-all duration-300">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-primary text-primary-foreground flex items-center justify-center rounded-xl shadow-md">
                    <Heart className="w-6 h-6" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Experiencia Total</h3>
                  <p className="text-muted-foreground">Desde la compra hasta la entrega, cuidamos cada detalle para que tu experiencia sea memorable.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 slide-in-right">
            <div className="aspect-square bg-secondary overflow-hidden relative rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Image src="/images/feature-1.jpg" alt="Artesanía" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="aspect-square bg-secondary overflow-hidden relative mt-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Image src="/images/feature-2.jpg" alt="Materiales" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="aspect-square bg-secondary overflow-hidden relative -mt-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Image src="/images/feature-3.jpg" alt="Detalle" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
            <div className="aspect-square bg-secondary overflow-hidden relative rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
              <Image src="/images/feature-4.jpg" alt="Diseño" fill className="object-cover" sizes="(max-width: 768px) 50vw, 25vw" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
