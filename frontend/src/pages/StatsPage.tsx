import React, { useState, useEffect } from 'react';
import { BarChart2, User, ArrowUp, ArrowDown, Filter, Search, ChevronDown, Clock } from 'lucide-react';
import TeamStatsLinks from '../components/TeamStatsLinks';

interface PlayerStats {
  id: string;
  name: string;
  nickname: string;
  avatar: string;
  role: string;
  game: 'CS2' | 'VALORANT' | 'League of Legends' | 'Apex Legends';
  stats: {
    kills: number;
    deaths: number;
    assists: number;
    kd: number;
    adr: number;
    hs: number;
    rating: number;
    maps: number;
    wins: number;
    clutches: number;
  };
  recentPerformance: Array<{
    match: string;
    opponent: string;
    date: string;
    rating: number;
    result: 'win' | 'loss';
  }>;
}

interface TeamStats {
  game: 'CS2' | 'VALORANT' | 'League of Legends' | 'Apex Legends';
  winRate: number;
  totalMatches: number;
  totalWins: number;
  totalLosses: number;
  currentStreak: number;
  streakType: 'win' | 'loss';
  bestMap: string;
  bestMapWinRate: number;
  recentResults: Array<{
    opponent: string;
    result: 'win' | 'loss';
    score: string;
    date: string;
  }>;
}

