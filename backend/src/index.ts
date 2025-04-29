import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import userRoutes from './routes/users';
import matchRoutes from './routes/matches';
import messageRoutes from './routes/messages';
import { User } from './models/User';
import { Message } from './models/Message';
import { Match } from './models/Match';

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/furia-chat')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

  socket.on('message', async (message) => {
    try {
      const newMessage = new Message({
        user: message.user,
        content: message.content,
        type: message.type,
        matchId: message.matchId,
        pollOptions: message.pollOptions,
        timestamp: new Date()
      });
      
      await newMessage.save();
      
      const populatedMessage = await Message.findById(newMessage._id).populate('user', 'username');
      io.to('chat').emit('message', populatedMessage);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('match-update', async (update) => {
    try {
      const match = await Match.findById(update.matchId);
      if (match) {
        if (update.type === 'score') {
          await match.updateScore(update.mapIndex, update.furiaScore, update.opponentScore);
        } else if (update.type === 'highlight') {
          await match.addHighlight(update.description, update.highlightType, update.player);
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

// Start server
const PORT = process.env.PORT || 5002;
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 