const mysql = require('mysql2');
const fs = require('fs');

const conn = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: ''
});

conn.connect(err => {
  if (err) {
    console.error('Error de conexión:', err.message);
    process.exit(1);
  }

  // Crear base de datos
  conn.query('CREATE DATABASE IF NOT EXISTS `cafe-bar-bd`', (err) => {
    if (err) {
      console.error('Error al crear BD:', err.message);
      conn.end();
      process.exit(1);
    }

    console.log('✅ Base de datos cafe-bar-bd creada');

    // Cambiar a la base de datos
    conn.query('USE `cafe-bar-bd`', (err) => {
      if (err) {
        console.error('Error al seleccionar BD:', err.message);
        conn.end();
        process.exit(1);
      }

      // Leer el archivo SQL
      const sql = fs.readFileSync('../init_database.sql', 'utf8');
      const queries = sql.split(';').filter(q => q.trim());

      let index = 0;
      const executeQuery = () => {
        if (index >= queries.length) {
          console.log('✅ Base de datos inicializada correctamente');
          conn.end();
          process.exit(0);
          return;
        }

        const query = queries[index].trim() + ';';
        if (!query.replace(/;$/, '').trim()) {
          index++;
          executeQuery();
          return;
        }

        conn.query(query, (err) => {
          if (err) {
            console.error(`Error en query ${index + 1}:`, err.message);
            // Continuar con la siguiente query
          }
          index++;
          executeQuery();
        });
      };

      executeQuery();
    });
  });
});
