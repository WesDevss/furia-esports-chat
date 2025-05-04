import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  MessageCircle, 
  TrendingUp, 
  CalendarDays, 
  User, 
  Trophy, 
  Video, 
  ShoppingBag,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SidebarProps {
  className?: string;
  logoSrc: string;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

const Sidebar: React.FC<SidebarProps> = ({ className = '', logoSrc }) => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems: NavItem[] = [
    { path: '/', label: 'Home', icon: <Home size={20} /> },
    { path: '/chat', label: 'Chat', icon: <MessageCircle size={20} /> },
    { path: '/live-match', label: 'Partida Ao Vivo', icon: <TrendingUp size={20} /> },
    { path: '/calendar', label: 'Calendário', icon: <CalendarDays size={20} /> },
    { path: '/results', label: 'Resultados', icon: <Trophy size={20} /> },
    { path: '/players', label: 'Jogadores', icon: <User size={20} /> },
    { path: '/store', label: 'Loja', icon: <ShoppingBag size={20} /> },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const sidebarVariants = {
    open: { x: 0, transition: { type: 'spring', stiffness: 300, damping: 30 } },
    closed: { x: '-100%', transition: { type: 'spring', stiffness: 300, damping: 30 } }
  };

  const itemVariants = {
    open: { opacity: 1, x: 0, transition: { duration: 0.2 } },
    closed: { opacity: 0, x: -20, transition: { duration: 0.2 } }
  };

  return (
    <>
      {/* Mobile menu toggle */}
      <button 
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-full bg-furia-purple md:hidden"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>
      
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 z-40 md:hidden"
            onClick={toggleSidebar}
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="closed"
        animate={isOpen ? 'open' : 'closed'}
        className={`fixed top-0 left-0 h-full z-50 bg-furia-darker shadow-neon-lg p-4 w-64 md:translate-x-0 md:static md:z-0 md:w-auto ${className}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center mb-8 mt-2">
            <img src={logoSrc} alt="FURIA" className="h-10" />
          </div>
          
          <nav className="flex-1">
            <ul className="space-y-2">
              {navItems.map((item, index) => (
                <motion.li
                  key={item.path}
                  variants={itemVariants}
                  custom={index}
                  initial="closed"
                  animate="open"
                >
                  <Link 
                    to={item.path}
                    className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl transition-all
                      ${location.pathname === item.path 
                        ? 'bg-furia-purple text-white' 
                        : 'text-gray-300 hover:bg-furia-dark hover:text-white'}
                    `}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={location.pathname === item.path ? 'text-white' : 'text-furia-purple'}>
                      {item.icon}
                    </span>
                    <span>{item.label}</span>
                  </Link>
                </motion.li>
              ))}
            </ul>
          </nav>
          
          <div className="mt-auto pt-6 border-t border-furia-gray/30">
            <Link 
              to="/profile" 
              className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-furia-dark hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              <span className="bg-furia-purple/20 p-2 rounded-full">
                <User size={18} className="text-furia-purple" />
              </span>
              <div className="text-sm">
                <div className="font-medium">Meu Perfil</div>
                <div className="text-xs text-gray-500">#GoFURIA</div>
              </div>
            </Link>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar; 