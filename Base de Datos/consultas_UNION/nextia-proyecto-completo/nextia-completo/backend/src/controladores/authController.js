const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

exports.login = async (req, res) => {
  try {
    const { email, contrasena } = req.body;

    const [usuarios] = await db.query(
      'SELECT * FROM usuarios WHERE email = ? AND activo = TRUE',
      [email]
    );

    if (usuarios.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const usuario = usuarios[0];
    const contrasenaValida = await bcrypt.compare(contrasena, usuario.contrasena_hash);

    if (!contrasenaValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'nextia_super_secreto_2025_no_compartir',
      { expiresIn: '8h' }
    );

    await db.query(
      'UPDATE usuarios SET ultimo_acceso = NOW() WHERE id = ?',
      [usuario.id]
    );

    delete usuario.contrasena_hash;

    res.json({
      token,
      usuario: {
        id: usuario.id,
        email: usuario.email,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        rol: usuario.rol,
        telefono: usuario.telefono,
        idioma: usuario.idioma,
        tema: usuario.tema
      }
    });
  } catch (error) {
    console.error('Error login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.obtenerUsuarioActual = async (req, res) => {
  try {
    const [usuarios] = await db.query(
      'SELECT id, email, nombre, apellidos, rol, telefono, idioma, tema FROM usuarios WHERE id = ?',
      [req.usuario.id]
    );

    if (usuarios.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json(usuarios[0]);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

exports.logout = async (req, res) => {
  res.json({ mensaje: 'Sesión cerrada correctamente' });
};
