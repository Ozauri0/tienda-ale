# Tienda de Alex - Mockup E-commerce

Mockup de tienda online para productos educativos y juguetes didácticos dirigidos a jardines escolares y kinder en Chile.

## 🎨 Stack Tecnológico

### Frontend
- ⚡ **Next.js 16** - Framework React con App Router
- 🎨 **Tailwind CSS 4** - Estilos utility-first
- 🌗 **next-themes** - Sistema de temas (claro/oscuro/sistema)
- 📱 **Diseño Responsive** - Mobile-first
- ✨ **Animaciones suaves** - Transiciones y efectos visuales
- 🔤 **Tipografías**: Playfair Display (títulos) + Inter (cuerpo)

### Backend (Planeado)
- 🚀 **Express.js** - API RESTful
- 🗄️ **MongoDB** - Base de datos NoSQL
- 🔐 **JWT** - Autenticación y autorización
- 🛡️ **bcrypt** - Hash de contraseñas

## 📁 Estructura del Proyecto

```
tienda-ale/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Layout principal con ThemeProvider
│   │   ├── page.tsx             # Página de inicio
│   │   └── globals.css          # Estilos globales y temas
│   ├── components/
│   │   ├── Header.tsx           # Navegación responsive
│   │   ├── Hero.tsx             # Sección hero con CTAs
│   │   ├── FeaturedProducts.tsx # Productos destacados
│   │   ├── Features.tsx         # Características del servicio
│   │   ├── Testimonials.tsx     # Testimonios de clientes
│   │   ├── Newsletter.tsx       # Suscripción a newsletter
│   │   ├── Footer.tsx           # Pie de página
│   │   ├── theme-toggle.tsx     # Selector de tema
│   │   └── theme-provider.tsx   # Proveedor de tema
│   └── lib/
│       ├── utils.ts             # Utilidades (cn)
│       └── scroll.ts            # Scroll suave sin cambios de URL
├── public/
│   └── images/                  # Imágenes del proyecto
├── tailwind.config.ts           # Configuración de Tailwind
├── next.config.ts               # Configuración de Next.js
└── tsconfig.json                # Configuración de TypeScript
```

## 🚀 Instalación y Desarrollo

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/Ozauri0/tienda-ale.git
   cd tienda-ale
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar servidor de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

## 🗺️ Rutas Actuales

| Ruta | Descripción | Estado |
|------|-------------|--------|
| `/` | Página principal con todas las secciones | ✅ Implementado |
| `/#productos` | Scroll a productos destacados | ✅ Implementado |
| `/#testimonios` | Scroll a testimonios | ✅ Implementado |
| `/#contacto` | Scroll a newsletter/contacto | ✅ Implementado |

## 🛣️ Roadmap - Integración Backend

### Fase 1: Configuración del Backend
- [ ] Inicializar proyecto Express.js
- [ ] Configurar conexión a MongoDB con Mongoose
- [ ] Implementar variables de entorno (.env)
- [ ] Configurar CORS para el frontend
- [ ] Estructura de carpetas del backend:
  ```
  backend/
  ├── src/
  │   ├── config/
  │   │   └── database.js      # Conexión MongoDB
  │   ├── models/
  │   │   ├── User.js          # Modelo de usuario
  │   │   ├── Product.js       # Modelo de producto
  │   │   └── Order.js         # Modelo de pedido
  │   ├── controllers/
  │   │   ├── authController.js
  │   │   ├── productController.js
  │   │   └── orderController.js
  │   ├── routes/
  │   │   ├── auth.js
  │   │   ├── products.js
  │   │   └── orders.js
  │   ├── middleware/
  │   │   ├── auth.js          # Verificación JWT
  │   │   └── errorHandler.js
  │   └── server.js            # Punto de entrada
  └── .env
  ```

### Fase 2: Autenticación y Usuarios
- [ ] **POST** `/api/auth/register` - Registro de usuarios
- [ ] **POST** `/api/auth/login` - Login y generación de JWT
- [ ] **GET** `/api/auth/profile` - Perfil de usuario (protegido)
- [ ] **PUT** `/api/auth/profile` - Actualizar perfil (protegido)
- [ ] Middleware de autenticación JWT
- [ ] Hash de contraseñas con bcrypt
- [ ] Roles de usuario (cliente, admin)

