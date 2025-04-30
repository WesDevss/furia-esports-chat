import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Card, 
  CardMatch, 
  CardResult, 
  CardPlayer, 
  CardQuiz, 
  ChatBox 
} from '../components/ui';
import { ChevronRight } from 'lucide-react';
import HomeNewsList from '../components/HomeNewsList';

// Corrigindo tipagem para corresponder à definição no ChatBox
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const Home: React.FC = () => {
  const furiaLogoUrl = '/furia-logo.jpeg';
  
  // Dados de exemplo para próximas partidas
  const upcomingMatches = [
    {
      id: '1',
      homeTeam: {
        name: 'FURIA',
        logo: '/team-logos/furia-logo.jpeg'
      },
      awayTeam: {
        name: 'NAVI',
        logo: '/team-logos/navi-logo.png'
      },
      matchTime: '15:00',
      matchDate: '25/03/2024',
      tournament: 'Major Rio 2024',
      isLive: true
    },
    {
      id: '2',
      homeTeam: {
        name: 'FURIA',
        logo: '/team-logos/furia-logo.jpeg'
      },
      awayTeam: {
        name: 'FaZe Clan',
        logo: '/team-logos/faze-logo.png'
      },
      matchTime: '18:30',
      matchDate: '26/03/2024',
      tournament: 'ESL Pro League',
      isLive: false
    }
  ];
  
  // Dados de exemplo para resultados recentes
  const recentResults = [
    {
      id: '1',
      homeTeam: { name: 'FURIA', logo: '/team-logos/furia-logo.jpeg', score: 16 },
      awayTeam: { name: 'NAVI', logo: '/team-logos/navi-logo.png', score: 12 },
      tournament: 'BLAST Premier',
      matchDate: 'hoje'
    }
  ];
  
  // Dados de exemplo para perfil de jogador
  const playerProfile = {
    name: 'Andrei Piovezan',
    nickname: 'yuurih',
    role: 'Rifler',
    image: 'https://via.placeholder.com/80',
    stats: [
      { label: 'K/D', value: '1.12' },
      { label: 'HS%', value: '54%' },
      { label: 'Rating', value: '1.15' },
      { label: 'Maps', value: '245' },
    ]
  };
  
  // Mensagens de exemplo para o chat
  const chatMessages: Message[] = [
    {
      id: '1',
      text: 'Olá, sou o FURIBOT! Como posso te ajudar hoje?',
      sender: 'bot',
      timestamp: new Date(Date.now() - 60000)
    }
  ];

  // Handler para enviar mensagem no chat
  const handleSendMessage = (message: string) => {
    console.log('Mensagem enviada:', message);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto px-4">
      {/* Hero Section com animação */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative bg-furia-darker rounded-2xl overflow-hidden shadow-neon-lg"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-furia-purple/20 to-transparent z-0"></div>
        <div className="py-12 md:py-16 relative z-10 px-6 md:px-10">
          <div className="max-w-2xl">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-4"
            >
              Bem-vindo ao <span className="furia-gradient-text">FURIA Chat</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-gray-300 text-lg mb-8"
            >
              Conecte-se com outros fãs, acompanhe as partidas em tempo real e participe da comunidade FURIA.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
            >
              <Link 
                to="/chat" 
                className="furia-button inline-flex items-center"
              >
                Entrar no Chat <ChevronRight size={18} className="ml-1" />
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.section>
      
      {/* Layout em Grid com 3 colunas */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Coluna 1: ChatBot e Menu rápido */}
        <div className="md:col-span-4 space-y-6">
          <ChatBox 
            messages={chatMessages} 
            onSendMessage={handleSendMessage} 
          />
          
          <Card title="Menu Rápido">
            <div className="grid grid-cols-2 gap-2">
              <Link to="/news" className="bg-furia-dark hover:bg-furia-gray/50 p-3 rounded-xl text-center transition-all">
                Últimas notícias
              </Link>
              <Link to="/calendar" className="bg-furia-dark hover:bg-furia-gray/50 p-3 rounded-xl text-center transition-all">
                Calendário
              </Link>
              <Link to="/results" className="bg-furia-dark hover:bg-furia-gray/50 p-3 rounded-xl text-center transition-all">
                Resultados
              </Link>
              <Link to="/players" className="bg-furia-dark hover:bg-furia-gray/50 p-3 rounded-xl text-center transition-all">
                Jogadores
              </Link>
              <Link to="/quiz" className="bg-furia-dark hover:bg-furia-gray/50 p-3 rounded-xl text-center transition-all">
                Quiz
              </Link>
              <Link to="/videos" className="bg-furia-dark hover:bg-furia-gray/50 p-3 rounded-xl text-center transition-all">
                Vídeos
              </Link>
            </div>
          </Card>
        </div>
        
        {/* Coluna 2: Notícias, Resultados e Jogadores */}
        <div className="md:col-span-4 space-y-6">
          {/* Substituindo o CardNews pelo novo componente HomeNewsList */}
          <HomeNewsList />
          
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-xl font-bold">Resultados Recentes</h2>
            <Link to="/results" className="text-sm text-furia-purple">Ver todos</Link>
          </div>
          
          {recentResults.map((result, idx) => (
            <CardResult
              key={result.id}
              homeTeam={result.homeTeam}
              awayTeam={result.awayTeam}
              tournament={result.tournament}
              matchDate={result.matchDate}
              delay={idx}
            />
          ))}
          
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-xl font-bold">Perfil de Jogador</h2>
            <Link to="/players" className="text-sm text-furia-purple">Ver todos</Link>
          </div>
          
          <CardPlayer
            name={playerProfile.name}
            nickname={playerProfile.nickname}
            role={playerProfile.role}
            image={playerProfile.image}
            stats={playerProfile.stats}
          />
        </div>
        
        {/* Coluna 3: Próximas Partidas, Quiz e Video */}
        <div className="md:col-span-4 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Calendário de Jogos</h2>
            <Link to="/calendar" className="text-sm text-furia-purple">Ver todos</Link>
          </div>
          
          {upcomingMatches.map((match, idx) => (
            <CardMatch
              key={match.id}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              matchTime={match.matchTime}
              matchDate={match.matchDate}
              tournament={match.tournament}
              isLive={match.isLive}
              delay={idx * 0.1}
            />
          ))}
          
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-xl font-bold">Quiz Interativo</h2>
            <Link to="/quiz" className="text-sm text-furia-purple">Ver todos</Link>
          </div>
          
          <CardQuiz 
            title="Quiz FURIA" 
            description="Teste seus conhecimentos sobre a FURIA"
            questionsCount={10}
            difficulty="medium"
            completionRate={65}
            onStart={() => console.log('Quiz iniciado')}
          />
          
          <div className="flex items-center justify-between mt-8">
            <h2 className="text-xl font-bold">Loja Oficial</h2>
            <Link to="/store" className="text-sm text-furia-purple">Ver produtos</Link>
          </div>
          
          <div className="bg-furia-dark rounded-xl overflow-hidden shadow-md">
            <img 
              src="https://via.placeholder.com/400x200?text=FURIA+Store" 
              alt="FURIA Store"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">Nova Coleção 2024</h3>
              <p className="text-gray-400 text-sm mb-3">
                Conheça os novos produtos da FURIA e represente seu time favorito com estilo.
              </p>
              <Link 
                to="/store" 
                className="inline-block bg-furia-purple hover:bg-furia-purple-dark text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                Comprar Agora
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 