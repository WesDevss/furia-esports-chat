import React, { useState, useEffect } from 'react';
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

// Static fallback quiz data
const FALLBACK_QUIZZES: Quiz[] = [
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
    description: 'Teste seu conhecimento sobre campeões de League of Legends',
    questionCount: 10,
    difficulty: 'Médio',
    completionRate: 45
  },
  {
    id: 'historia-furia',
    title: 'História da FURIA',
    description: 'Quanto você sabe sobre a história da FURIA?',
    questionCount: 8,
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

const QuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchQuizzes = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch('/api/quizzes');
        
        if (!response.ok) {
          throw new Error('Falha ao buscar quizzes');
        }
        
        const data = await response.json();
        
        // Add mock completion rates for now
        const completionRates = {
          'furia-conhecimentos': 65,
          'cs2-tactics': 32,
          'valorant-agentes': 78,
          'lol-campeoes': 45,
          'historia-furia': 82,
          'cenario-esports': 29
        };
        
        const quizzesWithRates = data.map((quiz: Quiz) => ({
          ...quiz,
          completionRate: completionRates[quiz.id as keyof typeof completionRates] || Math.floor(Math.random() * 100)
        }));
        
        setQuizzes(quizzesWithRates);
      } catch (error) {
        console.error('Erro ao carregar quizzes:', error);
        // Use fallback data when API fails
        setQuizzes(FALLBACK_QUIZZES);
      } finally {
        setLoading(false);
      }
    };
    
    fetchQuizzes();
  }, []);

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
      
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-pulse space-y-2 text-center">
            <div className="h-6 w-32 bg-furia-purple/20 rounded mx-auto"></div>
            <p className="text-furia-purple text-sm">Carregando quizzes...</p>
          </div>
        </div>
      ) : error ? (
        <div className="bg-red-900/20 border border-red-900 rounded-lg p-4 text-center">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-white bg-red-900/40 hover:bg-red-900/60 px-4 py-2 rounded"
          >
            Tentar novamente
          </button>
        </div>
      ) : (
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
      )}
    </div>
  );
};

export default QuizzesPage; 