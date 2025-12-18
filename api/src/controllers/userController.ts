import { Request, Response } from 'express';
import User, { UserRole } from '../models/User';

/**
 * Obtener todos los usuarios (Admin y Dueño)
 */
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const { role, isActive, search } = req.query;
    
    let filter: any = {};
    
    if (role) {
      filter.role = role as string;
    }
    
    if (isActive !== undefined) {
      filter.isActive = isActive === 'true';
    }
    
    if (search) {
      filter.$or = [
        { nombre: { $regex: search, $options: 'i' } },
        { apellidoPaterno: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { rut: { $regex: search, $options: 'i' } },
      ];
    }
    
    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 });
    
    res.json({
      status: 'success',
      data: { users },
    });
  } catch (error: any) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuarios',
      details: error.message,
    });
  }
};

/**
 * Obtener usuario por ID (Admin y Dueño)
 */
export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
      return;
    }
    
    res.json({
      status: 'success',
      data: { user },
    });
  } catch (error: any) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error al obtener usuario',
      details: error.message,
    });
  }
};

/**
 * Actualizar usuario (Admin y Dueño)
 */
export const updateUser = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    const { isActive, role } = req.body;
    
    console.log(`[UPDATE_USER] Intento de actualización - ID: ${id}, Usuario Admin: ${req.user?.userId}`);
    
    const user = await User.findById(id);
    
    if (!user) {
      console.log(`[UPDATE_USER] ❌ Usuario no encontrado - ID: ${id}`);
      res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
      return;
    }
    
    const currentUser = await User.findById(req.user?.userId);
    
    if (!currentUser) {
      res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado',
      });
      return;
    }
    
    // Verificar permisos para cambiar rol
    if (role !== undefined) {
      // Solo el Dueño puede cambiar roles
      if (currentUser.role !== UserRole.DUENO) {
        console.log(`[UPDATE_USER] ❌ Sin permisos para cambiar rol - Usuario: ${currentUser.email}`);
        res.status(403).json({
          status: 'error',
          message: 'Solo el Dueño puede cambiar roles de usuario',
        });
        return;
      }
      
      user.role = role;
    }
    
    // Actualizar estado activo
    if (isActive !== undefined) {
      user.isActive = isActive;
    }
    
    await user.save();
    
    const duration = Date.now() - startTime;
    console.log(`[UPDATE_USER] ✅ Usuario actualizado exitosamente - ID: ${id}, Duration: ${duration}ms`);
    
    const userResponse = user.toObject();
    delete (userResponse as any).password;
    
    res.json({
      status: 'success',
      message: 'Usuario actualizado exitosamente',
      data: { user: userResponse },
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[UPDATE_USER] ❌ Error al actualizar usuario - Duration: ${duration}ms`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al actualizar usuario',
      details: error.message,
    });
  }
};

/**
 * Eliminar usuario
 * - Dueño puede eliminar cualquier usuario
 * - Admin solo puede eliminar usuarios normales (no Admin ni Dueño)
 */
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
  const startTime = Date.now();
  
  try {
    const { id } = req.params;
    
    console.log(`[DELETE_USER] Intento de eliminación - ID: ${id}, Usuario Admin: ${req.user?.userId}`);
    
    // No permitir auto-eliminación
    if (req.user?.userId === id) {
      console.log(`[DELETE_USER] ❌ Intento de auto-eliminación - ID: ${id}`);
      res.status(400).json({
        status: 'error',
        message: 'No puedes eliminar tu propia cuenta',
      });
      return;
    }
    
    const userToDelete = await User.findById(id);
    
    if (!userToDelete) {
      console.log(`[DELETE_USER] ❌ Usuario no encontrado - ID: ${id}`);
      res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
      return;
    }
    
    const currentUser = await User.findById(req.user?.userId);
    
    if (!currentUser) {
      res.status(401).json({
        status: 'error',
        message: 'Usuario no autenticado',
      });
      return;
    }
    
    // Admin solo puede eliminar usuarios normales
    if (currentUser.role === UserRole.ADMINISTRADOR) {
      if (userToDelete.role !== UserRole.USUARIO) {
        console.log(`[DELETE_USER] ❌ Admin intentó eliminar ${userToDelete.role} - ID: ${id}`);
        res.status(403).json({
          status: 'error',
          message: 'Los Administradores solo pueden eliminar usuarios normales',
        });
        return;
      }
    }
    
    await User.findByIdAndDelete(id);
    
    const duration = Date.now() - startTime;
    console.log(`[DELETE_USER] ✅ Usuario eliminado exitosamente - ID: ${id}, Email: ${userToDelete.email}, Duration: ${duration}ms`);
    
    res.json({
      status: 'success',
      message: 'Usuario eliminado exitosamente',
    });
  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`[DELETE_USER] ❌ Error al eliminar usuario - Duration: ${duration}ms`, error);
    res.status(500).json({
      status: 'error',
      message: 'Error al eliminar usuario',
      details: error.message,
    });
  }
};
