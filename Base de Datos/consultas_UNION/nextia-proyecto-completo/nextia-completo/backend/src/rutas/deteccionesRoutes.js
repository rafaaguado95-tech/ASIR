const express = require('express');
const router = express.Router();
const deteccionesController = require('../controladores/deteccionesController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// IMPORTANTE: Rutas específicas ANTES de rutas con parámetros

// Obtener estadísticas
router.get('/estadisticas', deteccionesController.obtenerEstadisticas);

// Obtener detecciones recientes (timeline)
router.get('/recientes', deteccionesController.obtenerRecientes);

// Listar todas las detecciones (con filtros)
router.get('/', deteccionesController.listarDetecciones);

// Crear detección manual
router.post('/', deteccionesController.crearDeteccion);

// Obtener detección por ID
router.get('/:id', deteccionesController.obtenerDeteccion);

// Eliminar detección
router.delete('/:id', deteccionesController.eliminarDeteccion);

module.exports = router;