### Fase 3: Gestión de Productos
- [ ] **GET** `/api/products` - Listar todos los productos
- [ ] **GET** `/api/products/:id` - Obtener producto por ID
- [ ] **POST** `/api/products` - Crear producto (admin)
- [ ] **PUT** `/api/products/:id` - Actualizar producto (admin)
- [ ] **DELETE** `/api/products/:id` - Eliminar producto (admin)
- [ ] Filtros y búsqueda de productos
- [ ] Paginación de resultados
- [ ] Carga de imágenes (Cloudinary/AWS S3)

### Fase 4: Carrito y Pedidos
- [ ] **POST** `/api/cart` - Agregar al carrito
- [ ] **GET** `/api/cart` - Obtener carrito del usuario
- [ ] **PUT** `/api/cart/:itemId` - Actualizar cantidad
- [ ] **DELETE** `/api/cart/:itemId` - Eliminar del carrito
- [ ] **POST** `/api/orders` - Crear pedido
- [ ] **GET** `/api/orders` - Listar pedidos del usuario
- [ ] **GET** `/api/orders/:id` - Detalle de pedido
- [ ] Estados de pedido (pendiente, procesando, enviado, entregado)

### Fase 5: Integración Frontend-Backend
- [ ] Configurar Axios/Fetch en Next.js
- [ ] Contexto de autenticación (Context API/Zustand)
- [ ] Almacenar JWT en localStorage/cookies
- [ ] Interceptores para agregar token a requests
- [ ] Páginas de autenticación:
  - [ ] `/login`
  - [ ] `/register`
  - [ ] `/perfil`
- [ ] Páginas de productos:
  - [ ] `/productos` - Catálogo completo
  - [ ] `/productos/[id]` - Detalle de producto
- [ ] Carrito de compras:
  - [ ] `/carrito` - Vista del carrito
  - [ ] `/checkout` - Proceso de compra
- [ ] Dashboard de usuario:
  - [ ] `/mis-pedidos` - Historial de pedidos

### Fase 6: Funcionalidades Adicionales
- [ ] Sistema de búsqueda en tiempo real
- [ ] Filtros por categoría, precio, edad
- [ ] Sistema de favoritos/wishlist
- [ ] Notificaciones por email (Nodemailer)
- [ ] Panel de administración:
  - [ ] CRUD de productos
  - [ ] Gestión de pedidos
  - [ ] Gestión de usuarios
- [ ] Integración de pago (Webpay, Mercado Pago)
- [ ] Sistema de reviews y calificaciones

### Fase 7: Testing y Deployment
- [ ] Tests unitarios (Jest)
- [ ] Tests de integración (Supertest)
- [ ] Variables de entorno para producción
- [ ] Deploy del backend (Render, Railway, Heroku)
- [ ] Deploy del frontend (Vercel)
- [ ] Configurar MongoDB Atlas para producción
- [ ] Implementar rate limiting
- [ ] Logging con Winston/Morgan

## 🔐 Seguridad

- **JWT**: Autenticación stateless con tokens de corta duración
- **bcrypt**: Hash seguro de contraseñas con salt rounds
- **CORS**: Configuración restrictiva de orígenes permitidos
- **Helmet**: Headers de seguridad HTTP
- **Rate Limiting**: Protección contra ataques de fuerza bruta
- **Validación**: Sanitización de inputs con express-validator
- **HTTPS**: Comunicación cifrada en producción

## 📦 Dependencias Planeadas (Backend)

```json
{
  "dependencies": {
    "express": "^4.18.2",
    "mongoose": "^8.0.0",
    "jsonwebtoken": "^9.0.2",
    "bcryptjs": "^2.4.3",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "express-validator": "^7.0.1",
    "morgan": "^1.10.0"
  },
  "devDependencies": {
    "nodemon": "^3.0.2",
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  }
}
```

## 📝 Variables de Entorno (.env)

```env
# Backend
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/tienda-ale
JWT_SECRET=tu_clave_secreta_super_segura
JWT_EXPIRE=7d

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

