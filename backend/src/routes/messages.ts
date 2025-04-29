import express from 'express';
import { Message } from '../models/Message';
import { isValidObjectId } from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/messages
 * @desc    Get all messages (with pagination)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    const matchId = req.query.matchId;
    
    const query: any = {};
    
    if (matchId && isValidObjectId(matchId)) {
      query.matchId = matchId;
    }
    
    const messages = await Message.find(query)
      .populate('user', 'username')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Message.countDocuments(query);
    
    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/messages/:id
 * @desc    Get message by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }
    
    const message = await Message.findById(req.params.id)
      .populate('user', 'username');
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/messages
 * @desc    Create a new message
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const { user, content, type, matchId, pollOptions } = req.body;
    
    if (!user || !content) {
      return res.status(400).json({ message: 'User and content are required' });
    }
    
    if (!isValidObjectId(user)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }
    
    if (matchId && !isValidObjectId(matchId)) {
      return res.status(400).json({ message: 'Invalid match ID' });
    }
    
    const messageData: any = {
      user,
      content,
      type: type || 'text',
      timestamp: new Date()
    };
    
    if (matchId) {
      messageData.matchId = matchId;
    }
    
    if (type === 'poll' && pollOptions && Array.isArray(pollOptions)) {
      messageData.pollOptions = pollOptions;
    }
    
    const message = new Message(messageData);
    await message.save();
    
    const populatedMessage = await Message.findById(message._id)
      .populate('user', 'username');
    
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/messages/:id/react
 * @desc    Add a reaction to a message
 * @access  Private
 */
router.post('/:id/react', async (req, res) => {
  try {
    const { userId, reaction } = req.body;
    
    if (!userId || !reaction) {
      return res.status(400).json({ message: 'User ID and reaction are required' });
    }
    
    if (!isValidObjectId(req.params.id) || !isValidObjectId(userId)) {
      return res.status(400).json({ message: 'Invalid ID format' });
    }
    
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    await message.addReaction(userId, reaction);
    
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/messages/:id/vote
 * @desc    Vote in a poll message
 * @access  Private
 */
router.post('/:id/vote', async (req, res) => {
  try {
    const { userId, option } = req.body;
    
    if (!userId || !option) {
      return res.status(400).json({ message: 'User ID and option are required' });
    }
    
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid message ID' });
    }
    
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    
    if (message.type !== 'poll') {
      return res.status(400).json({ message: 'This message is not a poll' });
    }
    
    await message.vote(userId, option);
    
    res.json(message);
  } catch (error: any) {
    if (error.message === 'User has already voted' || error.message === 'Invalid poll option') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 