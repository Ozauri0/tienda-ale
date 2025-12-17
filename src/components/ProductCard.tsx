'use client';

import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  badge?: string;
  category?: string;
  ageRange?: string;
  stock?: boolean;
}

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
  index?: number;
}

export default function ProductCard({ product, viewMode = 'grid', index = 0 }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  if (viewMode === 'list') {
    return (
      <div 
        className="product-card bg-card border border-border rounded-3xl overflow-hidden group cursor-pointer shadow-md hover:shadow-2xl flex flex-col md:flex-row"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Imagen */}
        <div className="md:w-64 aspect-square md:aspect-auto bg-secondary overflow-hidden relative flex-shrink-0">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 256px"
          />
          
          {product.badge && (
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
              {product.badge}
            </div>
          )}

          {!product.stock && (
            <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
              <span className="text-white font-semibold text-lg">Agotado</span>
            </div>
          )}
        </div>
        
        {/* Contenido */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-2xl font-semibold group-hover:text-primary transition-colors mb-2">
                  {product.name}
                </h3>
                {product.ageRange && (
                  <span className="inline-block px-3 py-1 bg-secondary text-xs rounded-full mb-2">
                    {product.ageRange}
                  </span>
                )}
              </div>
              <button 
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 hover:bg-secondary rounded-full transition-all"
                aria-label="Agregar a favoritos"
              >
                <Heart 
                  className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </button>
            </div>
            
            <p className="text-muted-foreground mb-4">{product.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-3xl font-bold text-primary">
              ${product.price.toLocaleString('es-CL')}
            </span>
            <div className="flex gap-2">
              <button 
                className="p-3 bg-secondary hover:bg-secondary/80 rounded-full transition-all hover:scale-110"
                aria-label="Vista rápida"
              >
                <Eye className="w-5 h-5" />
              </button>
              <button 
                disabled={!product.stock}
                className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <ShoppingCart className="w-4 h-4" />
                {product.stock ? 'Cotizar' : 'Agotado'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Vista de cuadrícula (grid)
  return (
    <div 
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
        {product.badge && (
          <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            {product.badge}
          </div>
        )}

        {/* Estado de stock */}
        {!product.stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Agotado</span>
          </div>
        )}

        {/* Acciones flotantes */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-2 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background shadow-lg hover:scale-110 transition-all"
            aria-label="Agregar a favoritos"
          >
            <Heart 
              className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
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
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {product.name}
          </h3>
          {product.ageRange && (
            <span className="inline-block px-2 py-1 bg-secondary text-xs rounded-full whitespace-nowrap flex-shrink-0">
              {product.ageRange}
            </span>
          )}
        </div>
        
        <p className="text-muted-foreground text-sm line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between pt-3">
          <span className="text-3xl font-bold text-primary">
            ${product.price.toLocaleString('es-CL')}
          </span>
          <button 
            disabled={!product.stock}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ShoppingCart className="w-4 h-4" />
            {product.stock ? 'Cotizar' : 'Agotado'}
          </button>
        </div>
      </div>
    </div>
  );
}
