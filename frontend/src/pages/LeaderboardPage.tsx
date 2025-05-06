import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Search, Filter, MapPin, User, ChevronDown, Crown } from 'lucide-react';

interface RankedUser {
  id: string;
  username: string;
  avatar?: string;
  level: number;
  totalPoints: number;
  region: string;
  country: string;
  rank: number;
  badges: string[];
  joinDate: Date;
  streak: number;
}

const LeaderboardPage: React.FC = () => {
  const [users, setUsers] = useState<RankedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'global' | 'regional' | 'friends'>('global');
  const [region, setRegion] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock data
        const mockUsers: RankedUser[] = [
          {
            id: '1',
            username: 'FuriaFan123',
            level: 23,
            totalPoints: 12580,
            region: 'América do Sul',
            country: 'Brasil',
            rank: 1,
            badges: ['Veterano', 'CS Expert', 'Colecionador'],
            joinDate: new Date(2022, 5, 12),
            streak: 14
          },
          {
            id: '2',
            username: 'CSGOMaster',
            level: 21,
            totalPoints: 11840,
            region: 'América do Sul',
            country: 'Brasil',
            rank: 2,
            badges: ['Preditor', 'CS Expert'],
            joinDate: new Date(2022, 7, 3),
            streak: 7
          },
          {
            id: '3',
            username: 'KSceFã',
            level: 20,
            totalPoints: 10950,
            region: 'América do Sul',
            country: 'Argentina',
            rank: 3,
            badges: ['Analista', 'Socializador'],
            joinDate: new Date(2022, 6, 18),
            streak: 5
          },
          {
            id: '4',
            username: 'FuriaLover',
            level: 19,
            totalPoints: 9845,
            region: 'América do Norte',
            country: 'Estados Unidos',
            rank: 4,
            badges: ['Novo Torcedor', 'Competitivo'],
            joinDate: new Date(2022, 8, 5),
            streak: 3
          },
          {
            id: '5',
            username: 'YuurihFan',
            level: 18,
            totalPoints: 9210,
            region: 'Europa',
            country: 'Portugal',
            rank: 5,
            badges: ['Colecionador', 'Socializador'],
            joinDate: new Date(2022, 9, 14),
            streak: 10
          },
          {
            id: '6',
            username: 'BRzada',
            level: 17,
            totalPoints: 8780,
            region: 'América do Sul',
            country: 'Brasil',
            rank: 6,
            badges: ['CS Expert', 'Analista'],
            joinDate: new Date(2022, 7, 28),
            streak: 4
          },
          {
            id: '7',
            username: 'FuriaArmy',
            level: 16,
            totalPoints: 8150,
            region: 'América do Sul',
            country: 'Brasil',
            rank: 7,
            badges: ['Veterano'],
            joinDate: new Date(2022, 5, 30),
            streak: 0
          },
          {
            id: '8',
            username: 'FalleNMaster',
            level: 15,
            totalPoints: 7890,
            region: 'América do Sul',
            country: 'Chile',
            rank: 8,
            badges: ['Novo Torcedor', 'CS Expert'],
            joinDate: new Date(2022, 10, 5),
            streak: 2
          },
          {
            id: '9',
            username: 'YEKINDARFan',
            level: 14,
            totalPoints: 7340,
            region: 'Europa',
            country: 'Espanha',
            rank: 9,
            badges: ['Socializador'],
            joinDate: new Date(2022, 11, 12),
            streak: 1
          },
          {
            id: '10',
            username: 'CS2Lover',
            level: 13,
            totalPoints: 6980,
            region: 'América do Sul',
            country: 'Uruguai',
            rank: 10,
            badges: ['Colecionador'],
            joinDate: new Date(2023, 0, 8),
            streak: 6
          },
        ];

        setUsers(mockUsers);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching leaderboard:', err);
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  // Filter users based on selected criteria and search query
  const filteredUsers = users.filter(user => {
    let passesFilter = true;
    
    // Filter by region
    if (region !== 'all' && user.region !== region) {
      passesFilter = false;
    }
    
    // Filter by search query
    if (searchQuery && !user.username.toLowerCase().includes(searchQuery.toLowerCase())) {
      passesFilter = false;
    }
    
    return passesFilter;
  });

  // Get unique regions for filter dropdown
  const regions = ['all', ...new Set(users.map(user => user.region))];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-10 w-48 bg-furia-purple/20 rounded mx-auto"></div>
          <p className="text-furia-purple">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="h-8 w-8 text-furia-purple" />
          Ranking de Fãs
        </h1>
        <p className="text-gray-400">
          Descubra quem são os fãs mais dedicados da FURIA por região
        </p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 dark:bg-gray-900 rounded-xl p-6 mb-8">
        <div className="flex flex-wrap gap-4 justify-between">
          <div className="flex gap-4">
            <button
              onClick={() => setFilter('global')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'global'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Global
            </button>
            <button
              onClick={() => setFilter('regional')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'regional'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Por Região
            </button>
            <button
              onClick={() => setFilter('friends')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'friends'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Amigos
            </button>
          </div>
          
          <div className="flex gap-3">
            <div className="relative">
              <select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className="appearance-none pl-10 pr-10 py-2 rounded bg-gray-700 dark:bg-gray-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-furia-purple"
              >
                <option value="all">Todas as Regiões</option>
                {regions.filter(r => r !== 'all').map((r) => (
                  <option key={r} value={r}>{r}</option>
                ))}
              </select>
              <div className="absolute inset-y-0 left-3 flex items-center">
                <MapPin className="h-4 w-4 text-gray-400" />
              </div>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                <ChevronDown className="h-4 w-4 text-gray-400" />
              </div>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar usuário..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 rounded bg-gray-700 dark:bg-gray-800 text-white text-sm focus:outline-none focus:ring-1 focus:ring-furia-purple"
              />
              <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-gray-800 dark:bg-gray-900 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700/30 border-b border-gray-700">
                <th className="text-left py-4 px-6 font-medium">Posição</th>
                <th className="text-left py-4 px-6 font-medium">Usuário</th>
                <th className="text-center py-4 px-6 font-medium">Nível</th>
                <th className="text-center py-4 px-6 font-medium">Pontos</th>
                <th className="text-center py-4 px-6 font-medium">Região</th>
                <th className="text-center py-4 px-6 font-medium">Sequência</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => (
                <tr 
                  key={user.id} 
                  className={`border-b border-gray-700 hover:bg-gray-700/30 ${
                    index === 0 ? 'bg-yellow-500/10' : index === 1 ? 'bg-gray-400/10' : index === 2 ? 'bg-amber-700/10' : ''
                  }`}
                >
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      {index === 0 ? (
                        <div className="w-8 h-8 rounded-full bg-yellow-500 flex items-center justify-center mr-2">
                          <Crown className="h-4 w-4 text-black" />
                        </div>
                      ) : index === 1 ? (
                        <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center mr-2">
                          <Medal className="h-4 w-4 text-black" />
                        </div>
                      ) : index === 2 ? (
                        <div className="w-8 h-8 rounded-full bg-amber-700 flex items-center justify-center mr-2">
                          <Medal className="h-4 w-4 text-black" />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
                          <span className="text-sm font-bold">{user.rank}</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-furia-purple flex items-center justify-center mr-3">
                        <User className="h-5 w-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{user.username}</div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {user.badges.map((badge, i) => (
                            <span 
                              key={i}
                              className="text-xs px-1.5 py-0.5 rounded-full bg-gray-700 text-gray-200"
                            >
                              {badge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-furia-purple/20 text-furia-purple">
                      <span className="text-sm font-medium">Nível {user.level}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center font-bold">
                    {user.totalPoints.toLocaleString()}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <div>
                      <div className="flex items-center justify-center">
                        <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{user.region}</span>
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{user.country}</div>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-center">
                    {user.streak > 0 ? (
                      <div className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400">
                        <span className="text-sm font-medium">{user.streak} dias</span>
                      </div>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">Nenhum usuário encontrado com os filtros atuais.</p>
          </div>
        )}
      </div>

      {/* Your position */}
      <div className="mt-8 bg-furia-purple/10 border border-furia-purple rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-2">
              <span className="text-sm font-bold">24</span>
            </div>
            <div className="ml-2">
              <div className="font-medium">Sua posição</div>
              <div className="text-sm text-gray-400">Top 5% dos fãs</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">5,240 pontos</div>
            <div className="text-sm">Nível 10</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage; 