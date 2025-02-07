# Chat App

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

Um aplicativo de chat moderno e elegante, desenvolvido com as mais recentes tecnologias web. Inspirado nas melhores características de aplicativos de mensagens populares, mas com um design único e minimalista.

## 🚀 Tecnologias

- **React** - Biblioteca JavaScript para construção de interfaces
- **TypeScript** - Adiciona tipagem estática ao JavaScript
- **Tailwind CSS** - Framework CSS utilitário para design rápido e responsivo
- **Vite** - Build tool e bundler moderno para desenvolvimento web

## ✨ Características

### Design Moderno
- Interface limpa e minimalista
- Paleta de cores sóbria e profissional
- Animações suaves e micro-interações
- Design totalmente responsivo (Mobile e Desktop)
- Tema consistente com tons de verde esmeralda

### Funcionalidades do Chat
- Lista de conversas com status online
- Indicador de digitação
- Suporte para diferentes tipos de mensagens:
  - Texto
  - Áudio
  - Imagens
- Status de mensagem (enviado, entregue, lido)
- Contador de mensagens não lidas
- Timestamps das mensagens

### Componentes Principais
- `ChatContent` - Área principal do chat com mensagens
- `ChatBubble` - Bolhas de mensagem com diferentes estilos
- `ChatInput` - Campo de entrada com suporte para anexos
- `ListaConversas` - Lista de conversas com preview
- `ConversaItem` - Item individual de conversa
- `FloatingButton` - Botão flutuante para nova conversa

### Interface do Usuário
- Cabeçalho com perfil do usuário
- Barra de pesquisa para conversas
- Indicadores de status online
- Avatares de usuário
- Botões de ação contextuais

## 🛠️ Estrutura do Projeto

```
src/
├── components/
│   ├── ChatBubble.tsx
│   ├── ChatContent.tsx
│   ├── ChatInput.tsx
│   ├── ConversaItem.tsx
│   ├── FloatingButton.tsx
│   └── ListaConversas.tsx
├── pages/
│   ├── Chat.tsx
│   └── Login.tsx
└── App.tsx
```

## 🔥 Features em Destaque

1. **Mensagens Inteligentes**
   - Diferentes layouts para mensagens enviadas e recebidas
   - Suporte para múltiplos tipos de mídia
   - Status de leitura com ícones intuitivos

2. **UI/UX Aprimorada**
   - Transições suaves entre estados
   - Feedback visual para interações
   - Layout adaptativo para diferentes tamanhos de tela

3. **Componentes Reutilizáveis**
   - Arquitetura modular
   - Componentes altamente customizáveis
   - Props tipadas com TypeScript

4. **Performance**
   - Otimizado para carregamento rápido
   - Code splitting automático com Vite
   - Estilização eficiente com Tailwind CSS

## 🚧 Em Desenvolvimento

- [ ] Implementação do backend
- [ ] Sistema de autenticação
- [ ] Armazenamento de mensagens
- [ ] Notificações em tempo real
- [ ] Chamadas de áudio/vídeo
- [ ] Compartilhamento de arquivos
- [ ] Temas personalizáveis

## 📱 Responsividade

O aplicativo é totalmente responsivo e se adapta a diferentes tamanhos de tela:

- **Desktop**: Layout completo com lista de conversas e chat
- **Tablet**: Layout adaptativo com transições suaves
- **Mobile**: Interface otimizada para telas pequenas

## 🔒 Segurança 
-->>em desenvolvimento{
- Preparado para implementação de criptografia
- Proteção contra XSS
- Validação de entrada de dados
- Autenticação segura (em desenvolvimento)}



