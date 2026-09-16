'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Exercise, ExerciseSession } from '@/types/exercise';

interface ExerciseResultViewProps {
  exercise: Exercise;
  session: ExerciseSession;
  onRestart: () => void;
}

export const ExerciseResultView: React.FC<ExerciseResultViewProps> = ({
  exercise,
  session,
  onRestart,
}) => {
  const [showReview, setShowReview] = useState(false);

  const questions = exercise.questions || [];
  const totalQuestions = questions.length;
  
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  questions.forEach((q) => {
    const ans = session.answers[q.id];
    if (!ans) {
      unattemptedCount++;
    } else if (ans.isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const percentage = session.percentage ?? (totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0);
  const score = session.score ?? correctCount;
  const maxScore = session.maxScore ?? totalQuestions;

  // Formatage du temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins === 0) return `${secs} s`;
    return `${mins} min ${secs} s`;
  };

  // Diagnostic pédagogique
  const getFeedback = (pct: number) => {
    if (pct >= 85) {
      return {
        title: 'Excellente maîtrise !',
        desc: 'Vous maîtrisez parfaitement les notions fondamentales et méthodologiques de ce chapitre. Poursuivez sur cette lancée !',
        badgeClass: 'badge-gold',
      };
    }
    if (pct >= 60) {
      return {
        title: 'Bon travail, consolidation recommandée',
        desc: 'L’essentiel des concepts est assimilé. Prenez le temps de revoir les questions où vous avez hésité pour sécuriser vos points.',
        badgeClass: 'badge-silver',
      };
    }
    return {
      title: 'Entraînement constructif',
      desc: 'Cet entraînement met en lumière les points à retravailler. Consultez les explications et reprenez la session pour progresser.',
      badgeClass: 'badge-bronze',
    };
  };

  const feedback = getFeedback(percentage);

  return (
    <div className="exercise-result-view-wrap">
      {/* Carte principale de bilan */}
      <div className="result-summary-card">
        <div className="result-top-badge">
          <span className="badge-dot" />
          <span>Session terminée</span>
        </div>

        <h2 className="result-main-title">{exercise.title}</h2>
        <p className="result-meta-sub">
          {exercise.subject} • {exercise.levelLabel} {exercise.competitionName ? `• ${exercise.competitionName}` : ''}
        </p>

        {/* Grand Score Display */}
        <div className="result-score-circle">
          <div className="score-number-big">
            {score} <span className="score-max">/ {maxScore}</span>
          </div>
          <div className="score-percentage-pill">
            {percentage}% de réussite
          </div>
        </div>

        {/* Message d'évaluation */}
        <div className={`result-feedback-box ${feedback.badgeClass}`}>
          <h3 className="feedback-heading">{feedback.title}</h3>
          <p className="feedback-text">{feedback.desc}</p>
        </div>

        {/* Grille des indicateurs détaillés */}
        <div className="result-stats-breakdown">
          <div className="stat-pill stat-correct">
            <span className="stat-dot success-dot" />
            <span className="stat-val">{correctCount}</span>
            <span className="stat-lbl">Correctes</span>
          </div>

          <div className="stat-pill stat-wrong">
            <span className="stat-dot wrong-dot" />
            <span className="stat-val">{wrongCount}</span>
            <span className="stat-lbl">Incorrectes</span>
          </div>

          <div className="stat-pill stat-unanswered">
            <span className="stat-dot neutral-dot" />
            <span className="stat-val">{unattemptedCount}</span>
            <span className="stat-lbl">Non répondues</span>
          </div>

          <div className="stat-pill stat-time">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="stat-val">{formatTime(session.timeSpentSeconds)}</span>
            <span className="stat-lbl">Temps total</span>
          </div>
        </div>

        {/* Actions principales */}
        <div className="result-actions-row">
          <button
            type="button"
            className="btn-secondary toggle-review-btn"
            onClick={() => setShowReview(!showReview)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{showReview ? 'Masquer les corrections' : 'Voir les corrections détaillées'}</span>
          </button>

          <button
            type="button"
            className="btn-primary restart-btn"
            onClick={onRestart}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <span>Recommencer</span>
          </button>

          <Link href="/exercices" className="btn-secondary back-hub-btn">
            Nouvel entraînement
          </Link>
        </div>
      </div>

      {/* SECTION REVUE DÉTAILLÉE DES QUESTIONS & CORRECTIONS */}
      {showReview && (
        <div className="result-detailed-review-wrap">
          <div className="review-header">
            <h3 className="review-title">Revue Pédagogique Question par Question</h3>
            <p className="review-subtitle">
              Analysez les réponses et explications pour comprendre chaque résolution.
            </p>
          </div>

          <div className="review-questions-list">
            {questions.map((q, idx) => {
              const ans = session.answers[q.id];
              const isCorrectAnswer = ans?.isCorrect;

              return (
                <div
                  key={q.id}
                  className={`review-question-card ${
                    isCorrectAnswer ? 'card-correct' : 'card-wrong'
                  }`}
                >
                  <div className="review-card-top">
                    <span className="question-order-pill">
                      Question {idx + 1} sur {totalQuestions}
                    </span>
                    <span
                      className={`verdict-pill ${
                        isCorrectAnswer ? 'verdict-success' : 'verdict-danger'
                      }`}
                    >
                      {isCorrectAnswer ? '✓ Bonne réponse' : '✕ Incorrect'}
                    </span>
                  </div>

                  <h4 className="review-question-text">{q.question}</h4>

                  {/* Choix avec surlignage */}
                  {q.choices && (
                    <div className="review-choices-mini">
                      {q.choices.map((c) => {
                        const wasSelected = ans?.selectedChoiceId === c.id;
                        let choiceClass = 'choice-neutral';
                        if (c.isCorrect) choiceClass = 'choice-correct';
                        else if (wasSelected && !c.isCorrect) choiceClass = 'choice-incorrect';

                        return (
                          <div key={c.id} className={`review-choice-item ${choiceClass}`}>
                            <span className="choice-marker">
                              {c.isCorrect ? '✓' : wasSelected ? '✕' : '○'}
                            </span>
                            <span className="choice-label-text">{c.label}</span>
                            {c.isCorrect && (
                              <span className="badge-tag correct-tag">Bonne réponse</span>
                            )}
                            {wasSelected && !c.isCorrect && (
                              <span className="badge-tag wrong-tag">Votre choix</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Explication & Méthode */}
                  <div className="review-explanation-box">
                    <p className="explanation-paragraph">
                      <strong>Explication :</strong> {q.explanation}
                    </p>
                    {q.method && (
                      <p className="method-paragraph">
                        <strong>Méthode :</strong> {q.method}
                      </p>
                    )}
                    {q.tip && (
                      <p className="tip-paragraph">
                        <strong>Conseil d’examen :</strong> {q.tip}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
