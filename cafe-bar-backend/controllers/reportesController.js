// Controlador: reportesController.js
const { pool } = require('../config/database');

// Ventas del día
exports.obtenerVentasHoy = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM ventas_hoy');
    res.json({ success: true, data: rows[0] || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Productos más vendidos
exports.productosMasVendidos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.nombre,
        COUNT(dp.id_detalle) as veces_pedido,
        SUM(dp.cantidad) as cantidad_total,
        SUM(dp.subtotal) as total_vendido
      FROM detalle_pedidos dp
      JOIN productos p ON dp.id_producto = p.id_producto
      JOIN pedidos ped ON dp.id_pedido = ped.id_pedido
      WHERE ped.estado = 'cerrado' 
        AND DATE(ped.fecha_hora) >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      GROUP BY p.id_producto
      ORDER BY cantidad_total DESC
      LIMIT 10
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Ventas por rango de fechas
exports.ventasPorRango = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    const [rows] = await pool.query(`
      SELECT 
        DATE(fecha_hora) as fecha,
        COUNT(*) as total_pedidos,
        SUM(total) as total_ventas
      FROM pedidos
      WHERE estado = 'cerrado'
        AND DATE(fecha_hora) BETWEEN ? AND ?
      GROUP BY DATE(fecha_hora)
      ORDER BY fecha
    `, [fecha_inicio, fecha_fin]);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
