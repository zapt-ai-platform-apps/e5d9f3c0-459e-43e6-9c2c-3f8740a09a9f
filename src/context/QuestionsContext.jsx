import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/browser';
import { questionsStorageKey, examProgressKey, exerciseProgressKey, studyProgressKey } from '../constants';

export const QuestionsContext = createContext();

export const QuestionsProvider = ({ children }) => {
  const [questions, setQuestions] = useState([]);
  const [examProgress, setExamProgress] = useState(null);
  const [exerciseProgress, setExerciseProgress] = useState({
    answeredQuestions: [],
    lastQuestionIndex: 0
  });
  const [studyProgress, setStudyProgress] = useState({
    studiedQuestions: [],
    lastQuestionIndex: 0
  });
  const [loading, setLoading] = useState(true);

  // Load data from localStorage on initial render
  useEffect(() => {
    try {
      setLoading(true);
      
      const storedQuestions = localStorage.getItem(questionsStorageKey);
      if (storedQuestions) {
        setQuestions(JSON.parse(storedQuestions));
      }
      
      const storedExamProgress = localStorage.getItem(examProgressKey);
      if (storedExamProgress) {
        setExamProgress(JSON.parse(storedExamProgress));
      }
      
      const storedExerciseProgress = localStorage.getItem(exerciseProgressKey);
      if (storedExerciseProgress) {
        setExerciseProgress(JSON.parse(storedExerciseProgress));
      }
      
      const storedStudyProgress = localStorage.getItem(studyProgressKey);
      if (storedStudyProgress) {
        setStudyProgress(JSON.parse(storedStudyProgress));
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
      Sentry.captureException(error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save questions to localStorage whenever they change
  useEffect(() => {
    if (questions.length > 0) {
      try {
        localStorage.setItem(questionsStorageKey, JSON.stringify(questions));
      } catch (error) {
        console.error('Error saving questions to localStorage:', error);
        Sentry.captureException(error);
      }
    }
  }, [questions]);

  // Save exam progress to localStorage whenever it changes
  useEffect(() => {
    if (examProgress) {
      try {
        localStorage.setItem(examProgressKey, JSON.stringify(examProgress));
      } catch (error) {
        console.error('Error saving exam progress to localStorage:', error);
        Sentry.captureException(error);
      }
    }
  }, [examProgress]);

  // Save exercise progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(exerciseProgressKey, JSON.stringify(exerciseProgress));
    } catch (error) {
      console.error('Error saving exercise progress to localStorage:', error);
      Sentry.captureException(error);
    }
  }, [exerciseProgress]);

  // Save study progress to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(studyProgressKey, JSON.stringify(studyProgress));
    } catch (error) {
      console.error('Error saving study progress to localStorage:', error);
      Sentry.captureException(error);
    }
  }, [studyProgress]);

  // Import questions from Excel file data
  const importQuestions = useCallback((questionsData) => {
    setQuestions(questionsData);
  }, []);

  // Start a new exam with random questions
  const startNewExam = useCallback(() => {
    if (questions.length === 0) return null;

    // Get unique random questions
    const getRandomQuestions = () => {
      const availableIndices = [...Array(questions.length).keys()];
      const selectedIndices = [];
      
      for (let i = 0; i < 20 && availableIndices.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableIndices.length);
        const questionIndex = availableIndices.splice(randomIndex, 1)[0];
        selectedIndices.push(questionIndex);
      }
      
      return selectedIndices.map(index => ({
        ...questions[index],
        originalIndex: index
      }));
    };

    const examQuestions = getRandomQuestions();
    const newExamProgress = {
      questions: examQuestions,
      answers: Array(examQuestions.length).fill(null),
      startTime: Date.now(),
      isCompleted: false,
      results: null
    };
    
    setExamProgress(newExamProgress);
    return newExamProgress;
  }, [questions]);

  // Submit answer for the current exam
  const submitExamAnswer = useCallback((questionIndex, answerIndex) => {
    if (!examProgress) return;
    
    const newAnswers = [...examProgress.answers];
    newAnswers[questionIndex] = answerIndex;
    
    setExamProgress({
      ...examProgress,
      answers: newAnswers
    });
  }, [examProgress]);

  // Complete the exam and calculate results
  const completeExam = useCallback(() => {
    if (!examProgress) return;
    
    const correctAnswers = examProgress.questions.map((q, index) => {
      const userAnswer = examProgress.answers[index];
      const isCorrect = userAnswer === q.correctAnswerIndex;
      return {
        question: q,
        userAnswer,
        isCorrect
      };
    });
    
    const score = correctAnswers.filter(a => a.isCorrect).length;
    const isPassed = score >= 18;
    const incorrectAnswers = correctAnswers.filter(a => !a.isCorrect);
    
    const results = {
      score,
      isPassed,
      correctAnswers,
      incorrectAnswers,
      endTime: Date.now()
    };
    
    setExamProgress({
      ...examProgress,
      isCompleted: true,
      results
    });
    
    return results;
  }, [examProgress]);

  // Reset the current exam
  const resetExam = useCallback(() => {
    setExamProgress(null);
    localStorage.removeItem(examProgressKey);
  }, []);

  // Update exercise progress when a question is answered
  const updateExerciseProgress = useCallback((questionIndex, isCorrect) => {
    setExerciseProgress(prev => {
      const answeredQuestions = [...prev.answeredQuestions];
      if (!answeredQuestions.includes(questionIndex)) {
        answeredQuestions.push(questionIndex);
      }
      
      return {
        answeredQuestions,
        lastQuestionIndex: questionIndex
      };
    });
  }, []);

  // Reset exercise progress
  const resetExerciseProgress = useCallback(() => {
    setExerciseProgress({
      answeredQuestions: [],
      lastQuestionIndex: 0
    });
    localStorage.removeItem(exerciseProgressKey);
  }, []);

  // Update study progress when a question is studied
  const updateStudyProgress = useCallback((questionIndex) => {
    setStudyProgress(prev => {
      const studiedQuestions = [...prev.studiedQuestions];
      if (!studiedQuestions.includes(questionIndex)) {
        studiedQuestions.push(questionIndex);
      }
      
      return {
        studiedQuestions,
        lastQuestionIndex: questionIndex
      };
    });
  }, []);

  // Reset study progress
  const resetStudyProgress = useCallback(() => {
    setStudyProgress({
      studiedQuestions: [],
      lastQuestionIndex: 0
    });
    localStorage.removeItem(studyProgressKey);
  }, []);

  return (
    <QuestionsContext.Provider
      value={{
        questions,
        examProgress,
        exerciseProgress,
        studyProgress,
        loading,
        importQuestions,
        startNewExam,
        submitExamAnswer,
        completeExam,
        resetExam,
        updateExerciseProgress,
        resetExerciseProgress,
        updateStudyProgress,
        resetStudyProgress
      }}
    >
      {children}
    </QuestionsContext.Provider>
  );
};