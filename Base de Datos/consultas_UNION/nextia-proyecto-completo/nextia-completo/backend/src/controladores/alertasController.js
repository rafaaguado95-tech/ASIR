const db = require('../config/database');

// Obtener todas las alertas con filtros
exports.obtenerAlertas = async (req, res) => {
  try {
    const { tipo, gravedad, estado, fecha_desde, fecha_hasta, usuario_id } = req.query;

    let query = `
      SELECT 
        a.*,
        u.nombre as usuario_nombre,
        u.apellidos as usuario_apellidos,
        u2.nombre as resuelto_por_nombre,
        u2.apellidos as resuelto_por_apellidos,
        r.nombre as ruta_nombre,
        d.nombre as dispositivo_nombre,
        b.nombre as beacon_nombre
      FROM alertas a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN usuarios u2 ON a.resuelta_por = u2.id
      LEFT JOIN rutas r ON a.ruta_id = r.id
      LEFT JOIN dispositivos d ON a.dispositivo_id = d.id
      LEFT JOIN beacons b ON a.beacon_id = b.id
      WHERE 1=1
    `;

    const params = [];

    if (tipo) {
      query += ` AND a.tipo = ?`;
      params.push(tipo);
    }

    if (gravedad) {
      query += ` AND a.gravedad = ?`;
      params.push(gravedad);
    }

    // Estado ahora es un boolean (resuelta)
    if (estado === 'resuelta') {
      query += ` AND a.resuelta = TRUE`;
    } else if (estado === 'pendiente') {
      query += ` AND a.resuelta = FALSE`;
    }

    if (fecha_desde) {
      query += ` AND DATE(a.fecha_creacion) >= ?`;
      params.push(fecha_desde);
    }

    if (fecha_hasta) {
      query += ` AND DATE(a.fecha_creacion) <= ?`;
      params.push(fecha_hasta);
    }

    if (usuario_id) {
      query += ` AND a.usuario_id = ?`;
      params.push(usuario_id);
    }

    query += ` ORDER BY a.fecha_creacion DESC`;

    console.log('🔍 Ejecutando query alertas:', query.substring(0, 100) + '...');
    const [alertas] = await db.query(query, params);
    console.log(`✅ Se obtuvieron ${alertas.length} alertas`);
    res.json(alertas);
  } catch (error) {
    console.error('❌ Error al obtener alertas:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Error al obtener alertas',
      details: error.message 
    });
  }
};

