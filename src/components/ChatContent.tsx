import ChatInput from './ChatInput';
import ChatBubble from './ChatBubble';

interface ChatContentProps {
  onVoltar: () => void;
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

const mensagens: Mensagem[] = [
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
    texto: "Oi! Estou bem, e você?",
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
  },
  {
    id: 4,
    tipo: 'imagem',
    horario: "09:33",
    enviada: true,
    imagem: "https://source.unsplash.com/random/400x300",
    status: 'entregue'
  },
  {
    id: 5,
    texto: "Também estou bem! Viu aquele projeto novo?",
    horario: "09:34",
    enviada: false,
    tipo: 'texto'
  },
  {
    id: 6,
    texto: "Sim! Está muito interessante. Podemos marcar uma reunião para discutir?",
    horario: "09:35",
    enviada: true,
    tipo: 'texto',
    status: 'enviado'
  }
];

export default function ChatContent({ onVoltar }: ChatContentProps) {
  const handleSendMessage = (message: string) => {
    // Implementação futura
    console.log('Mensagem enviada:', message);
  };

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
                src="https://i.pravatar.cc/150?img=1" 
                alt="Contato" 
                className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-50 group-hover:ring-emerald-100 transition-all"
              />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h2 className="font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors">Alice Silva</h2>
              <p className="text-sm text-emerald-600 font-medium">online</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Área de Mensagens */}
      <div className="relative flex-1 overflow-y-auto p-4 space-y-3">
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')",
            backgroundSize: "400px"
          }}
        />
        <div className="relative z-10">
          {mensagens.map((mensagem) => (
            <ChatBubble key={mensagem.id} mensagem={mensagem} />
          ))}
        </div>
      </div>

      {/* Área de Input */}
      <ChatInput onSendMessage={handleSendMessage} />
    </div>
  );
} 