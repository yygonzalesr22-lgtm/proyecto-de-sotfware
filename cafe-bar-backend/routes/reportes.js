// Rutas: reportes.js
const express = require('express');
const router = express.Router();
const reportesController = require('../controllers/reportesController');

router.get('/ventas-hoy', reportesController.obtenerVentasHoy);
router.get('/productos-mas-vendidos', reportesController.productosMasVendidos);
router.get('/ventas-rango', reportesController.ventasPorRango);

module.exports = router;
