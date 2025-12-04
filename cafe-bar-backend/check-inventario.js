const { promisePool } = require('./config/database');

async function checkInventario() {
  try {
    console.log('Conectando a MySQL...');
    const [rows] = await promisePool.query(`
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
      LIMIT 5
    `);
    console.log('Resultados:');
    console.log(JSON.stringify(rows, null, 2));
    console.log(`\n✅ Total de registros encontrados: ${rows.length}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

checkInventario();
