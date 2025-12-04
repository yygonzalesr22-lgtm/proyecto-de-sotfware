const express = require('express');
const router = express.Router();
const { promisePool } = require("../config/database");
const { verifyToken } = require('../middleware/authMiddleware');

// Listar categorías (protegido)
router.get('/', verifyToken, async (req, res) => {
  try {
    console.log('📋 GET /categorias');
    const [results] = await promisePool.query('SELECT * FROM categorias');
    console.log('✅ Categorías encontradas:', results.length);
    res.json(results);
  } catch (err) {
    console.error('❌ Error en GET /categorias:', err.message, err.stack);
    res.status(500).json({ msg: 'Error al obtener categorías', error: err.message });
  }
});

// Obtener por id
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const [results] = await promisePool.query('SELECT * FROM categorias WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ msg: 'Categoría no encontrada' });
    res.json(results[0]);
  } catch (err) {
    console.error('❌ Error en GET /categorias/:id:', err.message, err.stack);
    res.status(500).json({ msg: 'Error al obtener categoría', error: err.message });
  }
});

// Crear categoría
router.post('/', verifyToken, async (req, res) => {
  try {
    console.log('📝 POST /categorias - Body:', req.body);
    const { nombre } = req.body;
    
    if (!nombre) {
      console.log('⚠️ Nombre vacío');
      return res.status(400).json({ msg: 'Nombre es obligatorio' });
    }

    console.log('💾 Insertando en BD...');
    const [result] = await promisePool.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
    
    console.log('✅ Categoría creada con ID:', result.insertId);
    return res.status(201).json({ 
      ok: true,
      id: result.insertId, 
      nombre, 
      msg: 'Categoría creada exitosamente' 
    });
  } catch (err) {
    console.error('❌ Error en POST /categorias:', err.message, err.stack);
    res.status(500).json({ msg: 'Error al crear categoría', error: err.message });
  }
});

// Actualizar categoría
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    if (!nombre) return res.status(400).json({ msg: 'Nombre es obligatorio' });

    await promisePool.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id]);
    return res.json({ msg: 'Categoría actualizada exitosamente' });
  } catch (err) {
    console.error('❌ Error en PUT /categorias/:id:', err.message, err.stack);
    res.status(500).json({ msg: 'Error al actualizar categoría', error: err.message });
  }
});

// Eliminar categoría
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    await promisePool.query('DELETE FROM categorias WHERE id = ?', [id]);
    return res.json({ msg: 'Categoría eliminada exitosamente' });
  } catch (err) {
    console.error('❌ Error en DELETE /categorias/:id:', err.message, err.stack);
    res.status(500).json({ msg: 'Error al eliminar categoría', error: err.message });
  }
});

module.exports = router;
