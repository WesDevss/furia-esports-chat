import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import QuizCard from '../components/ui/QuizCard';

interface Quiz {
  id: string;
  title: string;
  description: string;
  questionCount: number;
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
  completionRate?: number;
}

const QuizzesPage: React.FC = () => {
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
    },
    {
      id: 'lol-campeoes',
      title: 'Campeões de LoL',
      description: 'Teste seu conhecimento sobre os campeões de League of Legends',
      questionCount: 15,
      difficulty: 'Médio',
      completionRate: 45
    },
    {
      id: 'historia-furia',
      title: 'História da FURIA',
      description: 'Quanto você sabe sobre a história da organização FURIA Esports?',
      questionCount: 10,
      difficulty: 'Fácil',
      completionRate: 82
    },
    {
      id: 'cenario-esports',
      title: 'Cenário de Esports',
      description: 'Teste seus conhecimentos sobre o cenário competitivo de esports',
      questionCount: 12,
      difficulty: 'Difícil',
      completionRate: 29
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-8">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white mb-4">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar para Home
        </Link>
        
        <h1 className="text-3xl font-bold mb-2">Quiz Interativo</h1>
        <p className="text-gray-400">
          Teste seus conhecimentos sobre FURIA, jogos e o cenário competitivo.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
  );
};

export default QuizzesPage; 