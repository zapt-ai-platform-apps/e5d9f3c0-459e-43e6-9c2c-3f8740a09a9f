import React from 'react';

const ExamQuestion = ({ 
  questionNumber, 
  questionText, 
  options, 
  selectedOption, 
  onSelectOption 
}) => {
  return (
    <div className="card">
      <div className="mb-4">
        <span className="inline-block text-white bg-blue-600 rounded-full px-3 py-1 text-sm font-medium mb-2">
          Domanda {questionNumber}
        </span>
        <h2 className="text-xl font-medium">{questionText}</h2>
      </div>
      
      <div className="space-y-3">
        {options.map((option, index) => (
          <button
            key={index}
            onClick={() => onSelectOption(index)}
            className={`w-full text-left p-3 border rounded-md transition-colors duration-200 hover:bg-blue-50 
            ${selectedOption === index ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
          >
            <div className="flex items-start">
              <div className={`flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center mr-3 mt-0.5
              ${selectedOption === index ? 'bg-blue-500 border-blue-500 text-white' : 'border-gray-400'}`}>
                {String.fromCharCode(66 + index)}
              </div>
              <span>{option}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamQuestion;