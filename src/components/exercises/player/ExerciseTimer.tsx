'use client';

import React, { useState, useEffect } from 'react';

interface ExerciseTimerProps {
  initialMinutes: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  initialMinutes,
  onTimeUp,
  isPaused = false,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState(initialMinutes * 60);

  useEffect(() => {
    setSecondsRemaining(initialMinutes * 60);
  }, [initialMinutes]);

  useEffect(() => {
    if (isPaused) return;

    if (secondsRemaining <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, isPaused, onTimeUp]);

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = secondsRemaining < 120; // Moins de 2 minutes restantes

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className={`exercise-timer-pill ${isUrgent ? 'is-urgent' : ''}`} role="timer" aria-live="polite">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="timer-text">{formattedTime}</span>
    </div>
  );
};
