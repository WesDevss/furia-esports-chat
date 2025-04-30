import React, { useState } from 'react';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  answer: number;
}

const QuizPage: React.FC = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);

  // Mock quiz questions about FURIA
  const questions: QuizQuestion[] = [
    {
      id: 1,
      question: 'Em que ano a FURIA foi fundada?',
      options: ['2016', '2017', '2018', '2019'],
      answer: 1
    },
    {
      id: 2,
      question: 'Qual jogador da FURIA ganhou o prêmio de MVP do evento ESL Pro League Season 12?',
      options: ['yuurih', 'KSCERATO', 'arT', 'VINI'],
      answer: 1
    },
    {
      id: 3,
      question: 'Qual é a nacionalidade da maioria dos jogadores da FURIA?',
      options: ['Argentina', 'Brasil', 'Estados Unidos', 'Portugal'],
      answer: 1
    },
    {
      id: 4,
      question: 'Quem é o atual capitão da equipe de CS2 da FURIA?',
      options: ['yuurih', 'KSCERATO', 'arT', 'saffee'],
      answer: 2
    },
    {
      id: 5,
      question: 'Qual foi o melhor resultado da FURIA em um Major de CS2?',
      options: ['Campeão', 'Vice-campeão', 'Top 4', 'Top 8'],
      answer: 2
    },
  ];

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswer(optionIndex);
  };

  const handleNextQuestion = () => {
    // Check if answer is correct and update score
    if (selectedAnswer === questions[currentQuestion].answer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
      setSelectedAnswer(null);
    } else {
      setShowResult(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setScore(0);
  };

  return (
    <div className="mx-auto max-w-4xl px-4">
      <h1 className="text-3xl font-bold mb-6">Quiz FURIA</h1>
      
      <div className="bg-furia-darker rounded-xl overflow-hidden shadow-lg">
        {!showResult ? (
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <span className="text-furia-purple font-medium">
                Questão {currentQuestion + 1} de {questions.length}
              </span>
              <span className="text-gray-400">
                Pontuação: {score}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-6">
                {questions[currentQuestion].question}
              </h2>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedAnswer === index
                        ? 'bg-furia-purple/20 border-furia-purple'
                        : 'bg-furia-black/40 border-furia-gray/30 hover:border-furia-purple/50'
                    }`}
                    onClick={() => handleAnswerSelect(index)}
                  >
                    <div className="flex items-center">
                      <span className="flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-3 border-furia-purple/70">
                        {String.fromCharCode(65 + index)}
                      </span>
                      {option}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === null}
                className={`px-6 py-3 rounded-md font-medium ${
                  selectedAnswer === null
                    ? 'bg-furia-purple/30 text-white/50 cursor-not-allowed'
                    : 'bg-furia-purple text-white hover:bg-furia-purple/90'
                }`}
              >
                {currentQuestion === questions.length - 1 ? 'Finalizar Quiz' : 'Próxima Questão'}
              </button>
            </div>
          </div>
        ) : (
          <div className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-3">Quiz Concluído!</h2>
            <p className="text-gray-400 mb-6">
              Você acertou {score} de {questions.length} questões.
            </p>
            
            <div className="mb-8">
              <div className="inline-flex items-center justify-center w-36 h-36 rounded-full border-8 border-furia-purple/30">
                <div className="text-3xl font-bold">
                  {Math.round((score / questions.length) * 100)}%
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              {score === questions.length ? (
                <p className="text-furia-purple font-semibold text-lg">
                  Parabéns! Você é um verdadeiro fã da FURIA!
                </p>
              ) : score >= questions.length / 2 ? (
                <p className="text-furia-purple font-semibold text-lg">
                  Bom trabalho! Você conhece bem a FURIA!
                </p>
              ) : (
                <p className="text-furia-purple font-semibold text-lg">
                  Continue estudando sobre a FURIA!
                </p>
              )}
              
              <button
                onClick={handleRestart}
                className="px-6 py-3 bg-furia-purple text-white rounded-md font-medium hover:bg-furia-purple/90 mt-4 inline-block"
              >
                Tentar Novamente
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage; 