import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Login from './paginas/Login'
import Layout from './componentes/Layout'
import Dashboard from './paginas/Dashboard'
import { 
  Rutas, 
  Beacons, 
  Vigilantes,
  Pulseras,
  Dispositivos, 
  Detecciones, 
  Alertas, 
  Fichajes, 
  Reportes, 
  Configuracion 
} from './paginas/Paginas'

function App() {
  const { token } = useAuthStore()

  return (
    <Routes>
      {/* Ruta de Login */}
      <Route 
        path="/login" 
        element={token ? <Navigate to="/" replace /> : <Login />} 
      />

      {/* Rutas protegidas con Layout */}
      <Route
        path="/"
        element={token ? <Layout /> : <Navigate to="/login" replace />}
      >
        <Route index element={<Dashboard />} />
        <Route path="rutas" element={<Rutas />} />
        <Route path="beacons" element={<Beacons />} />
        <Route path="vigilantes" element={<Vigilantes />} />
        <Route path="pulseras" element={<Pulseras />} />
        <Route path="dispositivos" element={<Dispositivos />} />
        <Route path="detecciones" element={<Detecciones />} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="fichajes" element={<Fichajes />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="configuracion" element={<Configuracion />} />
      </Route>

      {/* Ruta no encontrada */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
