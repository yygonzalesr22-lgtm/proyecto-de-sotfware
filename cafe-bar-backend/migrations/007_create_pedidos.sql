CREATE TABLE IF NOT EXISTS pedidos (
  id_pedido INT AUTO_INCREMENT PRIMARY KEY,
  id_mesa INT NOT NULL,
  mesero VARCHAR(100) NOT NULL,
  estado ENUM('abierto','cerrado','cancelado') DEFAULT 'abierto',
  total DECIMAL(10,2) DEFAULT 0,
  metodo_pago ENUM('efectivo','tarjeta','transferencia') DEFAULT NULL,
  monto_recibido DECIMAL(10,2) DEFAULT NULL,
  cambio DECIMAL(10,2) DEFAULT NULL,
  fecha_hora TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (id_mesa) REFERENCES mesas(id_mesa)
);
