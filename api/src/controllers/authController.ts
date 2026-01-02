import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';
import { generateToken } from '../utils/jwt';
import { validateRUT, cleanRUT } from '../utils/rutValidator';

/**
 * Registro de nuevo usuario
 */
export const register = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  const { email, rut } = req.body;

  try {
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      password,
      role,
    } = req.body;

    console.log(`[REGISTER] Intento de registro - Email: ${email}, RUT: ${rut}`);

    // Validar RUT
    if (!validateRUT(rut)) {
      console.log(`[REGISTER] ❌ RUT inválido - RUT: ${rut}, Email: ${email}`);
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
      const reason = existingUser.email === email ? 'Email ya registrado' : 'RUT ya registrado';
      console.log(`[REGISTER] ❌ Usuario ya existe - ${reason}, Email: ${email}, RUT: ${cleanedRUT}`);
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
        console.log(`[REGISTER] ℹ️  Rol administrativo asignado por dueño - Role: ${role}, Admin: ${req.user.email}`);
      } else {
        console.log(`[REGISTER] ❌ Intento de asignar rol sin permisos - Role solicitado: ${role}, Email: ${email}`);
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

    const duration = Date.now() - startTime;
    console.log(`[REGISTER] ✅ Usuario registrado exitosamente - Email: ${email}, ID: ${user._id}, Role: ${assignedRole}, Duración: ${duration}ms`);

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
    const duration = Date.now() - startTime;
    console.error(`[REGISTER] ❌ Error en registro - Email: ${email}, RUT: ${rut}, Error: ${error.message}, Duración: ${duration}ms`);
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
  const startTime = Date.now();
  const { email } = req.body;

  try {
    const { password } = req.body;

    console.log(`[LOGIN] Intento de inicio de sesión - Email: ${email}`);

    // Validar campos
    if (!email || !password) {
      console.log(`[LOGIN] ❌ Campos faltantes - Email: ${email}`);
      res.status(400).json({
        status: 'error',
        message: 'Email y contraseña son requeridos',
      });
      return;
    }

    // Buscar usuario por email (incluir password)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      console.log(`[LOGIN] ❌ Usuario no encontrado - Email: ${email}`);
      res.status(401).json({
        status: 'error',
        message: 'Credenciales inválidas',
      });
      return;
    }

    // Verificar si el usuario está activo
    if (!user.isActive) {
      console.log(`[LOGIN] ❌ Usuario inactivo - Email: ${email}, ID: ${user._id}`);
      res.status(401).json({
        status: 'error',
        message: 'Usuario inactivo',
      });
      return;
    }

    // Verificar contraseña
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      console.log(`[LOGIN] ❌ Contraseña incorrecta - Email: ${email}, ID: ${user._id}`);
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

    const duration = Date.now() - startTime;
    console.log(`[LOGIN] ✅ Inicio de sesión exitoso - Email: ${email}, ID: ${user._id}, Role: ${user.role}, Duración: ${duration}ms`);

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
    const duration = Date.now() - startTime;
    console.error(`[LOGIN] ❌ Error en login - Email: ${email}, Error: ${error.message}, Duración: ${duration}ms`);
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

/**
 * Actualizar perfil del usuario
 */
export const updateProfile = async (
  req: Request,
  res: Response
): Promise<void> => {
  const startTime = Date.now();
  
  try {
    if (!req.user) {
      res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado',
      });
      return;
    }

    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      rut,
      email,
      currentPassword,
      newPassword,
    } = req.body;

    console.log(`[UPDATE_PROFILE] Intento de actualización - Usuario ID: ${req.user.userId}, Email: ${email}`);

    const user = await User.findById(req.user.userId);

    if (!user) {
      console.log(`[UPDATE_PROFILE] ❌ Usuario no encontrado - ID: ${req.user.userId}`);
      res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
      return;
    }

    // Validar RUT si está siendo modificado
    if (rut && rut !== user.rut) {
      if (!validateRUT(rut)) {
        console.log(`[UPDATE_PROFILE] ❌ RUT inválido - RUT: ${rut}, Usuario: ${user.email}`);
        res.status(400).json({
          status: 'error',
          message: 'RUT inválido',
        });
        return;
      }

      const cleanedRUT = cleanRUT(rut);
      
      // Verificar si el RUT ya está en uso por otro usuario
      const existingRUT = await User.findOne({ rut: cleanedRUT, _id: { $ne: user._id } });
      if (existingRUT) {
        console.log(`[UPDATE_PROFILE] ❌ RUT ya en uso - RUT: ${cleanedRUT}`);
        res.status(400).json({
          status: 'error',
          message: 'El RUT ya está registrado',
        });
        return;
      }

      user.rut = cleanedRUT;
    }

    // Verificar si el email ya está en uso por otro usuario
    if (email && email !== user.email) {
      const existingEmail = await User.findOne({ email, _id: { $ne: user._id } });
      if (existingEmail) {
        console.log(`[UPDATE_PROFILE] ❌ Email ya en uso - Email: ${email}`);
        res.status(400).json({
          status: 'error',
          message: 'El email ya está registrado',
        });
        return;
      }
      user.email = email;
    }

    // Actualizar campos básicos
    if (nombre) user.nombre = nombre;
    if (apellidoPaterno) user.apellidoPaterno = apellidoPaterno;
    user.apellidoMaterno = apellidoMaterno || '';

    // Cambiar contraseña si se proporciona
    if (newPassword) {
      if (!currentPassword) {
        console.log(`[UPDATE_PROFILE] ❌ Contraseña actual no proporcionada - Usuario: ${user.email}`);
        res.status(400).json({
          status: 'error',
          message: 'Debes proporcionar tu contraseña actual',
        });
        return;
      }

      // Verificar contraseña actual
      const isPasswordValid = await user.comparePassword(currentPassword);
      if (!isPasswordValid) {
        console.log(`[UPDATE_PROFILE] ❌ Contraseña actual incorrecta - Usuario: ${user.email}`);
        res.status(400).json({
          status: 'error',
          message: 'Contraseña actual incorrecta',
        });
        return;
      }

      user.password = newPassword; // Se hasheará automáticamente por el pre-save hook
      console.log(`[UPDATE_PROFILE] Contraseña actualizada - Usuario: ${user.email}`);
    }

    // Guardar cambios
    await user.save();

    const duration = Date.now() - startTime;
    console.log(`[UPDATE_PROFILE] ✅ Perfil actualizado exitosamente - Usuario: ${user.email}, Duration: ${duration}ms`);

    res.json({
      status: 'success',
      message: 'Perfil actualizado correctamente',
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
    const duration = Date.now() - startTime;
    console.error(`[UPDATE_PROFILE] ❌ Error al actualizar perfil - Duration: ${duration}ms`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar perfil',
      details: error.message,
    });
  }
};
