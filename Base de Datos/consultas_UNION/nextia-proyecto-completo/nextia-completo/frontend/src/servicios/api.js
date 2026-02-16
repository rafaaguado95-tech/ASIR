import axios from 'axios'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Interceptor para agregar token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout()
      window.location.href = '/login'
      toast.error('Sesión expirada')
    } else if (error.response?.status === 403) {
      toast.error('No tienes permisos para realizar esta acción')
    } else if (error.response?.status >= 500) {
      toast.error('Error del servidor. Intenta de nuevo más tarde')
    }
    return Promise.reject(error)
  }
)

// AUTH
export const authAPI = {
  login: (email, contrasena) => api.post('/auth/login', { email, contrasena }),
  me: () => api.get('/auth/me'),
  logout: () => api.post('/auth/logout')
}

// DASHBOARD
export const dashboardAPI = {
  resumen: () => api.get('/dashboard/resumen'),
  actividad: () => api.get('/dashboard/actividad'),
  estadisticas: (params) => api.get('/dashboard/estadisticas', { params })
}

export default api
