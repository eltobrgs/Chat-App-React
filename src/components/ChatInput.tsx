import { useState, useRef, useEffect } from 'react';
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';

interface ChatInputProps {
  onSendMessage?: (message: string) => void;
}

interface AttachmentOption {
  id: string;
  label: string;
  icon: JSX.Element;
  color: string;
}

const attachmentOptions: AttachmentOption[] = [
  {
    id: 'image',
    label: 'Enviar Imagem',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-pink-500 bg-pink-50 hover:bg-pink-100'
  },
  {
    id: 'video',
    label: 'Enviar Vídeo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-purple-500 bg-purple-50 hover:bg-purple-100'
  },
  {
    id: 'document',
    label: 'Enviar Documento',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
        <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: 'text-blue-500 bg-blue-50 hover:bg-blue-100'
  }
];

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  const [showAttachments, setShowAttachments] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [inputMessage, setInputMessage] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowAttachments(false);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target as Node)) {
        setShowEmojiPicker(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAttachmentClick = (option: AttachmentOption) => {
    console.log(`Selecionado: ${option.label}`);
    setShowAttachments(false);
    // Implementação futura do upload
  };

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const emoji = emojiData.emoji;
    const cursorPosition = inputRef.current?.selectionStart || 0;
    const updatedMessage = 
      inputMessage.slice(0, cursorPosition) + 
      emoji + 
      inputMessage.slice(cursorPosition);
    
    setInputMessage(updatedMessage);
    setShowEmojiPicker(false);

    // Foca o input e move o cursor para depois do emoji
    if (inputRef.current) {
      const newCursorPosition = cursorPosition + emoji.length;
      inputRef.current.focus();
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.selectionStart = newCursorPosition;
          inputRef.current.selectionEnd = newCursorPosition;
        }
      }, 0);
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && onSendMessage) {
      onSendMessage(inputMessage.trim());
      setInputMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-3 bg-white border-t border-gray-100 rounded-b-lg shadow-sm">
      <div className="flex items-center gap-2">
        {/* Botões da esquerda */}
        <div className="flex gap-1">
          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setShowAttachments(!showAttachments)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors duration-200 relative cursor-pointer"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5 text-gray-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" 
                />
              </svg>
            </button>

            {/* Dropdown de Anexos */}
            {showAttachments && (
              <div className="absolute bottom-full left-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden transform origin-bottom-left transition-all duration-200 animate-fade-in-up">
                {attachmentOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleAttachmentClick(option)}
                    className={`w-full px-4 py-2.5 flex items-center gap-3 ${option.color} transition-colors duration-200 cursor-pointer`}
                  >
                    {option.icon}
                    <span className="text-sm font-medium text-gray-700">{option.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Emoji Picker */}
          <div className="relative" ref={emojiPickerRef}>
            <button 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors duration-200 cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </button>

            {showEmojiPicker && (
              <div className="absolute bottom-full left-0 mb-2 transform origin-bottom-left transition-all duration-200 animate-fade-in-up z-50">
                <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
                  <EmojiPicker
                    onEmojiClick={onEmojiClick}
                    autoFocusSearch={false}
                    width={320}
                    height={400}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Campo de input */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Digite uma mensagem"
            className="w-full px-4 py-2.5 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Botões da direita */}
        <div className="flex gap-1">
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors duration-200 cursor-pointer">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button 
            onClick={handleSendMessage}
            className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors duration-200 shadow-sm cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 