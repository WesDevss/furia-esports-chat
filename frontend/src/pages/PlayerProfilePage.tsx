import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Twitter, Instagram, Youtube, Twitch, Trophy, Calendar, Activity, Users } from 'lucide-react';

interface PlayerStats {
  rating: string;
  kd: string;
  hs: string;
  maps: number;
  adr?: string;
  kpr?: string;
  impact?: string;
}

interface PlayerSocial {
  twitter?: string;
  instagram?: string;
  twitch?: string;
  youtube?: string;
}

interface Player {
  id: string;
  name: string;
  nickname: string;
  role: string;
  country: string;
  image: string;
  stats: PlayerStats;
  social: PlayerSocial;
  emoji?: string;
  bio?: string;
  achievements?: string[];
  age?: number;
  joined?: string;
}

const players: Record<string, Player> = {
  'fallen': {
    id: '1',
    name: 'Gabriel Toledo',
    nickname: 'FalleN',
    role: 'IGL',
    country: 'Brasil',
    image: '/players/fallen.jpg',
    emoji: '🎯',
    bio: 'Gabriel "FalleN" Toledo é um jogador profissional de CS2 e o capitão da FURIA. Conhecido por suas habilidades de liderança e AWP, ele é considerado um dos maiores jogadores brasileiros de todos os tempos. Com uma carreira de mais de uma década, FalleN tem inspirado muitos jogadores na cena brasileira e internacional.',
    age: 33,
    joined: 'Janeiro 2023',
    achievements: [
      'Campeão do Major MLG Columbus 2016',
      'Campeão do Major ESL One Cologne 2016',
      'Campeão da ESL Pro League Season 6',
      'Campeão da BLAST Pro Series São Paulo 2019'
    ],
    stats: {
      rating: '1.08',
      kd: '1.05',
      hs: '42%',
      maps: 198,
      adr: '72.5',
      kpr: '0.68',
      impact: '1.12'
    },
    social: {
      twitter: 'https://twitter.com/FalleNCS',
      instagram: 'https://instagram.com/fallen',
      twitch: 'https://twitch.tv/gafallen',
      youtube: 'https://youtube.com/fallenINSIDER'
    }
  },
  'kscerato': {
    id: '2',
    name: 'Kaike Cerato',
    nickname: 'KSCERATO',
    role: 'Rifler',
    country: 'Brasil',
    image: '/players/kscerato.jpg',
    emoji: '🎯',
    bio: 'Kaike "KSCERATO" Cerato é um rifler brasileiro conhecido por sua precisão excepcional e consistência. Um dos pilares da FURIA desde 2019, ele se tornou um dos melhores jogadores da América do Sul e é reconhecido por sua habilidade mecânica impressionante.',
    age: 24,
    joined: 'Janeiro 2019',
    achievements: [
      'Campeão da BLAST Premier Spring Finals 2023',
      'Campeão da ESL Pro League Season 12: North America',
      'Top 8 no StarLadder Berlin Major 2019',
      'Top 5 no HLTV.org ranking 2023'
    ],
    stats: {
      rating: '1.18',
      kd: '1.20',
      hs: '58%',
      maps: 259,
      adr: '84.3',
      kpr: '0.75',
      impact: '1.24'
    },
    social: {
      twitter: 'https://twitter.com/kscerato',
      instagram: 'https://instagram.com/kscerato',
      twitch: 'https://twitch.tv/kscerato',
      youtube: 'https://youtube.com/KSCERATO'
    }
  },
  'yuurih': {
    id: '3',
    name: 'Yuri Santos',
    nickname: 'yuurih',
    role: 'Rifler',
    country: 'Brasil',
    image: '/players/yuurih.jpg',
    emoji: '🔥',
    bio: 'Yuri "yuurih" Santos é um dos talentos mais brilhantes do Counter-Strike brasileiro. Como entry fragger da FURIA, ele é conhecido por sua agressividade calculada e capacidade de abrir sites. Sua consistência e impacto em rounds importantes fizeram dele um jogador fundamental para o sucesso da FURIA.',
    age: 24,
    joined: 'Janeiro 2019',
    achievements: [
      'Top 10 no ranking HLTV 2020',
      'MVP da ESL Pro League Season 12: NA',
      'Campeão da BLAST Premier Spring Finals 2023',
      'Top 8 no StarLadder Berlin Major 2019'
    ],
    stats: {
      rating: '1.15',
      kd: '1.12',
      hs: '54%',
      maps: 245,
      adr: '82.1',
      kpr: '0.72',
      impact: '1.19'
    },
    social: {
      twitter: 'https://twitter.com/yuurih',
      instagram: 'https://instagram.com/yuurihfps',
      twitch: 'https://twitch.tv/yuurih',
      youtube: 'https://youtube.com/yuurih'
    }
  },
  'molodoy': {
    id: '4',
    name: 'Alexander Melekhin',
    nickname: 'molodoy',
    role: 'Rifler',
    country: 'Ucrânia',
    image: '/players/molodoy.jpg',
    emoji: '🧊',
    bio: 'Alexander "molodoy" Melekhin é um jogador ucraniano que se juntou à FURIA em 2023. Seu estilo de jogo calculado e habilidade com rifles tornaram-se um complemento valioso para o time. Apesar de ser relativamente novo na equipe, já demonstrou grande potencial e adaptação ao estilo de jogo da FURIA.',
    age: 21,
    joined: 'Novembro 2023',
    achievements: [
      'Campeão da ESL Pro League Season 12: NA',
      'Top 16 IEM Cologne 2023',
      'Revelação do ano em 2022',
      'Top 20 no ranking HLTV 2023'
    ],
    stats: {
      rating: '1.09',
      kd: '1.07',
      hs: '52%',
      maps: 86,
      adr: '79.4',
      kpr: '0.70',
      impact: '1.15'
    },
    social: {
      twitter: 'https://twitter.com/molodoy',
      instagram: 'https://instagram.com/danil.molodoy_',
      twitch: 'https://twitch.tv/molodoy1818',
      youtube: 'https://youtube.com/molodoy'
    }
  },
  'yekindar': {
    id: '5',
    name: 'Mareks Gaļinskis',
    nickname: 'YEKINDAR',
    role: 'Rifler',
    country: 'Letônia',
    image: '/players/yekindar.jpg',
    emoji: '⚡',
    bio: 'Mareks "YEKINDAR" Gaļinskis é um jogador letão conhecido por seu estilo agressivo e impactante. Como rifler da FURIA, ele traz uma imprevisibilidade que torna difícil para os adversários lerem suas jogadas. Sua experiência internacional e leitura do jogo são valiosas para a equipe.',
    age: 24,
    joined: 'Janeiro 2024',
    achievements: [
      'Campeão do IEM Rio 2023',
      'MVP do ESL Pro League Season 16',
      'Top 5 no ranking HLTV 2023',
      'Campeão do ESL One Cologne 2022'
    ],
    stats: {
      rating: '1.14',
      kd: '1.10',
      hs: '56%',
      maps: 124,
      adr: '83.7',
      kpr: '0.76',
      impact: '1.22'
    },
    social: {
      twitter: 'https://twitter.com/YEKINDAR',
      instagram: 'https://instagram.com/yek1ndar',
      twitch: 'https://twitch.tv/yekindar',
      youtube: 'https://youtube.com/YEKINDAR'
    }
  }
};

