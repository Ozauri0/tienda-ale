import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  toggleProductVisibility,
  deleteProduct,
} from '../controllers/productController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';
import { body } from 'express-validator';
import { handleValidationErrors } from '../middlewares/errorHandler';

const router = Router();

// Validaciones
const productValidation = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 200 })
    .withMessage('El nombre debe tener entre 2 y 200 caracteres'),
  
  body('descripcion')
    .trim()
    .notEmpty()
    .withMessage('La descripción es requerida')
    .isLength({ max: 2000 })
    .withMessage('La descripción no puede exceder 2000 caracteres'),
  
  body('sku')
    .trim()
    .notEmpty()
    .withMessage('El SKU es requerido'),
  
  body('precio')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser mayor o igual a 0'),
  
  body('stock')
    .optional()
    .isInt({ min: 0 })
    .withMessage('El stock debe ser mayor o igual a 0'),
  
  body('imagen')
    .optional()
    .trim(),
  
  body('categoria')
    .trim()
    .notEmpty()
    .withMessage('La categoría es requerida'),
];

/**
 * @route   GET /api/products
 * @desc    Obtener todos los productos
 * @access  Public
 */
router.get('/', getProducts);

/**
 * @route   GET /api/products/:id
 * @desc    Obtener producto por ID
 * @access  Public
 */
router.get('/:id', getProductById);

/**
 * @route   POST /api/products
 * @desc    Crear nuevo producto
 * @access  Protected (Admin y Dueño)
 */
router.post(
  '/',
  authenticate,
  authorize(UserRole.ADMINISTRADOR, UserRole.DUENO),
  productValidation,
  handleValidationErrors,
  createProduct
);

/**
 * @route   PUT /api/products/:id
 * @desc    Actualizar producto
 * @access  Protected (Admin y Dueño)
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMINISTRADOR, UserRole.DUENO),
  productValidation,
  handleValidationErrors,
  updateProduct
);

/**
 * @route   PATCH /api/products/:id/toggle-visibility
 * @desc    Alternar visibilidad del producto (ocultar/mostrar)
 * @access  Protected (Admin y Dueño)
 */
router.patch(
  '/:id/toggle-visibility',
  authenticate,
  authorize(UserRole.ADMINISTRADOR, UserRole.DUENO),
  toggleProductVisibility
);

/**
 * @route   DELETE /api/products/:id
 * @desc    Eliminar producto
 * @access  Protected (Admin y Dueño)
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMINISTRADOR, UserRole.DUENO),
  deleteProduct
);

export default router;
