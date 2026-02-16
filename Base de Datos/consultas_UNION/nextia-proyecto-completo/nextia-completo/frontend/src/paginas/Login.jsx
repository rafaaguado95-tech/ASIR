import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../stores/authStore'
import { authAPI } from '../servicios/api'
import toast from 'react-hot-toast'
import { Lock, Mail, Eye, EyeOff } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [contrasena, setContrasena] = useState('')
  const [mostrarContrasena, setMostrarContrasena] = useState(false)
  const [cargando, setCargando] = useState(false)
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!email || !contrasena) {
      toast.error('Por favor completa todos los campos')
      return
    }

    setCargando(true)

    try {
      const { data } = await authAPI.login(email, contrasena)
      setAuth(data.token, data.usuario)
      toast.success(`¡Bienvenido ${data.usuario.nombre}!`)
      navigate('/')
    } catch (error) {
      console.error('Error login:', error)
      toast.error(error.response?.data?.error || 'Error al iniciar sesión')
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="min-h-screen bg-nextia-darker flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-nextia-cyan to-nextia-purple mb-4">
            <span className="text-white font-bold text-3xl">N</span>
          </div>
          <h1 className="text-3xl font-bold gradient-nextia-text mb-2">NEXTia Technologies</h1>
          <p className="text-slate-400">Sistema Anti-Fraude para Rondas de Seguridad</p>
        </div>

        {/* Formulario */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  className="input pl-10"
                  disabled={cargando}
                />
              </div>
            </div>

            {/* Contraseña */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  type={mostrarContrasena ? 'text' : 'password'}
                  value={contrasena}
                  onChange={(e) => setContrasena(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-10 pr-10"
                  disabled={cargando}
                />
                <button
                  type="button"
                  onClick={() => setMostrarContrasena(!mostrarContrasena)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                >
                  {mostrarContrasena ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <button
              type="submit"
              disabled={cargando}
              className="btn-primary w-full flex items-center justify-center"
            >
              {cargando ? (
                <div className="spinner" />
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Credenciales demo */}
          <div className="mt-6 pt-6 border-t border-slate-700">
            <p className="text-xs text-slate-400 text-center mb-3">Credenciales DEMO:</p>
            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center p-2 bg-nextia-dark rounded">
                <span className="text-slate-400">Admin:</span>
                <code className="text-nextia-cyan">admin@demo.nextia.tech</code>
              </div>
              <p className="text-center text-slate-500 mt-2">Contraseña: <code className="text-nextia-purple">demo123</code></p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-slate-500 text-sm mt-8">
          © 2025 NEXTia Technologies. Todos los derechos reservados.
        </p>
      </div>
    </div>
  )
}