// Obtener estadísticas de alertas
exports.obtenerEstadisticas = async (req, res) => {
  try {
    console.log('📊 Obteniendo estadísticas...');
    
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_alertas,
        SUM(CASE WHEN resuelta = FALSE THEN 1 ELSE 0 END) as pendientes,
        SUM(CASE WHEN resuelta = TRUE THEN 1 ELSE 0 END) as resueltas,
        SUM(CASE WHEN gravedad = 'critica' THEN 1 ELSE 0 END) as criticas,
        SUM(CASE WHEN gravedad = 'alta' THEN 1 ELSE 0 END) as altas,
        SUM(CASE WHEN gravedad = 'media' THEN 1 ELSE 0 END) as medias,
        SUM(CASE WHEN gravedad = 'baja' THEN 1 ELSE 0 END) as bajas
      FROM alertas
    `);

    // Alertas por día (últimos 7 días)
    const [porDia] = await db.query(`
      SELECT 
        DATE(fecha_creacion) as fecha,
        COUNT(*) as total,
        SUM(CASE WHEN gravedad = 'critica' THEN 1 ELSE 0 END) as criticas
      FROM alertas
      WHERE fecha_creacion >= DATE_SUB(NOW(), INTERVAL 7 DAY)
      GROUP BY DATE(fecha_creacion)
      ORDER BY fecha DESC
    `);

    // Alertas pendientes más antiguas
    const [pendientesAntiguas] = await db.query(`
      SELECT 
        a.*,
        u.nombre as usuario_nombre,
        u.apellidos as usuario_apellidos,
        r.nombre as ruta_nombre,
        b.nombre as beacon_nombre
      FROM alertas a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN rutas r ON a.ruta_id = r.id
      LEFT JOIN beacons b ON a.beacon_id = b.id
      WHERE a.resuelta = FALSE
      ORDER BY a.fecha_creacion ASC
      LIMIT 10
    `);

    console.log('✅ Estadísticas obtenidas');
    res.json({
      resumen: stats[0],
      por_dia: porDia,
      pendientes_antiguas: pendientesAntiguas
    });
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ 
      error: 'Error al obtener estadísticas',
      details: error.message 
    });
  }
};

// Crear nueva alerta
exports.crearAlerta = async (req, res) => {
  try {
    const {
      tipo,
      gravedad,
      titulo,
      descripcion,
      vigilante_id,
      ruta_id,
      beacon_id,
      pulsera_id,
      deteccion_id
    } = req.body;

    if (!tipo || !gravedad || !titulo) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    const [result] = await db.query(
      `INSERT INTO alertas (
        tipo, gravedad, titulo, descripcion,
        vigilante_id, ruta_id, beacon_id, pulsera_id, deteccion_id,
        estado, fecha_hora
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'pendiente', NOW())`,
      [tipo, gravedad, titulo, descripcion, vigilante_id, ruta_id, beacon_id, pulsera_id, deteccion_id]
    );

    const [alerta] = await db.query(
      'SELECT * FROM alertas WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json(alerta[0]);
  } catch (error) {
    console.error('Error al crear alerta:', error);
    res.status(500).json({ error: 'Error al crear alerta' });
  }
};

// Actualizar estado de alerta
exports.actualizarEstado = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado, notas } = req.body;
    const usuario_id = req.usuario?.id;

    console.log(`🔄 Actualizando alerta ${id} a estado: ${estado}`);

    // estado es 'resuelta' o 'pendiente'
    const resuelta = estado === 'resuelta' ? true : false;

    let query = 'UPDATE alertas SET resuelta = ?';
    let params = [resuelta];

    if (resuelta && usuario_id) {
      query += ', resuelta_por = ?, fecha_resolucion = NOW()';
      params.push(usuario_id);
    }

    if (notas) {
      query += ', mensaje = ?';
      params.push(notas);
    }

    query += ' WHERE id = ?';
    params.push(id);

    await db.query(query, params);

    const [alerta] = await db.query(
      `SELECT a.*, 
        u.nombre as usuario_nombre,
        u.apellidos as usuario_apellidos,
        u2.nombre as resuelto_por_nombre,
        u2.apellidos as resuelto_por_apellidos
      FROM alertas a
      LEFT JOIN usuarios u ON a.usuario_id = u.id
      LEFT JOIN usuarios u2 ON a.resuelta_por = u2.id
      WHERE a.id = ?`,
      [id]
    );

    console.log('✅ Alerta actualizada');
    res.json(alerta[0]);
  } catch (error) {
    console.error('❌ Error al actualizar alerta:', error.message);
    res.status(500).json({ 
      error: 'Error al actualizar alerta',
      details: error.message
    });
  }
};

// Marcar múltiples alertas como leídas
exports.marcarVariasLeidas = async (req, res) => {
  try {
    const { ids } = req.body;

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Se requiere un array de IDs' });
    }

    const placeholders = ids.map(() => '?').join(',');
    await db.query(
      `UPDATE alertas SET leida = TRUE WHERE id IN (${placeholders})`,
      ids
    );

    res.json({ mensaje: 'Alertas marcadas como leídas', cantidad: ids.length });
  } catch (error) {
    console.error('Error al marcar alertas:', error);
    res.status(500).json({ error: 'Error al marcar alertas' });
  }
};

// Eliminar alerta
exports.eliminarAlerta = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM alertas WHERE id = ?', [id]);

    res.json({ mensaje: 'Alerta eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar alerta:', error);
    res.status(500).json({ error: 'Error al eliminar alerta' });
  }
};

// Obtener configuración de alertas
exports.obtenerConfiguracion = async (req, res) => {
  try {
    console.log('⚙️  Obteniendo configuración...');
    
    const [config] = await db.query(`
      SELECT * FROM configuracion_alertas LIMIT 1
    `);

    if (config.length === 0) {
      console.log('ℹ️  No hay configuración en BD, devolviendo valores por defecto');
      // Valores por defecto
      return res.json({
        alerta_ronda_minutos: 30,
        alerta_fichaje_minutos: 15,
        alerta_bateria_porcentaje: 20,
        alerta_inactividad_horas: 24,
        notificaciones_email: true,
        notificaciones_push: false
      });
    }

    console.log('✅ Configuración obtenida');
    res.json(config[0]);
  } catch (error) {
    console.error('❌ Error al obtener configuración:', error.message);
    console.error('Stack:', error.stack);
    
    // Retornar valores por defecto si hay error (la tabla podría no existir)
    console.log('ℹ️  Devolviendo configuración por defecto debido a error');
    res.json({
      alerta_ronda_minutos: 30,
      alerta_fichaje_minutos: 15,
      alerta_bateria_porcentaje: 20,
      alerta_inactividad_horas: 24,
      notificaciones_email: true,
      notificaciones_push: false
    });
  }
};

// Actualizar configuración de alertas
exports.actualizarConfiguracion = async (req, res) => {
  try {
    const {
      alerta_ronda_minutos,
      alerta_fichaje_minutos,
      alerta_bateria_porcentaje,
      alerta_inactividad_horas,
      notificaciones_email,
      notificaciones_push
    } = req.body;

    const [existing] = await db.query('SELECT id FROM configuracion_alertas LIMIT 1');

    if (existing.length === 0) {
      await db.query(`
        INSERT INTO configuracion_alertas (
          alerta_ronda_minutos, alerta_fichaje_minutos, 
          alerta_bateria_porcentaje, alerta_inactividad_horas,
          notificaciones_email, notificaciones_push
        ) VALUES (?, ?, ?, ?, ?, ?)
      `, [
        alerta_ronda_minutos, alerta_fichaje_minutos,
        alerta_bateria_porcentaje, alerta_inactividad_horas,
        notificaciones_email, notificaciones_push
      ]);
    } else {
      await db.query(`
        UPDATE configuracion_alertas SET
          alerta_ronda_minutos = ?,
          alerta_fichaje_minutos = ?,
          alerta_bateria_porcentaje = ?,
          alerta_inactividad_horas = ?,
          notificaciones_email = ?,
          notificaciones_push = ?
        WHERE id = ?
      `, [
        alerta_ronda_minutos, alerta_fichaje_minutos,
        alerta_bateria_porcentaje, alerta_inactividad_horas,
        notificaciones_email, notificaciones_push,
        existing[0].id
      ]);
    }

    const [config] = await db.query('SELECT * FROM configuracion_alertas LIMIT 1');
    res.json(config[0]);
  } catch (error) {
    console.error('Error al actualizar configuración:', error);
    res.status(500).json({ error: 'Error al actualizar configuración' });
  }
};

module.exports = exports;
