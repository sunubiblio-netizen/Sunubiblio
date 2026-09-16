'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Exercise, ExerciseSession, ExerciseQuestion } from '@/types/exercise';
import { AIService } from '@/services/aiService';

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
  const questions = exercise.questions || [];
  const totalQuestions = questions.length;

  // Par défaut : toutes les questions sont repliées pour une page courte et compacte
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  // État de la modale IA pédagogique
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeAIQuestion, setActiveAIQuestion] = useState<ExerciseQuestion | null>(null);
  const [aiPromptMode, setAiPromptMode] = useState<
    'why_wrong' | 'explain_simple' | 'method' | 'similar_exercise'
  >('why_wrong');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  // Calcul des scores et indicateurs
  let correctCount = 0;
  let wrongCount = 0;
  let unattemptedCount = 0;

  questions.forEach((q) => {
    const ans = session.answers[q.id];
    if (!ans || !ans.selectedChoiceId) {
      unattemptedCount++;
    } else if (ans.isCorrect) {
      correctCount++;
    } else {
      wrongCount++;
    }
  });

  const percentage =
    session.percentage ??
    (totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0);
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
    if (pct >= 80) {
      return {
        title: 'Excellente maîtrise !',
        desc: 'Vous validez ce test avec succès. Vos fondamentaux sont solides.',
        colorClass: 'feedback-success',
      };
    }
    if (pct >= 50) {
      return {
        title: 'Bon résultat, consolidation conseillée',
        desc: 'L’essentiel est compris. Ouvrez les questions erronées pour revoir la méthode.',
        colorClass: 'feedback-warning',
      };
    }
    return {
      title: 'Entraînement constructif à approfondir',
      desc: 'Prenez le temps d’ouvrir les corrections pas à pas pour progresser.',
      colorClass: 'feedback-danger',
    };
  };

  const feedback = getFeedback(percentage);

  // Gestion accordéon : Toggle d'une question
  const toggleQuestion = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Tout ouvrir / Tout fermer
  const areAllExpanded = questions.length > 0 && expandedIds.size === questions.length;
  const toggleAllQuestions = () => {
    if (areAllExpanded) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(questions.map((q) => q.id)));
    }
  };

  // Déclencher une demande IA contextuelle sur une question
  const handleOpenAIHelp = async (
    q: ExerciseQuestion,
    mode: 'why_wrong' | 'explain_simple' | 'method' | 'similar_exercise'
  ) => {
    setActiveAIQuestion(q);
    setAiPromptMode(mode);
    setAiModalOpen(true);
    setAiLoading(true);
    setAiResponse(null);

    const userAns = session.answers[q.id];
    const chosenChoice = q.choices?.find((c) => c.id === userAns?.selectedChoiceId);
    const correctChoice = q.choices?.find((c) => c.isCorrect);

    let promptContent = '';
    if (mode === 'why_wrong') {
      promptContent = `Dans le cadre d'un entraînement d'examen en ${exercise.subject} (${exercise.chapter}, niveau ${exercise.levelLabel}), pour la question :
« ${q.question} »
L'élève a répondu : « ${chosenChoice ? chosenChoice.label : 'Aucune réponse'} ».
Or la réponse correcte est : « ${correctChoice ? correctChoice.label : 'Inconnue'} ».
Explique avec pédagogie pourquoi la réponse choisie est fausse et quel piège a pu induire l'élève en erreur.`;
    } else if (mode === 'explain_simple') {
      promptContent = `En ${exercise.subject} (${exercise.chapter}), réexplique la question suivante de manière très simple et concrète :
« ${q.question} »
Solution attendue : « ${correctChoice?.label} ».`;
    } else if (mode === 'method') {
      promptContent = `Détaille la méthode universelle étape par étape pour résoudre ce type d'exercice :
« ${q.question} ».`;
    } else {
      promptContent = `Propose un nouvel exercice d'entraînement similaire (avec 4 choix et la solution détaillée) pour :
« ${q.question} ».`;
    }

    try {
      const res = await AIService.processRequest({
        content: promptContent,
        mode: 'expliquer',
      });
      setAiResponse(res.content);
    } catch {
      setAiResponse(
        "L'assistant pédagogique Sunubiblio n'a pas pu traiter la demande. Veuillez réessayer."
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="exercise-result-compact-wrap">
      {/* 1. BILAN COMPACT EN HAUT (Hauteur optimisée, sans espaces superflus) */}
      <div className="result-compact-hero">
        <div className="compact-hero-header">
          <div className="hero-title-col">
            <div className="hero-badge-row">
              <span className="hero-validated-pill">
                <span className="dot-pulse" />
                Épreuve terminée
              </span>
              <span className={`exam-difficulty-badge diff-${exercise.difficulty.toLowerCase()}`}>
                {exercise.difficultyLabel}
              </span>
              {exercise.competitionName && (
                <span className="hero-contest-pill">{exercise.competitionName}</span>
              )}
            </div>
            <h2 className="hero-title-text">{exercise.title}</h2>
            <p className="hero-meta-text">
              {exercise.subject} • {exercise.levelLabel} • Chapitre : {exercise.chapter}
            </p>
          </div>

          {/* Pastille de score compacte */}
          <div className="hero-score-badge">
            <div className="score-main-value">
              {score} <span className="score-denom">/ {maxScore}</span>
            </div>
            <div className="score-percentage-text">{percentage}% de réussite</div>
          </div>
        </div>

        {/* Message d'évaluation concis */}
        <div className={`hero-feedback-banner ${feedback.colorClass}`}>
          <span className="feedback-icon-indicator" aria-hidden="true">
            {percentage >= 80 ? '🌟' : percentage >= 50 ? '📈' : '💡'}
          </span>
          <div className="feedback-texts">
            <strong>{feedback.title}</strong> — <span>{feedback.desc}</span>
          </div>
        </div>

        {/* Mini-indicateurs statistiques horizontaux */}
        <div className="hero-stats-row">
          <div className="hero-stat-pill pill-correct">
            <span className="stat-symbol">✓</span>
            <span className="stat-qty">{correctCount}</span>
            <span className="stat-name">Correctes</span>
          </div>

          <div className="hero-stat-pill pill-wrong">
            <span className="stat-symbol">✕</span>
            <span className="stat-qty">{wrongCount}</span>
            <span className="stat-name">Incorrectes</span>
          </div>

          <div className="hero-stat-pill pill-unanswered">
            <span className="stat-symbol">—</span>
            <span className="stat-qty">{unattemptedCount}</span>
            <span className="stat-name">Non répondues</span>
          </div>

          <div className="hero-stat-pill pill-duration">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="stat-qty">{formatTime(session.timeSpentSeconds)}</span>
            <span className="stat-name">Temps</span>
          </div>
        </div>

        {/* Boutons d'action compacts */}
        <div className="hero-actions-row">
          <button type="button" className="btn-primary hero-btn" onClick={onRestart}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <span>Recommencer ce test</span>
          </button>

          <Link href="/exercices" className="btn-secondary hero-btn">
            Catalogue d'entraînement
          </Link>
        </div>
      </div>

      {/* 2. SECTION CORRECTION DÉTAILLÉE PAR ACCORDÉON */}
      <section className="correction-accordion-section" aria-label="Correction détaillée">
        <div className="accordion-section-bar">
          <div className="accordion-bar-left">
            <h3 className="accordion-section-title">Corrections détaillées</h3>
            <span className="accordion-section-count">
              {correctCount}/{totalQuestions} questions validées
            </span>
          </div>

          {/* Bouton global Tout ouvrir / Tout fermer */}
          <button
            type="button"
            className="toggle-all-questions-btn"
            onClick={toggleAllQuestions}
            aria-label={areAllExpanded ? 'Tout replier' : 'Tout déplier'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              {areAllExpanded ? (
                <>
                  <polyline points="18 15 12 9 6 15" />
                  <polyline points="18 9 12 3 6 9" />
                </>
              ) : (
                <>
                  <polyline points="6 9 12 15 18 9" />
                  <polyline points="6 15 12 21 18 15" />
                </>
              )}
            </svg>
            <span>{areAllExpanded ? 'Tout replier' : 'Tout ouvrir'}</span>
          </button>
        </div>

        {/* Liste des questions sous forme de cartes accordéons compactes */}
        <div className="correction-accordion-list">
          {questions.map((q, idx) => {
            const ans = session.answers[q.id];
            const isCorrect = Boolean(ans?.isCorrect);
            const hasAnswered = Boolean(ans && ans.selectedChoiceId);
            const isExpanded = expandedIds.has(q.id);

            let statusClass = 'status-unanswered';
            let statusLabel = 'Non répondu';
            let statusIcon = '—';

            if (hasAnswered) {
              if (isCorrect) {
                statusClass = 'status-correct';
                statusLabel = 'Correct';
                statusIcon = '✓';
              } else {
                statusClass = 'status-wrong';
                statusLabel = 'Incorrect';
                statusIcon = '✕';
              }
            }

            return (
              <article
                key={q.id}
                className={`compact-accordion-card ${statusClass} ${isExpanded ? 'is-expanded' : ''}`}
              >
                {/* Ligne d'en-tête cliquable (1 SEULE LIGNE COMPACTE) */}
                <button
                  type="button"
                  className="accordion-item-trigger"
                  onClick={() => toggleQuestion(q.id)}
                  aria-expanded={isExpanded}
                  aria-controls={`correction-panel-${q.id}`}
                >
                  <div className="trigger-left-col">
                    <span className="accordion-q-title">
                      Question {idx + 1}
                    </span>
                    <span className="accordion-dot-sep">·</span>
                    <span className="accordion-pts-label">
                      {q.points} {q.points <= 1 ? 'pt' : 'pts'}
                    </span>
                  </div>

                  <div className="trigger-right-col">
                    <span className={`accordion-verdict-pill ${statusClass}`}>
                      <span className="verdict-glyph">{statusIcon}</span>
                      <span className="verdict-word">{statusLabel}</span>
                    </span>

                    <span className={`accordion-chevron-icon ${isExpanded ? 'is-rotated' : ''}`} aria-hidden="true">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </span>
                  </div>
                </button>

                {/* Contenu détaillé affiché UNIQUEMENT lorsque la question est ouverte */}
                {isExpanded && (
                  <div id={`correction-panel-${q.id}`} className="accordion-expanded-body">
                    {/* Énoncé complet de la question */}
                    <div className="expanded-question-prompt">
                      <p className="expanded-prompt-text">{q.question}</p>
                    </div>

                    {/* Comparatif des choix (Votre réponse vs Bonne réponse) */}
                    {q.choices && q.choices.length > 0 && (
                      <div className="expanded-choices-stack">
                        {q.choices.map((choice, cIdx) => {
                          const letter = ['A', 'B', 'C', 'D', 'E', 'F'][cIdx] || `${cIdx + 1}`;
                          const isUserSelected = ans?.selectedChoiceId === choice.id;
                          const isGood = choice.isCorrect;

                          let itemClass = 'choice-normal';
                          if (isGood) itemClass = 'choice-is-good';
                          if (isUserSelected && !isGood) itemClass = 'choice-is-mistake';

                          return (
                            <div key={choice.id} className={`expanded-choice-row ${itemClass}`}>
                              <div className="choice-badge-box">
                                <span className="choice-letter-badge">{letter}</span>
                              </div>

                              <div className="choice-text-box">
                                <span className="choice-statement">{choice.label}</span>
                              </div>

                              <div className="choice-status-tag">
                                {isGood && (
                                  <span className="tag-pill tag-good">✓ Bonne réponse</span>
                                )}
                                {isUserSelected && !isGood && (
                                  <span className="tag-pill tag-wrong">✕ Votre réponse</span>
                                )}
                                {isUserSelected && isGood && (
                                  <span className="tag-pill tag-perfect">Votre choix validé</span>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Fiche Pédagogique (Explication, Méthode, Conseil) */}
                    <div className="expanded-explanation-box">
                      {q.explanation && (
                        <div className="explanation-bullet">
                          <div className="bullet-title-wrap">
                            <span className="bullet-icon">💡</span>
                            <strong>Pourquoi cette réponse ?</strong>
                          </div>
                          <p className="bullet-text">{q.explanation}</p>
                        </div>
                      )}

                      {q.method && (
                        <div className="explanation-bullet bullet-method">
                          <div className="bullet-title-wrap">
                            <span className="bullet-icon">📐</span>
                            <strong>Méthode de résolution :</strong>
                          </div>
                          <p className="bullet-text">{q.method}</p>
                        </div>
                      )}

                      {q.tip && (
                        <div className="explanation-bullet bullet-tip">
                          <div className="bullet-title-wrap">
                            <span className="bullet-icon">🎯</span>
                            <strong>Conseil d'examen :</strong>
                          </div>
                          <p className="bullet-text">{q.tip}</p>
                        </div>
                      )}

                      {q.commonMistake && (
                        <div className="explanation-bullet bullet-mistake">
                          <div className="bullet-title-wrap">
                            <span className="bullet-icon">⚠️</span>
                            <strong>Erreur fréquente à éviter :</strong>
                          </div>
                          <p className="bullet-text">{q.commonMistake}</p>
                        </div>
                      )}
                    </div>

                    {/* Accès direct à l'IA Sunubiblio pour cette question */}
                    <div className="expanded-ai-tutor-bar">
                      <span className="tutor-bar-label">Approfondir avec l'IA Sunubiblio :</span>
                      <div className="tutor-buttons-wrap">
                        {!isCorrect && hasAnswered && (
                          <button
                            type="button"
                            className="tutor-ai-btn btn-why"
                            onClick={() => handleOpenAIHelp(q, 'why_wrong')}
                          >
                            <span>🔍 Pourquoi mon erreur ?</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="tutor-ai-btn"
                          onClick={() => handleOpenAIHelp(q, 'explain_simple')}
                        >
                          <span>💡 Expliquer simplement</span>
                        </button>
                        <button
                          type="button"
                          className="tutor-ai-btn"
                          onClick={() => handleOpenAIHelp(q, 'method')}
                        >
                          <span>📐 Méthode pas à pas</span>
                        </button>
                        <button
                          type="button"
                          className="tutor-ai-btn"
                          onClick={() => handleOpenAIHelp(q, 'similar_exercise')}
                        >
                          <span>📝 Exercice similaire</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* 3. MODALE D'ASSISTANCE IA (Légère et fluide) */}
      {aiModalOpen && activeAIQuestion && (
        <div className="ai-help-modal-backdrop" onClick={() => setAiModalOpen(false)} role="presentation">
          <div
            className="ai-help-modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-label="Assistant IA Sunubiblio"
          >
            <div className="ai-modal-header">
              <div className="ai-brand-badge">
                <div className="ai-spark-icon" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <circle cx="12" cy="5" r="2" />
                    <path d="M12 7v4" />
                    <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
                    <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
                  </svg>
                </div>
                <span>IA Pédagogique Sunubiblio</span>
              </div>

              <button
                type="button"
                className="ai-modal-close"
                onClick={() => setAiModalOpen(false)}
                aria-label="Fermer la fenêtre d'aide"
              >
                ✕
              </button>
            </div>

            <div className="ai-modal-body">
              <h3 className="ai-modal-title">
                {aiPromptMode === 'why_wrong' && '🔍 Analyse de votre erreur'}
                {aiPromptMode === 'explain_simple' && '💡 Explication simplifiée'}
                {aiPromptMode === 'method' && '📐 Méthode étape par étape'}
                {aiPromptMode === 'similar_exercise' && '🎯 Exercice similaire d’application'}
              </h3>

              <div className="ai-question-preview">
                <span className="preview-label">Question :</span>
                <p className="preview-text">« {activeAIQuestion.question} »</p>
              </div>

              {aiLoading ? (
                <div className="ai-loading-box">
                  <div className="ai-spinner" aria-hidden="true" />
                  <p className="ai-loading-text">
                    L'IA Sunubiblio analyse la question et prépare une réponse pédagogique claire...
                  </p>
                </div>
              ) : (
                <div className="ai-response-container">
                  <div className="ai-response-formatted">
                    {aiResponse ? (
                      aiResponse.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx} style={{ whiteSpace: 'pre-line' }}>{para}</p>
                      ))
                    ) : (
                      <p>Aucune réponse générée.</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="ai-modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setAiModalOpen(false)}
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
