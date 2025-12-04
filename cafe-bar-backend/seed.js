const { promisePool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  try {
    console.log('🌱 Sembrando datos de prueba...\n');

    // 1. Usuario admin
    console.log('👤 Insertando usuario admin...');
    const hashedPassword = await bcrypt.hash('pass1234', 10);
    
    await promisePool.query(
      'INSERT IGNORE INTO usuarios (id_usuario, nombre_completo, usuario, password_hash, rol) VALUES (?, ?, ?, ?, ?)',
      [8, 'Admin User', 'admin@example.com', hashedPassword, 'admin']
    );
    console.log('✅ Usuario admin creado/verificado');

    // 2. Categorías
    console.log('\n📂 Insertando categorías...');
    const categorias = ['Bebidas Calientes', 'Bebidas Frías', 'Alimentos', 'Snacks', 'Postres'];
    for (const nombre of categorias) {
      await promisePool.query('INSERT IGNORE INTO categorias (nombre) VALUES (?)', [nombre]);
    }
    console.log(`✅ ${categorias.length} categorías creadas`);

    // 3. Productos
    console.log('\n🍕 Insertando productos...');
    const [categoriaResult] = await promisePool.query('SELECT id, nombre FROM categorias');
    const categoriaMap = {};
    categoriaResult.forEach(cat => {
      categoriaMap[cat.nombre] = cat.id;
    });

    const productos = [
      { nombre: 'Café Americano', precio: 2500, categoria: 'Bebidas Calientes', unidad: 'taza' },
      { nombre: 'Café Latte', precio: 3500, categoria: 'Bebidas Calientes', unidad: 'taza' },
      { nombre: 'Cappuccino', precio: 3500, categoria: 'Bebidas Calientes', unidad: 'taza' },
      { nombre: 'Té Verde', precio: 2000, categoria: 'Bebidas Calientes', unidad: 'taza' },
      { nombre: 'Té Negro', precio: 2000, categoria: 'Bebidas Calientes', unidad: 'taza' },
      { nombre: 'Espresso', precio: 2000, categoria: 'Bebidas Calientes', unidad: 'shot' },
      { nombre: 'Macchiato', precio: 3000, categoria: 'Bebidas Calientes', unidad: 'taza' },
      { nombre: 'Café con Leche', precio: 2800, categoria: 'Bebidas Calientes', unidad: 'taza' },
      { nombre: 'Agua Fría', precio: 1500, categoria: 'Bebidas Frías', unidad: 'vaso' },
      { nombre: 'Jugo Natural', precio: 4000, categoria: 'Bebidas Frías', unidad: 'vaso' },
      { nombre: 'Refresco', precio: 3000, categoria: 'Bebidas Frías', unidad: 'lata' },
      { nombre: 'Iced Coffee', precio: 4000, categoria: 'Bebidas Frías', unidad: 'vaso' },
      { nombre: 'Sándwich de Jamón', precio: 8000, categoria: 'Alimentos', unidad: 'pieza' },
      { nombre: 'Sándwich Vegetal', precio: 7000, categoria: 'Alimentos', unidad: 'pieza' },
      { nombre: 'Ensalada Mixta', precio: 9000, categoria: 'Alimentos', unidad: 'plato' },
      { nombre: 'Pasta Carbonara', precio: 12000, categoria: 'Alimentos', unidad: 'plato' },
      { nombre: 'Galletas', precio: 3500, categoria: 'Snacks', unidad: 'paquete' },
      { nombre: 'Papas Fritas', precio: 4000, categoria: 'Snacks', unidad: 'bolsa' },
      { nombre: 'Frutos Secos', precio: 5000, categoria: 'Snacks', unidad: 'porción' },
      { nombre: 'Chocolate', precio: 2500, categoria: 'Snacks', unidad: 'barra' },
      { nombre: 'Brownie', precio: 4500, categoria: 'Postres', unidad: 'pieza' },
      { nombre: 'Cheesecake', precio: 6000, categoria: 'Postres', unidad: 'porción' },
      { nombre: 'Tiramisú', precio: 5500, categoria: 'Postres', unidad: 'porción' },
      { nombre: 'Helado', precio: 4000, categoria: 'Postres', unidad: 'bola' }
    ];

    for (const producto of productos) {
      const idCategoria = categoriaMap[producto.categoria];
      if (idCategoria) {
        await promisePool.query(
          'INSERT IGNORE INTO productos (nombre, precio, id_categoria, unidad_medida) VALUES (?, ?, ?, ?)',
          [producto.nombre, producto.precio, idCategoria, producto.unidad]
        );
      }
    }
    console.log(`✅ Productos creados`);

    // 4. Mesas
    console.log('\n🪑 Insertando mesas...');
    for (let i = 1; i <= 8; i++) {
      await promisePool.query(
        'INSERT IGNORE INTO mesas (numero, estado) VALUES (?, ?)',
        [i, 'disponible']
      );
    }
    console.log('✅ 8 mesas creadas');

    // 5. Inventario
    console.log('\n📦 Llenando inventario...');
    const [productosExistentes] = await promisePool.query('SELECT id_producto FROM productos');
    
    for (const prod of productosExistentes) {
      await promisePool.query(
        'INSERT IGNORE INTO inventario (producto_id, cantidad, minimo) VALUES (?, ?, ?)',
        [prod.id_producto, 50, 10]
      );
    }
    console.log(`✅ Inventario de ${productosExistentes.length} productos creado`);

    console.log('\n✨ ¡Base de datos lista!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedDatabase();
