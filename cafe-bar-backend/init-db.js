const { promisePool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Verificando estructura de tablas...\n');

    // Verificar estructura de tablas
    const [usuarios] = await promisePool.query('DESCRIBE usuarios');
    const [productos] = await promisePool.query('DESCRIBE productos');
    const [categorias] = await promisePool.query('DESCRIBE categorias');
    const [mesas] = await promisePool.query('DESCRIBE mesas');

    console.log('📋 Estructura de usuarios:', usuarios.map(c => c.Field).join(', '));
    console.log('📋 Estructura de productos:', productos.map(c => c.Field).join(', '));
    console.log('📋 Estructura de categorias:', categorias.map(c => c.Field).join(', '));
    console.log('📋 Estructura de mesas:', mesas.map(c => c.Field).join(', '));

    // 1. Usuario admin
    console.log('\n👤 Insertando usuario admin...');
    const hashedPassword = await bcrypt.hash('pass1234', 10);
    
    try {
      await promisePool.query(
        'INSERT IGNORE INTO usuarios (nombre_completo, usuario, password_hash, rol) VALUES (?, ?, ?, ?)',
        ['Admin User', 'admin@example.com', hashedPassword, 'admin']
      );
      console.log('✅ Usuario admin creado');
    } catch (e) {
      console.log('⚠️  Usuario ya existe');
    }

    // 2. Categorías
    console.log('\n📂 Insertando categorías...');
    const categoriaNames = ['Bebidas Calientes', 'Bebidas Frías', 'Alimentos', 'Snacks', 'Postres'];
    for (const nombre of categoriaNames) {
      try {
        await promisePool.query('INSERT IGNORE INTO categorias (nombre) VALUES (?)', [nombre]);
      } catch (e) {
        // Ignorar duplicados
      }
    }
    console.log(`✅ Categorías procesadas`);

    // 3. Mesas
    console.log('\n🪑 Insertando mesas...');
    for (let i = 1; i <= 8; i++) {
      try {
        await promisePool.query('INSERT IGNORE INTO mesas (numero, estado) VALUES (?, ?)', [i, 'disponible']);
      } catch (e) {
        // Ignorar duplicados
      }
    }
    console.log('✅ 8 mesas procesadas');

    console.log('\n✨ ¡Base de datos lista para usar!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
