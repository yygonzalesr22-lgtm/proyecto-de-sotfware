const mysql = require('mysql2/promise');
require('dotenv').config();

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'cafe-bar-bd'
    });
    
    console.log('=== ESTRUCTURA DE TABLA productos ===');
    const [cols] = await conn.query('DESCRIBE productos');
    cols.forEach(col => {
      console.log(`${col.Field}: ${col.Type} ${col.Null === 'NO' ? 'NOT NULL' : 'NULL'}`);
    });
    
    await conn.end();
  } catch(e) {
    console.error('ERROR:', e.message);
  }
})();
