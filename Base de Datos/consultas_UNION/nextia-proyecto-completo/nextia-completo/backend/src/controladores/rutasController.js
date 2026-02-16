const db = require('../config/database');

// Listar todas las rutas
exports.listarRutas = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;

    const [rutas] = await db.query(`
      SELECT 
        r.*,
        CONCAT(u.nombre, ' ', COALESCE(u.apellidos, '')) as vigilante_nombre,
        (SELECT COUNT(*) FROM puntos_control_ruta WHERE ruta_id = r.id) as total_puntos
      FROM rutas r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.empresa_id = ?
      ORDER BY r.fecha_creacion DESC
    `, [empresa_id || 1]);

    res.json(rutas);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener una ruta por ID
exports.obtenerRuta = async (req, res) => {
  try {
    const { id } = req.params;

    const [rutas] = await db.query(`
      SELECT 
        r.*,
        CONCAT(u.nombre, ' ', COALESCE(u.apellidos, '')) as vigilante_nombre
      FROM rutas r
      LEFT JOIN usuarios u ON r.usuario_id = u.id
      WHERE r.id = ?
    `, [id]);

    if (rutas.length === 0) {
      return res.status(404).json({ error: 'Ruta no encontrada' });
    }

    // Obtener puntos de control de la ruta
    const [puntos] = await db.query(`
      SELECT 
        pcr.*,
        b.nombre as beacon_nombre,
        b.ubicacion,
        b.edificio,
        b.planta
      FROM puntos_control_ruta pcr
      JOIN beacons b ON pcr.beacon_id = b.id
      WHERE pcr.ruta_id = ?
      ORDER BY pcr.orden_secuencia
    `, [id]);

    res.json({
      ...rutas[0],
      puntos_control: puntos
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear nueva ruta
exports.crearRuta = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;
    const {
      nombre,
      descripcion,
      tipo_programacion,
      hora_inicio,
      hora_fin,
      usuario_id,
      color,
      puntos_control
    } = req.body;

    // Validaciones
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre es requerido' });
    }

    // Insertar ruta
    const [resultado] = await db.query(`
      INSERT INTO rutas (
        empresa_id, usuario_id, nombre, descripcion, 
        tipo_programacion, hora_inicio, hora_fin, color
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      empresa_id || 1,
      usuario_id || null,
      nombre,
      descripcion || null,
      tipo_programacion || 'diaria',
      hora_inicio || null,
      hora_fin || null,
      color || '#00D9FF'
    ]);

    const rutaId = resultado.insertId;

    // Insertar puntos de control si existen
    if (puntos_control && puntos_control.length > 0) {
      for (let i = 0; i < puntos_control.length; i++) {
        await db.query(`
          INSERT INTO puntos_control_ruta (ruta_id, beacon_id, orden_secuencia, obligatorio)
          VALUES (?, ?, ?, ?)
        `, [rutaId, puntos_control[i].beacon_id, i + 1, puntos_control[i].obligatorio || true]);
      }
    }

    res.status(201).json({
      mensaje: 'Ruta creada correctamente',
      id: rutaId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar ruta
exports.actualizarRuta = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      descripcion,
      tipo_programacion,
      hora_inicio,
      hora_fin,
      usuario_id,
      activa,
      color,
      puntos_control
    } = req.body;

    // Actualizar ruta
    await db.query(`
      UPDATE rutas SET
        nombre = ?,
        descripcion = ?,
        tipo_programacion = ?,
        hora_inicio = ?,
        hora_fin = ?,
        usuario_id = ?,
        activa = ?,
        color = ?
      WHERE id = ?
    `, [
      nombre,
      descripcion,
      tipo_programacion,
      hora_inicio,
      hora_fin,
      usuario_id || null,
      activa !== undefined ? activa : true,
      color,
      id
    ]);

    // Si se enviaron puntos de control, actualizar
    if (puntos_control) {
      // Eliminar puntos existentes
      await db.query('DELETE FROM puntos_control_ruta WHERE ruta_id = ?', [id]);

      // Insertar nuevos puntos
      for (let i = 0; i < puntos_control.length; i++) {
        await db.query(`
          INSERT INTO puntos_control_ruta (ruta_id, beacon_id, orden_secuencia, obligatorio)
          VALUES (?, ?, ?, ?)
        `, [id, puntos_control[i].beacon_id, i + 1, puntos_control[i].obligatorio || true]);
      }
    }

    res.json({ mensaje: 'Ruta actualizada correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar ruta
exports.eliminarRuta = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM rutas WHERE id = ?', [id]);

    res.json({ mensaje: 'Ruta eliminada correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener estadísticas de cumplimiento de una ruta
exports.obtenerCumplimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin } = req.query;

    const [cumplimiento] = await db.query(`
      SELECT 
        DATE(d.fecha_hora) as fecha,
        COUNT(DISTINCT d.id) as detecciones_totales,
        COUNT(DISTINCT CASE WHEN d.cumplimiento = TRUE THEN d.id END) as detecciones_exitosas,
        ROUND(COUNT(DISTINCT CASE WHEN d.cumplimiento = TRUE THEN d.id END) * 100.0 / COUNT(DISTINCT d.id), 2) as porcentaje_cumplimiento
      FROM detecciones d
      WHERE d.ruta_id = ?
        ${fecha_inicio ? 'AND d.fecha_hora >= ?' : ''}
        ${fecha_fin ? 'AND d.fecha_hora <= ?' : ''}
      GROUP BY DATE(d.fecha_hora)
      ORDER BY fecha DESC
    `, [id, fecha_inicio, fecha_fin].filter(Boolean));

    res.json(cumplimiento);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
