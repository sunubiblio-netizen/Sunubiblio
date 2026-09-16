'use client';

import React from 'react';
import Link from 'next/link';
import { ExerciseSession } from '@/types/exercise';

interface ExerciseResumeBannerProps {
  session: ExerciseSession | null;
  onDiscardSession?: () => void;
}

export const ExerciseResumeBanner: React.FC<ExerciseResumeBannerProps> = ({
  session,
  onDiscardSession,
}) => {
  if (!session || session.status !== 'in_progress') {
    return null;
  }

  const answeredCount = Object.keys(session.answers).length;
  const progressPercent = Math.round((answeredCount / session.totalQuestions) * 100);

  return (
    <div className="exercise-resume-banner">
      <div className="resume-banner-content">
        <div className="resume-icon-badge">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        <div className="resume-details">
          <div className="resume-tag">
            <span className="resume-pulse-dot" />
            <span>Session en cours</span>
          </div>
          <h2 className="resume-title">{session.exerciseTitle}</h2>
          <p className="resume-meta">
            {session.subject} • {session.levelLabel} • Question {session.currentQuestionIndex + 1} sur {session.totalQuestions} ({progressPercent}% complété)
          </p>
        </div>
      </div>

      <div className="resume-actions">
        <Link
          href={`/exercices/${session.exerciseId}`}
          className="btn-primary resume-continue-btn"
        >
          <span>Continuer</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>

        {onDiscardSession && (
          <button
            type="button"
            className="resume-discard-btn"
            onClick={onDiscardSession}
            title="Abandonner cette session"
          >
            Abandonner
          </button>
        )}
      </div>
    </div>
  );
};
