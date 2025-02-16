import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { User } from '../lib/supabase'
import Swal from 'sweetalert2'

interface AuthError {
  message: string
}

interface UseAuthReturn {
  user: User | null
  loading: boolean
  error: AuthError | null
  signUp: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean, shouldResetForm: boolean }>
  signIn: (email: string, password: string) => Promise<{ success: boolean }>
  signOut: () => Promise<void>
  setUser: (user: User | null) => void
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)

    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!mounted) return

        if (session?.user?.email_confirmed_at) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (mounted) {
            setUser(profile)
          }
        } else if (mounted) {
          setUser(null)
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error)
        if (mounted) {
          setUser(null)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (event === 'SIGNED_OUT') {
        setUser(null)
        setLoading(false)
        return
      }

      if (session?.user?.email_confirmed_at) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (mounted) {
          setUser(profile)
        }
      } else if (mounted) {
        setUser(null)
      }
      
      setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const signUp = async (email: string, password: string, userData: Partial<User>) => {
    try {
      setLoading(true)
      setError(null)

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.full_name
          }
        }
      })

      if (signUpError) throw signUpError

      await Swal.fire({
        title: 'Cadastro realizado com sucesso!',
        html: `
          <p>Enviamos um email de confirmação para <strong>${email}</strong></p>
          <p class="mt-2">Por favor, verifique sua caixa de entrada e confirme seu email para ativar sua conta.</p>
        `,
        icon: 'success',
        confirmButtonText: 'Entendi',
        confirmButtonColor: '#25D366',
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })

      return { success: false, shouldResetForm: true }
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : 'Erro ao criar conta' })
      await Swal.fire({
        title: 'Erro no cadastro',
        text: err instanceof Error ? err.message : 'Erro ao criar conta',
        icon: 'error',
        confirmButtonText: 'Tentar novamente',
        confirmButtonColor: '#25D366'
      })
      return { success: false, shouldResetForm: false }
    } finally {
      setLoading(false)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      setError(null)

      const { error: signInError, data } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (signInError) throw signInError

      if (!data.user?.email_confirmed_at) {
        const result = await Swal.fire({
          title: 'Email não confirmado',
          html: `
            <p>Você precisa confirmar seu email antes de fazer login.</p>
            <p class="mt-2">Verifique sua caixa de entrada e clique no link de confirmação.</p>
          `,
          icon: 'warning',
          confirmButtonText: 'Reenviar email',
          confirmButtonColor: '#25D366',
          showCancelButton: true,
          cancelButtonText: 'Fechar'
        })

        if (result.isConfirmed) {
          await supabase.auth.resend({
            type: 'signup',
            email: email
          })
          await Swal.fire({
            title: 'Email reenviado!',
            text: 'Verifique sua caixa de entrada',
            icon: 'success',
            confirmButtonColor: '#25D366'
          })
        }
        return { success: false }
      }

      await Swal.fire({
        title: 'Login bem-sucedido!',
        text: `Bem-vindo! Login realizado com ${email}`,
        icon: 'success',
        confirmButtonText: 'Continuar',
        confirmButtonColor: '#25D366',
        timer: 2000,
        timerProgressBar: true,
        showClass: {
          popup: 'animate__animated animate__fadeInDown'
        },
        hideClass: {
          popup: 'animate__animated animate__fadeOutUp'
        }
      })

      return { success: true }
    } catch (err) {
      setError({ message: err instanceof Error ? err.message : 'Erro ao fazer login' })
      await Swal.fire({
        title: 'Erro no login',
        text: err instanceof Error ? err.message : 'Erro ao fazer login',
        icon: 'error',
        confirmButtonText: 'Tentar novamente',
        confirmButtonColor: '#25D366'
      })
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      setError(null)

      // Remove a sessão do Supabase
      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      // Limpa o estado local
      setUser(null)

      // Remove todos os tokens do Supabase do localStorage
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith('sb-')) {
          localStorage.removeItem(key)
        }
      })

      // Limpa a sessão
      sessionStorage.clear()

    } catch (err) {
      setError({ message: err instanceof Error ? err.message : 'Erro ao fazer logout' })
      await Swal.fire({
        title: 'Erro ao sair',
        text: err instanceof Error ? err.message : 'Erro ao fazer logout',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#25D366'
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    user,
    loading,
    error,
    signUp,
    signIn,
    signOut,
    setUser
  }
} 