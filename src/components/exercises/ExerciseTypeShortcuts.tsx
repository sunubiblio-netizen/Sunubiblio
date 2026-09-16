'use client';

import React from 'react';
import { ExerciseType } from '@/types/exercise';

interface ExerciseTypeShortcutsProps {
  selectedType: ExerciseType | 'all';
  onSelectType: (type: ExerciseType | 'all') => void;
  counts?: {
    qcm: number;
    exercice: number;
    correction: number;
  };
}

export const ExerciseTypeShortcuts: React.FC<ExerciseTypeShortcutsProps> = ({
  selectedType,
  onSelectType,
  counts,
}) => {
  const types = [
    {
      id: 'qcm' as ExerciseType,
      title: 'QCM Interactifs',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <polyline points="9 11 12 14 22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      tag: 'Test rapide',
      description: 'Testez rapidement vos connaissances avec validation et explication immédiates.',
      count: counts?.qcm,
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.08)',
    },
    {
      id: 'exercice' as ExerciseType,
      title: 'Exercices d’Application',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
      ),
      tag: 'Pratique guidée',
      description: 'Résolvez des problèmes pas à pas et consolidez vos méthodes de travail.',
      count: counts?.exercice,
      color: '#8b5cf6',
      bgColor: 'rgba(139, 92, 246, 0.08)',
    },
    {
      id: 'correction' as ExerciseType,
      title: 'Annales & Corrections',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      ),
      tag: 'Méthode & Sujets',
      description: 'Comprenez vos erreurs avec des corrigés détaillés et des conseils d’examen.',
      count: counts?.correction,
      color: '#10b981',
      bgColor: 'rgba(16, 185, 129, 0.08)',
    },
  ];

  return (
    <div className="exercise-types-grid">
      {types.map((t) => {
        const isSelected = selectedType === t.id;
        return (
          <div
            key={t.id}
            role="button"
            tabIndex={0}
            className={`exercise-type-card ${isSelected ? 'is-active' : ''}`}
            onClick={() => onSelectType(isSelected ? 'all' : t.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onSelectType(isSelected ? 'all' : t.id);
              }
            }}
          >
            <div className="type-card-header">
              <div
                className="type-icon-box"
                style={{ color: t.color, backgroundColor: t.bgColor }}
              >
                {t.icon}
              </div>
              <span className="type-tag">{t.tag}</span>
            </div>

            <h2 className="type-card-title">{t.title}</h2>
            <p className="type-card-desc">{t.description}</p>

            <div className="type-card-footer">
              <span className="type-badge-action">
                {isSelected ? '✓ Filtre actif' : 'Explorer ce format'}
              </span>
              {typeof t.count === 'number' && (
                <span className="type-count-pill">{t.count} dispo</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
