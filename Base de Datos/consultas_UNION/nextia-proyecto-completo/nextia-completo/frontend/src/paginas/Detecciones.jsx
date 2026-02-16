import { useState, useEffect } from 'react';
import { Activity, CheckCircle, XCircle, Users, MapPin, Route, TrendingUp, Calendar, Search, Filter, RefreshCw } from 'lucide-react';

export function Detecciones() {
  const [detecciones, setDetecciones] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [vigilantes, setVigilantes] = useState([]);
  const [rutas, setRutas] = useState([]);
  const [beacons, setBeacons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtros, setFiltros] = useState({
    usuario_id: '',
    ruta_id: '',
    beacon_id: '',
    fecha_desde: '',
    fecha_hasta: '',
    cumplimiento: '',
    busqueda: ''
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('nextia-auth');
      const authData = token ? JSON.parse(token) : null;
      const headers = { 'Authorization': `Bearer ${authData?.state?.token}` };

      // Cargar todo en paralelo
      const [deteccionesRes, estadisticasRes, vigilantesRes, rutasRes, beaconsRes] = await Promise.all([
        fetch('http://localhost:3000/api/detecciones', { headers }),
        fetch('http://localhost:3000/api/detecciones/estadisticas', { headers }),
        fetch('http://localhost:3000/api/vigilantes', { headers }),
        fetch('http://localhost:3000/api/rutas', { headers }),
        fetch('http://localhost:3000/api/beacons', { headers })
      ]);

      const [deteccionesData, estadisticasData, vigilantesData, rutasData, beaconsData] = await Promise.all([
        deteccionesRes.json(),
        estadisticasRes.json(),
        vigilantesRes.json(),
        rutasRes.json(),
        beaconsRes.json()
      ]);

      setDetecciones(deteccionesData);
      setEstadisticas(estadisticasData);
      setVigilantes(vigilantesData);
      setRutas(rutasData);
      setBeacons(beaconsData);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const aplicarFiltros = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('nextia-auth');
      const authData = token ? JSON.parse(token) : null;
      const params = new URLSearchParams();
      
      if (filtros.usuario_id) params.append('usuario_id', filtros.usuario_id);
      if (filtros.ruta_id) params.append('ruta_id', filtros.ruta_id);
      if (filtros.beacon_id) params.append('beacon_id', filtros.beacon_id);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);
      if (filtros.cumplimiento) params.append('cumplimiento', filtros.cumplimiento);

      const response = await fetch(`http://localhost:3000/api/detecciones?${params}`, {
        headers: { 'Authorization': `Bearer ${authData?.state?.token}` }
      });
      const data = await response.json();
      setDetecciones(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const limpiarFiltros = () => {
    setFiltros({
      usuario_id: '',
      ruta_id: '',
      beacon_id: '',
      fecha_desde: '',
      fecha_hasta: '',
      cumplimiento: '',
      busqueda: ''
    });
    cargarDatos();
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const deteccionesFiltradas = detecciones.filter(det => {
    if (!filtros.busqueda) return true;
    const busqueda = filtros.busqueda.toLowerCase();
    return (
      det.vigilante_nombre?.toLowerCase().includes(busqueda) ||
      det.vigilante_apellidos?.toLowerCase().includes(busqueda) ||
      det.ruta_nombre?.toLowerCase().includes(busqueda) ||
      det.beacon_nombre?.toLowerCase().includes(busqueda)
    );
  });

  if (loading && !estadisticas) {
    return (
      <div className="p-8 flex items-center justify-center">
        <div className="spinner w-12 h-12" />
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <Activity className="w-8 h-8" />
            Detecciones
          </h1>
          <p className="text-slate-400 mt-1">Monitoreo en tiempo real de detecciones de beacons</p>
        </div>
        <button
          onClick={cargarDatos}
          className="flex items-center gap-2 px-4 py-2 bg-nextia-cyan hover:bg-nextia-cyan/90 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Actualizar
        </button>
      </div>

      {/* Estadísticas */}
      {estadisticas && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Detecciones</p>
                <p className="text-3xl font-bold text-white">
                  {estadisticas.resumen.total_detecciones}
                </p>
              </div>
              <Activity className="w-12 h-12 text-nextia-cyan opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Detecciones Exitosas</p>
                <p className="text-3xl font-bold text-nextia-green">
                  {estadisticas.resumen.detecciones_exitosas}
                </p>
              </div>
              <CheckCircle className="w-12 h-12 text-nextia-green opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">Detecciones Fallidas</p>
                <p className="text-3xl font-bold text-red-500">
                  {estadisticas.resumen.detecciones_fallidas}
                </p>
              </div>
              <XCircle className="w-12 h-12 text-red-500 opacity-20" />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-400 mb-1">% Cumplimiento</p>
                <p className="text-3xl font-bold text-nextia-cyan">
                  {estadisticas.resumen.porcentaje_cumplimiento}%
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-nextia-cyan opacity-20" />
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Vigilante
            </label>
            <select
              value={filtros.usuario_id}
              onChange={(e) => setFiltros({...filtros, usuario_id: e.target.value})}
              className="input"
            >
              <option value="">Todos</option>
              {vigilantes.map(v => (
                <option key={v.id} value={v.id}>
                  {v.nombre} {v.apellidos}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Ruta
            </label>
            <select
              value={filtros.ruta_id}
              onChange={(e) => setFiltros({...filtros, ruta_id: e.target.value})}
              className="input"
            >
              <option value="">Todas</option>
              {rutas.map(r => (
                <option key={r.id} value={r.id}>
                  {r.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Beacon
            </label>
            <select
              value={filtros.beacon_id}
              onChange={(e) => setFiltros({...filtros, beacon_id: e.target.value})}
              className="input"
            >
              <option value="">Todos</option>
              {beacons.map(b => (
                <option key={b.id} value={b.id}>
                  {b.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Estado
            </label>
            <select
              value={filtros.cumplimiento}
              onChange={(e) => setFiltros({...filtros, cumplimiento: e.target.value})}
              className="input"
            >
              <option value="">Todos</option>
              <option value="true">Exitosa</option>
              <option value="false">Fallida</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Desde
            </label>
            <input
              type="date"
              value={filtros.fecha_desde}
              onChange={(e) => setFiltros({...filtros, fecha_desde: e.target.value})}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Hasta
            </label>
            <input
              type="date"
              value={filtros.fecha_hasta}
              onChange={(e) => setFiltros({...filtros, fecha_hasta: e.target.value})}
              className="input"
            />
          </div>

          <div className="md:col-span-2 flex gap-2">
            <button
              onClick={aplicarFiltros}
              className="flex-1 px-4 py-2 bg-nextia-cyan hover:bg-nextia-cyan/90 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Aplicar Filtros
            </button>
            <button
              onClick={limpiarFiltros}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* Búsqueda */}
        <div className="mt-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por vigilante, ruta o beacon..."
              value={filtros.busqueda}
              onChange={(e) => setFiltros({...filtros, busqueda: e.target.value})}
              className="input pl-10"
            />
          </div>
        </div>
      </div>

      {/* Tabla de Detecciones */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Fecha y Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Vigilante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Ruta
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Beacon
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Ubicación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase tracking-wider">
                  RSSI
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700">
              {deteccionesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-slate-400">
                    No se encontraron detecciones
                  </td>
                </tr>
              ) : (
                deteccionesFiltradas.map((deteccion) => (
                  <tr key={deteccion.id} className="hover:bg-slate-800 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-white">
                          {formatearFecha(deteccion.fecha_hora)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-white">
                          {deteccion.vigilante_nombre} {deteccion.vigilante_apellidos}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {deteccion.ruta_nombre ? (
                        <div className="flex items-center gap-2">
                          <Route className="w-4 h-4 text-slate-500" />
                          <span className="text-sm text-white">{deteccion.ruta_nombre}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-500">Sin ruta</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-500" />
                        <span className="text-sm text-white">{deteccion.beacon_nombre}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-400">
                        {deteccion.beacon_ubicacion || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {deteccion.cumplimiento ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-nextia-green/10 text-nextia-green border border-nextia-green/20">
                          <CheckCircle className="w-3 h-3" />
                          Exitosa
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                          <XCircle className="w-3 h-3" />
                          Fallida
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm text-slate-400">
                        {deteccion.rssi ? `${deteccion.rssi} dBm` : 'N/A'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer con conteo */}
      <div className="flex justify-between items-center text-sm text-slate-400 mt-4">
        <span>Mostrando {deteccionesFiltradas.length} de {detecciones.length} detecciones</span>
      </div>
    </div>
  );
}
