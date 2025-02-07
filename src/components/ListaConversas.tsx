import FloatingButton from './FloatingButton';
import ConversaItem from './ConversaItem';

interface ListaConversasProps {
  onConversaSelect: () => void;
}

interface Conversa {
  id: number;
  nome: string;
  ultimaMensagem: string;
  horario: string;
  foto: string;
  online?: boolean;
  naoLidas?: number;
  status?: 'typing' | 'online' | 'offline';
}

const conversas: Conversa[] = [
  {
    id: 1,
    nome: "Alice Silva",
    ultimaMensagem: "Olá! Como você está?",
    horario: "09:30",
    foto: "https://i.pravatar.cc/150?img=1",
    online: true,
    status: 'typing'
  },
  {
    id: 2,
    nome: "João Santos",
    ultimaMensagem: "Vamos marcar aquela reunião?",
    horario: "09:15",
    foto: "https://i.pravatar.cc/150?img=2",
    naoLidas: 3
  },
  {
    id: 3,
    nome: "Maria Oliveira",
    ultimaMensagem: "O projeto está quase pronto!",
    horario: "08:45",
    foto: "https://i.pravatar.cc/150?img=3",
    online: true,
    status: 'online'
  },
  {
    id: 4,
    nome: "Pedro Costa",
    ultimaMensagem: "Obrigado pela ajuda!",
    horario: "Ontem",
    foto: "https://i.pravatar.cc/150?img=4"
  },
  {
    id: 5,
    nome: "Ana Beatriz",
    ultimaMensagem: "Enviou um áudio",
    horario: "Seg",
    foto: "https://i.pravatar.cc/150?img=5",
    online: true
  },
  {
    id: 6,
    nome: "Carlos Eduardo",
    ultimaMensagem: "Enviou uma foto",
    horario: "Dom",
    foto: "https://i.pravatar.cc/150?img=6"
  }
];

export default function ListaConversas({ onConversaSelect }: ListaConversasProps) {
  const handleNewChat = () => {
    // Implementação futura
    console.log('Novo chat');
  };

  const handleProfileClick = () => {
    // Implementação futura
    console.log('Ir para perfil');
  };

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 rounded-lg overflow-hidden relative">
      {/* Cabeçalho */}
      <div className="p-2.5 bg-[#075E54] flex items-center justify-between rounded-t-lg">
        <div className="flex items-center gap-3 flex-1">
          <img 
            src="https://i.pravatar.cc/150?img=12" 
            alt="Perfil" 
            className="w-10 h-10 rounded-full border border-gray-200"
          />
          <div className="flex-1">
            <h2 className="text-white font-semibold">Elton Borges</h2>
            <p className="text-emerald-100 text-sm">Online</p>
          </div>
          <button 
            onClick={handleProfileClick}
            className="p-2 hover:bg-[#054c44] rounded-full transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>

      {/* Barra de Pesquisa */}
      <div className="px-4 py-2 bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="relative">
          <input
            type="text"
            placeholder="Pesquisar ou começar uma nova conversa"
            className="w-full px-4 py-2.5 bg-gray-50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Lista de Conversas */}
      <div className="flex-1 overflow-y-auto">
        {conversas.map((conversa, index) => (
          <ConversaItem
            key={conversa.id}
            conversa={conversa}
            isFirst={index === 0}
            isLast={index === conversas.length - 1}
            onClick={onConversaSelect}
          />
        ))}
      </div>

      {/* Botão Flutuante */}
      <FloatingButton onClick={handleNewChat} />
    </div>
  );
} 