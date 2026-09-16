/**
 * Sunubiblio — Types stricts du moteur d'entraînement et d'examens
 * Compatible schéma relationnel PostgreSQL / Supabase
 * Tables cibles : resources, exercise_tests, test_questions, questions, question_choices, test_attempts, test_answers
 */

export type ExerciseType = 'qcm' | 'exercice' | 'correction' | 'test' | 'simulation';

/**
 * Trois niveaux stricts de difficulté pédagogique
 */
export type TestDifficulty = 'BEGINNER' | 'INTERMEDIATE' | 'PRO';
export type ExerciseDifficulty = TestDifficulty;

export type TestDifficultyLabel = 'Débutant' | 'Intermédiaire' | 'Pro';

export type ExerciseLevelId = 
  | 'primaire' 
  | 'college' 
  | 'lycee' 
  | 'universite' 
  | 'formation_pro';

export type ExerciseAccessStatus = 'gratuit' | 'premium';

export type TestSessionMode = 'exam' | 'practice';

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
  sampleSolution?: string; // Solution rédigée
  explanation: string; // Explication pédagogique détaillée
  method?: string; // Méthode de résolution pas à pas
  tip?: string; // Conseil d'examen officiel
  commonMistake?: string; // Erreur fréquente des candidats
  points: number;
}

export interface ExerciseTest {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: ExerciseType;
  difficulty: TestDifficulty;
  difficultyLabel: TestDifficultyLabel;
  subject: string;
  subjectSlug: string;
  level: ExerciseLevelId;
  levelLabel: string;
  grade?: string; // ex: 'Terminale S2', '3e', 'Licence 2', etc.
  chapter: string;
  
  // Liaison avec ressource de la bibliothèque / documents
  resourceId?: string; // ex: 'res-1'
  resourceTitle?: string; // ex: 'Mathématiques — Cours complet & 300 Exercices'
  
  // Liaison avec concours officiel
  competitionId?: string; // ex: 'fastef', 'crem', 'ena'
  competitionName?: string; // ex: 'FASTEF Dakar', 'CREM'
  year?: number;
  
  durationMinutes: number; // 0 si illimité, > 0 pour chronométré
  isPremium: boolean;
  questionsCount: number;
  questions?: ExerciseQuestion[];
  instructions?: string[];
  coverGradient?: string;
  orderIndex: number;
  createdAt: string;
  updatedAt: string;
}

// Rétrocompatibilité type Exercise = ExerciseTest
export type Exercise = ExerciseTest;

export interface ExerciseAnswer {
  questionId: string;
  selectedChoiceId?: string;
  textAnswer?: string;
  isCorrect?: boolean;
  answeredAt: string;
}

export type ExerciseSessionStatus = 'in_progress' | 'completed' | 'abandoned' | 'expired';

export interface ExerciseSession {
  id: string;
  testId: string;
  exerciseId: string; // Rétrocompatibilité
  exerciseTitle: string;
  subject: string;
  levelLabel: string;
  difficulty: TestDifficulty;
  difficultyLabel: TestDifficultyLabel;
  mode: TestSessionMode;
  status: ExerciseSessionStatus;
  currentQuestionIndex: number;
  totalQuestions: number;
  answers: Record<string, ExerciseAnswer>;
  score?: number; // Calculé après soumission finale
  maxScore?: number;
  percentage?: number;
  durationSeconds: number;
  timeSpentSeconds: number;
  startedAt: string;
  completedAt?: string;
}

export interface UserDifficultyStats {
  completedCount: number;
  averageScorePercentage: number;
}

export interface ExerciseUserProgress {
  totalCompletedSessions: number;
  averageScorePercentage: number;
  totalTimeSpentSeconds: number;
  subjectsPracticedCount: number;
  
  // Progression par phase de difficulté réelle
  byDifficulty: {
    beginner: UserDifficultyStats;
    intermediate: UserDifficultyStats;
    pro: UserDifficultyStats;
  };
  
  // Progression par matière
  bySubject: Record<string, { completed: number; avgScore: number }>;
  
  // Progression par concours
  byCompetition: Record<string, { completed: number; avgScore: number }>;
  
  recentSessions: ExerciseSession[];
  activeSession?: ExerciseSession | null;
}

export interface ExerciseFilterQuery {
  searchQuery?: string;
  type?: ExerciseType | 'all';
  level?: ExerciseLevelId | 'all';
  subject?: string | 'all';
  competition?: string | 'all';
  resourceId?: string | 'all';
  difficulty?: TestDifficulty | 'all';
  access?: ExerciseAccessStatus | 'all';
  year?: number | 'all';
}
