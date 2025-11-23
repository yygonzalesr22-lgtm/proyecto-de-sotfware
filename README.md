# 🚀 Café Bar - Panel de Gestión Moderno

Sistema completo de gestión para un café bar con autenticación JWT, CRUD completo y interfaz modernizada.

## 📋 Requisitos Previos

- **Node.js** (v16+)
- **MySQL** (local o remoto)
- **npm** o **yarn**

## 🔧 Instalación y Configuración

### 1. Backend Setup

```powershell
# Navega a la carpeta del backend
Set-Location -Path C:\Users\User\Desktop\proyecto\cafe-bar\cafe-bar-backend

# Instala dependencias
npm install

# Configura las variables de entorno en .env
# DB_HOST=localhost
# DB_USER=root
# DB_PASSWORD=tu_password
# DB_NAME=cafe_bar_db
# DB_PORT=3306
# JWT_SECRET=supersecretjwt
```

### 2. Base de Datos

Crea la base de datos e importa las migraciones:

```powershell
# Crear BD
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS cafe_bar_db CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# Importar migraciones (en orden)
Get-ChildItem .\migrations\*.sql | Sort-Object Name | ForEach-Object {
  mysql -u root -p cafe_bar_db < $_.FullName
}
```

### 3. Frontend Setup

```powershell
# Navega a la carpeta del frontend
Set-Location -Path C:\Users\User\Desktop\proyecto\cafe-bar\cafe-bar-frontend

# Instala dependencias
npm install
```

## 🚀 Ejecutar la Aplicación

### Terminal 1 - Backend

```powershell
Set-Location -Path C:\Users\User\Desktop\proyecto\cafe-bar\cafe-bar-backend
npm install
node server.js
```

Deberías ver:
```
✅ Conexión exitosa a MySQL
🚀 Servidor corriendo en http://localhost:3000
```

### Terminal 2 - Frontend

```powershell
Set-Location -Path C:\Users\User\Desktop\proyecto\cafe-bar\cafe-bar-frontend
npm install
npm run dev
```

Deberías ver:
```
➜ Local: http://localhost:5173/
```

## 🔐 Flujo de Autenticación

### 1. Registrar Usuario (curl o Postman)

```powershell
curl -X POST http://localhost:3000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "nombre": "Admin",
    "email": "admin@example.com",
    "password": "pass1234"
  }'
```

**Respuesta:**
```json
{"msg": "Usuario registrado correctamente"}
```

### 2. Iniciar Sesión

```powershell
curl -X POST http://localhost:3000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "admin@example.com",
    "password": "pass1234"
  }'
```

**Respuesta:**
```json
{
  "msg": "Login exitoso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nombre": "Admin",
    "email": "admin@example.com"
  }
}
```

### 3. Acceder al Panel

1. Ve a **http://localhost:5173**
2. En la pantalla de login, ingresa:
   - Email: `admin@example.com`
   - Contraseña: `pass1234`
3. ¡Listo! Acceso al dashboard con:
   - **Categorías** — CRUD completo de categorías
   - **Productos** — CRUD de productos
   - **Dashboard** — Estadísticas y accesos rápidos
   - Más módulos disponibles en el sidebar

## 📦 Módulos Implementados

- ✅ **Autenticación** — Registro, Login, JWT, PrivateRoute
- ✅ **Componentes Compartidos** — Table, Modal, Alert, FormField
- ✅ **Categorías** — CRUD completo + API protegida
- ✅ **Productos** — CRUD completo + API protegida
- ⏳ **Inventario** — En desarrollo
- ⏳ **Mesas** — En desarrollo
- ⏳ **Pedidos** — En desarrollo
- ⏳ **Usuarios** — En desarrollo
- ⏳ **Reportes** — En desarrollo
- ⏳ **Chat** — En desarrollo

## 🎨 Características del Diseño

- **Interfaz Moderna** — Gradient azul, hover effects, transiciones suaves
- **Responsive** — Mobile-first con Tailwind CSS
- **Navbar** — Con logout y display de usuario autenticado
- **Sidebar Fixed** — Navegación persistente a todos los módulos
- **Dashboard** — Tarjetas de estadísticas y accesos rápidos
- **Tablas** — Con header gradiente, filas interactivas, estado vacío
- **Formularios Modales** — Con validaciones y manejo de errores

## 🔌 API Endpoints

### Autenticación
- `POST /api/auth/register` — Registrar usuario
- `POST /api/auth/login` — Iniciar sesión
- `POST /api/auth/logout` — Cerrar sesión

### Categorías (Requiere Token)
- `GET /api/categorias` — Listar todas
- `GET /api/categorias/:id` — Obtener por ID
- `POST /api/categorias` — Crear nueva
- `PUT /api/categorias/:id` — Actualizar
- `DELETE /api/categorias/:id` — Eliminar

### Productos (Requiere Token)
- `GET /api/productos` — Listar todas
- `GET /api/productos/:id` — Obtener por ID
- `POST /api/productos` — Crear nuevo
- `PUT /api/productos/:id` — Actualizar
- `DELETE /api/productos/:id` — Eliminar

## 🛠️ Troubleshooting

### Error: "Port 3000 is in use"
```powershell
# Encontrar proceso en puerto 3000
netstat -ano | findstr :3000
# Terminar proceso
taskkill /PID <PID> /F
```

### Error: "Failed to connect to MySQL"
- Verifica que MySQL está corriendo
- Confirma credenciales en `.env`
- Asegúrate de que la BD `cafe_bar_db` existe

### Error: "React not found"
```powershell
# En la carpeta del frontend
npm install react react-dom react-router-dom
```

## 📝 Estructura del Proyecto

```
cafe-bar/
├── cafe-bar-backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── migrations/
│   ├── routes/
│   ├── validators/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── cafe-bar-frontend/
    ├── src/
    │   ├── api/ — apiClient.js para fetch
    │   ├── components/ — Navbar, Sidebar, PrivateRoute, UI components
    │   ├── pages/ — Login, Home, Categorias, Productos, etc.
    │   ├── App.jsx
    │   └── index.css
    ├── main.js
    ├── vite.config.js
    ├── package.json
    └── index.html
```

## 🎯 Próximos Pasos

1. Implementar módulos faltantes (Inventario, Mesas, Pedidos)
2. Añadir validaciones más robustas
3. Implementar subida de imágenes para productos
4. Crear reportes con gráficos
5. Implementar chat en tiempo real con Socket.io

## 📧 Contacto y Soporte

Para reportar bugs o sugerencias, contacta al equipo de desarrollo.

---

**Versión:** 1.0.0  
**Última Actualización:** Noviembre 2025  
**Estado:** En Desarrollo ✨
