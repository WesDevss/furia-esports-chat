import React, { useState, useEffect } from 'react';
import { BarChart2, User, ArrowUp, ArrowDown, Filter, Search, ChevronDown, Clock } from 'lucide-react';

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
            name: 'Andrei Piovezan',
            nickname: 'arT',
            avatar: '/avatars/art.png',
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
            name: 'André Abreu',
            nickname: 'drop',
            avatar: '/avatars/drop.png',
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
            name: 'Rafael Costa',
            nickname: 'saffee',
            avatar: '/avatars/saffee.png',
            role: 'AWPer',
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

  // Get selected player details
  const playerDetails = players.find(p => p.id === selectedPlayer);

  // Toggle sort direction
  const handleSort = (criteria: 'rating' | 'kd' | 'adr' | 'hs') => {
    if (sortBy === criteria) {
      setSortDirection(sortDirection === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(criteria);
      setSortDirection('desc');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-10 w-48 bg-furia-purple/20 rounded mx-auto"></div>
          <p className="text-furia-purple">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <BarChart2 className="h-8 w-8 text-furia-purple" />
          Estatísticas da FURIA
        </h1>
        <p className="text-gray-400">
          Acompanhe o desempenho da equipe e jogadores em tempo real
        </p>
      </div>

      {/* Game selection tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-700">
          <div className="flex -mb-px">
            {(['CS2', 'VALORANT', 'League of Legends', 'Apex Legends'] as const).map((game) => (
              <button
                key={game}
                className={`py-3 px-6 font-medium text-sm border-b-2 ${
                  activeGame === game
                    ? 'border-furia-purple text-white'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveGame(game)}
              >
                {game}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Stats content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Team stats panel */}
        <div className="bg-gray-800 dark:bg-gray-900 rounded-xl p-6">
          <h2 className="text-xl font-bold mb-4">Estatísticas da Equipe</h2>
          
          {teamStats && (
            <>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-400 mb-1">Win Rate</p>
                  <p className="text-2xl font-bold text-furia-purple">{teamStats.winRate}%</p>
                </div>
                <div className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-400 mb-1">
                    {teamStats.streakType === 'win' ? 'Win Streak' : 'Loss Streak'}
                  </p>
                  <p className="text-2xl font-bold text-furia-purple">{teamStats.currentStreak}</p>
                </div>
                <div className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-400 mb-1">Melhor Mapa</p>
                  <p className="text-xl font-bold">{teamStats.bestMap}</p>
                  <p className="text-sm text-furia-purple">{teamStats.bestMapWinRate}% win</p>
                </div>
                <div className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg text-center">
                  <p className="text-xs text-gray-400 mb-1">Total Partidas</p>
                  <p className="text-xl font-bold">{teamStats.totalMatches}</p>
                  <p className="text-sm">
                    <span className="text-green-500">{teamStats.totalWins}W</span>
                    {' / '}
                    <span className="text-red-500">{teamStats.totalLosses}L</span>
                  </p>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-3">Resultados Recentes</h3>
              <div className="space-y-2">
                {teamStats.recentResults.map((result, index) => (
                  <div 
                    key={index} 
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      result.result === 'win' ? 'bg-green-900/20' : 'bg-red-900/20'
                    }`}
                  >
                    <div className="flex items-center">
                      <div className={`w-2 h-8 rounded-sm mr-3 ${
                        result.result === 'win' ? 'bg-green-500' : 'bg-red-500'
                      }`}></div>
                      <div>
                        <p className="font-medium">FURIA vs {result.opponent}</p>
                        <div className="flex items-center text-xs text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>{result.date}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold ${
                        result.result === 'win' ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.score}
                      </p>
                      <p className="text-xs text-gray-400">
                        {result.result === 'win' ? 'Vitória' : 'Derrota'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Players panel */}
        <div className="lg:col-span-2">
          <div className="bg-gray-800 dark:bg-gray-900 rounded-xl overflow-hidden">
            <div className="p-6 border-b border-gray-700">
              <div className="flex justify-between items-center flex-wrap gap-3">
                <h2 className="text-xl font-bold">Jogadores</h2>
                <div className="flex space-x-2">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-3 flex items-center">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      placeholder="Buscar jogador..."
                      className="pl-10 pr-4 py-2 rounded bg-gray-700 dark:bg-gray-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-furia-purple"
                    />
                  </div>
                  <button className="flex items-center gap-1 px-3 py-2 bg-gray-700 dark:bg-gray-800 rounded text-sm">
                    <Filter className="h-4 w-4" />
                    <span>Filtros</span>
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-700/30 border-b border-gray-700">
                    <th className="text-left py-3 px-4">Jogador</th>
                    <th className="text-center py-3 px-4">Maps</th>
                    <th className="text-center py-3 px-4">
                      <button 
                        onClick={() => handleSort('kd')}
                        className="flex items-center justify-center w-full"
                      >
                        K/D
                        {sortBy === 'kd' && (
                          sortDirection === 'desc' 
                            ? <ArrowDown className="h-3 w-3 ml-1" /> 
                            : <ArrowUp className="h-3 w-3 ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="text-center py-3 px-4">
                      <button 
                        onClick={() => handleSort('adr')}
                        className="flex items-center justify-center w-full"
                      >
                        ADR
                        {sortBy === 'adr' && (
                          sortDirection === 'desc' 
                            ? <ArrowDown className="h-3 w-3 ml-1" /> 
                            : <ArrowUp className="h-3 w-3 ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="text-center py-3 px-4">
                      <button 
                        onClick={() => handleSort('hs')}
                        className="flex items-center justify-center w-full"
                      >
                        HS%
                        {sortBy === 'hs' && (
                          sortDirection === 'desc' 
                            ? <ArrowDown className="h-3 w-3 ml-1" /> 
                            : <ArrowUp className="h-3 w-3 ml-1" />
                        )}
                      </button>
                    </th>
                    <th className="text-center py-3 px-4">
                      <button 
                        onClick={() => handleSort('rating')}
                        className="flex items-center justify-center w-full"
                      >
                        Rating
                        {sortBy === 'rating' && (
                          sortDirection === 'desc' 
                            ? <ArrowDown className="h-3 w-3 ml-1" /> 
                            : <ArrowUp className="h-3 w-3 ml-1" />
                        )}
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedPlayers.map((player) => (
                    <tr 
                      key={player.id} 
                      className={`border-b border-gray-700 hover:bg-gray-700/30 cursor-pointer ${
                        player.id === selectedPlayer ? 'bg-furia-purple/10' : ''
                      }`}
                      onClick={() => setSelectedPlayer(player.id)}
                    >
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                            <User className="h-5 w-5 text-gray-400" />
                          </div>
                          <div>
                            <div className="font-medium text-furia-purple">
                              {player.nickname}
                            </div>
                            <div className="text-xs text-gray-400">{player.role}</div>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">{player.stats.maps}</td>
                      <td className="text-center py-3 px-4">{player.stats.kd.toFixed(2)}</td>
                      <td className="text-center py-3 px-4">{player.stats.adr.toFixed(1)}</td>
                      <td className="text-center py-3 px-4">{player.stats.hs}%</td>
                      <td className="text-center py-3 px-4 font-medium">
                        <span className={
                          player.stats.rating >= 1.2 
                            ? 'text-green-500' 
                            : player.stats.rating >= 1.0 
                            ? 'text-yellow-500' 
                            : 'text-red-500'
                        }>
                          {player.stats.rating.toFixed(2)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Selected player detailed stats */}
            {playerDetails && (
              <div className="p-6 border-t border-gray-700">
                <h3 className="text-lg font-bold mb-4">Estatísticas Detalhadas - {playerDetails.nickname}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  <div className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-400 mb-1">K/D/A</h4>
                    <p className="text-xl font-bold">
                      {playerDetails.stats.kills.toLocaleString()} / {playerDetails.stats.deaths.toLocaleString()} / {playerDetails.stats.assists.toLocaleString()}
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="inline-block bg-gray-600 rounded px-2 py-0.5 mr-2">
                        {(playerDetails.stats.kills/playerDetails.stats.maps).toFixed(1)} kills/map
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-400 mb-1">Win Rate</h4>
                    <p className="text-xl font-bold">
                      {((playerDetails.stats.wins / playerDetails.stats.maps) * 100).toFixed(1)}%
                    </p>
                    <div className="mt-2 text-sm">
                      <span className="inline-block bg-gray-600 rounded px-2 py-0.5 mr-2">
                        {playerDetails.stats.wins}W / {playerDetails.stats.maps - playerDetails.stats.wins}L
                      </span>
                    </div>
                  </div>
                  
                  <div className="bg-gray-700 dark:bg-gray-800 p-4 rounded-lg">
                    <h4 className="text-sm text-gray-400 mb-1">Clutches</h4>
                    <p className="text-xl font-bold">{playerDetails.stats.clutches}</p>
                    <div className="mt-2 text-sm">
                      <span className="inline-block bg-gray-600 rounded px-2 py-0.5">
                        {(playerDetails.stats.clutches/playerDetails.stats.maps).toFixed(2)} por mapa
                      </span>
                    </div>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium mb-3">Performance Recente</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {playerDetails.recentPerformance.map((match, index) => (
                    <div 
                      key={index} 
                      className={`p-3 rounded-lg ${
                        match.result === 'win' ? 'bg-green-900/20' : 'bg-red-900/20'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium">vs {match.opponent}</p>
                          <p className="text-xs text-gray-400">{match.date}</p>
                        </div>
                        <span className={`text-sm font-bold ${
                          match.result === 'win' ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {match.result.toUpperCase()}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-300">{match.match}</span>
                        <span className={`text-sm font-bold ${
                          match.rating >= 1.2 ? 'text-green-400' : match.rating >= 1.0 ? 'text-yellow-400' : 'text-red-400'
                        }`}>
                          {match.rating.toFixed(2)} rating
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsPage; 