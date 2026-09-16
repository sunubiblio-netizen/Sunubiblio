'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Exercise, ExerciseSession, ExerciseQuestion } from '@/types/exercise';
import { exerciseService } from '@/services/exerciseService';
import { exerciseNavigation } from '@/services/exerciseNavigation';
import { ExerciseAIButton } from './ExerciseAIButton';
import { ExerciseAIContextDrawer } from './ExerciseAIContextDrawer';

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
  const router = useRouter();
  const questions = exercise.questions || [];
  const totalQuestions = questions.length;

  // Calcul du test suivant logique (même ressource/série, concours, ou matière)
  const nextExercise = exerciseService.getNextExercise(exercise);

  // Navigation Retour contextuelle : renvoie à la liste ou au catalogue d'où provient l'utilisateur
  const handleGoBack = () => {
    const originUrl = exerciseNavigation.getOriginUrl(exercise);
    router.push(originUrl);
  };

  // Règle ergonomique stricte : une seule question ouverte à la fois pour garder la page compacte et aérée
  const [expandedQuestionId, setExpandedQuestionId] = useState<string | null>(null);

  // Assistant Chatbot IA Sunubiblio (réutilisation de l'IA native)
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  // Question active pour le contexte de l'IA : première erreur par défaut ou première question
  const [activeAIQuestion, setActiveAIQuestion] = useState<ExerciseQuestion | null>(() => {
    const firstWrong = questions.find((q) => {
      const a = session.answers[q.id];
      return a && !a.isCorrect;
    });
    return firstWrong || questions[0] || null;
  });

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

  // Diagnostic pédagogique personnalisé
  const getFeedback = (pct: number) => {
    if (pct >= 80) {
      return {
        title: 'Excellente maîtrise !',
        desc: 'Vous validez ce test avec un score remarquable. Vos compétences sont solides pour ce concours.',
        colorClass: 'feedback-success',
        icon: '🌟',
      };
    }
    if (pct >= 50) {
      return {
        title: 'Bon travail, des points à consolider',
        desc: 'L’essentiel est assimilé. Ouvrez les questions erronées pour analyser les pièges avec l’IA.',
        colorClass: 'feedback-warning',
        icon: '📈',
      };
    }
    return {
      title: 'Entraînement constructif à approfondir',
      desc: 'Prenez le temps d’examiner la correction question par question avec le tuteur IA pour progresser.',
      colorClass: 'feedback-danger',
      icon: '💡',
    };
  };

  const feedback = getFeedback(percentage);

  // Toggle accordéon : une seule question ouverte à la fois
  const handleToggleQuestion = (q: ExerciseQuestion) => {
    setExpandedQuestionId((prev) => (prev === q.id ? null : q.id));
    setActiveAIQuestion(q);
  };

  // Ouvrir le panneau IA centré sur une question spécifique
  const handleOpenAICoachForQuestion = (q: ExerciseQuestion) => {
    setActiveAIQuestion(q);
    setIsAIDrawerOpen(true);
  };

  // Données contextuelles de la question active pour le tuteur IA
  const activeAIQuestionIndex = activeAIQuestion
    ? questions.findIndex((q) => q.id === activeAIQuestion.id)
    : 0;
  const activeUserAns = activeAIQuestion ? session.answers[activeAIQuestion.id] : null;
  const activeUserChoice = activeAIQuestion?.choices?.find(
    (c) => c.id === activeUserAns?.selectedChoiceId
  );
  const activeCorrectChoice = activeAIQuestion?.choices?.find((c) => c.isCorrect);

  return (
    <div className="exercise-result-compact-wrap">
      {/* =========================================================
          0. BARRE SUPÉRIEURE DE NAVIGATION AVEC FLÈCHE RETOUR
          ========================================================= */}
      <nav className="result-top-nav-bar" aria-label="Navigation de retour">
        <button
          type="button"
          onClick={handleGoBack}
          className="result-back-btn"
          title="Retourner à la page précédente"
          aria-label="Retourner à la page précédente"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span className="back-btn-text">Retour</span>
        </button>

        <div className="result-nav-badge-wrap">
          <span className="result-nav-tag">Correction & Résultats</span>
        </div>
      </nav>

      {/* =========================================================
          1. BILAN GLOBAL COMPACT, AÉRÉ ET MODERNE (HERO SCORE)
          ========================================================= */}
      <div className="result-compact-hero">
        <div className="compact-hero-header">
          <div className="hero-title-col">
            <div className="hero-badge-row">
              <span className="hero-validated-pill">
                <span className="dot-pulse" aria-hidden="true" />
                Test terminé
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

          {/* Pastille de score compacte et soignée */}
          <div className="hero-score-badge" title="Score final obtenu">
            <div className="score-main-value">
              {score} <span className="score-denom">/ {maxScore}</span>
            </div>
            <div className="score-percentage-text">{percentage}% de réussite</div>
          </div>
        </div>

        {/* Bannière de feedback pédagogique */}
        <div className={`hero-feedback-banner ${feedback.colorClass}`}>
          <span className="feedback-icon-indicator" aria-hidden="true">
            {feedback.icon}
          </span>
          <div className="feedback-texts">
            <strong>{feedback.title}</strong> — <span>{feedback.desc}</span>
          </div>
        </div>

        {/* Mini-indicateurs statistiques horizontaux */}
        <div className="hero-stats-row">
          <div className="hero-stat-pill pill-correct" title="Nombre de questions correctement répondues">
            <span className="stat-symbol">✓</span>
            <span className="stat-qty">{correctCount}</span>
            <span className="stat-name">Correctes</span>
          </div>

          <div className="hero-stat-pill pill-wrong" title="Nombre d'erreurs commises">
            <span className="stat-symbol">✕</span>
            <span className="stat-qty">{wrongCount}</span>
            <span className="stat-name">Incorrectes</span>
          </div>

          <div className="hero-stat-pill pill-unanswered" title="Questions laissées sans réponse">
            <span className="stat-symbol">—</span>
            <span className="stat-qty">{unattemptedCount}</span>
            <span className="stat-name">Non répondues</span>
          </div>

          <div className="hero-stat-pill pill-duration" title="Durée totale passée sur le test">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="stat-qty">{formatTime(session.timeSpentSeconds)}</span>
            <span className="stat-name">Temps</span>
          </div>
        </div>

        {/* Boutons d'action contextuels conformes aux règles */}
        <div className="hero-actions-row">
          {/* 1. Refaire le test */}
          <button type="button" className="btn-secondary hero-btn" onClick={onRestart}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <path d="M23 4v6h-6" />
              <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
            </svg>
            <span>Refaire le test</span>
          </button>

          {/* 2. Test suivant (si un prochain test logique est disponible) */}
          {nextExercise && (
            <Link
              href={`/exercices/${nextExercise.id}`}
              className="btn-primary hero-btn next-test-btn"
              title={`Enchaîner avec le test suivant : ${nextExercise.title}`}
            >
              <span>Test suivant</span>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </Link>
          )}

          {/* 3. Retour aux exercices (avec conservation stricte du contexte de liste ou catalogue) */}
          <button
            type="button"
            className="btn-secondary hero-btn result-catalog-btn"
            onClick={handleGoBack}
            title="Revenir au catalogue ou à la liste d'exercices d'origine"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Retour aux exercices</span>
          </button>

          {/* 4. Assistant IA Sunubiblio pour le bilan */}
          <button
            type="button"
            className="hero-ai-open-pill-btn"
            onClick={() => setIsAIDrawerOpen(true)}
            title="Consulter le tuteur IA Sunubiblio pour un bilan de l'épreuve"
          >
            <span className="ai-spark-glyph">🤖</span>
            <span>Bilan avec l'IA</span>
          </button>
        </div>
      </div>

      {/* =========================================================
          2. LISTE DES CORRECTIONS (ACCORDÉON UNIQUE, COMPACT ET FLUIDE)
          ========================================================= */}
      <section className="correction-accordion-section" aria-label="Liste compacte des corrections">
        <div className="accordion-section-bar">
          <div className="accordion-bar-left">
            <h3 className="accordion-section-title">Corrections détaillées</h3>
            <span className="accordion-section-count">
              {correctCount}/{totalQuestions} questions validées
            </span>
          </div>

          <div className="accordion-bar-hint">
            <span className="hint-text">Cliquez sur une question pour ouvrir sa correction</span>
          </div>
        </div>

        {/* Liste des questions sous forme d'accordéons individuels */}
        <div className="correction-accordion-list">
          {questions.map((q, idx) => {
            const ans = session.answers[q.id];
            const isCorrect = Boolean(ans?.isCorrect);
            const hasAnswered = Boolean(ans && ans.selectedChoiceId);
            const isExpanded = expandedQuestionId === q.id;

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
                {/* Ligne d'en-tête cliquable (1 SEULE LIGNE ÉPURÉE) */}
                <button
                  type="button"
                  className="accordion-item-trigger"
                  onClick={() => handleToggleQuestion(q)}
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

                {/* Contenu détaillé affiché UNIQUEMENT lorsque cette question précise est ouverte */}
                {isExpanded && (
                  <div id={`correction-panel-${q.id}`} className="accordion-expanded-body">
                    {/* Énoncé complet de la question */}
                    <div className="expanded-question-prompt">
                      <p className="expanded-prompt-text">{q.question}</p>
                    </div>

                    {/* Comparatif des choix (A, B, C, D) */}
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

                    {/* Fiche Pédagogique (Explication, Méthode, Conseils d'examen, Pièges) */}
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

                    {/* Approfondissement direct avec l'IA pour cette question précise */}
                    <div className="expanded-ai-tutor-bar">
                      <div className="tutor-bar-left">
                        <span className="tutor-ai-spark" aria-hidden="true">🤖</span>
                        <span className="tutor-bar-label">Demander à l'IA sur cette question :</span>
                      </div>

                      <div className="tutor-buttons-wrap">
                        {!isCorrect && hasAnswered && (
                          <button
                            type="button"
                            className="tutor-ai-btn btn-why"
                            onClick={() => handleOpenAICoachForQuestion(q)}
                            title="Comprendre l'origine précise de l'erreur avec l'IA"
                          >
                            <span>🔍 Explique mon erreur</span>
                          </button>
                        )}
                        <button
                          type="button"
                          className="tutor-ai-btn"
                          onClick={() => handleOpenAICoachForQuestion(q)}
                          title="Obtenir une explication pas à pas par le tuteur IA"
                        >
                          <span>💡 Explique la correction</span>
                        </button>
                        <button
                          type="button"
                          className="tutor-ai-btn"
                          onClick={() => handleOpenAICoachForQuestion(q)}
                          title="Découvrir une autre méthode de résolution plus rapide"
                        >
                          <span>📐 Autre méthode</span>
                        </button>
                        <button
                          type="button"
                          className="tutor-ai-btn"
                          onClick={() => handleOpenAICoachForQuestion(q)}
                          title="S'entraîner sur un problème similaire"
                        >
                          <span>📝 Question similaire</span>
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

      {/* =========================================================
          3. PETIT BOUTON FLOTTANT DISCRET « 🤖 IA » TOUJOURS ACCESSIBLE
          ========================================================= */}
      <ExerciseAIButton
        onClick={() => setIsAIDrawerOpen(true)}
        isAIAvailable={true}
      />

      {/* =========================================================
          4. PANNEAU CHATBOT IA SUNUBIBLIO (BOTTOMSHEET MOBILE / TIROIR PC)
          ========================================================= */}
      {activeAIQuestion && (
        <ExerciseAIContextDrawer
          isOpen={isAIDrawerOpen}
          onClose={() => setIsAIDrawerOpen(false)}
          exerciseId={exercise.id}
          questionId={activeAIQuestion.id}
          questionText={activeAIQuestion.question}
          questionNumber={activeAIQuestionIndex + 1}
          totalQuestions={totalQuestions}
          subject={exercise.subject}
          chapter={exercise.chapter}
          testTitle={exercise.title}
          resourceTitle={exercise.resourceTitle}
          competitionName={exercise.competitionName}
          levelLabel={exercise.levelLabel}
          isAIAvailable={true}
          isCorrectionMode={true}
          userAnswerLabel={activeUserChoice?.label || (activeUserAns?.selectedChoiceId ? 'Option sélectionnée' : 'Non répondu')}
          correctAnswerLabel={activeCorrectChoice?.label}
          isCorrect={Boolean(activeUserAns?.isCorrect)}
          hasUserAnswered={Boolean(activeUserAns && activeUserAns.selectedChoiceId)}
          explanationText={activeAIQuestion.explanation}
          methodText={activeAIQuestion.method}
          tipText={activeAIQuestion.tip}
          commonMistakeText={activeAIQuestion.commonMistake}
        />
      )}
    </div>
  );
};
