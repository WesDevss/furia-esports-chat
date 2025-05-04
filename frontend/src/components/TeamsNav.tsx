import React from 'react';
import { ExternalLink } from 'lucide-react';

interface TeamLink {
  game: string;
  url: string;
}

const TeamsNav: React.FC = () => {
  const teamLinks: TeamLink[] = [
    {
      game: 'CS2',
      url: 'https://draft5.gg/equipe/330-FURIA'
    },
    {
      game: 'VALORANT',
      url: 'https://www.vlr.gg/team/2406/furia'
    },
    {
      game: 'Rainbow Six',
      url: 'https://siege.gg/teams/285-furia-esports'
    },
    {
      game: 'Apex Legends',
      url: 'https://liquipedia.net/apexlegends/FURIA'
    }
  ];

  return (
    <div className="bg-furia-darker rounded-xl overflow-hidden border border-gray-800 p-4">
      <h3 className="text-lg font-semibold mb-3">Times</h3>
      <ul className="space-y-2">
        {teamLinks.map((link) => (
          <li key={link.game}>
            <a 
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-sm hover:text-furia-purple transition-colors"
            >
              <span className="text-furia-purple mr-2">
                <ExternalLink size={14} />
              </span>
              {link.game}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TeamsNav; 