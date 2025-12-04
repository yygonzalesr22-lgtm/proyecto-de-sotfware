require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const bodyParser = require('body-parser');
const { testConnection } = require('./config/database');

const app = express();
const server = http.createServer(app);

// ========================
// MIDDLEWARES GLOBALES
// ========================

// CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5176', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parsers
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// Logger
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path}`);
  next();
});

// ========================
// RUTAS
// ========================

// Ruta base
app.get('/', (req, res) => {
  res.json({ message: "API Café Bar", status: "online" });
});

// Cargar rutas dinámicamente
const routeConfigs = [
  { path: '/api/auth', file: './routes/auth' },
  { path: '/api/usuarios', file: './routes/usuarios' },
  { path: '/api/categorias', file: './routes/categorias' },
  { path: '/api/productos', file: './routes/productos' },
  { path: '/api/mesas', file: './routes/mesas' },
  { path: '/api/pedidos', file: './routes/pedidos' },
  { path: '/api/inventario', file: './routes/inventario' },
  { path: '/api/reportes', file: './routes/reportes' },
  { path: '/api/stripe', file: './routes/stripe' },
];

console.log('\n🔧 Cargando rutas API...');
routeConfigs.forEach(({ path, file }) => {
  try {
    const route = require(file);
    app.use(path, route);
    console.log(`✅ ${path}`);
  } catch (error) {
    console.error(`❌ Error cargando ${path}:`, error.message);
  }
});
console.log('');

// ========================
// MANEJADORES DE ERROR
// ========================

// 404
app.use((req, res) => {
  console.warn(`⚠️ 404 - ${req.method} ${req.path}`);
  res.status(404).json({
    ok: false,
    error: "Ruta no encontrada",
    method: req.method,
    path: req.path
  });
});

// Error global
app.use((err, req, res, next) => {
  console.error('❌ Error global:', err.message);
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || "Error interno del servidor"
  });
});

// ========================
// INICIAR SERVIDOR
// ========================

const PORT = process.env.PORT || 3000;

const start = async () => {
  console.log('🔍 Verificando conexión a MySQL...');
  const ok = await testConnection();
  
  if (!ok) {
    console.error('❌ No se pudo conectar a la BD');
    process.exit(1);
  }

  server.listen(PORT, () => {
    console.log(`\n✨ Servidor corriendo en http://localhost:${PORT}\n`);
  });
};

start().catch(err => {
  console.error('❌ Error al iniciar servidor:', err);
  process.exit(1);
});
