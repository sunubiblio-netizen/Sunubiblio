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
              <span className="metric-label">Tests complétés</span>
              <span className="metric-value">{progress.totalCompletedSessions}</span>
              <span className="metric-sub">Sessions finalisées</span>
            </div>

            <div className="progress-metric-card">
              <span className="metric-label">Score moyen</span>
              <span className="metric-value metric-score">{progress.averageScorePercentage}%</span>
              <span className="metric-sub">Sur l’ensemble des tests</span>
            </div>

            <div className="progress-metric-card">
              <span className="metric-label">Temps d’entraînement</span>
              <span className="metric-value">{formatMinutes(progress.totalTimeSpentSeconds)}</span>
              <span className="metric-sub">Pratique cumulée</span>
            </div>

            <div className="progress-metric-card">
              <span className="metric-label">Matières travaillées</span>
              <span className="metric-value">{progress.subjectsPracticedCount}</span>
              <span className="metric-sub">Disciplines explorées</span>
            </div>
          </div>

          {/* PROGRESSION PAR PHASE DE DIFFICULTÉ (DÉBUTANT, INTERMÉDIAIRE, PRO) */}
          {progress.byDifficulty && (
            <div className="progress-difficulty-breakdown-card">
              <div className="breakdown-header">
                <div>
                  <h4 className="breakdown-title">Progression par Niveau de Maîtrise</h4>
                  <p className="breakdown-subtitle">Taux de réussite et volume de tests complétés par palier</p>
                </div>
              </div>

              <div className="difficulty-gauges-grid">
                {/* 1. Débutant */}
                <div className="gauge-item gauge-beginner">
                  <div className="gauge-item-header">
                    <div className="gauge-label-wrap">
                      <span className="phase-dot phase-beginner" />
                      <span className="gauge-label">Débutant</span>
                    </div>
                    <span className="gauge-pct">{progress.byDifficulty.beginner.averageScorePercentage}%</span>
                  </div>
                  <div className="gauge-track">
                    <div
                      className="gauge-fill fill-beginner"
                      style={{ width: `${progress.byDifficulty.beginner.averageScorePercentage}%` }}
                    />
                  </div>
                  <span className="gauge-sub">
                    {progress.byDifficulty.beginner.completedCount} test{progress.byDifficulty.beginner.completedCount > 1 ? 's' : ''} réalisé{progress.byDifficulty.beginner.completedCount > 1 ? 's' : ''}
                  </span>
                </div>

                {/* 2. Intermédiaire */}
                <div className="gauge-item gauge-intermediate">
                  <div className="gauge-item-header">
                    <div className="gauge-label-wrap">
                      <span className="phase-dot phase-intermediate" />
                      <span className="gauge-label">Intermédiaire</span>
                    </div>
                    <span className="gauge-pct">{progress.byDifficulty.intermediate.averageScorePercentage}%</span>
                  </div>
                  <div className="gauge-track">
                    <div
                      className="gauge-fill fill-intermediate"
                      style={{ width: `${progress.byDifficulty.intermediate.averageScorePercentage}%` }}
                    />
                  </div>
                  <span className="gauge-sub">
                    {progress.byDifficulty.intermediate.completedCount} test{progress.byDifficulty.intermediate.completedCount > 1 ? 's' : ''} réalisé{progress.byDifficulty.intermediate.completedCount > 1 ? 's' : ''}
                  </span>
                </div>

                {/* 3. Pro */}
                <div className="gauge-item gauge-pro">
                  <div className="gauge-item-header">
                    <div className="gauge-label-wrap">
                      <span className="phase-dot phase-pro" />
                      <span className="gauge-label">Pro / Concours</span>
                    </div>
                    <span className="gauge-pct">{progress.byDifficulty.pro.averageScorePercentage}%</span>
                  </div>
                  <div className="gauge-track">
                    <div
                      className="gauge-fill fill-pro"
                      style={{ width: `${progress.byDifficulty.pro.averageScorePercentage}%` }}
                    />
                  </div>
                  <span className="gauge-sub">
                    {progress.byDifficulty.pro.completedCount} test{progress.byDifficulty.pro.completedCount > 1 ? 's' : ''} réalisé{progress.byDifficulty.pro.completedCount > 1 ? 's' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}

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
