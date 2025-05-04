import React from 'react';
import { Link } from 'react-router-dom';

interface PlayerProfileCardProps {
  name: string;
  nickname: string;
  role?: string;
  image?: string;
  stats: {
    label: string;
    value: string;
  }[];
}

const PlayerProfileCard: React.FC<PlayerProfileCardProps> = ({
  name,
  nickname,
  role = 'Rifler',
  image,
  stats
}) => {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden px-4 py-3">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-medium">Perfil de Jogador</h2>
        <Link to="/players" className="text-furia-purple text-xs hover:underline">
          Ver todos
        </Link>
      </div>

      <div className="flex items-start">
        {/* Player image */}
        <div className="w-2/5 pr-3">
          <div className="rounded-lg overflow-hidden border-2 border-furia-purple/70 shadow-md">
            <img 
              src={image || `/players/${nickname.toLowerCase()}.jpg`} 
              alt={nickname}
              className="w-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "https://via.placeholder.com/150?text=" + nickname;
              }}
            />
          </div>
          <div className="text-center mt-2">
            <span className="bg-furia-purple/20 rounded-md px-2 py-0.5 text-furia-purple text-xs font-medium">{role}</span>
          </div>
        </div>
        
        <div className="w-3/5">
          <h3 className="text-xl font-bold mb-0.5">{nickname}</h3>
          <p className="text-gray-400 text-xs">{name}</p>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 mt-3">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center">
                <div className="w-5 h-5 rounded-full bg-furia-purple/20 flex items-center justify-center mr-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-furia-purple"></div>
                </div>
                <div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                  <div className="font-bold text-sm">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfileCard; 