import React, { useState, useEffect } from 'react';
import { Bell, Calendar, ExternalLink, Filter, Newspaper, RefreshCw, Search, User, X } from 'lucide-react';

// Definição de tipos para as notícias
interface NewsItem {
  id: string;
  title: string;
  summary: string;
  details: string;
  source: {
    name: string;
    url: string;
  };
  date: Date;
  category: 'CS2' | 'VALORANT' | 'LOL' | 'GERAL';
  imageUrl: string;
  isBreaking?: boolean;
}

const NewsPage: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'CS2' | 'VALORANT' | 'LOL'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  // Simula a busca de notícias de uma API
  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      try {
        // Simulando uma chamada de API com tempo de espera
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Dados mockados que seriam retornados de uma API real
        const mockNews: NewsItem[] = [
          {
            id: '1',
            title: 'FURIA Anuncia Substituição no Elenco de CS2',
            summary: 'A FURIA confirmou a entrada de Mareks "YEKINDAR" Gaļinskis no lugar de Felipe "skullz" Medeiros no elenco de CS2 para a temporada de 2025.',
            details: 'A FURIA Esports anunciou hoje uma importante mudança em seu elenco de Counter-Strike 2. O letão Mareks "YEKINDAR" Gaļinskis, ex-jogador da Team Liquid, foi oficialmente contratado para substituir Felipe "skullz" Medeiros. Segundo Jaime "jame", capitão da equipe, a decisão foi tomada visando reforçar o time para os próximos torneios internacionais, incluindo o Major 2025 e a BLAST Premier. "YEKINDAR traz uma experiência internacional que precisamos para competir no mais alto nível", afirmou André Akkari, co-fundador da FURIA. A estreia do novo jogador está prevista para o próximo mês, durante a ESL Pro League Season 19.',
            source: {
              name: 'Esports.net',
              url: 'https://esports.net'
            },
            date: new Date('2024-12-15T10:30:00'),
            category: 'CS2',
            imageUrl: '/news/mudanca-elenco-furia.png',
            isBreaking: true
          },
          {
            id: '2',
            title: 'FURIA Vence NAVI e Avança às Semifinais do Major',
            summary: 'Em uma impressionante reviravolta, a FURIA derrotou a Natus Vincere por 2-1 nas quartas de final do Major de CS2.',
            details: 'A equipe brasileira da FURIA Esports conseguiu uma importante vitória contra a favorita Natus Vincere (NAVI) nas quartas de final do Major. Após perder o primeiro mapa (Nuke) por 16-9, a FURIA reagiu vencendo Inferno por 16-14 e Mirage por 16-12. O destaque da partida foi Kaike "KSCERATO" Cerato, que terminou a série com 74 abates e rating de 1.37. "Estamos jogando nosso melhor CS e provando que podemos competir contra qualquer equipe do mundo", declarou o líder Gabriel "FalleN" Toledo após a vitória. A foto captura o momento de celebração da equipe após o resultado histórico, com os jogadores se abraçando diante da bandeira brasileira exibida ao fundo. Na imagem, é possível ver KSCERATO, yuurih e os outros integrantes da equipe celebrando a classificação. A FURIA enfrentará a Team Vitality na semifinal, marcada para este sábado.',
            source: {
              name: 'EGamersWorld',
              url: 'https://egamersworld.com'
            },
            date: new Date(Date.now() - 7200000), // 2 horas atrás
            category: 'CS2',
            imageUrl: '/news/furia-fase-de-grupos-iem-rio-2024.jpg',
            isBreaking: true
          },
          {
            id: '3',
            title: 'FURIA Valorant Anuncia Bootcamp na Europa',
            summary: 'A divisão de Valorant da FURIA participará de um bootcamp de duas semanas na Europa para preparação para o VCT 2025.',
            details: 'Em preparação para o Valorant Champions Tour (VCT) 2025, a FURIA anunciou que sua equipe de Valorant participará de um bootcamp intensivo de duas semanas na Europa. O treinamento acontecerá em Berlim, na Alemanha, e incluirá sessões de treino contra equipes europeias de alto nível como Fnatic, Team Liquid e NAVI. Segundo Khalil "khalil" Schmidt, treinador da equipe, o objetivo é aprimorar estratégias e se adaptar ao meta europeu antes do início da temporada. "O cenário europeu tem uma abordagem diferente ao jogo e queremos absorver o máximo possível durante esse período", explicou. A equipe partirá para a Europa em janeiro de 2025.',
            source: {
              name: 'VLR.gg',
              url: 'https://vlr.gg'
            },
            date: new Date('2024-12-20T09:15:00'),
            category: 'VALORANT',
            imageUrl: '/news/furia-bootcamp-europa.jpg'
          },
          {
            id: '4',
            title: 'FURIA Atinge Recorde de Audiência no CBLOL 2024',
            summary: 'A final do CBLOL 2024 entre FURIA e paiN Gaming quebrou recordes com mais de 500 mil espectadores simultâneos.',
            details: 'A grande final do Campeonato Brasileiro de League of Legends (CBLOL) 2024 entre FURIA e paiN Gaming estabeleceu um novo recorde de audiência para a competição. De acordo com dados da Esports Charts, o confronto atingiu o pico de 527.843 espectadores simultâneos, superando em 15% o recorde anterior. A série de cinco partidas, que terminou com vitória da FURIA por 3-2, teve uma média de 412.300 espectadores. "Este é um momento histórico para o cenário de LoL no Brasil e mostra o crescimento contínuo da modalidade no país", comentou Carlos Antunes, diretor do CBLOL. Com a vitória, a FURIA garantiu vaga no Mundial de League of Legends 2025.',
            source: {
              name: 'Esports Charts',
              url: 'https://escharts.com'
            },
            date: new Date('2024-08-05T21:30:00'),
            category: 'LOL',
            imageUrl: '/news/cblol-2024-final-1-split-recorde-audiencia.webp'
          },
          {
            id: '5',
            title: 'FURIA Expande Centro de Treinamento em São Paulo',
            summary: 'A organização anunciou a expansão de seu centro de treinamento, que agora contará com instalações dedicadas para todas as suas equipes.',
            details: 'A FURIA Esports anunciou a expansão de seu centro de treinamento localizado em São Paulo. O novo complexo, que será inaugurado em março de 2025, contará com instalações dedicadas para todas as modalidades da organização, incluindo CS2, Valorant, League of Legends e Apex Legends. O projeto inclui salas de treino individuais para cada divisão, academia, departamento médico com fisioterapeutas e psicólogos, e um estúdio para criação de conteúdo. "Este investimento reflete nosso compromisso com a excelência e bem-estar dos nossos atletas", afirmou Jaime "crush" Pádua, co-CEO da FURIA. O investimento total na expansão é estimado em R$ 8 milhões.',
            source: {
              name: 'Sheep Esports',
              url: 'https://sheepesports.com'
            },
            date: new Date('2024-12-01T14:20:00'),
            category: 'GERAL',
            imageUrl: '/news/centro-treinamento-furia.jpg'
          },
          {
            id: '6',
            title: 'FURIA Assina Parceria com Marca Global de Periféricos',
            summary: 'A organização brasileira firmou um acordo de patrocínio de três anos com uma das principais marcas de periféricos gaming do mundo.',
            details: 'A FURIA Esports anunciou hoje uma parceria estratégica de três anos com a Razer, uma das principais fabricantes de periféricos gaming do mundo. O acordo, avaliado em aproximadamente US$ 5 milhões, inclui o fornecimento exclusivo de equipamentos para todas as equipes da organização, desenvolvimento de produtos co-branded, e ativações em eventos internacionais. "Esta parceria representa um marco importante em nossa estratégia de expansão global", destacou André Akkari, co-fundador da FURIA. A colaboração também prevê o lançamento de uma linha especial de produtos com as cores e o logo da FURIA, que deve chegar ao mercado no primeiro trimestre de 2025.',
            source: {
              name: 'BO3.gg',
              url: 'https://bo3.gg'
            },
            date: new Date('2024-11-28T11:00:00'),
            category: 'GERAL',
            imageUrl: '/news/agon-furia.jpg'
          }
        ];
        
        setNews(mockNews);
        setLastUpdated(new Date());
      } catch (error) {
        console.error('Erro ao buscar notícias:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchNews();
    
    // Configura a atualização automática a cada 6 horas
    const intervalId = setInterval(() => {
      fetchNews();
    }, 6 * 60 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  // Filtra notícias baseado nas preferências do usuário
  const filteredNews = news.filter(item => {
    // Filtro por categoria
    if (filter !== 'all' && item.category !== filter) {
      return false;
    }
    
    // Filtro por busca de texto
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.details.toLowerCase().includes(query)
      );
    }
    
    return true;
  });

  // Formata a data para exibição
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Manipula a visualização expandida de uma notícia
  const toggleExpand = (id: string) => {
    setExpandedItem(expandedItem === id ? null : id);
  };

  // Manipula a atualização manual das notícias
  const handleRefresh = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setLastUpdated(new Date());
    setLoading(false);
  };

  return (
    <div className="mx-auto max-w-6xl px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Últimas Notícias</h1>
          <p className="text-gray-400 text-sm">
            Atualizado em: {formatDate(lastUpdated)}
          </p>
        </div>
        
        <div className="flex mt-4 md:mt-0">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-700 hover:bg-gray-600 text-white rounded-lg px-4 py-2 flex items-center mr-3"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </button>
          
          <button 
            onClick={() => setIsSubscribed(!isSubscribed)}
            className={`rounded-lg px-4 py-2 flex items-center ${
              isSubscribed 
                ? 'bg-furia-purple/20 text-furia-purple' 
                : 'bg-gray-700 hover:bg-gray-600 text-white'
            }`}
          >
            <Bell className="h-4 w-4 mr-2" />
            {isSubscribed ? 'Inscrito' : 'Receber Alertas'}
          </button>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between space-y-4 md:space-y-0">
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'all'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Todas
            </button>
            <button
              onClick={() => setFilter('CS2')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'CS2'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              CS2
            </button>
            <button
              onClick={() => setFilter('VALORANT')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'VALORANT'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              VALORANT
            </button>
            <button
              onClick={() => setFilter('LOL')}
              className={`px-4 py-2 rounded-lg text-sm ${
                filter === 'LOL'
                  ? 'bg-furia-purple text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              League of Legends
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Buscar notícias..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 rounded-lg bg-gray-700 text-gray-200 border border-transparent focus:border-furia-purple focus:ring-1 focus:ring-furia-purple w-full md:w-64"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <X className="h-4 w-4 text-gray-400 hover:text-gray-200" />
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Conteúdo de notícias */}
      {loading ? (
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-pulse space-y-2 text-center">
            <div className="h-6 w-24 bg-furia-purple/20 rounded mx-auto"></div>
            <p className="text-furia-purple text-sm">Carregando notícias...</p>
          </div>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <Newspaper className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Nenhuma notícia encontrada</h3>
          <p className="text-gray-400">
            Não encontramos notícias com os filtros atuais. Tente ajustar sua busca ou filtros.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
            <article 
              key={item.id}
              className={`bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow ${
                item.isBreaking ? 'ring-2 ring-furia-purple' : ''
              }`}
            >
              <div className="relative h-48 bg-gray-700">
                <img 
                  src={item.imageUrl} 
                  alt={item.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback se a imagem falhar
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/600x400?text=FURIA+${item.category}`;
                  }}
                />
                {item.isBreaking && (
                  <div className="absolute top-0 left-0 bg-furia-purple text-white px-3 py-1 text-xs font-bold">
                    ÚLTIMA HORA
                  </div>
                )}
                <div className="absolute top-0 right-0 bg-black/70 text-white px-3 py-1 text-xs font-medium rounded-bl-lg">
                  {item.category}
                </div>
              </div>
              
              <div className="p-4">
                <div className="flex items-center text-sm text-gray-400 mb-2">
                  <Calendar className="h-3 w-3 mr-1" />
                  <span>{formatDate(item.date)}</span>
                </div>
                
                <h3 className="text-xl font-semibold mb-3">
                  {item.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-4">
                  {item.summary}
                </p>
                
                {expandedItem === item.id ? (
                  <>
                    <div className="mt-4 mb-4 border-t border-gray-700 pt-4">
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {item.details}
                      </p>
                      
                      <div className="mt-4 flex items-center text-xs text-gray-500">
                        <span>Fonte: </span>
                        <a 
                          href={item.source.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-furia-purple hover:underline ml-1"
                        >
                          {item.source.name}
                          <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => toggleExpand(item.id)} 
                      className="text-furia-purple hover:underline text-sm font-medium"
                    >
                      Mostrar menos
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => toggleExpand(item.id)} 
                    className="text-furia-purple hover:underline text-sm font-medium"
                  >
                    Ler mais
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default NewsPage; 