const jwt = require('jsonwebtoken');

const verificarToken = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'No hay token' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'nextia_super_secreto_2025_no_compartir');
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

const verificarRol = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!rolesPermitidos.includes(req.usuario.rol)) {
      return res.status(403).json({ error: 'No tienes permisos' });
    }
    next();
  };
};

module.exports = { verificarToken, verificarRol };
