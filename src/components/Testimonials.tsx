import { Star } from 'lucide-react';

const testimonials = [
  {
    id: 1,
    name: 'Patricia Muñoz',
    role: 'Directora Jardín Infantil Los Aromos',
    content: 'Los materiales son de excelente calidad y los niños están fascinados. El impacto en el desarrollo de habilidades ha sido notable.',
  },
  {
    id: 2,
    name: 'Roberto Silva',
    role: 'Coordinador Educativo Kinder San José',
    content: 'Llevamos 3 años trabajando con ellos. La asesoría pedagógica y la calidad de los productos superan nuestras expectativas.',
  },
  {
    id: 3,
    name: 'Carmen Loyola',
    role: 'Educadora de Párvulos',
    content: 'Finalmente encontré material didáctico que combina diversión con aprendizaje real. Los niños aprenden jugando de forma natural.',
  },
];

export default function Testimonials() {
  return (
    <section id="nosotros" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Lo Que Dicen Nuestros Clientes</h2>
          <p className="text-muted-foreground text-lg">La satisfacción de nuestros clientes es nuestra mejor carta de presentación</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="bg-card p-8 border border-border rounded-3xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-105 scale-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-primary fill-primary" />
                ))}
              </div>
              <p className="text-foreground mb-6 italic leading-relaxed">
                &quot;{testimonial.content}&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/15 border-2 border-primary/30 rounded-full flex items-center justify-center font-bold text-primary">
                  {testimonial.name.charAt(0)}
                </div>
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
