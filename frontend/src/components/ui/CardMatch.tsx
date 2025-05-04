import React from 'react';
import Card from './Card';
import { Calendar, Clock } from 'lucide-react';

interface Team {
  name: string;
  logo: string;
}

interface CardMatchProps {
  homeTeam: Team;
  awayTeam: Team;
  matchTime: string;
  matchDate: string;
  tournament: string;
  isLive?: boolean;
  onClick?: () => void;
  delay?: number;
}

const CardMatch: React.FC<CardMatchProps> = ({
  homeTeam,
  awayTeam,
  matchTime,
  matchDate,
  tournament,
  isLive = false,
  onClick,
  delay = 0
}) => {
  return (
    <Card
      variant="match"
      className={`${isLive ? 'border-red-500 border' : ''}`}
      onClick={onClick}
      delay={delay}
    >
      {isLive && (
        <div className="flex items-center mb-3 bg-red-600/20 px-3 py-1 rounded-lg w-fit">
          <span className="h-2 w-2 bg-red-600 rounded-full mr-2 animate-pulse"></span>
          <span className="text-red-500 text-sm font-medium">AO VIVO</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 relative">
            <img 
              src={homeTeam.logo || '/team-logos/furia-logo.jpeg'} 
              alt={homeTeam.name} 
              className="w-full h-full object-contain" 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/team-logos/furia-logo.jpeg';
              }}
            />
          </div>
          <span className="font-bold text-sm mt-2">{homeTeam.name}</span>
        </div>

        <div className="flex flex-col items-center">
          <span className="text-2xl font-bold my-1">VS</span>
          <span className="text-furia-purple text-xs uppercase font-medium">{tournament}</span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-20 h-20 relative">
            <img 
              src={awayTeam.logo} 
              alt={awayTeam.name} 
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = '/team-logos/furia-logo.jpeg';
              }}
            />
          </div>
          <span className="font-bold text-sm mt-2">{awayTeam.name}</span>
        </div>
      </div>

      <div className="flex items-center justify-center space-x-4 text-sm text-gray-300">
        <div className="flex items-center">
          <Calendar size={14} className="mr-1 text-furia-purple" />
          <span>{matchDate}</span>
        </div>
        <div className="flex items-center">
          <Clock size={14} className="mr-1 text-furia-purple" />
          <span>{matchTime}</span>
        </div>
      </div>
    </Card>
  );
};

export default CardMatch; 