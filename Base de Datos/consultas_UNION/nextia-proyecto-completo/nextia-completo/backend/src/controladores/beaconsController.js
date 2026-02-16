const db = require('../config/database');

// Listar todos los beacons
exports.listarBeacons = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;

    const [beacons] = await db.query(`
      SELECT 
        b.*,
        (SELECT COUNT(*) FROM puntos_control_ruta WHERE beacon_id = b.id) as rutas_asignadas
      FROM beacons b
      WHERE b.empresa_id = ?
      ORDER BY b.fecha_instalacion DESC
    `, [empresa_id || 1]);

    res.json(beacons);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener un beacon por ID
exports.obtenerBeacon = async (req, res) => {
  try {
    const { id } = req.params;

    const [beacons] = await db.query('SELECT * FROM beacons WHERE id = ?', [id]);

    if (beacons.length === 0) {
      return res.status(404).json({ error: 'Beacon no encontrado' });
    }

    // Obtener rutas donde está asignado
    const [rutas] = await db.query(`
      SELECT 
        r.id,
        r.nombre,
        pcr.orden_secuencia,
        pcr.obligatorio
      FROM puntos_control_ruta pcr
      JOIN rutas r ON pcr.ruta_id = r.id
      WHERE pcr.beacon_id = ?
      ORDER BY r.nombre
    `, [id]);

    res.json({
      ...beacons[0],
      rutas_asignadas: rutas
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear nuevo beacon
exports.crearBeacon = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;
    const {
      nombre,
      uuid,
      major,
      minor,
      edificio,
      planta,
      ubicacion,
      latitud,
      longitud,
      nivel_bateria,
      estado
    } = req.body;

    // Validaciones
    if (!nombre || !uuid) {
      return res.status(400).json({ error: 'Nombre y UUID son requeridos' });
    }

    // Verificar UUID único
    const [existente] = await db.query(
      'SELECT id FROM beacons WHERE uuid = ? AND empresa_id = ?',
      [uuid, empresa_id || 1]
    );

    if (existente.length > 0) {
      return res.status(400).json({ error: 'Ya existe un beacon con ese UUID' });
    }

    // Insertar beacon
    const [resultado] = await db.query(`
      INSERT INTO beacons (
        empresa_id, nombre, uuid, major, minor, edificio, planta,
        ubicacion, latitud, longitud, nivel_bateria, estado
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      empresa_id || 1,
      nombre,
      uuid,
      major || null,
      minor || null,
      edificio || null,
      planta || null,
      ubicacion || null,
      latitud || null,
      longitud || null,
      nivel_bateria || 100,
      estado || 'activo'
    ]);

    res.status(201).json({
      mensaje: 'Beacon creado correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar beacon
exports.actualizarBeacon = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      uuid,
      major,
      minor,
      edificio,
      planta,
      ubicacion,
      latitud,
      longitud,
      nivel_bateria,
      estado
    } = req.body;

    // Verificar UUID único (excluyendo el actual)
    const [existente] = await db.query(
      'SELECT id FROM beacons WHERE uuid = ? AND id != ?',
      [uuid, id]
    );

    if (existente.length > 0) {
      return res.status(400).json({ error: 'Ya existe otro beacon con ese UUID' });
    }

    await db.query(`
      UPDATE beacons SET
        nombre = ?,
        uuid = ?,
        major = ?,
        minor = ?,
        edificio = ?,
        planta = ?,
        ubicacion = ?,
        latitud = ?,
        longitud = ?,
        nivel_bateria = ?,
        estado = ?
      WHERE id = ?
    `, [
      nombre,
      uuid,
      major,
      minor,
      edificio,
      planta,
      ubicacion,
      latitud,
      longitud,
      nivel_bateria,
      estado,
      id
    ]);

    res.json({ mensaje: 'Beacon actualizado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar beacon
exports.eliminarBeacon = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si está asignado a rutas
    const [rutas] = await db.query(
      'SELECT COUNT(*) as total FROM puntos_control_ruta WHERE beacon_id = ?',
      [id]
    );

    if (rutas[0].total > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar. El beacon está asignado a rutas activas' 
      });
    }

    await db.query('DELETE FROM beacons WHERE id = ?', [id]);

    res.json({ mensaje: 'Beacon eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener estadísticas de beacons
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;

    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN estado = 'activo' THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN estado = 'inactivo' THEN 1 ELSE 0 END) as inactivos,
        SUM(CASE WHEN estado = 'mantenimiento' THEN 1 ELSE 0 END) as mantenimiento,
        AVG(nivel_bateria) as bateria_promedio,
        SUM(CASE WHEN nivel_bateria < 20 THEN 1 ELSE 0 END) as bateria_baja
      FROM beacons
      WHERE empresa_id = ?
    `, [empresa_id || 1]);

    res.json(stats[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar última señal de beacon
exports.actualizarUltimaSenal = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'UPDATE beacons SET ultima_señal = NOW() WHERE id = ?',
      [id]
    );

    res.json({ mensaje: 'Última señal actualizada' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
