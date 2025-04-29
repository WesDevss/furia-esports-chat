import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface User {
  _id: string;
  username: string;
  points: number;
  rank: string;
}

const Leaderboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando chamada de API com dados mockados
    setTimeout(() => {
      setUsers([
        { _id: '3', username: 'admin', points: 5000, rank: 'Diamante' },
        { _id: '2', username: 'furia_fan2', points: 2500, rank: 'Platina' },
        { _id: '1', username: 'furia_fan1', points: 1500, rank: 'Ouro' },
        { _id: '4', username: 'gamer123', points: 800, rank: 'Prata' },
        { _id: '5', username: 'novato', points: 250, rank: 'Bronze' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getRankColor = (rank: string) => {
    switch (rank) {
      case 'Bronze': return 'text-amber-700';
      case 'Prata': return 'text-gray-400';
      case 'Ouro': return 'text-yellow-500';
      case 'Platina': return 'text-cyan-300';
      case 'Diamante': return 'text-blue-400';
      case 'Mestre': return 'text-purple-400';
      case 'Grão-Mestre': return 'text-red-500';
      default: return 'text-white';
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h1 className="text-3xl font-bold mb-2">Ranking de Fãs</h1>
        <p className="text-gray-400">Os fãs mais engajados da FURIA!</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-gray-800 rounded-lg overflow-hidden"
      >
        <div className="grid grid-cols-12 bg-gray-700 p-4 font-bold">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-5">Usuário</div>
          <div className="col-span-3 text-center">Pontos</div>
          <div className="col-span-3 text-center">Rank</div>
        </div>

        {users.map((user, index) => (
          <motion.div
            key={user._id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
            className={`grid grid-cols-12 p-4 ${
              index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'
            } items-center`}
          >
            <div className="col-span-1 text-center font-bold">
              {index + 1}
            </div>
            <div className="col-span-5">
              <div className="font-semibold">{user.username}</div>
            </div>
            <div className="col-span-3 text-center">{user.points.toLocaleString()}</div>
            <div className={`col-span-3 text-center font-bold ${getRankColor(user.rank)}`}>
              {user.rank}
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">Como subir no ranking?</h2>
        <ul className="space-y-2 text-gray-300">
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span>Participe ativamente no chat durante as partidas</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span>Vote nas enquetes e participe das atividades</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span>Assista às partidas ao vivo e interaja com outros fãs</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-500 mr-2">•</span>
            <span>Compartilhe conteúdo relevante para a comunidade</span>
          </li>
        </ul>
      </motion.div>
    </div>
  );
};

export default Leaderboard; 