const PlayerProfilePage: React.FC = () => {
  const { playerId } = useParams<{ playerId: string }>();
  const [player, setPlayer] = useState<Player | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simular carregamento
    setLoading(true);
    
    setTimeout(() => {
      if (playerId && players[playerId]) {
        setPlayer(players[playerId]);
        setError(null);
      } else {
        setError('Jogador não encontrado');
      }
      setLoading(false);
    }, 500);
  }, [playerId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-furia-purple">Carregando perfil do jogador...</div>
      </div>
    );
  }

  if (error || !player) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-red-400 mb-4">{error || 'Erro ao carregar perfil'}</div>
        <Link to="/players" className="inline-flex items-center text-furia-purple hover:text-furia-purple-light">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para lista de jogadores
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Link 
        to="/players" 
        className="inline-flex items-center text-gray-400 hover:text-furia-purple mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para lista de jogadores
      </Link>
      
      <div className="bg-furia-darker rounded-xl overflow-hidden shadow-neon">
        <div className="flex flex-col md:flex-row">
          {/* Imagem e informações básicas */}
          <div className="md:w-1/3">
            <div className="aspect-[3/4] relative overflow-hidden">
              <img 
                src={player.image} 
                alt={player.nickname} 
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = `https://via.placeholder.com/400x600?text=${player.nickname}`;
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent py-6">
                <div className="px-6">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="bg-furia-purple text-white px-2 py-1 rounded text-xs font-medium">
                      {player.role}
                    </span>
                    <span className="bg-gray-800 text-white px-2 py-1 rounded text-xs font-medium">
                      {player.country}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold">
                    {player.emoji && <span className="mr-2">{player.emoji}</span>}
                    {player.nickname}
                  </h1>
                  <p className="text-gray-400">{player.name}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Detalhes e estatísticas */}
          <div className="md:w-2/3 p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">Rating</p>
                <p className="text-xl font-medium">{player.stats.rating}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">K/D</p>
                <p className="text-xl font-medium">{player.stats.kd}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">HS%</p>
                <p className="text-xl font-medium">{player.stats.hs}</p>
              </div>
              <div className="bg-gray-800 p-4 rounded-lg text-center">
                <p className="text-xs text-gray-400 mb-1">Maps</p>
                <p className="text-xl font-medium">{player.stats.maps}</p>
              </div>
            </div>
            
            <h2 className="text-xl font-semibold mb-3">Sobre</h2>
            <p className="text-gray-300 mb-6">{player.bio}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-medium mb-3 flex items-center">
                  <Trophy className="h-5 w-5 text-yellow-400 mr-2" />
                  Conquistas
                </h3>
                <ul className="space-y-2">
                  {player.achievements?.map((achievement, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-yellow-400 mr-2">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <div className="mb-4">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Users className="h-5 w-5 text-blue-400 mr-2" />
                    Informações
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Idade:</span>
                      <span>{player.age} anos</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Na FURIA desde:</span>
                      <span>{player.joined}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <Activity className="h-5 w-5 text-green-400 mr-2" />
                    Estatísticas adicionais
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">ADR:</span>
                      <span>{player.stats.adr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">KPR:</span>
                      <span>{player.stats.kpr}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Impact:</span>
                      <span>{player.stats.impact}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-3">Redes Sociais</h3>
            <div className="flex space-x-4">
              {player.social.twitter && (
                <a 
                  href={player.social.twitter} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full"
                  aria-label="Twitter"
                >
                  <Twitter className="h-5 w-5" />
                </a>
              )}
              {player.social.instagram && (
                <a 
                  href={player.social.instagram} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-pink-600 hover:bg-pink-700 text-white p-2 rounded-full"
                  aria-label="Instagram"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              )}
              {player.social.twitch && (
                <a 
                  href={player.social.twitch} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full"
                  aria-label="Twitch"
                >
                  <Twitch className="h-5 w-5" />
                </a>
              )}
              {player.social.youtube && (
                <a 
                  href={player.social.youtube} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full"
                  aria-label="YouTube"
                >
                  <Youtube className="h-5 w-5" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerProfilePage; 