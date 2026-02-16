const express = require('express');
const router = express.Router();
const rutasController = require('../controladores/rutasController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Listar rutas
router.get('/', rutasController.listarRutas);

// Obtener ruta por ID
router.get('/:id', rutasController.obtenerRuta);

// Crear ruta
router.post('/', rutasController.crearRuta);

// Actualizar ruta
router.put('/:id', rutasController.actualizarRuta);

// Eliminar ruta
router.delete('/:id', rutasController.eliminarRuta);

// Obtener cumplimiento de ruta
router.get('/:id/cumplimiento', rutasController.obtenerCumplimiento);

module.exports = router;
