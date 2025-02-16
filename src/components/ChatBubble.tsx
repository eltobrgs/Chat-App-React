import { useState, useRef, useEffect } from 'react';
import Swal from 'sweetalert2';

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
  onDelete?: (id: number) => void;
  onEdit?: (id: number, novoTexto: string) => void;
}

export default function ChatBubble({ mensagem, onDelete, onEdit }: ChatBubbleProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(mensagem.texto || '');
  const [showActions, setShowActions] = useState(false);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
    }
  }, [isEditing]);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedText(mensagem.texto || '');
    setShowActions(false);
  };

  const handleSaveEdit = () => {
    if (editedText.trim() && onEdit) {
      onEdit(mensagem.id, editedText.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditedText(mensagem.texto || '');
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: 'Tem certeza?',
      text: 'Esta ação não pode ser desfeita',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sim, deletar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      background: '#ffffff',
      customClass: {
        popup: 'rounded-lg',
        title: 'text-gray-800 font-semibold',
        htmlContainer: 'text-gray-600'
      }
    });

    if (result.isConfirmed && onDelete) {
      onDelete(mensagem.id);
    }
  };

  const handleCopy = async () => {
    if (mensagem.texto) {
      await navigator.clipboard.writeText(mensagem.texto);
      setShowActions(false);
      
      // Feedback visual
      const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true
      });

      await Toast.fire({
        icon: 'success',
        title: 'Mensagem copiada!'
      });
    }
  };

  const handleMessageClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Evita propagação do clique
    setShowActions(!showActions);
  };

  // Fecha o menu de ações quando clicar fora
  useEffect(() => {
    const handleClickOutside = () => {
      setShowActions(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

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
    <div className="relative">
      {/* Ícones de ação */}
      {mensagem.enviada && showActions && !isEditing && (
        <div 
          className="absolute -top-12 right-0 flex items-center gap-1 bg-white rounded-lg shadow-md p-1 animate-fade-in-down"
          onClick={e => e.stopPropagation()}
        >
          <button 
            onClick={handleCopy}
            className="p-2 rounded-full text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:scale-110 transition-all duration-200"
            title="Copiar mensagem"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H9a2 2 0 01-2-2V9z" />
              <path d="M5 3a2 2 0 00-2 2v6a2 2 0 002 2V5h8a2 2 0 00-2-2H5z" />
            </svg>
          </button>
          <button 
            onClick={handleEdit}
            className="p-2 rounded-full text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 hover:scale-110 transition-all duration-200"
            title="Editar mensagem"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
          </button>
          <button 
            onClick={handleDelete}
            className="p-2 rounded-full text-red-600 hover:bg-red-50 hover:text-red-700 hover:scale-110 transition-all duration-200"
            title="Deletar mensagem"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      {/* Conteúdo da mensagem */}
      <div 
        className="p-3 cursor-pointer"
        onClick={handleMessageClick}
      >
        {isEditing ? (
          <input
            ref={editInputRef}
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
            onKeyDown={handleKeyPress}
            onBlur={handleSaveEdit}
            className="w-full bg-transparent text-gray-700 text-[15px] leading-relaxed focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded px-2 py-1"
          />
        ) : (
          <p className="text-gray-700 text-[15px] leading-relaxed">{mensagem.texto}</p>
        )}
        <div className="flex items-center justify-end gap-1.5 mt-1.5">
          <span className="text-[11px] text-gray-500 font-medium">{mensagem.horario}</span>
          {renderStatus()}
        </div>
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
    <div className={`flex ${mensagem.enviada ? 'justify-end' : 'justify-start'} group/message`}>
      <div
        className={`max-w-[85%] md:max-w-[65%] rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 ${
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