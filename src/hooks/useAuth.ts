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
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  // Função para verificar e validar a sessão
  const checkSession = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session?.user?.id) {
        // Verifica se o token ainda é válido
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        if (profileError) {
          throw profileError
        }

        if (profile) {
          setUser(profile)
          return true
        }
      }
      return false
    } catch (error) {
      console.error('Erro ao verificar sessão:', error)
      return false
    } finally {
      setLoading(false)
    }
  }

  // Efeito para verificar a sessão ao montar o componente
  useEffect(() => {
    checkSession()

    // Listener para mudanças no estado de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single()

          if (profile) {
            setUser(profile)
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
        localStorage.removeItem('supabase.auth.token')
      }
      setLoading(false)
    })

    return () => {
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

      // Atualiza o token no localStorage
      const session = await supabase.auth.getSession()
      if (session.data.session) {
        localStorage.setItem('supabase.auth.token', JSON.stringify(session.data.session))
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

      const { error: signOutError } = await supabase.auth.signOut()
      if (signOutError) throw signOutError

      setUser(null)
      localStorage.removeItem('supabase.auth.token')
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