import React, { useState, useEffect } from 'react';
import { Bot, MessageSquare, User, RefreshCw, X } from 'lucide-react';

interface FuriBotProps {
  onSendMessage: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Types for bot memory
interface BotMemory {
  favoriteTeam?: string;
  favoritePlayer?: string;
  preferredGame?: string;
  lastInteraction?: Date;
  knownStats?: Record<string, any>;
  previousQueries?: string[];
}

// Mock stats data - in a real app this would come from an API
const mockStatsData = {
  yuurih: {
    today: { kills: 22, deaths: 15, assists: 7, rating: 1.28 },
    lastMatch: { kills: 18, deaths: 12, assists: 5, rating: 1.32 },
    tournament: { kills: 87, deaths: 62, assists: 30, rating: 1.24 }
  },
  kscerato: {
    today: { kills: 19, deaths: 13, assists: 6, rating: 1.31 },
    lastMatch: { kills: 21, deaths: 14, assists: 8, rating: 1.40 },
    tournament: { kills: 92, deaths: 59, assists: 32, rating: 1.33 }
  },
  fall3n: {
    today: { kills: 16, deaths: 14, assists: 4, rating: 1.15 },
    lastMatch: { kills: 14, deaths: 12, assists: 3, rating: 1.17 },
    tournament: { kills: 76, deaths: 70, assists: 22, rating: 1.10 }
  }
};

const FuriBot: React.FC<FuriBotProps> = ({ onSendMessage, isOpen, onClose }) => {
  const [userInput, setUserInput] = useState('');
  const [botResponse, setBotResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [memory, setMemory] = useState<BotMemory>(() => {
    // Try to load memory from localStorage
    const savedMemory = localStorage.getItem('furibot_memory');
    return savedMemory ? JSON.parse(savedMemory) : {};
  });

  useEffect(() => {
    // Save memory to localStorage whenever it changes
    localStorage.setItem('furibot_memory', JSON.stringify(memory));
  }, [memory]);

  const saveToMemory = (key: keyof BotMemory, value: any) => {
    setMemory(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Track query in memory
    saveToMemory('previousQueries', [
      ...(memory.previousQueries || []).slice(-4),
      userInput
    ]);
    saveToMemory('lastInteraction', new Date());

    processInput(userInput);
    setUserInput('');
  };

  const processInput = (input: string) => {
    setIsLoading(true);
    
    // In a real app, this would call an API or use a natural language processing library
    setTimeout(() => {
      setIsLoading(false);
      
      // Check for stat queries
      const lowerInput = input.toLowerCase();
      
      // Check for player stats queries
      if (lowerInput.includes('stat') || lowerInput.includes('kills') || lowerInput.includes('k/d')) {
        const players = ['yuurih', 'kscerato', 'fall3n'];
        const playerMatch = players.find(player => lowerInput.includes(player.toLowerCase()));
        
        if (playerMatch) {
          saveToMemory('favoritePlayer', playerMatch);
          const playerStats = mockStatsData[playerMatch as keyof typeof mockStatsData];
          
          if (lowerInput.includes('hoje') || lowerInput.includes('today')) {
            setBotResponse(`Estatísticas de ${playerMatch} hoje: 
              ${playerStats.today.kills} kills, ${playerStats.today.deaths} deaths, 
              ${playerStats.today.assists} assists, Rating: ${playerStats.today.rating}`);
          } else if (lowerInput.includes('último') || lowerInput.includes('ultima') || lowerInput.includes('last match')) {
            setBotResponse(`Estatísticas de ${playerMatch} na última partida: 
              ${playerStats.lastMatch.kills} kills, ${playerStats.lastMatch.deaths} deaths, 
              ${playerStats.lastMatch.assists} assists, Rating: ${playerStats.lastMatch.rating}`);
          } else {
            setBotResponse(`Estatísticas de ${playerMatch} no torneio: 
              ${playerStats.tournament.kills} kills, ${playerStats.tournament.deaths} deaths, 
              ${playerStats.tournament.assists} assists, Rating: ${playerStats.tournament.rating}`);
          }
          return;
        }
      }
      
      // Check for team preferences
      if (lowerInput.includes('time favorito') || lowerInput.includes('favorite team')) {
        if (lowerInput.includes('furia')) {
          saveToMemory('favoriteTeam', 'FURIA');
          setBotResponse('Ótima escolha! FURIA é meu time favorito também! 🔥');
        } else {
          setBotResponse('Legal, mas você sabe que o FURIA é o melhor time, certo? 😉');
        }
        return;
      }
      
      // Check for game preferences
      const games = ['cs', 'cs2', 'counter-strike', 'valorant', 'league', 'lol', 'apex'];
      for (const game of games) {
        if (lowerInput.includes(game)) {
          saveToMemory('preferredGame', game);
          setBotResponse(`Percebi que você gosta de ${game}. Posso te manter atualizado sobre o desempenho da FURIA em ${game}!`);
          return;
        }
      }
      
      // Personal response using memory
      if (memory.favoritePlayer && lowerInput.includes('jogador')) {
        setBotResponse(`Pelo que me lembro, você gosta do ${memory.favoritePlayer}. Ele tem se destacado nos últimos jogos!`);
        return;
      }
      
      // Default responses
      const defaultResponses = [
        'Estou aqui para ajudar com informações sobre a FURIA! O que você gostaria de saber?',
        'Você pode me perguntar sobre estatísticas de jogadores, próximas partidas ou resultados recentes.',
        'FURIA está sempre melhorando, assim como eu! Posso responder sobre estatísticas ou jogos.',
        'Vamos FURIA! Posso te ajudar com informações sobre o time ou jogadores.'
      ];
      
      setBotResponse(defaultResponses[Math.floor(Math.random() * defaultResponses.length)]);
    }, 600);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-20 right-4 w-80 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50">
      {/* Header */}
      <div className="bg-furia-purple p-3 flex items-center justify-between">
        <div className="flex items-center">
          <Bot className="h-6 w-6 text-white mr-2" />
          <h3 className="text-white font-bold">FURIBOT</h3>
        </div>
        <button 
          onClick={onClose}
          className="text-gray-300 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Chat area */}
      <div className="h-80 overflow-y-auto p-3 bg-gray-900 dark:bg-black">
        {/* Welcome message */}
        <div className="flex mb-4">
          <div className="bg-furia-purple rounded-lg p-3 max-w-[80%]">
            <p className="text-white">
              Olá! Sou o FURIBOT, assistente oficial da FURIA. Como posso ajudar hoje?
              {memory.favoritePlayer && ` Vejo que você gosta do ${memory.favoritePlayer}!`}
            </p>
          </div>
        </div>

        {/* Bot response */}
        {botResponse && (
          <div className="flex mb-4">
            <div className="bg-furia-purple rounded-lg p-3 max-w-[80%]">
              <p className="text-white">{botResponse}</p>
            </div>
          </div>
        )}

        {/* User message - show the last query if available */}
        {memory.previousQueries && memory.previousQueries.length > 0 && (
          <div className="flex justify-end mb-4">
            <div className="bg-gray-700 rounded-lg p-3 max-w-[80%]">
              <p className="text-white">{memory.previousQueries[memory.previousQueries.length - 1]}</p>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="flex mb-4">
            <div className="bg-gray-700 rounded-lg p-3">
              <RefreshCw className="h-5 w-5 text-furia-purple animate-spin" />
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700">
        <div className="flex">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 bg-gray-700 dark:bg-gray-800 text-white rounded-l-md px-3 py-2 focus:outline-none"
            placeholder="Pergunte algo sobre a FURIA..."
          />
          <button
            type="submit"
            className="bg-furia-purple text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition duration-200"
            disabled={isLoading}
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default FuriBot; 