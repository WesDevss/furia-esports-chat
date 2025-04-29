import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface User {
  _id: string;
  username: string;
  email: string;
  points: number;
  rank: string;
  joinDate: string;
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulando chamada de API com dados mockados
    setTimeout(() => {
      setUser({
        _id: '1',
        username: 'furia_fan1',
        email: 'fan1@furia.com',
        points: 1500,
        rank: 'Ouro',
        joinDate: '2023-01-15',
      });
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

  if (!user) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold">Usuário não encontrado</h2>
        <p className="mt-4 text-gray-400">Faça login para visualizar seu perfil</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  // Simulando progresso para o próximo rank
  const nextRank = user.rank === 'Ouro' ? 'Platina' : 'Diamante';
  const currentMax = user.rank === 'Ouro' ? 2500 : 5000;
  const progressPercentage = (user.points / currentMax) * 100;

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <div className="md:flex items-start">
          <div className="md:w-1/4 mb-6 md:mb-0 flex justify-center">
            <div className="h-28 w-28 bg-gray-700 rounded-full flex items-center justify-center text-3xl font-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          </div>
          
          <div className="md:w-3/4">
            <h1 className="text-2xl font-bold mb-2">{user.username}</h1>
            <p className="text-gray-400 mb-4">{user.email}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="bg-gray-700 rounded p-3">
                <span className="text-gray-400">Membro desde</span>
                <p className="font-bold">{formatDate(user.joinDate)}</p>
              </div>
              
              <div className="bg-gray-700 rounded p-3">
                <span className="text-gray-400">Pontos</span>
                <p className="font-bold">{user.points.toLocaleString()}</p>
              </div>
            </div>
            
            <div className="bg-gray-700 rounded p-3">
              <div className="flex justify-between mb-1">
                <span className="text-gray-400">Rank</span>
                <span className={`font-bold ${getRankColor(user.rank)}`}>{user.rank}</span>
              </div>
              
              <div className="relative h-4 bg-gray-600 rounded overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-red-600"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between mt-1 text-sm">
                <span>{user.points} pontos</span>
                <span>Próximo: {nextRank} ({currentMax} pontos)</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">Estatísticas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gray-700 rounded p-4 text-center">
            <div className="text-3xl font-bold mb-1">42</div>
            <div className="text-gray-400">Partidas assistidas</div>
          </div>
          
          <div className="bg-gray-700 rounded p-4 text-center">
            <div className="text-3xl font-bold mb-1">156</div>
            <div className="text-gray-400">Mensagens no chat</div>
          </div>
          
          <div className="bg-gray-700 rounded p-4 text-center">
            <div className="text-3xl font-bold mb-1">17</div>
            <div className="text-gray-400">Enquetes respondidas</div>
          </div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-gray-800 rounded-lg p-6"
      >
        <h2 className="text-xl font-bold mb-4">Conquistas</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gray-700 rounded p-3 flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mr-3">
              🔥
            </div>
            <div>
              <h3 className="font-bold">Fã Dedicado</h3>
              <p className="text-sm text-gray-400">Assistiu 10 partidas consecutivas</p>
            </div>
          </div>
          
          <div className="bg-gray-700 rounded p-3 flex items-center">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-3">
              💬
            </div>
            <div>
              <h3 className="font-bold">Comunicador</h3>
              <p className="text-sm text-gray-400">Enviou mais de 100 mensagens</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Profile; 