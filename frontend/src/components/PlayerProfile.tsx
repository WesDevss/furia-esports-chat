import React from 'react';
import { Link } from 'react-router-dom';

interface PlayerProfileProps {
  name: string;
  nickname: string;
  role: string;
  image?: string;
  stats: {
    label: string;
    value: string;
  }[];
}

const PlayerProfile: React.FC<PlayerProfileProps> = ({
  name,
  nickname,
  role,
  image,
  stats
}) => {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden p-4">
      <div className="flex flex-col">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-bold">Perfil de Jogador</h2>
          <Link to="/players" className="text-furia-purple text-sm hover:underline">
            Ver todos
          </Link>
        </div>

        <div className="flex">
          <div className="w-1/3 pr-4">
            <div className="rounded-lg overflow-hidden border border-furia-purple">
              <img 
                src={image || `/players/${nickname.toLowerCase()}.jpg`} 
                alt={nickname}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "https://via.placeholder.com/150?text=" + nickname;
                }}
              />
            </div>
            <div className="text-center mt-1">
              <span className="text-furia-purple text-sm">{role}</span>
            </div>
          </div>
          
          <div className="w-2/3">
            <h3 className="text-xl font-bold">{nickname}</h3>
            <p className="text-gray-400 text-sm mb-4">{name}</p>
            
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className="w-8 h-8 rounded-full bg-furia-purple/20 flex items-center justify-center mb-1">
                    <div className="w-2 h-2 rounded-full bg-furia-purple"></div>
                  </div>
                  <span className="text-gray-400 text-xs">{stat.label}</span>
                  <span className="font-bold text-white">{stat.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfile; 