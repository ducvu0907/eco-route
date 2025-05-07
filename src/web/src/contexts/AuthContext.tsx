import { Role } from '@/types/types'
import { createContext, useState, ReactNode } from 'react'

export interface AuthState {
  token: string | null
  userId: string | null
  username: string | null
  fcmToken: string | null
  role: Role | null
}

export interface AuthContextType extends AuthState {
  setAuth: (data: AuthState) => void
  clearAuth: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

const getInitialState = (): AuthState => ({
  token: localStorage.getItem('token'),
  userId: localStorage.getItem('userId'),
  username: localStorage.getItem('username'),
  fcmToken: localStorage.getItem('fcmToken'),
  role: (localStorage.getItem('role') as Role | null) || null,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuthState] = useState<AuthState>(getInitialState)

  const setAuth = (data: AuthState) => {
    setAuthState(data)
    localStorage.setItem('token', data.token ?? '')
    localStorage.setItem('userId', data.userId ?? '')
    localStorage.setItem('username', data.username ?? '')
    localStorage.setItem('fcmToken', data.fcmToken ?? '')
    localStorage.setItem('role', data.role ?? '')
  }

  const clearAuth = () => {
    setAuthState({ token: null, userId: null, username: null, fcmToken: null, role: null })
    localStorage.removeItem('token')
    localStorage.removeItem('userId')
    localStorage.removeItem('username')
    localStorage.removeItem('fcmToken')
    localStorage.removeItem('role')
  }

  const isAuthenticated = !!auth.token

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, clearAuth, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
