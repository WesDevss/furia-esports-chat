import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import MatchChat from '../components/MatchChat';
import LiveMatchScoreDisplay from '../components/LiveMatchScoreDisplay';
import { Clock, Users, BarChart3, TrendingUp, Shield, Swords, Award, MessageSquare, Eye, Bell } from 'lucide-react';

interface MapData {
  name: string;
  isCurrent: boolean;
}

const MatchOverview: React.FC = () => {
  const { matchId } = useParams<{ matchId: string }>();
  const [highlights, setHighlights] = useState(0);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [activeTab, setActiveTab] = useState('players');
  
  // Sample match data - in a real app this would come from an API
  const matchData = {
    id: matchId || 'match-123',
    homeTeam: {
      name: 'FURIA',
      logo: '/team-logos/furia-logo.jpeg',
      score: 12
    },
    awayTeam: {
      name: 'NAVI',
      logo: '/team-logos/navi-logo.png',
      score: 10
    },
    tournament: 'ESL Pro League Season 17',
    stage: 'Playoffs - Quarter Finals',
    game: 'CS2',
    currentRound: 23,
    maxRounds: 30,
    maps: [
      { name: 'Inferno', isCurrent: false },
      { name: 'Mirage', isCurrent: true },
      { name: 'Nuke', isCurrent: false }
    ],
    startTime: new Date(Date.now() - 1000 * 60 * 45) // Started 45 minutes ago
  };

  const currentMap = matchData.maps.find(map => map.isCurrent)?.name || '';
  
  // Simulate new highlights
  useEffect(() => {
    const highlightInterval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% chance of a highlight
        setHighlights(prev => prev + 1);
        
        // If notifications are enabled, show a browser notification
        if (notificationsEnabled && "Notification" in window && Notification.permission === "granted") {
          new Notification("Nova jogada destacada!", {
            body: "FURIA fez uma jogada incrível! Confira no chat.",
            icon: "/team-logos/furia-logo.jpeg"
          });
        }
      }
    }, 30000); // Check for new highlights every 30 seconds
    
    return () => clearInterval(highlightInterval);
  }, [notificationsEnabled]);
  
  // Request notification permission
  const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          setNotificationsEnabled(true);
        }
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Match score and details */}
      <LiveMatchScoreDisplay 
        homeTeam={matchData.homeTeam}
        awayTeam={matchData.awayTeam}
        tournament={matchData.tournament}
        stage={matchData.stage}
        game={matchData.game}
        currentRound={matchData.currentRound}
        maxRounds={matchData.maxRounds}
        currentMap={currentMap}
        isLive={true}
        startTime={matchData.startTime}
        highlights={highlights}
      />

      {/* Notification permission button */}
      {!notificationsEnabled && (
        <div className="mt-4 bg-gray-800 p-3 rounded-lg flex items-center justify-between">
          <div className="flex items-center">
            <Bell size={18} className="text-furia-purple mr-2" />
            <span>Receba notificações sobre jogadas importantes</span>
          </div>
          <button 
            onClick={requestNotificationPermission}
            className="bg-furia-purple px-3 py-1.5 rounded text-sm hover:bg-furia-purple/80 transition-colors"
          >
            Ativar Notificações
          </button>
        </div>
      )}

      {/* Game details section with chat */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
        {/* Left column - Player stats */}
        <div className="md:col-span-7">
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
            {/* Tabs for different stats sections */}
            <div className="grid grid-cols-3 border-b border-gray-800">
              <button 
                onClick={() => setActiveTab('players')}
                className={`flex items-center justify-center p-3 ${
                  activeTab === 'players' 
                    ? 'bg-furia-purple text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors'
                }`}
              >
                <Users size={16} className="mr-2" />
                <span>Jogadores</span>
              </button>
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex items-center justify-center p-3 ${
                  activeTab === 'stats' 
                    ? 'bg-furia-purple text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors'
                }`}
              >
                <BarChart3 size={16} className="mr-2" />
                <span>Estatísticas</span>
              </button>
              <button 
                onClick={() => setActiveTab('history')}
                className={`flex items-center justify-center p-3 ${
                  activeTab === 'history' 
                    ? 'bg-furia-purple text-white' 
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors'
                }`}
              >
                <TrendingUp size={16} className="mr-2" />
                <span>Histórico</span>
              </button>
            </div>
            
            <div className="p-6">
              {activeTab === 'players' && (
                <>
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Shield size={20} className="mr-2 text-furia-purple" />
                    Estatísticas de Jogadores
                  </h2>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-800">
                          <th className="text-left py-2">Jogador</th>
                          <th className="text-center py-2">K</th>
                          <th className="text-center py-2">D</th>
                          <th className="text-center py-2">A</th>
                          <th className="text-center py-2">ADR</th>
                          <th className="text-center py-2">Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-furia-purple mr-2"></div>
                              <span className="font-medium">yuurih</span>
                            </div>
                          </td>
                          <td className="text-center py-3">22</td>
                          <td className="text-center py-3">15</td>
                          <td className="text-center py-3">8</td>
                          <td className="text-center py-3">104.5</td>
                          <td className="text-center py-3 text-green-500 font-medium">1.38</td>
                        </tr>
                        <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-furia-purple mr-2"></div>
                              <span className="font-medium">KSCERATO</span>
                            </div>
                          </td>
                          <td className="text-center py-3">19</td>
                          <td className="text-center py-3">14</td>
                          <td className="text-center py-3">6</td>
                          <td className="text-center py-3">94.3</td>
                          <td className="text-center py-3 text-green-500 font-medium">1.26</td>
                        </tr>
                        <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-red-500 mr-2"></div>
                              <span className="font-medium">s1mple</span>
                            </div>
                          </td>
                          <td className="text-center py-3">20</td>
                          <td className="text-center py-3">16</td>
                          <td className="text-center py-3">4</td>
                          <td className="text-center py-3">91.7</td>
                          <td className="text-center py-3 text-green-500 font-medium">1.22</td>
                        </tr>
                        <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-furia-purple mr-2"></div>
                              <span className="font-medium">FalleN</span>
                            </div>
                          </td>
                          <td className="text-center py-3">17</td>
                          <td className="text-center py-3">12</td>
                          <td className="text-center py-3">7</td>
                          <td className="text-center py-3">85.2</td>
                          <td className="text-center py-3 text-green-500 font-medium">1.18</td>
                        </tr>
                        <tr className="border-b border-gray-800 hover:bg-gray-800/50">
                          <td className="py-3">
                            <div className="flex items-center">
                              <div className="w-2 h-2 rounded-full bg-furia-purple mr-2"></div>
                              <span className="font-medium">art</span>
                            </div>
                          </td>
                          <td className="text-center py-3">15</td>
                          <td className="text-center py-3">14</td>
                          <td className="text-center py-3">6</td>
                          <td className="text-center py-3">78.9</td>
                          <td className="text-center py-3 text-yellow-500 font-medium">1.04</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </>
              )}
              
              {activeTab === 'stats' && (
                <>
                  <h2 className="text-xl font-bold mb-6 flex items-center">
                    <BarChart3 size={20} className="mr-2 text-furia-purple" />
                    Estatísticas Gerais
                  </h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">FURIA</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Porcentagem de HS</span>
                            <span className="font-medium">48%</span>
                          </div>
                          <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="bg-furia-purple h-2 rounded-full" style={{ width: '48%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sucesso em Retakes</span>
                            <span className="font-medium">62%</span>
                          </div>
                          <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="bg-furia-purple h-2 rounded-full" style={{ width: '62%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Converção Numérica</span>
                            <span className="font-medium">73%</span>
                          </div>
                          <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="bg-furia-purple h-2 rounded-full" style={{ width: '73%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-800 p-4 rounded-lg">
                      <h3 className="text-lg font-medium mb-3">NAVI</h3>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Porcentagem de HS</span>
                            <span className="font-medium">45%</span>
                          </div>
                          <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Sucesso em Retakes</span>
                            <span className="font-medium">58%</span>
                          </div>
                          <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '58%' }}></div>
                          </div>
                        </div>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Converção Numérica</span>
                            <span className="font-medium">68%</span>
                          </div>
                          <div className="w-full bg-gray-700 h-2 rounded-full">
                            <div className="bg-red-500 h-2 rounded-full" style={{ width: '68%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
              
              {activeTab === 'history' && (
                <>
                  {/* Round history section */}
                  <h2 className="text-xl font-bold mb-4 flex items-center">
                    <Swords size={20} className="mr-2 text-furia-purple" />
                    Últimos Rounds
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center p-3 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-furia-purple rounded-full mr-2"></div>
                      <span className="text-sm">Round 22: FURIA vence (T)</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-furia-purple rounded-full mr-2"></div>
                      <span className="text-sm">Round 21: FURIA vence (T)</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm">Round 20: NAVI vence (CT)</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-furia-purple rounded-full mr-2"></div>
                      <span className="text-sm">Round 19: FURIA vence (T)</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
                      <span className="text-sm">Round 18: NAVI vence (CT)</span>
                    </div>
                    <div className="flex items-center p-3 bg-gray-800 rounded">
                      <div className="w-2 h-2 bg-furia-purple rounded-full mr-2"></div>
                      <span className="text-sm">Round 17: FURIA vence (T)</span>
                    </div>
                  </div>
                  
                  {/* Highlights section */}
                  <h2 className="text-xl font-bold mb-4 mt-8 flex items-center">
                    <Award size={20} className="mr-2 text-furia-purple" />
                    Destaques
                  </h2>
                  <div className="space-y-3">
                    <div className="p-3 bg-furia-purple/20 rounded border border-furia-purple/30">
                      <div className="font-medium mb-1">yuurih clutch 1v2!</div>
                      <div className="text-sm text-gray-400">Round 21</div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded">
                      <div className="font-medium mb-1">s1mple AWP quad kill</div>
                      <div className="text-sm text-gray-400">Round 18</div>
                    </div>
                    <div className="p-3 bg-gray-800 rounded">
                      <div className="font-medium mb-1">KSCERATO triple headshot</div>
                      <div className="text-sm text-gray-400">Round 16</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Team comparison */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 mt-6 p-6">
            <h2 className="text-xl font-bold mb-6">Comparação de Equipes</h2>
            
            <div className="space-y-6">
              {/* Economy */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Economia</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-2 text-furia-purple">$42,500</span>
                    <span>vs</span>
                    <span className="font-bold ml-2">$38,750</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-furia-purple h-full rounded-full" style={{ width: '52%' }}></div>
                </div>
              </div>
              
              {/* Win percentage */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Win Percentage</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-2 text-furia-purple">58%</span>
                    <span>vs</span>
                    <span className="font-bold ml-2">42%</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-furia-purple h-full rounded-full" style={{ width: '58%' }}></div>
                </div>
              </div>
              
              {/* Team rating */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Team Rating</span>
                  <div className="flex items-center">
                    <span className="font-bold mr-2 text-furia-purple">1.18</span>
                    <span>vs</span>
                    <span className="font-bold ml-2">1.14</span>
                  </div>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-furia-purple h-full rounded-full" style={{ width: '51%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right column - Chat */}
        <div className="md:col-span-5">
          {/* Viewing info */}
          <div className="bg-gray-900 p-3 rounded-lg border border-gray-800 mb-4 flex items-center">
            <Eye size={18} className="text-furia-purple mr-2 flex-shrink-0" />
            <div className="flex-1">
              <div className="text-sm font-medium">{Math.floor(Math.random() * 50000 + 85000).toLocaleString()} espectadores</div>
              <div className="text-xs text-gray-400">{Math.floor(Math.random() * 5000 + 25000).toLocaleString()} mensagens enviadas</div>
            </div>
            <div className="flex-shrink-0 flex items-center gap-2">
              <button className="flex items-center text-xs bg-gray-800 hover:bg-gray-700 px-2 py-1 rounded transition-colors">
                <MessageSquare size={12} className="mr-1" />
                Chat
              </button>
            </div>
          </div>
        
          <MatchChat matchId={matchData.id} height="740px" />
          
          {/* Poll widget */}
          <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 mt-6">
            <div className="bg-furia-purple/20 p-3 border-b border-gray-800">
              <h2 className="text-lg font-bold">Votação da Partida</h2>
              <p className="text-sm text-gray-400">Qual time vai vencer o mapa atual?</p>
            </div>
            
            <div className="p-4 space-y-4">
              {/* FURIA option */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">FURIA</span>
                  <span className="text-furia-purple">78%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-furia-purple h-full rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              
              {/* NAVI option */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="font-medium">NAVI</span>
                  <span className="text-red-500">22%</span>
                </div>
                <div className="w-full bg-gray-800 h-2 rounded-full overflow-hidden">
                  <div className="bg-red-500 h-full rounded-full" style={{ width: '22%' }}></div>
                </div>
              </div>
              
              <div className="text-sm text-gray-400 mt-2">
                1,523 votos • Encerramento em 5 minutos
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchOverview; 