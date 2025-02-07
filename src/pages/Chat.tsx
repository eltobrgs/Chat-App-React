import ListaConversas from '../components/ListaConversas';
import ChatContent from '../components/ChatContent';
import { useState } from 'react';

export default function Chat() {
  const [conversaAtiva, setConversaAtiva] = useState(false);

  return (
    <div className="h-screen flex bg-[#f0f2f5]">
      {/* Coluna da esquerda - Lista de Conversas */}
      <div className={`${
        conversaAtiva ? 'hidden md:block' : 'w-full'
      } md:w-[400px] bg-white border-r border-gray-200`}>
        <ListaConversas onConversaSelect={() => setConversaAtiva(true)} />
      </div>

      {/* Coluna da direita - Conteúdo do Chat */}
      <div className={`${
        conversaAtiva ? 'w-full' : 'hidden md:flex'
      } flex-1 bg-[#efeae2] border-l border-gray-200`}>
        <ChatContent onVoltar={() => setConversaAtiva(false)} />
      </div>
    </div>
  );
} 