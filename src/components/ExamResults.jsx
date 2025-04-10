import React from 'react';
import { PASSING_SCORE } from '../constants';

const ExamResults = ({ results, onNewExam, onReturnHome }) => {
  const { score, isPassed, incorrectAnswers } = results;
  
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Risultati dell'Esame</h1>
      
      <div className="card mb-6">
        <div className="text-center mb-6">
          <h2 className="text-4xl font-bold mb-2">{score}/20</h2>
          
          {isPassed ? (
            <div className="text-green-600 font-medium">
              Hai superato l'esame! Congratulazioni!
            </div>
          ) : (
            <div className="text-red-600 font-medium">
              Non hai superato l'esame. Servono almeno {PASSING_SCORE} risposte corrette.
            </div>
          )}
        </div>
        
        <div className="flex justify-center space-x-4 mb-6">
          <button onClick={onNewExam} className="btn-primary">
            Nuovo Esame
          </button>
          <button onClick={onReturnHome} className="btn-outline">
            Torna alla Home
          </button>
        </div>
      </div>
      
      {incorrectAnswers.length > 0 && (
        <div className="card">
          <h3 className="text-xl font-bold mb-4">Risposte Errate</h3>
          
          <div className="space-y-6">
            {incorrectAnswers.map((item, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <p className="font-medium mb-2">{item.question.question}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-3">
                  <div className="p-2 bg-red-50 border border-red-200 rounded-md">
                    <div className="text-sm text-red-700 font-medium mb-1">La tua risposta:</div>
                    <p>{item.userAnswer !== null ? item.question.options[item.userAnswer] : 'Nessuna risposta'}</p>
                  </div>
                  
                  <div className="p-2 bg-green-50 border border-green-200 rounded-md">
                    <div className="text-sm text-green-700 font-medium mb-1">Risposta corretta:</div>
                    <p>{item.question.options[item.question.correctAnswerIndex]}</p>
                  </div>
                </div>
                
                {item.question.rationale && (
                  <div className="mt-2">
                    <div className="font-medium text-sm mb-1">Spiegazione:</div>
                    <p className="text-gray-700">{item.question.rationale}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamResults;