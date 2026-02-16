import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Radio, Battery, MapPin, Users, Mail, Phone, Shield, Smartphone } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:3000/api'

// ============================================
// DETECCIONES - Importado desde archivo separado
// ============================================
export { Detecciones } from './Detecciones'

// ============================================
// RUTAS - COMPLETO
// ============================================
export function Rutas() {
  const [rutas, setRutas] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [rutaSeleccionada, setRutaSeleccionada] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    tipo_programacion: 'diaria',
    hora_inicio: '',
    hora_fin: '',
    color: '#00D9FF',
    activa: true
  })

  useEffect(() => {
    cargarRutas()
  }, [])

  const cargarRutas = async () => {
    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null
      
      const { data } = await axios.get(`${API_URL}/rutas`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })
      setRutas(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar rutas')
    } finally {
      setCargando(false)
    }
  }

  const abrirModal = (ruta = null) => {
    if (ruta) {
      setRutaSeleccionada(ruta)
      setFormData({
        nombre: ruta.nombre,
        descripcion: ruta.descripcion || '',
        tipo_programacion: ruta.tipo_programacion,
        hora_inicio: ruta.hora_inicio || '',
        hora_fin: ruta.hora_fin || '',
        color: ruta.color,
        activa: ruta.activa
      })
    } else {
      setRutaSeleccionada(null)
      setFormData({
        nombre: '',
        descripcion: '',
        tipo_programacion: 'diaria',
        hora_inicio: '',
        hora_fin: '',
        color: '#00D9FF',
        activa: true
      })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setRutaSeleccionada(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null

      if (rutaSeleccionada) {
        await axios.put(
          `${API_URL}/rutas/${rutaSeleccionada.id}`,
          formData,
          { headers: { Authorization: `Bearer ${authData?.state?.token}` } }
        )
        toast.success('Ruta actualizada correctamente')
      } else {
        await axios.post(
          `${API_URL}/rutas`,
          formData,
          { headers: { Authorization: `Bearer ${authData?.state?.token}` } }
        )
        toast.success('Ruta creada correctamente')
      }

      cerrarModal()
      cargarRutas()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al guardar ruta')
    }
  }

  const eliminarRuta = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta ruta?')) return

    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null

      await axios.delete(`${API_URL}/rutas/${id}`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })

      toast.success('Ruta eliminada correctamente')
      cargarRutas()
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al eliminar ruta')
    }
  }

  const rutasFiltradas = rutas.filter(ruta =>
    ruta.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    ruta.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (cargando) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Rutas</h1>
          <p className="text-slate-400">Gestión de rutas de vigilancia</p>
        </div>
        <button onClick={() => abrirModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nueva Ruta
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Buscar rutas..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rutasFiltradas.map((ruta) => (
          <div key={ruta.id} className="card hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: ruta.color }} />
                  <h3 className="text-lg font-bold text-white">{ruta.nombre}</h3>
                </div>
                {ruta.descripcion && (
                  <p className="text-sm text-slate-400 line-clamp-2">{ruta.descripcion}</p>
                )}
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${ruta.activa ? 'bg-nextia-green/10 text-nextia-green' : 'bg-slate-700 text-slate-400'}`}>
                {ruta.activa ? 'Activa' : 'Inactiva'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Tipo:</span>
                <span className="text-white capitalize">{ruta.tipo_programacion}</span>
              </div>
              {ruta.hora_inicio && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Horario:</span>
                  <span className="text-white">{ruta.hora_inicio} - {ruta.hora_fin}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Puntos:</span>
                <span className="text-white">{ruta.total_puntos} beacons</span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
              <button onClick={() => abrirModal(ruta)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm text-white">
                <Edit size={16} />
                Editar
              </button>
              <button onClick={() => eliminarRuta(ruta.id)} className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-sm text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {rutasFiltradas.length === 0 && (
        <div className="card text-center py-12">
          <MapPin className="mx-auto mb-4 text-slate-600" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No hay rutas</h3>
          <p className="text-slate-400 mb-4">
            {busqueda ? 'No se encontraron rutas' : 'Comienza creando tu primera ruta'}
          </p>
          {!busqueda && (
            <button onClick={() => abrirModal()} className="btn-primary inline-flex items-center gap-2">
              <Plus size={20} />
              Crear Primera Ruta
            </button>
          )}
        </div>
      )}

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-nextia-dark rounded-xl p-6 w-full max-w-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              {rutaSeleccionada ? 'Editar Ruta' : 'Nueva Ruta'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Nombre *</label>
                <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="input" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Descripción</label>
                <textarea value={formData.descripcion} onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })} className="input" rows="3" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
                  <select value={formData.tipo_programacion} onChange={(e) => setFormData({ ...formData, tipo_programacion: e.target.value })} className="input">
                    <option value="diaria">Diaria</option>
                    <option value="semanal">Semanal</option>
                    <option value="mensual">Mensual</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Hora Inicio</label>
                  <input type="time" value={formData.hora_inicio} onChange={(e) => setFormData({ ...formData, hora_inicio: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Hora Fin</label>
                  <input type="time" value={formData.hora_fin} onChange={(e) => setFormData({ ...formData, hora_fin: e.target.value })} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Color</label>
                <input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="h-12 w-full rounded-lg cursor-pointer" />
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {rutaSeleccionada ? 'Actualizar' : 'Crear'} Ruta
                </button>
                <button type="button" onClick={cerrarModal} className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// BEACONS - COMPLETO
// ============================================
export function Beacons() {
  const [beacons, setBeacons] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [beaconSeleccionado, setBeaconSeleccionado] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    uuid: '',
    edificio: '',
    planta: '',
    ubicacion: '',
    nivel_bateria: 100,
    estado: 'activo'
  })

  useEffect(() => {
    cargarBeacons()
  }, [])

  const cargarBeacons = async () => {
    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null
      
      const { data } = await axios.get(`${API_URL}/beacons`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })
      setBeacons(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar beacons')
    } finally {
      setCargando(false)
    }
  }

  const abrirModal = (beacon = null) => {
    if (beacon) {
      setBeaconSeleccionado(beacon)
      setFormData({
        nombre: beacon.nombre,
        uuid: beacon.uuid,
        edificio: beacon.edificio || '',
        planta: beacon.planta || '',
        ubicacion: beacon.ubicacion || '',
        nivel_bateria: beacon.nivel_bateria,
        estado: beacon.estado
      })
    } else {
      setBeaconSeleccionado(null)
      setFormData({
        nombre: '',
        uuid: '',
        edificio: '',
        planta: '',
        ubicacion: '',
        nivel_bateria: 100,
        estado: 'activo'
      })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setBeaconSeleccionado(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null

      if (beaconSeleccionado) {
        await axios.put(
          `${API_URL}/beacons/${beaconSeleccionado.id}`,
          formData,
          { headers: { Authorization: `Bearer ${authData?.state?.token}` } }
        )
        toast.success('Beacon actualizado')
      } else {
        await axios.post(
          `${API_URL}/beacons`,
          formData,
          { headers: { Authorization: `Bearer ${authData?.state?.token}` } }
        )
        toast.success('Beacon creado')
      }

      cerrarModal()
      cargarBeacons()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.error || 'Error al guardar beacon')
    }
  }

  const eliminarBeacon = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este beacon?')) return

    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null

      await axios.delete(`${API_URL}/beacons/${id}`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })

      toast.success('Beacon eliminado')
      cargarBeacons()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.error || 'Error al eliminar')
    }
  }

  const beaconsFiltrados = beacons.filter(beacon =>
    beacon.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    beacon.uuid.toLowerCase().includes(busqueda.toLowerCase())
  )

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo': return 'bg-nextia-green/10 text-nextia-green'
      case 'inactivo': return 'bg-slate-700 text-slate-400'
      case 'mantenimiento': return 'bg-yellow-500/10 text-yellow-500'
      default: return 'bg-slate-700 text-slate-400'
    }
  }

  const getBateriaColor = (nivel) => {
    if (nivel >= 70) return 'text-nextia-green'
    if (nivel >= 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  if (cargando) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Beacons</h1>
          <p className="text-slate-400">Gestión de dispositivos BLE</p>
        </div>
        <button onClick={() => abrirModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nuevo Beacon
        </button>
      </div>

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Buscar beacons..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {beaconsFiltrados.map((beacon) => (
          <div key={beacon.id} className="card hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-1">{beacon.nombre}</h3>
                <p className="text-sm text-slate-400 font-mono">{beacon.uuid}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getEstadoColor(beacon.estado)}`}>
                {beacon.estado}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {beacon.edificio && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Edificio:</span>
                  <span className="text-white">{beacon.edificio}</span>
                </div>
              )}
              {beacon.planta && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Planta:</span>
                  <span className="text-white">{beacon.planta}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-700">
                <div className="flex items-center gap-2">
                  <Battery size={16} className={getBateriaColor(beacon.nivel_bateria)} />
                  <span className="text-slate-400">Batería:</span>
                </div>
                <span className={`font-medium ${getBateriaColor(beacon.nivel_bateria)}`}>
                  {beacon.nivel_bateria}%
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
              <button onClick={() => abrirModal(beacon)} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm text-white">
                <Edit size={16} />
                Editar
              </button>
              <button onClick={() => eliminarBeacon(beacon.id)} className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-sm text-red-500">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {beaconsFiltrados.length === 0 && (
        <div className="card text-center py-12">
          <Radio className="mx-auto mb-4 text-slate-600" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No hay beacons</h3>
          <p className="text-slate-400 mb-4">
            {busqueda ? 'No se encontraron beacons' : 'Comienza registrando tu primer beacon'}
          </p>
          {!busqueda && (
            <button onClick={() => abrirModal()} className="btn-primary inline-flex items-center gap-2">
              <Plus size={20} />
              Crear Primer Beacon
            </button>
          )}
        </div>
      )}

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-nextia-dark rounded-xl p-6 w-full max-w-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              {beaconSeleccionado ? 'Editar Beacon' : 'Nuevo Beacon'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nombre *</label>
                  <input type="text" value={formData.nombre} onChange={(e) => setFormData({ ...formData, nombre: e.target.value })} className="input" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">UUID *</label>
                  <input type="text" value={formData.uuid} onChange={(e) => setFormData({ ...formData, uuid: e.target.value })} className="input font-mono" required />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Edificio</label>
                  <input type="text" value={formData.edificio} onChange={(e) => setFormData({ ...formData, edificio: e.target.value })} className="input" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Planta</label>
                  <input type="text" value={formData.planta} onChange={(e) => setFormData({ ...formData, planta: e.target.value })} className="input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Ubicación</label>
                <input type="text" value={formData.ubicacion} onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })} className="input" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Estado</label>
                  <select value={formData.estado} onChange={(e) => setFormData({ ...formData, estado: e.target.value })} className="input">
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                    <option value="mantenimiento">Mantenimiento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Batería (%)</label>
                  <input type="number" value={formData.nivel_bateria} onChange={(e) => setFormData({ ...formData, nivel_bateria: e.target.value })} className="input" min="0" max="100" />
                </div>
              </div>
              <div className="flex items-center gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {beaconSeleccionado ? 'Actualizar' : 'Crear'} Beacon
                </button>
                <button type="button" onClick={cerrarModal} className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// VIGILANTES - COMPLETO
