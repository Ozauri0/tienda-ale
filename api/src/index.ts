import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database';
import authRoutes from './routes/authRoutes';

// Cargar variables de entorno
dotenv.config();

// Inicializar Express
const app: Application = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
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
      },
      products: '/api/products (pendiente)',
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
// TODO: Importar y usar más rutas
// app.use('/api/products', productRoutes);
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
