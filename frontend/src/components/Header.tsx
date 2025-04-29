import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Bell, 
  UserCircle, 
  Search,
  ChevronDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  logoSrc: string;
}

const Header: React.FC<HeaderProps> = ({ logoSrc }) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const location = useLocation();

  const mainNav = [
    { path: '/', label: 'Home' },
    { path: '/live-match', label: 'Partida Ao Vivo' },
    { path: '/ranking', label: 'Ranking' },
    { path: '/news', label: 'Notícias' },
  ];

  const profileMenuItems = [
    { label: 'Meu Perfil', path: '/profile' },
    { label: 'Configurações', path: '/settings' },
    { label: 'Conquistas', path: '/achievements' },
    { label: 'Sair', path: '/logout' },
  ];

  return (
    <header className="bg-furia-darker shadow-neon sticky top-0 z-40">
      <div className="furia-container py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <img src={logoSrc} alt="FURIA" className="h-8 md:h-10" />
              <span className="ml-2 text-xl font-bold hidden md:block">FURIA Chat</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-2">
            {mainNav.map(item => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-3 py-2 rounded-lg transition-all text-sm ${
                  location.pathname === item.path
                    ? 'bg-furia-purple text-white'
                    : 'text-gray-300 hover:bg-furia-dark hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-1 md:space-x-4">
            <button className="p-2 text-gray-300 hover:text-white bg-furia-black/30 rounded-full">
              <Search size={16} />
            </button>
            
            <button className="relative p-2 text-gray-300 hover:text-white bg-furia-black/30 rounded-full">
              <Bell size={16} />
              <span className="absolute -top-1 -right-1 bg-furia-purple text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>
            
            <div className="relative">
              <button 
                className="flex items-center space-x-2 py-1 px-2 rounded-full hover:bg-furia-black/30"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="h-8 w-8 rounded-full overflow-hidden">
                  <img
                    src="https://via.placeholder.com/32"
                    alt="Profile"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="hidden lg:block text-sm text-left">
                  <div className="font-medium">Fã da FURIA</div>
                  <div className="text-xs text-gray-400">#GoFURIA</div>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence>
                {isProfileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-furia-darker rounded-xl shadow-neon-lg overflow-hidden z-50"
                  >
                    <div className="border-b border-furia-gray/20 p-4">
                      <div className="font-bold">Fã da FURIA</div>
                      <div className="text-xs text-gray-400">fan@furia.com</div>
                    </div>
                    <div className="py-2">
                      {profileMenuItems.map((item, index) => (
                        <Link
                          key={index}
                          to={item.path}
                          className="block px-4 py-2 text-sm text-gray-300 hover:bg-furia-purple hover:text-white"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 