import { createContext } from 'react'
import { User } from '../lib/supabase'

interface AuthContextType {
  user: User | null
  loading: boolean
  error: { message: string } | null
  signIn: (email: string, password: string) => Promise<{ success: boolean }>
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean }>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined) 