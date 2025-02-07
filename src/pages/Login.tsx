import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import crudRightImage from '../assets/images/crud-right-image.png'

export default function Login() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/chat')
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

            <div className="space-y-2 mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Simples. Seguro.</h2>
              <h2 className="text-2xl font-bold text-gray-800">Mensagens Confiáveis.</h2>
              <p className="text-gray-600 text-sm">
                Com o Chat-App, você terá mensagens rápidas, simples e seguras, disponível em todos os dispositivos do mundo.
              </p>
            </div>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="Digite seu email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Senha
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                placeholder="Digite sua senha"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar Senha
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition"
                  placeholder="Confirme sua senha"
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-[#25D366] text-white py-3 rounded-lg font-semibold hover:bg-[#1ea952] transition duration-300"
            >
              {isLogin ? 'Entrar' : 'Cadastrar'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
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