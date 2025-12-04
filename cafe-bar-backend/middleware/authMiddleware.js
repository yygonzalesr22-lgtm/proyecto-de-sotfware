const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  console.error('ERROR: JWT_SECRET not configured in environment variables');
}

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  
  if (!authHeader) {
    console.error('❌ Token no provisto');
    return res.status(401).json({ success: false, message: 'Token no provisto' });
  }
  
  const parts = authHeader.split(' ');
  const token = parts.length === 2 ? parts[1] : parts[0];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    // Token verified successfully
    req.user = decoded;
    next();
  } catch (err) {
    console.error('❌ Token inválido:', err.message);
    return res.status(401).json({ success: false, message: 'Token inválido o expirado' });
  }
};

const hasRole = (roles = []) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'No autenticado' });
  if (!Array.isArray(roles)) roles = [roles];
  const userRole = req.user.rol || req.user.role;
  if (!roles.includes(userRole)) return res.status(403).json({ success: false, message: 'Acceso denegado' });
  next();
};

module.exports = { verifyToken, hasRole };
