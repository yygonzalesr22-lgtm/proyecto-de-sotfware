const express = require("express");
const router = express.Router();
const { promisePool } = require("../config/database");
const { verifyToken, hasRole } = require("../middleware/authMiddleware");

// 📦 OBTENER INVENTARIO CON DETALLES DE PRODUCTOS
router.get("/", verifyToken, hasRole(['admin', 'mesero']), async (req, res) => {
  try {
    const query = `
      SELECT 
        i.id,
        i.producto_id as id_producto,
        p.nombre,
        i.cantidad as stock_actual,
        i.minimo as stock_minimo,
        p.precio,
        p.unidad_medida,
        i.updated_at
      FROM inventario i
      JOIN productos p ON i.producto_id = p.id_producto
      ORDER BY p.nombre ASC
    `;
    const [rows] = await promisePool.query(query);
    return res.json(rows);
  } catch (err) {
    console.error("Error en GET /inventario:", err);
    return res.status(500).json({ error: "Error al obtener inventario", msg: err.message });
  }
});

module.exports = router;
