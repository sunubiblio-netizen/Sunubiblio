'use client';

import React from 'react';

interface ExerciseAIButtonProps {
  onClick: () => void;
  isAIAvailable?: boolean;
}

export const ExerciseAIButton: React.FC<ExerciseAIButtonProps> = ({
  onClick,
  isAIAvailable = true,
}) => {
  return (
    <button
      type="button"
      className={`sunubiblio-exercise-ai-btn ${!isAIAvailable ? 'is-disabled-exam' : ''}`}
      onClick={onClick}
      aria-label={
        isAIAvailable
          ? "Ouvrir l'assistant pédagogique IA Sunubiblio"
          : "IA désactivée pour cette épreuve d'examen officiel"
      }
      title={
        isAIAvailable
          ? "Assistant IA Sunubiblio (Aide contextuelle)"
          : "IA non autorisée pendant cette épreuve officielle"
      }
    >
      <span className="ai-btn-icon-wrap" aria-hidden="true">
        {isAIAvailable ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
            <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
        )}
      </span>

      <span className="ai-btn-label">IA</span>

      {isAIAvailable && <span className="ai-btn-indicator-dot" aria-hidden="true" />}
    </button>
  );
};
