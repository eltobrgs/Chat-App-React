import { useState, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import crudRightImage from '../assets/images/crud-right-image.png'

interface FormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
}

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()
  const { signIn, signUp, error, loading } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  })

  const [validationErrors, setValidationErrors] = useState<Partial<FormData>>({})

  const validateForm = (): boolean => {
    const errors: Partial<FormData> = {}

    // Validação de email
    if (!formData.email) {
      errors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email inválido'
    }

    // Validação de senha
    if (!formData.password) {
      errors.password = 'Senha é obrigatória'
    } else if (formData.password.length < 6) {
      errors.password = 'A senha deve ter pelo menos 6 caracteres'
    }

    // Validações adicionais para cadastro
    if (!isLogin) {
      if (!formData.fullName) {
        errors.fullName = 'Nome completo é obrigatório'
      }

      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = 'As senhas não coincidem'
      }
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    try {
      if (isLogin) {
        const result = await signIn(formData.email, formData.password)
        if (result.success) {
          navigate('/chat')
        }
      } else {
        const result = await signUp(formData.email, formData.password, {
          full_name: formData.fullName
        })
        
        if (result.shouldResetForm) {
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            fullName: ''
          })
          setValidationErrors({})
          setIsLogin(true)
        }
      }
    } catch (err) {
      console.error('Erro na autenticação:', err)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    // Limpa o erro do campo quando o usuário começa a digitar
    if (validationErrors[name as keyof FormData]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Coluna da esquerda - Formulário */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-8">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/134/134914.png"
                alt="Logo"
                className="w-12 h-12"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">
                  {isLogin ? 'Bem-vindo de volta!' : 'Criar uma conta'}
                </h1>
                <p className="text-gray-600">
                  {isLogin ? 'Entre na sua conta para continuar' : 'Preencha seus dados para começar'}
                </p>
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg">
                {error.message}
              </div>
            )}

            <div className="space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Simples. Seguro.</h2>
              <h2 className="text-2xl font-bold text-gray-800">Mensagens Confiáveis.</h2>
              <p className="text-gray-600 text-sm">
                Com o Chat-App, você terá mensagens rápidas, simples e seguras, disponível em todos os dispositivos do mundo.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    validationErrors.fullName ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                  placeholder="Digite seu nome completo"
                />
                {validationErrors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.fullName}</p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 rounded-lg border ${
                  validationErrors.email ? 'border-red-300' : 'border-gray-300'
                } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                placeholder="Digite seu email"
              />
              {validationErrors.email && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 rounded-lg border ${
                    validationErrors.password ? 'border-red-300' : 'border-gray-300'
                  } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                  placeholder="Digite sua senha"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {validationErrors.password && (
                <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 rounded-lg border ${
                      validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    } focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition`}
                    placeholder="Confirme sua senha"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  >
                    {showConfirmPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                {validationErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#25D366] text-white py-3 rounded-lg font-semibold transition-all duration-300 relative overflow-hidden ${
                loading ? 'opacity-90 cursor-not-allowed' : 'hover:bg-[#1ea952] hover:shadow-lg'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-white rounded-full animate-[bounce_0.7s_infinite]" style={{ animationDelay: '0s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-[bounce_0.7s_infinite]" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-white rounded-full animate-[bounce_0.7s_infinite]" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="ml-2 animate-pulse">Processando...</span>
                </div>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {isLogin ? (
                    <>
                      <span>Entrar</span>
                      <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </>
                  ) : (
                    <>
                      <span>Cadastrar</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                      </svg>
                    </>
                  )}
                </span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsLogin(!isLogin)
                setFormData({
                  email: '',
                  password: '',
                  confirmPassword: '',
                  fullName: ''
                })
                setValidationErrors({})
              }}
              className="text-[#075E54] hover:underline font-medium"
            >
              {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre'}
            </button>
          </div>
        </div>
      </div>

      {/* Coluna da direita - Imagem */}
      <div className="hidden lg:block w-1/2 bg-[#075E54] relative">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-[300px] h-[600px] bg-black rounded-[60px] p-4 shadow-2xl">
            <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[120px] h-[25px] bg-black rounded-b-3xl"></div>
            <div className="w-full h-full bg-white rounded-[50px] overflow-hidden">
              <img 
                src={crudRightImage}
                alt="Interface do Chat"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 