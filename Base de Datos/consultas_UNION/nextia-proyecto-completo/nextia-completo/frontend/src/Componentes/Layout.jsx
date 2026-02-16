import { Outlet } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { LogOut, User } from 'lucide-react'
import Sidebar from '../componentes/Sidebar'

export default function Layout() {
  const { usuario, logout } = useAuthStore()

  const handleLogout = () => {
    logout()
    window.location.href = '/login'
  }

  return (
    <div className="min-h-screen bg-nextia-darker flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-nextia-dark border-b border-slate-800 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">Panel de Control</h2>
              <p className="text-sm text-slate-400">Sistema Anti-Fraude para Rondas de Seguridad</p>
            </div>

            <div className="flex items-center gap-4">
              {/* Usuario */}
              <div className="flex items-center gap-3 px-4 py-2 bg-slate-800 rounded-lg">
                <div className="w-8 h-8 bg-gradient-to-br from-nextia-cyan to-nextia-purple rounded-full flex items-center justify-center">
                  <User size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {usuario?.nombre} {usuario?.apellidos}
                  </p>
                  <p className="text-xs text-slate-400 capitalize">{usuario?.rol}</p>
                </div>
              </div>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                title="Cerrar sesión"
              >
                <LogOut size={20} className="text-slate-400 hover:text-white" />
              </button>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
