import { Role } from '@/types/types'
import * as SecureStore from 'expo-secure-store'
import { createContext, ReactNode, useEffect, useState } from 'react'

const keys = {
  token: 'token',
  userId: 'userId',
  username: 'username',
  fcmToken: 'fcmToken',
  role: 'role',
}

const getItem = async (key: string) => (await SecureStore.getItemAsync(key)) || null
const setItem = async (key: string, value: string | null) =>
  SecureStore.setItemAsync(key, value ?? '')

export interface AuthContextType {
  token: string | null
  setToken: (value: string | null) => void

  userId: string | null
  setUserId: (value: string | null) => void

  username: string | null
  setUsername: (value: string | null) => void

  fcmToken: string | null
  setFcmToken: (value: string | null) => void

  role: Role | null
  setRole: (value: Role | null) => void

  clearAuth: () => void
  isAuthenticated: boolean
  isLoading: boolean
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null)
  const [userId, setUserIdState] = useState<string | null>(null)
  const [username, setUsernameState] = useState<string | null>(null)
  const [fcmToken, setFcmTokenState] = useState<string | null>(null)
  const [role, setRoleState] = useState<Role | null>(null)

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const [storedToken, storedUserId, storedUsername, storedFcmToken, storedRole] =
        await Promise.all([
          getItem(keys.token),
          getItem(keys.userId),
          getItem(keys.username),
          getItem(keys.fcmToken),
          getItem(keys.role),
        ])

      setTokenState(storedToken)
      setUserIdState(storedUserId)
      setUsernameState(storedUsername)
      setFcmTokenState(storedFcmToken)
      setRoleState(storedRole as Role | null)

      setIsLoading(false)
    })()
  }, [])

  const setToken = (value: string | null) => {
    setTokenState(value)
    setItem(keys.token, value)
  }

  const setUserId = (value: string | null) => {
    setUserIdState(value)
    setItem(keys.userId, value)
  }

  const setUsername = (value: string | null) => {
    setUsernameState(value)
    setItem(keys.username, value)
  }

  const setFcmToken = (value: string | null) => {
    setFcmTokenState(value)
    setItem(keys.fcmToken, value)
  }

  const setRole = (value: Role | null) => {
    setRoleState(value)
    setItem(keys.role, value)
  }

  const clearAuth = async () => {
    setTokenState(null)
    setUserIdState(null)
    setUsernameState(null)
    // retain fcmToken if needed
    setRoleState(null)

    await Promise.all([
      SecureStore.deleteItemAsync(keys.token),
      SecureStore.deleteItemAsync(keys.userId),
      SecureStore.deleteItemAsync(keys.username),
      SecureStore.deleteItemAsync(keys.role),
      // comment out if you want to keep fcmToken
      // SecureStore.deleteItemAsync(keys.fcmToken),
    ])
  }

  const isAuthenticated = !!token

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        userId,
        setUserId,
        username,
        setUsername,
        fcmToken,
        setFcmToken,
        role,
        setRole,
        clearAuth,
        isAuthenticated,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
