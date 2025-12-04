require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { testConnection } = require('./config/database');

const app = express();

// CORS mejorado
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5176', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(express.json());

// Log de todas las solicitudes
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Ruta base
app.get('/', (req, res) => res.json({ message: "API Café Bar" }));

// Solo la ruta de auth para testing
try {
  app.use('/api/auth', require('./routes/auth'));
  console.log('✅ Ruta /api/auth cargada');
} catch (err) {
  console.error('❌ Error cargando /api/auth:', err.message);
}

// Manejador 404
app.use((req, res) => {
  console.warn(`⚠️ 404: ${req.method} ${req.path}`);
  res.status(404).json({ ok: false, error: "Ruta no encontrada", path: req.path });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error('❌ Error:', err);
  res.status(err.status || 500).json({ ok: false, error: err.message });
});

const PORT = process.env.PORT || 3000;

const start = async () => {
  const ok = await testConnection();
  if (!ok) {
    console.error('❌ No se pudo conectar a la BD');
    process.exit(1);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  });
};

start();
