import React from 'react';

const ProgressCard = ({ completed, total, label, onReset }) => {
  const percentage = (completed / total) * 100;

  return (
    <div className="bg-gray-50 p-3 rounded-md border border-gray-200">
      <div className="flex justify-between items-center mb-1">
        <span className="text-sm font-medium">{label}</span>
        <div className="text-sm text-gray-500">
          {completed}/{total}
        </div>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      
      {completed > 0 && (
        <button
          onClick={onReset}
          className="text-xs text-gray-500 hover:text-gray-700 underline"
        >
          Reimposta progresso
        </button>
      )}
    </div>
  );
};

export default ProgressCard;