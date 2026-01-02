import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import userRoutes from './routes/userRoutes';

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    // Permitir sin origin (como Postman, Thunder Client, etc.)
    if (!origin) return callback(null, true);
    
    // Lista de orígenes permitidos
    const allowedOrigins = [
      process.env.FRONTEND_URL || 'http://localhost:3000',
      'http://localhost:3000',
    ];
    
    // Verificar si el origen está en la lista permitida
    if (allowedOrigins.indexOf(origin) !== -1) {
      return callback(null, true);
    }
    
    // Verificar si el origen es una IP en la red local (192.168.x.x o 10.x.x.x)
    const localIpPattern = /^http:\/\/(192\.168\.\d{1,3}\.\d{1,3}|10\.\d{1,3}\.\d{1,3}\.\d{1,3})(:\d+)?$/;
    if (localIpPattern.test(origin)) {
      return callback(null, true);
    }
    
    // Denegar otros orígenes
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas básicas
app.get('/', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'API EduPlay Chile',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/me (requiere token)',
        updateProfile: 'PUT /api/auth/profile (requiere token)',
      },
      products: {
        list: 'GET /api/products',
        getById: 'GET /api/products/:id',
        create: 'POST /api/products (requiere Admin o Dueño)',
        update: 'PUT /api/products/:id (requiere Admin o Dueño)',
        delete: 'DELETE /api/products/:id (requiere Admin o Dueño)',
      },
      users: {
        list: 'GET /api/users (requiere Admin o Dueño)',
        getById: 'GET /api/users/:id (requiere Admin o Dueño)',
        update: 'PUT /api/users/:id (requiere Admin o Dueño)',
        delete: 'DELETE /api/users/:id (Admin: solo usuarios / Dueño: todos)',
      },
      cart: '/api/cart (pendiente)',
    },
    roles: {
      usuario: 'Usuario estándar',
      administrador: 'Administrador (jerarquía 2)',
      dueno: 'Dueño (jerarquía 3 - máxima)',
    },
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: 'API funcionando correctamente',
    timestamp: new Date().toISOString(),
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
// TODO: Implementar más rutas
// app.use('/api/cart', cartRoutes);

// Manejo de rutas no encontradas
app.use((req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: 'Ruta no encontrada',
  });
});

// Conectar a la base de datos y iniciar servidor
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

startServer();

export default app;
