import { ReactNode } from 'react'
import { useAuth } from '../hooks/useAuth'
import { AuthContext } from './auth-context'

export default function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}