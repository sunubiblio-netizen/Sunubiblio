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
  const [showReview, setShowReview] = useState(true); // Directement visible pour favoriser l'apprentissage

  // État Modale IA Pédagogique
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [activeAIQuestion, setActiveAIQuestion] = useState<ExerciseQuestion | null>(null);
  const [aiPromptMode, setAiPromptMode] = useState<
    'why_wrong' | 'explain_simple' | 'method' | 'similar_exercise'
  >('why_wrong');
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);

  const questions = exercise.questions || [];
  const totalQuestions = questions.length;

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
    if (pct >= 85) {
      return {
        title: 'Excellente maîtrise du sujet !',
        desc: 'Vous validez ce palier avec brio. Vos bases théoriques et votre vitesse de résolution sont solides pour les examens et concours.',
        badgeClass: 'badge-gold',
      };
    }
    if (pct >= 60) {
      return {
        title: 'Bon résultat, consolidation conseillée',
        desc: 'L’essentiel des mécanismes est compris. Prenez le temps d’analyser les erreurs ci-dessous et d’interroger l’IA pour sécuriser vos points.',
        badgeClass: 'badge-silver',
      };
    }
    return {
      title: 'Entraînement constructif à approfondir',
      desc: 'Ce test identifie précisément les notions à revoir. Lisez attentivement les méthodes de résolution et réessayez pour progresser.',
      badgeClass: 'badge-bronze',
    };
  };

  const feedback = getFeedback(percentage);

  // Déclencher une demande IA contextuelle
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
      promptContent = `Dans le cadre d'un entraînement d'examen en ${exercise.subject} (${exercise.chapter}, niveau ${exercise.levelLabel}), pour la question suivante :
« ${q.question} »
L'élève a répondu : « ${chosenChoice ? chosenChoice.label : 'Aucune réponse'} ».
Or la réponse correcte est : « ${correctChoice ? correctChoice.label : 'Inconnue'} ».
Explique avec pédagogie et bienveillance pourquoi la réponse choisie est fausse et quel piège conceptuel a pu induire l'élève en erreur.`;
    } else if (mode === 'explain_simple') {
      promptContent = `En ${exercise.subject} (${exercise.chapter}), réexplique la question suivante de manière très simple et concrète, comme à un élève qui a des difficultés :
« ${q.question} »
Solution attendue : « ${correctChoice?.label} ».`;
    } else if (mode === 'method') {
      promptContent = `Détaille la méthode universelle étape par étape pour résoudre ce type d'exercice en examen de ${exercise.subject} :
« ${q.question} ».`;
    } else {
      promptContent = `Propose un nouvel exercice d'entraînement similaire (avec 4 choix A, B, C, D et la solution détaillée) pour vérifier l'assimilation de la notion abordée dans :
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
        "L'assistant pédagogique Sunubiblio n'a pas pu traiter la demande. Veuillez vérifier votre connexion et réessayer."
      );
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="exercise-result-view-wrap">
      {/* Carte principale de bilan d'examen */}
      <div className="result-summary-card">
        <div className="result-top-badge">
          <span className="badge-dot" />
          <span>Épreuve officielle terminée & validée</span>
        </div>

        <h2 className="result-main-title">{exercise.title}</h2>
        <p className="result-meta-sub">
          {exercise.subject} • {exercise.levelLabel}{' '}
          {exercise.competitionName ? `• Concours ${exercise.competitionName}` : ''}{' '}
          • Palier : <strong>{exercise.difficultyLabel}</strong>
        </p>

        {/* Grand Score Display */}
        <div className="result-score-circle">
          <div className="score-number-big">
            {score} <span className="score-max">/ {maxScore} pts</span>
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
            <span className="stat-lbl">Réponses correctes</span>
          </div>

          <div className="stat-pill stat-wrong">
            <span className="stat-dot wrong-dot" />
            <span className="stat-val">{wrongCount}</span>
            <span className="stat-lbl">Réponses incorrectes</span>
          </div>

          <div className="stat-pill stat-unanswered">
            <span className="stat-dot neutral-dot" />
            <span className="stat-val">{unattemptedCount}</span>
            <span className="stat-lbl">Non répondues</span>
          </div>

          <div className="stat-pill stat-time">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="stat-val">{formatTime(session.timeSpentSeconds)}</span>
            <span className="stat-lbl">Temps effectif</span>
          </div>
        </div>

        {/* Actions principales */}
        <div className="result-actions-row">
          <button
            type="button"
            className="btn-primary restart-btn"
            onClick={onRestart}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <span>Recommencer ce test</span>
          </button>

          <button
            type="button"
            className="btn-secondary toggle-review-btn"
            onClick={() => setShowReview(!showReview)}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            <span>{showReview ? 'Masquer la correction' : 'Voir la correction détaillée'}</span>
          </button>

          <Link href="/exercices" className="btn-secondary back-hub-btn">
            Catalogue d'entraînement
          </Link>
        </div>
      </div>

      {/* SECTION CORRECTION DÉTAILLÉE QUESTION PAR QUESTION */}
      {showReview && (
        <section className="result-detailed-review-wrap" aria-label="Corrections détaillées">
          <div className="review-header">
            <div className="review-header-badge">
              <span>Correction didactique</span>
            </div>
            <h3 className="review-title">Revue Pédagogique & Méthodologique Complète</h3>
            <p className="review-subtitle">
              Chaque réponse est expliquée avec sa démarche de calcul, le conseil officiel de l'examen et l'assistance de l'IA Sunubiblio.
            </p>
          </div>

          <div className="review-questions-list">
            {questions.map((q, idx) => {
              const ans = session.answers[q.id];
              const isCorrectAnswer = ans?.isCorrect;
              const hasAnswered = Boolean(ans && ans.selectedChoiceId);
              const userChoice = q.choices?.find((c) => c.id === ans?.selectedChoiceId);
              const correctChoice = q.choices?.find((c) => c.isCorrect);

              return (
                <article
                  key={q.id}
                  className={`review-question-card ${
                    !hasAnswered ? 'card-unanswered' : isCorrectAnswer ? 'card-correct' : 'card-wrong'
                  }`}
                >
                  <div className="review-card-top">
                    <div className="review-top-left">
                      <span className="question-order-pill">
                        Question {idx + 1} sur {totalQuestions}
                      </span>
                      <span className="points-awarded-pill">
                        {isCorrectAnswer ? `+${q.points} pt` : `0 / ${q.points} pt`}
                      </span>
                    </div>

                    <div className="review-top-right">
                      {!hasAnswered ? (
                        <span className="verdict-pill verdict-unanswered">
                          — Non répondu
                        </span>
                      ) : isCorrectAnswer ? (
                        <span className="verdict-pill verdict-success">
                          ✓ Bonne réponse
                        </span>
                      ) : (
                        <span className="verdict-pill verdict-danger">
                          ✕ Incorrect
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="review-question-text">{q.question}</h4>

                  {/* Comparatif Choix de l'élève vs Bonne réponse */}
                  {q.choices && (
                    <div className="review-choices-grid">
                      {q.choices.map((c, cIdx) => {
                        const letter = ['A', 'B', 'C', 'D', 'E'][cIdx] || `${cIdx + 1}`;
                        const wasSelected = ans?.selectedChoiceId === c.id;
                        let choiceClass = 'choice-neutral';

                        if (c.isCorrect) {
                          choiceClass = 'choice-correct';
                        } else if (wasSelected && !c.isCorrect) {
                          choiceClass = 'choice-incorrect';
                        }

                        return (
                          <div key={c.id} className={`review-choice-card ${choiceClass}`}>
                            <div className="choice-card-head">
                              <span className="choice-card-letter">{letter}</span>
                              {c.isCorrect && (
                                <span className="choice-verdict-badge badge-correct-label">
                                  ✓ Bonne réponse
                                </span>
                              )}
                              {wasSelected && !c.isCorrect && (
                                <span className="choice-verdict-badge badge-wrong-label">
                                  Votre réponse
                                </span>
                              )}
                              {wasSelected && c.isCorrect && (
                                <span className="choice-verdict-badge badge-perfect-label">
                                  Votre réponse validée
                                </span>
                              )}
                            </div>
                            <p className="choice-card-text">{c.label}</p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Bloc Explication & Méthode Pédagogique */}
                  <div className="review-explanation-card">
                    <div className="explanation-item">
                      <div className="explanation-label-wrap">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <circle cx="12" cy="12" r="10" />
                          <line x1="12" y1="16" x2="12" y2="12" />
                          <line x1="12" y1="8" x2="12.01" y2="8" />
                        </svg>
                        <span className="explanation-label">Pourquoi cette réponse ?</span>
                      </div>
                      <p className="explanation-text">{q.explanation}</p>
                    </div>

                    {q.method && (
                      <div className="explanation-item method-item">
                        <div className="explanation-label-wrap">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <polygon points="12 2 2 7 12 12 22 7 12 2" />
                            <polyline points="2 17 12 22 22 17" />
                            <polyline points="2 12 12 17 22 12" />
                          </svg>
                          <span className="explanation-label">Méthode de résolution pas à pas</span>
                        </div>
                        <p className="explanation-text">{q.method}</p>
                      </div>
                    )}

                    {q.tip && (
                      <div className="explanation-item tip-item">
                        <div className="explanation-label-wrap">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                          </svg>
                          <span className="explanation-label">Conseil de jury & d'examen</span>
                        </div>
                        <p className="explanation-text">{q.tip}</p>
                      </div>
                    )}

                    {q.commonMistake && (
                      <div className="explanation-item mistake-item">
                        <div className="explanation-label-wrap">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                          </svg>
                          <span className="explanation-label">Erreur fréquente des candidats</span>
                        </div>
                        <p className="explanation-text">{q.commonMistake}</p>
                      </div>
                    )}
                  </div>

                  {/* BARRE D'ACTIONS IA SUNUBIBLIO POUR CETTE QUESTION */}
                  <div className="review-ai-actions-bar">
                    <div className="ai-actions-title">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                        <path d="M12 2a7 7 0 0 1 7 7c0 2.38-1.19 4.47-3 5.74V17a2 2 0 0 1-2 2H10a2 2 0 0 1-2-2v-2.26C6.19 13.47 5 11.38 5 9a7 7 0 0 1 7-7z" />
                        <line x1="9" y1="21" x2="15" y2="21" />
                      </svg>
                      <span>Approfondir avec l'IA Sunubiblio :</span>
                    </div>

                    <div className="ai-action-buttons-group">
                      {!isCorrectAnswer && (
                        <button
                          type="button"
                          className="btn-ai-pill pill-why-wrong"
                          onClick={() => handleOpenAIHelp(q, 'why_wrong')}
                        >
                          <span>Pourquoi ma réponse est fausse ?</span>
                        </button>
                      )}

                      <button
                        type="button"
                        className="btn-ai-pill"
                        onClick={() => handleOpenAIHelp(q, 'explain_simple')}
                      >
                        <span>Explique-moi simplement</span>
                      </button>

                      <button
                        type="button"
                        className="btn-ai-pill"
                        onClick={() => handleOpenAIHelp(q, 'method')}
                      >
                        <span>Méthode de calcul</span>
                      </button>

                      <button
                        type="button"
                        className="btn-ai-pill pill-similar"
                        onClick={() => handleOpenAIHelp(q, 'similar_exercise')}
                      >
                        <span>Générer un exercice similaire</span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* MODALE IA PÉDAGOGIQUE SUNUBIBLIO */}
      {aiModalOpen && activeAIQuestion && (
        <div className="ai-help-modal-backdrop" onClick={() => setAiModalOpen(false)}>
          <div
            className="ai-help-modal-panel"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="ai-modal-header">
              <div className="ai-brand-badge">
                <div className="ai-spark-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
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
                {aiPromptMode === 'similar_exercise' && '🎯 Exercice d’application similaire'}
              </h3>

              <div className="ai-question-preview">
                <span className="preview-label">Question d'origine :</span>
                <p className="preview-text">« {activeAIQuestion.question} »</p>
              </div>

              {aiLoading ? (
                <div className="ai-loading-box">
                  <div className="ai-spinner" />
                  <p className="ai-loading-text">
                    L'IA Sunubiblio analyse la question et prépare une réponse pédagogique sur mesure...
                  </p>
                </div>
              ) : (
                <div className="ai-response-container">
                  <div className="ai-response-formatted">
                    {aiResponse ? (
                      aiResponse.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
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
