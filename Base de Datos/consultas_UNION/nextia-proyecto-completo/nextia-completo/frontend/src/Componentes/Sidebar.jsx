import { NavLink } from 'react-router-dom'
import { 
  LayoutDashboard, 
  Route, 
  Radio, 
  Users, 
  Smartphone, 
  Watch,
  Activity, 
  AlertTriangle,
  Clock,
  FileText,
  Settings
} from 'lucide-react'

export default function Sidebar() {
  const menuItems = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/rutas', icon: Route, label: 'Rutas' },
    { to: '/beacons', icon: Radio, label: 'Beacons' },
    { to: '/vigilantes', icon: Users, label: 'Vigilantes' },
    { to: '/pulseras', icon: Watch, label: 'Pulseras BLE' },
    { to: '/dispositivos', icon: Smartphone, label: 'Dispositivos' },
    { to: '/detecciones', icon: Activity, label: 'Detecciones' },
    { to: '/alertas', icon: AlertTriangle, label: 'Alertas' },
    { to: '/fichajes', icon: Clock, label: 'Fichajes' },
    { to: '/reportes', icon: FileText, label: 'Reportes' },
    { to: '/configuracion', icon: Settings, label: 'Configuración' },
  ]

  return (
    <aside className="w-64 bg-nextia-dark border-r border-slate-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-nextia-cyan to-nextia-purple flex items-center justify-center">
            <span className="text-white font-bold text-xl">N</span>
          </div>
          <div>
            <h1 className="text-lg font-bold gradient-nextia-text">NEXTia</h1>
            <p className="text-xs text-slate-400">Technologies</p>
          </div>
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-nextia-cyan/10 to-nextia-purple/10 text-nextia-cyan border-l-2 border-nextia-cyan'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <item.icon size={20} />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-slate-800">
        <p className="text-xs text-slate-500 text-center">
          © 2025 NEXTia Technologies
        </p>
      </div>
    </aside>
  )
}
