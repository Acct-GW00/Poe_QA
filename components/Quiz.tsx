
import React, { useState, useEffect, useMemo } from 'react';
import { generateQuizQuestions } from '../services/geminiService';
import { QuizQuestion } from '../types';
import { PRAISE_MESSAGES, SCOLD_MESSAGES } from '../constants';
import { CorrectIcon } from './icons/CorrectIcon';
import { IncorrectIcon } from './icons/IncorrectIcon';
import { RobotIcon } from './icons/RobotIcon';

interface QuizProps {
  onClose: () => void;
}

type QuizState = 'loading' | 'active' | 'feedback' | 'finished';

export const Quiz: React.FC<QuizProps> = ({ onClose }) => {
  const [quizState, setQuizState] = useState<QuizState>('loading');
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchQuestions = async () => {
    setQuizState('loading');
    setError(null);
    try {
      const fetchedQuestions = await generateQuizQuestions();
      // Shuffle options for variety
      const shuffledQuestions = fetchedQuestions.map(q => ({
        ...q,
        options: [...q.options].sort(() => Math.random() - 0.5)
      }));
      setQuestions(shuffledQuestions);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setQuizState('active');
    } catch (err) {
      setError(err instanceof Error ? err.message : '發生未知錯誤');
      setQuizState('finished'); // Go to finished state to show error and retry
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);
  
  const currentQuestion = useMemo(() => questions[currentQuestionIndex], [questions, currentQuestionIndex]);
  const feedbackMessage = useMemo(() => {
    if (isCorrect === null) return '';
    const messages = isCorrect ? PRAISE_MESSAGES : SCOLD_MESSAGES;
    return messages[Math.floor(Math.random() * messages.length)];
  }, [isCorrect]);

  const handleAnswerSelect = (option: string) => {
    if (quizState !== 'active') return;

    setSelectedAnswer(option);
    const correct = option === currentQuestion.answer;
    setIsCorrect(correct);
    if (correct) {
      setScore(prev => prev + 10);
    }
    setQuizState('feedback');
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedAnswer(null);
      setIsCorrect(null);
      setQuizState('active');
    } else {
      setQuizState('finished');
    }
  };
  
  const renderLoading = () => (
    <div className="text-center">
      <RobotIcon className="w-16 h-16 text-cyan-400 mx-auto animate-bounce" />
      <p className="mt-4 text-xl text-gray-300 animate-pulse">測驗題目生成中，請稍候...</p>
      <p className="mt-2 text-sm text-gray-500">AI 正在努力為您出題！</p>
    </div>
  );
  
  const renderFeedback = () => (
    <div className="absolute inset-0 bg-black/80 flex flex-col justify-center items-center p-8 animate-fade-in z-10">
        {isCorrect ? 
            <CorrectIcon className="w-24 h-24 text-green-400 mb-4" /> :
            <IncorrectIcon className="w-24 h-24 text-red-400 mb-4" />
        }
        <h3 className={`text-3xl font-bold mb-2 ${isCorrect ? 'text-green-400' : 'text-red-400'}`}>
            {isCorrect ? '答對了！' : '答錯了！'}
        </h3>
        <p className="text-lg text-gray-200 mb-4 text-center">{feedbackMessage}</p>
        {!isCorrect && (
            <div className="bg-gray-800 p-4 rounded-lg text-center max-w-md">
                <p className="text-gray-400 mb-1">正確答案是：</p>
                <p className="text-yellow-300 font-semibold text-lg mb-2">{currentQuestion.answer}</p>
                <p className="text-gray-300 text-sm">{currentQuestion.explanation}</p>
            </div>
        )}
        <button onClick={handleNextQuestion} className="mt-8 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
            {currentQuestionIndex < questions.length - 1 ? '下一題' : '查看總分'}
        </button>
    </div>
  );
  
  const renderFinished = () => (
     <div className="text-center">
        {error ? (
            <>
                <IncorrectIcon className="w-24 h-24 text-red-400 mx-auto mb-4"/>
                <h3 className="text-3xl font-bold mb-2 text-red-400">喔不！出錯了</h3>
                <p className="text-lg text-gray-300 mb-8">{error}</p>
            </>
        ) : (
            <>
                <h3 className="text-3xl font-bold mb-2 text-cyan-300">測驗結束！</h3>
                <p className="text-lg text-gray-300 mb-4">您的總分是：</p>
                <p className="text-7xl font-bold text-yellow-300 mb-8 animate-bounce">{score}</p>
            </>
        )}
        <div className="flex justify-center space-x-4">
            <button onClick={fetchQuestions} className="bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                再來一次
            </button>
            <button onClick={onClose} className="bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-8 rounded-lg text-lg transition-transform transform hover:scale-105">
                結束
            </button>
        </div>
    </div>
  );

  const renderActiveQuiz = () => {
    if (!currentQuestion) return null;
    return (
        <div>
            <div className="text-center mb-6">
                <p className="text-sm text-cyan-400">第 {currentQuestionIndex + 1} / {questions.length} 題</p>
                <h2 className="text-2xl md:text-3xl text-gray-100 mt-2">{currentQuestion.question}</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options.map((option, index) => (
                    <button 
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        className="bg-gray-800 p-4 rounded-lg text-left text-gray-200 hover:bg-cyan-700 hover:scale-105 transition-all duration-200 border-2 border-transparent focus:outline-none focus:border-cyan-500"
                    >
                        <span className="font-bold mr-2">{String.fromCharCode(65 + index)}.</span>
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
  };
  
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-gray-900 border border-gray-700 rounded-2xl shadow-2xl w-full max-w-4xl h-full max-h-[90vh] p-6 md:p-8 flex flex-col justify-center relative overflow-hidden">
            {quizState === 'loading' && renderLoading()}
            {(quizState === 'active' || quizState === 'feedback') && renderActiveQuiz()}
            {quizState === 'finished' && renderFinished()}
            
            {quizState === 'feedback' && renderFeedback()}

             <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors z-20" aria-label="關閉測驗">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        </div>
    </div>
  );
};
