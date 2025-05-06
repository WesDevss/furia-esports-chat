import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, User, Search, Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';
import { useFuriBot } from '../hooks/useFuriBot';
import { searchContent, SearchResult } from '../services/searchService';
import SearchResults from './SearchResults';

type NavItem = {
  path: string;
  label: string;
};

const navItems: NavItem[] = [
  { path: '/', label: 'Home' },
  { path: '/chat', label: 'Chat' },
  { path: '/live-match', label: 'Partida Ao Vivo' },
  { path: '/leaderboard', label: 'Ranking' },
];

type NavbarLogoProps = {
  className?: string;
};

const NavbarLogo: React.FC<NavbarLogoProps> = ({ className }) => (
  <Link to="/" className={`flex-shrink-0 flex items-center ${className || ''}`}>
    <img
      className="h-10 w-auto"
      src="/furia-logo.jpeg"
      alt="FURIA Logo"
    />
    <span className="ml-2 text-white font-bold text-lg">FURIA Chat</span>
  </Link>
);

type SearchBoxProps = {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  showResults: boolean;
  className?: string;
};

const SearchBox: React.FC<SearchBoxProps> = ({ 
  searchQuery, 
  setSearchQuery, 
  onSubmit,
  showResults,
  className
}) => {
  // Referência para o input para foco automático
  const inputRef = useRef<HTMLInputElement>(null);

  // Realizar pesquisa ao digitar
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Focar no input quando o componente montar
  useEffect(() => {
    if (showResults && inputRef.current) {
      inputRef.current.focus();
    }
  }, [showResults]);

  return (
    <form onSubmit={onSubmit} className={`w-full ${className || ''}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          className="block w-full pl-10 pr-3 py-2 rounded-md bg-gray-700 dark:bg-gray-800 text-gray-200 border border-transparent focus:border-furia-purple focus:ring-1 focus:ring-furia-purple"
          placeholder="Jogadores, notícias, partidas..."
          value={searchQuery}
          onChange={handleChange}
        />
      </div>
    </form>
  );
};

type ThemeToggleProps = {
  theme: string;
  toggleTheme: () => void;
  className?: string;
};

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, toggleTheme, className }) => (
  <button
    onClick={toggleTheme}
    className={`p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white ${className || ''}`}
    aria-label="Toggle theme"
  >
    {theme === 'dark' ? (
      <Sun className="h-5 w-5" />
    ) : (
      <Moon className="h-5 w-5" />
    )}
  </button>
);

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const { openFuriBot } = useFuriBot();
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Pesquisar quando a query mudar
  useEffect(() => {
    if (searchQuery.trim().length >= 2) {
      const results = searchContent(searchQuery);
      setSearchResults(results);
      setShowResults(true);
    } else {
      setSearchResults([]);
      setShowResults(false);
    }
  }, [searchQuery]);

  // Fechar resultados ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current && 
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fechar resultados ao navegar
  useEffect(() => {
    setShowResults(false);
    setSearchQuery('');
  }, [location.pathname]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      // Navegar para página de pesquisa completa
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
      setShowResults(false);
    }
  };

  const closeSearchResults = () => {
    setShowResults(false);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const renderDesktopNav = () => (
    <div className="hidden md:flex items-center space-x-4">
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          className={`px-3 py-2 rounded-md text-sm font-medium ${
            location.pathname === item.path
              ? 'bg-gray-900 dark:bg-gray-800 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'
          }`}
        >
          {item.label}
        </Link>
      ))}
      
      <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
      
      <Link
        to="/profile"
        className="p-2 rounded-full text-gray-300 hover:bg-gray-700 hover:text-white"
      >
        <User className="h-6 w-6" />
      </Link>
    </div>
  );

  const renderMobileNav = () => (
    <div className="md:hidden">
      <div className="px-2 pt-2 pb-3">
        <SearchBox 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onSubmit={handleSearch}
          showResults={showResults}
        />
      </div>
      
      <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              location.pathname === item.path
                ? 'bg-gray-900 text-white'
                : 'text-gray-300 hover:bg-gray-700 hover:text-white'
            }`}
            onClick={() => setIsOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        
        <Link
          to="/profile"
          className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:bg-gray-700 hover:text-white"
          onClick={() => setIsOpen(false)}
        >
          Perfil
        </Link>
      </div>
    </div>
  );

  return (
    <nav className="bg-gray-800 dark:bg-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <NavbarLogo />
          </div>

          <div className="hidden md:flex items-center flex-1 max-w-md mx-4 relative" ref={searchContainerRef}>
            <SearchBox 
              searchQuery={searchQuery} 
              setSearchQuery={setSearchQuery} 
              onSubmit={handleSearch}
              showResults={showResults}
            />
            
            {/* Exibir resultados da pesquisa */}
            {showResults && searchResults.length > 0 && (
              <SearchResults 
                results={searchResults} 
                onClose={closeSearchResults} 
                searchQuery={searchQuery}
              />
            )}
          </div>

          {renderDesktopNav()}

          <div className="md:hidden flex items-center">
            <ThemeToggle 
              theme={theme} 
              toggleTheme={toggleTheme} 
              className="mr-2" 
            />
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div ref={searchContainerRef}>
          {renderMobileNav()}
          
          {/* Resultados da pesquisa em mobile */}
          {showResults && searchResults.length > 0 && (
            <div className="px-2 pb-3">
              <SearchResults 
                results={searchResults} 
                onClose={closeSearchResults} 
                searchQuery={searchQuery}
              />
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar; 