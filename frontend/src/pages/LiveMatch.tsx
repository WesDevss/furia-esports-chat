import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import LiveMatchScoreDisplay from '../components/LiveMatchScoreDisplay';

interface Map {
  name: string;
  furiaScore: number;
  opponentScore: number;
}

interface Match {
  _id: string;
  opponent: string;
  tournament: string;
  status: 'scheduled' | 'live' | 'completed';
  maps: Map[];
}

const LiveMatch: React.FC = () => {
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando chamada de API com dados mockados
    setTimeout(() => {
      setMatch({
        _id: '1',
        opponent: 'NAVI',
        tournament: 'Major Rio 2023',
        status: 'live',
        maps: [
          { name: 'Inferno', furiaScore: 13, opponentScore: 10 },
          { name: 'Nuke', furiaScore: 7, opponentScore: 9 }
        ]
      });
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!match) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Nenhuma partida ao vivo no momento</h2>
        <p className="mt-4 text-gray-400">Volte mais tarde para acompanhar os jogos da FURIA</p>
      </div>
    );
  }

  // Calculate the total score based on maps
  const totalFuriaScore = match.maps.filter(map => map.furiaScore > map.opponentScore).length;
  const totalOpponentScore = match.maps.filter(map => map.opponentScore > map.furiaScore).length;

  // Get the current map (where the match is being played)
  const currentMapIndex = match.maps.findIndex(map => 
    map.furiaScore < 16 && map.opponentScore < 16
  );
  const currentMap = currentMapIndex !== -1 ? match.maps[currentMapIndex].name : null;

  return (
    <div className="space-y-8">
      <LiveMatchScoreDisplay 
        homeTeam={{
          name: 'FURIA',
          logo: '/team-logos/furia-logo.jpeg',
          score: totalFuriaScore
        }}
        awayTeam={{
          name: match.opponent,
          logo: `/team-logos/${match.opponent.toLowerCase()}-logo.png`,
          score: totalOpponentScore
        }}
        tournament={match.tournament}
        stage="Playoffs - Quarter Finals"
        game="CS2"
        currentMap={currentMap || undefined}
        isLive={match.status === 'live'}
      />
      
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Mapas</h2>
        
        {match.maps.map((map, index) => (
          <motion.div
            key={map.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-gray-800 rounded-lg p-4"
          >
            <div className="flex justify-between items-center">
              <div className="flex-1">
                <h3 className="font-bold">{map.name}</h3>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className={`text-2xl font-bold ${map.furiaScore > map.opponentScore ? 'text-green-500' : ''}`}>
                  {map.furiaScore}
                </div>
                <div className="text-sm">-</div>
                <div className={`text-2xl font-bold ${map.opponentScore > map.furiaScore ? 'text-green-500' : ''}`}>
                  {map.opponentScore}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-800 rounded-lg p-4 text-center"
        >
          <h3 className="text-lg font-bold mb-2">Estatísticas da Partida</h3>
          <p className="text-gray-400">
            Estatísticas detalhadas em breve...
          </p>
        </motion.div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">Destaques</h2>
        <div className="space-y-3">
          <div className="bg-gray-700 rounded p-3">
            <span className="text-red-500 font-bold">FalleN</span> fez um clutch 1v3 no round 24!
          </div>
          <div className="bg-gray-700 rounded p-3">
            <span className="text-red-500 font-bold">molodoy</span> fez 4 abates no round 18!
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveMatch; 