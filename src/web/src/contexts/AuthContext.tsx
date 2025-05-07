import { createContext, useState, useEffect, ReactNode } from 'react'

export interface AuthState {
  token: string | null
  userId: string | null
  username: string | null
  fcmToken: string | null
}

export interface AuthContextType extends AuthState {
  setAuth: (data: AuthState) => void
  clearAuth: () => void
  isAuthenticated: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuthState] = useState<AuthState>(() => {
    const stored = localStorage.getItem('auth')
    return stored
      ? JSON.parse(stored)
      : { token: null, userId: null, username: null, fcmToken: null }
  })

  useEffect(() => {
    localStorage.setItem('auth', JSON.stringify(auth))
  }, [auth])

  const setAuth = (data: AuthState) => {
    setAuthState(data);
  }

  const clearAuth = () => {
    setAuthState({ token: null, userId: null, username: null, fcmToken: null });
    localStorage.removeItem('auth');
  }

  const isAuthenticated = !!auth.token

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, clearAuth, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}
