const express = require('express');
const router = express.Router();
const { pool: db } = require("../config/database");

const { verifyToken } = require('../middleware/authMiddleware');

// Listar categorías (protegido)
router.get('/', verifyToken, (req, res) => {
  db.query('SELECT * FROM categorias', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

// Obtener por id
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM categorias WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(404).json({ msg: 'Categoría no encontrada' });
    res.json(results[0]);
  });
});

// Crear categoría
router.post('/', (req, res) => {
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ msg: 'Nombre es obligatorio' });

  db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.status(201).json({ id: result.insertId, nombre });
  });
});

// Actualizar categoría
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { nombre } = req.body;
  if (!nombre) return res.status(400).json({ msg: 'Nombre es obligatorio' });

  db.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ msg: 'Categoría actualizada' });
  });
});

// Eliminar categoría
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM categorias WHERE id = ?', [id], (err, result) => {
    if (err) return res.status(500).json(err);
    return res.json({ msg: 'Categoría eliminada' });
  });
});

module.exports = router;
