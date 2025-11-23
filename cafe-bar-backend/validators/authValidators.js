const { body } = require('express-validator');

exports.registerValidator = [
  body('nombre').isLength({ min: 2 }).withMessage('Nombre debe tener al menos 2 caracteres'),
  body('email').isEmail().withMessage('Email inválido'),
  body('password').isLength({ min: 6 }).withMessage('Password mínimo 6 caracteres'),
  body('rol').optional().isIn(['admin','mesero','cliente']).withMessage('Rol inválido')
];

exports.loginValidator = [
  body('email').isEmail().withMessage('Email inválido'),
  body('password').exists().withMessage('Password requerido')
];