const { body, param } = require('express-validator');
exports.createPedidoValidator = [
  body('mesa_id').optional().isInt({ min: 1 }).withMessage('mesa_id inválido'),
  body('usuario_id').isInt({ min: 1 }).withMessage('usuario_id inválido'),
  body('items').isArray({ min: 1 }).withMessage('items debe ser un array con al menos 1 elemento'),
  body('items.*.producto_id').isInt({ min: 1 }).withMessage('producto_id inválido'),
  body('items.*.cantidad').isInt({ min: 1 }).withMessage('cantidad inválida'),
  body('items.*.precio').isFloat({ min: 0 }).withMessage('precio inválido'),
  body('total').isFloat({ min: 0 }).withMessage('total inválido')
];

exports.pedidoIdParam = [ param('id').isInt({ min: 1 }).withMessage('id de pedido inválido') ];

exports.updateEstadoValidator = [
  param('id').isInt({ min: 1 }).withMessage('id de pedido inválido'),
  body('estado').isIn(['pendiente','en_preparacion','listo','servido','cancelado']).withMessage('estado inválido')
];