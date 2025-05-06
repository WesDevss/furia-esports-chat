// Interface para diferentes tipos de resultados
export interface SearchResult {
  id: string;
  type: 'player' | 'news' | 'match' | 'general';
  title: string;
  description?: string;
  image?: string;
  url: string;
}

// Mock dos jogadores da FURIA para busca
const players: SearchResult[] = [
  { 
    id: 'fallen', 
    type: 'player', 
    title: 'FalleN', 
    description: 'Gabriel Toledo - Capitão e AWPer da FURIA', 
    image: '/player-fallen.jpg',
    url: '/players/fallen'
  },
  { 
    id: 'kscerato', 
    type: 'player', 
    title: 'KSCERATO', 
    description: 'Kaike Cerato - Rifler da FURIA', 
    image: '/player-kscerato.jpg',
    url: '/players/kscerato'
  },
  { 
    id: 'yuurih', 
    type: 'player', 
    title: 'yuurih', 
    description: 'Yuri Santos - Entry fragger da FURIA', 
    image: '/player-yuurih.jpg', 
    url: '/players/yuurih' 
  },
  { 
    id: 'molodoy', 
    type: 'player', 
    title: 'molodoy', 
    description: 'Alexander Melekhin - Rifler da FURIA', 
    image: '/player-molodoy.jpg', 
    url: '/players/molodoy' 
  },
  { 
    id: 'yekindar', 
    type: 'player', 
    title: 'YEKINDAR', 
    description: 'Mareks Gaļinskis - Rifler da FURIA', 
    image: '/player-yekindar.jpg', 
    url: '/players/yekindar' 
  }
];

// Mock das notícias recentes
const news: SearchResult[] = [
  { 
    id: 'news-1', 
    type: 'news', 
    title: 'FURIA vence torneio ESL', 
    description: 'Time brasileiro conquista título importante na Europa',
    image: '/news-esl.jpg', 
    url: '/news/furia-vence-esl' 
  },
  { 
    id: 'news-2', 
    type: 'news', 
    title: 'Próximos desafios da FURIA no Major', 
    description: 'Análise dos adversários da FURIA no próximo campeonato',
    image: '/news-major.jpg', 
    url: '/news/proximos-desafios' 
  },
  { 
    id: 'news-3', 
    type: 'news', 
    title: 'FalleN comenta sobre estratégias da FURIA', 
    description: 'Capitão revela abordagem tática para os próximos jogos',
    image: '/news-fallen.jpg', 
    url: '/news/fallen-estrategias' 
  }
];

// Mock das partidas
const matches: SearchResult[] = [
  { 
    id: 'match-1', 
    type: 'match', 
    title: 'FURIA vs NAVI - Major Rio 2024', 
    description: 'Partida de abertura do Major Rio 2024',
    image: '/match-furia-navi.jpg', 
    url: '/match/furia-navi-major-rio' 
  },
  { 
    id: 'match-2', 
    type: 'match', 
    title: 'FURIA vs Liquid - Major Rio 2024', 
    description: 'Segunda partida do Major Rio 2024',
    image: '/match-furia-liquid.jpg', 
    url: '/match/furia-liquid-major-rio' 
  },
  { 
    id: 'match-3', 
    type: 'match', 
    title: 'FURIA vs G2 - BLAST Premier', 
    description: 'Final da BLAST Premier Spring Finals',
    image: '/match-furia-g2.jpg', 
    url: '/match/furia-g2-blast' 
  }
];

// Outras seções do site
const general: SearchResult[] = [
  { 
    id: 'general-1', 
    type: 'general', 
    title: 'Sobre a FURIA Esports', 
    description: 'História e informações sobre a organização',
    image: '/about-furia.jpg', 
    url: '/about' 
  },
  { 
    id: 'general-2', 
    type: 'general', 
    title: 'Loja da FURIA', 
    description: 'Produtos oficiais da FURIA Esports',
    image: '/store-furia.jpg', 
    url: '/store' 
  },
  { 
    id: 'general-3', 
    type: 'general', 
    title: 'Chat da FURIA', 
    description: 'Interaja com outros fãs durante as partidas',
    image: '/chat-furia.jpg', 
    url: '/chat' 
  }
];

// Todos os resultados da pesquisa
const allSearchResults: SearchResult[] = [...players, ...news, ...matches, ...general];

/**
 * Busca conteúdo baseado na query do usuário
 * @param query Termo de busca
 * @returns Resultados correspondentes à busca
 */
export const searchContent = (query: string): SearchResult[] => {
  if (!query.trim()) return [];
  
  const normalizedQuery = query.trim().toLowerCase();
  
  return allSearchResults.filter(item => 
    item.title.toLowerCase().includes(normalizedQuery) || 
    (item.description && item.description.toLowerCase().includes(normalizedQuery))
  );
};

/**
 * Categoriza os resultados da busca
 * @param results Resultados da busca
 * @returns Resultados categorizados
 */
export const categorizeResults = (results: SearchResult[]) => {
  return {
    players: results.filter(r => r.type === 'player'),
    news: results.filter(r => r.type === 'news'),
    matches: results.filter(r => r.type === 'match'),
    general: results.filter(r => r.type === 'general')
  };
}; 