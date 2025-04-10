import React from 'react';

const ExerciseSettings = ({ 
  questionsPerSession, 
  setQuestionsPerSession, 
  totalQuestions,
  remainingQuestions,
  onStartSession 
}) => {
  // Handle input change
  const handleChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      setQuestionsPerSession(Math.min(value, totalQuestions));
    }
  };

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-4">Impostazioni Esercizio</h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Numero di domande per sessione
        </label>
        
        <input
          type="number"
          min="1"
          max={totalQuestions}
          value={questionsPerSession}
          onChange={handleChange}
          className="form-input"
        />
        
        <div className="flex justify-between text-sm text-gray-600 mt-1">
          <span>Min: 1</span>
          <span>Max: {totalQuestions}</span>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="bg-blue-50 p-4 rounded-md">
          <div className="font-medium mb-1">Domande non ancora risposte:</div>
          <div className="text-lg">
            {remainingQuestions} / {totalQuestions}
          </div>
          {remainingQuestions === 0 && (
            <div className="mt-2 text-sm text-gray-600">
              Hai risposto a tutte le domande! Puoi ricominciare o continuare a esercitarti.
            </div>
          )}
        </div>
      </div>
      
      <div className="flex justify-end">
        <button 
          onClick={onStartSession} 
          className="btn-primary"
        >
          Inizia Sessione
        </button>
      </div>
    </div>
  );
};

export default ExerciseSettings;