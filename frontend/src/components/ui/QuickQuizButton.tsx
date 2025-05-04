import React from 'react';
import { Clock, Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface QuickQuizButtonProps {
  title?: string;
  description?: string;
  questionCount?: number;
  difficulty?: string;
  completionRate?: number;
  quizId: string;
}

const QuickQuizButton: React.FC<QuickQuizButtonProps> = ({
  title = 'Quiz FURIA',
  description = 'Teste seus conhecimentos sobre a FURIA',
  questionCount = 10,
  difficulty = 'Médio',
  completionRate = 65,
  quizId
}) => {
  return (
    <div className="bg-furia-purple/10 border border-furia-purple/30 rounded-lg p-5 flex flex-col">
      {/* Icon at the center */}
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-furia-purple/20 p-3">
          <Clock className="w-6 h-6 text-furia-purple" />
        </div>
      </div>
      
      {/* Quiz title */}
      <h3 className="text-xl font-bold text-white text-center mb-2">{title}</h3>
      
      {/* Description */}
      <p className="text-gray-300 text-sm text-center mb-6">{description}</p>
      
      {/* Quiz info */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span className="text-gray-300 text-sm">{questionCount} Perguntas</span>
        </div>
        
        <div className="flex items-center">
          <span className="text-gray-300 text-sm">Dificuldade: </span>
          <span className="ml-1 font-medium text-yellow-400">{difficulty}</span>
        </div>
      </div>
      
      {/* Completion rate */}
      {completionRate && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>Concluído por</span>
            <span>{completionRate}% dos fãs</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full">
            <div 
              className="h-full bg-furia-purple rounded-full" 
              style={{ width: `${completionRate}%` }}
            ></div>
          </div>
        </div>
      )}
      
      {/* Start button */}
      <Link 
        to={`/quiz/${quizId}`}
        className="mt-auto bg-furia-purple hover:bg-furia-purple/80 text-white py-3 rounded-lg font-medium text-center transition-colors"
      >
        Iniciar Quiz
      </Link>
    </div>
  );
};

export default QuickQuizButton; 