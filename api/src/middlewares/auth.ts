import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import User, { UserRole } from '../models/User';

// Extender la interfaz Request para incluir el usuario
declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        email: string;
        role: UserRole;
      };
    }
  }
}

/**
 * Middleware para verificar que el usuario esté autenticado
 */
export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({
        status: 'error',
        message: 'No se proporcionó token de autenticación',
      });
      return;
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar y decodificar el token
    const decoded = verifyToken(token);

    // Verificar que el usuario existe y está activo
    const user = await User.findById(decoded.userId);

    if (!user || !user.isActive) {
      res.status(401).json({
        status: 'error',
        message: 'Usuario no autorizado',
      });
      return;
    }

    // Agregar información del usuario al request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();
  } catch (error) {
    res.status(401).json({
      status: 'error',
      message: 'Token inválido o expirado',
    });
  }
};

/**
 * Middleware para verificar que el usuario tenga un rol específico o superior
 */
export const authorize = (...allowedRoles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({
          status: 'error',
          message: 'Usuario no autenticado',
        });
        return;
      }

      // Obtener el usuario completo para verificar jerarquía
      const user = await User.findById(req.user.userId);

      if (!user) {
        res.status(401).json({
          status: 'error',
          message: 'Usuario no encontrado',
        });
        return;
      }

      // Verificar si el usuario tiene alguno de los roles permitidos o superior
      const hasPermission = allowedRoles.some((role) =>
        user.hasRoleOrHigher(role)
      );

      if (!hasPermission) {
        res.status(403).json({
          status: 'error',
          message: 'No tienes permisos para realizar esta acción',
        });
        return;
      }

      next();
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error al verificar permisos',
      });
    }
  };
};
