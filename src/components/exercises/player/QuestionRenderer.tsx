'use client';

import React from 'react';
import { ExerciseQuestion, ExerciseAnswer } from '@/types/exercise';

interface QuestionRendererProps {
  question: ExerciseQuestion;
  currentAnswer?: ExerciseAnswer;
  selectedChoiceId?: string;
  onSelectChoice: (choiceId: string) => void;
  onValidateAnswer: () => void;
  onRequestAIHelp: (mode: 'hint' | 'explain') => void;
}

export const QuestionRenderer: React.FC<QuestionRendererProps> = ({
  question,
  currentAnswer,
  selectedChoiceId,
  onSelectChoice,
  onValidateAnswer,
  onRequestAIHelp,
}) => {
  const isAnswered = Boolean(currentAnswer);
  const isCorrect = currentAnswer?.isCorrect;
  const choiceLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

  return (
    <div className="question-renderer-wrap">
      {/* En-tête de la question */}
      <div className="question-header">
        <div className="question-badge-points">
          <span>{question.points} {question.points <= 1 ? 'point' : 'points'}</span>
        </div>

        {/* Boutons d'aide IA contextuelle */}
        <div className="question-ai-actions">
          {!isAnswered && (
            <button
              type="button"
              className="ai-action-btn hint-btn"
              onClick={() => onRequestAIHelp('hint')}
              title="Obtenir un indice méthodologique sans la réponse"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                <line x1="9" y1="21" x2="15" y2="21" />
              </svg>
              <span>Indice IA</span>
            </button>
          )}

          <button
            type="button"
            className="ai-action-btn explain-btn"
            onClick={() => onRequestAIHelp('explain')}
            title="Approfondir avec l'IA pédagogique"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            <span>Expliquer avec IA</span>
          </button>
        </div>
      </div>

      {/* Énoncé de la question */}
      <div className="question-body">
        <h3 className="question-title-text">{question.question}</h3>
      </div>

      {/* Liste des choix QCM */}
      {question.type === 'qcm' && question.choices && (
        <div className="question-choices-list" role="radiogroup" aria-label="Choix de réponse">
          {question.choices.map((choice, index) => {
            const letter = choiceLetters[index] || `${index + 1}`;
            const isSelected = isAnswered
              ? currentAnswer?.selectedChoiceId === choice.id
              : selectedChoiceId === choice.id;

            // Classes d'état après validation
            let stateClass = '';
            if (isAnswered) {
              if (choice.isCorrect) {
                stateClass = 'is-correct-target';
              } else if (isSelected && !choice.isCorrect) {
                stateClass = 'is-wrong-selection';
              } else {
                stateClass = 'is-dimmed';
              }
            } else if (isSelected) {
              stateClass = 'is-selected';
            }

            return (
              <div
                key={choice.id}
                role="radio"
                aria-checked={isSelected}
                tabIndex={isAnswered ? -1 : 0}
                className={`choice-card-item ${stateClass}`}
                onClick={() => {
                  if (!isAnswered) {
                    onSelectChoice(choice.id);
                  }
                }}
                onKeyDown={(e) => {
                  if (!isAnswered && (e.key === 'Enter' || e.key === ' ')) {
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

                {isAnswered && choice.isCorrect && (
                  <div className="choice-state-badge badge-success">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                    <span>Bonne réponse</span>
                  </div>
                )}

                {isAnswered && isSelected && !choice.isCorrect && (
                  <div className="choice-state-badge badge-danger">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                    <span>Votre choix</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Bouton de validation (si non validé) */}
      {!isAnswered && (
        <div className="question-validate-row">
          <button
            type="button"
            className="btn-primary validate-action-btn"
            disabled={!selectedChoiceId}
            onClick={onValidateAnswer}
          >
            <span>Valider ma réponse</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="9 11 12 14 22 4" />
            </svg>
          </button>
        </div>
      )}

      {/* BLOC DE CORRECTION PÉDAGOGIQUE (affiché UNIQUEMENT après validation) */}
      {isAnswered && (
        <div className={`pedagogic-correction-box ${isCorrect ? 'box-success' : 'box-wrong'}`}>
          <div className="correction-status-bar">
            {isCorrect ? (
              <div className="status-item success">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                  <polyline points="22 4 12 14.01 9 11.01" />
                </svg>
                <span>Bonne réponse ! (+{question.points} {question.points <= 1 ? 'pt' : 'pts'})</span>
              </div>
            ) : (
              <div className="status-item wrong">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="15" y1="9" x2="9" y2="15" />
                  <line x1="9" y1="9" x2="15" y2="15" />
                </svg>
                <span>Réponse incorrecte (0 pt)</span>
              </div>
            )}
          </div>

          {/* Explication détaillée */}
          <div className="correction-section">
            <h4 className="correction-subtitle">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
              <span>Explication pédagogique</span>
            </h4>
            <p className="correction-text">{question.explanation}</p>
          </div>

          {/* Méthode de résolution si disponible */}
          {question.method && (
            <div className="correction-section method-section">
              <h4 className="correction-subtitle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <polygon points="12 2 2 7 12 12 22 7 12 2" />
                  <polyline points="2 17 12 22 22 17" />
                  <polyline points="2 12 12 17 22 12" />
                </svg>
                <span>Méthode à retenir</span>
              </h4>
              <p className="correction-text">{question.method}</p>
            </div>
          )}

          {/* Conseil d'examen si disponible */}
          {question.tip && (
            <div className="correction-section tip-section">
              <h4 className="correction-subtitle">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                </svg>
                <span>Conseil pour le concours / examen</span>
              </h4>
              <p className="correction-text">{question.tip}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
