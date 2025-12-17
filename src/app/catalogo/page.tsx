'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, Grid3x3, List } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Datos de productos expandidos
const allProducts = [
  {
    id: 1,
    name: 'Set Bloques Didácticos',
    description: 'Desarrollo psicomotriz y creatividad. Set de 100 piezas en madera natural.',
    price: 45990,
    image: '/images/product-1.jpg',
    badge: 'Nuevo',
    category: 'construccion',
    ageRange: '3-5 años',
    stock: true,
  },
  {
    id: 2,
    name: 'Kit de Ciencias Pre-escolar',
    description: 'Aprendizaje a través del juego. Incluye lupas, imanes y experimentos simples.',
    price: 67990,
    image: '/images/product-2.jpg',
    badge: 'Popular',
    category: 'ciencia',
    ageRange: '4-6 años',
    stock: true,
  },
  {
    id: 3,
    name: 'Mesa Sensorial Montessori',
    description: 'Estimulación sensorial completa. Incluye 5 compartimentos y accesorios.',
    price: 189990,
    image: '/images/product-3.jpg',
    badge: 'Destacado',
    category: 'montessori',
    ageRange: '2-5 años',
    stock: true,
  },
  {
    id: 4,
    name: 'Rompecabezas de Animales',
    description: 'Set de 6 rompecabezas progresivos con animales de granja y selva.',
    price: 29990,
    image: '/images/product-1.jpg',
    category: 'puzzles',
    ageRange: '3-5 años',
    stock: true,
  },
  {
    id: 5,
    name: 'Kit de Arte y Manualidades',
    description: 'Material completo para expresión artística: témperas, pinceles, papel y más.',
    price: 54990,
    image: '/images/product-2.jpg',
    badge: 'Oferta',
    category: 'arte',
    ageRange: '3-6 años',
    stock: true,
  },
  {
    id: 6,
    name: 'Juego de Números y Letras',
    description: 'Aprendizaje de lectoescritura y matemática básica de forma lúdica.',
    price: 38990,
    image: '/images/product-3.jpg',
    category: 'educativo',
    ageRange: '4-6 años',
    stock: true,
  },
  {
    id: 7,
    name: 'Instrumentos Musicales Infantiles',
    description: 'Set de 10 instrumentos de percusión para desarrollo musical temprano.',
    price: 72990,
    image: '/images/product-1.jpg',
    category: 'musica',
    ageRange: '2-5 años',
    stock: true,
  },
  {
    id: 8,
    name: 'Juego de Roles: Veterinaria',
    description: 'Kit completo para juego simbólico con maletín, instrumentos y peluches.',
    price: 49990,
    image: '/images/product-2.jpg',
    category: 'roles',
    ageRange: '3-6 años',
    stock: false,
  },
  {
    id: 9,
    name: 'Torre de Apilamiento Gigante',
    description: 'Bloques de foam suave para construcción y motricidad gruesa.',
    price: 159990,
    image: '/images/product-3.jpg',
    category: 'construccion',
    ageRange: '1-4 años',
    stock: true,
  },
];

const categories = [
  { id: 'todos', name: 'Todos' },
  { id: 'construccion', name: 'Construcción' },
  { id: 'ciencia', name: 'Ciencia' },
  { id: 'montessori', name: 'Montessori' },
  { id: 'puzzles', name: 'Puzzles' },
  { id: 'arte', name: 'Arte' },
  { id: 'educativo', name: 'Educativo' },
  { id: 'musica', name: 'Música' },
  { id: 'roles', name: 'Juego de Roles' },
];

export default function CatalogoPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todos');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Filtrar productos
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'todos' || product.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background pt-24 pb-16">
        <div className="container mx-auto px-4 lg:px-8">
        {/* Header del catálogo */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Catálogo de Productos</h1>
          <p className="text-muted-foreground text-lg">
            Explora nuestra selección completa de productos educativos y juguetes didácticos
          </p>
        </div>

        {/* Barra de búsqueda y filtros */}
        <div className="mb-8 space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-card border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-primary transition-all"
              />
            </div>

            {/* Botones de vista y filtros */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-6 py-3 border border-border rounded-full hover:bg-card transition-all ${showFilters ? 'bg-card' : ''}`}
              >
                <SlidersHorizontal className="w-5 h-5" />
                <span className="hidden sm:inline">Filtros</span>
              </button>

              {/* Toggle vista grid/list */}
              <div className="flex border border-border rounded-full overflow-hidden">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-3 transition-all ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}
                  aria-label="Vista de cuadrícula"
                >
                  <Grid3x3 className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-3 transition-all ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : 'bg-card hover:bg-muted'}`}
                  aria-label="Vista de lista"
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Panel de filtros */}
          {showFilters && (
            <div className="p-6 bg-card border border-border rounded-3xl animate-in fade-in slide-in-from-top-2 duration-300">
              <h3 className="text-lg font-semibold mb-4">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      selectedCategory === category.id
                        ? 'bg-primary text-primary-foreground shadow-lg'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Contador de resultados */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredProducts.length} {filteredProducts.length === 1 ? 'producto' : 'productos'} encontrados
          </p>
        </div>

        {/* Grid de productos */}
        {filteredProducts.length > 0 ? (
          <div className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
          }>
            {filteredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                viewMode={viewMode}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-muted-foreground text-lg mb-4">
              No se encontraron productos que coincidan con tu búsqueda
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('todos');
              }}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-full hover:shadow-lg transition-all"
            >
              Limpiar filtros
            </button>
          </div>
        )}
        </div>
      </div>
      <Footer />
    </>
  );
}
