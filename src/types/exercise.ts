/**
 * Sunubiblio — Types stricts du module Entraînement & Exercices
 * Conçus pour être branchés directement sur un schéma relationnel PostgreSQL / Supabase
 * Tables cibles : exercises, exercise_questions, exercise_choices, exercise_attempts, exercise_answers
 */

export type ExerciseType = 'qcm' | 'exercice' | 'correction';

export type ExerciseDifficulty = 'facile' | 'moyen' | 'difficile';

export type ExerciseLevelId = 
  | 'primaire' 
  | 'college' 
  | 'lycee' 
  | 'universite' 
  | 'formation_pro';

export type ExerciseAccessStatus = 'gratuit' | 'premium';

export interface ExerciseChoice {
  id: string;
  label: string;
  isCorrect: boolean;
}

export interface ExerciseQuestion {
  id: string;
  order: number;
  question: string;
  type: 'qcm' | 'open' | 'calculation';
  choices?: ExerciseChoice[];
  sampleSolution?: string; // Solution rédigée pour exercices ouverts
  explanation: string; // Explication pédagogique détaillée
  method?: string; // Méthode de résolution
  tip?: string; // Conseil d'examen
  points: number;
}

export interface Exercise {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: ExerciseDifficulty;
  subject: string;
  subjectSlug: string;
  level: ExerciseLevelId;
  levelLabel: string;
  grade?: string; // ex: 'Terminale S2', '3e', 'Licence 2', etc.
  chapter: string;
  competitionId?: string; // ex: 'fastef', 'crem', 'ena'
  competitionName?: string; // ex: 'FASTEF Dakar', 'CREM'
  year?: number; // ex: 2024
  durationMinutes?: number; // > 0 pour chronométré, undefined/0 si non chronométré
  isPremium: boolean;
  questionsCount: number;
  questions?: ExerciseQuestion[];
  linkedResourceId?: string; // Lien avec une ressource de la bibliothèque
  coverGradient?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ExerciseAnswer {
  questionId: string;
  selectedChoiceId?: string;
  textAnswer?: string;
  isCorrect: boolean;
  answeredAt: string;
}

export type ExerciseSessionStatus = 'in_progress' | 'completed' | 'abandoned';

export interface ExerciseSession {
  id: string;
  exerciseId: string;
  exerciseTitle: string;
  subject: string;
  levelLabel: string;
  status: ExerciseSessionStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: Record<string, ExerciseAnswer>;
  score?: number; // Total points obtenus
  maxScore?: number; // Total points possibles
  percentage?: number; // 0 à 100
  timeSpentSeconds: number;
  startedAt: string;
  completedAt?: string;
}

export interface ExerciseUserProgress {
  totalCompletedSessions: number;
  averageScorePercentage: number;
  totalTimeSpentSeconds: number;
  subjectsPracticedCount: number;
  recentSessions: ExerciseSession[];
  activeSession?: ExerciseSession | null;
}

export interface ExerciseFilterQuery {
  searchQuery?: string;
  type?: ExerciseType | 'all';
  level?: ExerciseLevelId | 'all';
  subject?: string | 'all';
  competition?: string | 'all';
  difficulty?: ExerciseDifficulty | 'all';
  access?: ExerciseAccessStatus | 'all';
  year?: number | 'all';
}
