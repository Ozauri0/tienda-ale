import { Router } from 'express';
import { register, login, getProfile, updateProfile } from '../controllers/authController';
import { authenticate } from '../middlewares/auth';
import {
  registerValidation,
  loginValidation,
  updateProfileValidation,
} from '../middlewares/validators';
import { handleValidationErrors } from '../middlewares/errorHandler';

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Registrar nuevo usuario
 * @access  Public (o Protected para roles administrativos)
 */
router.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  register
);

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', loginValidation, handleValidationErrors, login);

/**
 * @route   GET /api/auth/me
 * @desc    Obtener perfil del usuario autenticado
 * @access  Protected
 */
router.get('/me', authenticate, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Actualizar perfil del usuario autenticado
 * @access  Protected
 */
router.put(
  '/profile',
  authenticate,
  updateProfileValidation,
  handleValidationErrors,
  updateProfile
);

export default router;
