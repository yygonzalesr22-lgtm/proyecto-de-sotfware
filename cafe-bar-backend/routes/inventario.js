const express = require("express");
const router = express.Router();
const db = require("../config/database"); // Asegúrate de que este es el pool de mysql2/promise

// 📦 OBTENER INVENTARIO (SOLO ASYNC / AWAIT)
router.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM inventario");
    return res.json(rows);
  } catch (err) {
    console.error("Error en GET /inventario:", err);
    return res.status(500).json({ error: "Error al obtener inventario" });
  }
});

module.exports = router;
