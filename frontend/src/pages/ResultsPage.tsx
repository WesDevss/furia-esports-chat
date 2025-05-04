import React from 'react';
import RecentResults from '../components/RecentResults';
import TeamStatsLinks from '../components/TeamStatsLinks';

const ResultsPage: React.FC = () => {
  return (
    <div className="mx-auto max-w-6xl px-4">
      <h1 className="text-3xl font-bold mb-6">Resultados Recentes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentResults showMapDetails={true} />
        </div>
        <div className="lg:col-span-1">
          <TeamStatsLinks />
        </div>
      </div>
    </div>
  );
};

export default ResultsPage; 