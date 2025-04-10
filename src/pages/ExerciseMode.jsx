import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { QuestionsContext } from '../context/QuestionsContext';
import ExerciseQuestion from '../components/ExerciseQuestion';
import ExerciseSettings from '../components/ExerciseSettings';

const ExerciseMode = () => {
  const { 
    questions, 
    exerciseProgress, 
    updateExerciseProgress 
  } = useContext(QuestionsContext);
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [questionsPerSession, setQuestionsPerSession] = useState(10);
  const [sessionStarted, setSessionStarted] = useState(false);
  const [currentSessionQuestions, setCurrentSessionQuestions] = useState([]);
  const [sessionQuestionIndex, setSessionQuestionIndex] = useState(0);
  
  const navigate = useNavigate();

  // Initialize exercise mode
  useEffect(() => {
    if (questions.length === 0) {
      navigate('/');
      return;
    }

    // Set current question index to last answered question
    if (exerciseProgress.lastQuestionIndex < questions.length) {
      setCurrentQuestionIndex(exerciseProgress.lastQuestionIndex);
    }
  }, [questions, exerciseProgress.lastQuestionIndex, navigate]);

  // Start a new exercise session
  const startSession = () => {
    try {
      // Get unanswered questions
      const answeredIndices = new Set(exerciseProgress.answeredQuestions);
      const unansweredIndices = [];
      
      for (let i = 0; i < questions.length; i++) {
        if (!answeredIndices.has(i)) {
          unansweredIndices.push(i);
        }
      }
      
      // If all questions are answered, use all questions
      const availableIndices = unansweredIndices.length > 0 ? unansweredIndices : [...Array(questions.length).keys()];
      
      // Select random questions for the session
      const sessionIndices = [];
      const numQuestions = Math.min(questionsPerSession, availableIndices.length);
      
      for (let i = 0; i < numQuestions; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const questionIndex = availableIndices.splice(randomIndex, 1)[0];
        sessionIndices.push(questionIndex);
      }
      
      setCurrentSessionQuestions(sessionIndices);
      setSessionQuestionIndex(0);
      setSessionStarted(true);
      setShowFeedback(false);
      setSelectedAnswer(null);
      
    } catch (error) {
      console.error('Error starting exercise session:', error);
      Sentry.captureException(error);
    }
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex) => {
    try {
      if (showFeedback) return; // Prevent selecting again after feedback is shown
      
      const questionIndex = currentSessionQuestions[sessionQuestionIndex];
      const currentQuestion = questions[questionIndex];
      const correct = answerIndex === currentQuestion.correctAnswerIndex;
      
      setSelectedAnswer(answerIndex);
      setIsCorrect(correct);
      setShowFeedback(true);
      
      // Update progress
      updateExerciseProgress(questionIndex, correct);
      
    } catch (error) {
      console.error('Error selecting answer:', error);
      Sentry.captureException(error);
    }
  };

  // Move to next question in the session
  const nextQuestion = () => {
    try {
      if (sessionQuestionIndex < currentSessionQuestions.length - 1) {
        setSessionQuestionIndex(prev => prev + 1);
        setShowFeedback(false);
        setSelectedAnswer(null);
      } else {
        // End of session
        setSessionStarted(false);
      }
    } catch (error) {
      console.error('Error moving to next question:', error);
      Sentry.captureException(error);
    }
  };

  // If questions are not loaded
  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Calculate progress
  const totalAnswered = exerciseProgress.answeredQuestions.length;
  const progressPercentage = (totalAnswered / questions.length) * 100;

  // If session hasn't started, show settings
  if (!sessionStarted) {
    return (
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Modalità Esercizio</h1>
        
        <div className="mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">Progresso</h3>
              <span className="text-sm text-gray-500">{totalAnswered}/{questions.length} domande</span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <ExerciseSettings 
          questionsPerSession={questionsPerSession}
          setQuestionsPerSession={setQuestionsPerSession}
          totalQuestions={questions.length}
          remainingQuestions={questions.length - totalAnswered}
          onStartSession={startSession}
        />
      </div>
    );
  }

  // If in active session, show current question
  const currentQuestionGlobalIndex = currentSessionQuestions[sessionQuestionIndex];
  const currentQuestion = questions[currentQuestionGlobalIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modalità Esercizio</h1>
        
        <div className="text-sm font-medium">
          Domanda {sessionQuestionIndex + 1}/{currentSessionQuestions.length}
        </div>
      </div>
      
      <ExerciseQuestion
        question={currentQuestion}
        selectedAnswer={selectedAnswer}
        showFeedback={showFeedback}
        isCorrect={isCorrect}
        onSelectAnswer={handleAnswerSelect}
        onNext={nextQuestion}
      />
      
      <div className="mt-6 flex justify-between">
        <button 
          onClick={() => {
            setSessionStarted(false);
          }} 
          className="btn-outline"
        >
          Torna alle impostazioni
        </button>
        
        {showFeedback && (
          <button 
            onClick={nextQuestion} 
            className="btn-primary"
          >
            {sessionQuestionIndex < currentSessionQuestions.length - 1 
              ? 'Prossima domanda' 
              : 'Termina sessione'}
          </button>
        )}
      </div>
    </div>
  );
};

export default ExerciseMode;