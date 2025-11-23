// Controlador: mesasController.js
const { pool } = require('../config/database');

exports.obtenerMesas = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM mesas WHERE activo = TRUE ORDER BY numero_mesa');
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.obtenerMesasDisponibles = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM mesas WHERE estado = 'libre' AND activo = TRUE ORDER BY numero_mesa");
    res.json({ success: true, data: rows });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.actualizarEstadoMesa = async (req, res) => {
  try {
    const { estado } = req.body;
    await pool.query('UPDATE mesas SET estado = ? WHERE id_mesa = ?', [estado, req.params.id]);
    res.json({ success: true, message: 'Estado de mesa actualizado' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
