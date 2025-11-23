// Controlador: categoriasController.js
const { pool } = require('../config/database');

exports.obtenerCategorias = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM categorias WHERE activo = TRUE ORDER BY nombre');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.crearCategoria = async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    const [result] = await pool.query(
      'INSERT INTO categorias (nombre, descripcion) VALUES (?, ?)',
      [nombre, descripcion]
    );
    res.status(201).json({ success: true, message: 'Categoría creada', id: result.insertId });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
