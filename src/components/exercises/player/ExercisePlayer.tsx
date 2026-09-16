'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { Exercise, ExerciseSession, ExerciseAnswer } from '@/types/exercise';
import { exerciseService } from '@/services/exerciseService';
import { ExerciseTimer } from './ExerciseTimer';
import { QuestionRenderer } from './QuestionRenderer';
import { AIExerciseHelpModal } from './AIExerciseHelpModal';
import { ExerciseResultView } from './ExerciseResultView';

interface ExercisePlayerProps {
  exercise: Exercise;
}

export const ExercisePlayer: React.FC<ExercisePlayerProps> = ({ exercise }) => {
  const questions = exercise.questions || [];
  const totalQuestions = questions.length;

  // Favoris
  const [isFavorite, setIsFavorite] = useState(false);

  // État de session
  const [session, setSession] = useState<ExerciseSession>(() => {
    // Vérifier si une session active existait déjà pour cet exercice
    const active = exerciseService.getActiveSession();
    if (active && active.exerciseId === exercise.id) {
      return active;
    }

    return {
      id: `session_${exercise.id}_${Date.now()}`,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      subject: exercise.subject,
      levelLabel: exercise.levelLabel,
      status: 'in_progress',
      currentQuestionIndex: 0,
      totalQuestions,
      answers: {},
      timeSpentSeconds: 0,
      startedAt: new Date().toISOString(),
    };
  });

  const [selectedChoiceId, setSelectedChoiceId] = useState<string | undefined>(undefined);
  const [isCompleted, setIsCompleted] = useState(session.status === 'completed');

  // Modale IA
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiModalMode, setAiModalMode] = useState<'hint' | 'explain'>('hint');

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
  const currentIndex = Math.min(Math.max(session.currentQuestionIndex, 0), Math.max(totalQuestions - 1, 0));
  const currentQuestion = questions[currentIndex];
  const currentAnswer: ExerciseAnswer | undefined = currentQuestion ? session.answers[currentQuestion.id] : undefined;

  // Réinitialiser la sélection locale quand on change de question
  useEffect(() => {
    if (currentAnswer) {
      setSelectedChoiceId(currentAnswer.selectedChoiceId);
    } else {
      setSelectedChoiceId(undefined);
    }
  }, [currentIndex, currentAnswer]);

  // Validation de la réponse à la question courante
  const handleValidateAnswer = () => {
    if (!currentQuestion || !selectedChoiceId || currentAnswer) return;

    const chosenChoice = currentQuestion.choices?.find((c) => c.id === selectedChoiceId);
    const isCorrect = chosenChoice ? chosenChoice.isCorrect : false;

    const newAnswer: ExerciseAnswer = {
      questionId: currentQuestion.id,
      selectedChoiceId,
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

  // Finalisation de la session d'entraînement
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
      // Dernière question : proposer de terminer
      handleFinishSession();
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

  // Recommencer l'exercice
  const handleRestart = () => {
    const newSession: ExerciseSession = {
      id: `session_${exercise.id}_${Date.now()}`,
      exerciseId: exercise.id,
      exerciseTitle: exercise.title,
      subject: exercise.subject,
      levelLabel: exercise.levelLabel,
      status: 'in_progress',
      currentQuestionIndex: 0,
      totalQuestions,
      answers: {},
      timeSpentSeconds: 0,
      startedAt: new Date().toISOString(),
    };

    setSession(newSession);
    setIsCompleted(false);
    setSelectedChoiceId(undefined);
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
        <p>Aucune question disponible pour cet exercice.</p>
        <Link href="/exercices" className="btn-primary">
          Retour aux exercices
        </Link>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / totalQuestions) * 100);

  return (
    <div className="exercise-player-container">
      {/* Barre supérieure de contrôle */}
      <header className="player-top-header">
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

        <div className="player-top-actions">
          {/* Chronomètre conditionnel */}
          {exercise.durationMinutes && exercise.durationMinutes > 0 ? (
            <ExerciseTimer
              initialMinutes={exercise.durationMinutes}
              onTimeUp={handleTimeUp}
              isPaused={isCompleted}
            />
          ) : null}

          {/* Favori */}
          <button
            type="button"
            className={`player-fav-btn ${isFavorite ? 'is-active' : ''}`}
            onClick={handleToggleFav}
            aria-label={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
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
        </div>
      </header>

      {/* Barre de progression linéaire */}
      <div className="player-progress-bar-wrap">
        <div className="progress-info-row">
          <span className="progress-step-text">
            Question <strong>{currentIndex + 1}</strong> sur {totalQuestions}
          </span>
          <span className="progress-pct-text">{progressPercent}%</span>
        </div>
        <div className="progress-track">
          <div
            className="progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Zone centrale de rendu de la question */}
      <main className="player-question-stage">
        <QuestionRenderer
          question={currentQuestion}
          currentAnswer={currentAnswer}
          selectedChoiceId={selectedChoiceId}
          onSelectChoice={(id) => setSelectedChoiceId(id)}
          onValidateAnswer={handleValidateAnswer}
          onRequestAIHelp={(mode) => {
            setAiModalMode(mode);
            setAiModalOpen(true);
          }}
        />
      </main>

      {/* Barre inférieure de navigation entre questions */}
      <footer className="player-bottom-nav">
        <button
          type="button"
          className="btn-secondary nav-prev-btn"
          disabled={currentIndex === 0}
          onClick={handlePrevQuestion}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Précédente</span>
        </button>

        <div className="player-dots-indicator desktop-only">
          {questions.map((q, idx) => {
            const isAnswered = Boolean(session.answers[q.id]);
            const isCurrent = idx === currentIndex;
            return (
              <span
                key={q.id}
                className={`player-dot ${isCurrent ? 'current' : ''} ${isAnswered ? 'answered' : ''}`}
                title={`Question ${idx + 1}`}
              />
            );
          })}
        </div>

        {currentIndex < totalQuestions - 1 ? (
          <button
            type="button"
            className="btn-primary nav-next-btn"
            onClick={handleNextQuestion}
          >
            <span>Suivante</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className="btn-primary nav-finish-btn"
            onClick={handleFinishSession}
          >
            <span>Terminer la session</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </button>
        )}
      </footer>

      {/* Modale d'aide IA */}
      <AIExerciseHelpModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        questionText={currentQuestion.question}
        subject={exercise.subject}
        chapter={exercise.chapter}
        hasAnswered={Boolean(currentAnswer)}
        mode={aiModalMode}
      />
    </div>
  );
};
