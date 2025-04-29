import React, { useState, useEffect } from 'react';
import { MessageCircle, Trophy, Star, XCircle, Gift } from 'lucide-react';
import FuriBot from '../components/FuriBot';

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
  const [isFuriBotOpen, setIsFuriBotOpen] = useState(false);

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
        
        // For demo purposes, set some mock messages
        setMessages([
          {
            id: '1',
            user: { _id: 'system', username: 'Sistema', badges: ['Oficial'] },
            content: 'Bem-vindo ao chat da FURIA!',
            type: 'text',
            timestamp: new Date()
          },
          {
            id: '2',
            user: { _id: 'mod', username: 'Moderador', badges: ['Mod', 'Veterano'] },
            content: 'A partida FURIA vs NAVI começará em breve!',
            type: 'match-update',
            timestamp: new Date(Date.now() - 300000)
          },
          {
            id: '3',
            user: { _id: 'furibot', username: 'FURIBOT', badges: ['BOT', 'Verificado'] },
            content: 'Olá torcedores! Estou aqui para responder suas perguntas sobre o time e estatísticas de jogadores. Basta me mencionar com @FURIBOT',
            type: 'text',
            timestamp: new Date(Date.now() - 200000)
          }
        ]);
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
        // Show FURIBOT interface
        setIsFuriBotOpen(true);
        return;
      }
      
      // In a real app, this would send a POST request to the API
      // const response = await fetch('http://localhost:5002/api/messages', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     user: currentUser._id,
      //     content,
      //     type: 'text',
      //     timestamp: new Date()
      //   }),
      // });
      
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
              <div className="h-[500px] overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`${
                      message.user._id === currentUser._id ? 'text-right' : 'text-left'
                    }`}
                  >
                    <div 
                      className={`inline-block rounded-lg px-4 py-2 max-w-[85%] ${
                        message.type === 'match-update' 
                          ? 'bg-yellow-600/20 border border-yellow-600'
                          : message.type === 'mission-complete'
                          ? 'bg-green-600/20 border border-green-600'
                          : message.user._id === currentUser._id
                          ? 'bg-furia-purple/20 border border-furia-purple'
                          : 'bg-gray-700 dark:bg-gray-800'
                      }`}
                    >
                      {message.user._id !== currentUser._id && (
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-semibold text-sm">
                            {message.user.username}
                          </span>
                          {message.user.badges?.map((badge, i) => (
                            <span 
                              key={i} 
                              className="text-xs px-1.5 py-0.5 rounded-full bg-gray-600 text-gray-200"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      )}
                      <p className={`${message.type === 'mission-complete' ? 'text-green-400' : ''}`}>
                        {message.content}
                      </p>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
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
          <button
            onClick={() => setIsFuriBotOpen(true)}
            className="w-full bg-furia-purple hover:bg-purple-700 rounded-lg p-3 flex items-center gap-3 transition duration-200"
          >
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
              <Gift className="h-6 w-6 text-furia-purple" />
            </div>
            <div className="text-left">
              <h3 className="font-bold text-white">FURIBOT</h3>
              <p className="text-xs text-gray-200">Pergunte sobre estatísticas e jogadores</p>
            </div>
          </button>
        </div>
      </div>

      {/* FURIBOT component */}
      <FuriBot 
        isOpen={isFuriBotOpen} 
        onClose={() => setIsFuriBotOpen(false)} 
        onSendMessage={handleFuriBotMessage} 
      />
    </div>
  );
};

export default ChatPage; 