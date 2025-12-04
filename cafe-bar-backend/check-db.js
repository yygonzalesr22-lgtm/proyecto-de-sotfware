const mysql = require('mysql2/promise');
require('dotenv').config();

const config = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'cafe-bar-bd',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

async function checkConnection() {
  try {
    const pool = mysql.createPool(config);
    const connection = await pool.getConnection();
    
    console.log('✅ Conexión exitosa a MySQL');
    console.log(`🗄️  Base de datos: ${config.database}`);
    console.log(`👤 Usuario: ${config.user}`);
    console.log(`🖥️  Host: ${config.host}`);
    
    // Obtener información del servidor
    const [rows] = await connection.query('SELECT VERSION() as version');
    console.log(`📊 Versión MySQL: ${rows[0].version}`);
    
    // Verificar tablas
    const [tables] = await connection.query(
      "SELECT TABLE_NAME FROM information_schema.TABLES WHERE TABLE_SCHEMA = ?",
      [config.database]
    );
    
    console.log(`\n📋 Tablas en la base de datos (${tables.length} total):`);
    tables.forEach(t => console.log(`   • ${t.TABLE_NAME}`));
    
    // Contar registros en tablas principales
    console.log('\n📊 Registros por tabla:');
    const mainTables = ['productos', 'categorias', 'pedidos', 'usuarios', 'mesas'];
    
    for (const table of mainTables) {
      try {
        const [count] = await connection.query(`SELECT COUNT(*) as total FROM ${table}`);
        console.log(`   • ${table}: ${count[0].total} registros`);
      } catch (err) {
        console.log(`   • ${table}: Error al contar`);
      }
    }
    
    connection.release();
    pool.end();
    process.exit(0);
  } catch (err) {
    console.error('❌ Error de conexión a MySQL:');
    console.error(`   ${err.message}`);
    
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      console.error('   → La conexión se cerró inesperadamente');
    } else if (err.code === 'ER_CON_COUNT_ERROR') {
      console.error('   → Demasiadas conexiones');
    } else if (err.code === 'ECONNREFUSED') {
      console.error('   → Conexión rechazada. ¿MySQL está corriendo?');
    } else if (err.code === 'ER_ACCESS_DENIED_ERROR') {
      console.error('   → Acceso denegado. Verifica usuario/contraseña');
    } else if (err.code === 'ER_BAD_DB_ERROR') {
      console.error('   → Base de datos no existe');
    }
    
    process.exit(1);
  }
}

checkConnection();
