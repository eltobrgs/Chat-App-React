import ChatInput from './ChatInput';
import ChatBubble from './ChatBubble';
import { Conversa } from './ListaConversas';
import { useState } from 'react';
import Swal from 'sweetalert2';

interface ChatContentProps {
  onVoltar: () => void;
  conversaAtiva?: Conversa;
}

interface Mensagem {
  id: number;
  texto?: string;
  horario: string;
  enviada: boolean;
  tipo: 'texto' | 'audio' | 'imagem';
  duracao?: string;
  imagem?: string;
  status?: 'enviado' | 'entregue' | 'lido';
}

interface SearchState {
  isSearching: boolean;
  searchTerm: string;
  searchResults: number[];
  currentResult: number;
}

const mensagensPorConversa: Record<number, Mensagem[]> = {
  1: [ // Mensagens da Alice
  {
    id: 1,
    texto: "Olá! Como você está?",
    horario: "09:30",
    enviada: false,
    tipo: 'texto',
    status: 'lido'
  },
  {
    id: 2,
      texto: "Estou bem, obrigado! E você?",
    horario: "09:31",
    enviada: true,
    tipo: 'texto',
    status: 'lido'
  },
  {
    id: 3,
    tipo: 'audio',
    horario: "09:32",
    enviada: false,
    duracao: "0:32"
    }
  ],
  2: [ // Mensagens do João
    {
      id: 1,
      texto: "Vamos marcar aquela reunião?",
      horario: "09:15",
      enviada: false,
      tipo: 'texto',
      status: 'lido'
    },
    {
      id: 2,
      texto: "Claro! Que tal amanhã às 14h?",
      horario: "09:16",
      enviada: true,
      tipo: 'texto',
      status: 'lido'
    },
    {
      id: 3,
    tipo: 'imagem',
      horario: "09:17",
    enviada: true,
    imagem: "https://source.unsplash.com/random/400x300",
    status: 'entregue'
    }
  ]
};

