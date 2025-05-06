import React, { useState, useEffect, useRef } from 'react';
import { Send, Smile, Flag, Heart, ThumbsUp, X, AlertTriangle, Pin } from 'lucide-react';

interface ChatMessage {
  id: string;
  username: string;
  content: string;
  timestamp: Date;
  badges?: string[];
  isSystem?: boolean;
  isHighlighted?: boolean;
  isPinned?: boolean;
  reactions?: Record<string, string[]>;
}

interface MatchChatProps {
  matchId?: string;
  height?: string;
}

interface TypingUser {
  username: string;
  startTime: number;
}

const emojiOptions = [
  { emoji: '❤️', name: 'heart' },
  { emoji: '👍', name: 'thumbs-up' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '👏', name: 'clap' },
  { emoji: '😮', name: 'wow' },
  { emoji: '🎯', name: 'bullseye' },
  { emoji: '💪', name: 'muscle' },
  { emoji: '🇧🇷', name: 'brazil' },
];

// Brazilian usernames for FURIA fans
const brazilianUsernames = [
  'BrasilFan2023', 'FuriaArmada', 'GarotoDoHeadshot', 'CSGOBrasileiro', 
  'MatadorDeGringo', 'FallenDiscipulo', 'KSCERATO_FAN', 'YEKINDARmaster', 
  'YuurihStyle', 'MolotovKing', 'AwpDoMorro', 'GauchoGamer', 
  'TorcedorFuria', 'BRzinho', 'FlamengoEFuria', 'OneShot_BR',
  'CariocaGamer', 'AceNaMesa', 'BrDeAco', 'FuriaAteOMorrer'
];

// Message templates for more realistic chat
const messageTemplates = [
  // General
  'VAMOS FURIA!!! 🇧🇷🇧🇷🇧🇷',
  'Esse time é demais!',
  'JOGOU MUITO!',
  'Não tem como contra o Brasil!',
  'GG BOYZ! 👊',
  'Olha o nivel desse jogo!!',
  'MANOOOOOO',
  'inacreditável',
  
  // Player-specific
  '{player} jogando demais hoje!',
  'Essa AWP do {player} tá afiada!',
  'Clutch insano do {player}!',
  '{player} carregando o time 👑',
  '{player} fazendo história!',
  'Q jogada do {player} mano',
  '{player} mvp com certeza',
  
  // Reactions
  'AEEEEEEE',
  'VAI PRA CIMA DELES',
  'GG',
  'F no chat pro {opponent}',
  'kkkkkkkk olha isso',
  'CARAMBA QUE JOGADA',
  'INACREDITÁVEL!!!'
];

