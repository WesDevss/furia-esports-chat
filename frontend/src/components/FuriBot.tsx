import React, { useState, useEffect, useRef } from 'react';
import { Bot, MessageSquare, User, RefreshCw, X, MessageCircle } from 'lucide-react';
import { getFuriaInformation } from '../services/openai';

interface FuriBotProps {
  onSendMessage: (message: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onToggle: () => void;
}

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

// Types for bot memory
interface BotMemory {
  favoriteTeam?: string;
  favoritePlayer?: string;
  preferredGame?: string;
  lastInteraction?: Date;
  previousQueries?: string[];
}

const FuriBot: React.FC<FuriBotProps> = ({ onSendMessage, isOpen, onClose, onToggle }) => {
  const [userInput, setUserInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [memory, setMemory] = useState<BotMemory>(() => {
    // Try to load memory from localStorage
    const savedMemory = localStorage.getItem('furibot_memory');
    return savedMemory ? JSON.parse(savedMemory) : {};
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Save memory to localStorage whenever it changes
    localStorage.setItem('furibot_memory', JSON.stringify(memory));
  }, [memory]);

  useEffect(() => {
    // Scroll to bottom when messages change or when opened
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const saveToMemory = (key: keyof BotMemory, value: any) => {
    setMemory(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    // Add user message to chat
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInput,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    // Track query in memory
    saveToMemory('previousQueries', [
      ...(memory.previousQueries || []).slice(-4),
      userInput
    ]);
    saveToMemory('lastInteraction', new Date());

    setIsLoading(true);
    
    try {
      // Get response from ChatGPT
      const response = await getFuriaInformation(userInput);
      
      // Add bot response to chat
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: response,
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      
      // Check if the user mentioned specific things we want to remember
      const lowerInput = userInput.toLowerCase();
      
      if (lowerInput.includes('jogador favorito') || lowerInput.includes('favorite player')) {
        const players = ['yuurih', 'kscerato', 'art', 'fall3n', 'chelo', 'saffee'];
        const playerMatch = players.find(player => lowerInput.includes(player.toLowerCase()));
        if (playerMatch) {
          saveToMemory('favoritePlayer', playerMatch);
        }
      }
      
      if (lowerInput.includes('jogo favorito') || lowerInput.includes('favorite game')) {
        const games = ['cs', 'cs2', 'counter-strike', 'valorant', 'league', 'lol', 'apex'];
        for (const game of games) {
          if (lowerInput.includes(game)) {
            saveToMemory('preferredGame', game);
            break;
          }
        }
      }
    } catch (error) {
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Desculpe, estou tendo problemas para processar sua pergunta. Por favor, tente novamente mais tarde.',
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setUserInput('');
    }
  };

  return (
    <>
      {/* Botão flutuante para abrir o chat (sempre visível) */}
      <button 
        onClick={onToggle}
        className="fixed bottom-8 right-8 bg-furia-purple hover:bg-furia-purple/90 text-white p-4 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 flex items-center justify-center"
        aria-label="Abrir FURIBOT"
      >
        <div className="relative">
          <Bot className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-900"></span>
        </div>
      </button>

      {/* Chat box - mostrado apenas quando isOpen é true */}
      {isOpen && (
        <div className="fixed bottom-8 right-8 w-80 bg-gray-800 dark:bg-gray-900 rounded-lg shadow-xl border border-gray-700 overflow-hidden z-50 animate-slide-up">
          {/* Header */}
          <div className="bg-furia-purple p-3 flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="h-6 w-6 text-white mr-2" />
              <h3 className="text-white font-bold">FURIBOT</h3>
              <span className="ml-2 h-2 w-2 rounded-full bg-green-400"></span>
              <span className="ml-1 text-xs text-gray-300">Online</span>
            </div>
            <button 
              onClick={onClose}
              className="text-gray-300 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Chat area */}
          <div className="h-80 overflow-y-auto p-3 bg-gray-900 dark:bg-black">
            {messages.length > 0 ? (
              <>
                {/* Messages */}
                {messages.map((message) => (
                  <div key={message.id} className={`flex mb-4 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`rounded-lg p-3 max-w-[80%] ${message.sender === 'user' ? 'bg-gray-700' : 'bg-furia-purple'}`}>
                      <p className="text-white">{message.content}</p>
                      <span className="text-xs text-gray-400 mt-1 block">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center text-gray-500">
                  <MessageCircle className="h-10 w-10 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Digite uma mensagem para iniciar a conversa</p>
                </div>
              </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
              <div className="flex mb-4">
                <div className="bg-gray-700 rounded-lg p-3">
                  <RefreshCw className="h-5 w-5 text-furia-purple animate-spin" />
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <form onSubmit={handleSubmit} className="p-3 border-t border-gray-700">
            <div className="flex">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 bg-gray-700 dark:bg-gray-800 text-white rounded-l-md px-3 py-2 focus:outline-none"
                placeholder="Pergunte algo sobre a FURIA..."
                disabled={isLoading}
                autoFocus
              />
              <button
                type="submit"
                className="bg-furia-purple text-white px-4 py-2 rounded-r-md hover:bg-purple-700 transition duration-200"
                disabled={isLoading}
              >
                <MessageSquare className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};

export default FuriBot; 