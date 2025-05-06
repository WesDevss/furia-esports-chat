import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import matchRoutes from './routes/matches';
import messageRoutes from './routes/messages';
import quizRoutes from './routes/quizzes';
import { Message } from './types';
import { config, validateConfig } from './config';
import { mockData, initMockData } from './data/mockData';

dotenv.config();

// Validar configurações críticas
validateConfig();

// Exportando dados mock para uso em rotas
export { mockData };

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3004'],
    methods: ['GET', 'POST'],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Basic route for testing
app.get('/', (_req, res) => {
  res.send('FURIA Chat API is running');
});

// Routes
app.use('/api/users', userRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/quizzes', quizRoutes);

// Configurando socket.io para comunicação em tempo real
setupSocketIO(io);

// Inicializa dados para desenvolvimento
initMockData();

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

/**
 * Configura os eventos do Socket.IO para comunicação em tempo real
 */
function setupSocketIO(io: Server): void {
  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    socket.on('join', ({ username }) => {
      socket.join('chat');
      socket.broadcast.to('chat').emit('message', {
        id: Date.now().toString(),
        user: 'System',
        content: `${username} entrou no chat!`,
        timestamp: new Date(),
        type: 'text',
      });
    });

    socket.on('message', (message) => {
      try {
        const newMessage: Message = {
          _id: Date.now().toString(),
          user: message.user,
          content: message.content,
          type: message.type || 'text',
          matchId: message.matchId,
          pollOptions: message.pollOptions,
          timestamp: new Date(),
          reactions: []
        };
        
        mockData.messages.push(newMessage);
        
        const user = mockData.users.find(u => u._id === message.user);
        const populatedMessage = {
          ...newMessage,
          user: { _id: user?._id || 'unknown', username: user?.username || 'Anonymous' }
        };
        
        io.to('chat').emit('message', populatedMessage);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    socket.on('match-update', handleMatchUpdate);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });
}

/**
 * Processa atualizações de partidas
 */
function handleMatchUpdate(update: any): void {
  try {
    const matchIndex = mockData.matches.findIndex(m => m._id === update.matchId);
    if (matchIndex !== -1) {
      const match = mockData.matches[matchIndex];
      
      if (update.type === 'score') {
        updateMatchScore(match, update);
      } else if (update.type === 'highlight') {
        addMatchHighlight(match, update);
      }
      
      io.to('chat').emit('match-update', { match });
    }
  } catch (error) {
    console.error('Error updating match:', error);
  }
}

/**
 * Atualiza o placar de uma partida
 */
function updateMatchScore(match: any, update: any): void {
  if (match.maps && match.maps[update.mapIndex]) {
    match.maps[update.mapIndex].furiaScore = update.furiaScore;
    match.maps[update.mapIndex].opponentScore = update.opponentScore;
  }
}

/**
 * Adiciona um destaque a uma partida
 */
function addMatchHighlight(match: any, update: any): void {
  if (!match.highlights) match.highlights = [];
  match.highlights.push({
    description: update.description,
    type: update.highlightType,
    player: update.player,
    timestamp: new Date()
  });
} 