import React, { useState } from 'react';

interface UserProfile {
  id: string;
  username: string;
  email: string;
  joinDate: Date;
  points: number;
  rank: string;
  avatar: string;
  badges: Badge[];
  activity: ActivityItem[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  progress?: number;
}

interface ActivityItem {
  id: string;
  type: 'message' | 'vote' | 'reaction' | 'badge';
  content: string;
  timestamp: Date;
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'badges' | 'activity' | 'settings'>('overview');
  
  // Mock user profile data
  const userProfile: UserProfile = {
    id: '1',
    username: 'FuriaFan123',
    email: 'furiafan@example.com',
    joinDate: new Date(2022, 5, 15),
    points: 1250,
    rank: 'Ouro',
    avatar: 'https://via.placeholder.com/100',
    badges: [
      {
        id: '1',
        name: 'Fã da FURIA',
        description: 'Participou de 10 chats durante jogos ao vivo',
        icon: '🏆',
        unlocked: true
      },
      {
        id: '2',
        name: 'Comunicador',
        description: 'Enviou 100 mensagens no chat',
        icon: '💬',
        unlocked: true
      },
      {
        id: '3',
        name: 'Sábio de CS',
        description: 'Completou o quiz com 100% de acertos',
        icon: '🧠',
        unlocked: false,
        progress: 80
      },
      {
        id: '4',
        name: 'Eleitor',
        description: 'Participou de 20 enquetes',
        icon: '🗳️',
        unlocked: false,
        progress: 60
      }
    ],
    activity: [
      {
        id: '1',
        type: 'message',
        content: 'Enviou uma mensagem durante FURIA vs NAVI',
        timestamp: new Date(Date.now() - 86400000) // 1 day ago
      },
      {
        id: '2',
        type: 'vote',
        content: 'Votou na enquete "Quem vai ser o MVP da partida?"',
        timestamp: new Date(Date.now() - 259200000) // 3 days ago
      },
      {
        id: '3',
        type: 'badge',
        content: 'Desbloqueou a conquista "Comunicador"',
        timestamp: new Date(Date.now() - 345600000) // 4 days ago
      },
      {
        id: '4',
        type: 'reaction',
        content: 'Reagiu a uma mensagem de arT',
        timestamp: new Date(Date.now() - 604800000) // 7 days ago
      }
    ]
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      {/* Profile header */}
      <div className="bg-furia-darker rounded-xl overflow-hidden mb-6">
        <div className="h-32 bg-gradient-to-r from-furia-purple to-blue-900"></div>
        <div className="relative px-6 pb-6">
          <div className="flex flex-col md:flex-row md:items-end">
            <div className="-mt-16 mb-4 md:mb-0">
              <img 
                src={userProfile.avatar} 
                alt={userProfile.username} 
                className="w-32 h-32 rounded-full border-4 border-furia-black"
              />
            </div>
            <div className="md:ml-6 md:flex-1">
              <h1 className="text-2xl font-bold">{userProfile.username}</h1>
              <p className="text-gray-400 mt-1">Membro desde {userProfile.joinDate.toLocaleDateString()}</p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center">
              <div className="bg-furia-black/50 px-4 py-2 rounded-l-md">
                <span className="text-gray-400 text-sm">Pontos</span>
                <p className="font-bold">{userProfile.points}</p>
              </div>
              <div className="bg-furia-purple/30 px-4 py-2 rounded-r-md">
                <span className="text-gray-400 text-sm">Rank</span>
                <p className="font-bold">{userProfile.rank}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex border-b border-furia-gray/30 mb-6">
        {[
          { id: 'overview', label: 'Visão Geral' },
          { id: 'badges', label: 'Conquistas' },
          { id: 'activity', label: 'Atividade' },
          { id: 'settings', label: 'Configurações' }
        ].map(tab => (
          <button
            key={tab.id}
            className={`px-4 py-3 font-medium ${
              activeTab === tab.id
                ? 'text-furia-purple border-b-2 border-furia-purple'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab(tab.id as any)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      {/* Tab content */}
      <div className="mb-8">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-furia-darker rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Progresso do Rank</h2>
              <div className="mb-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>{userProfile.rank}</span>
                  <span>Platina</span>
                </div>
                <div className="w-full bg-furia-black/50 rounded-full h-2.5">
                  <div 
                    className="bg-gradient-to-r from-furia-purple to-blue-500 h-2.5 rounded-full" 
                    style={{ width: '50%' }}
                  ></div>
                </div>
                <p className="text-gray-400 text-sm mt-2">
                  Faltam 1.250 pontos para o próximo rank
                </p>
              </div>
              <h3 className="font-medium mb-2">Como ganhar pontos:</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Participe dos chats durante as partidas</li>
                <li>• Complete os quizzes com boas pontuações</li>
                <li>• Desbloqueie conquistas</li>
                <li>• Participe de enquetes</li>
              </ul>
            </div>
            
            <div className="bg-furia-darker rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Últimas Conquistas</h2>
              <div className="space-y-4">
                {userProfile.badges
                  .filter(badge => badge.unlocked)
                  .slice(0, 3)
                  .map(badge => (
                    <div key={badge.id} className="flex items-center">
                      <div className="w-10 h-10 bg-furia-purple/20 rounded-full flex items-center justify-center text-xl">
                        {badge.icon}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{badge.name}</h3>
                        <p className="text-sm text-gray-400">{badge.description}</p>
                      </div>
                    </div>
                  ))}
              </div>
              <button 
                className="w-full mt-4 text-furia-purple font-medium hover:underline"
                onClick={() => setActiveTab('badges')}
              >
                Ver todas as conquistas
              </button>
            </div>
          </div>
        )}
        
        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userProfile.badges.map(badge => (
              <div 
                key={badge.id}
                className={`bg-furia-darker rounded-xl p-5 border ${
                  badge.unlocked 
                    ? 'border-furia-purple/50' 
                    : 'border-furia-gray/30 opacity-75'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl ${
                    badge.unlocked 
                      ? 'bg-furia-purple/20' 
                      : 'bg-furia-gray/20'
                  }`}>
                    {badge.icon}
                  </div>
                  <div className="ml-4 flex-1">
                    <h3 className="font-medium">{badge.name}</h3>
                    <p className="text-sm text-gray-400">{badge.description}</p>
                    
                    {!badge.unlocked && badge.progress !== undefined && (
                      <div className="mt-2">
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-gray-400">{badge.progress}% completo</span>
                        </div>
                        <div className="w-full bg-furia-black/50 rounded-full h-1.5">
                          <div 
                            className="bg-furia-purple/50 h-1.5 rounded-full" 
                            style={{ width: `${badge.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {badge.unlocked && (
                    <div className="bg-furia-purple/20 p-1 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-furia-purple" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {activeTab === 'activity' && (
          <div className="bg-furia-darker rounded-xl overflow-hidden">
            <div className="divide-y divide-furia-gray/20">
              {userProfile.activity.map(item => (
                <div key={item.id} className="p-4 hover:bg-furia-dark transition-colors">
                  <div className="flex items-start">
                    <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${
                      item.type === 'message' ? 'bg-blue-500/20' :
                      item.type === 'vote' ? 'bg-green-500/20' :
                      item.type === 'badge' ? 'bg-purple-500/20' :
                      'bg-yellow-500/20'
                    }`}>
                      {item.type === 'message' ? '💬' :
                       item.type === 'vote' ? '🗳️' :
                       item.type === 'badge' ? '🏆' :
                       '👍'}
                    </div>
                    <div className="ml-3 flex-1">
                      <p>{item.content}</p>
                      <span className="text-sm text-gray-400">
                        {new Date(item.timestamp).toLocaleDateString()} às {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {activeTab === 'settings' && (
          <div className="bg-furia-darker rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-4">Configurações da Conta</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Nome de Usuário</label>
                <input 
                  type="text"
                  value={userProfile.username}
                  className="w-full bg-furia-black border border-furia-gray/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-furia-purple/50 focus:border-transparent"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input 
                  type="email"
                  value={userProfile.email}
                  className="w-full bg-furia-black border border-furia-gray/30 rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-furia-purple/50 focus:border-transparent"
                  readOnly
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Senha</label>
                <button className="bg-furia-purple/20 text-furia-purple px-4 py-2 rounded-md hover:bg-furia-purple/30 transition-colors">
                  Alterar senha
                </button>
              </div>
              
              <div className="pt-4 border-t border-furia-gray/30">
                <h3 className="font-medium mb-3">Notificações</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>Notificações de partidas</span>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input type="checkbox" id="toggle-1" className="sr-only" defaultChecked />
                      <label htmlFor="toggle-1" className="block h-6 rounded-full bg-furia-gray/30 cursor-pointer"></label>
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Notificações de chat</span>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input type="checkbox" id="toggle-2" className="sr-only" />
                      <label htmlFor="toggle-2" className="block h-6 rounded-full bg-furia-gray/30 cursor-pointer"></label>
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform"></span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span>Emails promocionais</span>
                    <div className="relative inline-block w-10 align-middle select-none">
                      <input type="checkbox" id="toggle-3" className="sr-only" defaultChecked />
                      <label htmlFor="toggle-3" className="block h-6 rounded-full bg-furia-gray/30 cursor-pointer"></label>
                      <span className="absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform duration-200 transform translate-x-4"></span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <button className="bg-furia-purple text-white px-6 py-2 rounded-md font-medium hover:bg-furia-purple/90 transition-colors">
                  Salvar Alterações
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfilePage; 