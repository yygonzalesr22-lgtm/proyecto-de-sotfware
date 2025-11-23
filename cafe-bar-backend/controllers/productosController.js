// Controlador: productosController.js
const { pool } = require('../config/database');

exports.obtenerProductos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT p.*, c.nombre as categoria_nombre 
      FROM productos p
      LEFT JOIN categorias c ON p.id_categoria = c.id_categoria
      WHERE p.activo = TRUE
      ORDER BY p.nombre
    `);
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerProductoPorId = async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM productos WHERE id_producto = ?',
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Producto no encontrado' });
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.crearProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, id_categoria, stock_actual, stock_minimo, unidad_medida } = req.body;
    const [result] = await pool.query(
      `INSERT INTO productos 
      (nombre, descripcion, precio, id_categoria, stock_actual, stock_minimo, unidad_medida) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [nombre, descripcion, precio, id_categoria, stock_actual, stock_minimo, unidad_medida]
    );
    res.status(201).json({ success: true, message: 'Producto creado', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.actualizarProducto = async (req, res) => {
  try {
    const { nombre, descripcion, precio, id_categoria, stock_actual, stock_minimo } = req.body;
    await pool.query(
      `UPDATE productos 
      SET nombre = ?, descripcion = ?, precio = ?, id_categoria = ?, 
          stock_actual = ?, stock_minimo = ?
      WHERE id_producto = ?`,
      [nombre, descripcion, precio, id_categoria, stock_actual, stock_minimo, req.params.id]
    );
    res.json({ success: true, message: 'Producto actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.productosBajoStock = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM productos_bajo_stock');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
