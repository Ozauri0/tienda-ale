import { Request, Response } from 'express';
import Product from '../models/Product';

/**
 * Obtener todos los productos
 */
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { categoria, search, isActive } = req.query;
    
    let filter: any = {};
    
    if (categoria) {
      filter.categoria = categoria;
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { descripcion: { $regex: search, $options: 'i' } },
        { sku: { $regex: search, $options: 'i' } },
      ];
    }
    
    const products = await Product.find(filter).sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: { products },
    });
  } catch (error: any) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener productos',
      details: error.message,
    });
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const product = await Product.findById(id);
    
    if (!product) {
      res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado',
      });
      return;
    }
    
    res.json({
      status: 'success',
      data: { product },
    });
  } catch (error: any) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener producto',
      details: error.message,
    });
  }
};

/**
 * Crear nuevo producto (Admin y Dueño)
 */
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { nombre, descripcion, sku, precio, precioOferta, stock, imagen, categoria } = req.body;
    
    console.log(`[CREATE_PRODUCT] Intento de creación - SKU: ${sku}, Usuario: ${req.user?.userId}`);
    
    // Verificar si el SKU ya existe
    const existingProduct = await Product.findOne({ sku });
    
    if (existingProduct) {
      console.log(`[CREATE_PRODUCT] ❌ SKU ya existe - SKU: ${sku}`);
      res.status(400).json({
        status: 'error',
        message: 'El SKU ya está en uso',
      });
      return;
    }
    
    const product = await Product.create({
      nombre,
      descripcion,
      sku,
      precio,
      precioOferta: precioOferta || undefined,
      stock: stock || 0,
      imagen,
      categoria,
    });
    
    const duration = Date.now() - startTime;
    console.log(`[CREATE_PRODUCT] ✅ Producto creado exitosamente - SKU: ${sku}, ID: ${product._id}, Duration: ${duration}ms`);
    
    res.status(201).json({
      status: 'success',
      message: 'Producto creado exitosamente',
      data: { product },
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[CREATE_PRODUCT] ❌ Error al crear producto - Duration: ${duration}ms`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al crear producto',
      details: error.message,
    });
  }
};

/**
 * Actualizar producto (Admin y Dueño)
 */
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    const { nombre, descripcion, sku, precio, precioOferta, stock, imagen, categoria, isActive } = req.body;
    
    console.log(`[UPDATE_PRODUCT] Intento de actualización - ID: ${id}, Usuario: ${req.user?.userId}`);
    
    const product = await Product.findById(id);
    
    if (!product) {
      console.log(`[UPDATE_PRODUCT] ❌ Producto no encontrado - ID: ${id}`);
      res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado',
      });
      return;
    }
    
    // Si se está cambiando el SKU, verificar que no exista
    if (sku && sku !== product.sku) {
      const existingSKU = await Product.findOne({ sku, _id: { $ne: id } });
      if (existingSKU) {
        console.log(`[UPDATE_PRODUCT] ❌ SKU ya en uso - SKU: ${sku}`);
        res.status(400).json({
          status: 'error',
          message: 'El SKU ya está en uso',
        });
        return;
      }
    }
    
    // Actualizar campos
    if (nombre) product.nombre = nombre;
    if (descripcion) product.descripcion = descripcion;
    if (sku) product.sku = sku;
    if (precio !== undefined) product.precio = precio;
    if (precioOferta !== undefined) product.precioOferta = precioOferta || undefined;
    if (stock !== undefined) product.stock = stock;
    if (imagen !== undefined) product.imagen = imagen;
    if (categoria) product.categoria = categoria;
    if (isActive !== undefined) product.isActive = isActive;
    
    await product.save();
    
    const duration = Date.now() - startTime;
    console.log(`[UPDATE_PRODUCT] ✅ Producto actualizado exitosamente - ID: ${id}, Duration: ${duration}ms`);
    
    res.json({
      status: 'success',
      message: 'Producto actualizado exitosamente',
      data: { product },
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[UPDATE_PRODUCT] ❌ Error al actualizar producto - Duration: ${duration}ms`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar producto',
      details: error.message,
    });
  }
};

/**
 * Cambiar visibilidad del producto (Admin y Dueño)
 */
export const toggleProductVisibility = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    
    console.log(`[TOGGLE_VISIBILITY] Intento de cambio de visibilidad - ID: ${id}, Usuario: ${req.user?.userId}`);
    
    const product = await Product.findById(id);
    
    if (!product) {
      console.log(`[TOGGLE_VISIBILITY] ❌ Producto no encontrado - ID: ${id}`);
      res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado',
      });
      return;
    }
    
    product.isActive = !product.isActive;
    await product.save();
    
    const duration = Date.now() - startTime;
    console.log(`[TOGGLE_VISIBILITY] ✅ Visibilidad cambiada - ID: ${id}, isActive: ${product.isActive}, Duration: ${duration}ms`);
    
    res.json({
      status: 'success',
      message: `Producto ${product.isActive ? 'visible' : 'oculto'} exitosamente`,
      data: { product },
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[TOGGLE_VISIBILITY] ❌ Error al cambiar visibilidad - Duration: ${duration}ms`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al cambiar visibilidad del producto',
      details: error.message,
    });
  }
};

/**
 * Eliminar producto (Admin y Dueño)
 */
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    
    console.log(`[DELETE_PRODUCT] Intento de eliminación - ID: ${id}, Usuario: ${req.user?.userId}`);
    
    const product = await Product.findByIdAndDelete(id);
    
    if (!product) {
      console.log(`[DELETE_PRODUCT] ❌ Producto no encontrado - ID: ${id}`);
      res.status(404).json({
        status: 'error',
        message: 'Producto no encontrado',
      });
      return;
    }
    
    const duration = Date.now() - startTime;
    console.log(`[DELETE_PRODUCT] ✅ Producto eliminado exitosamente - ID: ${id}, SKU: ${product.sku}, Duration: ${duration}ms`);
    
    res.json({
      status: 'success',
      message: 'Producto eliminado exitosamente',
      data: { product },
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[DELETE_PRODUCT] ❌ Error al eliminar producto - Duration: ${duration}ms`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar producto',
      details: error.message,
    });
  }
};
