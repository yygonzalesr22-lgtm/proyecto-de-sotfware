const express = require('express');
const router = express.Router();
const { pool: db } = require("../config/database");
const { verifyToken } = require('../middleware/authMiddleware');

// Listar productos
router.get('/', verifyToken, (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Obtener por id
router.get('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ msg: 'Producto no encontrado' });
    res.json(results[0]);
  });
});

// Crear producto
router.post('/', verifyToken, (req, res) => {
  const { nombre, precio, categoria_id } = req.body;
  if (!nombre) return res.status(400).json({ msg: 'Nombre es obligatorio' });

  db.query('INSERT INTO productos (nombre, precio, categoria_id) VALUES (?, ?, ?)', [nombre, precio || 0, categoria_id || null], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({ id: result.insertId, nombre, precio, categoria_id });
  });
});

// Actualizar producto
router.put('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  const { nombre, precio, categoria_id } = req.body;
  if (!nombre) return res.status(400).json({ msg: 'Nombre es obligatorio' });

  db.query('UPDATE productos SET nombre = ?, precio = ?, categoria_id = ? WHERE id = ?', [nombre, precio || 0, categoria_id || null, id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ msg: 'Producto actualizado' });
  });
});

// Eliminar producto
router.delete('/:id', verifyToken, (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM productos WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ msg: 'Producto eliminado' });
  });
});

module.exports = router;
