const db = require('../config/database');

// =====================================================
// LISTAR TODAS LAS DETECCIONES CON FILTROS
// =====================================================
exports.listarDetecciones = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;
    const { 
      usuario_id, 
      ruta_id, 
      beacon_id, 
      fecha_desde, 
      fecha_hasta,
      cumplimiento,
      limite = 100 
    } = req.query;

    let query = `
      SELECT 
        d.id,
        d.fecha_hora,
        d.cumplimiento,
        d.latitud,
        d.longitud,
        d.rssi,
        d.notas,
        u.nombre as vigilante_nombre,
        u.apellidos as vigilante_apellidos,
        r.nombre as ruta_nombre,
        r.color as ruta_color,
        b.nombre as beacon_nombre,
        b.ubicacion as beacon_ubicacion
      FROM detecciones d
      INNER JOIN usuarios u ON d.usuario_id = u.id
      LEFT JOIN rutas r ON d.ruta_id = r.id
      LEFT JOIN beacons b ON d.beacon_id = b.id
      WHERE d.empresa_id = ?
    `;

    const params = [empresa_id || 1];

    // Filtros opcionales
    if (usuario_id) {
      query += ' AND d.usuario_id = ?';
      params.push(usuario_id);
    }

    if (ruta_id) {
      query += ' AND d.ruta_id = ?';
      params.push(ruta_id);
    }

    if (beacon_id) {
      query += ' AND d.beacon_id = ?';
      params.push(beacon_id);
    }

    if (fecha_desde) {
      query += ' AND d.fecha_hora >= ?';
      params.push(fecha_desde);
    }

    if (fecha_hasta) {
      query += ' AND d.fecha_hora <= ?';
      params.push(fecha_hasta);
    }

    if (cumplimiento !== undefined) {
      query += ' AND d.cumplimiento = ?';
      params.push(cumplimiento === 'true' || cumplimiento === '1');
    }

    query += ' ORDER BY d.fecha_hora DESC LIMIT ?';
    params.push(parseInt(limite));

    const [detecciones] = await db.query(query, params);

    res.json(detecciones);
  } catch (error) {
    console.error('Error al listar detecciones:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// =====================================================
// OBTENER DETECCIÓN POR ID
// =====================================================
exports.obtenerDeteccion = async (req, res) => {
  try {
    const { id } = req.params;

    const [detecciones] = await db.query(`
      SELECT 
        d.*,
        u.nombre as vigilante_nombre,
        u.apellidos as vigilante_apellidos,
        u.email as vigilante_email,
        r.nombre as ruta_nombre,
        r.tipo_programacion,
        b.nombre as beacon_nombre,
        b.uuid as beacon_uuid,
        b.ubicacion as beacon_ubicacion
      FROM detecciones d
      INNER JOIN usuarios u ON d.usuario_id = u.id
      LEFT JOIN rutas r ON d.ruta_id = r.id
      LEFT JOIN beacons b ON d.beacon_id = b.id
      WHERE d.id = ?
    `, [id]);

    if (detecciones.length === 0) {
      return res.status(404).json({ error: 'Detección no encontrada' });
    }

    res.json(detecciones[0]);
  } catch (error) {
    console.error('Error al obtener detección:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// =====================================================
// OBTENER ESTADÍSTICAS DE DETECCIONES
// =====================================================
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;
    const { fecha_desde, fecha_hasta } = req.query;

    let whereClause = 'WHERE d.empresa_id = ?';
    const params = [empresa_id || 1];

    if (fecha_desde) {
      whereClause += ' AND d.fecha_hora >= ?';
      params.push(fecha_desde);
    }

    if (fecha_hasta) {
      whereClause += ' AND d.fecha_hora <= ?';
      params.push(fecha_hasta);
    }

    const [estadisticas] = await db.query(`
      SELECT 
        COUNT(*) as total_detecciones,
        COUNT(CASE WHEN cumplimiento = TRUE THEN 1 END) as detecciones_exitosas,
        COUNT(CASE WHEN cumplimiento = FALSE THEN 1 END) as detecciones_fallidas,
        COUNT(DISTINCT usuario_id) as vigilantes_activos,
        COUNT(DISTINCT beacon_id) as beacons_visitados,
        COUNT(DISTINCT ruta_id) as rutas_activas,
        ROUND(AVG(CASE WHEN cumplimiento = TRUE THEN 100 ELSE 0 END), 2) as porcentaje_cumplimiento
      FROM detecciones d
      ${whereClause}
    `, params);

    // Detecciones por día (últimos 7 días)
    const [deteccionesPorDia] = await db.query(`
      SELECT 
        DATE(fecha_hora) as fecha,
        COUNT(*) as total,
        COUNT(CASE WHEN cumplimiento = TRUE THEN 1 END) as exitosas,
        COUNT(CASE WHEN cumplimiento = FALSE THEN 1 END) as fallidas
      FROM detecciones
      WHERE empresa_id = ? AND fecha_hora >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(fecha_hora)
      ORDER BY fecha DESC
    `, [empresa_id || 1]);

    // Top 5 beacons más visitados
    const [topBeacons] = await db.query(`
      SELECT 
        b.id,
        b.nombre,
        COUNT(*) as total_visitas
      FROM detecciones d
      INNER JOIN beacons b ON d.beacon_id = b.id
      ${whereClause}
      GROUP BY b.id, b.nombre
      ORDER BY total_visitas DESC
      LIMIT 5
    `, params);

    // Top 5 vigilantes más activos
    const [topVigilantes] = await db.query(`
      SELECT 
        u.id,
        u.nombre,
        u.apellidos,
        COUNT(*) as total_detecciones,
        COUNT(CASE WHEN d.cumplimiento = TRUE THEN 1 END) as exitosas
      FROM detecciones d
      INNER JOIN usuarios u ON d.usuario_id = u.id
      ${whereClause}
      GROUP BY u.id, u.nombre, u.apellidos
      ORDER BY total_detecciones DESC
      LIMIT 5
    `, params);

    res.json({
      resumen: estadisticas[0],
      detecciones_por_dia: deteccionesPorDia,
      top_beacons: topBeacons,
      top_vigilantes: topVigilantes
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// =====================================================
// OBTENER DETECCIONES RECIENTES (TIMELINE)
// =====================================================
exports.obtenerRecientes = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;
    const { limite = 20 } = req.query;

    const [detecciones] = await db.query(`
      SELECT 
        d.id,
        d.fecha_hora,
        d.cumplimiento,
        u.nombre as vigilante_nombre,
        u.apellidos as vigilante_apellidos,
        r.nombre as ruta_nombre,
        r.color as ruta_color,
        b.nombre as beacon_nombre
      FROM detecciones d
      INNER JOIN usuarios u ON d.usuario_id = u.id
      LEFT JOIN rutas r ON d.ruta_id = r.id
      LEFT JOIN beacons b ON d.beacon_id = b.id
      WHERE d.empresa_id = ?
      ORDER BY d.fecha_hora DESC
      LIMIT ?
    `, [empresa_id || 1, parseInt(limite)]);

    res.json(detecciones);
  } catch (error) {
    console.error('Error al obtener detecciones recientes:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// =====================================================
// CREAR DETECCIÓN MANUAL
// =====================================================
exports.crearDeteccion = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;
    const {
      usuario_id,
      ruta_id,
      beacon_id,
      cumplimiento,
      latitud,
      longitud,
      rssi,
      notas
    } = req.body;

    // Validaciones
    if (!usuario_id || !beacon_id) {
      return res.status(400).json({ error: 'Usuario y beacon son requeridos' });
    }

    const [resultado] = await db.query(`
      INSERT INTO detecciones (
        empresa_id, usuario_id, ruta_id, beacon_id,
        fecha_hora, cumplimiento, latitud, longitud, rssi, notas
      ) VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?, ?)
    `, [
      empresa_id || 1,
      usuario_id,
      ruta_id || null,
      beacon_id,
      cumplimiento !== undefined ? cumplimiento : true,
      latitud || null,
      longitud || null,
      rssi || null,
      notas || null
    ]);

    res.status(201).json({
      mensaje: 'Detección registrada correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al crear detección:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// =====================================================
// ELIMINAR DETECCIÓN
// =====================================================
exports.eliminarDeteccion = async (req, res) => {
  try {
    const { id } = req.params;

    const [resultado] = await db.query(
      'DELETE FROM detecciones WHERE id = ?',
      [id]
    );

    if (resultado.affectedRows === 0) {
      return res.status(404).json({ error: 'Detección no encontrada' });
    }

    res.json({ mensaje: 'Detección eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar detección:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
