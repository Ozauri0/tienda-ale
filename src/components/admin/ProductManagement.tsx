'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Search, Plus, Edit, Trash2, RefreshCw, X, Save, Package } from 'lucide-react';

interface Product {
  _id: string;
  nombre: string;
  descripcion: string;
  sku: string;
  precio: number;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [error, setError] = useState('');
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    sku: '',
    precio: 0,
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
      stock: 0,
      imagen: '',
      categoria: '',
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'precio' || name === 'stock' ? parseFloat(value) || 0 : value,
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

        {/* Filtro de categoría */}
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="w-full sm:w-64 px-3 py-2 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="all">Todas las categorías</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            No se encontraron productos
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-secondary/30 border border-border rounded-xl p-4 hover:bg-secondary/50 transition-colors"
            >
              {/* Imagen */}
              <div className="w-full h-32 bg-secondary rounded-lg mb-3 flex items-center justify-center overflow-hidden">
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
                  <span className="font-semibold text-primary">${product.precio.toLocaleString()}</span>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl sm:text-2xl font-bold">
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </h2>
                <button
                  onClick={handleCloseModal}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Nombre */}
                <div>
                  <label htmlFor="nombre" className="block text-sm font-medium mb-2">
                    Nombre <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label htmlFor="descripcion" className="block text-sm font-medium mb-2">
                    Descripción <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base resize-none"
                    required
                  />
                </div>

                {/* SKU y Categoría */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="sku" className="block text-sm font-medium mb-2">
                      SKU <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="sku"
                      name="sku"
                      value={formData.sku}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base uppercase"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="categoria" className="block text-sm font-medium mb-2">
                      Categoría <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      id="categoria"
                      name="categoria"
                      value={formData.categoria}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      required
                    />
                  </div>
                </div>

                {/* Precio y Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="precio" className="block text-sm font-medium mb-2">
                      Precio <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      id="precio"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="stock" className="block text-sm font-medium mb-2">
                      Stock <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base"
                      required
                    />
                  </div>
                </div>

                {/* URL Imagen */}
                <div>
                  <label htmlFor="imagen" className="block text-sm font-medium mb-2">
                    URL de Imagen
                  </label>
                  <input
                    type="text"
                    id="imagen"
                    name="imagen"
                    value={formData.imagen}
                    onChange={handleChange}
                    placeholder="https://ejemplo.com/imagen.jpg"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-base"
                  />
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2.5 border border-border rounded-xl hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 text-sm font-medium"
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