const MatchChat: React.FC<MatchChatProps> = ({ matchId, height = '400px' }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [currentUser] = useState({
    username: 'FuriaFan123',
    badges: ['Novo Torcedor']
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState<string | null>(null);
  const [typingUsers, setTypingUsers] = useState<TypingUser[]>([]);
  const [userCount, setUserCount] = useState(Math.floor(Math.random() * 2000 + 2500));
  const chatEndRef = useRef<HTMLDivElement>(null);
  const messageIntervalRef = useRef<number | null>(null);
  const typingTimeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const playerNames = ['yuurih', 'KSCERATO', 'FalleN', 'molodoy', 'YEKINDAR'];
  const opponentNames = ['s1mple', 'electronic', 'b1t', 'Perfecto', 'Boombl4'];

  // Function to generate a random message from templates
  const generateRandomMessage = (): string => {
    const template = messageTemplates[Math.floor(Math.random() * messageTemplates.length)];
    if (template.includes('{player}')) {
      const player = playerNames[Math.floor(Math.random() * playerNames.length)];
      return template.replace('{player}', player);
    }
    if (template.includes('{opponent}')) {
      const opponent = opponentNames[Math.floor(Math.random() * opponentNames.length)];
      return template.replace('{opponent}', opponent);
    }
    return template;
  };

  // In a real app, fetch messages from API
  const loadInitialMessages = () => {
    const now = new Date().getTime();
    
    // Sample initial messages
    const initialMessages: ChatMessage[] = [
      {
        id: '1',
        username: 'Sistema',
        content: 'Bem-vindo ao chat da FURIA! Interaja com outros torcedores durante as partidas. Respeite as regras da comunidade!',
        timestamp: new Date(now - 240000),
        badges: ['Oficial'],
        isSystem: true,
        isPinned: true
      },
      {
        id: '2',
        username: 'CSGOMaster',
        content: 'Grande jogada do YEKINDAR!',
        timestamp: new Date(now - 180000),
        badges: ['Veterano'],
        reactions: { 'thumbs-up': ['User1', 'User2'], 'fire': ['User3'] }
      },
      {
        id: '3',
        username: 'FuriaFanatic',
        content: 'KSCERATO está jogando muito hoje! 🔥',
        timestamp: new Date(now - 120000),
        badges: ['Membro Premium'],
        reactions: { 'fire': ['User1', 'User2', 'User3', 'User4'] }
      },
      {
        id: '4',
        username: 'NaviHater2023',
        content: 'A defesa da FURIA está muito sólida neste mapa',
        timestamp: new Date(now - 90000)
      },
      {
        id: '5',
        username: 'BRzao',
        content: 'Alguém viu aquele clutch do FalleN? MONSTRO! 👏',
        timestamp: new Date(now - 60000),
        badges: ['Top Torcedor']
      },
      {
        id: '6',
        username: 'Sistema',
        content: 'FURIA acaba de ganhar o round 15! Placar: 9-6',
        timestamp: new Date(now - 50000),
        badges: ['Oficial'],
        isSystem: true,
        isHighlighted: true
      },
      {
        id: '7',
        username: 'EsportsFan',
        content: 'Alguém tem o link da stream?',
        timestamp: new Date(now - 40000)
      },
      {
        id: '8',
        username: 'GreenWall',
        content: 'Esse S1mple está dando trabalho, mas a FURIA está sabendo controlar bem',
        timestamp: new Date(now - 30000),
        badges: ['Membro desde 2020']
      },
      {
        id: '9',
        username: 'CyberPunk77',
        content: 'Yuurih!!!! Que jogada! 🤯',
        timestamp: new Date(now - 20000)
      },
      {
        id: '10',
        username: 'HEADSHOTonly',
        content: 'A rotação da FURIA no meio do mapa está fazendo toda a diferença',
        timestamp: new Date(now - 15000),
        badges: ['Pro Analyst']
      },
      {
        id: '11',
        username: 'CS2Lover',
        content: 'Esse molodoy tá muito bem se adaptando ao time!',
        timestamp: new Date(now - 10000)
      },
      {
        id: '12',
        username: 'FuriaFaithful',
        content: 'VAMOOOOOOO FURIA!!!',
        timestamp: new Date(now - 5000),
        badges: ['OG Fan']
      }
    ];

    setMessages(initialMessages);

    // Add 15 more random messages to make chat look more active
    const extraMessages: ChatMessage[] = [];
    for (let i = 0; i < 15; i++) {
      const randomUsername = [
        'FuriaFan23', 'CSLover', 'GabrielBR', 'AlexandreZ', 
        'LucasGamer', 'PedroCS', 'RafaelM', 'BrunoTorcer'
      ][Math.floor(Math.random() * 8)];
      
      const randomBadge = Math.random() > 0.7 ? ['Membro Premium', 'BR Pride', 'Top Torcedor'][Math.floor(Math.random() * 3)] : undefined;
      
      extraMessages.push({
        id: `extra-${i}`,
        username: randomUsername,
        content: generateRandomMessage(),
        timestamp: new Date(now - Math.floor(Math.random() * 300000)),
        badges: randomBadge ? [randomBadge] : undefined
      });
    }
    
    // Mix extra messages with initial ones
    const allMessages = [...initialMessages, ...extraMessages].sort((a, b) => 
      a.timestamp.getTime() - b.timestamp.getTime()
    );
    
    setMessages(allMessages);
  };

  // Periodic function to add new messages
  const startMessageInterval = () => {
    // 30% chance for a user to start typing
    if (Math.random() < 0.3) {
      const typingUser = {
        username: [
          'CSPlayer', 'FuriaSupporter', 'Gaming4Life', 'BR_Pride',
          'TwitchViewer', 'ESportsFan', 'HeadshotKing', 'AWP_Main'
        ][Math.floor(Math.random() * 8)],
        startTime: Date.now()
      };
      
      setTypingUsers(prev => {
        // Only add if not already typing
        if (!prev.some(u => u.username === typingUser.username)) {
          return [...prev, typingUser];
        }
        return prev;
      });
      
      // Remove typing indicator after 2-5 seconds
      const timeout = setTimeout(() => {
        setTypingUsers(prev => prev.filter(u => u.username !== typingUser.username));
        
        // 70% chance to actually send a message after typing
        if (Math.random() < 0.7) {
          const newMessage: ChatMessage = {
            id: Date.now().toString(),
            username: typingUser.username,
            content: generateRandomMessage(),
            timestamp: new Date(),
            badges: Math.random() > 0.7 ? [['Membro Premium', 'BR Pride', 'Top Torcedor'][Math.floor(Math.random() * 3)]] : undefined
          };
          
          setMessages(prev => [...prev, newMessage]);
        }
      }, 2000 + Math.random() * 3000);
      
      typingTimeoutsRef.current.push(timeout);
    }
    
    // Start the periodic message addition
    messageIntervalRef.current = window.setInterval(startMessageInterval, 3000);
  };

  // Modificado para remover a rolagem automática quando as mensagens mudam
  useEffect(() => {
    // Apenas inicializar com mensagens iniciais
    if (messages.length === 0) {
      loadInitialMessages();
      startMessageInterval();
    }
    
    // Limpar os intervalos na desmontagem
    return () => {
      if (messageIntervalRef.current) {
        clearInterval(messageIntervalRef.current);
      }
      typingTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    };
  }, []);

  // Simulate user count changes
  useEffect(() => {
    const userInterval = setInterval(() => {
      // Randomly increase or decrease user count to simulate users joining/leaving
      const change = Math.floor(Math.random() * 50) - 20; // -20 to +30 users
      setUserCount(prev => Math.max(1500, prev + change));
    }, 15000); // Every 15 seconds
    
    return () => clearInterval(userInterval);
  }, []);

  // Add typing indicator
  const addTypingIndicator = (username: string) => {
    setTypingUsers(prev => {
      // Don't add if this user is already typing
      if (prev.some(u => u.username === username)) return prev;
      return [...prev, { username, startTime: Date.now() }];
    });
    
    // Calculate a realistic typing time based on message length (1-5 seconds)
    const typingTime = Math.floor(Math.random() * 4000) + 1000;
    
    // Schedule message to appear after typing
    const timeout = setTimeout(() => {
      setTypingUsers(prev => prev.filter(u => u.username !== username));
      
      // Add the actual message
      addMessage({
        id: Date.now().toString(),
        username,
        content: generateRandomMessage(),
        timestamp: new Date(),
        badges: Math.random() > 0.7 ? [['Veterano', 'Fã Dedicado', 'BR Pride', 'Membro Premium'][Math.floor(Math.random() * 4)]] : [],
        reactions: {}
      });
    }, typingTime);
    
    typingTimeoutsRef.current.push(timeout);
  };

  const addMessage = (message: ChatMessage) => {
    setMessages(prev => [...prev, message]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    addMessage({
      id: Date.now().toString(),
      username: currentUser.username,
      content: inputValue,
      timestamp: new Date(),
      badges: currentUser.badges,
      reactions: {}
    });
    
    setInputValue('');
    
    // 40% chance someone will react to your message
    if (Math.random() < 0.4) {
      setTimeout(() => {
        const randomUser = brazilianUsernames[Math.floor(Math.random() * brazilianUsernames.length)];
        addTypingIndicator(randomUser);
      }, Math.random() * 2000 + 500);
    }
  };

  // Format timestamp to hh:mm
  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Handle adding a reaction to a message
  const handleAddReaction = (messageId: string, reactionName: string) => {
    setMessages(prev => 
      prev.map(msg => {
        if (msg.id === messageId) {
          const updatedReactions = {...(msg.reactions || {})};
          
          if (!updatedReactions[reactionName]) {
            updatedReactions[reactionName] = [currentUser.username];
          } else if (!updatedReactions[reactionName].includes(currentUser.username)) {
            updatedReactions[reactionName] = [...updatedReactions[reactionName], currentUser.username];
          } else {
            // Remove user from reaction if already reacted
            updatedReactions[reactionName] = updatedReactions[reactionName]
              .filter(name => name !== currentUser.username);
            
            // Remove reaction key if no users left
            if (updatedReactions[reactionName].length === 0) {
              delete updatedReactions[reactionName];
            }
          }
          
          return {
            ...msg,
            reactions: updatedReactions
          };
        }
        return msg;
      })
    );
    
    // Close emoji picker
    setShowEmojiPicker(null);
  };

  // Função para rolar para o final manualmente
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Removendo centralização e alinhando mensagens à esquerda
  const systemMessage = (content, timestamp) => (
    <div className="flex flex-col items-start mb-2">
      <div className="bg-gray-800 text-left rounded-lg py-1.5 px-3 text-sm text-blue-300">
        {content}
      </div>
      <span className="text-xs text-gray-500 mt-0.5">{timestamp}</span>
    </div>
  );

  // Atualizações de partida alinhadas à esquerda
  const matchUpdateMessage = (content, timestamp) => (
    <div className="flex flex-col items-start mb-2">
      <div className="bg-gray-800 text-left rounded-lg py-1.5 px-3 text-sm text-green-400 font-medium">
        {content}
      </div>
      <span className="text-xs text-gray-500 mt-0.5">{timestamp}</span>
    </div>
  );

  return (
    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
      {/* Header */}
      <div className="bg-furia-purple/20 p-3 border-b border-gray-800">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Chat da FURIA</h2>
            <p className="text-sm text-gray-400">
              Interaja com outros torcedores durante as partidas. Respeite as regras da comunidade!
            </p>
          </div>
          <button 
            onClick={scrollToBottom}
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white py-1 px-2 rounded-full flex items-center gap-1"
          >
            <span>Ir ao fim</span>
          </button>
        </div>
      </div>
      
      {/* Online indicator */}
      <div className="bg-gray-800 py-2 px-3 flex items-center justify-between">
        <div className="flex items-center">
          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span className="text-sm text-gray-400">
            {userCount.toLocaleString()} torcedores online
          </span>
        </div>
        <div className="flex items-center text-xs text-gray-500">
          <span>PT-BR</span>
          <span className="mx-1">•</span>
          <span>Ao vivo</span>
        </div>
      </div>
      
      {/* Pinned message if exists */}
      {messages.find(m => m.isPinned) && (
        <div className="bg-gray-800/80 p-2 border-b border-gray-700 flex items-start">
          <Pin size={14} className="text-furia-purple mt-0.5 mr-2 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-xs text-gray-300 font-medium">Mensagem Fixada</p>
            <p className="text-sm">{messages.find(m => m.isPinned)?.content}</p>
          </div>
        </div>
      )}
      
      {/* Chat area */}
      <div 
        className="p-3 overflow-y-auto" 
        style={{ height }}
      >
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`mb-3 ${message.username === currentUser.username ? 'text-right' : ''}`}
            id={`message-${message.id}`}
          >
            <div 
              className={`
                inline-block px-3 py-2 rounded-lg max-w-[85%] relative
                ${message.isSystem 
                  ? message.isHighlighted
                    ? 'bg-furia-purple/30 border border-furia-purple/50 w-full text-center'
                    : 'bg-furia-purple/20 border border-furia-purple/40 w-full text-center'
                  : message.username === currentUser.username
                  ? 'bg-furia-purple/20 border border-furia-purple/40'
                  : 'bg-gray-800'
                }
              `}
            >
              {!message.isSystem && (
                <div className="flex items-center mb-1">
                  <span className={`font-medium ${
                    message.username === 'Sistema' ? 'text-blue-400' : ''
                  }`}>
                    {message.username}
                  </span>
                  {message.badges && message.badges.length > 0 && (
                    <div className="flex ml-2 space-x-1">
                      {message.badges.map((badge, idx) => (
                        <span
                          key={idx}
                          className={`text-xs px-1 py-0.5 rounded ${
                            badge === 'Oficial' ? 'bg-blue-500/30 text-blue-300' :
                            badge === 'Moderador' ? 'bg-red-500/30 text-red-300' :
                            badge === 'Pro Analyst' ? 'bg-yellow-500/30 text-yellow-300' :
                            badge === 'Membro Premium' ? 'bg-purple-500/30 text-purple-300' :
                            badge === 'BR Pride' ? 'bg-green-500/30 text-green-300' :
                            'bg-gray-700 text-gray-300'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}
              <p className={message.isSystem ? 'font-medium text-yellow-300' : ''}>
                {message.content}
              </p>
              <div className="text-xs text-gray-500 mt-1 flex justify-between items-center">
                <span>{formatTime(message.timestamp)}</span>
                
                {!message.isSystem && (
                  <div className="flex space-x-1 ml-2">
                    {/* Reaction button */}
                    <button 
                      onClick={() => setShowEmojiPicker(showEmojiPicker === message.id ? null : message.id)}
                      className="text-gray-500 hover:text-furia-purple transition-colors"
                    >
                      <Smile size={14} />
                    </button>
                    
                    {/* Report button */}
                    <button className="text-gray-500 hover:text-red-500 transition-colors ml-1">
                      <Flag size={14} />
                    </button>
                  </div>
                )}
              </div>
              
              {/* Emoji picker */}
              {showEmojiPicker === message.id && (
                <div className="absolute z-10 bg-gray-800 p-2 rounded-md border border-gray-700 shadow-lg flex flex-wrap gap-1 mt-1"
                     style={{ 
                       [message.username === currentUser.username ? 'right' : 'left']: '0',
                       bottom: '100%'
                     }}>
                  {emojiOptions.map(option => (
                    <button 
                      key={option.name}
                      className="w-8 h-8 flex items-center justify-center hover:bg-gray-700 rounded"
                      onClick={() => handleAddReaction(message.id, option.name)}
                    >
                      {option.emoji}
                    </button>
                  ))}
                  <button 
                    className="text-gray-400 hover:text-white ml-1"
                    onClick={() => setShowEmojiPicker(null)}
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              
              {/* Message reactions */}
              {message.reactions && Object.keys(message.reactions).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {Object.entries(message.reactions).map(([reactionName, users]) => (
                    <button
                      key={reactionName}
                      onClick={() => handleAddReaction(message.id, reactionName)}
                      className={`
                        inline-flex items-center space-x-1 px-1.5 py-0.5 rounded-full text-xs
                        ${users.includes(currentUser.username) 
                          ? 'bg-furia-purple/30 border border-furia-purple/50' 
                          : 'bg-gray-700 hover:bg-gray-600'
                        }
                      `}
                    >
                      <span>
                        {emojiOptions.find(o => o.name === reactionName)?.emoji || '👍'}
                      </span>
                      <span>{users.length}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        
        {/* Typing indicators - Show multiple people typing at once */}
        {typingUsers.length > 0 && (
          <div className="flex items-center mb-3">
            <div className="bg-gray-800 px-3 py-2 rounded-lg max-w-[85%]">
              {typingUsers.length === 1 ? (
                <p className="text-sm text-gray-400">{typingUsers[0].username} está digitando...</p>
              ) : typingUsers.length === 2 ? (
                <p className="text-sm text-gray-400">{typingUsers[0].username} e {typingUsers[1].username} estão digitando...</p>
              ) : (
                <p className="text-sm text-gray-400">Várias pessoas estão digitando...</p>
              )}
              <div className="flex space-x-1 mt-1">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: '600ms' }}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={chatEndRef} />
      </div>
      
      {/* Chat input */}
      <div className="border-t border-gray-800 p-3">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <button
            type="button"
            className="text-gray-400 hover:text-furia-purple mr-2"
            onClick={() => {}} // Could trigger emoji picker for input
          >
            <Smile size={20} />
          </button>
          
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Digite sua mensagem..."
            className="flex-1 bg-gray-800 rounded-l-lg border-0 text-white px-3 py-2 focus:ring-1 focus:ring-furia-purple"
          />
          <button
            type="submit"
            className="bg-furia-purple hover:bg-furia-purple/80 text-white rounded-r-lg px-4 py-2 transition-colors"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default MatchChat;