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

interface ChatBubbleProps {
  mensagem: Mensagem;
}

export default function ChatBubble({ mensagem }: ChatBubbleProps) {
  const renderStatus = () => {
    if (!mensagem.enviada || !mensagem.status) return null;

    return (
      <span className="text-emerald-600">
        {mensagem.status === 'lido' ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </span>
    );
  };

  const renderTexto = () => (
    <div className="p-3">
      <p className="text-gray-700 text-[15px] leading-relaxed">{mensagem.texto}</p>
      <div className="flex items-center justify-end gap-1.5 mt-1.5">
        <span className="text-[11px] text-gray-500 font-medium">{mensagem.horario}</span>
        {renderStatus()}
      </div>
    </div>
  );

  const renderAudio = () => (
    <div className="p-3 flex items-center gap-3">
      <button className="p-2 bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors shadow-sm">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
      </button>
      <div className="flex-1">
        <div className="h-1 bg-gray-200 rounded-full">
          <div className="h-1 bg-emerald-600 rounded-full w-1/3"></div>
        </div>
      </div>
      <div className="flex items-center gap-2 text-[11px] font-medium">
        <span className="text-gray-500">{mensagem.duracao}</span>
        <span className="text-gray-500">{mensagem.horario}</span>
      </div>
    </div>
  );

  const renderImagem = () => (
    <div>
      <div className="relative group">
        <img 
          src={mensagem.imagem} 
          alt="Imagem enviada" 
          className="rounded-lg transition-transform hover:scale-[0.99]"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
      </div>
      <div className="p-2 flex items-center justify-end gap-1.5">
        <span className="text-[11px] text-gray-500 font-medium">{mensagem.horario}</span>
        {renderStatus()}
      </div>
    </div>
  );

  return (
    <div className={`flex ${mensagem.enviada ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] md:max-w-[65%] rounded-2xl shadow-sm ${
          mensagem.enviada
            ? 'bg-emerald-50 rounded-tr-md'
            : 'bg-white rounded-tl-md'
        }`}
      >
        {mensagem.tipo === 'texto' && renderTexto()}
        {mensagem.tipo === 'audio' && renderAudio()}
        {mensagem.tipo === 'imagem' && renderImagem()}
      </div>
    </div>
  );
} 