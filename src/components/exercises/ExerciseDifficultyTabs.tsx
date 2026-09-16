'use client';

import React from 'react';
import { TestDifficulty } from '@/types/exercise';

interface ExerciseDifficultyTabsProps {
  selectedDifficulty: TestDifficulty | 'all';
  onSelectDifficulty: (difficulty: TestDifficulty | 'all') => void;
  counts?: {
    all: number;
    beginner: number;
    intermediate: number;
    pro: number;
  };
}

export const ExerciseDifficultyTabs: React.FC<ExerciseDifficultyTabsProps> = ({
  selectedDifficulty,
  onSelectDifficulty,
  counts,
}) => {
  const tabs = [
    {
      id: 'all' as const,
      label: 'Tous les niveaux',
      count: counts?.all,
      icon: (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
          <circle cx="12" cy="12" r="10" />
          <path d="M8 12h8" />
          <path d="M12 8v8" />
        </svg>
      ),
      description: 'Vue globale des séries',
      colorDot: 'bg-indigo-500',
    },
    {
      id: 'BEGINNER' as const,
      label: 'Débutant',
      count: counts?.beginner,
      icon: (
        <span className="phase-dot phase-beginner" aria-hidden="true" />
      ),
      tag: 'Bases & Notions',
      description: 'Acquérir les fondamentaux',
      colorDot: 'bg-emerald-500',
    },
    {
      id: 'INTERMEDIATE' as const,
      label: 'Intermédiaire',
      count: counts?.intermediate,
      icon: (
        <span className="phase-dot phase-intermediate" aria-hidden="true" />
      ),
      tag: 'Maîtrise & Méthodes',
      description: 'Combiner les notions clés',
      colorDot: 'bg-amber-500',
    },
    {
      id: 'PRO' as const,
      label: 'Pro & Concours',
      count: counts?.pro,
      icon: (
        <span className="phase-dot phase-pro" aria-hidden="true" />
      ),
      tag: 'Format Examen',
      description: 'Exigence Bac & Concours',
      colorDot: 'bg-rose-500',
    },
  ];

  return (
    <div className="exercise-difficulty-tabs-container" role="tablist" aria-label="Niveaux d'entraînement">
      <div className="difficulty-tabs-header">
        <div className="difficulty-tabs-title-wrap">
          <span className="difficulty-tabs-eyebrow">Parcours progressif</span>
          <h3 className="difficulty-tabs-title">Choisissez votre palier d'entraînement</h3>
        </div>
        <div className="difficulty-tabs-hint">
          <span className="hint-pill">Recommandé : Débutant → Intermédiaire → Pro</span>
        </div>
      </div>

      <div className="difficulty-tabs-track">
        {tabs.map((tab) => {
          const isActive = selectedDifficulty === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`difficulty-tab-card ${isActive ? 'is-active' : ''} ${tab.id !== 'all' ? `tab-${tab.id.toLowerCase()}` : 'tab-all'}`}
              onClick={() => onSelectDifficulty(tab.id)}
            >
              <div className="tab-card-header">
                <div className="tab-icon-wrap">
                  {tab.icon}
                  <span className="tab-label">{tab.label}</span>
                </div>
                {typeof tab.count === 'number' && (
                  <span className="tab-count-badge">
                    {tab.count}
                  </span>
                )}
              </div>

              <div className="tab-card-body">
                <p className="tab-desc">{tab.description}</p>
                {tab.tag && <span className="tab-tag-pill">{tab.tag}</span>}
              </div>

              {isActive && <div className="tab-active-indicator" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
