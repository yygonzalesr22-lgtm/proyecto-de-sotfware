const express = require('express');
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { pool: db } = require('../config/database');


const JWT_SECRET = process.env.JWT_SECRET || 'supersecretjwt';

// Registro
router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;

  if (!nombre || !email || !password)
    return res.status(400).json({ msg: "Todos los campos son obligatorios" });

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);

    if (results.length > 0)
      return res.status(400).json({ msg: "El usuario ya existe" });

    const hashedPassword = await bcrypt.hash(password, 10);

    db.query(
      'INSERT INTO usuarios (nombre, email, password) VALUES (?, ?, ?)',
      [nombre, email, hashedPassword],
      (err) => {
        if (err) return res.status(500).json(err);

        return res.status(201).json({ msg: "Usuario registrado correctamente" });
      }
    );
  });
});
 
// Login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json(err);
    if (results.length === 0) return res.status(400).json({ msg: "Usuario no encontrado" });

    const usuario = results[0];
    const isMatch = await bcrypt.compare(password, usuario.password);

    if (!isMatch) return res.status(400).json({ msg: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res.json({
      msg: "Login exitoso",
      token,
      usuario: { id: usuario.id, nombre: usuario.nombre, email: usuario.email }
    });
  });
});

// Logout
router.post('/logout', (req, res) => {
  return res.json({ msg: "Sesión cerrada" });
});

// Ver usuarios
router.get('/users', (req, res) => {
  db.query('SELECT id, nombre, email FROM usuarios', (err, results) => {
    if (err) return res.status(500).json(err);
    return res.json(results);
  });
});

module.exports = router;
