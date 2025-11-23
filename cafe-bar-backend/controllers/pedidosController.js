const express = require('express');
const router = express.Router();

const { verifyToken, hasRole } = require('../middleware/authMiddleware');
const ctrl = require('../controllers/pedidosController');

const { body } = require('express-validator');

/* ------------------ RUTAS REALES SEGÚN TU CONTROLADOR ------------------ */

// Obtener pedidos activos
router.get('/activos', verifyToken, hasRole(['admin', 'mesero']), ctrl.obtenerPedidosActivos);

// Obtener pedido por ID
router.get('/:id', verifyToken, hasRole(['admin', 'mesero']), ctrl.obtenerPedidoPorId);

// Crear pedido
router.post('/',
    verifyToken,
    hasRole(['admin', 'mesero']),
    [
        body('id_mesa').notEmpty().withMessage('La mesa es obligatoria'),
        body('mesero').notEmpty().withMessage('El nombre del mesero es obligatorio')
    ],
    ctrl.crearPedido
);

// Agregar producto a pedido
router.post('/:id/agregar',
    verifyToken,
    hasRole(['admin', 'mesero']),
    [
        body('id_producto').notEmpty(),
        body('cantidad').isInt({ min: 1 })
    ],
    ctrl.agregarProductoAPedido
);

// Cerrar pedido (facturar)
router.post('/:id/cerrar',
    verifyToken,
    hasRole(['admin', 'mesero']),
    [
        body('metodo_pago').notEmpty(),
        body('monto_recibido').isFloat({ min: 0 })
    ],
    ctrl.cerrarPedido
);

// Cancelar pedido
router.post('/:id/cancelar',
    verifyToken,
    hasRole(['admin', 'mesero']),
    ctrl.cancelarPedido
);

// Listar pedidos (admin)
router.get('/', verifyToken, hasRole(['admin', 'mesero']), ctrl.list);

// Actualizar estado
router.put('/:id/estado',
    verifyToken,
    hasRole(['admin', 'mesero']),
    [
        body('estado')
            .isIn(['abierto', 'pendiente', 'en_proceso', 'entregado', 'cancelado'])
            .withMessage('Estado inválido'),
    ],
    ctrl.updateEstado
);

module.exports = router;
