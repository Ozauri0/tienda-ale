import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User, { UserRole } from '../models/User';

// Cargar variables de entorno
dotenv.config();

const setOwner = async (email: string) => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    console.log(`\n🔍 Buscando usuario con email: ${email}`);
    
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error(`❌ Usuario no encontrado con email: ${email}`);
      process.exit(1);
    }
    
    console.log(`\n📋 Usuario encontrado:`);
    console.log(`   - Nombre: ${user.nombreCompleto}`);
    console.log(`   - Email: ${user.email}`);
    console.log(`   - RUT: ${user.rut}`);
    console.log(`   - Rol actual: ${user.role} (${getRoleName(user.role)})`);
    
    if (user.role === UserRole.DUENO) {
      console.log(`\n✅ El usuario ya tiene rol de Dueño`);
      process.exit(0);
    }
    
    // Actualizar rol a Dueño
    user.role = UserRole.DUENO;
    await user.save();
    
    console.log(`\n✅ Rol actualizado exitosamente a Dueño (${UserRole.DUENO})`);
    console.log(`\n🎉 ${user.nombreCompleto} ahora es Dueño del sistema\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al actualizar usuario:', error);
    process.exit(1);
  }
};

const getRoleName = (role: UserRole): string => {
  switch (role) {
    case UserRole.DUENO:
      return 'Dueño';
    case UserRole.ADMINISTRADOR:
      return 'Administrador';
    case UserRole.USUARIO:
      return 'Usuario';
    default:
      return 'Desconocido';
  }
};

// Ejecutar script
const email = process.argv[2] || 'christianferrer.dev@gmail.com';
setOwner(email);
