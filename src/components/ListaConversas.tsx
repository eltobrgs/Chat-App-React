import FloatingButton from './FloatingButton';
import ConversaItem from './ConversaItem';
import InfoUsuario from './InfoUsuario';

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

  return (
    <div className="h-full flex flex-col bg-white border-r border-gray-200 rounded-lg overflow-hidden relative">
      {/* Cabeçalho */}
      <InfoUsuario />

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