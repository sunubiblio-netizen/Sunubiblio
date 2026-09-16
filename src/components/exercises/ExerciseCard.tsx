'use client';

import React from 'react';
import Link from 'next/link';
import { Exercise } from '@/types/exercise';

interface ExerciseCardProps {
  exercise: Exercise;
  isFavorite?: boolean;
  isCurrentSession?: boolean;
  onToggleFavorite?: (id: string) => void;
}

export const ExerciseCard: React.FC<ExerciseCardProps> = ({
  exercise,
  isFavorite = false,
  isCurrentSession = false,
  onToggleFavorite,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'facile':
        return <span className="diff-badge diff-easy">Facile</span>;
      case 'difficile':
        return <span className="diff-badge diff-hard">Difficile</span>;
      case 'moyen':
      default:
        return <span className="diff-badge diff-medium">Moyen</span>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'qcm':
        return 'QCM Interactif';
      case 'exercice':
        return 'Exercice Guidé';
      case 'correction':
        return 'Annale Corrigée';
      default:
        return type.toUpperCase();
    }
  };

  return (
    <article className={`exercise-card-item ${isCurrentSession ? 'is-in-progress' : ''}`}>
      {/* En-tête de la carte */}
      <div className="exercise-card-top">
        <div className="exercise-type-tag">
          <span className="type-dot" />
          <span>{getTypeLabel(exercise.type)}</span>
        </div>

        <div className="card-top-right">
          {exercise.isPremium ? (
            <span className="access-tag premium-tag" title="Inclus avec formule Gold / Abonnement">
              ★ Gold
            </span>
          ) : (
            <span className="access-tag free-tag">Gratuit</span>
          )}

          {onToggleFavorite && (
            <button
              type="button"
              className={`card-fav-btn ${isFavorite ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleFavorite(exercise.id);
              }}
              aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
              title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isFavorite ? '#ec4899' : 'none'}
                stroke={isFavorite ? '#ec4899' : 'currentColor'}
                strokeWidth="2.2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Matière & Chapitre */}
      <div className="exercise-card-subject">
        <span className="subject-name">{exercise.subject}</span>
        {exercise.grade && <span className="subject-grade">• {exercise.grade}</span>}
      </div>

      {/* Titre principal de l'exercice */}
      <h2 className="exercise-card-title">
        <Link href={`/exercices/${exercise.id}`}>
          {exercise.title}
        </Link>
      </h2>

      {/* Description courte */}
      <p className="exercise-card-desc">
        {exercise.description}
      </p>

      {/* Métadonnées contextuelles (Concours, Chapitre) */}
      <div className="exercise-card-meta-row">
        {exercise.competitionName ? (
          <span className="meta-pill comp-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="8" r="7" />
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88" />
            </svg>
            <span>{exercise.competitionName}</span>
          </span>
        ) : (
          <span className="meta-pill chapter-pill">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
            <span>{exercise.chapter}</span>
          </span>
        )}

        {getDifficultyBadge(exercise.difficulty)}
      </div>

      {/* Bas de carte : métriques + CTA */}
      <div className="exercise-card-bottom">
        <div className="exercise-specs">
          <span className="spec-item" title="Nombre de questions">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <span>{exercise.questionsCount} questions</span>
          </span>

          {exercise.durationMinutes && exercise.durationMinutes > 0 && (
            <span className="spec-item" title="Durée conseillée">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>{exercise.durationMinutes} min</span>
            </span>
          )}
        </div>

        <Link
          href={`/exercices/${exercise.id}`}
          className={`exercise-card-cta ${isCurrentSession ? 'is-resume' : ''}`}
        >
          <span>{isCurrentSession ? 'Reprendre' : 'Commencer'}</span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </Link>
      </div>
    </article>
  );
};
