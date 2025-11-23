-- 001_create_usuarios.sql
CREATE TABLE IF NOT EXISTS usuarios (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  rol ENUM('admin', 'mesero', 'cliente') DEFAULT 'cliente',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar un usuario administrador inicial (puedes cambiar los valores luego)
INSERT INTO usuarios (nombre, email, password, rol)
VALUES (
  'Administrador',
  'andrea@gmail.com',
  -- Contraseña encriptada con bcrypt para "admin1234"
  '$2b$10$1Q3tUfQtvbQx1C.zc9uvHOyIGzRyY6XWimLDjq8ZtGeSh1sxE.KsK',
  'admin'
);
