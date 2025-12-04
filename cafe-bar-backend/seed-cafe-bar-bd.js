const { promisePool } = require('./config/database');
const bcrypt = require('bcryptjs');

async function seedCafeBarBD() {
  try {
    console.log('🌱 Sembrando datos en cafe-bar-bd...\n');

    // 1. Crear usuario admin
    console.log('👤 Insertando usuario admin...');
    const hashedPassword = await bcrypt.hash('pass1234', 10);
    
    await promisePool.query(
      'INSERT INTO usuarios (nombre, email, password, role, activo) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE email=VALUES(email)',
      ['Admin', 'admin@example.com', hashedPassword, 'admin', true]
    );
    console.log('✅ Usuario admin@example.com creado');

    // 2. Crear categorías
    console.log('\n📂 Insertando categorías...');
    const categorias = [
      { nombre: 'Bebidas Calientes', descripcion: 'Café, té y bebidas calientes' },
      { nombre: 'Bebidas Frías', descripcion: 'Refrescos, jugos y bebidas frías' },
      { nombre: 'Alimentos', descripcion: 'Alimentos principales' },
      { nombre: 'Snacks', descripcion: 'Snacks y bocadillos' },
      { nombre: 'Postres', descripcion: 'Postres y dulces' }
    ];

    for (const cat of categorias) {
      await promisePool.query(
        'INSERT INTO categorias (nombre, descripcion, activa) VALUES (?, ?, 1) ON DUPLICATE KEY UPDATE nombre=VALUES(nombre)',
        [cat.nombre, cat.descripcion]
      );
    }
    console.log(`✅ ${categorias.length} categorías creadas`);

    // 3. Crear productos
    console.log('\n🍕 Insertando productos...');
    const productos = [
      { nombre: 'Café Americano', precio: 2500, categoria: 'Bebidas Calientes' },
      { nombre: 'Café Latte', precio: 3500, categoria: 'Bebidas Calientes' },
      { nombre: 'Cappuccino', precio: 3500, categoria: 'Bebidas Calientes' },
      { nombre: 'Té Verde', precio: 2000, categoria: 'Bebidas Calientes' },
      { nombre: 'Té Negro', precio: 2000, categoria: 'Bebidas Calientes' },
      { nombre: 'Espresso', precio: 2000, categoria: 'Bebidas Calientes' },
      { nombre: 'Macchiato', precio: 3000, categoria: 'Bebidas Calientes' },
      { nombre: 'Café con Leche', precio: 2800, categoria: 'Bebidas Calientes' },
      { nombre: 'Agua Fría', precio: 1500, categoria: 'Bebidas Frías' },
      { nombre: 'Jugo Natural', precio: 4000, categoria: 'Bebidas Frías' },
      { nombre: 'Refresco', precio: 3000, categoria: 'Bebidas Frías' },
      { nombre: 'Iced Coffee', precio: 4000, categoria: 'Bebidas Frías' },
      { nombre: 'Sándwich de Jamón', precio: 8000, categoria: 'Alimentos' },
      { nombre: 'Sándwich Vegetal', precio: 7000, categoria: 'Alimentos' },
      { nombre: 'Ensalada Mixta', precio: 9000, categoria: 'Alimentos' },
      { nombre: 'Pasta Carbonara', precio: 12000, categoria: 'Alimentos' },
      { nombre: 'Galletas', precio: 3500, categoria: 'Snacks' },
      { nombre: 'Papas Fritas', precio: 4000, categoria: 'Snacks' },
      { nombre: 'Frutos Secos', precio: 5000, categoria: 'Snacks' },
      { nombre: 'Chocolate', precio: 2500, categoria: 'Snacks' },
      { nombre: 'Brownie', precio: 4500, categoria: 'Postres' },
      { nombre: 'Cheesecake', precio: 6000, categoria: 'Postres' },
      { nombre: 'Tiramisú', precio: 5500, categoria: 'Postres' },
      { nombre: 'Helado', precio: 4000, categoria: 'Postres' }
    ];

    let productoCount = 0;
    for (const prod of productos) {
      const [catResult] = await promisePool.query(
        'SELECT id FROM categorias WHERE nombre = ?',
        [prod.categoria]
      );
      
      if (catResult.length > 0) {
        await promisePool.query(
          'INSERT INTO productos (nombre, precio, categoria_id, activo) VALUES (?, ?, ?, 1)',
          [prod.nombre, prod.precio, catResult[0].id]
        );
        productoCount++;
      }
    }
    console.log(`✅ ${productoCount} productos creados`);

    console.log('\n✨ ¡Base de datos sembrizada exitosamente!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error:', err.message);
    process.exit(1);
  }
}

seedCafeBarBD();
