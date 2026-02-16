
const express = require('express');
const router = express.Router();
const alertasController = require('../controladores/alertasController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// IMPORTANTE: Las rutas específicas DEBEN IR ANTES de las rutas con parámetros

// Obtener estadísticas
router.get('/estadisticas', alertasController.obtenerEstadisticas);

// Obtener configuración
router.get('/configuracion', alertasController.obtenerConfiguracion);

// Marcar múltiples alertas como leídas
router.post('/marcar-leidas', alertasController.marcarVariasLeidas);

// Actualizar estado de alerta (debe ir antes de :id)
router.put('/:id/estado', alertasController.actualizarEstado);

// Obtener alertas con filtros (ruta genérica)
router.get('/', alertasController.obtenerAlertas);

// Crear nueva alerta
router.post('/', alertasController.crearAlerta);

// Eliminar alerta
router.delete('/:id', alertasController.eliminarAlerta);

module.exports = router;
