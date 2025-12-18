import { Router } from 'express';
import {
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticate, authorize } from '../middlewares/auth';
import { UserRole } from '../models/User';

const router = Router();

/**
 * @route   GET /api/users
 * @desc    Obtener todos los usuarios
 * @access  Protected (Admin y Dueño)
 */
router.get(
  '/',
  authenticate,
  authorize(UserRole.ADMINISTRADOR, UserRole.DUENO),
  getUsers
);

/**
 * @route   GET /api/users/:id
 * @desc    Obtener usuario por ID
 * @access  Protected (Admin y Dueño)
 */
router.get(
  '/:id',
  authenticate,
  authorize(UserRole.ADMINISTRADOR, UserRole.DUENO),
  getUserById
);

/**
 * @route   PUT /api/users/:id
 * @desc    Actualizar usuario (rol, estado)
 * @access  Protected (Admin y Dueño)
 */
router.put(
  '/:id',
  authenticate,
  authorize(UserRole.ADMINISTRADOR, UserRole.DUENO),
  updateUser
);

/**
 * @route   DELETE /api/users/:id
 * @desc    Eliminar usuario
 * @access  Protected (Admin puede eliminar Usuarios, Dueño puede eliminar todos)
 */
router.delete(
  '/:id',
  authenticate,
  authorize(UserRole.ADMINISTRADOR, UserRole.DUENO),
  deleteUser
);

export default router;