// ============================================
export function Vigilantes() {
  const [vigilantes, setVigilantes] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [vigilanteSeleccionado, setVigilanteSeleccionado] = useState(null)
  const [formData, setFormData] = useState({
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    contrasena: '',
    activo: true
  })

  useEffect(() => {
    cargarVigilantes()
    cargarEstadisticas()
  }, [])

  const cargarVigilantes = async () => {
    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null
      
      const { data } = await axios.get(`${API_URL}/vigilantes`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })
      setVigilantes(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar vigilantes')
    } finally {
      setCargando(false)
    }
  }

  const cargarEstadisticas = async () => {
    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null
      
      const { data } = await axios.get(`${API_URL}/vigilantes/estadisticas`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })
      setEstadisticas(data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const abrirModal = (vigilante = null) => {
    if (vigilante) {
      setVigilanteSeleccionado(vigilante)
      setFormData({
        nombre: vigilante.nombre,
        apellidos: vigilante.apellidos || '',
        email: vigilante.email,
        telefono: vigilante.telefono || '',
        contrasena: '',
        activo: vigilante.activo
      })
    } else {
      setVigilanteSeleccionado(null)
      setFormData({
        nombre: '',
        apellidos: '',
        email: '',
        telefono: '',
        contrasena: '',
        activo: true
      })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setVigilanteSeleccionado(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!vigilanteSeleccionado && !formData.contrasena) {
      toast.error('La contraseña es requerida')
      return
    }

    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null

      const dataToSend = { ...formData }
      if (vigilanteSeleccionado && !dataToSend.contrasena) {
        delete dataToSend.contrasena
      }

      if (vigilanteSeleccionado) {
        await axios.put(
          `${API_URL}/vigilantes/${vigilanteSeleccionado.id}`,
          dataToSend,
          { headers: { Authorization: `Bearer ${authData?.state?.token}` } }
        )
        toast.success('Vigilante actualizado')
      } else {
        await axios.post(
          `${API_URL}/vigilantes`,
          dataToSend,
          { headers: { Authorization: `Bearer ${authData?.state?.token}` } }
        )
        toast.success('Vigilante creado')
      }

      cerrarModal()
      cargarVigilantes()
      cargarEstadisticas()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.error || 'Error al guardar vigilante')
    }
  }

  const eliminarVigilante = async (id) => {
    if (!confirm('¿Estás seguro de eliminar este vigilante?')) return

    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null

      await axios.delete(`${API_URL}/vigilantes/${id}`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })

      toast.success('Vigilante eliminado')
      cargarVigilantes()
      cargarEstadisticas()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.error || 'Error al eliminar')
    }
  }

  const vigilantesFiltrados = vigilantes.filter(vigilante =>
    vigilante.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    vigilante.apellidos?.toLowerCase().includes(busqueda.toLowerCase()) ||
    vigilante.email.toLowerCase().includes(busqueda.toLowerCase())
  )

  if (cargando) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Vigilantes</h1>
          <p className="text-slate-400">Gestión de personal de seguridad</p>
        </div>
        <button onClick={() => abrirModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nuevo Vigilante
        </button>
      </div>

      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Vigilantes</p>
                <p className="text-2xl font-bold text-white">{estadisticas.total}</p>
              </div>
              <Users className="text-nextia-cyan" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Activos</p>
                <p className="text-2xl font-bold text-nextia-green">{estadisticas.activos}</p>
              </div>
              <Shield className="text-nextia-green" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Inactivos</p>
                <p className="text-2xl font-bold text-slate-400">{estadisticas.inactivos}</p>
              </div>
              <Users className="text-slate-400" size={32} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Con Dispositivo</p>
                <p className="text-2xl font-bold text-nextia-purple">{estadisticas.con_dispositivo}</p>
              </div>
              <Smartphone className="text-nextia-purple" size={32} />
            </div>
          </div>
        </div>
      )}

      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
          <input
            type="text"
            placeholder="Buscar vigilantes..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="input pl-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vigilantesFiltrados.map((vigilante) => (
          <div key={vigilante.id} className="card hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3 flex-1">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-nextia-cyan to-nextia-purple flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {vigilante.nombre.charAt(0)}
                  {vigilante.apellidos?.charAt(0) || ''}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-bold text-white truncate">
                    {vigilante.nombre} {vigilante.apellidos}
                  </h3>
                  <p className="text-sm text-slate-400 truncate">{vigilante.email}</p>
                </div>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${
                vigilante.activo
                  ? 'bg-nextia-green/10 text-nextia-green'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {vigilante.activo ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="space-y-2 mb-4">
              {vigilante.telefono && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={14} className="text-slate-500 flex-shrink-0" />
                  <span className="text-slate-400">Teléfono:</span>
                  <span className="text-white truncate">{vigilante.telefono}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-700">
                <span className="text-slate-400">Rutas asignadas:</span>
                <span className="text-white font-medium">{vigilante.rutas_asignadas}</span>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Detecciones hoy:</span>
                <span className="text-white font-medium">{vigilante.detecciones_hoy}</span>
              </div>

              {vigilante.dispositivo_serie && (
                <div className="flex items-center gap-2 text-sm">
                  <Smartphone size={14} className="text-nextia-purple flex-shrink-0" />
                  <span className="text-slate-400">Dispositivo:</span>
                  <span className="text-nextia-purple font-mono text-xs truncate">
                    {vigilante.dispositivo_serie}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
              <button
                onClick={() => abrirModal(vigilante)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm text-white"
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={() => eliminarVigilante(vigilante.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-sm text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {vigilantesFiltrados.length === 0 && (
        <div className="card text-center py-12">
          <Users className="mx-auto mb-4 text-slate-600" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No hay vigilantes</h3>
          <p className="text-slate-400 mb-4">
            {busqueda ? 'No se encontraron vigilantes' : 'Comienza registrando tu primer vigilante'}
          </p>
          {!busqueda && (
            <button onClick={() => abrirModal()} className="btn-primary inline-flex items-center gap-2">
              <Plus size={20} />
              Crear Primer Vigilante
            </button>
          )}
        </div>
      )}

      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-nextia-dark rounded-xl p-6 w-full max-w-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6">
              {vigilanteSeleccionado ? 'Editar Vigilante' : 'Nuevo Vigilante'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Apellidos
                  </label>
                  <input
                    type="text"
                    value={formData.apellidos}
                    onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Contraseña {vigilanteSeleccionado ? '(dejar vacío para no cambiar)' : '*'}
                </label>
                <input
                  type="password"
                  value={formData.contrasena}
                  onChange={(e) => setFormData({ ...formData, contrasena: e.target.value })}
                  className="input"
                  required={!vigilanteSeleccionado}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="activo"
                  checked={formData.activo}
                  onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="activo" className="text-sm text-slate-300">
                  Vigilante activo
                </label>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {vigilanteSeleccionado ? 'Actualizar' : 'Crear'} Vigilante
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// PULSERAS BLE - COMPLETO
// ============================================
export function Pulseras() {
  const [pulseras, setPulseras] = useState([])
  const [usuariosDisponibles, setUsuariosDisponibles] = useState([])
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtroTipo, setFiltroTipo] = useState('todas')
  const [modalAbierto, setModalAbierto] = useState(false)
  const [pulseraSeleccionada, setPulseraSeleccionada] = useState(null)
  const [formData, setFormData] = useState({
    mac_address: '',
    nombre: '',
    tipo: 'ronda',
    usuario_id: '',
    bateria: 100,
    activo: true
  })

  useEffect(() => {
    cargarPulseras()
  }, [])

  useEffect(() => {
    if (modalAbierto && formData.tipo) {
      cargarUsuariosDisponibles(formData.tipo)
    }
  }, [modalAbierto, formData.tipo])

  const cargarPulseras = async () => {
    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null
      
      const { data } = await axios.get(`${API_URL}/pulseras`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })
      setPulseras(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar pulseras')
    } finally {
      setCargando(false)
    }
  }

  const cargarUsuariosDisponibles = async (tipo) => {
    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null
      
      const { data } = await axios.get(`${API_URL}/pulseras/usuarios-disponibles?tipo=${tipo}`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })
      setUsuariosDisponibles(data)
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error al cargar usuarios')
    }
  }

  const abrirModal = (pulsera = null) => {
    if (pulsera) {
      setPulseraSeleccionada(pulsera)
      setFormData({
        mac_address: pulsera.mac_address,
        nombre: pulsera.nombre,
        tipo: pulsera.tipo,
        usuario_id: pulsera.usuario_id || '',
        bateria: pulsera.bateria,
        activo: pulsera.activo
      })
    } else {
      setPulseraSeleccionada(null)
      setFormData({
        mac_address: '',
        nombre: '',
        tipo: 'ronda',
        usuario_id: '',
        bateria: 100,
        activo: true
      })
    }
    setModalAbierto(true)
  }

  const cerrarModal = () => {
    setModalAbierto(false)
    setPulseraSeleccionada(null)
    setUsuariosDisponibles([])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null

      if (pulseraSeleccionada) {
        await axios.put(
          `${API_URL}/pulseras/${pulseraSeleccionada.id}`,
          formData,
          { headers: { Authorization: `Bearer ${authData?.state?.token}` } }
        )
        toast.success('Pulsera actualizada')
      } else {
        await axios.post(
          `${API_URL}/pulseras`,
          formData,
          { headers: { Authorization: `Bearer ${authData?.state?.token}` } }
        )
        toast.success('Pulsera creada')
      }

      cerrarModal()
      cargarPulseras()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.mensaje || 'Error al guardar pulsera')
    }
  }

  const eliminarPulsera = async (id) => {
    if (!confirm('¿Estás seguro de eliminar esta pulsera?')) return

    try {
      const token = localStorage.getItem('nextia-auth')
      const authData = token ? JSON.parse(token) : null

      await axios.delete(`${API_URL}/pulseras/${id}`, {
        headers: { Authorization: `Bearer ${authData?.state?.token}` }
      })

      toast.success('Pulsera eliminada')
      cargarPulseras()
    } catch (error) {
      console.error('Error:', error)
      toast.error(error.response?.data?.mensaje || 'Error al eliminar')
    }
  }

  const pulserasFiltradas = pulseras.filter(pulsera => {
    const matchBusqueda = 
      pulsera.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      pulsera.mac_address.toLowerCase().includes(busqueda.toLowerCase()) ||
      pulsera.usuario_nombre?.toLowerCase().includes(busqueda.toLowerCase())
    
    const matchTipo = filtroTipo === 'todas' || pulsera.tipo === filtroTipo

    return matchBusqueda && matchTipo
  })

  const getBateriaColor = (nivel) => {
    if (nivel >= 70) return 'text-nextia-green'
    if (nivel >= 30) return 'text-yellow-500'
    return 'text-red-500'
  }

  const getBateriaIcon = (nivel) => {
    if (nivel >= 70) return '🔋'
    if (nivel >= 30) return '🪫'
    return '🪫'
  }

  const getTipoColor = (tipo) => {
    return tipo === 'ronda' 
      ? 'bg-nextia-cyan/10 text-nextia-cyan' 
      : 'bg-nextia-purple/10 text-nextia-purple'
  }

  const getTipoLabel = (tipo) => {
    return tipo === 'ronda' ? 'Ronda' : 'Fichaje'
  }

  const estadisticas = {
    total: pulseras.length,
    ronda: pulseras.filter(p => p.tipo === 'ronda').length,
    fichaje: pulseras.filter(p => p.tipo === 'fichaje').length,
    asignadas: pulseras.filter(p => p.usuario_id).length,
    sinAsignar: pulseras.filter(p => !p.usuario_id).length,
    activas: pulseras.filter(p => p.activo).length
  }

  if (cargando) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Pulseras BLE</h1>
          <p className="text-slate-400">Gestión de pulseras para rondas y fichajes</p>
        </div>
        <button onClick={() => abrirModal()} className="btn-primary flex items-center gap-2">
          <Plus size={20} />
          Nueva Pulsera
        </button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-8">
        <div className="card">
          <p className="text-xs text-slate-400 mb-1">Total</p>
          <p className="text-2xl font-bold text-white">{estadisticas.total}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400 mb-1">Ronda</p>
          <p className="text-2xl font-bold text-nextia-cyan">{estadisticas.ronda}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400 mb-1">Fichaje</p>
          <p className="text-2xl font-bold text-nextia-purple">{estadisticas.fichaje}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400 mb-1">Asignadas</p>
          <p className="text-2xl font-bold text-nextia-green">{estadisticas.asignadas}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400 mb-1">Sin asignar</p>
          <p className="text-2xl font-bold text-slate-400">{estadisticas.sinAsignar}</p>
        </div>
        <div className="card">
          <p className="text-xs text-slate-400 mb-1">Activas</p>
          <p className="text-2xl font-bold text-nextia-green">{estadisticas.activas}</p>
        </div>
      </div>

      {/* Búsqueda y Filtros */}
      <div className="card mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Buscar pulseras..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFiltroTipo('todas')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'todas'
                  ? 'bg-nextia-cyan text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFiltroTipo('ronda')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'ronda'
                  ? 'bg-nextia-cyan text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Ronda
            </button>
            <button
              onClick={() => setFiltroTipo('fichaje')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filtroTipo === 'fichaje'
                  ? 'bg-nextia-purple text-white'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              Fichaje
            </button>
          </div>
        </div>
      </div>

      {/* Tarjetas de Pulseras */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pulserasFiltradas.map((pulsera) => (
          <div key={pulsera.id} className="card hover:border-slate-700 transition-colors">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Smartphone size={18} className={pulsera.tipo === 'ronda' ? 'text-nextia-cyan' : 'text-nextia-purple'} />
                  <h3 className="text-lg font-bold text-white">{pulsera.nombre}</h3>
                </div>
                <p className="text-sm text-slate-400 font-mono">{pulsera.mac_address}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getTipoColor(pulsera.tipo)}`}>
                  {getTipoLabel(pulsera.tipo)}
                </span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  pulsera.activo
                    ? 'bg-nextia-green/10 text-nextia-green'
                    : 'bg-slate-700 text-slate-400'
                }`}>
                  {pulsera.activo ? 'Activa' : 'Inactiva'}
                </span>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {/* Usuario asignado */}
              <div className="flex items-center justify-between text-sm pb-2 border-b border-slate-700">
                <span className="text-slate-400">
                  {pulsera.tipo === 'ronda' ? 'Vigilante:' : 'Trabajador:'}
                </span>
                {pulsera.usuario_id ? (
                  <div className="flex flex-col items-end">
                    <span className="text-white font-medium">
                      {pulsera.usuario_nombre} {pulsera.usuario_apellidos}
                    </span>
                    <span className="text-xs text-slate-500">{pulsera.usuario_email}</span>
                  </div>
                ) : (
                  <span className="text-slate-500 italic">Sin asignar</span>
                )}
              </div>

              {/* Batería */}
              <div className="flex items-center justify-between text-sm pt-2">
                <div className="flex items-center gap-2">
                  <Battery size={16} className={getBateriaColor(pulsera.bateria)} />
                  <span className="text-slate-400">Batería:</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-medium ${getBateriaColor(pulsera.bateria)}`}>
                    {pulsera.bateria}%
                  </span>
                  <span className="text-lg">{getBateriaIcon(pulsera.bateria)}</span>
                </div>
              </div>

              {/* Última sincronización */}
              {pulsera.ultimo_sync && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Última sync:</span>
                  <span className="text-white text-xs">
                    {new Date(pulsera.ultimo_sync).toLocaleString('es-ES', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              )}

              {/* Fecha de asignación */}
              {pulsera.fecha_asignacion && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-400">Asignada:</span>
                  <span className="text-white text-xs">
                    {new Date(pulsera.fecha_asignacion).toLocaleDateString('es-ES')}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-4 border-t border-slate-700">
              <button
                onClick={() => abrirModal(pulsera)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors text-sm text-white"
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={() => eliminarPulsera(pulsera.id)}
                className="flex items-center justify-center gap-2 px-3 py-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-sm text-red-500"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Estado vacío */}
      {pulserasFiltradas.length === 0 && (
        <div className="card text-center py-12">
          <Smartphone className="mx-auto mb-4 text-slate-600" size={48} />
          <h3 className="text-xl font-bold text-white mb-2">No hay pulseras</h3>
          <p className="text-slate-400 mb-4">
            {busqueda || filtroTipo !== 'todas'
              ? 'No se encontraron pulseras con los filtros aplicados'
              : 'Comienza registrando tu primera pulsera BLE'}
          </p>
          {!busqueda && filtroTipo === 'todas' && (
            <button onClick={() => abrirModal()} className="btn-primary inline-flex items-center gap-2">
              <Plus size={20} />
              Crear Primera Pulsera
            </button>
          )}
        </div>
      )}

      {/* Modal Crear/Editar */}
      {modalAbierto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-nextia-dark rounded-xl p-6 w-full max-w-2xl border border-slate-800 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {pulseraSeleccionada ? 'Editar Pulsera' : 'Nueva Pulsera'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    className="input"
                    placeholder="Ej: Pulsera Vigilante 01"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Dirección MAC *
                  </label>
                  <input
                    type="text"
                    value={formData.mac_address}
                    onChange={(e) => setFormData({ ...formData, mac_address: e.target.value })}
                    className="input font-mono"
                    placeholder="AA:BB:CC:DD:EE:FF"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Tipo de Pulsera *
                </label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value, usuario_id: '' })}
                  className="input"
                  required
                >
                  <option value="ronda">Ronda (Vigilantes)</option>
                  <option value="fichaje">Fichaje (Trabajadores)</option>
                </select>
                <p className="text-xs text-slate-500 mt-1">
                  {formData.tipo === 'ronda'
                    ? '📍 Para registrar paso de vigilantes por beacons'
                    : '⏰ Para control de entrada/salida de trabajadores'}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Asignar a {formData.tipo === 'ronda' ? 'Vigilante' : 'Trabajador'}
                </label>
                <select
                  value={formData.usuario_id}
                  onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
                  className="input"
                >
                  <option value="">Sin asignar</option>
                  {usuariosDisponibles.map((usuario) => (
                    <option key={usuario.id} value={usuario.id}>
                      {usuario.nombre} {usuario.apellidos} ({usuario.email})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Batería (%)
                  </label>
                  <input
                    type="number"
                    value={formData.bateria}
                    onChange={(e) => setFormData({ ...formData, bateria: parseInt(e.target.value) })}
                    className="input"
                    min="0"
                    max="100"
                    required
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.activo}
                      onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-slate-300">Pulsera activa</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  {pulseraSeleccionada ? 'Actualizar' : 'Crear'} Pulsera
                </button>
                <button
                  type="button"
                  onClick={cerrarModal}
                  className="flex-1 px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================
// DISPOSITIVOS
// ============================================
export function Dispositivos() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Dispositivos</h1>
      <div className="card">
        <p className="text-slate-400">Módulo de Dispositivos - Próximamente</p>
      </div>
    </div>
  )
}

// ============================================
// ALERTAS
// ============================================
// Alertas importado del archivo separado para mantener código limpio
export { Alertas } from './Alertas'

// ============================================
// FICHAJES
// ============================================
export function Fichajes() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Fichajes</h1>
      <div className="card">
        <p className="text-slate-400">Módulo de Fichajes - Próximamente</p>
      </div>
    </div>
  )
}

// ============================================
// REPORTES
// ============================================
export function Reportes() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Reportes</h1>
      <div className="card">
        <p className="text-slate-400">Módulo de Reportes - Próximamente</p>
      </div>
    </div>
  )
}

// ============================================
// CONFIGURACIÓN
// ============================================
export function Configuracion() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-4">Configuración</h1>
      <div className="card">
        <p className="text-slate-400">Módulo de Configuración - Próximamente</p>
      </div>
    </div>
  )
}
