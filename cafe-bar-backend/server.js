require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const bodyParser = require('body-parser');
const { testConnection } = require('./config/database');

const app = express();

// Middlewares globales
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// Rutas API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/usuarios', require('./routes/usuarios'));
app.use('/api/categorias', require('./routes/categorias'));
app.use('/api/productos', require('./routes/productos'));
app.use('/api/mesas', require('./routes/mesas'));
app.use('/api/pedidos', require('./routes/pedidos'));
app.use('/api/inventario', require('./routes/inventario'));
app.use('/api/reportes', require('./routes/reportes'));

// Ruta base
app.get('/', (req, res) =>
  res.json({ message: '🚀 API Café Bar funcionando', version: '2.0.0' })
);

const PORT = process.env.PORT || 3000;

const start = async () => {
  const ok = await testConnection();
  if (!ok) {
    console.error('❌ No se pudo conectar a la BD');
    process.exit(1);
  }

  const httpServer = http.createServer(app);
  const io = new Server(httpServer, { cors: { origin: '*' } });

  app.set('io', io);

  io.on('connection', (socket) => {
    console.log('Cliente conectado:', socket.id);
    socket.on('chat:message', (msg) => io.emit('chat:message', msg));
  });

  httpServer.listen(PORT, () =>
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
  );
};

start();
