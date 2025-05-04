import React from 'react';
import { ExternalLink } from 'lucide-react';

interface StatLink {
  game: string;
  url: string;
  icon: string;
  bgColor: string;
  iconFallbackColor: string;
}

const TeamStatsLinks: React.FC = () => {
  const statsLinks: StatLink[] = [
    {
      game: 'CS2',
      url: 'https://draft5.gg/equipe/330-FURIA',
      icon: '/game-icons/cs2.png',
      bgColor: 'bg-[#1e2327]',
      iconFallbackColor: '#1e2327'
    },
    {
      game: 'VALORANT',
      url: 'https://www.vlr.gg/team/2406/furia',
      icon: '/game-icons/valorant.png',
      bgColor: 'bg-[#fa4454]/10',
      iconFallbackColor: '#fa4454'
    },
    {
      game: 'Rainbow Six',
      url: 'https://siege.gg/teams/568-furia',
      icon: '/game-icons/rainbow6.png',
      bgColor: 'bg-[#2b74b8]/10',
      iconFallbackColor: '#2b74b8'
    },
    {
      game: 'Apex Legends',
      url: 'https://apex.tracker.gg/apex/profile/origin/furia/overview',
      icon: '/game-icons/apex.png',
      bgColor: 'bg-[#da292a]/10',
      iconFallbackColor: '#da292a'
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
              <div className="w-8 h-8 mr-3 flex-shrink-0 bg-gray-800 rounded-full p-1">
                <img 
                  src={link.icon} 
                  alt={link.game} 
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/32/${link.iconFallbackColor.replace('#', '')}/FFFFFF?text=${link.game.charAt(0)}`;
                  }}
                />
              </div>
              <span className="font-medium">{link.game}</span>
            </div>
            <ExternalLink size={16} className="text-furia-purple" />
          </a>
        ))}
      </div>
    </div>
  );
};

export default TeamStatsLinks; 