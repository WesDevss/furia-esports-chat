import React from 'react';
import { Bot, Gift } from 'lucide-react';
import { useFuriBot } from '../hooks/useFuriBot';

interface FuriBotButtonProps {
  variant?: 'icon' | 'card' | 'minimal';
  className?: string;
}

const FuriBotButton: React.FC<FuriBotButtonProps> = ({ 
  variant = 'icon',
  className = ''
}) => {
  const { openFuriBot } = useFuriBot();
  
  if (variant === 'card') {
    return (
      <button
        onClick={openFuriBot}
        className={`w-full bg-furia-purple hover:bg-purple-700 rounded-lg p-3 flex items-center gap-3 transition duration-200 ${className}`}
      >
        <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center">
          <Gift className="h-6 w-6 text-furia-purple" />
        </div>
        <div className="text-left">
          <h3 className="font-bold text-white">FURIBOT</h3>
          <p className="text-xs text-gray-200">Pergunte sobre estatísticas e jogadores</p>
        </div>
      </button>
    );
  }
  
  if (variant === 'minimal') {
    return (
      <button 
        onClick={openFuriBot}
        className={`flex items-center gap-2 text-sm hover:text-furia-purple transition-colors ${className}`}
      >
        <Bot className="h-4 w-4" />
        <span>Abrir FURIBOT</span>
      </button>
    );
  }
  
  // Default 'icon' variant
  return (
    <button 
      onClick={openFuriBot}
      className={`fixed bottom-8 right-8 bg-furia-purple hover:bg-furia-purple/90 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 flex items-center justify-center ${className}`}
      aria-label="Abrir FURIBOT"
    >
      <div className="relative">
        <Bot className="h-6 w-6" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
      </div>
    </button>
  );
};

export default FuriBotButton; 