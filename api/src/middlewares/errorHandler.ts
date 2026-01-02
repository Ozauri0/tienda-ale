import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

/**
 * Middleware para manejar errores de validación
 */
export const handleValidationErrors = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      status: 'error',
      message: 'Errores de validación',
      errors: errors.array().map((error) => ({
        field: error.type === 'field' ? error.path : undefined,
        message: error.msg,
      })),
    });
    return;
  }

  next();
};
