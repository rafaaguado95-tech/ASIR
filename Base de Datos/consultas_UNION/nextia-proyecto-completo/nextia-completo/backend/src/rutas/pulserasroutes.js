const express = require('express');
const router = express.Router();
const pulserasController = require('../controladores/pulserascontroller');
const { verificarToken } = require('../middleware/auth');

// Aplicar middleware de autenticación a todas las rutas
router.use(verificarToken);

// =====================================================
// RUTAS DE PULSERAS BLE
// =====================================================

// GET - Obtener todas las pulseras
router.get('/', pulserasController.obtenerPulseras);

// GET - Obtener usuarios disponibles para asignar (vigilantes o trabajadores)
router.get('/usuarios-disponibles', pulserasController.obtenerUsuariosDisponibles);

// GET - Obtener pulsera por ID
router.get('/:id', pulserasController.obtenerPulseraPorId);

// POST - Crear nueva pulsera
router.post('/', pulserasController.crearPulsera);

// PUT - Actualizar pulsera
router.put('/:id', pulserasController.actualizarPulsera);

// PATCH - Actualizar solo batería
router.patch('/:id/bateria', pulserasController.actualizarBateria);

// DELETE - Eliminar pulsera
router.delete('/:id', pulserasController.eliminarPulsera);

module.exports = router;
