# 🚀 NEXTia Technologies - Instalación Completa

## ✅ Requisitos Previos

Antes de empezar, asegúrate de tener instalado:

- ✅ Node.js v18 o superior
- ✅ XAMPP (para MySQL)
- ✅ Git (opcional)

---

## 📦 PASO 1: Preparar el Entorno

### 1.1 Iniciar XAMPP
1. Abre **XAMPP Control Panel**
2. Inicia **Apache** (botón Start)
3. Inicia **MySQL** (botón Start)
4. Ambos deben tener luz **VERDE**

---

## 🗄️ PASO 2: Importar Base de Datos

### 2.1 Abrir phpMyAdmin
1. Abre tu navegador
2. Ve a: http://localhost/phpmyadmin

### 2.2 Importar la base de datos
1. Click en pestaña **"Importar"** (arriba)
2. Click en **"Seleccionar archivo"**
3. Busca el archivo: `nextia-database.sql`
4. Click en **"Continuar"** (abajo)
5. Espera a que termine (10-15 segundos)
6. ✅ Verás mensaje: "Importación ejecutada exitosamente"

### 2.3 Verificar
1. En el panel izquierdo, click en base de datos **`nextia`**
2. Deberías ver **14 tablas**
3. Click en tabla **`usuarios`** → pestaña **"Examinar"**
4. Deberías ver **3 usuarios** (Admin, Supervisor, Vigilante)

---

## 🔧 PASO 3: Instalar Backend

### 3.1 Abrir CMD en carpeta backend
1. Abre **Explorador de Archivos**
2. Ve a la carpeta: `C:\Users\Rafael Aguado Duque\Desktop\nextia-completo\backend\`
3. En la barra de dirección, escribe `cmd` y presiona Enter

### 3.2 Instalar dependencias
```cmd
npm install
```
Espera 1-2 minutos mientras se descargan los paquetes.

### 3.3 Verificar archivo .env
1. Abre el archivo `.env` en la carpeta `backend`
2. Verifica que contenga:
```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=nextia
DB_USER=root
DB_PASSWORD=
```
3. **IMPORTANTE:** `DB_PASSWORD=` debe estar **VACÍO** (sin nada después del =)

### 3.4 Iniciar backend
```cmd
npm run dev
```

✅ Deberías ver:
```
╔═══════════════════════════════════════════╗
║   NEXTIA TECHNOLOGIES - API BACKEND      ║
╚═══════════════════════════════════════════╝

🚀 Servidor: http://localhost:3000
📊 Entorno: development
🗄️  Base de datos: nextia

✅ Conexión a MySQL exitosa
✅ Sistema listo para recibir peticiones
```

**⚠️ DEJA ESTA VENTANA ABIERTA** - El backend debe estar corriendo siempre.

---

## 🎨 PASO 4: Instalar Frontend

### 4.1 Abrir OTRA ventana de CMD
1. Abre **otra ventana** del Explorador de Archivos
2. Ve a la carpeta: `C:\Users\Rafael Aguado Duque\Desktop\nextia-completo\frontend\`
3. En la barra de dirección, escribe `cmd` y presiona Enter

### 4.2 Instalar dependencias
```cmd
npm install
```
Espera 1-2 minutos.

### 4.3 Iniciar frontend
```cmd
npm run dev
```

✅ Deberías ver:
```
VITE v5.0.8  ready in 1234 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**⚠️ DEJA ESTA VENTANA ABIERTA** - El frontend debe estar corriendo siempre.

---

## 🎉 PASO 5: Probar la Aplicación

### 5.1 Abrir navegador
1. Abre tu navegador (Chrome, Edge, Firefox)
2. Ve a: **http://localhost:5173**

### 5.2 Hacer login
Usa estas credenciales DEMO:

```
Email: admin@demo.nextia.tech
Contraseña: demo123
```

### 5.3 ¡Listo!
✅ Deberías ver el **Dashboard** con:
- Estadísticas del sistema
- Rondas de hoy
- Vigilantes activos
- Alertas
- Dispositivos

---

## 🔄 CÓMO USAR EL SISTEMA

### Para iniciar el sistema (cada vez):
1. ✅ Abrir XAMPP → Start Apache + MySQL
2. ✅ Abrir CMD en `backend` → `npm run dev`
3. ✅ Abrir CMD en `frontend` → `npm run dev`
4. ✅ Ir a http://localhost:5173

### Para detener el sistema:
1. En las ventanas de CMD, presiona **Ctrl+C**
2. Cierra las ventanas de CMD
3. En XAMPP, Stop Apache + MySQL

---

## 👥 USUARIOS DEMO

La base de datos incluye estos usuarios de prueba:

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@demo.nextia.tech | demo123 |
| Supervisor | supervisor@demo.nextia.tech | demo123 |
| Vigilante | juan.garcia@demo.nextia.tech | demo123 |

---

## ❓ SOLUCIÓN DE PROBLEMAS

### Problema: Backend no conecta a MySQL
**Solución:**
1. Verifica que XAMPP esté corriendo (Apache + MySQL en verde)
2. Abre phpMyAdmin y verifica que existe la base de datos `nextia`
3. Verifica que el archivo `.env` tenga `DB_PASSWORD=` (vacío)

### Problema: Frontend muestra "Error al iniciar sesión"
**Solución:**
1. Verifica que el backend esté corriendo (ventana CMD abierta)
2. Ve a http://localhost:3000 - debería mostrar `{"mensaje":"API NEXTia Technologies"}`
3. Si no funciona, cierra el backend (Ctrl+C) y vuelve a ejecutar `npm run dev`

### Problema: Puerto 3000 o 5173 ocupado
**Solución:**
```cmd
# Cerrar proceso en puerto 3000
netstat -ano | findstr :3000
taskkill /PID [numero_del_proceso] /F

# Cerrar proceso en puerto 5173
netstat -ano | findstr :5173
taskkill /PID [numero_del_proceso] /F
```

---

## 📞 CONTACTO

Si encuentras algún problema, revisa:
1. Que XAMPP esté corriendo
2. Que ambos CMD (backend y frontend) estén abiertos
3. Que la base de datos esté importada correctamente

---

## 🎯 PRÓXIMOS PASOS

Una vez que el sistema esté funcionando, puedes:
1. ✅ Explorar el dashboard
2. ✅ Probar con diferentes usuarios (admin, supervisor, vigilante)
3. ✅ Ver las estadísticas del sistema
4. ✅ Continuar desarrollando nuevas funcionalidades

---

**¡Disfruta de NEXTia Technologies! 🚀**
