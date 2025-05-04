import React from 'react';
import { ExternalLink } from 'lucide-react';

interface StatLink {
  game: string;
  url: string;
  emoji: string;
  bgColor: string;
}

const TeamStatsLinks: React.FC = () => {
  const statsLinks: StatLink[] = [
    {
      game: 'CS2',
      url: 'https://draft5.gg/equipe/330-FURIA',
      emoji: '🔫',
      bgColor: 'bg-[#1e2327]'
    },
    {
      game: 'VALORANT',
      url: 'https://www.vlr.gg/team/2406/furia',
      emoji: '🎯',
      bgColor: 'bg-[#fa4454]/10'
    },
    {
      game: 'Rainbow Six',
      url: 'https://siege.gg/teams/285-furia-esports',
      emoji: '🛡️',
      bgColor: 'bg-[#2b74b8]/10'
    },
    {
      game: 'Apex Legends',
      url: 'https://liquipedia.net/apexlegends/FURIA',
      emoji: '🏆',
      bgColor: 'bg-[#da292a]/10'
    }
  ];

  return (
    <div className="bg-furia-darker rounded-xl overflow-hidden border border-gray-800">
      <div className="bg-furia-purple/20 p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold">Estatísticas Completas</h2>
      </div>
      <div className="grid grid-cols-2 gap-2 p-4">
        {statsLinks.map((link) => (
          <a 
            key={link.game}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`${link.bgColor} hover:bg-furia-purple/20 p-3 rounded-lg flex items-center justify-between transition-all`}
          >
            <div className="flex items-center">
              <span className="font-medium">{link.emoji} {link.game}</span>
            </div>
            <ExternalLink size={16} className="text-furia-purple" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default TeamStatsLinks; 