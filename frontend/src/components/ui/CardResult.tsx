import React from 'react';
import Card from './Card';
import { Trophy } from 'lucide-react';

interface Team {
  name: string;
  logo: string;
  score: number;
}

interface CardResultProps {
  homeTeam: Team;
  awayTeam: Team;
  tournament: string;
  matchDate: string;
  onClick?: () => void;
  delay?: number;
}

const CardResult: React.FC<CardResultProps> = ({
  homeTeam,
  awayTeam,
  tournament,
  matchDate,
  onClick,
  delay = 0
}) => {
  // Determinar o vencedor
  const homeWinner = homeTeam.score > awayTeam.score;
  const awayWinner = awayTeam.score > homeTeam.score;
  const draw = homeTeam.score === awayTeam.score;

  return (
    <Card
      variant="result"
      onClick={onClick}
      delay={delay}
    >
      <div className="flex flex-col">
        <div className="text-xs text-gray-400 mb-2 flex items-center justify-between">
          <span>{tournament}</span>
          <span>{matchDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <img src={homeTeam.logo} alt={homeTeam.name} className="w-10 h-10" />
              {homeWinner && (
                <div className="absolute -top-1 -right-1 bg-furia-purple rounded-full p-0.5">
                  <Trophy size={10} className="text-white" />
                </div>
              )}
            </div>
            <div>
              <div className={`font-bold ${homeWinner ? 'text-white' : 'text-gray-400'}`}>
                {homeTeam.name}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className={`text-2xl font-bold ${homeWinner ? 'text-furia-purple' : 'text-white'}`}>
              {homeTeam.score}
            </div>
            <div className="text-gray-500 font-bold">-</div>
            <div className={`text-2xl font-bold ${awayWinner ? 'text-furia-purple' : 'text-white'}`}>
              {awayTeam.score}
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div>
              <div className={`font-bold text-right ${awayWinner ? 'text-white' : 'text-gray-400'}`}>
                {awayTeam.name}
              </div>
            </div>
            <div className="relative">
              <img src={awayTeam.logo} alt={awayTeam.name} className="w-10 h-10" />
              {awayWinner && (
                <div className="absolute -top-1 -right-1 bg-furia-purple rounded-full p-0.5">
                  <Trophy size={10} className="text-white" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CardResult; 