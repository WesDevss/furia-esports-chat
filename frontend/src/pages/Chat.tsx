import React, { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'match-update' | 'poll';
}

const Chat: React.FC = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [username, setUsername] = useState('');
  const [isJoined, setIsJoined] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const newSocket = io('http://localhost:5004');
    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on('message', (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });

      socket.on('match-update', (update: Message) => {
        setMessages((prev) => [...prev, update]);
      });
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      setIsJoined(true);
      socket?.emit('join', { username });
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && socket) {
      const message: Message = {
        id: Date.now().toString(),
        user: username,
        content: newMessage,
        timestamp: new Date(),
        type: 'text',
      };
      socket.emit('message', message);
      setNewMessage('');
    }
  };

  if (!isJoined) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-800 p-8 rounded-lg w-full max-w-md"
        >
          <h2 className="text-2xl font-bold mb-6 text-center">Entrar no Chat</h2>
          <form onSubmit={handleJoin} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Seu Nome
              </label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Digite seu nome"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition duration-300"
            >
              Entrar
            </button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[80vh]">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className={`flex ${
                message.user === username ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[70%] rounded-lg p-3 ${
                  message.type === 'match-update'
                    ? 'bg-yellow-600'
                    : message.user === username
                    ? 'bg-red-600'
                    : 'bg-gray-700'
                }`}
              >
                {message.type === 'match-update' ? (
                  <div className="text-center">
                    <p className="font-bold">{message.content}</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-300 mb-1">{message.user}</p>
                    <p>{message.content}</p>
                    <p className="text-xs text-gray-300 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </p>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-700">
        <div className="flex space-x-4">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 px-4 py-2 rounded-md bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            placeholder="Digite sua mensagem..."
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-md transition duration-300"
          >
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat; 