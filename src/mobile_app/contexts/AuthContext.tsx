import { Role } from '@/types/types'
import * as SecureStore from 'expo-secure-store'
import { createContext, ReactNode, useEffect, useState } from 'react'

export interface AuthState {
  token: string | null
  userId: string | null
  username: string | null
  fcmToken: string | null
  role: Role | null
}

const keys = {
  token: 'token',
  userId: 'userId',
  username: 'username',
  fcmToken: 'fcmToken',
  role: 'role',
}

export const saveAuthState = async (state: AuthState) => {
  await Promise.all([
    SecureStore.setItemAsync(keys.token, state.token ?? ''),
    SecureStore.setItemAsync(keys.userId, state.userId ?? ''),
    SecureStore.setItemAsync(keys.username, state.username ?? ''),
    SecureStore.setItemAsync(keys.fcmToken, state.fcmToken ?? ''),
    SecureStore.setItemAsync(keys.role, state.role ?? ''),
  ])
}

export const clearAuthState = async () => {
  await Promise.all(Object.values(keys).map(key => SecureStore.deleteItemAsync(key)))
}

export const getInitialAuthState = async (): Promise<AuthState> => {
  const [token, userId, username, fcmToken, role] = await Promise.all([
    SecureStore.getItemAsync(keys.token),
    SecureStore.getItemAsync(keys.userId),
    SecureStore.getItemAsync(keys.username),
    SecureStore.getItemAsync(keys.fcmToken),
    SecureStore.getItemAsync(keys.role),
  ])
  return {
    token: token || null,
    userId: userId || null,
    username: username || null,
    fcmToken: fcmToken || null,
    role: (role as Role) || null,
  }
}

export interface AuthContextType extends AuthState {
  setAuth: (data: AuthState) => void
  clearAuth: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [auth, setAuthState] = useState<AuthState>({
    token: null,
    userId: null,
    username: null,
    fcmToken: null,
    role: null,
  })
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      try {
        const storedAuth = await getInitialAuthState()
        setAuthState(storedAuth)
      } finally {
        setIsLoading(false)
      }
    })()
  }, [])

  const setAuth = (data: AuthState) => {
    setAuthState(data)
    saveAuthState(data)
  }

  const clearAuth = () => {
    setAuthState({ token: null, userId: null, username: null, fcmToken: null, role: null })
    clearAuthState()
  }

  const isAuthenticated = !!auth.token;

  return (
    <AuthContext.Provider value={{ ...auth, setAuth, clearAuth, isAuthenticated, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}