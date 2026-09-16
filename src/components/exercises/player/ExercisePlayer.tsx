'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Exercise, ExerciseSession, ExerciseAnswer } from '@/types/exercise';
import { exerciseService } from '@/services/exerciseService';
import { ExerciseTimer } from './ExerciseTimer';
import { QuestionRenderer } from './QuestionRenderer';
import { ExerciseResultView } from './ExerciseResultView';
import { ExerciseQuestionsBottomSheet } from './ExerciseQuestionsBottomSheet';
import { ExerciseAIContextDrawer } from './ExerciseAIContextDrawer';

interface ExercisePlayerProps {
  exercise: Exercise;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ exercise }) => {
  const questions = exercise.questions || [];
  const totalQuestions = questions.length;

  // Favoris
  const [isFavorite, setIsFavorite] = useState(false);

  // Bottom Sheets Mobile
  const [isQuestionsSheetOpen, setIsQuestionsSheetOpen] = useState(false);
  const [isAIDrawerOpen, setIsAIDrawerOpen] = useState(false);

  // État de session
  const [session, setSession] = useState<ExerciseSession>(() => {
    // Vérifier si une session active existait déjà pour cet exercice
    const active = exerciseService.getActiveSession();
    if (active && (active.exerciseId === exercise.id || active.testId === exercise.id)) {
      return active;
    }

    return {
      id: `session_${exercise.id}_${Date.now()}`,
      testId: exercise.id,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      subject: exercise.subject,
      levelLabel: exercise.levelLabel,
      difficulty: exercise.difficulty,
      difficultyLabel: exercise.difficultyLabel,
      mode: 'exam',
      status: 'in_progress',
      currentQuestionIndex: 0,
      totalQuestions,
      answers: {},
      durationSeconds: exercise.durationMinutes * 60,
      timeSpentSeconds: 0,
      startedAt: new Date().toISOString(),
    };
  });

  const [isCompleted, setIsCompleted] = useState(session.status === 'completed');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Timer de session (temps passé)
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsFavorite(exerciseService.isExerciseFavorite(exercise.id));
  }, [exercise.id]);

  // Incrémenter le temps passé
  useEffect(() => {
    if (isCompleted) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setSession((prev) => {
        const nextTime = prev.timeSpentSeconds + 1;
        const updated = { ...prev, timeSpentSeconds: nextTime };
        exerciseService.saveActiveSession(updated);
        return updated;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isCompleted]);

  // Question active
  const currentIndex = Math.min(
    Math.max(session.currentQuestionIndex, 0),
    Math.max(totalQuestions - 1, 0)
  );
  const currentQuestion = questions[currentIndex];
  const currentAnswer: ExerciseAnswer | undefined = currentQuestion
    ? session.answers[currentQuestion.id]
    : undefined;

  // Sélection d'un choix en direct (sauvegardé côté serveur/session sans spoiler)
  const handleSelectChoice = (choiceId: string) => {
    if (!currentQuestion) return;

    // Récupérer si le choix est correct (stocké pour le calcul final après soumission)
    const chosenChoice = currentQuestion.choices?.find((c) => c.id === choiceId);
    const isCorrect = chosenChoice ? chosenChoice.isCorrect : false;

    const newAnswer: ExerciseAnswer = {
      questionId: currentQuestion.id,
      selectedChoiceId: choiceId,
      isCorrect,
      answeredAt: new Date().toISOString(),
    };

    const nextAnswers = {
      ...session.answers,
      [currentQuestion.id]: newAnswer,
    };

    const updatedSession: ExerciseSession = {
      ...session,
      answers: nextAnswers,
    };

    setSession(updatedSession);
    exerciseService.saveActiveSession(updatedSession);
  };

  // Finalisation et calcul officiel du score après soumission
  const handleFinishSession = useCallback(() => {
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((q) => {
      maxScore += q.points;
      const ans = session.answers[q.id];
      if (ans && ans.isCorrect) {
        totalScore += q.points;
      }
    });

    const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    const finishedSession: ExerciseSession = {
      ...session,
      status: 'completed',
      score: totalScore,
      maxScore,
      percentage,
      completedAt: new Date().toISOString(),
    };

    setSession(finishedSession);
    setIsCompleted(true);
    setShowConfirmModal(false);
    exerciseService.saveCompletedSession(finishedSession);
  }, [questions, session]);

  // Navigation question suivante
  const handleNextQuestion = () => {
    if (currentIndex < totalQuestions - 1) {
      const nextIdx = currentIndex + 1;
      const updated = { ...session, currentQuestionIndex: nextIdx };
      setSession(updated);
      exerciseService.saveActiveSession(updated);
    } else {
      setShowConfirmModal(true);
    }
  };

  // Navigation question précédente
  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      const updated = { ...session, currentQuestionIndex: prevIdx };
      setSession(updated);
      exerciseService.saveActiveSession(updated);
    }
  };

  // Saut direct vers une question via la grille
  const handleJumpToQuestion = (index: number) => {
    if (index >= 0 && index < totalQuestions) {
      const updated = { ...session, currentQuestionIndex: index };
      setSession(updated);
      exerciseService.saveActiveSession(updated);
      setIsDrawerOpen(false);
    }
  };

  // Recommencer le test
  const handleRestart = () => {
    const newSession: ExerciseSession = {
      id: `session_${exercise.id}_${Date.now()}`,
      testId: exercise.id,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      subject: exercise.subject,
      levelLabel: exercise.levelLabel,
      difficulty: exercise.difficulty,
      difficultyLabel: exercise.difficultyLabel,
      mode: 'exam',
      status: 'in_progress',
      currentQuestionIndex: 0,
      totalQuestions,
      answers: {},
      durationSeconds: exercise.durationMinutes * 60,
      timeSpentSeconds: 0,
      startedAt: new Date().toISOString(),
    };

    setSession(newSession);
    setIsCompleted(false);
    exerciseService.saveActiveSession(newSession);
  };

  // Toggle Favori
  const handleToggleFav = () => {
    const nextState = exerciseService.toggleFavorite(exercise.id);
    setIsFavorite(nextState);
  };

  // Callback expiration chronomètre
  const handleTimeUp = useCallback(() => {
    handleFinishSession();
  }, [handleFinishSession]);

  // Nombre de questions répondues
  const answeredCount = Object.keys(session.answers).length;
  const unansweredCount = totalQuestions - answeredCount;

  if (isCompleted) {
    return (
      <ExerciseResultView
        exercise={exercise}
        session={session}
        onRestart={handleRestart}
      />
    );
  }

  if (!currentQuestion) {
    return (
      <div className="player-empty-wrap">
        <p>Aucune question disponible pour ce test.</p>
        <Link href="/exercices" className="btn-primary">
          Retour au catalogue d'entraînement
        </Link>
      </div>
    );
  }

  const progressPercentage = totalQuestions > 0 ? Math.round(((currentIndex + 1) / totalQuestions) * 100) : 0;

  return (
    <div className="exercise-player-container">
      {/* 1. EN-TÊTE MOBILE COMPACT & MODERNE (< 1024px) */}
      <div className="player-mobile-header">
        <div className="mobile-header-top-row">
          <Link href="/exercices" className="mobile-back-btn" title="Quitter le test">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Quitter</span>
          </Link>

          <div className="mobile-timer-wrap">
            <ExerciseTimer
              durationMinutes={exercise.durationMinutes}
              timeSpentSeconds={session.timeSpentSeconds}
              onTimeUp={handleTimeUp}
            />
          </div>

          <button
            type="button"
            className="mobile-questions-trigger-btn"
            onClick={() => setIsQuestionsSheetOpen(true)}
            aria-label="Ouvrir la liste des questions"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>Questions</span>
            <span className="trigger-count-badge">{currentIndex + 1}/{totalQuestions}</span>
          </button>
        </div>

        {/* Ligne informative du test */}
        <div className="mobile-test-info-row">
          <div className="mobile-test-title-col">
            <span className="mobile-exercise-title">{exercise.title}</span>
            <div className="mobile-badges-row">
              <span className={`exam-difficulty-badge diff-${exercise.difficulty.toLowerCase()}`}>
                {exercise.difficultyLabel}
              </span>
              {exercise.competitionName && (
                <span className="exam-competition-badge">
                  🏆 {exercise.competitionName}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Barre de progression continue */}
        <div className="mobile-progress-wrapper">
          <div className="mobile-progress-label-row">
            <span className="progress-counter-text">
              Question <strong>{currentIndex + 1}</strong> sur <strong>{totalQuestions}</strong>
            </span>
            <span className="progress-pct-text">{progressPercentage}%</span>
          </div>
          <div className="mobile-progress-track">
            <div
              className="mobile-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. EN-TÊTE DESKTOP (conservé intact pour >= 1024px) */}
      <header className="player-top-header desktop-only-header">
        <div className="player-back-nav">
          <Link href="/exercices" className="back-link-btn" title="Quitter la session">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            <span>Quitter</span>
          </Link>

          <div className="player-breadcrumbs">
            <span className="crumb-subject">{exercise.subject}</span>
            <span className="crumb-sep">/</span>
            <span className="crumb-title">{exercise.title}</span>
          </div>
        </div>

        {/* Chronomètre central */}
        <div className="player-center-timer">
          <ExerciseTimer
            durationMinutes={exercise.durationMinutes}
            timeSpentSeconds={session.timeSpentSeconds}
            onTimeUp={handleTimeUp}
          />
        </div>

        {/* Boutons d'action supérieurs */}
        <div className="player-actions-top">
          <button
            type="button"
            className="mobile-grid-toggle-btn"
            onClick={() => setIsQuestionsSheetOpen(true)}
            title="Afficher la grille des questions"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
            <span>{answeredCount}/{totalQuestions}</span>
          </button>

          <button
            type="button"
            className={`player-fav-btn ${isFavorite ? 'is-active' : ''}`}
            onClick={handleToggleFav}
            aria-label="Favori"
            title={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill={isFavorite ? '#ec4899' : 'none'}
              stroke={isFavorite ? '#ec4899' : 'currentColor'}
              strokeWidth="2.2"
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>

          <button
            type="button"
            className="player-submit-top-btn"
            onClick={() => setShowConfirmModal(true)}
          >
            <span>Terminer</span>
          </button>
        </div>
      </header>

      {/* 3. DISPOSITION PRINCIPALE : Question + Sidebar Desktop */}
      <div className="player-main-layout">
        {/* Colonne de l'Épreuve */}
        <div className="player-question-area">
          {/* Bannière de métadonnées du test (desktop) */}
          <div className="player-exam-banner desktop-only-banner">
            <div className="exam-banner-left">
              <span className="exam-mode-badge">
                <span className="exam-mode-dot" />
                <span>Mode Examen & Entraînement</span>
              </span>
              <span className={`exam-difficulty-badge diff-${exercise.difficulty.toLowerCase()}`}>
                {exercise.difficultyLabel}
              </span>
              {exercise.competitionName && (
                <span className="exam-competition-badge">
                  🏆 {exercise.competitionName}
                </span>
              )}
            </div>

            <div className="exam-banner-right">
              <span className="question-counter-text">
                Question <strong className="counter-current">{currentIndex + 1}</strong> sur{' '}
                <strong className="counter-total">{totalQuestions}</strong>
              </span>
            </div>
          </div>

          {/* Carte Question sans révélation des réponses */}
          <div className="question-card-wrapper">
            <QuestionRenderer
              question={currentQuestion}
              currentAnswer={currentAnswer}
              onSelectChoice={handleSelectChoice}
              isExamMode={true}
            />
          </div>

          {/* Barre de navigation inférieure ergonomique */}
          <footer className="player-bottom-footer">
            <button
              type="button"
              className="btn-secondary nav-btn prev-btn"
              disabled={currentIndex === 0}
              onClick={handlePrevQuestion}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              <span>Précédente</span>
            </button>

            <div className="footer-summary-indicators">
              <span className="indicator-pill">
                <strong>{answeredCount}</strong> répondu{answeredCount > 1 ? 's' : ''}
              </span>
              {unansweredCount > 0 && (
                <span className="indicator-pill indicator-pending">
                  <strong>{unansweredCount}</strong> en attente
                </span>
              )}
            </div>

            {currentIndex < totalQuestions - 1 ? (
              <button
                type="button"
                className="btn-primary nav-btn next-btn"
                onClick={handleNextQuestion}
              >
                <span>Suivante</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ) : (
              <button
                type="button"
                className="btn-primary nav-btn finish-btn"
                onClick={() => setShowConfirmModal(true)}
              >
                <span>Terminer le test</span>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </button>
            )}
          </footer>
        </div>

        {/* Sidebar Desktop pour grands écrans */}
        <aside className="player-sidebar-grid desktop-only-sidebar">
          <div className="sidebar-grid-header">
            <div className="sidebar-grid-title-wrap">
              <h4 className="sidebar-grid-title">Grille des questions</h4>
              <span className="sidebar-grid-subtitle">
                {answeredCount}/{totalQuestions} complétées
              </span>
            </div>
          </div>

          <div className="sidebar-legend">
            <div className="legend-item">
              <span className="legend-dot dot-answered">✓</span>
              <span>Répondu</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-current">●</span>
              <span>Actuelle</span>
            </div>
            <div className="legend-item">
              <span className="legend-dot dot-pending">—</span>
              <span>En attente</span>
            </div>
          </div>

          <div className="sidebar-questions-cells">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(session.answers[q.id]);
              const isCurrent = idx === currentIndex;

              let statusClass = 'is-pending';
              if (isCurrent) {
                statusClass = 'is-current';
              } else if (isAnswered) {
                statusClass = 'is-answered';
              }

              return (
                <button
                  key={q.id}
                  type="button"
                  className={`grid-cell-btn ${statusClass}`}
                  onClick={() => handleJumpToQuestion(idx)}
                  title={`Question ${idx + 1} : ${isAnswered ? 'Répondue' : 'En attente'}`}
                >
                  <span className="cell-number">{idx + 1}</span>
                  {isAnswered && !isCurrent && (
                    <span className="cell-check-badge">✓</span>
                  )}
                  {isCurrent && (
                    <span className="cell-current-badge">●</span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="sidebar-grid-footer">
            <button
              type="button"
              className="sidebar-submit-btn"
              onClick={() => setShowConfirmModal(true)}
            >
              Soumettre l'épreuve
            </button>
          </div>
        </aside>
      </div>

      {/* 4. BOUTON FLOTTANT IA SUNUBIBLIO (Accessible in-situ sans redirection) */}
      <button
        type="button"
        className="floating-ai-coach-btn"
        onClick={() => setIsAIDrawerOpen(true)}
        aria-label="Ouvrir l'assistant pédagogique IA"
        title="Ouvrir l'IA Sunubiblio"
      >
        <span className="ai-btn-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <rect x="3" y="11" width="18" height="10" rx="2" />
            <circle cx="12" cy="5" r="2" />
            <path d="M12 7v4" />
            <line x1="8" y1="16" x2="8.01" y2="16" strokeWidth="3" />
            <line x1="16" y1="16" x2="16.01" y2="16" strokeWidth="3" />
          </svg>
        </span>
        <span className="ai-btn-text">Coach IA</span>
        <span className="ai-pulse-dot" />
      </button>

      {/* 5. BOTTOM SHEET MOBILE : GRILLE DES QUESTIONS */}
      <ExerciseQuestionsBottomSheet
        isOpen={isQuestionsSheetOpen}
        onClose={() => setIsQuestionsSheetOpen(false)}
        questions={questions}
        currentIndex={currentIndex}
        answers={session.answers}
        onSelectQuestion={handleJumpToQuestion}
        title={`Questions du test (${exercise.title})`}
      />

      {/* 6. BOTTOM SHEET MOBILE : ASSISTANT IA CONTEXTUEL */}
      <ExerciseAIContextDrawer
        isOpen={isAIDrawerOpen}
        onClose={() => setIsAIDrawerOpen(false)}
        questionText={currentQuestion.question}
        questionNumber={currentIndex + 1}
        totalQuestions={totalQuestions}
        subject={exercise.subject}
        chapter={exercise.chapter}
        competitionName={exercise.competitionName}
        levelLabel={exercise.levelLabel}
      />

      {/* 7. MODALE DE CONFIRMATION AVANT SOUMISSION FINALE */}
      {showConfirmModal && (
        <div className="confirm-modal-backdrop" onClick={() => setShowConfirmModal(false)}>
          <div
            className="confirm-modal-card"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="confirm-modal-icon">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
            </div>

            <h3 className="confirm-modal-title">Terminer et soumettre le test ?</h3>
            <p className="confirm-modal-desc">
              Vous avez répondu à <strong>{answeredCount}</strong> question{answeredCount > 1 ? 's' : ''} sur <strong>{totalQuestions}</strong>.
            </p>

            {unansweredCount > 0 && (
              <div className="confirm-warning-box">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <circle cx="12" cy="12" r="10" />
                  <line x1="12" y1="8" x2="12" y2="12" />
                  <line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                <span>
                  Attention : <strong>{unansweredCount}</strong> question{unansweredCount > 1 ? 's' : ''} reste{unansweredCount > 1 ? 'nt' : ''} sans réponse et compteron{unansweredCount > 1 ? 't' : ''} pour 0 point.
                </span>
              </div>
            )}

            <div className="confirm-modal-actions">
              <button
                type="button"
                className="btn-secondary modal-cancel-btn"
                onClick={() => setShowConfirmModal(false)}
              >
                Continuer l'épreuve
              </button>

              <button
                type="button"
                className="btn-primary modal-confirm-btn"
                onClick={handleFinishSession}
              >
                Confirmer et voir les résultats
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
