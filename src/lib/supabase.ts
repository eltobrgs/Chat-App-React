import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para as tabelas do Supabase
export type User = {
  id: string
  email: string
  full_name: string
  avatar_url: string | null
  status: 'online' | 'offline'
  last_seen: string | null
  created_at: string
  updated_at: string
  username: string | null
  bio: string | null
  phone_number: string | null
  is_verified: boolean
  settings: {
    notifications: boolean
    theme: 'light' | 'dark'
    language: string
  } | null
} 