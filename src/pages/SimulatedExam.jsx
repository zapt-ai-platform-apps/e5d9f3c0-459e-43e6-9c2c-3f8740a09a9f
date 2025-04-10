import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { QuestionsContext } from '../context/QuestionsContext';
import ExamQuestion from '../components/ExamQuestion';
import Timer from '../components/Timer';
import ExamResults from '../components/ExamResults';
import { EXAM_TIME_LIMIT } from '../constants';

const SimulatedExam = () => {
  const { 
    examProgress, 
    startNewExam, 
    submitExamAnswer, 
    completeExam, 
    resetExam 
  } = useContext(QuestionsContext);
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(EXAM_TIME_LIMIT);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const navigate = useNavigate();

  // Initialize or resume exam
  useEffect(() => {
    if (!examProgress) {
      try {
        startNewExam();
      } catch (error) {
        console.error('Error starting new exam:', error);
        Sentry.captureException(error);
        navigate('/');
      }
    } else if (examProgress.isCompleted) {
      // If there's a completed exam, stay on results page
      setIsTimeUp(true);
    } else {
      // Calculate remaining time for an in-progress exam
      const elapsed = Math.floor((Date.now() - examProgress.startTime) / 1000);
      const remaining = Math.max(0, EXAM_TIME_LIMIT - elapsed);
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        setIsTimeUp(true);
      }
    }
  }, [examProgress, startNewExam, navigate]);

  // Handle timer update
  const handleTimerUpdate = useCallback((remaining) => {
    setTimeRemaining(remaining);
    
    if (remaining === 0 && !isTimeUp) {
      setIsTimeUp(true);
      try {
        completeExam();
      } catch (error) {
        console.error('Error completing exam on time up:', error);
        Sentry.captureException(error);
      }
    }
  }, [completeExam, isTimeUp]);

  // Handle answer selection
  const handleAnswerSelect = useCallback((answerIndex) => {
    try {
      submitExamAnswer(currentQuestion, answerIndex);
    } catch (error) {
      console.error('Error submitting answer:', error);
      Sentry.captureException(error);
    }
  }, [currentQuestion, submitExamAnswer]);

  // Navigate to next question
  const goToNextQuestion = useCallback(() => {
    if (examProgress && currentQuestion < examProgress.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  }, [currentQuestion, examProgress]);

  // Navigate to previous question
  const goToPrevQuestion = useCallback(() => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  }, [currentQuestion]);

  // Handle exam completion
  const handleExamComplete = useCallback(() => {
    setIsTimeUp(true);
    try {
      completeExam();
    } catch (error) {
      console.error('Error completing exam:', error);
      Sentry.captureException(error);
    }
  }, [completeExam]);

  // Handle starting a new exam
  const handleNewExam = useCallback(() => {
    resetExam();
    setIsTimeUp(false);
    setCurrentQuestion(0);
    try {
      startNewExam();
    } catch (error) {
      console.error('Error starting new exam:', error);
      Sentry.captureException(error);
    }
  }, [resetExam, startNewExam]);

  // Return to home page
  const handleReturnHome = () => {
    navigate('/');
  };

  // If no exam is in progress or the exam is not loaded yet
  if (!examProgress) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // If exam is completed, show results
  if (examProgress.isCompleted && examProgress.results) {
    return (
      <ExamResults 
        results={examProgress.results} 
        onNewExam={handleNewExam} 
        onReturnHome={handleReturnHome} 
      />
    );
  }

  // Get current question data
  const questionData = examProgress.questions[currentQuestion];
  const selectedAnswer = examProgress.answers[currentQuestion];
  
  // Count answered questions
  const answeredCount = examProgress.answers.filter(a => a !== null).length;
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h1 className="text-2xl font-bold mb-2 md:mb-0">Esame Simulato</h1>
        
        <div className="flex items-center space-x-4">
          <Timer 
            initialTime={timeRemaining} 
            onTimeUpdate={handleTimerUpdate} 
            isActive={!isTimeUp} 
          />
          
          <div className="text-sm font-medium">
            Risposte: {answeredCount}/{examProgress.questions.length}
          </div>
        </div>
      </div>
      
      {isTimeUp ? (
        <div className="card text-center">
          <h2 className="text-xl font-bold mb-4">Tempo Scaduto!</h2>
          <p className="mb-4">Hai esaurito il tempo disponibile per completare l'esame.</p>
          <button onClick={handleExamComplete} className="btn-primary">
            Vedi Risultati
          </button>
        </div>
      ) : (
        <>
          <ExamQuestion
            questionNumber={currentQuestion + 1}
            questionText={questionData.question}
            options={questionData.options}
            selectedOption={selectedAnswer}
            onSelectOption={handleAnswerSelect}
          />
          
          <div className="flex justify-between mt-6">
            <button
              onClick={goToPrevQuestion}
              disabled={currentQuestion === 0}
              className={`btn-outline ${currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Precedente
            </button>
            
            {currentQuestion < examProgress.questions.length - 1 ? (
              <button onClick={goToNextQuestion} className="btn-primary">
                Successiva
              </button>
            ) : (
              <button onClick={handleExamComplete} className="btn-success">
                Termina Esame
              </button>
            )}
          </div>
          
          <div className="mt-8">
            <div className="border rounded-md p-3 overflow-x-auto">
              <div className="flex flex-wrap gap-2">
                {examProgress.questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentQuestion(index)}
                    className={`w-10 h-10 rounded-md flex items-center justify-center font-medium 
                    ${currentQuestion === index ? 'bg-blue-600 text-white' : ''} 
                    ${examProgress.answers[index] !== null ? 'bg-green-100 border-green-400 border' : 'bg-gray-100'}`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SimulatedExam;