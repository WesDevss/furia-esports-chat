import React from 'react';

interface Player {
  id: string;
  name: string;
  nickname: string;
  role: string;
  country: string;
  image: string;
  stats: {
    rating: string;
    kd: string;
    hs: string;
    maps: number;
  };
  social: {
    twitter?: string;
    instagram?: string;
    twitch?: string;
  };
}

const PlayersPage: React.FC = () => {
  // Mock data for FURIA players
  const players: Player[] = [
    {
      id: '1',
      name: 'Andrei Piovezan',
      nickname: 'yuurih',
      role: 'Rifler',
      country: 'Brasil',
      image: 'https://via.placeholder.com/300x400',
      stats: {
        rating: '1.15',
        kd: '1.12',
        hs: '54%',
        maps: 245
      },
      social: {
        twitter: 'https://twitter.com/yuurihcs',
        instagram: 'https://instagram.com/yuurihcs',
        twitch: 'https://twitch.tv/yuurih'
      }
    },
    {
      id: '2',
      name: 'Kaike Cerato',
      nickname: 'KSCERATO',
      role: 'Rifler',
      country: 'Brasil',
      image: 'https://via.placeholder.com/300x400',
      stats: {
        rating: '1.18',
        kd: '1.20',
        hs: '58%',
        maps: 259
      },
      social: {
        twitter: 'https://twitter.com/kscerato',
        instagram: 'https://instagram.com/kscerato',
        twitch: 'https://twitch.tv/kscerato'
      }
    },
    {
      id: '3',
      name: 'André Abreu',
      nickname: 'drop',
      role: 'Rifler',
      country: 'Brasil',
      image: 'https://via.placeholder.com/300x400',
      stats: {
        rating: '1.05',
        kd: '1.02',
        hs: '50%',
        maps: 232
      },
      social: {
        twitter: 'https://twitter.com/dropcs',
        instagram: 'https://instagram.com/dropareu',
      }
    },
    {
      id: '4',
      name: 'Rafael Costa',
      nickname: 'saffee',
      role: 'AWPer',
      country: 'Brasil',
      image: 'https://via.placeholder.com/300x400',
      stats: {
        rating: '1.10',
        kd: '1.08',
        hs: '38%',
        maps: 198
      },
      social: {
        twitter: 'https://twitter.com/saffeeCS',
        instagram: 'https://instagram.com/saffeecs',
        twitch: 'https://twitch.tv/saffee'
      }
    },
    {
      id: '5',
      name: 'Nicholas de Oliveira',
      nickname: 'guerri',
      role: 'Coach',
      country: 'Brasil',
      image: 'https://via.placeholder.com/300x400',
      stats: {
        rating: '-',
        kd: '-',
        hs: '-',
        maps: 0
      },
      social: {
        twitter: 'https://twitter.com/guerriCS',
        instagram: 'https://instagram.com/guerrics',
      }
    }
  ];

  return (
    <div className="mx-auto max-w-6xl px-4">
      <h1 className="text-3xl font-bold mb-6">Jogadores da FURIA</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map(player => (
          <div 
            key={player.id} 
            className="bg-furia-darker rounded-xl overflow-hidden shadow-lg hover:shadow-neon-sm transition-all duration-300"
          >
            <div className="aspect-[3/4] overflow-hidden relative">
              <img 
                src={player.image} 
                alt={player.nickname} 
                className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-furia-black to-transparent h-1/2 pointer-events-none"></div>
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-furia-purple/80 text-white px-2 py-1 rounded-md text-xs font-medium">
                    {player.role}
                  </span>
                  <span className="bg-gray-800/80 text-white px-2 py-1 rounded-md text-xs font-medium">
                    {player.country}
                  </span>
                </div>
                <h2 className="text-2xl font-bold mt-2">{player.nickname}</h2>
                <p className="text-gray-400 text-sm">{player.name}</p>
              </div>
            </div>
            
            <div className="p-4">
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="text-center">
                  <p className="text-xs text-gray-400">Rating</p>
                  <p className="font-medium">{player.stats.rating}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">K/D</p>
                  <p className="font-medium">{player.stats.kd}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">HS%</p>
                  <p className="font-medium">{player.stats.hs}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-gray-400">Maps</p>
                  <p className="font-medium">{player.stats.maps}</p>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4">
                {player.social.twitter && (
                  <a href={player.social.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-400 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                    </svg>
                  </a>
                )}
                {player.social.instagram && (
                  <a href={player.social.instagram} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-pink-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                )}
                {player.social.twitch && (
                  <a href={player.social.twitch} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-purple-500 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M2.149 0l-1.612 4.119v16.836h5.731v3.045h3.224l3.045-3.045h4.657l6.269-6.269v-14.686h-21.314zm19.164 13.612l-3.582 3.582h-5.731l-3.045 3.045v-3.045h-4.836v-15.045h17.194v11.463zm-3.582-7.343v6.262h-2.149v-6.262h2.149zm-5.731 0v6.262h-2.149v-6.262h2.149z" fillRule="evenodd" clipRule="evenodd" />
                    </svg>
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlayersPage; 