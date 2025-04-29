import React from 'react';
import Card from './Card';
import { Trophy, Target, Award } from 'lucide-react';

interface Stat {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
}

interface CardPlayerProps {
  name: string;
  nickname: string;
  role: string;
  image: string;
  stats: Stat[];
  onClick?: () => void;
  delay?: number;
}

const CardPlayer: React.FC<CardPlayerProps> = ({
  name,
  nickname,
  role,
  image,
  stats,
  onClick,
  delay = 0
}) => {
  return (
    <Card
      variant="player"
      onClick={onClick}
      delay={delay}
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4">
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-furia-purple/50">
          <img 
            src={image} 
            alt={nickname} 
            className="w-full h-full object-cover" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-furia-black/80 to-transparent"></div>
          <div className="absolute bottom-1 left-0 right-0 text-center">
            <span className="text-xs font-medium text-furia-purple">{role}</span>
          </div>
        </div>
        
        <div className="flex-1">
          <div className="text-center sm:text-left mb-3">
            <h3 className="text-xl font-bold">{nickname}</h3>
            <p className="text-sm text-gray-400">{name}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-2">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center bg-furia-darker p-2 rounded-lg">
                <div className="mr-2 text-furia-purple">
                  {stat.icon || <Target size={14} />}
                </div>
                <div>
                  <div className="text-xs text-gray-400">{stat.label}</div>
                  <div className="text-sm font-bold">{stat.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardPlayer; 