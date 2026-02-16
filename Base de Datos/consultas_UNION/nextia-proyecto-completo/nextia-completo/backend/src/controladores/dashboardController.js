const db = require('../config/database');

exports.obtenerResumen = async (req, res) => {
  try {
    const [stats] = await db.query(`
      SELECT 
        (SELECT COUNT(*) FROM detecciones WHERE DATE(fecha_hora) = CURDATE()) as rondas_hoy,
        (SELECT COUNT(*) FROM usuarios WHERE rol = 'vigilante' AND activo = TRUE) as vigilantes_online,
        (SELECT COUNT(*) FROM usuarios WHERE rol = 'vigilante') as total_vigilantes,
        (SELECT COUNT(*) FROM alertas WHERE resuelta = FALSE) as alertas_activas,
        (SELECT COUNT(*) FROM dispositivos WHERE estado = 'activo') as dispositivos_activos,
        (SELECT COUNT(*) FROM dispositivos) as total_dispositivos
    `);

    res.json(stats[0] || {});
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.obtenerActividadTiempoReal = async (req, res) => {
  try {
    const [actividad] = await db.query(`
      SELECT 
        d.id,
        CONCAT(u.nombre, ' ', COALESCE(u.apellidos, '')) as vigilante,
        b.nombre as punto,
        r.nombre as ruta,
        d.rssi,
        d.fecha_hora,
        TIMESTAMPDIFF(MINUTE, d.fecha_hora, NOW()) as minutos_transcurridos
      FROM detecciones d
      JOIN usuarios u ON d.usuario_id = u.id
      JOIN beacons b ON d.beacon_id = b.id
      LEFT JOIN rutas r ON d.ruta_id = r.id
      WHERE d.fecha_hora >= DATE_SUB(NOW(), INTERVAL 2 HOUR)
      ORDER BY d.fecha_hora DESC
      LIMIT 20
    `);

    res.json(actividad);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.obtenerEstadisticas = async (req, res) => {
  try {
    res.json({ mensaje: 'Estadísticas próximamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
