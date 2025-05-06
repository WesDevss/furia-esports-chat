import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, Newspaper, Calendar, Info, Search, X } from 'lucide-react';
import { searchContent, SearchResult, categorizeResults } from '../services/searchService';

const SearchPage: React.FC = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search).get('q') || '';
  const [searchQuery, setSearchQuery] = useState(query);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  // Atualizar resultados quando a query mudar
  useEffect(() => {
    setSearchQuery(query);
    if (query) {
      performSearch(query);
    } else {
      setResults([]);
    }
  }, [query]);

  // Função para realizar a pesquisa
  const performSearch = (q: string) => {
    setLoading(true);
    // Simular delay de busca
    setTimeout(() => {
      const searchResults = searchContent(q);
      setResults(searchResults);
      setLoading(false);
    }, 300);
  };

  // Manipular a submissão do formulário de pesquisa
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.history.pushState({}, '', `/search?q=${encodeURIComponent(searchQuery)}`);
    performSearch(searchQuery);
  };

  // Função para obter o ícone apropriado
  const getIcon = (type: string) => {
    switch (type) {
      case 'player':
        return <User className="h-5 w-5 text-green-400" />;
      case 'news':
        return <Newspaper className="h-5 w-5 text-blue-400" />;
      case 'match':
        return <Calendar className="h-5 w-5 text-yellow-400" />;
      case 'general':
        return <Info className="h-5 w-5 text-purple-400" />;
      default:
        return <Info className="h-5 w-5 text-gray-400" />;
    }
  };

  // Categorizar os resultados
  const categorized = categorizeResults(results);
  const noResults = query !== '' && results.length === 0 && !loading;

  return (
    <div className="container mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Resultados da Pesquisa</h1>
        
        {/* Formulário de pesquisa */}
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative max-w-lg">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 text-gray-200 border border-gray-600 focus:border-furia-purple focus:ring-1 focus:ring-furia-purple"
              placeholder="Jogadores, notícias, partidas..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setSearchQuery('')}
              >
                <X className="h-5 w-5 text-gray-400 hover:text-white" />
              </button>
            )}
          </div>
          <button type="submit" className="sr-only">Pesquisar</button>
        </form>
        
        {/* Resultados ou mensagens */}
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-pulse text-gray-400">Buscando resultados...</div>
          </div>
        ) : noResults ? (
          <div className="text-center py-8 text-gray-400">
            <div className="mb-2">Nenhum resultado encontrado para "{query}"</div>
            <div className="text-sm">Tente outros termos ou verifique a ortografia</div>
          </div>
        ) : (
          <div>
            {/* Status da pesquisa */}
            {query && results.length > 0 && (
              <div className="text-sm text-gray-400 mb-4">
                {results.length} resultados encontrados para "{query}"
              </div>
            )}
            
            {/* Seção de jogadores */}
            {categorized.players.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <User className="mr-2 h-5 w-5 text-green-400" />
                  Jogadores
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorized.players.map(player => (
                    <Link
                      key={player.id}
                      to={player.url}
                      className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:bg-gray-700"
                    >
                      <div className="flex items-start p-4">
                        {player.image ? (
                          <img 
                            src={player.image} 
                            alt={player.title} 
                            className="w-16 h-16 rounded-md object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = `https://via.placeholder.com/64x64?text=${player.title.charAt(0)}`;
                            }}
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                            <User className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                        <div className="ml-4">
                          <h3 className="font-medium text-lg">{player.title}</h3>
                          {player.description && (
                            <p className="text-sm text-gray-400 mt-1">{player.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Seção de notícias */}
            {categorized.news.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Newspaper className="mr-2 h-5 w-5 text-blue-400" />
                  Notícias
                </h2>
                <div className="space-y-4">
                  {categorized.news.map(news => (
                    <Link
                      key={news.id}
                      to={news.url}
                      className="block bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:bg-gray-700"
                    >
                      <div className="flex md:flex-row flex-col">
                        {news.image && (
                          <div className="md:w-1/4 w-full h-48 md:h-auto">
                            <img 
                              src={news.image} 
                              alt={news.title} 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `/news-placeholder.jpg`;
                              }}
                            />
                          </div>
                        )}
                        <div className="p-4 md:w-3/4 w-full">
                          <h3 className="font-medium text-lg">{news.title}</h3>
                          {news.description && (
                            <p className="text-sm text-gray-400 mt-2">{news.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Seção de partidas */}
            {categorized.matches.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Calendar className="mr-2 h-5 w-5 text-yellow-400" />
                  Partidas
                </h2>
                <div className="space-y-4">
                  {categorized.matches.map(match => (
                    <Link
                      key={match.id}
                      to={match.url}
                      className="block bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:bg-gray-700 p-4"
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0">
                          {match.image ? (
                            <img 
                              src={match.image} 
                              alt={match.title} 
                              className="w-16 h-16 rounded-md object-cover"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.src = `/match-placeholder.jpg`;
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-700 rounded-md flex items-center justify-center">
                              <Calendar className="h-8 w-8 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-lg">{match.title}</h3>
                          {match.description && (
                            <p className="text-sm text-gray-400 mt-1">{match.description}</p>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
            
            {/* Seção geral */}
            {categorized.general.length > 0 && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4 flex items-center">
                  <Info className="mr-2 h-5 w-5 text-purple-400" />
                  Geral
                </h2>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {categorized.general.map(item => (
                    <Link
                      key={item.id}
                      to={item.url}
                      className="bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all hover:bg-gray-700"
                    >
                      <div className="p-4">
                        <div className="flex items-center mb-2">
                          {getIcon(item.type)}
                          <h3 className="font-medium text-lg ml-2">{item.title}</h3>
                        </div>
                        {item.description && (
                          <p className="text-sm text-gray-400">{item.description}</p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage; 