'use client';

import React, { useEffect } from 'react';
import { ExerciseQuestion } from '@/types/exercise';

interface ExerciseQuestionsBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  questions: ExerciseQuestion[];
  currentIndex: number;
  answers: Record<string, any>;
  onSelectQuestion: (index: number) => void;
  title?: string;
}

export const ExerciseQuestionsBottomSheet: React.FC<ExerciseQuestionsBottomSheetProps> = ({
  isOpen,
  onClose,
  questions,
  currentIndex,
  answers,
  onSelectQuestion,
  title = 'Grille des questions',
}) => {
  // Empêcher le scroll du body quand le drawer est ouvert
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="mobile-questions-sheet-backdrop" onClick={onClose}>
      <div
        className="mobile-questions-sheet-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        {/* Poignée de drag/sheet */}
        <div className="sheet-handle-bar" onClick={onClose} />

        <div className="sheet-header">
          <div className="sheet-title-box">
            <h3 className="sheet-title">{title}</h3>
            <span className="sheet-subtitle">
              <strong>{answeredCount}</strong> sur <strong>{totalQuestions}</strong> répondu{answeredCount > 1 ? 's' : ''}
            </span>
          </div>

          <button
            type="button"
            className="sheet-close-btn"
            onClick={onClose}
            aria-label="Fermer la liste des questions"
          >
            ✕
          </button>
        </div>

        {/* Légende rapide */}
        <div className="sheet-legend-bar">
          <div className="legend-chip chip-answered">
            <span className="chip-mark">✓</span>
            <span>Répondu</span>
          </div>
          <div className="legend-chip chip-current">
            <span className="chip-mark">●</span>
            <span>Actuelle</span>
          </div>
          <div className="legend-chip chip-pending">
            <span className="chip-mark">—</span>
            <span>En attente</span>
          </div>
        </div>

        {/* Grille dynamique des pastilles */}
        <div className="sheet-questions-scroll-wrap">
          <div className="sheet-questions-grid">
            {questions.map((q, idx) => {
              const isCurrent = idx === currentIndex;
              const isAnswered = Boolean(answers[q.id]);

              let cellStatus = 'status-pending';
              if (isCurrent) {
                cellStatus = 'status-current';
              } else if (isAnswered) {
                cellStatus = 'status-answered';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  className={`sheet-cell-btn ${cellStatus}`}
                  onClick={() => {
                    onSelectQuestion(idx);
                    onClose();
                  }}
                  aria-label={`Question ${idx + 1}${isAnswered ? ', répondue' : ', en attente'}${isCurrent ? ', actuelle' : ''}`}
                >
                  <span className="sheet-cell-number">{idx + 1}</span>
                  {isAnswered && !isCurrent && (
                    <span className="sheet-cell-badge">✓</span>
                  )}
                  {isCurrent && (
                    <span className="sheet-cell-badge">●</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div className="sheet-footer">
          <button
            type="button"
            className="sheet-dismiss-btn"
            onClick={onClose}
          >
            Reprendre le test
          </button>
        </div>
      </div>
    </div>
  );
};
