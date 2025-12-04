# 🚀 Guía de Setup - Café Bar API (Post-Hardening de Seguridad)

## ✅ Estado Actual del Proyecto

El proyecto ha sido sometido a un **hardening de seguridad crítico** el 4 de diciembre de 2025. Se han corregido múltiples vulnerabilidades de seguridad.

## 📋 Requisitos

- **Node.js** v16.0.0 o superior
- **npm** v8.0.0 o superior
- **MySQL** v5.7 o superior
- **Git** v2.0 o superior

## 🔐 Paso 1: Generar Secretos (IMPORTANTE)

Antes de ejecutar el proyecto, debes generar secretos seguros.

### 1.1 Generar JWT_SECRET

```bash
cd cafe-bar
node scripts/generate-secrets.js
```

Este script te mostrará:
- ✅ Un JWT_SECRET generado automáticamente (256-bit)
- ℹ️ Instrucciones para obtener claves de Stripe
- ℹ️ Configuración de base de datos

### 1.2 Obtener Claves de Stripe

Ve a: https://dashboard.stripe.com/apikeys

Copia:
- `Secret key` (comenzará con `sk_test_`)
- `Publishable key` (comenzará con `pk_test_`)

## 🔧 Paso 2: Configurar Archivos .env

### 2.1 Raíz del Proyecto

```bash
cp .env.example .env
```

Edita `.env` y actualiza:

```dotenv
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña_mysql
DB_NAME=cafe-bar-bd
DB_PORT=3306

PORT=3000
NODE_ENV=development

# Paste el JWT_SECRET del script
JWT_SECRET=<paste-aquí-el-jwt-secret-generado>

# Paste las claves de Stripe de tu dashboard
STRIPE_SECRET_KEY=sk_test_xxxxx
STRIPE_PUBLIC_KEY=pk_test_xxxxx
```

### 2.2 Backend

```bash
cp cafe-bar-backend/.env.example cafe-bar-backend/.env
```

Edita `cafe-bar-backend/.env` con los **MISMOS VALORES** que en la raíz.

⚠️ **IMPORTANTE:** Los valores deben ser idénticos en ambos archivos `.env`

## ⚠️ Paso 3: Preparar Base de Datos

```bash
# Crear la base de datos
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS cafe-bar-bd CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# Ejecutar init_database.sql
mysql -u root -p cafe-bar-bd < init_database.sql
```

## 📦 Paso 4: Instalar Dependencias

### Backend

```bash
cd cafe-bar-backend
npm install
```

Verifica que se instale sin errores (ahora sin conflictos de bcrypt).

### Frontend

```bash
cd cafe-bar-frontend
npm install
```

## ✅ Paso 5: Verificar Instalación

### Backend - Verificar Conexión a BD

```bash
cd cafe-bar-backend
node check-db.js
```

Debería mostrar:
```
✅ Conexión exitosa a MySQL
🗄️  Base de datos: cafe-bar-bd
📋 Tablas en la base de datos (X total):
   • usuarios
   • productos
   • categorias
   • mesas
   • pedidos
   • inventario
```

### Backend - Verificar Setup

```bash
cd cafe-bar-backend
node init-db.js
```

Debería crear datos de prueba:
```
✅ Usuario admin creado
✅ Categorías procesadas
✅ Mesas procesadas
✨ ¡Base de datos lista para usar!
```

## 🚀 Paso 6: Ejecutar la Aplicación

### Terminal 1 - Backend

```bash
cd cafe-bar-backend
npm start
# o para desarrollo con auto-reload:
npm run dev
```

Debería mostrar:
```
🚀 Servidor corriendo en http://localhost:3000
✅ Conexión exitosa a MySQL
```

### Terminal 2 - Frontend

```bash
cd cafe-bar-frontend
npm run dev
```

Debería mostrar:
```
  ➜  Local:   http://localhost:5173/
```

## 🔑 Credenciales de Prueba

Después de ejecutar `init-db.js`:

- **Email:** admin@example.com
- **Contraseña:** pass1234
- **Rol:** admin

## 🔐 Seguridad - Cosas IMPORTANTES

### ✅ HACER:

- ✓ Guardar archivos `.env` de forma segura (NO en git)
- ✓ Cambiar contraseña de base de datos en producción
- ✓ Rotear secretos regularmente
- ✓ Usar diferentes secretos para dev/staging/production
- ✓ Usar `npm audit` para verificar vulnerabilidades

### ❌ NO HACER:

- ✗ Nunca comitees archivos `.env` a git
- ✗ Nunca hardcodees secretos en el código
- ✗ Nunca loguees JWT_SECRET o claves API
- ✗ Nunca compartas secretos por Slack/Email sin encriptar

## 🧪 Testing

### Verificar API con Login

```bash
# En otra terminal:
node test-login.js
```

### Verificar con Postman

Importa la colección: `Cafe-Bar-API-Postman.json`

## 📊 Archivos de Configuración Generados

- `.env` - Configuración (NO commitear)
- `.env.example` - Template seguro (SÍ commitear)
- `.gitignore` - Exclusiones de git (actualizado)
- `SECURITY_HARDENING_REPORT.md` - Documentación de cambios de seguridad
- `scripts/generate-secrets.js` - Generador de secretos

## 🐛 Troubleshooting

### Error: "ECONNREFUSED" al conectar a BD

**Solución:** Verifica que MySQL esté corriendo:

```bash
# Windows:
net start MySQL80

# Linux/Mac:
sudo systemctl start mysql
```

### Error: "Database does not exist"

**Solución:** Ejecuta el comando de creación de BD del Paso 3.

### Error: "JWT_SECRET is not set"

**Solución:** Asegúrate de que `.env` contiene el JWT_SECRET generado.

### bcrypt Error (ya resuelto)

Si ves error con bcrypt, asegúrate de tener `^5.1.0` en `package.json` y ejecuta:

```bash
rm -rf node_modules package-lock.json
npm install
```

## 📞 Support

Para reportar problemas o sugerencias de seguridad:

1. Abre un issue en el repositorio
2. Usa el template de bug report
3. NO incluyas valores secretos en el reporte

---

**Última actualización:** 4 de diciembre de 2025  
**Versión:** 2.0.0 (Post-Security Hardening)  
**Maintainer:** DevOps Team