export default function ChatContent({ onVoltar, conversaAtiva }: ChatContentProps) {
  const [mensagens, setMensagens] = useState<Record<number, Mensagem[]>>(mensagensPorConversa);
  const [ultimoId, setUltimoId] = useState(3); // Começa com 3 pois já temos 3 mensagens em cada conversa
  const [showOptions, setShowOptions] = useState(false);
  const [searchState, setSearchState] = useState<SearchState>({
    isSearching: false,
    searchTerm: '',
    searchResults: [],
    currentResult: -1
  });

  const handleSendMessage = (message: string) => {
    if (!conversaAtiva) return;

    const novaMensagem: Mensagem = {
      id: ultimoId + 1,
      texto: message,
      horario: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
    enviada: true,
    tipo: 'texto',
    status: 'enviado'
    };

    setMensagens(prevMensagens => {
      const novasMensagens = {
        ...prevMensagens,
        [conversaAtiva.id]: [...(prevMensagens[conversaAtiva.id] || []), novaMensagem]
      };

      // Atualiza a busca se houver um termo de pesquisa ativo
      if (searchState.isSearching && searchState.searchTerm && novaMensagem.texto) {
        const termoPesquisa = searchState.searchTerm.toLowerCase();
        const textoMensagem = novaMensagem.texto.toLowerCase();
        
        if (textoMensagem.includes(termoPesquisa)) {
          setSearchState(prev => ({
            ...prev,
            searchResults: [...prev.searchResults, novaMensagem.id],
            currentResult: prev.searchResults.length // Aponta para a nova mensagem
          }));
        }
      }

      return novasMensagens;
    });

    setUltimoId(prev => prev + 1);
  };

  const handleEditMessage = (id: number, novoTexto: string) => {
    if (!conversaAtiva) return;

    setMensagens(prevMensagens => ({
      ...prevMensagens,
      [conversaAtiva.id]: prevMensagens[conversaAtiva.id].map(msg => 
        msg.id === id ? { ...msg, texto: novoTexto } : msg
      )
    }));
  };

  const handleDeleteMessage = (id: number) => {
    if (!conversaAtiva) return;

    setMensagens(prevMensagens => ({
      ...prevMensagens,
      [conversaAtiva.id]: prevMensagens[conversaAtiva.id].filter(msg => msg.id !== id)
    }));
  };

  const handleBlockContact = async () => {
    if (!conversaAtiva) return;

    const result = await Swal.fire({
      title: 'Bloquear contato',
      text: `Tem certeza que deseja bloquear ${conversaAtiva.nome}?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, bloquear',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280'
    });

    if (result.isConfirmed) {
      // Implementação futura do bloqueio
      await Swal.fire({
        title: 'Contato bloqueado',
        text: `${conversaAtiva.nome} foi bloqueado com sucesso.`,
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
      });
      setShowOptions(false);
    }
  };

  const handleSearch = (term: string) => {
    if (!conversaAtiva) return;
    
    if (!term.trim()) {
      setSearchState({
        isSearching: false,
        searchTerm: '',
        searchResults: [],
        currentResult: -1
      });
      return;
    }

    // Busca em todas as mensagens atuais
    const results = mensagens[conversaAtiva.id]
      .filter(msg => msg.texto?.toLowerCase().includes(term.toLowerCase()))
      .map(msg => msg.id);

    setSearchState({
      isSearching: true,
      searchTerm: term,
      searchResults: results,
      currentResult: results.length > 0 ? 0 : -1
    });
  };

  if (!conversaAtiva) {
    return (
      <div className="h-full w-full flex flex-col items-center justify-center bg-gray-50 text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <p className="text-lg font-medium">Selecione uma conversa para começar</p>
      </div>
    );
  }

  const mensagensAtuais = mensagens[conversaAtiva.id] || [];

  return (
    <div className="h-full flex flex-col bg-gray-50 w-full rounded-lg overflow-hidden">
      {/* Cabeçalho do Chat */}
      <div className="px-4 py-2.5 bg-white border-b border-gray-100 flex items-center justify-between rounded-t-lg shadow-sm">
        <div className="flex items-center gap-3">
          <button 
            onClick={onVoltar}
            className="md:hidden p-2 -ml-2 hover:bg-gray-50 rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <img 
                src={conversaAtiva.foto}
                alt={conversaAtiva.nome}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-50 group-hover:ring-emerald-100 transition-all"
              />
              {conversaAtiva.online && (
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
              )}
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">{conversaAtiva.nome}</h2>
              <p className="text-sm text-emerald-600 font-medium">
                {conversaAtiva.status === 'typing' ? 'digitando...' : 'online'}
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          {/* Área de Busca */}
          <div className="relative flex items-center">
            <div 
              className={`flex items-center bg-gray-50 rounded-full overflow-hidden transition-all duration-300 ease-in-out ${
                searchState.isSearching 
                  ? 'w-[400px] border border-emerald-200 shadow-sm' 
                  : 'w-10'
              }`}
            >
              <button 
                onClick={() => setSearchState(prev => ({
                  ...prev,
                  isSearching: !prev.isSearching,
                  searchTerm: '',
                  searchResults: [],
                  currentResult: -1
                }))} 
                className={`p-2 rounded-full transition-all duration-200 ${
                  searchState.isSearching 
                    ? 'bg-transparent hover:bg-gray-100' 
                    : 'hover:bg-gray-100'
                }`}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className={`h-5 w-5 transition-colors duration-200 ${
                    searchState.isSearching ? 'text-emerald-600' : 'text-gray-600'
                  }`} 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>

              {searchState.isSearching && (
                <>
                  <input
                    type="text"
                    value={searchState.searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    placeholder="Pesquisar na conversa..."
                    className="w-full py-2 pr-2 bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none"
                  />

                  {/* Resultados e Navegação */}
                  <div className="flex items-center gap-2 pr-2 border-l border-gray-200 ml-2 pl-2">
                    {searchState.searchResults.length > 0 ? (
                      <>
                        <span className="text-sm text-gray-500 whitespace-nowrap">
                          {searchState.currentResult + 1} de {searchState.searchResults.length}
                        </span>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setSearchState(prev => ({
                                ...prev,
                                currentResult: prev.currentResult > 0 ? prev.currentResult - 1 : prev.searchResults.length - 1
                              }))
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                          </button>
                          <button
                            onClick={() => {
                              setSearchState(prev => ({
                                ...prev,
                                currentResult: prev.currentResult < prev.searchResults.length - 1 ? prev.currentResult + 1 : 0
                              }))
                            }}
                            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
                        </div>
                      </>
                    ) : searchState.searchTerm && (
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        Nenhuma mensagem encontrada
                      </span>
                    )}
                  </div>

                  {searchState.searchTerm && (
                    <button
                      onClick={() => setSearchState({
                        isSearching: true,
                        searchTerm: '',
                        searchResults: [],
                        currentResult: -1
                      })}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Menu de Opções */}
          <div className="relative">
            <button 
              onClick={() => setShowOptions(!showOptions)} 
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>

            {showOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 z-50 animate-fade-in-down">
                <button 
                  onClick={handleBlockContact}
                  className="w-full px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                  Bloquear contato
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="relative flex-1 overflow-y-auto p-4">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
            backgroundSize: "400px"
          }}
        />
        <div className="relative z-10 space-y-6">
          {mensagensAtuais.map((mensagem) => (
            <div
              key={mensagem.id}
              className={`mb-4 ${
                searchState.isSearching && searchState.searchResults.includes(mensagem.id) 
                  ? 'bg-yellow-50 -mx-4 px-4 py-2 rounded-lg transition-colors' 
                  : ''
              } ${
                searchState.isSearching && 
                searchState.searchResults[searchState.currentResult] === mensagem.id
                  ? 'ring-2 ring-yellow-400'
                  : ''
              }`}
            >
              <ChatBubble
                mensagem={mensagem}
                onDelete={(id) => handleDeleteMessage(id)}
                onEdit={(id, novoTexto) => handleEditMessage(id, novoTexto)}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Área de Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
} 