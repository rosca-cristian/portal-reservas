import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User } from '@/types/api'
import { isTokenValid } from '@/lib/auth/jwt'

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  setAuth: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  checkTokenValidity: () => boolean

  // Role helpers
  isStudent: () => boolean
  isFaculty: () => boolean
  isAdmin: () => boolean
  hasRole: (role: string | string[]) => boolean
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      setAuth: (user, token) => {
        // Validate token before setting
        if (!isTokenValid(token)) {
          console.warn('Attempting to set invalid token')
          set({ error: 'Invalid token', isAuthenticated: false })
          return
        }

        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        })
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
          isLoading: false,
        })
      },

      setLoading: (loading) => {
        set({ isLoading: loading })
      },

      setError: (error) => {
        set({ error, isLoading: false })
      },

      checkTokenValidity: () => {
        const { token } = get()
        if (!token) return false

        const valid = isTokenValid(token)
        if (!valid) {
          // Token is invalid/expired, logout
          get().logout()
          return false
        }

        return true
      },

      // Role helpers
      isStudent: () => {
        const { user } = get()
        return user?.role?.toUpperCase() === 'STUDENT'
      },

      isFaculty: () => {
        const { user } = get()
        return user?.role?.toUpperCase() === 'INSTRUCTOR'
      },

      isAdmin: () => {
        const { user } = get()
        return user?.role?.toUpperCase() === 'ADMIN'
      },

      hasRole: (role) => {
        const { user } = get()
        if (!user) return false

        const userRole = user.role?.toUpperCase()

        if (Array.isArray(role)) {
          return role.some(r => r.toUpperCase() === userRole)
        }

        return role.toUpperCase() === userRole
      },
    }),
    {
      name: 'auth-storage',
      // Check token validity when hydrating from storage
      onRehydrateStorage: () => (state) => {
        if (state?.token && !isTokenValid(state.token)) {
          state.logout()
        }
      },
    }
  )
)
