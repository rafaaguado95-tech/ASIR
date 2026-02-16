const db = require('../config/database');

// =====================================================
// OBTENER TODAS LAS PULSERAS
// =====================================================
exports.obtenerPulseras = async (req, res) => {
  try {
    const [pulseras] = await db.query(`
      SELECT 
        p.*,
        u.nombre as usuario_nombre,
        u.apellidos as usuario_apellidos,
        u.rol as usuario_rol,
        u.email as usuario_email
      FROM pulseras_ble p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      ORDER BY p.tipo, p.id DESC
    `);
    
    res.json(pulseras);
  } catch (error) {
    console.error('Error al obtener pulseras:', error);
    res.status(500).json({ mensaje: 'Error al obtener pulseras' });
  }
};

// =====================================================
// OBTENER PULSERA POR ID
// =====================================================
exports.obtenerPulseraPorId = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [pulseras] = await db.query(`
      SELECT 
        p.*,
        u.nombre as usuario_nombre,
        u.apellidos as usuario_apellidos,
        u.rol as usuario_rol,
        u.email as usuario_email
      FROM pulseras_ble p
      LEFT JOIN usuarios u ON p.usuario_id = u.id
      WHERE p.id = ?
    `, [id]);
    
    if (pulseras.length === 0) {
      return res.status(404).json({ mensaje: 'Pulsera no encontrada' });
    }
    
    res.json(pulseras[0]);
  } catch (error) {
    console.error('Error al obtener pulsera:', error);
    res.status(500).json({ mensaje: 'Error al obtener pulsera' });
  }
};

// =====================================================
// CREAR NUEVA PULSERA
// =====================================================
exports.crearPulsera = async (req, res) => {
  try {
    const { mac_address, nombre, tipo, usuario_id, bateria } = req.body;
    
    // Validaciones
    if (!mac_address || !nombre || !tipo) {
      return res.status(400).json({ mensaje: 'Faltan campos obligatorios' });
    }
    
    if (!['ronda', 'fichaje'].includes(tipo)) {
      return res.status(400).json({ mensaje: 'Tipo debe ser "ronda" o "fichaje"' });
    }
    
    // Validar que el usuario existe y tiene el rol correcto
    if (usuario_id) {
      const rolEsperado = tipo === 'ronda' ? 'vigilante' : 'trabajador';
      const [usuario] = await db.query(
        'SELECT rol FROM usuarios WHERE id = ?',
        [usuario_id]
      );
      
      if (usuario.length === 0) {
        return res.status(400).json({ mensaje: 'Usuario no encontrado' });
      }
      
      if (usuario[0].rol !== rolEsperado) {
        return res.status(400).json({ 
          mensaje: `Una pulsera de tipo "${tipo}" solo puede asignarse a un ${rolEsperado}` 
        });
      }
    }
    
    const fecha_asignacion = usuario_id ? new Date().toISOString().split('T')[0] : null;
    
    const [resultado] = await db.query(
      `INSERT INTO pulseras_ble 
       (mac_address, nombre, tipo, usuario_id, bateria, fecha_asignacion, activo) 
       VALUES (?, ?, ?, ?, ?, ?, 1)`,
      [mac_address, nombre, tipo, usuario_id || null, bateria || 100, fecha_asignacion]
    );
    
    res.status(201).json({
      mensaje: 'Pulsera creada exitosamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('Error al crear pulsera:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensaje: 'La dirección MAC ya existe' });
    }
    res.status(500).json({ mensaje: 'Error al crear pulsera' });
  }
};

// =====================================================
// ACTUALIZAR PULSERA
// =====================================================
exports.actualizarPulsera = async (req, res) => {
  try {
    const { id } = req.params;
    const { mac_address, nombre, tipo, usuario_id, bateria, activo } = req.body;
    
    // Verificar que la pulsera existe
    const [pulseraExistente] = await db.query(
      'SELECT * FROM pulseras_ble WHERE id = ?',
      [id]
    );
    
    if (pulseraExistente.length === 0) {
      return res.status(404).json({ mensaje: 'Pulsera no encontrada' });
    }
    
    // Validar que el usuario existe y tiene el rol correcto
    if (usuario_id) {
      const rolEsperado = tipo === 'ronda' ? 'vigilante' : 'trabajador';
      const [usuario] = await db.query(
        'SELECT rol FROM usuarios WHERE id = ?',
        [usuario_id]
      );
      
      if (usuario.length === 0) {
        return res.status(400).json({ mensaje: 'Usuario no encontrado' });
      }
      
      if (usuario[0].rol !== rolEsperado) {
        return res.status(400).json({ 
          mensaje: `Una pulsera de tipo "${tipo}" solo puede asignarse a un ${rolEsperado}` 
        });
      }
    }
    
    const fecha_asignacion = usuario_id ? new Date().toISOString().split('T')[0] : null;
    
    await db.query(
      `UPDATE pulseras_ble 
       SET mac_address = ?, nombre = ?, tipo = ?, usuario_id = ?, 
           bateria = ?, activo = ?, fecha_asignacion = ?
       WHERE id = ?`,
      [mac_address, nombre, tipo, usuario_id || null, bateria, activo, fecha_asignacion, id]
    );
    
    res.json({ mensaje: 'Pulsera actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar pulsera:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ mensaje: 'La dirección MAC ya existe' });
    }
    res.status(500).json({ mensaje: 'Error al actualizar pulsera' });
  }
};

// =====================================================
// ELIMINAR PULSERA
// =====================================================
exports.eliminarPulsera = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [resultado] = await db.query(
      'DELETE FROM pulseras_ble WHERE id = ?',
      [id]
    );
    
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ mensaje: 'Pulsera no encontrada' });
    }
    
    res.json({ mensaje: 'Pulsera eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar pulsera:', error);
    res.status(500).json({ mensaje: 'Error al eliminar pulsera' });
  }
};

// =====================================================
// OBTENER USUARIOS DISPONIBLES PARA ASIGNAR
// =====================================================
exports.obtenerUsuariosDisponibles = async (req, res) => {
  try {
    const { tipo } = req.query;
    
    let rol = tipo === 'ronda' ? 'vigilante' : 'trabajador';
    
    const [usuarios] = await db.query(
      `SELECT id, nombre, apellidos, email, rol 
       FROM usuarios 
       WHERE rol = ? AND activo = 1
       ORDER BY nombre, apellidos`,
      [rol]
    );
    
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ mensaje: 'Error al obtener usuarios' });
  }
};

// =====================================================
// ACTUALIZAR BATERÍA DE PULSERA
// =====================================================
exports.actualizarBateria = async (req, res) => {
  try {
    const { id } = req.params;
    const { bateria } = req.body;
    
    if (bateria < 0 || bateria > 100) {
      return res.status(400).json({ mensaje: 'La batería debe estar entre 0 y 100' });
    }
    
    await db.query(
      'UPDATE pulseras_ble SET bateria = ?, ultimo_sync = NOW() WHERE id = ?',
      [bateria, id]
    );
    
    res.json({ mensaje: 'Batería actualizada exitosamente' });
  } catch (error) {
    console.error('Error al actualizar batería:', error);
    res.status(500).json({ mensaje: 'Error al actualizar batería' });
  }
};
