const express = require("express");
const router = express.Router();
const { pool: db } = require("../config/database");

// Obtener todos los usuarios
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id, nombre, email FROM usuarios");
    return res.json(rows);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Obtener usuario por ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(
      "SELECT id, nombre, email FROM usuarios WHERE id = ?",
      [id]
    );

    if (rows.length === 0)
      return res.status(404).json({ msg: "Usuario no encontrado" });

    return res.json(rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
});

// Crear usuario
router.post("/", async (req, res) => {
  try {
    const { nombre, email } = req.body;

    if (!nombre || !email)
      return res.status(400).json({ msg: "Faltan campos" });

    await db.query(
      "INSERT INTO usuarios (nombre, email) VALUES (?, ?)",
      [nombre, email]
    );

    return res.json({ msg: "Usuario creado correctamente" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: "Error en el servidor" });
  }
});

module.exports = router;
