import { useState, useEffect } from 'react'
import { AlertTriangle, CheckCircle, XCircle, Clock, Bell, Filter, Search, RefreshCw, Settings, Trash2, Battery, Radio, MapPin, Route as RouteIcon } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

const API_URL = 'http://localhost:3000/api'

// Utilidad para obtener headers de autenticación
const getAuthHeaders = () => {
  const token = localStorage.getItem('nextia-auth')
  const authData = token ? JSON.parse(token) : null
  return { Authorization: `Bearer ${authData?.state?.token}` }
}

export function Alertas() {
  const [alertas, setAlertas] = useState([])
  const [estadisticas, setEstadisticas] = useState(null)
  const [configuracion, setConfiguracion] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [busqueda, setBusqueda] = useState('')
  const [filtros, setFiltros] = useState({
    tipo: '',
    gravedad: '',
    estado: ''
  })
  const [modalConfig, setModalConfig] = useState(false)
  const [configForm, setConfigForm] = useState({
    alerta_ronda_minutos: 30,
    alerta_fichaje_minutos: 15,
    alerta_bateria_porcentaje: 20,
    alerta_inactividad_horas: 24,
    notificaciones_email: true,
    notificaciones_push: false
  })

  useEffect(() => {
    cargarDatos()
  }, [])

  const cargarDatos = async () => {
    try {
      setCargando(true)
      const headers = getAuthHeaders()

      if (!headers.Authorization) {
        toast.error('No hay sesión activa')
        setCargando(false)
        return
      }

      // Cargar alertas, estadísticas y configuración en paralelo
      const [alertasRes, statsRes, configRes] = await Promise.all([
        axios.get(`${API_URL}/alertas`, { headers }),
        axios.get(`${API_URL}/alertas/estadisticas`, { headers }),
        axios.get(`${API_URL}/alertas/configuracion`, { headers })
      ])

      setAlertas(Array.isArray(alertasRes.data) ? alertasRes.data : [])
      
      // Estadísticas devuelve objeto con resumen, por_día, pendientes_antiguas
      setEstadisticas(statsRes.data)
      
      setConfiguracion(configRes.data)
      setConfigForm(configRes.data)
      
      toast.success('Datos cargados correctamente')
    } catch (error) {
      console.error('Error al cargar datos:', error.response?.data || error.message)
      const mensajeError = error.response?.data?.error || 'Error al cargar los datos'
      toast.error(mensajeError)
    } finally {
      setCargando(false)
    }
  }

  const aplicarFiltros = async () => {
    try {
      setCargando(true)
      const headers = getAuthHeaders()

      if (!headers.Authorization) {
        toast.error('No hay sesión activa')
        return
      }

      const params = new URLSearchParams()
      if (filtros.tipo) params.append('tipo', filtros.tipo)
      if (filtros.gravedad) params.append('gravedad', filtros.gravedad)
      if (filtros.estado) params.append('estado', filtros.estado)

      const { data } = await axios.get(`${API_URL}/alertas?${params}`, { headers })
      setAlertas(Array.isArray(data) ? data : [])
      toast.success('Filtros aplicados')
    } catch (error) {
      console.error('Error al aplicar filtros:', error.response?.data || error.message)
      toast.error(error.response?.data?.error || 'Error al aplicar filtros')
    } finally {
      setCargando(false)
    }
  }

  const limpiarFiltros = () => {
    setFiltros({ tipo: '', gravedad: '', estado: '' })
    cargarDatos()
  }

  const cambiarEstado = async (id, nuevoEstado, notas = '') => {
    try {
      const headers = getAuthHeaders()

      if (!headers.Authorization) {
        toast.error('No hay sesión activa')
        return
      }

      await axios.put(
        `${API_URL}/alertas/${id}/estado`,
        { estado: nuevoEstado, notas },
        { headers }
      )

      toast.success('Estado actualizado')
      cargarDatos()
    } catch (error) {
      console.error('Error al actualizar estado:', error.response?.data || error.message)
      toast.error(error.response?.data?.error || 'Error al actualizar estado')
    }
  }

  const eliminarAlerta = async (id) => {
    if (!confirm('¿Eliminar esta alerta?')) return

    try {
      const headers = getAuthHeaders()

      if (!headers.Authorization) {
        toast.error('No hay sesión activa')
        return
      }

      await axios.delete(`${API_URL}/alertas/${id}`, { headers })

      toast.success('Alerta eliminada')
      cargarDatos()
    } catch (error) {
      console.error('Error al eliminar:', error.response?.data || error.message)
      toast.error(error.response?.data?.error || 'Error al eliminar')
    }
  }

  const guardarConfiguracion = async (e) => {
    e.preventDefault()

    try {
      const headers = getAuthHeaders()

      if (!headers.Authorization) {
        toast.error('No hay sesión activa')
        return
      }

      await axios.put(
        `${API_URL}/alertas/configuracion`,
        configForm,
        { headers }
      )

      toast.success('Configuración guardada')
      setModalConfig(false)
      cargarDatos()
    } catch (error) {
      console.error('Error al guardar configuración:', error.response?.data || error.message)
      toast.error(error.response?.data?.error || 'Error al guardar configuración')
    }
  }

  const alertasFiltradas = alertas.filter(alerta => {
    if (!busqueda) return true
    const searchLower = busqueda.toLowerCase()
    return (
      alerta.titulo?.toLowerCase().includes(searchLower) ||
      alerta.descripcion?.toLowerCase().includes(searchLower) ||
      alerta.vigilante_nombre?.toLowerCase().includes(searchLower)
    )
  })

  const getGravedadColor = (gravedad) => {
    switch (gravedad) {
      case 'critica': return 'bg-red-500/10 text-red-500 border-red-500/20'
      case 'alta': return 'bg-orange-500/10 text-orange-500 border-orange-500/20'
      case 'media': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'baja': return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      default: return 'bg-slate-700 text-slate-400'
    }
  }

  const getGravedadIcon = (gravedad) => {
    switch (gravedad) {
      case 'critica': return <AlertTriangle className="w-5 h-5" />
      case 'alta': return <AlertTriangle className="w-5 h-5" />
      case 'media': return <Bell className="w-5 h-5" />
      case 'baja': return <Bell className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getTipoLabel = (tipo) => {
    const labels = {
      ronda_incompleta: 'Ronda Incompleta',
      fichaje_faltante: 'Fichaje Faltante',
      bateria_baja: 'Batería Baja',
      dispositivo_inactivo: 'Dispositivo Inactivo',
      fuera_horario: 'Fuera de Horario'
    }
    return labels[tipo] || tipo
  }

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'ronda_incompleta': return <RouteIcon className="w-4 h-4" />
      case 'fichaje_faltante': return <Clock className="w-4 h-4" />
      case 'bateria_baja': return <Battery className="w-4 h-4" />
      case 'dispositivo_inactivo': return <Radio className="w-4 h-4" />
      case 'fuera_horario': return <Clock className="w-4 h-4" />
      default: return <Bell className="w-4 h-4" />
    }
  }

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Alertas</h1>
          <p className="text-slate-400">Sistema de monitoreo y notificaciones</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setModalConfig(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
          >
            <Settings size={20} />
            Configuración
          </button>
          <button
            onClick={cargarDatos}
            className="flex items-center gap-2 px-4 py-2 bg-nextia-cyan hover:bg-nextia-cyan/90 text-white rounded-lg transition-colors"
          >
            <RefreshCw size={20} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Estadísticas */}
      {estadisticas && estadisticas.resumen && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Alertas</p>
                <p className="text-3xl font-bold text-white">{estadisticas.resumen.total_alertas || 0}</p>
              </div>
              <Bell className="w-12 h-12 text-slate-600" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Pendientes</p>
                <p className="text-3xl font-bold text-orange-500">{estadisticas.resumen.pendientes || 0}</p>
              </div>
              <Clock className="w-12 h-12 text-orange-500 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Críticas</p>
                <p className="text-3xl font-bold text-red-500">{estadisticas.resumen.criticas || 0}</p>
              </div>
              <AlertTriangle className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Resueltas</p>
                <p className="text-3xl font-bold text-nextia-green">{estadisticas.resumen.resueltas || 0}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-nextia-green opacity-20" />
            </div>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="card mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Filtros</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Tipo</label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="input"
            >
              <option value="">Todos</option>
              <option value="ronda_incompleta">Ronda Incompleta</option>
              <option value="fichaje_faltante">Fichaje Faltante</option>
              <option value="bateria_baja">Batería Baja</option>
              <option value="dispositivo_inactivo">Dispositivo Inactivo</option>
              <option value="fuera_horario">Fuera de Horario</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Gravedad</label>
            <select
              value={filtros.gravedad}
              onChange={(e) => setFiltros({ ...filtros, gravedad: e.target.value })}
              className="input"
            >
              <option value="">Todas</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Estado</label>
            <select
              value={filtros.estado}
              onChange={(e) => setFiltros({ ...filtros, estado: e.target.value })}
              className="input"
            >
              <option value="">Todos</option>
              <option value="pendiente">Pendiente</option>
              <option value="resuelta">Resuelta</option>
              <option value="ignorada">Ignorada</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <button
              onClick={aplicarFiltros}
              className="flex-1 px-4 py-2 bg-nextia-cyan hover:bg-nextia-cyan/90 text-white rounded-lg transition-colors"
            >
              Aplicar
            </button>
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input
              type="text"
              placeholder="Buscar alertas..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Lista de Alertas */}
      <div className="space-y-4">
        {alertasFiltradas.length === 0 ? (
          <div className="card text-center py-12">
            <Bell className="mx-auto mb-4 text-slate-600" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">No hay alertas</h3>
            <p className="text-slate-400">
              {busqueda || filtros.tipo || filtros.gravedad || filtros.estado
                ? 'No se encontraron alertas con los filtros aplicados'
                : 'No hay alertas registradas en el sistema'}
            </p>
          </div>
        ) : (
          alertasFiltradas.map((alerta) => (
            <div
              key={alerta.id}
              className={`card hover:border-slate-600 transition-colors ${
                !alerta.leida ? 'border-l-4 border-l-nextia-cyan' : ''
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Contenido principal */}
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${getGravedadColor(alerta.gravedad)}`}>
                      {getGravedadIcon(alerta.gravedad)}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-bold text-white">{alerta.titulo}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getGravedadColor(alerta.gravedad)} border`}>
                          {alerta.gravedad.toUpperCase()}
                        </span>
                      </div>

                      {alerta.descripcion && (
                        <p className="text-slate-400 text-sm mb-2">{alerta.descripcion}</p>
                      )}

                      <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                        <div className="flex items-center gap-1">
                          {getTipoIcon(alerta.tipo)}
                          <span>{getTipoLabel(alerta.tipo)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatearFecha(alerta.fecha_hora)}</span>
                        </div>

                        {alerta.vigilante_nombre && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>{alerta.vigilante_nombre} {alerta.vigilante_apellidos}</span>
                          </div>
                        )}

                        {alerta.ruta_nombre && (
                          <div className="flex items-center gap-1">
                            <RouteIcon className="w-4 h-4" />
                            <span>{alerta.ruta_nombre}</span>
                          </div>
                        )}
                      </div>

                      {alerta.notas && (
                        <div className="mt-3 p-3 bg-slate-800 rounded-lg">
                          <p className="text-xs text-slate-400 mb-1">Notas:</p>
                          <p className="text-sm text-white">{alerta.notas}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex flex-col gap-2">
                  {alerta.estado === 'pendiente' && (
                    <>
                      <button
                        onClick={() => cambiarEstado(alerta.id, 'resuelta')}
                        className="px-3 py-2 bg-nextia-green/10 hover:bg-nextia-green/20 text-nextia-green rounded-lg transition-colors text-sm flex items-center gap-2"
                      >
                        <CheckCircle size={16} />
                        Resolver
                      </button>
                      <button
                        onClick={() => cambiarEstado(alerta.id, 'ignorada')}
                        className="px-3 py-2 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg transition-colors text-sm flex items-center gap-2"
                      >
                        <XCircle size={16} />
                        Ignorar
                      </button>
                    </>
                  )}

                  {alerta.estado !== 'pendiente' && (
                    <span className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${
                      alerta.estado === 'resuelta'
                        ? 'bg-nextia-green/10 text-nextia-green'
                        : 'bg-slate-700 text-slate-400'
                    }`}>
                      {alerta.estado === 'resuelta' ? (
                        <><CheckCircle size={16} /> Resuelta</>
                      ) : (
                        <><XCircle size={16} /> Ignorada</>
                      )}
                    </span>
                  )}

                  <button
                    onClick={() => eliminarAlerta(alerta.id)}
                    className="px-3 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors text-sm flex items-center gap-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal de Configuración */}
      {modalConfig && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-nextia-dark rounded-xl p-6 w-full max-w-2xl border border-slate-800">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6" />
              Configuración de Alertas
            </h2>

            <form onSubmit={guardarConfiguracion} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Alerta Ronda (minutos)
                  </label>
                  <input
                    type="number"
                    value={configForm.alerta_ronda_minutos}
                    onChange={(e) => setConfigForm({ ...configForm, alerta_ronda_minutos: parseInt(e.target.value) })}
                    className="input"
                    min="1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Tiempo sin detección para generar alerta
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Alerta Fichaje (minutos)
                  </label>
                  <input
                    type="number"
                    value={configForm.alerta_fichaje_minutos}
                    onChange={(e) => setConfigForm({ ...configForm, alerta_fichaje_minutos: parseInt(e.target.value) })}
                    className="input"
                    min="1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Retraso para alerta de fichaje
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Batería Baja (%)
                  </label>
                  <input
                    type="number"
                    value={configForm.alerta_bateria_porcentaje}
                    onChange={(e) => setConfigForm({ ...configForm, alerta_bateria_porcentaje: parseInt(e.target.value) })}
                    className="input"
                    min="1"
                    max="100"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Nivel de batería para alerta
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Inactividad (horas)
                  </label>
                  <input
                    type="number"
                    value={configForm.alerta_inactividad_horas}
                    onChange={(e) => setConfigForm({ ...configForm, alerta_inactividad_horas: parseInt(e.target.value) })}
                    className="input"
                    min="1"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Horas sin actividad para alerta
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-700 pt-4">
                <h3 className="text-lg font-semibold text-white mb-4">Notificaciones</h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configForm.notificaciones_email}
                      onChange={(e) => setConfigForm({ ...configForm, notificaciones_email: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-300">Notificaciones por Email</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={configForm.notificaciones_push}
                      onChange={(e) => setConfigForm({ ...configForm, notificaciones_push: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-slate-300">Notificaciones Push</span>
                  </label>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-4">
                <button type="submit" className="btn-primary flex-1">
                  Guardar Configuración
                </button>
                <button
                  type="button"
                  onClick={() => setModalConfig(false)}
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
