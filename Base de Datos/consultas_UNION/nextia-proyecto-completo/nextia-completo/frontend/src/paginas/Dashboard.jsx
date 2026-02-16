import { useEffect, useState } from 'react'
import { dashboardAPI } from '../servicios/api'
import { Activity, Users, AlertTriangle, Radio } from 'lucide-react'

export default function Dashboard() {
  const [resumen, setResumen] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    cargarResumen()
  }, [])

  const cargarResumen = async () => {
    try {
      const { data } = await dashboardAPI.resumen()
      setResumen(data)
    } catch (error) {
      console.error('Error cargando resumen:', error)
    } finally {
      setCargando(false)
    }
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
      {/* Bienvenida */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          ¡Bienvenido! 👋
        </h2>
        <p className="text-slate-400">
          Panel de control - Sistema operativo y funcionando correctamente
        </p>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Rondas Hoy */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-nextia-cyan/10 rounded-lg">
              <Activity className="text-nextia-cyan" size={24} />
            </div>
            <span className="text-xs text-nextia-green">↑ Activo</span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {resumen?.rondas_hoy || 0}
          </h3>
          <p className="text-sm text-slate-400">Rondas hoy</p>
        </div>

        {/* Vigilantes */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-nextia-purple/10 rounded-lg">
              <Users className="text-nextia-purple" size={24} />
            </div>
            <span className="text-xs text-slate-400">
              {resumen?.vigilantes_online || 0}/{resumen?.total_vigilantes || 0}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {resumen?.total_vigilantes || 0}
          </h3>
          <p className="text-sm text-slate-400">Vigilantes</p>
        </div>

        {/* Alertas */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-red-500/10 rounded-lg">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            {resumen?.alertas_activas > 0 && (
              <span className="text-xs text-red-500">↑ Atención</span>
            )}
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {resumen?.alertas_activas || 0}
          </h3>
          <p className="text-sm text-slate-400">Alertas activas</p>
        </div>

        {/* Dispositivos */}
        <div className="card">
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-nextia-green/10 rounded-lg">
              <Radio className="text-nextia-green" size={24} />
            </div>
            <span className="text-xs text-slate-400">
              {resumen?.dispositivos_activos || 0}/{resumen?.total_dispositivos || 0}
            </span>
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">
            {resumen?.dispositivos_activos || 0}
          </h3>
          <p className="text-sm text-slate-400">Dispositivos activos</p>
        </div>
      </div>

      {/* Información del sistema */}
      <div className="card">
        <h3 className="text-xl font-bold text-white mb-4">Estado del Sistema</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-nextia-darker rounded-lg">
            <span className="text-slate-300">Backend API</span>
            <span className="flex items-center gap-2 text-nextia-green">
              <span className="w-2 h-2 bg-nextia-green rounded-full animate-pulse"></span>
              Operativo
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-nextia-darker rounded-lg">
            <span className="text-slate-300">Base de Datos</span>
            <span className="flex items-center gap-2 text-nextia-green">
              <span className="w-2 h-2 bg-nextia-green rounded-full animate-pulse"></span>
              Conectado
            </span>
          </div>
          <div className="flex items-center justify-between p-3 bg-nextia-darker rounded-lg">
            <span className="text-slate-300">Sistema de Detección BLE</span>
            <span className="flex items-center gap-2 text-nextia-green">
              <span className="w-2 h-2 bg-nextia-green rounded-full animate-pulse"></span>
              Listo
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
