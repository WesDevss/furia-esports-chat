import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Newspaper, Calendar, Info, Search } from 'lucide-react';
import { SearchResult } from '../services/searchService';

interface SearchResultsProps {
  results: SearchResult[];
  onClose: () => void;
  searchQuery?: string;
}

// Componente que renderiza um resultado de pesquisa individual
const ResultItem: React.FC<{ result: SearchResult; onClose: () => void }> = ({ result, onClose }) => {
  // Ícone baseado no tipo de resultado
  const getIcon = () => {
    switch (result.type) {
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

  return (
    <Link 
      to={result.url} 
      className="flex items-center p-3 hover:bg-gray-700 rounded-md transition-colors"
      onClick={onClose}
    >
      <div className="flex-shrink-0 mr-3">
        {result.image ? (
          <img 
            src={result.image} 
            alt={result.title} 
            className="h-10 w-10 rounded-md object-cover" 
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              // Tentar usar um fallback baseado no tipo de resultado
              if (result.type === 'player') {
                target.src = `https://via.placeholder.com/40x40?text=${result.title.charAt(0)}`;
              } else if (result.type === 'news') {
                target.src = '/news-placeholder.jpg';
              } else if (result.type === 'match') {
                target.src = '/match-placeholder.jpg';
              } else {
                target.src = `https://via.placeholder.com/40x40?text=${result.title.charAt(0)}`;
              }
            }}
          />
        ) : (
          <div className="h-10 w-10 bg-gray-700 rounded-md flex items-center justify-center">
            {getIcon()}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center">
          {getIcon()}
          <p className="ml-1 text-sm font-medium truncate">
            {result.title}
          </p>
        </div>
        {result.description && (
          <p className="text-xs text-gray-400 truncate">
            {result.description}
          </p>
        )}
      </div>
    </Link>
  );
};

// Componente de grupo de resultados por categoria
const ResultGroup: React.FC<{ 
  title: string; 
  results: SearchResult[]; 
  onClose: () => void;
}> = ({ title, results, onClose }) => {
  if (results.length === 0) return null;
  
  return (
    <div className="mb-4">
      <h3 className="text-xs uppercase font-semibold text-gray-400 px-3 mb-1">{title}</h3>
      <div className="space-y-1">
        {results.map(result => (
          <ResultItem key={result.id} result={result} onClose={onClose} />
        ))}
      </div>
    </div>
  );
};

// Componente principal de resultados
const SearchResults: React.FC<SearchResultsProps> = ({ results, onClose, searchQuery = '' }) => {
  const navigate = useNavigate();
  
  // Limitar o número de resultados exibidos no dropdown
  const maxResultsPerCategory = 3;
  const showAllResultsButton = results.length > 4;
  
  // Categorizar resultados
  const players = results.filter(r => r.type === 'player').slice(0, maxResultsPerCategory);
  const news = results.filter(r => r.type === 'news').slice(0, maxResultsPerCategory);
  const matches = results.filter(r => r.type === 'match').slice(0, maxResultsPerCategory);
  const general = results.filter(r => r.type === 'general').slice(0, maxResultsPerCategory);
  
  // Função para ver todos os resultados
  const handleViewAllResults = () => {
    navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    onClose();
  };
  
  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-gray-800 border border-gray-700 shadow-lg rounded-md max-h-[70vh] overflow-y-auto z-50">
      {results.length === 0 ? (
        <div className="p-4 text-center text-gray-400">
          Nenhum resultado encontrado
        </div>
      ) : (
        <div className="p-2">
          <ResultGroup title="Jogadores" results={players} onClose={onClose} />
          <ResultGroup title="Notícias" results={news} onClose={onClose} />
          <ResultGroup title="Partidas" results={matches} onClose={onClose} />
          <ResultGroup title="Geral" results={general} onClose={onClose} />
          
          {showAllResultsButton && (
            <div className="mt-3 pt-3 border-t border-gray-700 text-center">
              <button
                onClick={handleViewAllResults}
                className="inline-flex items-center justify-center text-sm text-furia-purple hover:text-furia-purple-light"
              >
                <Search className="h-4 w-4 mr-1" />
                Ver todos os {results.length} resultados
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchResults; 