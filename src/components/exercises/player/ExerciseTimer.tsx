'use client';

import React, { useState, useEffect } from 'react';

interface ExerciseTimerProps {
  durationMinutes?: number;
  initialMinutes?: number;
  timeSpentSeconds?: number;
  onTimeUp: () => void;
  isPaused?: boolean;
}

export const ExerciseTimer: React.FC<ExerciseTimerProps> = ({
  durationMinutes,
  initialMinutes,
  timeSpentSeconds = 0,
  onTimeUp,
  isPaused = false,
}) => {
  const totalMins = typeof durationMinutes === 'number' ? durationMinutes : (initialMinutes || 0);
  const isCountdown = totalMins > 0;

  // Calcul du temps restant en mode compte à rebours
  const [secondsRemaining, setSecondsRemaining] = useState(totalMins * 60);

  useEffect(() => {
    if (isCountdown) {
      setSecondsRemaining(Math.max(totalMins * 60 - timeSpentSeconds, 0));
    }
  }, [totalMins, timeSpentSeconds, isCountdown]);

  useEffect(() => {
    if (!isCountdown || isPaused) return;

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
  }, [secondsRemaining, isPaused, isCountdown, onTimeUp]);

  // Si temps illimité : afficher temps écoulé croissant
  if (!isCountdown) {
    const elapsedMins = Math.floor(timeSpentSeconds / 60);
    const elapsedSecs = timeSpentSeconds % 60;
    const formatted = `${String(elapsedMins).padStart(2, '0')}:${String(elapsedSecs).padStart(2, '0')}`;

    return (
      <div className="exercise-timer-pill" role="timer" aria-live="polite" title="Temps d'épreuve non limité">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        <span className="timer-text">{formatted}</span>
      </div>
    );
  }

  // Si chronométré : décompte officiel
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isUrgent = secondsRemaining < 120; // Moins de 2 minutes restantes

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div
      className={`exercise-timer-pill ${isUrgent ? 'is-urgent' : ''}`}
      role="timer"
      aria-live="polite"
      title="Temps officiel restant pour cette épreuve"
    >
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <span className="timer-text">{formattedTime}</span>
    </div>
  );
};
