import React from 'react';
import Card from './Card';
import Button from './Button';
import { HelpCircle, Brain, Trophy } from 'lucide-react';

interface CardQuizProps {
  title?: string;
  description?: string;
  questionsCount?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
  completionRate?: number;
  onStart?: () => void;
  delay?: number;
}

const CardQuiz: React.FC<CardQuizProps> = ({
  title = 'Quiz FURIA',
  description = 'Teste seus conhecimentos sobre a FURIA',
  questionsCount = 10,
  difficulty = 'medium',
  completionRate,
  onStart,
  delay = 0
}) => {
  const difficultyColor = {
    easy: 'text-green-500',
    medium: 'text-yellow-500',
    hard: 'text-red-500'
  };

  const difficultyText = {
    easy: 'Fácil',
    medium: 'Médio',
    hard: 'Difícil'
  };

  return (
    <Card
      variant="quiz"
      delay={delay}
    >
      <div className="text-center">
        <div className="mx-auto w-12 h-12 bg-furia-purple/20 rounded-full flex items-center justify-center mb-4">
          <Brain size={24} className="text-furia-purple" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-300 mb-6">{description}</p>
        
        <div className="flex justify-center space-x-6 mb-6">
          <div className="flex flex-col items-center">
            <HelpCircle size={18} className="text-furia-purple mb-1" />
            <span className="text-sm text-gray-300">{questionsCount} Perguntas</span>
          </div>
          
          <div className="flex flex-col items-center">
            <Trophy size={18} className={`${difficultyColor[difficulty]} mb-1`} />
            <span className="text-sm text-gray-300">
              Dificuldade: <span className={difficultyColor[difficulty]}>{difficultyText[difficulty]}</span>
            </span>
          </div>
        </div>
        
        {completionRate !== undefined && (
          <div className="mb-6">
            <div className="text-sm text-gray-300 mb-2">Concluído por {completionRate}% dos fãs</div>
            <div className="h-2 bg-furia-darker rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-furia-purple to-furia-purple-light" 
                style={{ width: `${completionRate}%` }}
              ></div>
            </div>
          </div>
        )}
        
        <Button 
          variant="quiz" 
          size="lg" 
          fullWidth 
          onClick={onStart}
        >
          Iniciar Quiz
        </Button>
      </div>
    </Card>
  );
};

export default CardQuiz; 