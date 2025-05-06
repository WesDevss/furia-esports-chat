import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './routes/users';
import matchRoutes from './routes/matches';
import messageRoutes from './routes/messages';
import quizRoutes from './routes/quizzes';
import { MockData, Message } from './types';
import { config, validateConfig } from './config';

dotenv.config();

// Validar configurações críticas
validateConfig();

// Mock data storage (in-memory)
const mockData: MockData = {
  users: [],
  matches: [],
  messages: []
};

// Export mock data so routes can use it
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

// Socket.IO connection handling
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
      
      // Add to mock data
      mockData.messages.push(newMessage);
      
      // Find user in mock data to populate username
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

  socket.on('match-update', (update) => {
    try {
      const matchIndex = mockData.matches.findIndex(m => m._id === update.matchId);
      if (matchIndex !== -1) {
        const match = mockData.matches[matchIndex];
        
        if (update.type === 'score') {
          if (match.maps && match.maps[update.mapIndex]) {
            match.maps[update.mapIndex].furiaScore = update.furiaScore;
            match.maps[update.mapIndex].opponentScore = update.opponentScore;
          }
        } else if (update.type === 'highlight') {
          if (!match.highlights) match.highlights = [];
          match.highlights.push({
            description: update.description,
            type: update.highlightType,
            player: update.player,
            timestamp: new Date()
          });
        }
        
        io.to('chat').emit('match-update', { match });
      }
    } catch (error) {
      console.error('Error updating match:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Initialize with some mock data
const initMockData = () => {
  // Users
  mockData.users = [
    { _id: '1', username: 'FuriaFan123', email: 'fan@example.com', password: 'hashed_password', level: 23, points: 12580, region: 'América do Sul', country: 'Brasil' },
    { _id: '2', username: 'CSGOMaster', email: 'csgo@example.com', password: 'hashed_password', level: 21, points: 11840, region: 'América do Sul', country: 'Brasil' },
    { _id: '3', username: 'KSceFã', email: 'ksce@example.com', password: 'hashed_password', level: 20, points: 10950, region: 'América do Sul', country: 'Argentina' }
  ];
  
  // Matches
  mockData.matches = [
    {
      _id: '1',
      opponent: 'NAVI',
      opponentLogo: '/team-logos/navi-logo.png',
      tournament: 'Major Rio 2024',
      status: 'live',
      maps: [
        { name: 'Inferno', furiaScore: 13, opponentScore: 10 },
        { name: 'Nuke', furiaScore: 7, opponentScore: 9 }
      ],
      highlights: [
        { description: 'Art fez um clutch 1v3!', type: 'clutch', player: 'Art', timestamp: new Date() }
      ]
    },
    {
      _id: '2',
      opponent: 'FaZe Clan',
      opponentLogo: '/team-logos/faze-logo.png',
      tournament: 'ESL Pro League',
      status: 'scheduled',
      maps: [],
      startTime: new Date(Date.now() + 86400000) // Tomorrow
    }
  ];
  
  // Messages
  mockData.messages = [
    {
      _id: '1',
      user: '1',
      content: 'Vamos FURIA!!!',
      type: 'text',
      timestamp: new Date(Date.now() - 300000),
      reactions: []
    },
    {
      _id: '2',
      user: '2',
      content: 'Grande jogada do Art!',
      type: 'text',
      timestamp: new Date(Date.now() - 200000),
      reactions: []
    }
  ];
};

// Initialize mock data
initMockData();

// Start server
const PORT = config.port;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 