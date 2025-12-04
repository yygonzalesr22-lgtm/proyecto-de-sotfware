const { promisePool } = require('../config/database');
const { validationResult } = require('express-validator');

// Crear nuevo pedido
exports.crearPedido = async (req, res) => {
  try {
    const { id_mesa, mesero } = req.body;

    const [result] = await promisePool.query(
      'INSERT INTO pedidos (id_mesa, mesero, estado, fecha_hora) VALUES (?, ?, ?, NOW())',
      [id_mesa, mesero, 'pendiente']
    );

    res.json({ 
      success: true, 
      id_pedido: result.insertId,
      msg: 'Pedido creado correctamente' 
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error al crear pedido', error: err.message });
  }
};

// Agregar producto a pedido
exports.agregarProductoAPedido = async (req, res) => {
  try {
    const { id_producto, cantidad } = req.body;
    const { id } = req.params;

    // Verificar si el producto ya está en el pedido
    const [existing] = await promisePool.query(
      'SELECT * FROM detalle_pedidos WHERE id_pedido = ? AND id_producto = ?',
      [id, id_producto]
    );

    if (existing.length > 0) {
      // Actualizar cantidad si ya existe
      await promisePool.query(
        'UPDATE detalle_pedidos SET cantidad = cantidad + ? WHERE id_pedido = ? AND id_producto = ?',
        [cantidad, id, id_producto]
      );
    } else {
      // Obtener precio del producto
      const [product] = await promisePool.query(
        'SELECT precio FROM productos WHERE id_producto = ?',
        [id_producto]
      );

      if (product.length === 0) {
        return res.status(404).json({ msg: 'Producto no encontrado' });
      }

      // Insertar nuevo detalle
      await promisePool.query(
        'INSERT INTO detalle_pedidos (id_pedido, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)',
        [id, id_producto, cantidad, product[0].precio]
      );
    }

    res.json({ success: true, msg: 'Producto agregado al pedido' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al agregar producto', error: err.message });
  }
};

// Obtener pedidos activos
exports.obtenerPedidosActivos = async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM pedidos WHERE estado != "cancelado" ORDER BY fecha_hora DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener pedidos', error: err.message });
  }
};

// Obtener pedido por ID
exports.obtenerPedidoPorId = async (req, res) => {
  try {
    const { id } = req.params;

    const [pedido] = await promisePool.query(
      'SELECT * FROM pedidos WHERE id_pedido = ?',
      [id]
    );

    if (pedido.length === 0) {
      return res.status(404).json({ msg: 'Pedido no encontrado' });
    }

    const [detalles] = await promisePool.query(
      'SELECT dp.*, p.nombre FROM detalle_pedidos dp JOIN productos p ON dp.id_producto = p.id_producto WHERE dp.id_pedido = ?',
      [id]
    );

    res.json({ ...pedido[0], detalles });
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener pedido', error: err.message });
  }
};

// Listar todos los pedidos
exports.list = async (req, res) => {
  try {
    const [rows] = await promisePool.query(
      'SELECT * FROM pedidos ORDER BY fecha_hora DESC'
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ msg: 'Error al listar pedidos', error: err.message });
  }
};

// Cerrar pedido (facturar)
exports.cerrarPedido = async (req, res) => {
  try {
    const { id } = req.params;
    const { metodo_pago, monto_recibido } = req.body;

    // Calcular total
    const [detalles] = await promisePool.query(
      'SELECT SUM(cantidad * precio_unitario) as total FROM detalle_pedidos WHERE id_pedido = ?',
      [id]
    );

    const total = detalles[0].total || 0;
    const cambio = monto_recibido - total;

    await promisePool.query(
      'UPDATE pedidos SET estado = ?, metodo_pago = ?, monto_recibido = ?, cambio = ? WHERE id_pedido = ?',
      ['cerrado', metodo_pago, monto_recibido, cambio, id]
    );

    res.json({ 
      success: true, 
      msg: 'Pedido cerrado correctamente',
      total,
      cambio
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error al cerrar pedido', error: err.message });
  }
};

// Cancelar pedido
exports.cancelarPedido = async (req, res) => {
  try {
    const { id } = req.params;

    await promisePool.query(
      'UPDATE pedidos SET estado = ? WHERE id_pedido = ?',
      ['cancelado', id]
    );

    res.json({ success: true, msg: 'Pedido cancelado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al cancelar pedido', error: err.message });
  }
};

// Actualizar estado del pedido
exports.updateEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    await promisePool.query(
      'UPDATE pedidos SET estado = ? WHERE id_pedido = ?',
      [estado, id]
    );

    res.json({ success: true, msg: 'Estado actualizado' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar estado', error: err.message });
  }
};
