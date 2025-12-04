const { promisePool } = require('./config/database');

async function populateInventario() {
  try {
    console.log('Obteniendo todos los productos...');
    const [productos] = await promisePool.query('SELECT id_producto FROM productos');
    console.log(`Encontrados ${productos.length} productos`);
    
    if (productos.length === 0) {
      console.log('❌ No hay productos en la base de datos');
      process.exit(1);
    }
    
    console.log('\nInsertando registros de inventario...');
    for (const producto of productos) {
      try {
        await promisePool.query(
          'INSERT INTO inventario (producto_id, cantidad, minimo) VALUES (?, ?, ?)',
          [producto.id_producto, 50, 10]
        );
      } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          // Ya existe
          continue;
        }
        throw err;
      }
    }
    
    console.log('✅ Inventario poblado exitosamente');
    
    // Verificar resultados
    const [rows] = await promisePool.query(`
      SELECT COUNT(*) as total FROM inventario
    `);
    console.log(`Total de registros en inventario: ${rows[0].total}`);
    
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

populateInventario();
