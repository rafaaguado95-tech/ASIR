const express = require('express');
const router = express.Router();
const dashboardController = require('../controladores/dashboardController');
const { verificarToken } = require('../middleware/auth');

router.get('/resumen', verificarToken, dashboardController.obtenerResumen);
router.get('/actividad', verificarToken, dashboardController.obtenerActividadTiempoReal);
router.get('/estadisticas', verificarToken, dashboardController.obtenerEstadisticas);

module.exports = router;
