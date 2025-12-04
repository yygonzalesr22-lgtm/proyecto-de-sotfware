// Simple test file to verify login functionality
const mysql = require('mysql2/promise');
require('dotenv').config();

async function testLogin() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'cafe-bar-bd'
  });

  try {
    const [rows] = await connection.execute(
      'SELECT id_usuario, nombre_completo, usuario, rol FROM usuarios WHERE usuario = ? AND password_hash = ?',
      ['admin@example.com', 'pass1234']
    );

    if (rows.length > 0) {
      console.log('✅ Login successful!');
      console.log('User data:', rows[0]);
    } else {
      console.log('❌ Login failed - Credenciales incorrectas');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await connection.end();
  }
}

testLogin();
