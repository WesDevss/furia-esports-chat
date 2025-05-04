import React from 'react';
import { ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuizCard from './ui/QuizCard';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  completionRate?: number;
}

const QuizList: React.FC = () => {
  // Mock data - in a real app, this would come from an API
  const quizzes: Quiz[] = [
    {
      id: 'furia-conhecimentos',
      title: 'Quiz FURIA',
      description: 'Teste seus conhecimentos sobre a FURIA',
      questionCount: 10,
      difficulty: 'Médio',
      completionRate: 65
    },
    {
      id: 'cs2-tactics',
      title: 'Táticas de CS2',
      description: 'Quanto você sabe sobre táticas competitivas de CS2?',
      questionCount: 12,
      difficulty: 'Difícil',
      completionRate: 32
    },
    {
      id: 'valorant-agentes',
      title: 'Agentes do VALORANT',
      description: 'Teste seus conhecimentos sobre agentes e habilidades',
      questionCount: 8,
      difficulty: 'Fácil',
      completionRate: 78
    }
  ];

  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <h2 className="text-xl font-bold text-white">Quiz Interativo</h2>
        <Link to="/quizzes" className="text-furia-purple hover:underline text-sm flex items-center">
          Ver todos
          <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
      
      <div className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              title={quiz.title}
              description={quiz.description}
              questionCount={quiz.questionCount}
              difficulty={quiz.difficulty}
              completionRate={quiz.completionRate}
              quizId={quiz.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuizList; 