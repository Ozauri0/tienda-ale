import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

// Enumeración de roles con jerarquía
export enum UserRole {
  USUARIO = 'usuario',
  ADMINISTRADOR = 'administrador',
  DUENO = 'dueno',
}

// Jerarquía de roles (mayor número = más privilegios)
export const roleHierarchy: Record<UserRole, number> = {
  [UserRole.USUARIO]: 1,
  [UserRole.ADMINISTRADOR]: 2,
  [UserRole.DUENO]: 3,
};

export interface IUser extends Document {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno?: string;
  rut: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  nombreCompleto: string; // Virtual
  comparePassword(candidatePassword: string): Promise<boolean>;
  hasRoleOrHigher(requiredRole: UserRole): boolean;
}

const userSchema = new Schema<IUser>(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es requerido'],
      trim: true,
      minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
      maxlength: [50, 'El nombre no puede exceder 50 caracteres'],
    },
    apellidoPaterno: {
      type: String,
      required: [true, 'El apellido paterno es requerido'],
      trim: true,
      minlength: [2, 'El apellido paterno debe tener al menos 2 caracteres'],
      maxlength: [50, 'El apellido paterno no puede exceder 50 caracteres'],
    },
    apellidoMaterno: {
      type: String,
      trim: true,
      maxlength: [50, 'El apellido materno no puede exceder 50 caracteres'],
    },
    rut: {
      type: String,
      required: [true, 'El RUT es requerido'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: [true, 'El email es requerido'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Por favor ingrese un email válido',
      ],
    },
    password: {
      type: String,
      required: [true, 'La contraseña es requerida'],
      minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
      select: false, // No devolver la contraseña por defecto en las consultas
    },
    role: {
      type: String,
      enum: Object.values(UserRole),
      default: UserRole.USUARIO,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Índices
userSchema.index({ email: 1 });
userSchema.index({ rut: 1 });

// Middleware: Hash password antes de guardar
userSchema.pre('save', async function () {
  // Solo hashear si la contraseña ha sido modificada
  if (!this.isModified('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Método: Comparar contraseña
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Método: Verificar si el usuario tiene el rol requerido o superior
userSchema.methods.hasRoleOrHigher = function (
  requiredRole: UserRole
): boolean {
  return roleHierarchy[this.role as UserRole] >= roleHierarchy[requiredRole];
};

// Virtual: Nombre completo
userSchema.virtual('nombreCompleto').get(function () {
  return this.apellidoMaterno
    ? `${this.nombre} ${this.apellidoPaterno} ${this.apellidoMaterno}`
    : `${this.nombre} ${this.apellidoPaterno}`;
});

// Configurar virtuals en JSON
userSchema.set('toJSON', {
  virtuals: true,
  transform: function (_doc, ret) {
    delete (ret as any).password;
    return ret;
  },
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;
