import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import { generateToken } from '../utils/jwt';
import { validateRUT, cleanRUT } from '../utils/rutValidator';

/**
 * Registro de nuevo usuario
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      rut,
      email,
      password,
      role,
    } = req.body;

    // Validar RUT
    if (!validateRUT(rut)) {
      res.status(400).json({
        status: 'error',
        message: 'RUT inválido',
      });
      return;
    }

    // Limpiar y formatear RUT
    const cleanedRUT = cleanRUT(rut);

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({
      $or: [{ email }, { rut: cleanedRUT }],
    });

    if (existingUser) {
      res.status(400).json({
        status: 'error',
        message:
          existingUser.email === email
            ? 'El email ya está registrado'
            : 'El RUT ya está registrado',
      });
      return;
    }

    // Validar que solo un dueño pueda crear otros roles administrativos
    let assignedRole = UserRole.USUARIO;
    if (role && role !== UserRole.USUARIO) {
      // Si se intenta asignar un rol administrativo, verificar permisos
      if (req.user && req.user.role === UserRole.DUENO) {
        assignedRole = role;
      } else {
        res.status(403).json({
          status: 'error',
          message: 'No tienes permisos para asignar este rol',
        });
        return;
      }
    }

    // Crear usuario
    const user = new User({
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      rut: cleanedRUT,
      email,
      password,
      role: assignedRole,
    });

    await user.save();

    // Generar token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      status: 'success',
      message: 'Usuario registrado exitosamente',
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          apellidoPaterno: user.apellidoPaterno,
          apellidoMaterno: user.apellidoMaterno,
          nombreCompleto: user.nombreCompleto,
          rut: user.rut,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Error en registro:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al registrar usuario',
      details: error.message,
    });
  }
};

/**
 * Inicio de sesión
 */
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      res.status(400).json({
        status: 'error',
        message: 'Email y contraseña son requeridos',
      });
      return;
    }

    // Buscar usuario por email (incluir password)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas',
      });
      return;
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      res.status(401).json({
        status: 'error',
        message: 'Usuario inactivo',
      });
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas',
      });
      return;
    }

    // Generar token
    const token = generateToken({
      userId: user._id.toString(),
      email: user.email,
      role: user.role,
    });

    res.json({
      status: 'success',
      message: 'Inicio de sesión exitoso',
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          apellidoPaterno: user.apellidoPaterno,
          apellidoMaterno: user.apellidoMaterno,
          nombreCompleto: user.nombreCompleto,
          rut: user.rut,
          email: user.email,
          role: user.role,
        },
        token,
      },
    });
  } catch (error: any) {
    console.error('Error en login:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al iniciar sesión',
      details: error.message,
    });
  }
};

/**
 * Obtener perfil del usuario autenticado
 */
export const getProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado',
      });
      return;
    }

    const user = await User.findById(req.user.userId);

    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
      return;
    }

    res.json({
      status: 'success',
      data: {
        user: {
          id: user._id,
          nombre: user.nombre,
          apellidoPaterno: user.apellidoPaterno,
          apellidoMaterno: user.apellidoMaterno,
          nombreCompleto: user.nombreCompleto,
          rut: user.rut,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        },
      },
    });
  } catch (error: any) {
    console.error('Error al obtener perfil:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener perfil',
      details: error.message,
    });
  }
};
