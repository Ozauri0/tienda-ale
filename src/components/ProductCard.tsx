'use client';

import Image from 'next/image';
import { ShoppingCart, Heart, Eye } from 'lucide-react';
import { useState } from 'react';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
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
        className="product-card bg-card border border-border rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg flex flex-col md:flex-row"
        style={{ animationDelay: `${index * 50}ms` }}
      >
        {/* Imagen */}
        <div className="md:w-48 aspect-square md:aspect-auto bg-secondary overflow-hidden relative flex-shrink-0">
          <Image 
            src={product.image} 
            alt={product.name} 
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
            sizes="(max-width: 768px) 100vw, 256px"
          />
          
          {product.badge && (
            <div className="absolute top-4 left-4 bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
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
        <div className="p-4 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="text-lg font-semibold group-hover:text-primary transition-colors mb-1">
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
            
            <p className="text-muted-foreground text-sm line-clamp-2 mb-3">{product.description}</p>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-primary">
                ${product.price.toLocaleString('es-CL')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.originalPrice.toLocaleString('es-CL')}
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button 
                className="p-2 bg-secondary hover:bg-secondary/80 rounded-full transition-all hover:scale-110"
                aria-label="Vista rápida"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button 
                disabled={!product.stock}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
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
      className="product-card bg-card border border-border rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-lg transition-shadow duration-300"
      style={{ animationDelay: `${index * 100}ms` }}
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
          <div className="absolute top-2 left-2 bg-red-600 text-white px-2 py-1 rounded-full text-xs font-semibold shadow-md">
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
        <div className="absolute top-2 right-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button 
            onClick={() => setIsFavorite(!isFavorite)}
            className="p-1.5 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background shadow-md hover:scale-110 transition-all"
            aria-label="Agregar a favoritos"
          >
            <Heart 
              className={`w-4 h-4 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
            />
          </button>
          <button 
            className="p-1.5 bg-background/90 backdrop-blur-sm rounded-full hover:bg-background shadow-md hover:scale-110 transition-all"
            aria-label="Vista rápida"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Overlay con información */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-4 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </h3>
          {product.ageRange && (
            <span className="inline-block px-2 py-0.5 bg-secondary text-xs rounded-full whitespace-nowrap flex-shrink-0">
              {product.ageRange}
            </span>
          )}
        </div>
        
        <p className="text-muted-foreground text-xs line-clamp-2">{product.description}</p>
        
        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-bold text-primary">
              ${product.price.toLocaleString('es-CL')}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ${product.originalPrice.toLocaleString('es-CL')}
              </span>
            )}
          </div>
          <button 
            disabled={!product.stock}
            className="flex items-center gap-1.5 px-3 py-2 bg-primary text-primary-foreground text-xs font-medium rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{product.stock ? 'Cotizar' : 'Agotado'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
