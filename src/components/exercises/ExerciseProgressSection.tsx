'use client';

import React from 'react';
import Link from 'next/link';
import { ExerciseUserProgress } from '@/types/exercise';

interface ExerciseProgressSectionProps {
  progress: ExerciseUserProgress;
  onExploreExercises?: () => void;
}

export const ExerciseProgressSection: React.FC<ExerciseProgressSectionProps> = ({
  progress,
  onExploreExercises,
}) => {
  const hasHistory = progress.totalCompletedSessions > 0;

  const formatMinutes = (seconds: number) => {
    const mins = Math.round(seconds / 60);
    if (mins < 60) return `${mins} min`;
    const hrs = Math.floor(mins / 60);
    const remMins = mins % 60;
    return `${hrs}h ${remMins}m`;
  };

  return (
    <section className="exercise-progress-section" aria-label="Progression de l'utilisateur">
      <div className="section-header-row">
        <div>
          <span className="section-eyebrow">Tableau de bord personnel</span>
          <h2 className="section-heading">Ma Progression & Historique</h2>
        </div>
        {hasHistory && (
          <span className="progress-status-badge">
            ✓ Données synchronisées
          </span>
        )}
      </div>

      {!hasHistory ? (
        <div className="progress-empty-state">
          <div className="empty-icon-circle">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 20h9" />
              <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
            </svg>
          </div>
          <h3 className="empty-title">Commencez votre premier entraînement</h3>
          <p className="empty-desc">
            Complétez un QCM ou un exercice pour suivre ici votre taux de réussite réel, vos temps de réponse et vos matières travaillées.
          </p>
          {onExploreExercises && (
            <button
              type="button"
              className="btn-secondary empty-action-btn"
              onClick={onExploreExercises}
            >
              Découvrir les exercices recommandés
            </button>
          )}
        </div>
      ) : (
        <div className="progress-content-wrap">
          {/* Métriques clés */}
          <div className="progress-metrics-grid">
            <div className="progress-metric-card">
              <span className="metric-label">Exercices complétés</span>
              <span className="metric-value">{progress.totalCompletedSessions}</span>
              <span className="metric-sub">Séries finalisées</span>
            </div>

            <div className="progress-metric-card">
              <span className="metric-label">Score moyen</span>
              <span className="metric-value metric-score">{progress.averageScorePercentage}%</span>
              <span className="metric-sub">Sur l’ensemble des sessions</span>
            </div>

            <div className="progress-metric-card">
              <span className="metric-label">Temps d’entraînement</span>
              <span className="metric-value">{formatMinutes(progress.totalTimeSpentSeconds)}</span>
              <span className="metric-sub">Pratique cumulée</span>
            </div>

            <div className="progress-metric-card">
              <span className="metric-label">Matières révisées</span>
              <span className="metric-value">{progress.subjectsPracticedCount}</span>
              <span className="metric-sub">Disciplines explorées</span>
            </div>
          </div>

          {/* Sessions récentes */}
          {progress.recentSessions.length > 0 && (
            <div className="recent-sessions-box">
              <h4 className="recent-sessions-title">Dernières sessions terminées</h4>
              <div className="recent-sessions-list">
                {progress.recentSessions.map((session) => (
                  <div key={session.id} className="recent-session-row">
                    <div className="session-info">
                      <span className="session-title">{session.exerciseTitle}</span>
                      <span className="session-meta">
                        {session.subject} • {session.levelLabel} • {session.totalQuestions} questions
                      </span>
                    </div>

                    <div className="session-stats">
                      <span
                        className={`session-score-pill ${
                          (session.percentage || 0) >= 70
                            ? 'high-score'
                            : (session.percentage || 0) >= 50
                            ? 'mid-score'
                            : 'low-score'
                        }`}
                      >
                        {session.score}/{session.maxScore} ({session.percentage}%)
                      </span>

                      <Link
                        href={`/exercices/${session.exerciseId}`}
                        className="session-retry-btn"
                        title="Recommencer cet entraînement"
                      >
                        Recommencer
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};
