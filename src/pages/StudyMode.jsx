import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as Sentry from '@sentry/browser';
import { QuestionsContext } from '../context/QuestionsContext';
import StudyQuestion from '../components/StudyQuestion';

const StudyMode = () => {
  const { 
    questions, 
    studyProgress, 
    updateStudyProgress 
  } = useContext(QuestionsContext);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  
  const navigate = useNavigate();

  // Initialize study mode
  useEffect(() => {
    if (questions.length === 0) {
      navigate('/');
      return;
    }

    // Set current index to last studied question
    if (studyProgress.lastQuestionIndex < questions.length) {
      setCurrentIndex(studyProgress.lastQuestionIndex);
    }
  }, [questions, studyProgress.lastQuestionIndex, navigate]);

  // Handle "Show Answer" button click
  const handleShowAnswer = () => {
    try {
      setShowAnswer(true);
      
      // Update progress only when showing answer
      updateStudyProgress(currentIndex);
    } catch (error) {
      console.error('Error showing answer:', error);
      Sentry.captureException(error);
    }
  };

  // Move to next question
  const nextQuestion = () => {
    try {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setShowAnswer(false);
      } else {
        // End of questions
        alert('Hai completato tutte le domande!');
        navigate('/');
      }
    } catch (error) {
      console.error('Error moving to next question:', error);
      Sentry.captureException(error);
    }
  };

  // Move to previous question
  const prevQuestion = () => {
    try {
      if (currentIndex > 0) {
        setCurrentIndex(prev => prev - 1);
        setShowAnswer(false);
      }
    } catch (error) {
      console.error('Error moving to previous question:', error);
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
  const totalStudied = studyProgress.studiedQuestions.length;
  const progressPercentage = (totalStudied / questions.length) * 100;

  const currentQuestion = questions[currentIndex];
  
  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Modalità Studio</h1>
        
        <div className="flex items-center space-x-4">
          <div className="text-sm font-medium">
            {currentIndex + 1}/{questions.length}
          </div>
          
          <div className="flex items-center">
            <div className="w-32 bg-gray-200 rounded-full h-2.5 mr-2">
              <div 
                className="bg-blue-600 h-2.5 rounded-full" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <span className="text-xs text-gray-600">{totalStudied}/{questions.length}</span>
          </div>
        </div>
      </div>
      
      <StudyQuestion
        question={currentQuestion}
        showAnswer={showAnswer}
        onShowAnswer={handleShowAnswer}
      />
      
      <div className="mt-6 flex justify-between">
        <button 
          onClick={prevQuestion} 
          className="btn-outline"
          disabled={currentIndex === 0}
        >
          Precedente
        </button>
        
        <button 
          onClick={() => navigate('/')} 
          className="btn-secondary"
        >
          Torna alla Home
        </button>
        
        {showAnswer ? (
          <button 
            onClick={nextQuestion} 
            className="btn-primary"
          >
            {currentIndex < questions.length - 1 ? 'Prossima' : 'Fine'}
          </button>
        ) : (
          <button
            onClick={nextQuestion}
            className="btn-outline"
            disabled={currentIndex === questions.length - 1}
          >
            Salta
          </button>
        )}
      </div>
    </div>
  );
};

export default StudyMode;