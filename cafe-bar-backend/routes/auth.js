const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { promisePool } = require("../config/database");

require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.warn('⚠️  WARNING: JWT_SECRET is not set. Please configure environment variables.');
}

// ===============================
//  RUTA: REGISTRO
// ===============================
router.post("/register", async (req, res) => {
  const { nombre_completo, usuario, password_hash, rol = "admin" } = req.body;

  if (!nombre_completo || !usuario || !password_hash) {
    return res.json({ ok: false, error: "Todos los campos son obligatorios" });
  }

  try {
    // Verificar si existe el usuario
    const [existingUser] = await promisePool.query(
      "SELECT * FROM usuarios WHERE usuario = ?",
      [usuario]
    );

    if (existingUser.length > 0) {
      return res.json({ ok: false, error: "El usuario ya está registrado" });
    }

    // Insertar nuevo usuario
    await promisePool.query(
      "INSERT INTO usuarios (nombre_completo, usuario, password_hash, rol, activo) VALUES (?,?,?,?,1)",
      [nombre_completo, usuario, password_hash, rol]
    );

    res.json({ ok: true, message: "Usuario registrado correctamente" });

  } catch (error) {
    console.error("Error en registro:", error);
    res.json({ ok: false, error: error.message || "Error interno del servidor" });
  }
});

// ===============================
//  RUTA: LOGIN
// ===============================
router.post("/login", async (req, res) => {
  console.log("🔐 Login request - Body:", req.body);
  
  const { usuario, password, email } = req.body;
  const loginUser = usuario || email;
  const loginPass = password || req.body.password_hash;

  if (!loginUser || !loginPass) {
    console.warn("⚠️ Login fallido: faltan campos");
    return res.json({ ok: false, error: "Faltan campos" });
  }

  try {
    console.log(`🔍 Buscando usuario: ${loginUser}`);
    
    // Buscar por email o usuario
    const [user] = await promisePool.query(
      "SELECT id, nombre, email, password, role, activo FROM usuarios WHERE (email = ? OR ? = email) LIMIT 1",
      [loginUser, loginUser]
    );

    console.log("📊 Resultado de query:", user.length, "usuarios encontrados");

    if (user.length === 0) {
      console.warn("❌ Usuario no encontrado:", loginUser);
      return res.json({ ok: false, error: "Usuario o contraseña incorrectos" });
    }

    const userData = user[0];
    
    // Comparar contraseña (puede estar hasheada con bcrypt o en texto plano)
    const bcrypt = require('bcryptjs');
    let passwordMatch = false;
    
    // Intentar con bcrypt
    try {
      passwordMatch = await bcrypt.compare(loginPass, userData.password);
    } catch (err) {
      // Si falla bcrypt, comparar en texto plano (para usuarios creados sin hash)
      passwordMatch = (loginPass === userData.password);
    }

    if (!passwordMatch) {
      console.warn("❌ Contraseña incorrecta para:", loginUser);
      return res.json({ ok: false, error: "Usuario o contraseña incorrectos" });
    }

    if (!userData.activo) {
      console.warn("❌ Usuario inactivo:", loginUser);
      return res.json({ ok: false, error: "Usuario inactivo" });
    }

    // User authenticated successfully
    
    // Generar JWT token
    const token = jwt.sign(
      { id: userData.id, email: userData.email, nombre: userData.nombre, role: userData.role },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // JWT token generated

    res.json({
      ok: true,
      message: "Inicio de sesión correcto",
      token,
      user: {
        id: userData.id,
        nombre: userData.nombre,
        email: userData.email,
        role: userData.role
      },
    });

  } catch (error) {
    console.error("❌ Error en login:", error.message);
    res.json({ ok: false, error: error.message || "Error interno del servidor" });
  }
});

module.exports = router;
