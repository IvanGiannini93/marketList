import { create } from 'zustand'
import { authService } from '../services/authService'

const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,

  login: async (credentials) => {
    const data = await authService.login(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }))
    set({ token: data.token, user: { name: data.name, email: data.email } })
  },

  register: async (credentials) => {
    const data = await authService.register(credentials)
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify({ name: data.name, email: data.email }))
    set({ token: data.token, user: { name: data.name, email: data.email } })
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ token: null, user: null })
  },
}))

export default useAuthStore
