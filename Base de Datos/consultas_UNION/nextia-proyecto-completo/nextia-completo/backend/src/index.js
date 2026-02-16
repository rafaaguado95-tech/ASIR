const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Importar rutas
const authRoutes = require('./rutas/authRoutes');
const dashboardRoutes = require('./rutas/dashboardRoutes');
const rutasRoutes = require('./rutas/rutasRoutes');
const beaconsRoutes = require('./rutas/beaconsRoutes');
const vigilantesRoutes = require('./rutas/vigilantesRoutes');
const pulserasRoutes = require('./rutas/pulserasroutes');
const deteccionesRoutes = require('./rutas/deteccionesRoutes');
const alertasRoutes = require('./rutas/alertasRoutes');

const app = express();

// Middleware de seguridad
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting - Aumentado para desarrollo
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000  // Aumentado de 100 a 1000 para desarrollo
});
app.use('/api/', limiter);

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/rutas', rutasRoutes);
app.use('/api/beacons', beaconsRoutes);
app.use('/api/vigilantes', vigilantesRoutes);
app.use('/api/pulseras', pulserasRoutes);
app.use('/api/detecciones', deteccionesRoutes);
app.use('/api/alertas', alertasRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ 
    mensaje: 'API NEXTia Technologies',
    version: '1.0.0',
    estado: 'operativo'
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ 
    error: 'Error interno del servidor',
    mensaje: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('');
  console.log('╔═══════════════════════════════════════════╗');
  console.log('║   NEXTIA TECHNOLOGIES - API BACKEND      ║');
  console.log('╚═══════════════════════════════════════════╝');
  console.log('');
  console.log(`🚀 Servidor: http://localhost:${PORT}`);
  console.log(`📊 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🗄️  Base de datos: ${process.env.DB_NAME || 'nextia'}`);
  console.log('');
  console.log('Endpoints disponibles:');
  console.log('  POST   /api/auth/login');
  console.log('  GET    /api/auth/me');
  console.log('  GET    /api/dashboard/resumen');
  console.log('  GET    /api/dashboard/actividad');
  console.log('  GET    /api/rutas');
  console.log('  POST   /api/rutas');
  console.log('  GET    /api/beacons');
  console.log('  POST   /api/beacons');
  console.log('  GET    /api/vigilantes');
  console.log('  POST   /api/vigilantes');
  console.log('  GET    /api/pulseras');
  console.log('  POST   /api/pulseras');
  console.log('  GET    /api/detecciones');
  console.log('  GET    /api/detecciones/estadisticas');
  console.log('  POST   /api/detecciones');
  console.log('  GET    /api/alertas');
  console.log('  GET    /api/alertas/estadisticas');
  console.log('  PUT    /api/alertas/configuracion');
  console.log('');
  console.log('✅ Sistema listo para recibir peticiones');
  console.log('');
});

module.exports = app;
