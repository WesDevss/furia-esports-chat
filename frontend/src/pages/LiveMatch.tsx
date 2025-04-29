import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

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

  return (
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <div className="flex justify-between items-center">
          <div className="text-center">
            <img
              src="/furia-logo.png"
              alt="FURIA"
              className="h-20 w-auto mx-auto mb-2"
            />
            <h3 className="text-xl font-bold">FURIA</h3>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-red-500 px-4">VS</div>
            <div className="text-xs uppercase mt-2 text-gray-400">AO VIVO</div>
          </div>
          
          <div className="text-center">
            <div className="h-20 w-20 bg-gray-700 rounded-full mx-auto mb-2 flex items-center justify-center text-xl">
              {match.opponent.substring(0, 1)}
            </div>
            <h3 className="text-xl font-bold">{match.opponent}</h3>
          </div>
        </div>
        
        <div className="mt-6 text-center">
          <span className="bg-red-600 text-white py-1 px-3 rounded-full text-sm">
            {match.tournament}
          </span>
        </div>
      </motion.div>
      
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
                <div className="text-2xl font-bold text-red-500">{map.furiaScore}</div>
                <div className="text-sm">-</div>
                <div className="text-2xl font-bold">{map.opponentScore}</div>
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
            <span className="text-red-500 font-bold">Art</span> fez um clutch 1v3 no round 24!
          </div>
          <div className="bg-gray-700 rounded p-3">
            <span className="text-red-500 font-bold">KSCERATO</span> fez 4 abates no round 18!
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LiveMatch; 