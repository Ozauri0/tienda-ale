# API EduPlay Chile

Backend API para la tienda de material didáctico y juguetes educativos.

## 🚀 Tecnologías

- **Node.js** + **Express** - Framework web
- **TypeScript** - Lenguaje tipado
- **MongoDB** + **Mongoose** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **express-validator** - Validación de datos

## 📁 Estructura del Proyecto

```
api/
├── src/
│   ├── config/          # Configuraciones (DB, JWT, etc.)
│   ├── models/          # Modelos de Mongoose
│   ├── routes/          # Rutas de Express
│   ├── controllers/     # Controladores
│   ├── middlewares/     # Middlewares personalizados
│   ├── utils/           # Utilidades y helpers
│   └── index.ts         # Punto de entrada
├── .env.example         # Variables de entorno de ejemplo
├── package.json
└── tsconfig.json
```

## 🔧 Instalación

1. Copiar archivo de variables de entorno:
```bash
cp .env.example .env
```

2. Editar `.env` con tus credenciales de MongoDB

3. Instalar dependencias:
```bash
npm install
```

## 🏃 Ejecución

### Desarrollo (con hot-reload)
```bash
npm run dev
```

### Producción
```bash
npm run build
npm start
```

## 📡 Endpoints

### Health Check
- `GET /api/health` - Verificar estado de la API

### Autenticación (Pendiente)
- `POST /api/auth/register` - Registro de usuarios
- `POST /api/auth/login` - Iniciar sesión
- `GET /api/auth/me` - Obtener usuario actual

### Productos (Pendiente)
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto por ID
- `POST /api/products` - Crear producto (admin)
- `PUT /api/products/:id` - Actualizar producto (admin)
- `DELETE /api/products/:id` - Eliminar producto (admin)

### Carrito (Pendiente)
- `GET /api/cart` - Ver carrito
- `POST /api/cart` - Agregar al carrito
- `PUT /api/cart/:id` - Actualizar cantidad
- `DELETE /api/cart/:id` - Eliminar del carrito

## 🗄️ Configuración de MongoDB

### MongoDB Local
```bash
# Instalar MongoDB Community Edition
# Linux:
sudo apt-get install mongodb-community

# macOS:
brew install mongodb-community

# Iniciar servicio
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

### MongoDB Atlas (Nube)
1. Crear cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crear un cluster gratuito
3. Obtener connection string
4. Actualizar `MONGODB_URI` en `.env`

## 🔐 Variables de Entorno

- `PORT` - Puerto del servidor (default: 3001)
- `MONGODB_URI` - URI de conexión a MongoDB
- `JWT_SECRET` - Secreto para firmar tokens JWT
- `JWT_EXPIRES_IN` - Tiempo de expiración del token
- `NODE_ENV` - Entorno (development/production)
- `FRONTEND_URL` - URL del frontend para CORS

## 📝 Notas

- La API corre en el puerto **3001** por defecto
- El frontend corre en el puerto **3000**
- Asegúrate de tener MongoDB corriendo antes de iniciar la API
