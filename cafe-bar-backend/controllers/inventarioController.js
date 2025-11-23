// Controlador: inventarioController.js
const { pool } = require('../config/database');

exports.registrarEntrada = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const { id_producto, cantidad, motivo, usuario } = req.body;

    const [producto] = await connection.query(
      'SELECT stock_actual FROM productos WHERE id_producto = ?',
      [id_producto]
    );

    const stock_anterior = producto[0].stock_actual;
    const stock_nuevo = stock_anterior + cantidad;

    await connection.query(
      'UPDATE productos SET stock_actual = ? WHERE id_producto = ?',
      [stock_nuevo, id_producto]
    );

    await connection.query(
      `INSERT INTO movimientos_inventario 
      (id_producto, tipo_movimiento, cantidad, stock_anterior, stock_nuevo, motivo, usuario) 
      VALUES (?, 'entrada', ?, ?, ?, ?, ?)`,
      [id_producto, cantidad, stock_anterior, stock_nuevo, motivo, usuario]
    );

    await connection.commit();
    res.json({ success: true, message: 'Entrada de inventario registrada' });
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ success: false, message: error.message });
  } finally {
    connection.release();
  }
};

exports.obtenerMovimientos = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT * FROM movimientos_inventario 
      WHERE id_producto = ? 
      ORDER BY fecha_movimiento DESC 
      LIMIT 50`,
      [req.params.id_producto]
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
