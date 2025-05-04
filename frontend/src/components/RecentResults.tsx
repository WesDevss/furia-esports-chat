import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Trophy, ArrowRight } from 'lucide-react';

interface MatchResult {
  id: string;
  tournament: string;
  date: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
    score: number;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
    score: number;
  };
  maps: Array<{
    name: string;
    homeScore: number;
    awayScore: number;
  }>;
}

interface RecentResultsProps {
  showMapDetails?: boolean;
}

const RecentResults: React.FC<RecentResultsProps> = ({ showMapDetails = false }) => {
  // Sample match results - in a real app this would come from an API
  const results: MatchResult[] = [
    {
      id: 'match-123',
      tournament: 'ESL Pro League',
      date: '03/05/2025',
      homeTeam: {
        id: 'furia',
        name: 'FURIA',
        logo: '/team-logos/furia-logo.jpeg',
        score: 2
      },
      awayTeam: {
        id: 'navi',
        name: 'NAVI',
        logo: '/team-logos/navi-logo.png',
        score: 0
      },
      maps: [
        { name: 'Inferno', homeScore: 16, awayScore: 12 },
        { name: 'Mirage', homeScore: 16, awayScore: 10 }
      ]
    },
    {
      id: 'match-124',
      tournament: 'BLAST Premier',
      date: '01/05/2025',
      homeTeam: {
        id: 'astralis',
        name: 'Astralis',
        logo: '/team-logos/logo-astralis.jpg',
        score: 1
      },
      awayTeam: {
        id: 'furia',
        name: 'FURIA',
        logo: '/team-logos/furia-logo.jpeg',
        score: 2
      },
      maps: [
        { name: 'Dust2', homeScore: 10, awayScore: 16 },
        { name: 'Nuke', homeScore: 16, awayScore: 11 },
        { name: 'Inferno', homeScore: 8, awayScore: 16 }
      ]
    },
    {
      id: 'match-125',
      tournament: 'ESL Pro League',
      date: '30/04/2025',
      homeTeam: {
        id: 'furia',
        name: 'FURIA',
        logo: '/team-logos/furia-logo.jpeg',
        score: 0
      },
      awayTeam: {
        id: 'liquid',
        name: 'Team Liquid',
        logo: '/team-logos/logo-liquid.jpg',
        score: 2
      },
      maps: [
        { name: 'Vertigo', homeScore: 14, awayScore: 16 },
        { name: 'Ancient', homeScore: 12, awayScore: 16 }
      ]
    }
  ];

  return (
    <div className="bg-furia-darker rounded-xl overflow-hidden border border-gray-800">
      <div className="divide-y divide-gray-800">
        {results.map((match) => (
          <div key={match.id} className={`${showMapDetails ? 'p-4' : 'p-3'}`}>
            {/* Tournament & Date */}
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center text-xs text-gray-400">
                <Trophy size={12} className="mr-1 text-furia-purple" />
                <span>{match.tournament}</span>
              </div>
              <div className="flex items-center text-xs text-gray-400">
                <Calendar size={12} className="mr-1" />
                <span>{match.date}</span>
              </div>
            </div>

            {/* Teams & Score */}
            <div className="flex items-center justify-between mb-2">
              {/* Home Team */}
              <div className="flex items-center">
                <div className="relative w-8 h-8 flex-shrink-0">
                  <img
                    src={match.homeTeam.logo}
                    alt={match.homeTeam.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/32?text=${match.homeTeam.name.charAt(0)}`;
                    }}
                  />
                  {match.homeTeam.name === 'FURIA' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-furia-purple rounded-full flex items-center justify-center text-[6px] font-bold shadow-lg">
                      BR
                    </div>
                  )}
                </div>
                <span className={`ml-2 text-sm font-medium ${match.homeTeam.name === 'FURIA' ? 'text-furia-purple' : ''}`}>
                  {match.homeTeam.name}
                </span>
              </div>

              {/* Score */}
              <div className="flex items-center mx-2 text-lg font-bold">
                <span className={match.homeTeam.score > match.awayTeam.score ? 'text-green-500' : ''}>
                  {match.homeTeam.score}
                </span>
                <span className="mx-1 text-gray-600">:</span>
                <span className={match.awayTeam.score > match.homeTeam.score ? 'text-green-500' : ''}>
                  {match.awayTeam.score}
                </span>
              </div>

              {/* Away Team */}
              <div className="flex items-center">
                <span className={`mr-2 text-sm font-medium ${match.awayTeam.name === 'FURIA' ? 'text-furia-purple' : ''}`}>
                  {match.awayTeam.name}
                </span>
                <div className="relative w-8 h-8 flex-shrink-0">
                  <img
                    src={match.awayTeam.logo}
                    alt={match.awayTeam.name}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = `https://via.placeholder.com/32?text=${match.awayTeam.name.charAt(0)}`;
                    }}
                  />
                  {match.awayTeam.name === 'FURIA' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-furia-purple rounded-full flex items-center justify-center text-[6px] font-bold shadow-lg">
                      BR
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Map Results (conditionally shown) */}
            {showMapDetails && (
              <div className="grid grid-cols-2 gap-2 mb-3 mt-3">
                {match.maps.map((map, index) => (
                  <div key={index} className="flex justify-between items-center p-2 bg-gray-800/50 rounded text-sm">
                    <span>{map.name}</span>
                    <div className="flex items-center">
                      <span className={map.homeScore > map.awayScore ? 'text-green-500 font-medium' : ''}>
                        {map.homeScore}
                      </span>
                      <span className="mx-1">:</span>
                      <span className={map.awayScore > map.homeScore ? 'text-green-500 font-medium' : ''}>
                        {map.awayScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* View Match Details */}
            <Link
              to={`/match/${match.id}`}
              className="inline-flex items-center text-xs text-furia-purple hover:text-furia-purple/80 transition-colors"
            >
              Ver detalhes
              <ArrowRight size={10} className="ml-1" />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentResults; 