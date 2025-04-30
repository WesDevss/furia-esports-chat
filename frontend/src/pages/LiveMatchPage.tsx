import React, { useState, useEffect } from 'react';
import { ChevronRight, BarChart2, User, MessageCircle, Clock, Trophy } from 'lucide-react';
import FuriBot from '../components/FuriBot';

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
      <div className="mb-6">
        <div className="flex items-center text-sm text-gray-400 mb-2">
          <span>Home</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span>Partidas Ao Vivo</span>
          <ChevronRight className="h-4 w-4 mx-1" />
          <span className="text-furia-purple">{matchData.teams.home.name} vs {matchData.teams.away.name}</span>
        </div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <div className="w-6 h-6 bg-red-500 rounded-full animate-pulse"></div>
          Partida Ao Vivo: {matchData.teams.home.name} vs {matchData.teams.away.name}
        </h1>
        <p className="text-gray-400">
          {matchData.tournament} - {matchData.stage} | {matchData.game}
        </p>
      </div>

      {/* Match header */}
      <div className="bg-gray-800 dark:bg-gray-900 rounded-xl p-6 mb-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <img 
              src={matchData.teams.home.logo} 
              alt={matchData.teams.home.name} 
              className="h-16 w-16"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=FURIA';
              }}
            />
            <div>
              <h2 className="text-2xl font-bold">{matchData.teams.home.name}</h2>
              <p className="text-furia-purple">Home Team</p>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-4xl font-bold">
              <span className={matchData.teams.home.score > matchData.teams.away.score ? 'text-green-500' : ''}>
                {matchData.teams.home.score}
              </span>
              <span className="mx-3">:</span>
              <span className={matchData.teams.away.score > matchData.teams.home.score ? 'text-green-500' : ''}>
                {matchData.teams.away.score}
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                Round {matchData.currentRound}/{matchData.maxRounds}
              </span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-right">
              <h2 className="text-2xl font-bold">{matchData.teams.away.name}</h2>
              <p className="text-gray-400">Away Team</p>
            </div>
            <img 
              src={matchData.teams.away.logo} 
              alt={matchData.teams.away.name} 
              className="h-16 w-16"
              onError={(e) => {
                // Fallback if image fails to load
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/64?text=TEAM';
              }}
            />
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-5 gap-3 text-center">
          {matchData.maps.map((map, index) => (
            <div 
              key={map} 
              className={`py-2 px-4 rounded ${
                map === matchData.currentMap 
                  ? 'bg-furia-purple text-white' 
                  : 'bg-gray-700 text-gray-300'
              }`}
            >
              {map}
              {map === matchData.currentMap && (
                <div className="text-xs mt-1">Current</div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
          <div className="bg-gray-800 dark:bg-gray-900 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-gray-700">
              <h2 className="font-bold flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-furia-purple" />
                Chat da partida
              </h2>
            </div>
            
            <div className="h-[500px] p-4 flex items-center justify-center">
              <div className="text-center">
                <p className="mb-2">Chat disponível para usuários autenticados</p>
                <button 
                  onClick={() => setIsFuriBotOpen(true)}
                  className="bg-furia-purple hover:bg-purple-700 rounded px-4 py-2 mt-4"
                >
                  Abrir FURIBOT
                </button>
              </div>
            </div>
          </div>
        )}
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

export default LiveMatchPage; 