const StatsPage: React.FC = () => {
  const [activeGame, setActiveGame] = useState<'CS2' | 'VALORANT' | 'League of Legends' | 'Apex Legends'>('CS2');
  const [players, setPlayers] = useState<PlayerStats[]>([]);
  const [teamStats, setTeamStats] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'rating' | 'kd' | 'adr' | 'hs'>('rating');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock player data
        const mockPlayers: PlayerStats[] = [
          {
            id: 'player-1',
            name: 'Gabriel Toledo',
            nickname: 'FalleN',
            avatar: '/avatars/fallen.png',
            role: 'IGL/AWPer',
            game: 'CS2',
            stats: {
              kills: 3254,
              deaths: 3102,
              assists: 521,
              kd: 1.05,
              adr: 72.8,
              hs: 48.2,
              rating: 1.07,
              maps: 267,
              wins: 156,
              clutches: 42
            },
            recentPerformance: [
              { match: 'ESL Pro League', opponent: 'NAVI', date: '2023-09-01', rating: 1.12, result: 'win' },
              { match: 'ESL Pro League', opponent: 'Vitality', date: '2023-08-28', rating: 0.98, result: 'loss' },
              { match: 'ESL Pro League', opponent: 'Astralis', date: '2023-08-25', rating: 1.17, result: 'win' },
            ]
          },
          {
            id: 'player-2',
            name: 'Kaike Cerato',
            nickname: 'KSCERATO',
            avatar: '/avatars/kscerato.png',
            role: 'Rifler',
            game: 'CS2',
            stats: {
              kills: 3870,
              deaths: 2751,
              assists: 615,
              kd: 1.41,
              adr: 85.6,
              hs: 55.3,
              rating: 1.25,
              maps: 267,
              wins: 156, 
              clutches: 65
            },
            recentPerformance: [
              { match: 'ESL Pro League', opponent: 'NAVI', date: '2023-09-01', rating: 1.32, result: 'win' },
              { match: 'ESL Pro League', opponent: 'Vitality', date: '2023-08-28', rating: 1.14, result: 'loss' },
              { match: 'ESL Pro League', opponent: 'Astralis', date: '2023-08-25', rating: 1.28, result: 'win' },
            ]
          },
          {
            id: 'player-3',
            name: 'Yuri Santos',
            nickname: 'yuurih',
            avatar: '/avatars/yuurih.png',
            role: 'Rifler',
            game: 'CS2',
            stats: {
              kills: 3954,
              deaths: 2864,
              assists: 682,
              kd: 1.38,
              adr: 83.7,
              hs: 58.1,
              rating: 1.24,
              maps: 267,
              wins: 156,
              clutches: 51
            },
            recentPerformance: [
              { match: 'ESL Pro League', opponent: 'NAVI', date: '2023-09-01', rating: 1.38, result: 'win' },
              { match: 'ESL Pro League', opponent: 'Vitality', date: '2023-08-28', rating: 1.21, result: 'loss' },
              { match: 'ESL Pro League', opponent: 'Astralis', date: '2023-08-25', rating: 1.34, result: 'win' },
            ]
          },
          {
            id: 'player-4',
            name: 'Danil Golubenko',
            nickname: 'molodoy',
            avatar: '/avatars/molodoy.png',
            role: 'Rifler',
            game: 'CS2',
            stats: {
              kills: 2870,
              deaths: 2728,
              assists: 542,
              kd: 1.05,
              adr: 74.2,
              hs: 49.8,
              rating: 1.09,
              maps: 267,
              wins: 156,
              clutches: 38
            },
            recentPerformance: [
              { match: 'ESL Pro League', opponent: 'NAVI', date: '2023-09-01', rating: 1.15, result: 'win' },
              { match: 'ESL Pro League', opponent: 'Vitality', date: '2023-08-28', rating: 1.02, result: 'loss' },
              { match: 'ESL Pro League', opponent: 'Astralis', date: '2023-08-25', rating: 1.08, result: 'win' },
            ]
          },
          {
            id: 'player-5',
            name: 'Mareks Gaļinskis',
            nickname: 'YEKINDAR',
            avatar: '/avatars/yekindar.png',
            role: 'Entry Fragger',
            game: 'CS2',
            stats: {
              kills: 3120,
              deaths: 2541,
              assists: 401,
              kd: 1.23,
              adr: 77.3,
              hs: 36.4,
              rating: 1.18,
              maps: 267,
              wins: 156,
              clutches: 47
            },
            recentPerformance: [
              { match: 'ESL Pro League', opponent: 'NAVI', date: '2023-09-01', rating: 1.21, result: 'win' },
              { match: 'ESL Pro League', opponent: 'Vitality', date: '2023-08-28', rating: 1.08, result: 'loss' },
              { match: 'ESL Pro League', opponent: 'Astralis', date: '2023-08-25', rating: 1.22, result: 'win' },
            ]
          }
        ];

        // Mock team stats data
        const mockTeamStats: TeamStats = {
          game: 'CS2',
          winRate: 58.4,
          totalMatches: 267,
          totalWins: 156,
          totalLosses: 111,
          currentStreak: 3,
          streakType: 'win',
          bestMap: 'Mirage',
          bestMapWinRate: 73.2,
          recentResults: [
            { opponent: 'NAVI', result: 'win', score: '16-12', date: '2023-09-01' },
            { opponent: 'Vitality', result: 'loss', score: '13-16', date: '2023-08-28' },
            { opponent: 'Astralis', result: 'win', score: '16-9', date: '2023-08-25' },
            { opponent: 'Cloud9', result: 'win', score: '16-10', date: '2023-08-22' },
            { opponent: 'G2', result: 'loss', score: '14-16', date: '2023-08-19' },
          ]
        };

        setPlayers(mockPlayers);
        setTeamStats(mockTeamStats);
        if (mockPlayers.length > 0) {
          setSelectedPlayer(mockPlayers[0].id);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setLoading(false);
      }
    };

    fetchStats();
  }, [activeGame]);

  // Sort players based on selected criteria
  const sortedPlayers = [...players].sort((a, b) => {
    let valueA, valueB;
    
    switch (sortBy) {
      case 'rating':
        valueA = a.stats.rating;
        valueB = b.stats.rating;
        break;
      case 'kd':
        valueA = a.stats.kd;
        valueB = b.stats.kd;
        break;
      case 'adr':
        valueA = a.stats.adr;
        valueB = b.stats.adr;
        break;
      case 'hs':
        valueA = a.stats.hs;
        valueB = b.stats.hs;
        break;
      default:
        valueA = a.stats.rating;
        valueB = b.stats.rating;
    }
    
    return sortDirection === 'desc' ? valueB - valueA : valueA - valueB;
  });

  const handleSort = (criteria: 'rating' | 'kd' | 'adr' | 'hs') => {
    if (criteria === sortBy) {
      // Toggle direction if same criteria
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      // New criteria, set to desc by default
      setSortBy(criteria);
      setSortDirection('desc');
    }
  };

  const selectedPlayerData = players.find(player => player.id === selectedPlayer);

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="text-3xl font-bold mb-6 flex items-center">
        <BarChart2 className="h-8 w-8 text-furia-purple mr-2" />
        Estatísticas FURIA
      </h1>
      <p className="text-gray-400 mb-6">
        Acompanhe o desempenho da equipe e jogadores em tempo real
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
        <div className="lg:col-span-3">
          {/* Game selector */}
          <div className="mb-6">
            <div className="border-b border-gray-700">
              <div className="flex space-x-2">
                {['CS2', 'VALORANT', 'League of Legends', 'Apex Legends'].map((game) => (
                  <button
                    key={game}
                    className={`px-4 py-2 font-medium transition-colors ${
                      activeGame === game 
                        ? 'border-b-2 border-furia-purple text-white' 
                        : 'text-gray-400 hover:text-gray-300'
                    }`}
                    onClick={() => setActiveGame(game as any)}
                  >
                    {game}
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {loading ? (
            <div className="h-64 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-furia-purple"></div>
            </div>
          ) : (
            <>
              {/* Team overview */}
              {teamStats && (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                  <div className="bg-furia-darker p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Win Rate</div>
                    <div className="text-2xl font-bold">{teamStats.winRate}%</div>
                  </div>
                  <div className="bg-furia-darker p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Melhor Mapa</div>
                    <div className="text-2xl font-bold">{teamStats.bestMap}</div>
                    <div className="text-sm text-gray-400">{teamStats.bestMapWinRate}% win rate</div>
                  </div>
                  <div className="bg-furia-darker p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Sequência</div>
                    <div className={`text-2xl font-bold ${teamStats.streakType === 'win' ? 'text-green-500' : 'text-red-500'}`}>
                      {teamStats.currentStreak} {teamStats.streakType === 'win' ? 'Vitórias' : 'Derrotas'}
                    </div>
                  </div>
                  <div className="bg-furia-darker p-4 rounded-lg">
                    <div className="text-gray-400 text-sm mb-1">Partidas</div>
                    <div className="text-2xl font-bold">{teamStats.totalMatches}</div>
                    <div className="text-sm">
                      <span className="text-green-500">{teamStats.totalWins}W</span> / <span className="text-red-500">{teamStats.totalLosses}L</span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Player stats table */}
              <div className="bg-furia-darker rounded-lg mb-8 overflow-hidden">
                <div className="p-4 border-b border-gray-800">
                  <h2 className="text-xl font-bold">Estatísticas de Jogadores</h2>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-900/50 text-gray-400 text-sm">
                        <th className="py-3 px-4 text-left">Jogador</th>
                        <th className="py-3 px-2 text-center cursor-pointer" onClick={() => handleSort('kd')}>
                          <div className="flex items-center justify-center">
                            K/D
                            {sortBy === 'kd' && (
                              <span className="ml-1">
                                {sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="py-3 px-2 text-center cursor-pointer" onClick={() => handleSort('adr')}>
                          <div className="flex items-center justify-center">
                            ADR
                            {sortBy === 'adr' && (
                              <span className="ml-1">
                                {sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="py-3 px-2 text-center cursor-pointer" onClick={() => handleSort('hs')}>
                          <div className="flex items-center justify-center">
                            HS%
                            {sortBy === 'hs' && (
                              <span className="ml-1">
                                {sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="py-3 px-2 text-center cursor-pointer" onClick={() => handleSort('rating')}>
                          <div className="flex items-center justify-center">
                            Rating
                            {sortBy === 'rating' && (
                              <span className="ml-1">
                                {sortDirection === 'desc' ? <ArrowDown size={14} /> : <ArrowUp size={14} />}
                              </span>
                            )}
                          </div>
                        </th>
                        <th className="py-3 px-2 text-center">Ação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedPlayers.map((player) => (
                        <tr key={player.id} className={`border-t border-gray-800 hover:bg-gray-800/30 ${selectedPlayer === player.id ? 'bg-furia-purple/10' : ''}`}>
                          <td className="py-4 px-4">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-gray-700 mr-3 overflow-hidden">
                                <img 
                                  src={player.avatar} 
                                  alt={player.nickname}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.src = `https://via.placeholder.com/32/7A33FF/FFFFFF?text=${player.nickname.charAt(0)}`;
                                  }}
                                />
                              </div>
                              <div>
                                <div className="font-medium">{player.nickname}</div>
                                <div className="text-xs text-gray-400">{player.role}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-2 text-center">{player.stats.kd.toFixed(2)}</td>
                          <td className="py-4 px-2 text-center">{player.stats.adr.toFixed(1)}</td>
                          <td className="py-4 px-2 text-center">{player.stats.hs.toFixed(1)}%</td>
                          <td className="py-4 px-2 text-center font-medium">
                            <span className={
                              player.stats.rating >= 1.15 
                                ? 'text-green-500' 
                                : player.stats.rating >= 0.95 
                                  ? 'text-yellow-500' 
                                  : 'text-red-500'
                            }>
                              {player.stats.rating.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-4 px-2 text-center">
                            <button 
                              onClick={() => setSelectedPlayer(player.id)}
                              className={`px-3 py-1 rounded text-sm ${
                                selectedPlayer === player.id
                                  ? 'bg-furia-purple text-white'
                                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                              }`}
                            >
                              Detalhes
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* Selected player details */}
              {selectedPlayerData && (
                <div className="bg-furia-darker rounded-lg overflow-hidden">
                  <div className="p-4 border-b border-gray-800">
                    <h2 className="text-xl font-bold flex items-center">
                      <User size={20} className="mr-2" />
                      Perfil de {selectedPlayerData.nickname}
                    </h2>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/3 mb-6 md:mb-0">
                        <div className="flex flex-col items-center">
                          <div className="w-32 h-32 rounded-full bg-gray-800 overflow-hidden mb-4">
                            <img 
                              src={selectedPlayerData.avatar}
                              alt={selectedPlayerData.nickname}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `https://via.placeholder.com/128/7A33FF/FFFFFF?text=${selectedPlayerData.nickname.charAt(0)}`;
                              }}
                            />
                          </div>
                          <h3 className="text-xl font-bold">{selectedPlayerData.nickname}</h3>
                          <p className="text-gray-400">{selectedPlayerData.name}</p>
                          <p className="text-sm bg-furia-purple/20 text-furia-purple px-3 py-1 rounded-full mt-2">{selectedPlayerData.role}</p>
                        </div>
                      </div>
                      
                      <div className="md:w-2/3 md:pl-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <div className="text-gray-400 text-xs mb-1">Rating</div>
                            <div className={`text-xl font-bold ${
                              selectedPlayerData.stats.rating >= 1.15 
                                ? 'text-green-500' 
                                : selectedPlayerData.stats.rating >= 0.95 
                                  ? 'text-yellow-500' 
                                  : 'text-red-500'
                            }`}>
                              {selectedPlayerData.stats.rating.toFixed(2)}
                            </div>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <div className="text-gray-400 text-xs mb-1">K/D</div>
                            <div className="text-xl font-bold">{selectedPlayerData.stats.kd.toFixed(2)}</div>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <div className="text-gray-400 text-xs mb-1">ADR</div>
                            <div className="text-xl font-bold">{selectedPlayerData.stats.adr.toFixed(1)}</div>
                          </div>
                          <div className="bg-gray-800/50 p-3 rounded-lg">
                            <div className="text-gray-400 text-xs mb-1">HS%</div>
                            <div className="text-xl font-bold">{selectedPlayerData.stats.hs.toFixed(1)}%</div>
                          </div>
                        </div>
                        
                        <div className="mb-6">
                          <h4 className="text-lg font-medium mb-3">Estatísticas Gerais</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4">
                            <div>
                              <div className="text-sm text-gray-400">Kills</div>
                              <div className="font-medium">{selectedPlayerData.stats.kills}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Deaths</div>
                              <div className="font-medium">{selectedPlayerData.stats.deaths}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Assists</div>
                              <div className="font-medium">{selectedPlayerData.stats.assists}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Maps</div>
                              <div className="font-medium">{selectedPlayerData.stats.maps}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Vitórias</div>
                              <div className="font-medium">{selectedPlayerData.stats.wins}</div>
                            </div>
                            <div>
                              <div className="text-sm text-gray-400">Clutches</div>
                              <div className="font-medium">{selectedPlayerData.stats.clutches}</div>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="text-lg font-medium mb-3 flex items-center">
                            <Clock size={16} className="mr-1" />
                            Performance Recente
                          </h4>
                          <div className="space-y-2">
                            {selectedPlayerData.recentPerformance.map((match, idx) => (
                              <div key={idx} className="flex items-center justify-between bg-gray-800/30 p-3 rounded-lg">
                                <div>
                                  <div className="text-sm">{match.match} vs {match.opponent}</div>
                                  <div className="text-xs text-gray-400">{match.date}</div>
                                </div>
                                <div className={`font-medium ${
                                  match.rating >= 1.15 
                                    ? 'text-green-500' 
                                    : match.rating >= 0.95 
                                      ? 'text-yellow-500' 
                                      : 'text-red-500'
                                }`}>
                                  {match.rating.toFixed(2)}
                                </div>
                                <div className={`text-xs px-2 py-1 rounded-full ${
                                  match.result === 'win' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                                }`}>
                                  {match.result === 'win' ? 'V' : 'D'}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
        <div className="lg:col-span-1">
          <TeamStatsLinks />
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 