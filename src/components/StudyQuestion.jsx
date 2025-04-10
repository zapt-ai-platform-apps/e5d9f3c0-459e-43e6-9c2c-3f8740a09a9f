import React from 'react';

const StudyQuestion = ({ question, showAnswer, onShowAnswer }) => {
  return (
    <div className="card">
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Spiegazione:</h3>
        <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-md">
          {question.rationale}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Domanda:</h3>
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
          {question.question}
        </div>
      </div>
      
      <div className="mb-6">
        <h3 className="font-medium text-gray-700 mb-2">Opzioni:</h3>
        <div className="space-y-2">
          {question.options.map((option, index) => (
            <div 
              key={index}
              className="p-3 bg-gray-50 border border-gray-200 rounded-md flex items-start"
            >
              <div className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center mr-2">
                {index + 1}
              </div>
              <div>{option}</div>
            </div>
          ))}
        </div>
      </div>
      
      {!showAnswer ? (
        <div className="flex justify-center">
          <button 
            onClick={onShowAnswer} 
            className="btn-primary"
          >
            Mostra Risposta
          </button>
        </div>
      ) : (
        <div className="p-4 bg-green-50 border border-green-200 rounded-md">
          <h3 className="font-medium text-green-700 mb-2">Risposta Corretta:</h3>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-green-500 text-white border border-green-500 flex items-center justify-center mr-2">
              {question.correctAnswerIndex + 1}
            </div>
            <div>{question.options[question.correctAnswerIndex]}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudyQuestion;