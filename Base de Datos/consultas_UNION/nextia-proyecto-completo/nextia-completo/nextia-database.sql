-- ============================================
-- NEXTIA TECHNOLOGIES - BASE DE DATOS COMPLETA
-- Versión: 1.0 FINAL
-- ============================================

DROP DATABASE IF EXISTS nextia;
CREATE DATABASE nextia CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE nextia;

-- ============================================
-- TABLA: EMPRESAS
-- ============================================
CREATE TABLE empresas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  cif VARCHAR(20),
  email VARCHAR(255),
  telefono VARCHAR(50),
  direccion TEXT,
  ciudad VARCHAR(100),
  pais VARCHAR(100) DEFAULT 'España',
  plan_suscripcion VARCHAR(50) DEFAULT 'basico',
  estado_suscripcion VARCHAR(50) DEFAULT 'activo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_estado (estado_suscripcion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: USUARIOS
-- ============================================
CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  email VARCHAR(255) UNIQUE NOT NULL,
  contrasena_hash VARCHAR(255) NOT NULL,
  nombre VARCHAR(255) NOT NULL,
  apellidos VARCHAR(255),
  rol ENUM('admin', 'supervisor', 'vigilante', 'cliente') NOT NULL,
  idioma VARCHAR(5) DEFAULT 'es',
  tema VARCHAR(10) DEFAULT 'oscuro',
  avatar_url TEXT,
  telefono VARCHAR(50),
  activo BOOLEAN DEFAULT TRUE,
  ultimo_acceso TIMESTAMP NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  INDEX idx_email (email),
  INDEX idx_empresa (empresa_id),
  INDEX idx_rol (rol)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: DISPOSITIVOS
-- ============================================
CREATE TABLE dispositivos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  usuario_id INT,
  id_dispositivo VARCHAR(100) UNIQUE NOT NULL,
  tipo ENUM('pulsera', 'punto_maestro') NOT NULL,
  nombre VARCHAR(255),
  nivel_bateria INT,
  estado ENUM('activo', 'inactivo', 'mantenimiento', 'perdido') DEFAULT 'activo',
  version_firmware VARCHAR(20),
  ultima_sincronizacion TIMESTAMP NULL,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_empresa (empresa_id),
  INDEX idx_usuario (usuario_id),
  INDEX idx_tipo (tipo),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: BEACONS
-- ============================================
CREATE TABLE beacons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  uuid VARCHAR(100) NOT NULL,
  major INT NOT NULL DEFAULT 0,
  minor INT NOT NULL DEFAULT 0,
  nombre VARCHAR(255) NOT NULL,
  ubicacion TEXT,
  edificio VARCHAR(255),
  planta VARCHAR(50),
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  estado VARCHAR(50) DEFAULT 'activo',
  nivel_bateria INT,
  potencia_transmision INT DEFAULT -59,
  ultimo_mantenimiento DATE,
  fecha_instalacion DATE,
  notas TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  UNIQUE KEY unique_beacon (uuid, major, minor),
  INDEX idx_empresa (empresa_id),
  INDEX idx_edificio (edificio),
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: RUTAS
-- ============================================
CREATE TABLE rutas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  usuario_id INT,
  nombre VARCHAR(255) NOT NULL,
  descripcion TEXT,
  tipo_programacion ENUM('diaria', 'semanal', 'mensual', 'personalizada'),
  hora_inicio TIME,
  hora_fin TIME,
  dias_semana JSON,
  secuencia_estricta BOOLEAN DEFAULT TRUE,
  tolerancia_minutos INT DEFAULT 15,
  activa BOOLEAN DEFAULT TRUE,
  color VARCHAR(7) DEFAULT '#00D9FF',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_empresa (empresa_id),
  INDEX idx_usuario (usuario_id),
  INDEX idx_activa (activa)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: PUNTOS_CONTROL_RUTA
-- ============================================
CREATE TABLE puntos_control_ruta (
  id INT AUTO_INCREMENT PRIMARY KEY,
  ruta_id INT,
  beacon_id INT,
  orden_secuencia INT NOT NULL,
  obligatorio BOOLEAN DEFAULT TRUE,
  duracion_esperada_minutos INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE CASCADE,
  FOREIGN KEY (beacon_id) REFERENCES beacons(id) ON DELETE CASCADE,
  INDEX idx_ruta (ruta_id),
  INDEX idx_beacon (beacon_id),
  INDEX idx_orden (orden_secuencia)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: DETECCIONES
-- ============================================
CREATE TABLE detecciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  dispositivo_id INT,
  beacon_id INT,
  usuario_id INT,
  ruta_id INT,
  rssi INT NOT NULL,
  fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  cumplimiento BOOLEAN DEFAULT TRUE,
  notas TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id) ON DELETE CASCADE,
  FOREIGN KEY (beacon_id) REFERENCES beacons(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE SET NULL,
  INDEX idx_usuario (usuario_id),
  INDEX idx_empresa (empresa_id),
  INDEX idx_ruta (ruta_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: ALERTAS
-- ============================================
CREATE TABLE alertas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  tipo VARCHAR(100) NOT NULL,
  gravedad ENUM('baja', 'media', 'alta', 'critica') DEFAULT 'media',
  titulo VARCHAR(255) NOT NULL,
  mensaje TEXT,
  ruta_id INT,
  usuario_id INT,
  dispositivo_id INT,
  beacon_id INT,
  resuelta BOOLEAN DEFAULT FALSE,
  fecha_resolucion TIMESTAMP NULL,
  resuelta_por INT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (ruta_id) REFERENCES rutas(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id) ON DELETE SET NULL,
  FOREIGN KEY (beacon_id) REFERENCES beacons(id) ON DELETE SET NULL,
  FOREIGN KEY (resuelta_por) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_empresa (empresa_id),
  INDEX idx_resuelta (resuelta),
  INDEX idx_gravedad (gravedad)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: FICHAJES
-- ============================================
CREATE TABLE fichajes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  usuario_id INT,
  dispositivo_id INT,
  tipo ENUM('entrada', 'salida') NOT NULL,
  fecha_hora TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  beacon_id INT,
  latitud DECIMAL(10, 8),
  longitud DECIMAL(11, 8),
  notas TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
  FOREIGN KEY (dispositivo_id) REFERENCES dispositivos(id) ON DELETE SET NULL,
  FOREIGN KEY (beacon_id) REFERENCES beacons(id) ON DELETE SET NULL,
  INDEX idx_usuario (usuario_id),
  INDEX idx_empresa (empresa_id),
  INDEX idx_tipo (tipo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: REGISTRO_AUDITORIA
-- ============================================
CREATE TABLE registro_auditoria (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  usuario_id INT,
  accion VARCHAR(255) NOT NULL,
  tipo_entidad VARCHAR(100),
  id_entidad INT,
  detalles JSON,
  direccion_ip VARCHAR(45),
  navegador TEXT,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE SET NULL,
  INDEX idx_empresa (empresa_id),
  INDEX idx_usuario (usuario_id),
  INDEX idx_accion (accion)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: CONTACTOS
-- ============================================
CREATE TABLE contactos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  empresa VARCHAR(255),
  telefono VARCHAR(50),
  numero_vigilantes INT,
  numero_puntos INT,
  mensaje TEXT,
  origen VARCHAR(100) DEFAULT 'web',
  estado ENUM('nuevo', 'contactado', 'cualificado', 'convertido', 'perdido') DEFAULT 'nuevo',
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_estado (estado)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: INFORMES_PROGRAMADOS
-- ============================================
CREATE TABLE informes_programados (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  nombre VARCHAR(255) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  frecuencia ENUM('diario', 'semanal', 'mensual') NOT NULL,
  hora_programada TIME NOT NULL,
  destinatarios JSON NOT NULL,
  formato ENUM('pdf', 'excel', 'ambos') DEFAULT 'pdf',
  idioma VARCHAR(5) DEFAULT 'es',
  activo BOOLEAN DEFAULT TRUE,
  ultima_ejecucion TIMESTAMP NULL,
  proxima_ejecucion TIMESTAMP NULL,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  INDEX idx_empresa (empresa_id),
  INDEX idx_activo (activo)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- TABLA: CONFIGURACION_SISTEMA
-- ============================================
CREATE TABLE configuracion_sistema (
  id INT AUTO_INCREMENT PRIMARY KEY,
  empresa_id INT,
  clave VARCHAR(100) NOT NULL,
  valor TEXT,
  tipo ENUM('texto', 'numero', 'booleano', 'json'),
  descripcion TEXT,
  fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (empresa_id) REFERENCES empresas(id) ON DELETE CASCADE,
  UNIQUE KEY unique_config (empresa_id, clave),
  INDEX idx_empresa (empresa_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ============================================
-- INSERTAR DATOS DEMO
-- ============================================

-- Empresa
INSERT INTO empresas (nombre, cif, email, telefono, direccion, ciudad, pais, plan_suscripcion, estado_suscripcion) VALUES
('Empresa Demo NEXTia', 'B12345678', 'contacto@demo.nextia.tech', '900123456', 'Calle Principal 123', 'Madrid', 'España', 'premium', 'activo');

-- Usuarios (contraseña: demo123)
INSERT INTO usuarios (empresa_id, email, contrasena_hash, nombre, apellidos, rol, telefono, activo) VALUES
(1, 'admin@demo.nextia.tech', '$2b$10$rQ5YhMZGqW7KxYQXxYhDH.CyVGJ4kXxW3qXmD1zN5YhGqW7KxYQXx', 'Admin', 'Demo', 'admin', '600123456', TRUE),
(1, 'supervisor@demo.nextia.tech', '$2b$10$rQ5YhMZGqW7KxYQXxYhDH.CyVGJ4kXxW3qXmD1zN5YhGqW7KxYQXx', 'Carlos', 'Supervisor', 'supervisor', '600234567', TRUE),
(1, 'juan.garcia@demo.nextia.tech', '$2b$10$rQ5YhMZGqW7KxYQXxYhDH.CyVGJ4kXxW3qXmD1zN5YhGqW7KxYQXx', 'Juan', 'García', 'vigilante', '600345678', TRUE);

-- Beacons
INSERT INTO beacons (empresa_id, uuid, major, minor, nombre, ubicacion, edificio, planta, latitud, longitud, estado, nivel_bateria) VALUES
(1, 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 1, 'Entrada Principal', 'Recepción edificio A', 'Edificio A', 'Planta Baja', 40.416775, -3.703790, 'activo', 85),
(1, 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 2, 'Pasillo 1A', 'Pasillo norte planta 1', 'Edificio A', 'Planta 1', 40.416785, -3.703800, 'activo', 92),
(1, 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 3, 'Sala Servidores', 'Centro de datos', 'Edificio A', 'Planta 2', 40.416795, -3.703810, 'activo', 78),
(1, 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 4, 'Parking', 'Nivel -1', 'Edificio A', 'Sótano', 40.416765, -3.703780, 'activo', 88),
(1, 'FDA50693-A4E2-4FB1-AFCF-C6EB07647825', 1, 5, 'Azotea', 'Punto control azotea', 'Edificio A', 'Azotea', 40.416805, -3.703820, 'activo', 95);

-- Dispositivos
INSERT INTO dispositivos (empresa_id, usuario_id, id_dispositivo, tipo, nombre, nivel_bateria, estado, version_firmware) VALUES
(1, 3, 'PULSERA-001', 'pulsera', 'Pulsera Juan García', 85, 'activo', 'v2.1.5'),
(1, NULL, 'PULSERA-002', 'pulsera', 'Pulsera Disponible', 100, 'inactivo', 'v2.1.5');

-- Rutas
INSERT INTO rutas (empresa_id, usuario_id, nombre, descripcion, tipo_programacion, hora_inicio, hora_fin, activa, color) VALUES
(1, 3, 'Ronda Nocturna', 'Revisión completa del edificio A', 'diaria', '22:00:00', '06:00:00', TRUE, '#00D9FF');

-- Puntos de control
INSERT INTO puntos_control_ruta (ruta_id, beacon_id, orden_secuencia, obligatorio) VALUES
(1, 1, 1, TRUE),
(1, 2, 2, TRUE),
(1, 3, 3, TRUE),
(1, 4, 4, TRUE),
(1, 5, 5, TRUE);

-- Alertas
INSERT INTO alertas (empresa_id, tipo, gravedad, titulo, mensaje, resuelta) VALUES
(1, 'bateria_baja', 'alta', 'Batería baja', 'La pulsera PULSERA-001 tiene batería baja (78%)', FALSE);

-- ============================================
-- BASE DE DATOS COMPLETA Y LISTA
-- ============================================
