const express = require('express');
const router = express.Router();
const vigilantesController = require('../controladores/vigilantesController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// IMPORTANTE: Las rutas específicas ANTES de las rutas con parámetros dinámicos

// Obtener estadísticas (DEBE IR ANTES de /:id)
router.get('/estadisticas', vigilantesController.obtenerEstadisticas);

// Listar vigilantes
router.get('/', vigilantesController.listarVigilantes);

// Crear vigilante
router.post('/', vigilantesController.crearVigilante);

// Obtener vigilante por ID (DESPUÉS de rutas específicas)
router.get('/:id', vigilantesController.obtenerVigilante);

// Actualizar vigilante
router.put('/:id', vigilantesController.actualizarVigilante);

// Eliminar vigilante
router.delete('/:id', vigilantesController.eliminarVigilante);

// Obtener historial de actividad (ANTES de otras rutas con /:id/)
router.get('/:id/historial', vigilantesController.obtenerHistorial);

// Asignar dispositivo
router.post('/:id/asignar-dispositivo', vigilantesController.asignarDispositivo);

// Desasignar dispositivo
router.delete('/:id/desasignar-dispositivo', vigilantesController.desasignarDispositivo);

module.exports = router;