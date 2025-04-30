import express from 'express';
import { mockData } from '../index';
import { Message, PollVote } from '../types';

const router = express.Router();

/**
 * @route   GET /api/messages
 * @desc    Get all messages (with pagination)
 * @access  Public
 */
router.get('/', (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const matchId = req.query.matchId as string;
    
    let filteredMessages = [...mockData.messages];
    
    if (matchId) {
      filteredMessages = filteredMessages.filter(msg => msg.matchId === matchId);
    }
    
    // Sort by timestamp (newest first)
    filteredMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedMessages = filteredMessages.slice(startIndex, endIndex);
    
    // Populate user data
    const messagesWithUser = paginatedMessages.map(message => {
      const user = mockData.users.find(u => u._id === message.user);
      return {
        ...message,
        user: user ? { _id: user._id, username: user.username } : { _id: 'unknown', username: 'Anonymous' }
      };
    });
    
    return res.json({
      messages: messagesWithUser,
      totalPages: Math.ceil(filteredMessages.length / limit),
      currentPage: page
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/messages/:id
 * @desc    Get message by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const message = mockData.messages.find(m => m._id === req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    // Populate user data
    const user = mockData.users.find(u => u._id === message.user);
    const messageWithUser = {
      ...message,
      user: user ? { _id: user._id, username: user.username } : { _id: 'unknown', username: 'Anonymous' }
    };
    
    return res.json(messageWithUser);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/messages
 * @desc    Create a new message
 * @access  Private
 */
router.post('/', (req, res) => {
  try {
    const { user, content, type, matchId, pollOptions } = req.body;
    
    if (!user || !content) {
      return res.status(400).json({ message: 'User and content are required' });
    }
    
    // Check if user exists
    const userExists = mockData.users.some(u => u._id === user);
    if (!userExists) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Check if match exists if matchId is provided
    if (matchId) {
      const matchExists = mockData.matches.some(m => m._id === matchId);
      if (!matchExists) {
        return res.status(400).json({ message: 'Invalid match ID' });
      }
    }
    
    const newMessage: Message = {
      _id: Date.now().toString(),
      user,
      content,
      type: type || 'text',
      timestamp: new Date(),
      reactions: [],
      ...(matchId && { matchId }),
      ...(type === 'poll' && pollOptions && Array.isArray(pollOptions) && { pollOptions })
    };
    
    // Add to mock data
    mockData.messages.push(newMessage);
    
    // Populate user data
    const userData = mockData.users.find(u => u._id === user);
    const populatedMessage = {
      ...newMessage,
      user: { _id: userData?._id || 'unknown', username: userData?.username || 'Anonymous' }
    };
    
    return res.status(201).json(populatedMessage);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/messages/:id/react
 * @desc    Add a reaction to a message
 * @access  Private
 */
router.post('/:id/react', (req, res) => {
  try {
    const { userId, reaction } = req.body;
    
    if (!userId || !reaction) {
      return res.status(400).json({ message: 'User ID and reaction are required' });
    }
    
    // Check if user exists
    const userExists = mockData.users.some(u => u._id === userId);
    if (!userExists) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    // Find message
    const messageIndex = mockData.messages.findIndex(m => m._id === req.params.id);
    if (messageIndex === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    const message = mockData.messages[messageIndex];
    
    // Check if user already reacted
    if (!message.reactions) message.reactions = [];
    const existingReaction = message.reactions.findIndex(r => r.userId === userId);
    
    if (existingReaction !== -1) {
      // Update existing reaction
      message.reactions[existingReaction].reaction = reaction;
      message.reactions[existingReaction].type = reaction;
    } else {
      // Add new reaction
      message.reactions.push({ userId, reaction, type: reaction });
    }
    
    return res.json(message);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/messages/:id/vote
 * @desc    Vote in a poll message
 * @access  Private
 */
router.post('/:id/vote', (req, res) => {
  try {
    const { userId, option } = req.body;
    
    if (!userId || !option) {
      return res.status(400).json({ message: 'User ID and option are required' });
    }
    
    // Find message
    const messageIndex = mockData.messages.findIndex(m => m._id === req.params.id);
    if (messageIndex === -1) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    const message = mockData.messages[messageIndex];
    
    if (message.type !== 'poll') {
      return res.status(400).json({ message: 'This message is not a poll' });
    }
    
    // Initialize pollVotes if not exists
    if (!message.pollVotes) message.pollVotes = [];
    
    // Check if user already voted
    const existingVote = message.pollVotes.findIndex((vote: PollVote) => vote.userId === userId);
    if (existingVote !== -1) {
      return res.status(400).json({ message: 'User has already voted' });
    }
    
    // Check if option is valid
    const validOption = message.pollOptions?.includes(option);
    if (!validOption) {
      return res.status(400).json({ message: 'Invalid poll option' });
    }
    
    // Add vote
    message.pollVotes.push({ userId, option });
    
    return res.json(message);
  } catch (error: any) {
    if (error.message === 'User has already voted' || error.message === 'Invalid poll option') {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 