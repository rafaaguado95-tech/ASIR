const db = require('../config/database');
const bcrypt = require('bcrypt');

// Listar todos los vigilantes
exports.listarVigilantes = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;

    const [vigilantes] = await db.query(`
      SELECT 
        u.id,
        u.nombre,
        u.apellidos,
        u.email,
        u.telefono,
        u.rol,
        u.activo,
        u.fecha_creacion,
        d.id as dispositivo_id,
        d.id_dispositivo as dispositivo_serie,
        d.estado as dispositivo_estado,
        (SELECT COUNT(*) FROM rutas WHERE usuario_id = u.id) as rutas_asignadas,
        (SELECT COUNT(*) FROM detecciones WHERE usuario_id = u.id AND DATE(fecha_hora) = CURDATE()) as detecciones_hoy
      FROM usuarios u
      LEFT JOIN dispositivos d ON u.id = d.usuario_id
      WHERE u.empresa_id = ? AND u.rol = 'vigilante'
      ORDER BY u.fecha_creacion DESC
    `, [empresa_id || 1]);

    res.json(vigilantes);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener un vigilante por ID
exports.obtenerVigilante = async (req, res) => {
  try {
    const { id } = req.params;

    const [vigilantes] = await db.query(`
      SELECT 
        u.*,
        d.id as dispositivo_id,
        d.id_dispositivo as dispositivo_serie,
        d.tipo as dispositivo_modelo,
        d.estado as dispositivo_estado
      FROM usuarios u
      LEFT JOIN dispositivos d ON u.id = d.usuario_id
      WHERE u.id = ?
    `, [id]);

    if (vigilantes.length === 0) {
      return res.status(404).json({ error: 'Vigilante no encontrado' });
    }

    // Obtener rutas asignadas
    const [rutas] = await db.query(`
      SELECT 
        r.id,
        r.nombre,
        r.tipo_programacion,
        r.hora_inicio,
        r.hora_fin,
        r.activa
      FROM rutas r
      WHERE r.usuario_id = ?
    `, [id]);

    // Obtener estadísticas
    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total_detecciones,
        COUNT(CASE WHEN cumplimiento = TRUE THEN 1 END) as detecciones_exitosas,
        DATE(MAX(fecha_hora)) as ultima_actividad
      FROM detecciones
      WHERE usuario_id = ?
    `, [id]);

    res.json({
      ...vigilantes[0],
      rutas_asignadas: rutas,
      estadisticas: stats[0]
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Crear nuevo vigilante
exports.crearVigilante = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;
    const {
      nombre,
      apellidos,
      email,
      telefono,
      contrasena,
      activo
    } = req.body;

    // Validaciones
    if (!nombre || !email || !contrasena) {
      return res.status(400).json({ error: 'Nombre, email y contraseña son requeridos' });
    }

    // Verificar email único
    const [existente] = await db.query(
      'SELECT id FROM usuarios WHERE email = ?',
      [email]
    );

    if (existente.length > 0) {
      return res.status(400).json({ error: 'Ya existe un usuario con ese email' });
    }

    // Hash de contraseña
    const contrasenaHash = await bcrypt.hash(contrasena, 10);

    // Insertar vigilante
    const [resultado] = await db.query(`
      INSERT INTO usuarios (
        empresa_id, nombre, apellidos, email, telefono,
        contrasena_hash, rol, activo
      ) VALUES (?, ?, ?, ?, ?, ?, 'vigilante', ?)
    `, [
      empresa_id || 1,
      nombre,
      apellidos || null,
      email,
      telefono || null,
      contrasenaHash,
      activo !== undefined ? activo : true
    ]);

    res.status(201).json({
      mensaje: 'Vigilante creado correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar vigilante
exports.actualizarVigilante = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellidos,
      email,
      telefono,
      contrasena,
      activo
    } = req.body;

    // Verificar email único (excluyendo el actual)
    const [existente] = await db.query(
      'SELECT id FROM usuarios WHERE email = ? AND id != ?',
      [email, id]
    );

    if (existente.length > 0) {
      return res.status(400).json({ error: 'Ya existe otro usuario con ese email' });
    }

    // Si se proporciona contraseña, hashearla
    let updateQuery = `
      UPDATE usuarios SET
        nombre = ?,
        apellidos = ?,
        email = ?,
        telefono = ?,
        activo = ?
    `;
    let params = [nombre, apellidos, email, telefono, activo];

    if (contrasena) {
      const contrasenaHash = await bcrypt.hash(contrasena, 10);
      updateQuery += ', contrasena_hash = ?';
      params.push(contrasenaHash);
    }

    updateQuery += ' WHERE id = ?';
    params.push(id);

    await db.query(updateQuery, params);

    res.json({ mensaje: 'Vigilante actualizado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Eliminar vigilante
exports.eliminarVigilante = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si tiene rutas asignadas
    const [rutas] = await db.query(
      'SELECT COUNT(*) as total FROM rutas WHERE usuario_id = ? AND activa = TRUE',
      [id]
    );

    if (rutas[0].total > 0) {
      return res.status(400).json({ 
        error: 'No se puede eliminar. El vigilante tiene rutas activas asignadas' 
      });
    }

    // Verificar si tiene dispositivo asignado
    const [dispositivos] = await db.query(
      'SELECT COUNT(*) as total FROM dispositivos WHERE usuario_id = ?',
      [id]
    );

    if (dispositivos[0].total > 0) {
      // Desasignar dispositivos primero
      await db.query('UPDATE dispositivos SET usuario_id = NULL WHERE usuario_id = ?', [id]);
    }

    // Eliminar vigilante
    await db.query('DELETE FROM usuarios WHERE id = ?', [id]);

    res.json({ mensaje: 'Vigilante eliminado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Asignar dispositivo a vigilante
exports.asignarDispositivo = async (req, res) => {
  try {
    const { id } = req.params;
    const { dispositivo_id } = req.body;

    if (!dispositivo_id) {
      return res.status(400).json({ error: 'ID de dispositivo requerido' });
    }

    // Verificar que el dispositivo no esté asignado
    const [dispositivo] = await db.query(
      'SELECT usuario_id FROM dispositivos WHERE id = ?',
      [dispositivo_id]
    );

    if (dispositivo.length === 0) {
      return res.status(404).json({ error: 'Dispositivo no encontrado' });
    }

    if (dispositivo[0].usuario_id && dispositivo[0].usuario_id !== parseInt(id)) {
      return res.status(400).json({ 
        error: 'El dispositivo ya está asignado a otro vigilante' 
      });
    }

    // Asignar dispositivo
    await db.query(
      'UPDATE dispositivos SET usuario_id = ? WHERE id = ?',
      [id, dispositivo_id]
    );

    res.json({ mensaje: 'Dispositivo asignado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Desasignar dispositivo
exports.desasignarDispositivo = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query(
      'UPDATE dispositivos SET usuario_id = NULL WHERE usuario_id = ?',
      [id]
    );

    res.json({ mensaje: 'Dispositivo desasignado correctamente' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener historial de actividad
exports.obtenerHistorial = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_inicio, fecha_fin, limite } = req.query;

    let query = `
      SELECT 
        d.id,
        d.fecha_hora,
        d.cumplimiento,
        d.latitud,
        d.longitud,
        r.nombre as ruta_nombre,
        b.nombre as beacon_nombre,
        b.ubicacion as beacon_ubicacion
      FROM detecciones d
      LEFT JOIN rutas r ON d.ruta_id = r.id
      LEFT JOIN beacons b ON d.beacon_id = b.id
      WHERE d.usuario_id = ?
    `;

    const params = [id];

    if (fecha_inicio) {
      query += ' AND d.fecha_hora >= ?';
      params.push(fecha_inicio);
    }

    if (fecha_fin) {
      query += ' AND d.fecha_hora <= ?';
      params.push(fecha_fin);
    }

    query += ' ORDER BY d.fecha_hora DESC';

    if (limite) {
      query += ' LIMIT ?';
      params.push(parseInt(limite));
    }

    const [historial] = await db.query(query, params);

    res.json(historial);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener estadísticas del vigilante
exports.obtenerEstadisticas = async (req, res) => {
  try {
    const { empresa_id } = req.usuario;

    const [stats] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN activo = TRUE THEN 1 ELSE 0 END) as activos,
        SUM(CASE WHEN activo = FALSE THEN 1 ELSE 0 END) as inactivos,
        (SELECT COUNT(*) FROM dispositivos WHERE usuario_id IS NOT NULL) as con_dispositivo,
        (SELECT COUNT(*) FROM dispositivos WHERE usuario_id IS NULL) as sin_dispositivo
      FROM usuarios
      WHERE empresa_id = ? AND rol = 'vigilante'
    `, [empresa_id || 1]);

    res.json(stats[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};
