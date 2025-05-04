import React, { useState, useEffect, useContext } from 'react';
import { MessageCircle, Trophy, Star, XCircle, Gift } from 'lucide-react';
import { FuriBotContext } from '../App';
import FuriBotButton from '../components/FuriBotButton';
import { QuizWidget } from '../components/widgets';

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

interface Mission {
  id: string;
  title: string;
  description: string;
  reward: number;
  completed: boolean;
  icon: React.ReactNode;
  expiry?: Date;
}

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState({
    _id: '1',  // This would come from authentication in a real app
    username: 'FuriaFan123',
    level: 3,
    badges: ['Novo Torcedor', 'CS Expert']
  });
  const [missions, setMissions] = useState<Mission[]>([]);
  const [showMissions, setShowMissions] = useState(false);
  
  // Usar o contexto global em vez do estado local
  const { openFuriBot } = useContext(FuriBotContext);

  // Fetch messages effect
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        // This would be replaced with a real API call in production
        const response = await fetch('http://localhost:5002/api/messages');
        
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        
        const data = await response.json();
        setMessages(data.messages || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
        setLoading(false);
        
        // Mock messages showing fans conversing during a match
        const now = Date.now();
        const mockMessages: Message[] = [
          {
            id: '1',
            user: { _id: 'system', username: 'Sistema', badges: ['Oficial'] },
            content: 'Bem-vindo ao chat da FURIA!',
            type: 'text',
            timestamp: new Date(now - 1800000) // 30 minutes ago
          },
          {
            id: '2',
            user: { _id: 'mod', username: 'Moderador', badges: ['Mod', 'Veterano'] },
            content: 'A partida FURIA vs NAVI começou! Vamos torcer juntos!',
            type: 'match-update',
            timestamp: new Date(now - 600000) // 10 minutes ago
          },
          {
            id: '3',
            user: { _id: 'user1', username: 'CSGOMaster', level: 5, badges: ['Veterano'] },
            content: 'Grande jogada do Art!',
            type: 'text',
            timestamp: new Date(now - 420000) // 7 minutes ago
          },
          {
            id: '4',
            user: { _id: 'user2', username: 'FuriaFanatic', level: 4, badges: ['Membro Premium'] },
            content: 'KSCERATO está jogando muito hoje! 🔥',
            type: 'text',
            timestamp: new Date(now - 380000) // 6.3 minutes ago
          },
          {
            id: '5',
            user: { _id: 'user3', username: 'NaviHater2023', level: 2, badges: [] },
            content: 'A defesa da FURIA está muito sólida neste mapa',
            type: 'text',
            timestamp: new Date(now - 300000) // 5 minutes ago
          },
          {
            id: '6',
            user: { _id: 'user4', username: 'BRzao', level: 7, badges: ['Top Torcedor'] },
            content: 'Alguém viu aquele clutch do FalleN? MONSTRO! 👏',
            type: 'text',
            timestamp: new Date(now - 250000) // 4.2 minutes ago
          },
          {
            id: '7',
            user: { _id: 'system', username: 'Sistema', badges: ['Oficial'] },
            content: 'FURIA acaba de ganhar o round 15! Placar: 9-6',
            type: 'match-update',
            timestamp: new Date(now - 200000) // 3.3 minutes ago
          },
          {
            id: '8',
            user: { _id: 'user5', username: 'EsportsFan', level: 3, badges: [] },
            content: 'Alguém tem o link da stream?',
            type: 'text',
            timestamp: new Date(now - 150000) // 2.5 minutes ago
          },
          {
            id: '9',
            user: { _id: 'user6', username: 'GreenWall', level: 6, badges: ['Membro desde 2020'] },
            content: 'Esse S1mple está dando trabalho, mas a FURIA está sabendo controlar bem',
            type: 'text',
            timestamp: new Date(now - 120000) // 2 minutes ago
          },
          {
            id: '10',
            user: { _id: 'user7', username: 'CyberPunk77', level: 4, badges: [] },
            content: 'Yuurih!!!! Que jogada! 🤯',
            type: 'text',
            timestamp: new Date(now - 100000) // 1.7 minutes ago
          },
          {
            id: '11',
            user: { _id: 'user8', username: 'HEADSHOTonly', level: 8, badges: ['Pro Analyst'] },
            content: 'A rotação da FURIA no meio do mapa está fazendo toda a diferença',
            type: 'text',
            timestamp: new Date(now - 90000) // 1.5 minutes ago
          },
          {
            id: '12',
            user: { _id: 'user9', username: 'CS2Lover', level: 3, badges: [] },
            content: 'Esse molodoy tá muito bem se adaptando ao time!',
            type: 'text',
            timestamp: new Date(now - 60000) // 1 minute ago
          },
          {
            id: '13',
            user: { _id: 'user10', username: 'FuriaFaithful', level: 9, badges: ['OG Fan'] },
            content: 'VAMOOOOOOO FURIA!!!',
            type: 'text',
            timestamp: new Date(now - 30000) // 30 seconds ago
          }
        ];
        
        setMessages(mockMessages);
      }
    };

    fetchMessages();

    // Initialize missions
    setMissions([
      {
        id: '1',
        title: 'Primeira mensagem',
        description: 'Envie sua primeira mensagem no chat',
        reward: 50,
        completed: false,
        icon: <MessageCircle className="h-5 w-5 text-blue-400" />
      },
      {
        id: '2',
        title: 'Fã do dia',
        description: 'Poste 5 mensagens durante uma partida ao vivo',
        reward: 100,
        completed: false,
        icon: <Star className="h-5 w-5 text-yellow-400" />
      },
      {
        id: '3',
        title: 'Interação com FURIBOT',
        description: 'Faça uma pergunta ao FURIBOT sobre estatísticas',
        reward: 75,
        completed: false,
        icon: <Gift className="h-5 w-5 text-purple-400" />,
        expiry: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
      }
    ]);
  }, []);

  // Handle sending a new message
  const handleSendMessage = async (content: string) => {
    try {
      // Check if this is a message to FURIBOT
      if (content.toLowerCase().includes('@furibot')) {
        // Show FURIBOT interface usando o contexto global
        openFuriBot();
        return;
      }
      
      // Mock response for now
      const newMessage: Message = {
        id: Date.now().toString(),
        user: currentUser,
        content,
        type: 'text',
        timestamp: new Date()
      };
      
      setMessages((prevMessages) => [...prevMessages, newMessage]);
      
      // Check if "first message" mission is completed
      if (!missions.find(m => m.id === '1')?.completed) {
        completeMission('1');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      setError('Failed to send message. Please try again.');
    }
  };

  // Complete a mission
  const completeMission = (missionId: string) => {
    setMissions(prev => 
      prev.map(mission => 
        mission.id === missionId 
          ? { ...mission, completed: true } 
          : mission
      )
    );
    
    // Find the mission to get the reward
    const mission = missions.find(m => m.id === missionId);
    if (mission && !mission.completed) {
      // Add mission completed message
      const missionMessage: Message = {
        id: Date.now().toString(),
        user: { _id: 'system', username: 'Sistema', badges: ['Oficial'] },
        content: `🎉 Você completou a missão "${mission.title}" e ganhou ${mission.reward} pontos de experiência!`,
        type: 'mission-complete',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, missionMessage]);
      
      // In a real app, we would update the user's XP in the database
    }
  };

  // Handle FURIBOT response
  const handleFuriBotMessage = (message: string) => {
    const botMessage: Message = {
      id: Date.now().toString(),
      user: { _id: 'furibot', username: 'FURIBOT', badges: ['BOT', 'Verificado'] },
      content: message,
      type: 'text',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, botMessage]);
    
    // Check if "interact with FURIBOT" mission is completed
    if (!missions.find(m => m.id === '3')?.completed) {
      completeMission('3');
    }
  };

  // Format timestamp into readable time
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Chat da FURIA</h1>
        <p className="text-gray-400">
          Interaja com outros torcedores durante as partidas. 
          Respeite as regras da comunidade!
        </p>
      </div>

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-red-200 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          {loading ? (
            <div className="flex justify-center items-center h-[400px]">
              <div className="animate-pulse space-y-2 text-center">
                <div className="h-6 w-24 bg-furia-purple/20 rounded mx-auto"></div>
                <p className="text-furia-purple text-sm">Carregando mensagens...</p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-800 dark:bg-gray-900 rounded-lg overflow-hidden">
              {/* Chat messages area */}
              <div className="h-[500px] overflow-y-auto p-4 space-y-4 bg-gray-900">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`${
                      message.user._id === currentUser._id ? 'text-right' : 'text-left'
                    } mb-3`}
                  >
                    <div className={`
                      ${message.type === 'match-update' 
                        ? 'inline-block w-full bg-furia-purple/20 border border-furia-purple/40 rounded-lg px-4 py-2 text-center'
                        : message.user._id === currentUser._id
                        ? 'inline-block bg-furia-purple/20 border border-furia-purple/40 rounded-lg px-4 py-2 max-w-[85%]'
                        : 'inline-block bg-gray-800 rounded-lg px-4 py-2 max-w-[85%]'
                      }
                    `}>
                      {message.type !== 'match-update' && (
                        <div className="flex items-center mb-1">
                          <span className={`font-bold ${
                            message.user.username === 'FURIBOT' 
                              ? 'text-furia-purple' 
                              : message.user.username === 'Sistema' || message.user.username === 'Moderador'
                              ? 'text-blue-400'
                              : ''
                          }`}>
                            {message.user.username}
                          </span>
                          <div className="flex ml-2 space-x-1">
                            {message.user.badges?.map((badge, index) => (
                              <span 
                                key={index}
                                className="bg-gray-700 text-xs px-1 py-0.5 rounded"
                              >
                                {badge}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                      <p className={`${message.type === 'match-update' ? 'text-yellow-300 font-medium' : ''}`}>
                        {message.content}
                      </p>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatTime(new Date(message.timestamp))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Chat input */}
              <div className="border-t border-gray-700 p-4">
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    const input = form.elements.namedItem('message') as HTMLInputElement;
                    if (input.value.trim()) {
                      handleSendMessage(input.value);
                      input.value = '';
                    }
                  }}
                  className="flex gap-2"
                >
                  <input
                    type="text"
                    name="message"
                    placeholder="Digite sua mensagem..."
                    className="flex-1 rounded-lg bg-gray-700 dark:bg-gray-800 border border-gray-600 px-3 py-2 text-white focus:outline-none focus:border-furia-purple"
                  />
                  <button
                    type="submit"
                    className="bg-furia-purple hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition duration-200"
                  >
                    Enviar
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
        
        {/* Side panel - User info and missions */}
        <div className="space-y-4">
          {/* User card */}
          <div className="bg-gray-800 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-furia-purple flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {currentUser.username.charAt(0)}
                </span>
              </div>
              <div>
                <h3 className="font-bold text-white">{currentUser.username}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {currentUser.badges?.map((badge, index) => (
                    <span 
                      key={index}
                      className="text-xs px-1.5 py-0.5 rounded-full bg-gray-700 text-gray-200"
                    >
                      {badge}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Level progress */}
            <div className="mt-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Nível {currentUser.level}</span>
                <span>Próximo: {currentUser.level + 1}</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div className="bg-furia-purple h-2.5 rounded-full" style={{ width: '65%' }}></div>
              </div>
            </div>
          </div>
          
          {/* Missions */}
          <div className="bg-gray-800 dark:bg-gray-900 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-500" />
                Missões
              </h3>
              <button 
                onClick={() => setShowMissions(!showMissions)}
                className="text-gray-400 hover:text-white text-sm underline"
              >
                {showMissions ? 'Ocultar' : 'Ver todas'}
              </button>
            </div>
            
            <div className="space-y-3">
              {missions
                .filter(m => showMissions || !m.completed)
                .slice(0, showMissions ? missions.length : 2)
                .map(mission => (
                  <div 
                    key={mission.id} 
                    className={`border border-gray-700 rounded-lg p-3 ${mission.completed ? 'bg-green-900/20' : ''}`}
                  >
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2">
                        {mission.icon}
                        <h4 className="font-medium">{mission.title}</h4>
                      </div>
                      {mission.completed ? (
                        <span className="text-green-400 text-sm">Completo</span>
                      ) : (
                        <span className="text-yellow-500 text-sm">+{mission.reward} XP</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">{mission.description}</p>
                    {mission.expiry && (
                      <p className="text-xs text-red-400 mt-1">
                        Expira em {new Date(mission.expiry).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
            </div>
          </div>
          
          {/* FURIBOT shortcut */}
          <FuriBotButton variant="card" />
          
          {/* Add the Quiz Widget */}
          <div className="mt-8">
            <h3 className="text-lg font-bold mb-3">Quiz FURIA</h3>
            <QuizWidget 
              quizId="furia-conhecimentos"
              className="mt-2"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage; 