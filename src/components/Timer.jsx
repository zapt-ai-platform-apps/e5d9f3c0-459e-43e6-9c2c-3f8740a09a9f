import React, { useState, useEffect, useCallback } from 'react';
import * as Sentry from '@sentry/browser';

const Timer = ({ initialTime, onTimeUpdate, isActive }) => {
  const [timeRemaining, setTimeRemaining] = useState(initialTime);

  // Format time as MM:SS
  const formatTime = useCallback(() => {
    try {
      const minutes = Math.floor(timeRemaining / 60);
      const seconds = timeRemaining % 60;
      return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } catch (error) {
      console.error('Error formatting time:', error);
      Sentry.captureException(error);
      return '00:00';
    }
  }, [timeRemaining]);

  // Update timer every second
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        const newTime = Math.max(0, prev - 1);
        onTimeUpdate(newTime);
        return newTime;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isActive, onTimeUpdate]);

  // Color changes based on time remaining
  const getTimerColor = useCallback(() => {
    if (timeRemaining <= 60) return 'bg-red-500'; // Last minute
    if (timeRemaining <= 300) return 'bg-yellow-500'; // Last 5 minutes
    return 'bg-green-500';
  }, [timeRemaining]);

  return (
    <div className="flex items-center">
      <div className={`w-3 h-3 rounded-full ${getTimerColor()} mr-2`}></div>
      <div className="font-mono font-medium">
        {formatTime()}
      </div>
    </div>
  );
};

export default Timer;