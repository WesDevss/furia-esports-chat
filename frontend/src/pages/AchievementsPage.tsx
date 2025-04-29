import React, { useState, useEffect } from 'react';
import { Trophy, Medal, Star, Crown, Award, Shield, Gift, Flag, Target, Bookmark, Clock, MessageCircle } from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  reward: number;
  category: 'Participation' | 'Fan' | 'Competitive' | 'Social' | 'Special';
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  unlockedAt?: Date;
  progress?: {
    current: number;
    total: number;
  };
}

interface Badge {
  id: string;
  name: string;
  icon: React.ReactNode;
  rarity: 'Common' | 'Uncommon' | 'Rare' | 'Epic' | 'Legendary';
  description: string;
  unlockedAt?: Date;
}

const AchievementsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'achievements' | 'badges'>('achievements');
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800));

        // Mock achievements data
        const mockAchievements: Achievement[] = [
          {
            id: 'ach1',
            title: 'Primeiros Passos',
            description: 'Complete seu perfil com foto e informações',
            icon: <Flag className="h-6 w-6 text-blue-400" />,
            reward: 50,
            category: 'Participation',
            rarity: 'Common',
            unlockedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'ach2',
            title: 'Conversador',
            description: 'Envie 100 mensagens no chat durante partidas ao vivo',
            icon: <MessageCircle className="h-6 w-6 text-green-400" />,
            reward: 200,
            category: 'Social',
            rarity: 'Uncommon',
            progress: {
              current: 73,
              total: 100
            }
          },
          {
            id: 'ach3',
            title: 'Super Fã',
            description: 'Assista 50 partidas da FURIA',
            icon: <Star className="h-6 w-6 text-yellow-400" />,
            reward: 500,
            category: 'Fan',
            rarity: 'Rare',
            progress: {
              current: 42,
              total: 50
            }
          },
          {
            id: 'ach4',
            title: 'Estatístico',
            description: 'Acerte 10 previsões de resultado em partidas',
            icon: <Target className="h-6 w-6 text-red-400" />,
            reward: 300,
            category: 'Competitive',
            rarity: 'Uncommon',
            progress: {
              current: 7,
              total: 10
            }
          },
          {
            id: 'ach5',
            title: 'Colecionador de Troféus',
            description: 'Desbloqueie 15 conquistas diferentes',
            icon: <Trophy className="h-6 w-6 text-purple-400" />,
            reward: 750,
            category: 'Special',
            rarity: 'Epic',
            progress: {
              current: 4,
              total: 15
            }
          },
          {
            id: 'ach6',
            title: 'Veterano CS',
            description: 'Assista 25 partidas de CS da FURIA',
            icon: <Shield className="h-6 w-6 text-blue-500" />,
            reward: 350,
            category: 'Fan',
            rarity: 'Uncommon',
            progress: {
              current: 25,
              total: 25
            },
            unlockedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'ach7',
            title: 'Interativo',
            description: 'Participe de 5 enquetes durante partidas ao vivo',
            icon: <Gift className="h-6 w-6 text-pink-500" />,
            reward: 150,
            category: 'Participation',
            rarity: 'Common',
            unlockedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'ach8',
            title: 'Fã Lendário',
            description: 'Complete todas as conquistas da categoria Fã',
            icon: <Crown className="h-6 w-6 text-yellow-500" />,
            reward: 1000,
            category: 'Fan',
            rarity: 'Legendary',
            progress: {
              current: 2,
              total: 5
            }
          },
        ];

        // Mock badges data
        const mockBadges: Badge[] = [
          {
            id: 'badge1',
            name: 'CS Expert',
            icon: <Shield className="h-6 w-6" />,
            rarity: 'Uncommon',
            description: 'Conhecedor profundo de CS2',
            unlockedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'badge2',
            name: 'Novo Torcedor',
            icon: <Star className="h-6 w-6" />,
            rarity: 'Common',
            description: 'Novato na comunidade FURIA',
            unlockedAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'badge3',
            name: 'Analista',
            icon: <Target className="h-6 w-6" />,
            rarity: 'Rare',
            description: 'Bom em previsões e estatísticas',
            unlockedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000),
          },
          {
            id: 'badge4',
            name: 'Torcedor Premium',
            icon: <Crown className="h-6 w-6" />,
            rarity: 'Epic',
            description: 'Assinante do plano premium FURIA',
          },
          {
            id: 'badge5',
            name: 'Socializador',
            icon: <MessageCircle className="h-6 w-6" />,
            rarity: 'Uncommon',
            description: 'Ativo nas conversas da comunidade',
          },
          {
            id: 'badge6',
            name: 'Colecionador',
            icon: <Bookmark className="h-6 w-6" />,
            rarity: 'Rare',
            description: 'Coleciona itens e conquistas FURIA',
          },
          {
            id: 'badge7',
            name: 'Primeiro a Chegar',
            icon: <Flag className="h-6 w-6" />,
            rarity: 'Legendary',
            description: 'Um dos primeiros membros da comunidade',
            unlockedAt: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000),
          },
        ];

        setAchievements(mockAchievements);
        setBadges(mockBadges);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching achievements:', err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter achievements based on selected criteria
  const filteredAchievements = achievements.filter((achievement) => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return !!achievement.unlockedAt;
    if (filter === 'locked') return !achievement.unlockedAt;
    return achievement.category.toLowerCase() === filter.toLowerCase();
  });

  // Filter badges based on unlocked status
  const filteredBadges = badges.filter((badge) => {
    if (filter === 'all') return true;
    if (filter === 'unlocked') return !!badge.unlockedAt;
    if (filter === 'locked') return !badge.unlockedAt;
    return true;
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse space-y-4 text-center">
          <div className="h-10 w-48 bg-furia-purple/20 rounded mx-auto"></div>
          <p className="text-furia-purple">Carregando conquistas...</p>
        </div>
      </div>
    );
  }

  const rarityColors = {
    Common: 'bg-gray-500',
    Uncommon: 'bg-green-500',
    Rare: 'bg-blue-500',
    Epic: 'bg-purple-500',
    Legendary: 'bg-yellow-500',
  };

  return (
    <div className="max-w-7xl mx-auto px-4">
      <div className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Trophy className="h-8 w-8 text-furia-purple" />
          Conquistas e Badges
        </h1>
        <p className="text-gray-400">
          Acompanhe seu progresso e conquistas como fã da FURIA
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-700">
          <div className="flex -mb-px">
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'achievements'
                  ? 'border-furia-purple text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('achievements')}
            >
              Conquistas
            </button>
            <button
              className={`py-3 px-6 font-medium text-sm border-b-2 ${
                activeTab === 'badges'
                  ? 'border-furia-purple text-white'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
              onClick={() => setActiveTab('badges')}
            >
              Badges
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'all'
              ? 'bg-furia-purple text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Todos
        </button>
        <button
          onClick={() => setFilter('unlocked')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'unlocked'
              ? 'bg-furia-purple text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Desbloqueados
        </button>
        <button
          onClick={() => setFilter('locked')}
          className={`px-4 py-2 rounded-full text-sm ${
            filter === 'locked'
              ? 'bg-furia-purple text-white'
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Bloqueados
        </button>
        
        {activeTab === 'achievements' && (
          <>
            <button
              onClick={() => setFilter('Participation')}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === 'Participation'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Participação
            </button>
            <button
              onClick={() => setFilter('Fan')}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === 'Fan'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Fã
            </button>
            <button
              onClick={() => setFilter('Competitive')}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === 'Competitive'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Competitivo
            </button>
            <button
              onClick={() => setFilter('Social')}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === 'Social'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Social
            </button>
            <button
              onClick={() => setFilter('Special')}
              className={`px-4 py-2 rounded-full text-sm ${
                filter === 'Special'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Especial
            </button>
          </>
        )}
      </div>

      {/* Achievements Tab Content */}
      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAchievements.map((achievement) => (
            <div 
              key={achievement.id} 
              className={`bg-gray-800 dark:bg-gray-900 rounded-xl p-5 border ${
                achievement.unlockedAt ? 'border-furia-purple' : 'border-gray-700'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${rarityColors[achievement.rarity]} bg-opacity-20`}>
                  {achievement.icon}
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold">{achievement.title}</h3>
                    <div className={`text-xs px-2 py-0.5 rounded-full ${rarityColors[achievement.rarity]} bg-opacity-20`}>
                      {achievement.rarity}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-400 mt-1">{achievement.description}</p>
                  
                  {achievement.unlockedAt ? (
                    <div className="mt-3 flex items-center text-xs text-green-400">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Desbloqueado em {achievement.unlockedAt.toLocaleDateString()}</span>
                    </div>
                  ) : achievement.progress ? (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs mb-1">
                        <span>Progresso</span>
                        <span>{achievement.progress.current}/{achievement.progress.total}</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-1.5">
                        <div 
                          className="bg-furia-purple h-1.5 rounded-full" 
                          style={{ width: `${(achievement.progress.current / achievement.progress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ) : null}
                  
                  <div className="mt-3 text-sm">
                    <span className="text-furia-purple">+{achievement.reward} XP</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {filteredAchievements.length === 0 && (
            <div className="col-span-full text-center py-10">
              <Award className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhuma conquista encontrada para o filtro selecionado.</p>
            </div>
          )}
        </div>
      )}

      {/* Badges Tab Content */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBadges.map((badge) => (
            <div 
              key={badge.id} 
              className={`bg-gray-800 dark:bg-gray-900 rounded-xl p-5 text-center ${
                badge.unlockedAt ? '' : 'opacity-60'
              }`}
            >
              <div 
                className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center ${
                  badge.unlockedAt 
                    ? `${rarityColors[badge.rarity]}`
                    : 'bg-gray-700'
                }`}
              >
                {React.cloneElement(badge.icon as React.ReactElement, {
                  className: `h-8 w-8 ${badge.unlockedAt ? 'text-white' : 'text-gray-500'}`,
                })}
              </div>
              
              <h3 className="font-bold mt-3">{badge.name}</h3>
              
              <div className={`text-xs px-2 py-0.5 rounded-full mx-auto my-2 inline-block ${
                badge.unlockedAt ? rarityColors[badge.rarity] : 'bg-gray-700'
              } bg-opacity-20`}>
                {badge.rarity}
              </div>
              
              <p className="text-sm text-gray-400 mt-1">{badge.description}</p>
              
              {badge.unlockedAt ? (
                <div className="mt-3 flex items-center justify-center text-xs text-green-400">
                  <Clock className="h-3 w-3 mr-1" />
                  <span>Desbloqueado em {badge.unlockedAt.toLocaleDateString()}</span>
                </div>
              ) : (
                <div className="mt-3 text-xs text-gray-500">
                  Não desbloqueado
                </div>
              )}
            </div>
          ))}
          
          {filteredBadges.length === 0 && (
            <div className="col-span-full text-center py-10">
              <Award className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">Nenhum badge encontrado para o filtro selecionado.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AchievementsPage; 