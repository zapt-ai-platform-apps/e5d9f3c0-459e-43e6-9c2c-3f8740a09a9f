import React from 'react';

const ExerciseQuestion = ({ 
  question, 
  selectedAnswer, 
  showFeedback, 
  isCorrect, 
  onSelectAnswer, 
  onNext 
}) => {
  return (
    <div className="card">
      <div className="mb-4">
        <h2 className="text-xl font-medium">{question.question}</h2>
      </div>
      
      <div className="space-y-3 mb-6">
        {question.options.map((option, index) => {
          let optionClassName = "w-full text-left p-3 border rounded-md transition-colors duration-200 ";
          
          if (showFeedback) {
            if (index === question.correctAnswerIndex) {
              optionClassName += "border-green-500 bg-green-50";
            } else if (index === selectedAnswer && !isCorrect) {
              optionClassName += "border-red-500 bg-red-50";
            } else {
              optionClassName += "border-gray-300 opacity-70";
            }
          } else {
            optionClassName += selectedAnswer === index 
              ? "border-blue-500 bg-blue-50" 
              : "border-gray-300 hover:bg-blue-50";
          }
          
          return (
            <button
              key={index}
              onClick={() => !showFeedback && onSelectAnswer(index)}
              className={optionClassName}
              disabled={showFeedback}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 mt-0.5
                ${showFeedback && index === question.correctAnswerIndex 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : showFeedback && index === selectedAnswer && !isCorrect 
                    ? 'bg-red-500 border-red-500 text-white'
                    : selectedAnswer === index
                      ? 'bg-blue-500 border-blue-500 text-white' 
                      : 'border-gray-400'}`}
                >
                  {index + 1}
                </div>
                <span>{option}</span>
              </div>
            </button>
          );
        })}
      </div>
      
      {showFeedback && (
        <div className={`p-4 rounded-md mt-4 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <div className={`font-medium mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect ? 'Risposta Corretta!' : 'Risposta Errata!'}
          </div>
          
          {!isCorrect && (
            <div className="mb-2">
              <span className="font-medium">Risposta corretta:</span> {question.options[question.correctAnswerIndex]}
            </div>
          )}
          
          <div>
            <span className="font-medium">Spiegazione:</span> {question.rationale}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseQuestion;