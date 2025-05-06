import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar, User } from 'lucide-react';

interface NewsItem {
  id: string;
  slug: string;
  title: string;
  content: string;
  summary: string;
  image: string;
  author: string;
  date: string;
  tags: string[];
}

// Dados mock de notícias
const newsItems: Record<string, NewsItem> = {
  'furia-vence-esl': {
    id: 'news-1',
    slug: 'furia-vence-esl',
    title: 'FURIA vence torneio ESL',
    summary: 'Time brasileiro conquista título importante na Europa',
    content: `
      <p>A FURIA Esports conquistou mais um título importante para o cenário brasileiro de Counter-Strike ao vencer a ESL Pro League Season 17. O time brasileiro mostrou um desempenho consistente durante toda a competição, superando equipes como Natus Vincere, G2 e Liquid na fase final.</p>
      
      <p>Na grande final, a FURIA enfrentou a forte equipe da G2 Esports, vencendo por 3-1 em uma série emocionante. FalleN foi eleito o MVP da competição, com uma performance excepcional nas partidas decisivas.</p>
      
      <p>"Este título é muito importante para nós e para o Brasil. Trabalhamos muito para chegar aqui e estamos muito felizes com o resultado", comentou FalleN após a vitória.</p>
      
      <p>KSCERATO e yuurih também tiveram atuações de destaque durante o torneio, reforçando a qualidade individual dos jogadores brasileiros.</p>
      
      <p>Com esta conquista, a FURIA se estabelece como uma das principais equipes do cenário mundial de CS2, garantindo vaga direta para o próximo Major.</p>
    `,
    image: '/news-esl.jpg',
    author: 'Equipe FURIA',
    date: '15 de abril de 2024',
    tags: ['torneio', 'vitória', 'internacional']
  },
  'proximos-desafios': {
    id: 'news-2',
    slug: 'proximos-desafios',
    title: 'Próximos desafios da FURIA no Major',
    summary: 'Análise dos adversários da FURIA no próximo campeonato',
    content: `
      <p>A FURIA Esports está se preparando para enfrentar grandes desafios no próximo Major de CS2, que acontecerá no Rio de Janeiro. O sorteio dos grupos posicionou a equipe brasileira em um caminho desafiador, com confrontos iniciais contra equipes de alto nível.</p>
      
      <p>Na primeira fase, a FURIA enfrentará Natus Vincere, uma das equipes mais tradicionais da cena, com jogadores de alto calibre como s1mple. Em seguida, dependendo do resultado, a equipe poderá enfrentar Heroic ou G2 Esports.</p>
      
      <p>"Estamos nos preparando intensamente para esses confrontos. Sabemos que serão jogos difíceis, mas estamos confiantes em nossa capacidade", afirmou FalleN em entrevista exclusiva.</p>
      
      <p>A preparação da equipe inclui análises detalhadas de demos dos adversários, prática intensiva de mapas específicos e estratégias personalizadas para cada oponente.</p>
      
      <p>O técnico da equipe ressaltou a importância do apoio da torcida: "Jogar em casa, com o apoio da torcida brasileira, será um fator importante para nós. Esperamos fazer uma grande campanha e dar essa alegria aos fãs".</p>
    `,
    image: '/news-major.jpg',
    author: 'Analista FURIA',
    date: '10 de abril de 2024',
    tags: ['major', 'análise', 'preparação']
  },
  'fallen-estrategias': {
    id: 'news-3',
    slug: 'fallen-estrategias',
    title: 'FalleN comenta sobre estratégias da FURIA',
    summary: 'Capitão revela abordagem tática para os próximos jogos',
    content: `
      <p>Gabriel "FalleN" Toledo, capitão da FURIA Esports, concedeu uma entrevista exclusiva onde comentou sobre as abordagens táticas que a equipe está desenvolvendo para os próximos torneios. O experiente jogador, conhecido por sua capacidade de liderança, revelou algumas mudanças na filosofia de jogo da equipe.</p>
      
      <p>"Estamos implementando um estilo de jogo mais adaptável. Antes éramos conhecidos por um jogo muito agressivo, mas agora estamos mesclando essa agressividade com momentos mais calculados", explicou FalleN.</p>
      
      <p>O capitão da FURIA destacou a evolução tática da equipe desde sua chegada: "Trouxe algumas ideias novas, mas também aprendi muito com o estilo que a FURIA já tinha. É uma troca. Estamos criando algo único que aproveita o melhor de cada jogador".</p>
      
      <p>FalleN também falou sobre a distribuição de funções dentro da equipe: "KSCERATO está tendo mais liberdade para fazer jogadas individuais, yuurih está sendo nosso pilar de suporte em muitas situações, e estamos explorando a imprevisibilidade do molodoy e YEKINDAR".</p>
      
      <p>A nova abordagem tática já mostrou resultados positivos nos últimos torneios, e a equipe espera continuar evoluindo para as competições mais importantes do ano.</p>
    `,
    image: '/news-fallen.jpg',
    author: 'Departamento de Comunicação',
    date: '5 de abril de 2024',
    tags: ['estratégia', 'fallen', 'entrevista']
  }
};

const NewsDetailPage: React.FC = () => {
  const { newsSlug } = useParams<{ newsSlug: string }>();
  const [newsItem, setNewsItem] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Simular carregamento
    setTimeout(() => {
      if (newsSlug && newsItems[newsSlug]) {
        setNewsItem(newsItems[newsSlug]);
        setError(null);
      } else {
        setError('Notícia não encontrada');
      }
      setLoading(false);
    }, 500);
  }, [newsSlug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-pulse text-furia-purple">Carregando notícia...</div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="text-center py-12">
        <div className="text-xl text-red-400 mb-4">{error || 'Erro ao carregar notícia'}</div>
        <Link to="/news" className="inline-flex items-center text-furia-purple hover:text-furia-purple-light">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para notícias
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link 
        to="/news" 
        className="inline-flex items-center text-gray-400 hover:text-furia-purple mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Voltar para notícias
      </Link>
      
      <article className="bg-furia-darker rounded-xl overflow-hidden shadow-lg">
        {newsItem.image && (
          <div className="w-full h-80 overflow-hidden">
            <img 
              src={newsItem.image} 
              alt={newsItem.title} 
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = `https://via.placeholder.com/1200x600?text=${encodeURIComponent(newsItem.title)}`;
              }}
            />
          </div>
        )}
        
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-4">{newsItem.title}</h1>
          
          <div className="flex items-center text-sm text-gray-400 mb-6">
            <div className="flex items-center mr-4">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{newsItem.date}</span>
            </div>
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span>{newsItem.author}</span>
            </div>
          </div>
          
          <div 
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: newsItem.content }}
          />
          
          {newsItem.tags.length > 0 && (
            <div className="mt-8 pt-4 border-t border-gray-700">
              <div className="flex flex-wrap gap-2">
                {newsItem.tags.map((tag, index) => (
                  <span 
                    key={index}
                    className="bg-gray-800 text-gray-300 px-2 py-1 rounded-md text-xs"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>
    </div>
  );
};

export default NewsDetailPage; 