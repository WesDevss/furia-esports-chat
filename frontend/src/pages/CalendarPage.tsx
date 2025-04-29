import React from 'react';

interface MatchEvent {
  id: string;
  homeTeam: string;
  awayTeam: string;
  tournament: string;
  date: Date;
  time: string;
}

const CalendarPage: React.FC = () => {
  // Mock data for upcoming matches
  const upcomingMatches: MatchEvent[] = [
    {
      id: '1',
      homeTeam: 'FURIA',
      awayTeam: 'NAVI',
      tournament: 'ESL Pro League',
      date: new Date(Date.now() + 86400000), // tomorrow
      time: '15:00'
    },
    {
      id: '2',
      homeTeam: 'FURIA',
      awayTeam: 'Team Liquid',
      tournament: 'BLAST Premier',
      date: new Date(Date.now() + 172800000), // day after tomorrow
      time: '18:30'
    },
    {
      id: '3',
      homeTeam: 'FaZe',
      awayTeam: 'FURIA',
      tournament: 'ESL Pro League',
      date: new Date(Date.now() + 345600000), // 4 days from now
      time: '10:00'
    },
    {
      id: '4',
      homeTeam: 'FURIA',
      awayTeam: 'Astralis',
      tournament: 'Major Qualifier',
      date: new Date(Date.now() + 604800000), // 1 week from now
      time: '20:00'
    }
  ];

  // Group matches by date
  const matchesByDate = upcomingMatches.reduce<Record<string, MatchEvent[]>>((acc, match) => {
    const dateStr = match.date.toLocaleDateString();
    if (!acc[dateStr]) {
      acc[dateStr] = [];
    }
    acc[dateStr].push(match);
    return acc;
  }, {});

  return (
    <div className="mx-auto max-w-6xl px-4">
      <h1 className="text-3xl font-bold mb-6">Calendário de Jogos</h1>
      
      <div className="space-y-6">
        {Object.entries(matchesByDate).map(([date, matches]) => (
          <div key={date} className="bg-furia-darker rounded-xl overflow-hidden">
            <div className="bg-furia-dark p-4 border-b border-furia-gray/30">
              <h2 className="text-xl font-semibold">{date}</h2>
            </div>
            
            <div className="divide-y divide-furia-gray/20">
              {matches.map(match => (
                <div key={match.id} className="p-4 hover:bg-furia-gray/10 transition-colors">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-gray-400 text-sm mb-1">{match.tournament}</p>
                      <p className="font-semibold text-lg">
                        {match.homeTeam} vs {match.awayTeam}
                      </p>
                    </div>
                    <div className="text-center">
                      <span className="px-4 py-2 bg-furia-purple/20 text-furia-purple rounded-md">
                        {match.time}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <button className="text-xs bg-furia-purple/20 text-furia-purple px-3 py-1 rounded hover:bg-furia-purple/30 transition-colors">
                      Lembrete
                    </button>
                    <button className="text-xs bg-gray-700/50 text-gray-300 px-3 py-1 rounded hover:bg-gray-700/70 transition-colors">
                      Detalhes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarPage; 