'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useState } from 'react';

const products = [
  {
    id: 1,
    name: 'Set de Velas Aromáticas',
    description: 'Aromas naturales premium',
    price: 89,
    image: '/images/product-1.jpg',
    badge: 'Nuevo',
  },
  {
    id: 2,
    name: 'Jarrón Decorativo',
    description: 'Cerámica artesanal única',
    price: 156,
    image: '/images/product-2.jpg',
    badge: 'Popular',
  },
  {
    id: 3,
    name: 'Set de Difusores',
    description: 'Fragancias exclusivas',
    price: 124,
    image: '/images/product-3.jpg',
    badge: 'Exclusivo',
  },
];

export default function FeaturedProducts() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  return (
    <section id="productos" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 fade-in">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Productos Destacados</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Descubre artículos únicos cuidadosamente seleccionados para elevar tu espacio
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="product-card bg-card border border-border rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="aspect-square bg-secondary overflow-hidden relative">
                <Image 
                  src={product.image} 
                  alt={product.name} 
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                
                {/* Badge */}
                <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                  {product.badge}
                </div>

                {/* Acciones flotantes */}
                <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
                  <button 
                    onClick={() => toggleFavorite(product.id)}
                    className="p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background shadow-lg hover:scale-110 transition-all"
                    aria-label="Agregar a favoritos"
                  >
                    <Heart 
                      className={`w-5 h-5 ${favorites.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                    />
                  </button>
                  <button 
                    className="p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background shadow-lg hover:scale-110 transition-all"
                    aria-label="Vista rápida"
                  >
                    <Eye className="w-5 h-5" />
                  </button>
                </div>

                {/* Overlay con información */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>
              
              <div className="p-6 space-y-3">
                <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">{product.name}</h3>
                <p className="text-muted-foreground text-sm">{product.description}</p>
                <div className="flex items-center justify-between pt-3">
                  <span className="text-3xl font-bold text-primary">
                    ${product.price}
                  </span>
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300">
                    <ShoppingCart className="w-4 h-4" />
                    Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12 fade-in">
          <Link href="#" className="inline-flex items-center justify-center px-8 py-3 border-2 border-border bg-card text-foreground font-medium rounded-full hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 hover:scale-105 shadow-md hover:shadow-xl">
            Ver Toda la Colección
          </Link>
        </div>
      </div>
    </section>
  );
}
