'use client';

import React from 'react';
import { ExerciseQuestion, ExerciseAnswer } from '@/types/exercise';

interface QuestionRendererProps {
  question: ExerciseQuestion;
  currentAnswer?: ExerciseAnswer;
  selectedChoiceId?: string;
  onSelectChoice: (choiceId: string) => void;
  isExamMode?: boolean;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  selectedChoiceId,
  onSelectChoice,
  isExamMode = true,
}) => {
  const choiceLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
  const activeSelectedId = selectedChoiceId || currentAnswer?.selectedChoiceId;

  return (
    <div className="question-renderer-wrap">
      {/* En-tête de la question */}
      <div className="question-header">
        <div className="question-badge-points">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
          <span>{question.points} {question.points <= 1 ? 'point' : 'points'}</span>
        </div>

        <div className="question-status-pill">
          {activeSelectedId ? (
            <span className="answered-status answered-yes">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <span>Réponse enregistrée</span>
            </span>
          ) : (
            <span className="answered-status answered-pending">
              <span>En attente de réponse</span>
            </span>
          )}
        </div>
      </div>

      {/* Énoncé de la question */}
      <div className="question-body">
        <h3 className="question-title-text">{question.question}</h3>
      </div>

      {/* Consigne d'épreuve discrète */}
      <div className="question-instruction-hint">
        <span>Sélectionnez la réponse qui vous paraît exacte parmi les propositions ci-dessous :</span>
      </div>

      {/* Liste des choix QCM */}
      {question.type === 'qcm' && question.choices && (
        <div className="question-choices-list" role="radiogroup" aria-label="Choix de réponse">
          {question.choices.map((choice, index) => {
            const letter = choiceLetters[index] || `${index + 1}`;
            const isSelected = activeSelectedId === choice.id;

            return (
              <div
                key={choice.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                className={`choice-card-item ${isSelected ? 'is-selected' : ''}`}
                onClick={() => onSelectChoice(choice.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectChoice(choice.id);
                  }
                }}
              >
                <div className="choice-indicator">
                  <span className="choice-letter">{letter}</span>
                </div>

                <div className="choice-text">
                  <span>{choice.label}</span>
                </div>

                <div className="choice-radio-marker">
                  <div className={`radio-outer ${isSelected ? 'is-checked' : ''}`}>
                    {isSelected && <div className="radio-inner" />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
