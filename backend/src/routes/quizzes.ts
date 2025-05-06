import express from 'express';
import fs from 'fs';
import path from 'path';

const router = express.Router();

// Get all quizzes (metadata only, no questions)
router.get('/', (_req, res) => {
  try {
    const quizzesDir = path.join(__dirname, '../data/quizzes');
    
    // Check if directory exists, if not create it
    if (!fs.existsSync(quizzesDir)) {
      fs.mkdirSync(quizzesDir, { recursive: true });
      return res.json([]);
    }
    
    const quizFiles = fs.readdirSync(quizzesDir).filter(file => file.endsWith('.json'));
    
    const quizzes = quizFiles.map(file => {
      const quizData = JSON.parse(fs.readFileSync(path.join(quizzesDir, file), 'utf8'));
      // Return only metadata, not questions
      const { id, title, description, difficulty } = quizData;
      return {
        id,
        title,
        description,
        difficulty,
        questionCount: quizData.questions?.length || 0
      };
    });
    
    return res.json(quizzes);
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    return res.status(500).json({ error: 'Failed to fetch quizzes' });
  }
});

// Get a specific quiz by ID (with questions)
router.get('/:id', (req, res) => {
  try {
    const quizId = req.params.id;
    const quizPath = path.join(__dirname, `../data/quizzes/${quizId}.json`);
    
    if (!fs.existsSync(quizPath)) {
      return res.status(404).json({ error: 'Quiz not found' });
    }
    
    const quizData = JSON.parse(fs.readFileSync(quizPath, 'utf8'));
    return res.json(quizData);
  } catch (error) {
    console.error(`Error fetching quiz ${req.params.id}:`, error);
    return res.status(500).json({ error: 'Failed to fetch quiz' });
  }
});

export default router; 