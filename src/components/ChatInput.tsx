interface ChatInputProps {
  onSendMessage?: (message: string) => void;
}

export default function ChatInput({ onSendMessage }: ChatInputProps) {
  return (
    <div className="p-3 bg-white border-t border-gray-100 rounded-b-lg shadow-sm">
      <div className="flex items-center gap-2">
        {/* Botões da esquerda */}
        <div className="flex gap-1">
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
            </svg>
          </button>
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>

        {/* Campo de input */}
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Digite uma mensagem"
            className="w-full px-4 py-2.5 bg-gray-50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm text-gray-700 placeholder-gray-400"
          />
        </div>

        {/* Botões da direita */}
        <div className="flex gap-1">
          <button className="p-2 hover:bg-gray-50 rounded-full transition-colors duration-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
            </svg>
          </button>
          <button className="p-2 bg-emerald-600 hover:bg-emerald-700 rounded-full transition-colors duration-200 shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
} 