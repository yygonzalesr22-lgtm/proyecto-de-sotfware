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
    
    console.log('\n=== ESTRUCTURA Y DATOS DE PRODUCTOS ===');
    const [prodCols] = await conn.query('DESCRIBE productos');
    console.log('\nColumnas:');
    prodCols.forEach(col => console.log(`  - ${col.Field}: ${col.Type}`));
    
    const [prods] = await conn.query('SELECT * FROM productos LIMIT 1');
    console.log('\nPrimer registro (keys):');
    if (prods.length > 0) {
      console.log(JSON.stringify(prods[0], null, 2));
    }
    
    console.log('\n=== ESTRUCTURA Y DATOS DE CATEGORIAS ===');
    const [catCols] = await conn.query('DESCRIBE categorias');
    console.log('\nColumnas:');
    catCols.forEach(col => console.log(`  - ${col.Field}: ${col.Type}`));
    
    const [cats] = await conn.query('SELECT * FROM categorias LIMIT 1');
    console.log('\nPrimer registro (keys):');
    if (cats.length > 0) {
      console.log(JSON.stringify(cats[0], null, 2));
    }
    
    await conn.end();
  } catch(e) {
    console.error('ERROR:', e.message);
  }
})();
