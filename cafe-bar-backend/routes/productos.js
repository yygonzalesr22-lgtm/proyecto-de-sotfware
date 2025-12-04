const express = require('express');
const router = express.Router();
const { promisePool } = require("../config/database");
const { verifyToken } = require('../middleware/authMiddleware');

// Listar productos
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('📋 GET /productos');
    const [results] = await promisePool.query('SELECT * FROM productos');
    console.log('✅ Productos encontrados:', results.length);
    res.json(results);
  } catch (err) {
    console.error('❌ Error en GET /productos:', err.message, err.stack);
    res.status(500).json({ msg: 'Error al obtener productos', error: err.message });
  }
});

// Obtener por id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await promisePool.query('SELECT * FROM productos WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ msg: 'Producto no encontrado' });
    res.json(results[0]);
  } catch (err) {
    console.error('Error en GET /productos/:id:', err);
    res.status(500).json({ msg: 'Error al obtener producto', error: err.message });
  }
});

// Crear producto
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('📝 POST /productos - Body:', req.body);
    const { nombre, precio, id_categoria } = req.body;
    
    if (!nombre) {
      console.log('⚠️ Nombre vacío');
      return res.status(400).json({ msg: 'Nombre es obligatorio' });
    }

    console.log('💾 Insertando en BD...');
    const [result] = await promisePool.query(
      'INSERT INTO productos (nombre, precio, id_categoria) VALUES (?, ?, ?)',
      [nombre, precio || 0, id_categoria || null]
    );
    
    console.log('✅ Producto creado con ID:', result.insertId);
    return res.status(201).json({ 
      ok: true,
      id: result.insertId, 
      nombre, 
      precio, 
      id_categoria, 
      msg: 'Producto creado exitosamente' 
    });
  } catch (err) {
    console.error('❌ Error en POST /productos:', err.message, err.stack);
    res.status(500).json({ msg: 'Error al crear producto', error: err.message });
  }
});

// Actualizar producto
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, precio, id_categoria } = req.body;
    if (!nombre) return res.status(400).json({ msg: 'Nombre es obligatorio' });

    await promisePool.query('UPDATE productos SET nombre = ?, precio = ?, id_categoria = ? WHERE id = ?', [nombre, precio || 0, id_categoria || null, id]);
    return res.json({ msg: 'Producto actualizado exitosamente' });
  } catch (err) {
    console.error('Error en PUT /productos/:id:', err);
    res.status(500).json({ msg: 'Error al actualizar producto', error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await promisePool.query('DELETE FROM productos WHERE id = ?', [id]);
    return res.json({ msg: 'Producto eliminado exitosamente' });
  } catch (err) {
    console.error('Error en DELETE /productos/:id:', err);
    res.status(500).json({ msg: 'Error al eliminar producto', error: err.message });
  }
});

module.exports = router;
