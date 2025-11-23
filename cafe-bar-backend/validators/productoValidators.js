const { body, param } = require('express-validator');
exports.createProductoValidator = [
  body('nombre').isLength({ min: 2 }).withMessage('nombre inválido'),
  body('precio').isFloat({ min: 0 }).withMessage('precio inválido'),
  body('stock').optional().isInt({ min: 0 }).withMessage('stock inválido')
];

exports.productoIdParam = [ param('id').isInt({ min: 1 }).withMessage('id inválido') ];