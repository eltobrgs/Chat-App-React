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

interface ConversaItemProps {
  conversa: Conversa;
  isFirst: boolean;
  isLast: boolean;
  onClick: () => void;
}

export default function ConversaItem({ conversa, isFirst, isLast, onClick }: ConversaItemProps) {
  return (
    <div 
      className={`flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 ${
        isFirst ? 'rounded-t-lg' : ''
      } ${isLast ? 'rounded-b-lg' : ''}`}
      onClick={onClick}
    >
      <div className="relative">
        <img 
          src={conversa.foto} 
          alt={conversa.nome} 
          className="w-12 h-12 rounded-full border border-gray-200"
        />
        {conversa.online && (
          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="text-sm font-semibold text-gray-800 truncate">{conversa.nome}</h3>
          <span className="text-xs text-gray-500">{conversa.horario}</span>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500 truncate">
            {conversa.status === 'typing' ? (
              <span className="text-green-500">Digitando...</span>
            ) : conversa.ultimaMensagem}
          </p>
          {conversa.naoLidas && (
            <span className="bg-green-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {conversa.naoLidas}
            </span>
          )}
        </div>
      </div>
    </div>
  );
} 