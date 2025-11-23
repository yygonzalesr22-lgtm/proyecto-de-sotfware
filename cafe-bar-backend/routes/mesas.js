const express = require('express');
const router = express.Router();
const { pool: db } = require("../config/database");
// Listar mesas
router.get('/', (req, res) => {
  db.query('SELECT * FROM mesas', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

module.exports = router;
