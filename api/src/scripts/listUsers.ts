import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB } from '../config/database';
import User from '../models/User';

// Cargar variables de entorno
dotenv.config();

const listUsers = async () => {
  try {
    // Conectar a la base de datos
    await connectDB();
    
    console.log('\n📋 Lista de usuarios registrados:\n');
    
    const users = await User.find().select('-password');
    
    if (users.length === 0) {
      console.log('❌ No hay usuarios registrados en la base de datos\n');
      process.exit(0);
    }
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.nombreCompleto}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - RUT: ${user.rut}`);
      console.log(`   - Rol: ${getRoleName(user.role)}`);
      console.log(`   - Estado: ${user.isActive ? '✅ Activo' : '❌ Inactivo'}`);
      console.log('');
    });
    
    console.log(`Total: ${users.length} usuario(s)\n`);
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error al listar usuarios:', error);
    process.exit(1);
  }
};

const getRoleName = (role: any): string => {
  const roleNum = typeof role === 'number' ? role : Number(role);
  switch (roleNum) {
    case 3:
      return 'Dueño';
    case 2:
      return 'Administrador';
    case 1:
      return 'Usuario';
    default:
      return 'Desconocido';
  }
};

// Ejecutar script
listUsers();
