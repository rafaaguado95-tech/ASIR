const express = require('express');
const router = express.Router();
const beaconsController = require('../controladores/beaconsController');
const { verificarToken } = require('../middleware/auth');

// Todas las rutas requieren autenticación
router.use(verificarToken);

// Listar beacons
router.get('/', beaconsController.listarBeacons);

// Obtener estadísticas
router.get('/estadisticas', beaconsController.obtenerEstadisticas);

// Obtener beacon por ID
router.get('/:id', beaconsController.obtenerBeacon);

// Crear beacon
router.post('/', beaconsController.crearBeacon);

// Actualizar beacon
router.put('/:id', beaconsController.actualizarBeacon);

// Eliminar beacon
router.delete('/:id', beaconsController.eliminarBeacon);

// Actualizar última señal
router.patch('/:id/senal', beaconsController.actualizarUltimaSenal);

module.exports = router;
