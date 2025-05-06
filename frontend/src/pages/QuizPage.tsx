import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, HelpCircle, ChevronRight, X } from 'lucide-react';
import { fallbackQuizzes } from '../data/fallbackQuizzes';

interface Question {
  id: string;
  text: string;
  options: {
    id: string;
    text: string;
  }[];
  correctOptionId: string;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  difficulty: 'Fácil' | 'Médio' | 'Difícil';
}

const QuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ questionId: string; selectedOptionId: string }[]>([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  
  // Fetch quiz data from API
  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await fetch(`/api/quizzes/${quizId}`);
        
        if (!response.ok) {
          throw new Error('Quiz não encontrado');
        }
        
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error('Erro ao carregar quiz:', error);
        
        // Try to find fallback quiz data
        const fallbackQuiz = fallbackQuizzes.find((q: Quiz) => q.id === quizId);
        if (fallbackQuiz) {
          setQuiz(fallbackQuiz);
        } else {
          setError('Erro ao carregar quiz. Tente novamente mais tarde.');
        }
      } finally {
        setLoading(false);
      }
    };
    
    if (quizId) {
      fetchQuiz();
    }
  }, [quizId]);
  
  const currentQuestion = quiz?.questions[currentQuestionIndex];
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOptionId(optionId);
  };
  
  const handleNextQuestion = () => {
    if (!quiz || !currentQuestion || !selectedOptionId) return;
    
    // Save answer
    setAnswers([
      ...answers,
      { questionId: currentQuestion.id, selectedOptionId }
    ]);
    
    // If correct, increment score
    if (selectedOptionId === currentQuestion.correctOptionId) {
      setScore(score + 1);
    }
    
    // Go to next question or finish quiz
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOptionId(null);
    } else {
      setQuizCompleted(true);
    }
  };
  
  const handleReturnHome = () => {
    navigate('/');
  };
  
  const handleRestartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOptionId(null);
    setAnswers([]);
    setQuizCompleted(false);
    setScore(0);
  };
  
  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="flex justify-center items-center h-[400px]">
          <div className="animate-pulse space-y-2 text-center">
            <div className="h-6 w-32 bg-furia-purple/20 rounded mx-auto"></div>
            <p className="text-furia-purple text-sm">Carregando quiz...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (!quiz) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          <HelpCircle className="h-12 w-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">Quiz não encontrado</h3>
          <p className="text-gray-400 mb-6">
            O quiz que você está procurando não existe ou foi removido.
          </p>
          <button
            onClick={handleReturnHome}
            className="bg-furia-purple hover:bg-furia-purple/80 text-white py-3 px-6 rounded-lg font-medium transition-colors"
          >
            Voltar para Home
          </button>
        </div>
      </div>
    );
  }
  
  if (quizCompleted) {
    const percentage = Math.round((score / quiz.questions.length) * 100);
    const isPassing = percentage >= 60;
    
    return (
      <div className="max-w-3xl mx-auto py-12 px-4">
        <div className="bg-gray-800 rounded-xl p-8 text-center">
          {isPassing ? (
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          ) : (
            <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
          )}
          
          <h2 className="text-2xl font-bold mb-2">
            {isPassing ? 'Parabéns!' : 'Tente novamente!'}
          </h2>
          
          <p className="text-gray-300 mb-6">
            Você acertou {score} de {quiz.questions.length} perguntas ({percentage}%)
          </p>
          
          <div className="mb-8">
            <div className="h-4 bg-gray-700 rounded-full">
              <div 
                className={`h-full rounded-full ${isPassing ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <button
              onClick={handleRestartQuiz}
              className="bg-furia-purple hover:bg-furia-purple/80 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Tentar Novamente
            </button>
            
            <button
              onClick={handleReturnHome}
              className="bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg font-medium transition-colors"
            >
              Voltar para Home
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      {/* Cabeçalho */}
      <div className="mb-8">
        <button
          onClick={handleReturnHome}
          className="text-gray-400 hover:text-white flex items-center mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-1" />
          Voltar
        </button>
        
        <h1 className="text-2xl font-bold mb-2">{quiz.title}</h1>
        <p className="text-gray-400">{quiz.description}</p>
      </div>
      
      {/* Progresso */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-400 mb-2">
          <span>Pergunta {currentQuestionIndex + 1} de {quiz.questions.length}</span>
          <span>Progresso: {Math.round(((currentQuestionIndex) / quiz.questions.length) * 100)}%</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div 
            className="h-full bg-furia-purple rounded-full transition-all duration-300" 
            style={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Questão atual */}
      {currentQuestion && (
        <div className="bg-gray-800 rounded-xl p-6 mb-6">
          <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>
          
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <button
                key={option.id}
                onClick={() => handleOptionSelect(option.id)}
                className={`w-full text-left p-4 rounded-lg transition-colors ${
                  selectedOptionId === option.id 
                    ? 'bg-furia-purple text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <span className="font-semibold mr-2">{option.id.toUpperCase()}.</span>
                {option.text}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Botão de próximo */}
      <div className="flex justify-end">
        <button
          onClick={handleNextQuestion}
          disabled={!selectedOptionId}
          className={`flex items-center py-3 px-6 rounded-lg font-medium ${
            selectedOptionId 
              ? 'bg-furia-purple hover:bg-furia-purple/80 text-white' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {currentQuestionIndex < quiz.questions.length - 1 ? 'Próxima' : 'Finalizar'}
          <ChevronRight className="w-5 h-5 ml-1" />
        </button>
      </div>
    </div>
  );
};

export default QuizPage; 