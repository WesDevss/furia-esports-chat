import express from 'express';
import { Match } from '../models/Match';
import { Message } from '../models/Message';
import { isValidObjectId } from 'mongoose';

const router = express.Router();

/**
 * @route   GET /api/matches
 * @desc    Get all matches
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const matches = await Match.find();
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/matches/live
 * @desc    Get all live matches
 * @access  Public
 */
router.get('/live', async (req, res) => {
  try {
    const matches = await Match.find({ status: 'live' });
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/matches/upcoming
 * @desc    Get all upcoming matches
 * @access  Public
 */
router.get('/upcoming', async (req, res) => {
  try {
    const matches = await Match.find({ 
      status: 'scheduled',
      startTime: { $gt: new Date() }
    }).sort({ startTime: 1 });
    
    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/matches/:id
 * @desc    Get match by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid match ID' });
    }
    
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/matches
 * @desc    Create a new match
 * @access  Private (Admin)
 */
router.post('/', async (req, res) => {
  try {
    const { opponent, tournament, startTime, maps } = req.body;
    
    if (!opponent || !tournament || !startTime) {
      return res.status(400).json({ message: 'Opponent, tournament and start time are required' });
    }
    
    const match = new Match({
      opponent,
      tournament,
      startTime: new Date(startTime),
      status: 'scheduled',
      maps: maps || []
    });
    
    await match.save();
    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/matches/:id
 * @desc    Update match details
 * @access  Private (Admin)
 */
router.put('/:id', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid match ID' });
    }
    
    const { opponent, tournament, startTime, endTime, status, maps } = req.body;
    
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    if (opponent) match.opponent = opponent;
    if (tournament) match.tournament = tournament;
    if (startTime) match.startTime = new Date(startTime);
    if (endTime) match.endTime = new Date(endTime);
    if (status && ['scheduled', 'live', 'completed'].includes(status)) match.status = status;
    if (maps && Array.isArray(maps)) match.maps = maps;
    
    await match.save();
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PATCH /api/matches/:id/update-score
 * @desc    Update map score
 * @access  Private (Admin)
 */
router.patch('/:id/update-score', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid match ID' });
    }
    
    const { mapIndex, furiaScore, opponentScore } = req.body;
    
    if (mapIndex === undefined || furiaScore === undefined || opponentScore === undefined) {
      return res.status(400).json({ message: 'Map index, Furia score and opponent score are required' });
    }
    
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    await match.updateScore(mapIndex, furiaScore, opponentScore);
    
    // Create a match-update message
    const message = new Message({
      user: req.body.userId, // Admin user ID
      content: `Placar atualizado: FURIA ${furiaScore} vs ${opponentScore} ${match.opponent} (Mapa: ${match.maps[mapIndex].name})`,
      type: 'match-update',
      matchId: match._id,
      timestamp: new Date()
    });
    
    await message.save();
    
    res.json(match);
  } catch (error: any) {
    if (error.message === 'Invalid map index') {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PATCH /api/matches/:id/add-highlight
 * @desc    Add a highlight
 * @access  Private (Admin)
 */
router.patch('/:id/add-highlight', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid match ID' });
    }
    
    const { description, type, player } = req.body;
    
    if (!description || !type || !player) {
      return res.status(400).json({ message: 'Description, type and player are required' });
    }
    
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    await match.addHighlight(description, type, player);
    
    // Create a match-update message for the highlight
    const message = new Message({
      user: req.body.userId, // Admin user ID
      content: `${type.toUpperCase()}: ${player} - ${description}`,
      type: 'match-update',
      matchId: match._id,
      timestamp: new Date()
    });
    
    await message.save();
    
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PATCH /api/matches/:id/create-poll
 * @desc    Create a poll for a match
 * @access  Private (Admin)
 */
router.patch('/:id/create-poll', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid match ID' });
    }
    
    const { question, options, duration } = req.body;
    
    if (!question || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ message: 'Question and at least 2 options are required' });
    }
    
    const match = await Match.findById(req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    await match.createPoll(question, options, duration || 10); // Default 10 minutes duration
    
    // Create a poll message
    const message = new Message({
      user: req.body.userId, // Admin user ID
      content: question,
      type: 'poll',
      matchId: match._id,
      pollOptions: options,
      timestamp: new Date()
    });
    
    await message.save();
    
    res.json(match);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/matches/:id/messages
 * @desc    Get messages for a specific match
 * @access  Public
 */
router.get('/:id/messages', async (req, res) => {
  try {
    if (!isValidObjectId(req.params.id)) {
      return res.status(400).json({ message: 'Invalid match ID' });
    }
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const messages = await Message.find({ matchId: req.params.id })
      .populate('user', 'username')
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(limit);
    
    const total = await Message.countDocuments({ matchId: req.params.id });
    
    res.json({
      messages,
      totalPages: Math.ceil(total / limit),
      currentPage: page
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 