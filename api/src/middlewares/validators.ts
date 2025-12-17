import { body } from 'express-validator';

export const registerValidation = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),

  body('apellidoPaterno')
    .trim()
    .notEmpty()
    .withMessage('El apellido paterno es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El apellido paterno debe tener entre 2 y 50 caracteres'),

  body('apellidoMaterno')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('El apellido materno no puede exceder 50 caracteres'),

  body('rut')
    .trim()
    .notEmpty()
    .withMessage('El RUT es requerido'),

  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
];

export const loginValidation = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('El email es requerido')
    .isEmail()
    .withMessage('Email inválido')
    .normalizeEmail(),

  body('password')
    .notEmpty()
    .withMessage('La contraseña es requerida'),
];
