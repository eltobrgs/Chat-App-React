import ListaConversas from '../components/ListaConversas';
import ChatContent from '../components/ChatContent';
import { useState } from 'react';
import { Conversa } from '../components/ListaConversas';

export default function Chat() {
  const [conversaAtiva, setConversaAtiva] = useState<Conversa | undefined>();
  const [mostrarLista, setMostrarLista] = useState(true);

  const handleConversaSelect = (conversa: Conversa) => {
    setConversaAtiva(conversa);
    setMostrarLista(false);
  };

  const handleVoltar = () => {
    setMostrarLista(true);
  };

  return (
    <div className="h-screen flex bg-[#f0f2f5]">
      {/* Coluna da esquerda - Lista de Conversas */}
      <div className={`${
        !mostrarLista ? 'hidden md:block' : 'w-full'
      } md:w-[400px] bg-white border-r border-gray-200`}>
        <ListaConversas onConversaSelect={handleConversaSelect} />
      </div>

      {/* Coluna da direita - Conteúdo do Chat */}
      <div className={`${
        !mostrarLista ? 'w-full' : 'hidden md:flex'
      } flex-1 bg-[#efeae2] border-l border-gray-200`}>
        <ChatContent 
          onVoltar={handleVoltar} 
          conversaAtiva={conversaAtiva}
        />
      </div>
    </div>
  );
} 