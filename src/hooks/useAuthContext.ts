import { useContext } from 'react'
import { AuthContext } from '../contexts/auth-context'

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext deve ser usado dentro de um AuthProvider')
  }
  return context
} 