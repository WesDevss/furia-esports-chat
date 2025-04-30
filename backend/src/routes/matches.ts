import express from 'express';
import { mockData } from '../index';

const router = express.Router();

/**
 * @route   GET /api/matches
 * @desc    Get all matches
 * @access  Public
 */
router.get('/', (_req, res) => {
  try {
    return res.json(mockData.matches);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/matches/live
 * @desc    Get all live matches
 * @access  Public
 */
router.get('/live', (_req, res) => {
  try {
    const matches = mockData.matches.filter(match => match.status === 'live');
    return res.json(matches);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/matches/upcoming
 * @desc    Get all upcoming matches
 * @access  Public
 */
router.get('/upcoming', (_req, res) => {
  try {
    const now = new Date();
    const matches = mockData.matches
      .filter(match => match.status === 'scheduled' && match.startTime && match.startTime > now)
      .sort((a, b) => (a.startTime as Date).getTime() - (b.startTime as Date).getTime());
    
    return res.json(matches);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/matches/:id
 * @desc    Get match by ID
 * @access  Public
 */
router.get('/:id', (req, res) => {
  try {
    const match = mockData.matches.find(m => m._id === req.params.id);
    
    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    return res.json(match);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   POST /api/matches
 * @desc    Create a new match
 * @access  Private (Admin)
 */
router.post('/', (req, res) => {
  try {
    const { opponent, tournament, startTime, maps } = req.body;
    
    if (!opponent || !tournament || !startTime) {
      return res.status(400).json({ message: 'Opponent, tournament and start time are required' });
    }
    
    const newMatch = {
      _id: Date.now().toString(),
      opponent,
      tournament,
      startTime: new Date(startTime),
      status: 'scheduled' as const,
      maps: maps || []
    };
    
    mockData.matches.push(newMatch);
    return res.status(201).json(newMatch);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PUT /api/matches/:id
 * @desc    Update match details
 * @access  Private (Admin)
 */
router.put('/:id', (req, res) => {
  try {
    const { opponent, tournament, startTime, status, maps } = req.body;
    
    const matchIndex = mockData.matches.findIndex(m => m._id === req.params.id);
    
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    const match = mockData.matches[matchIndex];
    
    if (opponent) match.opponent = opponent;
    if (tournament) match.tournament = tournament;
    if (startTime) match.startTime = new Date(startTime);
    if (status && ['scheduled', 'live', 'finished'].includes(status)) {
      match.status = status as 'scheduled' | 'live' | 'finished';
    }
    if (maps && Array.isArray(maps)) match.maps = maps;
    
    return res.json(match);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PATCH /api/matches/:id/update-score
 * @desc    Update map score
 * @access  Private (Admin)
 */
router.patch('/:id/update-score', (req, res) => {
  try {
    const { mapIndex, furiaScore, opponentScore } = req.body;
    
    if (mapIndex === undefined || furiaScore === undefined || opponentScore === undefined) {
      return res.status(400).json({ message: 'Map index, Furia score and opponent score are required' });
    }
    
    const matchIndex = mockData.matches.findIndex(m => m._id === req.params.id);
    
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    const match = mockData.matches[matchIndex];
    
    if (!match.maps || mapIndex >= match.maps.length) {
      return res.status(400).json({ message: 'Invalid map index' });
    }
    
    match.maps[mapIndex].furiaScore = furiaScore;
    match.maps[mapIndex].opponentScore = opponentScore;
    
    // Create a match-update message
    const newMessage = {
      _id: Date.now().toString(),
      user: req.body.userId || 'system', 
      content: `Placar atualizado: FURIA ${furiaScore} vs ${opponentScore} ${match.opponent} (Mapa: ${match.maps[mapIndex].name})`,
      type: 'match-update',
      matchId: match._id,
      timestamp: new Date(),
      reactions: []
    };
    
    mockData.messages.push(newMessage);
    
    return res.json(match);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   PATCH /api/matches/:id/add-highlight
 * @desc    Add a highlight
 * @access  Private (Admin)
 */
router.patch('/:id/add-highlight', (req, res) => {
  try {
    const { description, type, player } = req.body;
    
    if (!description || !type || !player) {
      return res.status(400).json({ message: 'Description, type and player are required' });
    }
    
    const matchIndex = mockData.matches.findIndex(m => m._id === req.params.id);
    
    if (matchIndex === -1) {
      return res.status(404).json({ message: 'Match not found' });
    }
    
    const match = mockData.matches[matchIndex];
    
    if (!match.highlights) match.highlights = [];
    
    const highlight = {
      description,
      type,
      player,
      timestamp: new Date()
    };
    
    match.highlights.push(highlight);
    
    // Create a match-update message for the highlight
    const newMessage = {
      _id: Date.now().toString(),
      user: req.body.userId || 'system',
      content: `${type.toUpperCase()}: ${player} - ${description}`,
      type: 'match-update',
      matchId: match._id,
      timestamp: new Date(),
      reactions: []
    };
    
    mockData.messages.push(newMessage);
    
    return res.json(match);
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

/**
 * @route   GET /api/matches/:id/messages
 * @desc    Get messages for a specific match
 * @access  Public
 */
router.get('/:id/messages', (req, res) => {
  try {
    const matchId = req.params.id;
    
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    // Filter messages by matchId
    const matchMessages = mockData.messages.filter(msg => msg.matchId === matchId);
    
    // Sort by timestamp (newest first)
    matchMessages.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginatedMessages = matchMessages.slice(startIndex, endIndex);
    
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
      totalPages: Math.ceil(matchMessages.length / limit),
      currentPage: page
    });
  } catch (error) {
    return res.status(500).json({ message: 'Server error', error });
  }
});

export default router; 