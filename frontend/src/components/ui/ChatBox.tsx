import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, User, Bot } from 'lucide-react';
import { motion } from 'framer-motion';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatBoxProps {
  messages: Message[];
  onSendMessage: (message: string) => void;
  isTyping?: boolean;
  placeholderText?: string;
  className?: string;
}

const ChatBox: React.FC<ChatBoxProps> = ({
  messages,
  onSendMessage,
  isTyping = false,
  placeholderText = 'Digite sua mensagem...',
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (inputValue.trim()) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div className={`flex flex-col bg-furia-darker rounded-2xl shadow-neon overflow-hidden ${className}`}>
      <div className="flex items-center p-4 bg-furia-dark border-b border-furia-gray/20">
        <div className="mr-3 p-2 bg-furia-purple/20 rounded-full">
          <Bot size={18} className="text-furia-purple" />
        </div>
        <div>
          <h3 className="font-bold">FURIBOT</h3>
          <p className="text-xs text-gray-400">Assistente Oficial FURIA</p>
        </div>
        <div className="ml-auto flex items-center">
          <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
          <span className="text-xs text-gray-400">Online</span>
        </div>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-furia-gray scrollbar-track-furia-darker">
        <div className="space-y-4">
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.sender === 'bot' && (
                <div className="flex-shrink-0 mr-2">
                  <div className="bg-furia-purple/20 p-1.5 rounded-full">
                    <Bot size={14} className="text-furia-purple" />
                  </div>
                </div>
              )}
              
              <div 
                className={`max-w-[80%] p-3 rounded-xl ${
                  message.sender === 'user' 
                    ? 'bg-furia-purple text-white rounded-tr-none' 
                    : 'bg-furia-gray/20 text-white rounded-tl-none'
                }`}
              >
                <p>{message.text}</p>
                <div className={`text-[10px] mt-1 ${message.sender === 'user' ? 'text-furia-purple-light' : 'text-gray-400'}`}>
                  {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              
              {message.sender === 'user' && (
                <div className="flex-shrink-0 ml-2">
                  <div className="bg-furia-purple p-1.5 rounded-full">
                    <User size={14} className="text-white" />
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="flex-shrink-0 mr-2">
                <div className="bg-furia-purple/20 p-1.5 rounded-full">
                  <Bot size={14} className="text-furia-purple" />
                </div>
              </div>
              <div className="bg-furia-gray/20 p-3 rounded-xl rounded-tl-none">
                <div className="flex space-x-1">
                  <div className="h-2 w-2 bg-furia-purple/70 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-furia-purple/70 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-furia-purple/70 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </motion.div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-3 border-t border-furia-gray/20">
        <div className="flex items-center bg-furia-black/30 rounded-xl overflow-hidden pl-4">
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={placeholderText}
            className="flex-1 bg-transparent border-none outline-none py-3 text-white placeholder-gray-500"
          />
          <div className="flex">
            <button
              type="button"
              className="p-3 text-furia-purple hover:text-furia-purple-light transition-colors"
            >
              <Mic size={20} />
            </button>
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className={`p-3 ${inputValue.trim() ? 'text-furia-purple hover:text-furia-purple-light' : 'text-gray-600'} transition-colors`}
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ChatBox; 