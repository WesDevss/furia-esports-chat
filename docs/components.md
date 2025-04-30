# Componentes do Frontend

Esta seção documenta os principais componentes da interface do usuário do FURIA Chat.

## Componentes Core

### `<Header />`
Componente de cabeçalho principal da aplicação, exibindo o logo, navegação e controles de usuário.

**Props:**
- Nenhuma

**Exemplo de uso:**
```jsx
<Header />
```

### `<Navbar />`
Barra de navegação lateral com links para as diferentes seções da aplicação.

**Props:**
- Nenhuma

**Exemplo de uso:**
```jsx
<Navbar />
```

### `<Footer />`
Rodapé da aplicação com links para redes sociais, informações de copyright e links úteis.

**Props:**
- Nenhuma

**Exemplo de uso:**
```jsx
<Footer />
```

### `<FuriBot />`
Interface de chat com o assistente virtual do FURIA Chat.

**Props:**
- `isOpen`: boolean - Controla se a interface do FuriBot está aberta
- `onClose`: () => void - Função chamada quando o usuário fecha a interface
- `onSendMessage`: (message: string) => void - Função chamada quando uma mensagem é enviada

**Exemplo de uso:**
```jsx
<FuriBot 
  isOpen={isBotOpen} 
  onClose={() => setIsBotOpen(false)} 
  onSendMessage={handleSendMessage} 
/>
```

## Componentes de UI

### `<ChatBox />`
Componente de caixa de chat com funcionalidade de envio de mensagens.

**Props:**
- `messages`: Message[] - Lista de mensagens a serem exibidas
- `onSendMessage`: (message: string) => void - Função chamada quando uma mensagem é enviada
- `isTyping?`: boolean - Indica se alguém está digitando
- `placeholderText?`: string - Texto de placeholder para o input
- `className?`: string - Classes CSS adicionais

**Exemplo de uso:**
```jsx
<ChatBox 
  messages={chatMessages} 
  onSendMessage={handleSendMessage}
  isTyping={isUserTyping}
  placeholderText="Digite sua mensagem..."
/>
```

### `<CardMatch />`
Card para exibir informações sobre uma partida.

**Props:**
- `match`: Match - Dados da partida
- `className?`: string - Classes CSS adicionais

**Exemplo de uso:**
```jsx
<CardMatch match={currentMatch} />
```

### `<CardNews />`
Card para exibir notícias relacionadas à FURIA.

**Props:**
- `news`: News - Dados da notícia
- `className?`: string - Classes CSS adicionais

**Exemplo de uso:**
```jsx
<CardNews news={latestNews} />
```

### `<CardPlayer />`
Card para exibir informações sobre um jogador da FURIA.

**Props:**
- `player`: Player - Dados do jogador
- `className?`: string - Classes CSS adicionais

**Exemplo de uso:**
```jsx
<CardPlayer player={playerData} />
```

### `<CardQuiz />`
Card para exibir um quiz interativo para os usuários.

**Props:**
- `quiz`: Quiz - Dados do quiz
- `onSubmit`: (answers: string[]) => void - Função chamada quando o quiz é respondido
- `className?`: string - Classes CSS adicionais

**Exemplo de uso:**
```jsx
<CardQuiz quiz={dailyQuiz} onSubmit={handleQuizSubmit} />
```

### `<CardResult />`
Card para exibir o resultado de uma partida.

**Props:**
- `result`: MatchResult - Dados do resultado
- `className?`: string - Classes CSS adicionais

**Exemplo de uso:**
```jsx
<CardResult result={matchResult} />
```

### `<Button />`
Botão estilizado da aplicação.

**Props:**
- `variant?`: 'primary' | 'secondary' | 'outline' | 'ghost' - Variante visual do botão
- `size?`: 'sm' | 'md' | 'lg' - Tamanho do botão
- `onClick?`: () => void - Função chamada quando o botão é clicado
- `disabled?`: boolean - Define se o botão está desabilitado
- `className?`: string - Classes CSS adicionais
- `children`: React.ReactNode - Conteúdo do botão

**Exemplo de uso:**
```jsx
<Button variant="primary" size="md" onClick={handleClick}>
  Entrar no Chat
</Button>
```

### `<Card />`
Card base da aplicação.

**Props:**
- `title?`: string - Título do card
- `className?`: string - Classes CSS adicionais
- `children`: React.ReactNode - Conteúdo do card

**Exemplo de uso:**
```jsx
<Card title="Estatísticas">
  <p>Conteúdo do card...</p>
</Card>
```

## Páginas

### `<Home />`
Página inicial da aplicação, exibindo uma visão geral das funcionalidades.

### `<ChatPage />`
Página principal de chat, onde os usuários podem conversar em tempo real.

### `<LiveMatchPage />`
Página para acompanhamento de partidas ao vivo, com chat e estatísticas em tempo real.

### `<NewsPage />`
Página de notícias sobre a FURIA e o cenário competitivo.

### `<ProfilePage />`
Página de perfil do usuário, exibindo estatísticas, conquistas e histórico.

### `<LeaderboardPage />`
Página de ranking dos usuários mais ativos na plataforma.

### `<AchievementsPage />`
Página de conquistas disponíveis e conquistadas pelo usuário.

### `<StatsPage />`
Página de estatísticas detalhadas sobre o time e jogadores.

## Tipos de Dados

### Message
```typescript
interface Message {
  id: string;
  user: {
    _id: string;
    username: string;
    level?: number;
    badges?: string[];
  };
  content: string;
  type: 'text' | 'match-update' | 'poll' | 'mission-complete';
  timestamp: Date;
  pollOptions?: string[];
  pollVotes?: Record<string, number>;
  reactions?: Record<string, string[]>;
}
```

### Match
```typescript
interface Match {
  _id: string;
  opponent: string;
  tournament: string;
  status: 'live' | 'scheduled' | 'completed';
  maps?: {
    name: string;
    furiaScore: number;
    opponentScore: number;
  }[];
  highlights?: {
    description: string;
    type: string;
    player: string;
    timestamp: Date;
  }[];
  startTime?: Date;
}
```

### Player
```typescript
interface Player {
  _id: string;
  name: string;
  nickname: string;
  role: string;
  photo: string;
  stats: {
    rating: number;
    kd: number;
    headshotPercentage: number;
    mapsPlayed: number;
  };
}
``` 