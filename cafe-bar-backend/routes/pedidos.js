const express = require('express');
const router = express.Router();
const { pool: db } = require("../config/database");

// Listar pedidos
router.get('/', (req, res) => {
  db.query('SELECT * FROM pedidos', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
