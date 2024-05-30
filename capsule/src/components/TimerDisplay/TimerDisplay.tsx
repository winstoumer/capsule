import React from 'react';

interface TimerProps {
  hours: number;
  minutes: number;
  seconds: number;
  timerFinished: boolean;
}

const TimerDisplay: React.FC<TimerProps> = ({ hours, minutes, seconds, timerFinished }) => {
  const formatTime = () => {
    if (timerFinished) {
      return '';
    } else if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (hours <= 0 && minutes > 0) {
      return `${minutes}m`;
    } else {
      return `${seconds}s`;
    }
  };

  return <span>{formatTime()}</span>;
};

export default TimerDisplay;
