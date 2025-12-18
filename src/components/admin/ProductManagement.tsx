'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { Search, Plus, Edit, Trash2, RefreshCw, X, Save, Package, Eye, EyeOff, Grid3x3, List } from 'lucide-react';

interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  sku: string;
  precio: number;
  precioOferta?: number;
  stock: number;
  imagen?: string;
  categoria: string;
  isActive: boolean;
  createdAt: string;
}

interface ProductManagementProps {
  userRole: string;
}

export default function ProductManagement({ userRole }: ProductManagementProps) {
  const { token } = useAuth();
  const { theme, resolvedTheme } = useTheme();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [error, setError] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Determinar si estamos en modo oscuro
  const isDark = resolvedTheme === 'dark' || theme === 'dark';
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    sku: '',
    precio: 0,
    precioOferta: 0,
    stock: 0,
    imagen: '',
    categoria: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [search, categoryFilter, products]);

  const fetchProducts = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('http://localhost:3001/api/products');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al obtener productos');
      }

      setProducts(data.data.products);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];

    if (search) {
      filtered = filtered.filter(product =>
        product.nombre.toLowerCase().includes(search.toLowerCase()) ||
        product.sku.toLowerCase().includes(search.toLowerCase()) ||
        product.descripcion.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(product => product.categoria === categoryFilter);
    }

    setFilteredProducts(filtered);
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        nombre: product.nombre,
        descripcion: product.descripcion,
        sku: product.sku,
        precio: product.precio,
        precioOferta: product.precioOferta || 0,
        stock: product.stock,
        imagen: product.imagen || '',
        categoria: product.categoria,
      });
    } else {
      setEditingProduct(null);
      setFormData({
        nombre: '',
        descripcion: '',
        sku: '',
        precio: 0,
        precioOferta: 0,
        stock: 0,
        imagen: '',
        categoria: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
    setFormData({
      nombre: '',
      descripcion: '',
      sku: '',
      precio: 0,
      precioOferta: 0,
      stock: 0,
      imagen: '',
      categoria: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'precio' || name === 'precioOferta' || name === 'stock' ? parseFloat(value) || 0 : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError('');

    try {
      const url = editingProduct
        ? `http://localhost:3001/api/products/${editingProduct._id}`
        : 'http://localhost:3001/api/products';
      
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchProducts();
      handleCloseModal();
    } catch (err: any) {
      setError(err.message || 'Error al guardar producto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${productName}"?`)) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Error al eliminar producto');
    }
  };

  const handleToggleVisibility = async (productId: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/products/${productId}/toggle-visibility`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      await fetchProducts();
    } catch (err: any) {
      alert(err.message || 'Error al cambiar visibilidad del producto');
    }
  };

  const categories = Array.from(new Set(products.map(p => p.categoria)));

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header con búsqueda y botones */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar por nombre, SKU o descripción..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 sm:py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
            />
          </div>

          <button
            onClick={fetchProducts}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-secondary border border-border rounded-xl hover:bg-secondary/80 transition-colors text-sm font-medium"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Refrescar</span>
          </button>

          <button
            onClick={() => handleOpenModal()}
            className="flex items-center justify-center gap-2 px-4 py-2 sm:py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors text-sm font-medium"
          >
            <Plus className="w-4 h-4" />
            Nuevo Producto
          </button>
        </div>

        {/* Filtro de categoría y vista */}
        <div className="flex flex-col sm:flex-row gap-3">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="flex-1 sm:w-64 px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
          >
            <option value="all">Todas las categorías</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          {/* Toggle de vista */}
          <div className="flex gap-2 bg-secondary/50 rounded-xl p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                viewMode === 'grid' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary'
              }`}
            >
              <Grid3x3 className="w-4 h-4" />
              <span className="hidden sm:inline">Cuadrícula</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                viewMode === 'list' 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-secondary'
              }`}
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">Lista</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive rounded-xl p-4 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-secondary/50 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Total</p>
          <p className="text-xl sm:text-2xl font-bold">{products.length}</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Activos</p>
          <p className="text-xl sm:text-2xl font-bold">{products.filter(p => p.isActive).length}</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Stock Bajo</p>
          <p className="text-xl sm:text-2xl font-bold">{products.filter(p => p.stock < 10).length}</p>
        </div>
        <div className="bg-secondary/50 rounded-xl p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-muted-foreground mb-1">Categorías</p>
          <p className="text-xl sm:text-2xl font-bold">{categories.length}</p>
        </div>
      </div>

      {/* Lista de productos */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No se encontraron productos
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`bg-secondary/30 border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors relative ${!product.isActive ? 'opacity-50' : ''}`}
              >
                {!product.isActive && (
                  <div className="absolute top-2 right-2 bg-yellow-600/90 text-white text-xs font-semibold px-2 py-1 rounded-lg z-10">
                    OCULTO
                  </div>
                )}
                {/* Imagen */}
                <div className="w-full h-32 bg-secondary rounded-lg mb-3 flex items-center justify-center overflow-hidden relative">
                  {product.precioOferta && product.precioOferta > 0 && product.precioOferta < product.precio && (
                    <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                      -{Math.round(((product.precio - product.precioOferta) / product.precio) * 100)}% OFERTA
                    </div>
                  )}
                  {product.imagen ? (
                    <img src={product.imagen} alt={product.nombre} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-12 h-12 text-muted-foreground" />
                  )}
                </div>

                {/* Info */}
                <div className="space-y-2">
                  <div>
                    <h3 className="font-semibold truncate">{product.nombre}</h3>
                    <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{product.descripcion}</p>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex flex-col">
                      {product.precioOferta && product.precioOferta > 0 && product.precioOferta < product.precio ? (
                        <>
                          <span className="font-semibold text-primary">${product.precioOferta.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground line-through">${product.precio.toLocaleString()}</span>
                        </>
                      ) : (
                        <span className="font-semibold text-primary">${product.precio.toLocaleString()}</span>
                      )}
                    </div>
                    <span className={`${product.stock < 10 ? 'text-destructive' : 'text-muted-foreground'}`}>
                      Stock: {product.stock}
                    </span>
                  </div>

                  <div className="text-xs text-muted-foreground">
                    {product.categoria}
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleToggleVisibility(product._id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                      title={product.isActive ? 'Ocultar producto' : 'Mostrar producto'}
                    >
                      {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product._id, product.nombre)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              No se encontraron productos
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product._id}
                className={`bg-secondary/30 border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors ${!product.isActive ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  {/* Estado e info principal */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-5 gap-3 items-center">
                    <div className="sm:col-span-2">
                      <div className="flex items-center gap-2">
                        {!product.isActive && (
                          <span className="bg-yellow-600/90 text-white text-xs font-semibold px-2 py-0.5 rounded">
                            OCULTO
                          </span>
                        )}
                        {product.precioOferta && product.precioOferta > 0 && product.precioOferta < product.precio && (
                          <span className="bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">
                            -{Math.round(((product.precio - product.precioOferta) / product.precio) * 100)}%
                          </span>
                        )}
                      </div>
                      <h3 className="font-semibold">{product.nombre}</h3>
                      <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>
                    </div>

                    <div className="text-sm text-muted-foreground">
                      {product.categoria}
                    </div>

                    <div className="text-sm">
                      {product.precioOferta && product.precioOferta > 0 && product.precioOferta < product.precio ? (
                        <div className="flex flex-col">
                          <span className="font-semibold text-primary">${product.precioOferta.toLocaleString()}</span>
                          <span className="text-xs text-muted-foreground line-through">${product.precio.toLocaleString()}</span>
                        </div>
                      ) : (
                        <span className="font-semibold text-primary">${product.precio.toLocaleString()}</span>
                      )}
                    </div>

                    <div className={`text-sm ${product.stock < 10 ? 'text-destructive font-semibold' : 'text-muted-foreground'}`}>
                      Stock: {product.stock}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleVisibility(product._id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                      title={product.isActive ? 'Ocultar producto' : 'Mostrar producto'}
                    >
                      {product.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-background border border-border rounded-lg hover:bg-secondary transition-colors text-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(product._id, product.nombre)}
                      className="flex items-center justify-center gap-2 px-3 py-2 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg hover:bg-destructive/20 transition-colors text-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ backgroundColor: isDark ? 'rgba(0,0,0,0.8)' : 'rgba(0,0,0,0.6)' }}>
          <div className="rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto border" style={{ 
            backgroundColor: isDark ? '#0a0a0a' : '#ffffff',
            color: isDark ? '#ededed' : '#111827',
            borderColor: isDark ? '#262626' : '#e5e7eb'
          }}>
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold" style={{ color: isDark ? '#ffffff' : '#111827' }}>
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: isDark ? '#9ca3af' : '#6b7280' }}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Nombre <span style={{ color: isDark ? '#f87171' : '#dc2626' }}>*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    style={{
                      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                      borderColor: isDark ? '#374151' : '#d1d5db',
                      color: isDark ? '#ffffff' : '#111827'
                    }}
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    Descripción <span style={{ color: isDark ? '#f87171' : '#dc2626' }}>*</span>
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base resize-none"
                    style={{
                      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                      borderColor: isDark ? '#374151' : '#d1d5db',
                      color: isDark ? '#ffffff' : '#111827'
                    }}
                    required
                  />
                </div>

                {/* SKU y Categoría */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                      SKU <span style={{ color: isDark ? '#f87171' : '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base uppercase"
                      style={{
                        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                        color: isDark ? '#ffffff' : '#111827'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="categoria" className="block text-sm font-medium mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                      Categoría <span style={{ color: isDark ? '#f87171' : '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      id="categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      style={{
                        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                        color: isDark ? '#ffffff' : '#111827'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* Precio, Precio Oferta y Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="precio" className="block text-sm font-medium mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                      Precio <span style={{ color: isDark ? '#f87171' : '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      id="precio"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      style={{
                        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                        color: isDark ? '#ffffff' : '#111827'
                      }}
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="precioOferta" className="block text-sm font-medium mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                      Precio Oferta
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      id="precioOferta"
                      name="precioOferta"
                      value={formData.precioOferta || ''}
                      onChange={handleChange}
                      placeholder="Opcional"
                      className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      style={{
                        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                        color: isDark ? '#ffffff' : '#111827'
                      }}
                    />
                    {formData.precioOferta > 0 && formData.precio > 0 && (
                      <p className="text-xs mt-1" style={{ color: isDark ? '#10b981' : '#059669' }}>
                        {Math.round(((formData.precio - formData.precioOferta) / formData.precio) * 100)}% de descuento
                      </p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                      Stock <span style={{ color: isDark ? '#f87171' : '#dc2626' }}>*</span>
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                      style={{
                        backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                        borderColor: isDark ? '#374151' : '#d1d5db',
                        color: isDark ? '#ffffff' : '#111827'
                      }}
                      required
                    />
                  </div>
                </div>

                {/* URL Imagen */}
                <div>
                  <label htmlFor="imagen" className="block text-sm font-medium mb-2" style={{ color: isDark ? '#d1d5db' : '#374151' }}>
                    URL de Imagen
                  </label>
                  <input
                    type="text"
                    id="imagen"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
                    style={{
                      backgroundColor: isDark ? '#1f2937' : '#f9fafb',
                      borderColor: isDark ? '#374151' : '#d1d5db',
                      color: isDark ? '#ffffff' : '#111827'
                    }}
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 border rounded-xl transition-colors text-sm font-medium"
                    style={{
                      borderColor: isDark ? '#374151' : '#d1d5db',
                      color: isDark ? '#d1d5db' : '#374151',
                      backgroundColor: isDark ? 'transparent' : '#ffffff'
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50 text-sm font-medium"
                    style={{
                      backgroundColor: isDark ? '#ffffff' : '#111827',
                      color: isDark ? '#111827' : '#ffffff'
                    }}
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Guardando...' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
