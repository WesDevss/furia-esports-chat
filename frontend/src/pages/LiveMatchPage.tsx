import React, { useState, useEffect } from 'react';
import { ChevronRight, BarChart2, User, MessageCircle, Clock, Trophy, Info, Star, Send } from 'lucide-react';
import FuriBot from '../components/FuriBot';
import LiveMatchScoreDisplay from '../components/LiveMatchScoreDisplay';

interface Player {
  id: string;
  name: string;
  avatar: string;
  role: string;
  team: 'FURIA' | 'Opponent';
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    adr: number;
    hs: number;
    rating: number;
  };
}

interface MatchData {
  id: string;
  status: 'upcoming' | 'live' | 'finished';
  teams: {
    home: {
      name: string;
      logo: string;
      score: number;
    };
    away: {
      name: string;
      logo: string;
      score: number;
    };
  };
  game: 'CS2' | 'VALORANT' | 'League of Legends' | 'Apex Legends';
  tournament: string;
  stage: string;
  maps: string[];
  currentMap: string;
  currentRound: number;
  maxRounds: number;
  players: Player[];
  startTime: Date;
}

const LiveMatchPage: React.FC = () => {
  const [matchData, setMatchData] = useState<MatchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'stats' | 'chat'>('stats');
  const [isFuriBotOpen, setIsFuriBotOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<any[]>([]);

  // Simula chegada de novas mensagens sem rolar automaticamente
  useEffect(() => {
    if (!loading && matchData) {
      const interval = setInterval(() => {
        const newMessage = {
          id: Date.now().toString(),
          username: ['CyberPunk77', 'CS2Lover', 'FuriaFaithful', 'OneShot_BR', 'GaroloDoHeadshot'][Math.floor(Math.random() * 5)],
          content: [
            "INACREDITÁVEL!!!",
            "Que jogada do yuurih!",
            "VAMO FURIA!!!",
            "Essa rotação foi perfeita",
            "Clutch insano do drop!"
          ][Math.floor(Math.random() * 5)],
          timestamp: new Date()
        };
        
        setChatMessages(prev => [...prev, newMessage]);
      }, 10000); // Nova mensagem a cada 10 segundos
      
      return () => clearInterval(interval);
    }
  }, [loading, matchData]);

  useEffect(() => {
    // In a real application, this would be an API call
    const fetchMatchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Mock data
        const mockMatchData: MatchData = {
          id: 'match-123',
          status: 'live',
          teams: {
            home: {
              name: 'FURIA',
              logo: '/team-logos/furia-logo.jpeg',
              score: 12
            },
            away: {
              name: 'NAVI',
              logo: '/team-logos/navi-logo.png',
              score: 10
            }
          },
          game: 'CS2',
          tournament: 'ESL Pro League Season 17',
          stage: 'Playoffs - Quarter Finals',
          maps: ['Inferno', 'Mirage', 'Nuke'],
          currentMap: 'Mirage',
          currentRound: 23,
          maxRounds: 30,
          players: [
            {
              id: 'player-1',
              name: 'yuurih',
              avatar: '/avatars/yuurih.png',
              role: 'Rifler',
              team: 'FURIA',
              stats: {
                kills: 21,
                deaths: 12,
                assists: 4,
                adr: 92.7,
                hs: 68,
                rating: 1.47
              }
            },
            {
              id: 'player-2',
              name: 'kscerato',
              avatar: '/avatars/kscerato.png',
              role: 'Rifler',
              team: 'FURIA',
              stats: {
                kills: 18,
                deaths: 14,
                assists: 7,
                adr: 88.3,
                hs: 54,
                rating: 1.32
              }
            },
            {
              id: 'player-3',
              name: 'fall3n',
              avatar: '/avatars/fall3n.png',
              role: 'AWPer',
              team: 'FURIA',
              stats: {
                kills: 15,
                deaths: 15,
                assists: 3,
                adr: 72.1,
                hs: 42,
                rating: 1.11
              }
            }
            // In real app, would include all 10 players (5 per team)
          ],
          startTime: new Date(Date.now() - 45 * 60 * 1000) // Started 45 minutes ago
        };

        setMatchData(mockMatchData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching match data:', err);
        setError('Não foi possível carregar os dados da partida. Tente novamente mais tarde.');
        setLoading(false);
      }
    };

    fetchMatchData();
  }, []);

  // Handle FURIBOT message
  const handleFuriBotMessage = (message: string) => {
    // In a real app, this would integrate with the chat system
    console.log('FURIBOT message:', message);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-10 w-48 bg-furia-purple/20 rounded mx-auto"></div>
          <p className="text-furia-purple">Carregando dados da partida...</p>
        </div>
      </div>
    );
  }

  if (error || !matchData) {
    return (
      <div className="bg-red-500/20 border border-red-500 text-red-200 rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-xl font-bold mb-2">Erro</h2>
        <p>{error || 'Ocorreu um erro desconhecido.'}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4">
      {/* Replace the match header section with our new component */}
      <LiveMatchScoreDisplay 
        homeTeam={matchData.teams.home}
        awayTeam={matchData.teams.away}
        tournament={matchData.tournament}
        stage={matchData.stage}
        game={matchData.game}
        currentRound={matchData.currentRound}
        maxRounds={matchData.maxRounds}
        currentMap={matchData.currentMap}
        isLive={matchData.status === 'live'}
      />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Live stream embed */}
        <div className="lg:col-span-2">
          <div className="bg-black rounded-xl overflow-hidden aspect-video mb-6">
            <div className="w-full h-full flex items-center justify-center">
              {/* In a real app, this would be an actual embed */}
              <div className="text-center">
                <Trophy className="h-16 w-16 text-furia-purple mx-auto mb-4" />
                <p className="text-xl">Transmissão ao vivo indisponível no modo de demonstração</p>
                <p className="text-gray-400 mt-2">
                  Em produção, um embed da Twitch ou YouTube seria exibido aqui
                </p>
              </div>
            </div>
          </div>
          
          {/* Tabs for statistics or chat on mobile */}
          <div className="lg:hidden mb-4">
            <div className="flex border-b border-gray-700">
              <button
                className={`flex-1 py-3 text-center ${
                  activeTab === 'stats' 
                    ? 'border-b-2 border-furia-purple text-white' 
                    : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('stats')}
              >
                <div className="flex items-center justify-center gap-2">
                  <BarChart2 className="h-5 w-5" />
                  <span>Estatísticas</span>
                </div>
              </button>
              <button
                className={`flex-1 py-3 text-center ${
                  activeTab === 'chat' 
                    ? 'border-b-2 border-furia-purple text-white' 
                    : 'text-gray-400'
                }`}
                onClick={() => setActiveTab('chat')}
              >
                <div className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  <span>Chat</span>
                </div>
              </button>
            </div>
          </div>
          
          {/* Stats panel (visible on desktop or when stats tab is active) */}
          {(activeTab === 'stats' || window.innerWidth >= 1024) && (
            <div className="bg-gray-800 dark:bg-gray-900 rounded-xl p-6">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-furia-purple" />
                Estatísticas ao vivo
              </h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4">Jogador</th>
                      <th className="text-center py-3 px-4">K</th>
                      <th className="text-center py-3 px-4">D</th>
                      <th className="text-center py-3 px-4">A</th>
                      <th className="text-center py-3 px-4">ADR</th>
                      <th className="text-center py-3 px-4">HS%</th>
                      <th className="text-center py-3 px-4">Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {matchData.players.map((player) => (
                      <tr 
                        key={player.id} 
                        className="border-b border-gray-700 hover:bg-gray-700/30"
                      >
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                              <User className="h-4 w-4 text-gray-400" />
                            </div>
                            <div>
                              <div className={`font-medium ${player.team === 'FURIA' ? 'text-furia-purple' : 'text-white'}`}>
                                {player.name}
                              </div>
                              <div className="text-xs text-gray-400">{player.role}</div>
                            </div>
                          </div>
                        </td>
                        <td className="text-center py-3 px-4">{player.stats.kills}</td>
                        <td className="text-center py-3 px-4">{player.stats.deaths}</td>
                        <td className="text-center py-3 px-4">{player.stats.assists}</td>
                        <td className="text-center py-3 px-4">{player.stats.adr.toFixed(1)}</td>
                        <td className="text-center py-3 px-4">{player.stats.hs}%</td>
                        <td className="text-center py-3 px-4 font-medium">
                          <span className={player.stats.rating >= 1.3 ? 'text-green-500' : player.stats.rating >= 1.0 ? 'text-yellow-500' : 'text-red-500'}>
                            {player.stats.rating.toFixed(2)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="mt-4 text-xs text-gray-400 text-right">
                Estatísticas atualizadas em tempo real
              </div>
            </div>
          )}
        </div>
        
        {/* Chat panel (visible on desktop or when chat tab is active) */}
        {(activeTab === 'chat' || window.innerWidth >= 1024) && (
          <div className="bg-[#111827] rounded-xl overflow-hidden lg:col-span-2 h-[500px] flex flex-col">
            <div className="py-2 px-4 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center">
                <MessageCircle className="h-5 w-5 text-furia-purple mr-2" />
                <h2 className="font-bold text-sm">Chat da partida</h2>
              </div>
              <button 
                className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-400 hover:text-white py-1 px-2 rounded-full flex items-center gap-1"
                onClick={() => {
                  const chatArea = document.querySelector('.chat-area');
                  if (chatArea) {
                    chatArea.scrollTop = chatArea.scrollHeight;
                  }
                }}
              >
                <ChevronRight className="h-3 w-3 transform rotate-90" />
                <span>Ir ao fim</span>
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 chat-area">
              <div className="px-2">
                <div className="pt-2 pb-1 px-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2">
                      <div className="bg-red-500 rounded-full h-6 w-6 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">M</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-red-400 text-sm font-medium mr-1">Moderador</span>
                        <span className="bg-red-900 text-xs px-1.5 py-0.5 rounded text-white">MOD</span>
                      </div>
                      <p className="text-sm text-white mt-1">Pessoal, respeitem as regras do chat. Sem spam!</p>
                      <span className="text-xs text-gray-500 block">14:23</span>
                    </div>
                  </div>
                </div>

                <div className="py-1 px-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2">
                      <div className="bg-gray-600 rounded-full h-6 w-6 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">P</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-white text-sm font-medium mr-1">PantheraBR</span>
                        <span className="bg-furia-purple text-xs px-1.5 py-0.5 rounded text-white">Membro</span>
                      </div>
                      <p className="text-sm text-white mt-1">Alguém viu o último round? O que aconteceu?</p>
                      <span className="text-xs text-gray-500 block">14:25</span>
                    </div>
                  </div>
                </div>

                <div className="py-1 px-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2">
                      <div className="bg-furia-purple rounded-full h-6 w-6 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">G</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-white text-sm font-medium mr-1">GustavoFuria</span>
                        <span className="bg-gray-700 text-xs px-1.5 py-0.5 rounded text-white">Torcedor</span>
                      </div>
                      <p className="text-sm text-white mt-1">Esse time tá jogando muito hoje! 😍</p>
                      <span className="text-xs text-gray-500 block">14:28</span>
                    </div>
                  </div>
                </div>

                <div className="py-1 px-2">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mr-2">
                      <div className="bg-green-500 rounded-full h-6 w-6 flex items-center justify-center">
                        <span className="text-xs font-bold text-white">A</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center">
                        <span className="text-white text-sm font-medium mr-1">Almeida22</span>
                        <span className="bg-gray-700 text-xs px-1.5 py-0.5 rounded text-white">Torcedor</span>
                      </div>
                      <p className="text-sm text-white mt-1">art está imparável hoje!</p>
                      <span className="text-xs text-gray-500 block">14:30</span>
                    </div>
                  </div>
                </div>

                {/* Mensagens simuladas dinamicamente */}
                {chatMessages.map(message => (
                  <div key={message.id} className="py-1 px-2">
                    <div className="flex items-start">
                      <div className="flex-shrink-0 mr-2">
                        <div className="bg-yellow-500 rounded-full h-6 w-6 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">{message.username.charAt(0)}</span>
                        </div>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center">
                          <span className="text-white text-sm font-medium mr-1">{message.username}</span>
                          <span className="bg-gray-700 text-xs px-1.5 py-0.5 rounded text-white">BR Pride</span>
                        </div>
                        <p className="text-sm text-white mt-1">{message.content}</p>
                        <span className="text-xs text-gray-500 block">
                          {message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="mt-auto border-t border-gray-800">
              <div className="px-4 pt-2 pb-1">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
                  <span className="text-xs text-gray-400">3 pessoas digitando...</span>
                </div>
              </div>
              
              <div className="px-4 pb-2">
                <div className="flex items-center">
                  <div className="flex-shrink-0 mr-2">
                    <div className="bg-furia-purple rounded-full h-7 w-7 flex items-center justify-center">
                      <User size={14} className="text-white" />
                    </div>
                  </div>
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      placeholder="Digite sua mensagem..."
                      className="w-full bg-gray-800 border border-gray-700 text-sm rounded-full py-1.5 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-furia-purple focus:border-furia-purple"
                    />
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center">
                      <button className="text-gray-400 hover:text-furia-purple p-1 transition-colors">
                        <Send size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="px-3 pb-3">
                <div className="flex space-x-2 overflow-x-auto pb-1 scrollbar-none">
                  <button className="bg-gray-800 text-xs text-gray-300 px-3 py-1 rounded-full whitespace-nowrap hover:bg-furia-purple/20 transition-colors">
                    GG!
                  </button>
                  <button className="bg-gray-800 text-xs text-gray-300 px-3 py-1 rounded-full whitespace-nowrap hover:bg-furia-purple/20 transition-colors">
                    Vamos FURIA!
                  </button>
                  <button className="bg-gray-800 text-xs text-gray-300 px-3 py-1 rounded-full whitespace-nowrap hover:bg-furia-purple/20 transition-colors">
                    Boa jogada!
                  </button>
                  <button className="bg-gray-800 text-xs text-gray-300 px-3 py-1 rounded-full whitespace-nowrap hover:bg-furia-purple/20 transition-colors">
                    Incrível!
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* FURIBOT component */}
      {isFuriBotOpen && (
        <FuriBot 
          isOpen={isFuriBotOpen} 
          onClose={() => setIsFuriBotOpen(false)} 
          onSendMessage={handleFuriBotMessage}
          onToggle={() => setIsFuriBotOpen(!isFuriBotOpen)}
        />
      )}
    </div>
  );
};

export default LiveMatchPage; 