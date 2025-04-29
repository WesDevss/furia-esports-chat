import React from 'react';

interface MatchResult {
  id: string;
  homeTeam: {
    name: string;
    score: number;
    logo: string;
  };
  awayTeam: {
    name: string;
    score: number;
    logo: string;
  };
  tournament: string;
  date: Date;
  maps?: {
    name: string;
    homeScore: number;
    awayScore: number;
  }[];
}

const ResultsPage: React.FC = () => {
  // Mock data for recent match results
  const recentResults: MatchResult[] = [
    {
      id: '1',
      homeTeam: {
        name: 'FURIA',
        score: 2,
        logo: '/furia-logo.jpeg'
      },
      awayTeam: {
        name: 'NAVI',
        score: 0,
        logo: 'https://via.placeholder.com/40'
      },
      tournament: 'ESL Pro League',
      date: new Date(Date.now() - 86400000), // yesterday
      maps: [
        { name: 'Inferno', homeScore: 16, awayScore: 12 },
        { name: 'Mirage', homeScore: 16, awayScore: 10 }
      ]
    },
    {
      id: '2',
      homeTeam: {
        name: 'Astralis',
        score: 1,
        logo: 'https://via.placeholder.com/40'
      },
      awayTeam: {
        name: 'FURIA',
        score: 2,
        logo: '/furia-logo.jpeg'
      },
      tournament: 'BLAST Premier',
      date: new Date(Date.now() - 259200000), // 3 days ago
      maps: [
        { name: 'Dust2', homeScore: 10, awayScore: 16 },
        { name: 'Nuke', homeScore: 16, awayScore: 11 },
        { name: 'Inferno', homeScore: 8, awayScore: 16 }
      ]
    },
    {
      id: '3',
      homeTeam: {
        name: 'FURIA',
        score: 0,
        logo: '/furia-logo.jpeg'
      },
      awayTeam: {
        name: 'Team Liquid',
        score: 2,
        logo: 'https://via.placeholder.com/40'
      },
      tournament: 'ESL Pro League',
      date: new Date(Date.now() - 345600000), // 4 days ago
      maps: [
        { name: 'Vertigo', homeScore: 14, awayScore: 16 },
        { name: 'Ancient', homeScore: 12, awayScore: 16 }
      ]
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <h1 className="text-3xl font-bold mb-6">Resultados Recentes</h1>
      
      <div className="space-y-6">
        {recentResults.map(match => (
          <div key={match.id} className="bg-furia-darker rounded-xl overflow-hidden">
            <div className="bg-furia-dark p-4 border-b border-furia-gray/30 flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {match.tournament}
              </h2>
              <span className="text-sm text-gray-400">
                {match.date.toLocaleDateString()}
              </span>
            </div>
            
            <div className="p-5">
              {/* Match result header */}
              <div className="flex justify-between items-center mb-5">
                <div className="flex items-center">
                  <img 
                    src={match.homeTeam.logo} 
                    alt={match.homeTeam.name} 
                    className="w-10 h-10 object-contain"
                  />
                  <span className="ml-3 font-bold text-xl">{match.homeTeam.name}</span>
                </div>
                
                <div className="text-center px-4">
                  <div className="text-2xl font-bold">
                    <span className={match.homeTeam.score > match.awayTeam.score ? "text-furia-purple" : ""}>
                      {match.homeTeam.score}
                    </span>
                    <span className="mx-2">:</span>
                    <span className={match.awayTeam.score > match.homeTeam.score ? "text-furia-purple" : ""}>
                      {match.awayTeam.score}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-end">
                  <span className="mr-3 font-bold text-xl">{match.awayTeam.name}</span>
                  <img 
                    src={match.awayTeam.logo} 
                    alt={match.awayTeam.name} 
                    className="w-10 h-10 object-contain"
                  />
                </div>
              </div>
              
              {/* Map results */}
              {match.maps && (
                <div className="bg-furia-black/40 rounded-lg p-3 space-y-2">
                  {match.maps.map((map, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <span className="text-gray-400">{map.name}</span>
                      <div>
                        <span className={map.homeScore > map.awayScore ? "text-furia-purple font-medium" : ""}>
                          {map.homeScore}
                        </span>
                        <span className="mx-2 text-sm">:</span>
                        <span className={map.awayScore > map.homeScore ? "text-furia-purple font-medium" : ""}>
                          {map.awayScore}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* View full match button */}
              <div className="mt-4 text-center">
                <button className="text-sm bg-furia-purple/20 text-furia-purple px-4 py-2 rounded hover:bg-furia-purple/30 transition-colors">
                  Ver detalhes da partida
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage; 