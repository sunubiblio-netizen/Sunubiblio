'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthModal } from '@/components/ui/AuthModal';
import { AIInputSelector, AIInputType, AIInputContent, AIInputSelectorHandle } from '@/components/ia/workspace/AIInputSelector';
import { AIAttachment } from '@/types/ai';
import { exerciseGeneratorService, GeneratedExercise, TopicKind } from '@/services/exerciseGeneratorService';

type ExerciseMode = 'exercices' | 'qcm' | 'corriger';

interface QCMItem {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

type ExerciseItem = GeneratedExercise;

interface ChatReply {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const ACTION_MODES_CONFIG = [
  {
    id: 'exercices' as ExerciseMode,
    title: 'Générer des exercices',
    subtitle: 'Exercices adaptés au niveau et à la matière',
    badge: 'Exercices',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    color: '#2563eb',
    bgColor: '#eff6ff',
  },
  {
    id: 'qcm' as ExerciseMode,
    title: 'Générer des QCM',
    subtitle: 'Questionnaires interactifs avec correction immédiate',
    badge: 'QCM',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <polyline points="9 11 12 14 22 4" />
        <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
      </svg>
    ),
    color: '#16a34a',
    bgColor: '#f0fdf4',
  },
  {
    id: 'corriger' as ExerciseMode,
    title: 'Corriger',
    subtitle: 'Analyse méthodique de devoirs et remarques',
    badge: 'Correction',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
      </svg>
    ),
    color: '#dc2626',
    bgColor: '#fef2f2',
  },
];

interface EducationLevel {
  id: string;
  label: string;
  shortLabel: string;
  icon: string;
}

const EDUCATION_LEVELS: EducationLevel[] = [
  {
    id: 'auto',
    label: 'Tous les niveaux',
    shortLabel: 'Tous les niveaux',
    icon: '🌟',
  },
  {
    id: 'primaire',
    label: 'Primaire',
    shortLabel: 'Primaire',
    icon: '✏️',
  },
  {
    id: 'college',
    label: 'Collège',
    shortLabel: 'Collège',
    icon: '🎒',
  },
  {
    id: 'lycee',
    label: 'Lycée',
    shortLabel: 'Lycée',
    icon: '📚',
  },
  {
    id: 'superieur',
    label: 'Université',
    shortLabel: 'Université',
    icon: '🎓',
  },
  {
    id: 'concours',
    label: 'Concours',
    shortLabel: 'Concours',
    icon: '🏆',
  },
  {
    id: 'autres',
    label: 'Autres',
    shortLabel: 'Autres',
    icon: '💼',
  },
];

export default function ExercicesPage() {
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Niveau éducatif sélectionné
  const [selectedLevelId, setSelectedLevelId] = useState<string>('auto');
  const [isLevelMenuOpen, setIsLevelMenuOpen] = useState(false);
  const levelMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu popover de niveau lors d'un clic extérieur
  useEffect(() => {
    if (!isLevelMenuOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (levelMenuRef.current && !levelMenuRef.current.contains(e.target as Node)) {
        setIsLevelMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isLevelMenuOpen]);

  // Mode actif & Menu popover type Chat
  const [activeMode, setActiveMode] = useState<ExerciseMode>('exercices');
  const [isModeMenuOpen, setIsModeMenuOpen] = useState(false);
  const aiInputRef = useRef<AIInputSelectorHandle>(null);

  // Contenu sélectionné
  const [inputContent, setInputContent] = useState<AIInputContent>({
    type: 'text',
    text: '',
  });

  // État de la session interactive (Chat / Résultat in-place)
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Données générées
  const [generatedExercises, setGeneratedExercises] = useState<ExerciseItem[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [generatedQCM, setGeneratedQCM] = useState<QCMItem[]>([]);
  const [currentQCMIndex, setCurrentQCMIndex] = useState(0);
  const [selectedQCMAnswers, setSelectedQCMAnswers] = useState<Record<number, number>>({});
  const [validatedQCMQuestions, setValidatedQCMQuestions] = useState<Record<number, boolean>>({});
  const [isQCMSubmitted, setIsQCMSubmitted] = useState(false);
  const [isQCMFinished, setIsQCMFinished] = useState(false);
  const [studentAnswers, setStudentAnswers] = useState<Record<number, string>>({});
  const [validatedExercises, setValidatedExercises] = useState<Record<number, boolean>>({});
  const [correctionReport, setCorrectionReport] = useState<{
    grade: string;
    strengths: string[];
    improvements: string[];
    summary: string;
  } | null>(null);

  // Chat complémentaire
  const [chatMessages, setChatMessages] = useState<ChatReply[]>([]);
  const [followupText, setFollowupText] = useState('');

  const currentModeConfig = ACTION_MODES_CONFIG.find((m) => m.id === activeMode) || ACTION_MODES_CONFIG[0];
  const selectedLevel = EDUCATION_LEVELS.find((l) => l.id === selectedLevelId) || EDUCATION_LEVELS[0];

  const handleOpenAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthOpen(true);
  };

  const handleSelectMode = (mode: ExerciseMode) => {
    setActiveMode(mode);
    setIsModeMenuOpen(false);
  };

  const handleStartGeneration = async () => {
    // 1. Validation interactive selon la catégorie d'entrée active
    if (inputContent.type === 'file' && !inputContent.file) {
      aiInputRef.current?.openFilePicker();
      return;
    }
    if (inputContent.type === 'library' && !inputContent.libraryResource) {
      aiInputRef.current?.openLibraryModal();
      return;
    }
    if (inputContent.type === 'text' && (!inputContent.text || !inputContent.text.trim())) {
      aiInputRef.current?.focusText();
      return;
    }

    setIsLoading(true);
    setIsSessionActive(true);
    setChatMessages([]);
    setSelectedQCMAnswers({});
    setValidatedQCMQuestions({});
    setIsQCMSubmitted(false);
    setIsQCMFinished(false);
    setStudentAnswers({});
    setValidatedExercises({});
    setCurrentExerciseIndex(0);
    setCurrentQCMIndex(0);

    const topicName =
      inputContent.type === 'library'
        ? inputContent.libraryResource?.name || 'Ressource de la bibliothèque'
        : inputContent.type === 'file'
        ? inputContent.documentTitle || (inputContent.file ? inputContent.file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') : 'Document importé')
        : inputContent.documentTitle || (inputContent.text?.trim() ? inputContent.text.trim().split('\n')[0].slice(0, 60) : 'Sujet d’entraînement');

    const extractedText =
      inputContent.type === 'library'
        ? inputContent.libraryResource?.extractedText || inputContent.libraryResource?.description || inputContent.libraryResource?.name || ''
        : inputContent.extractedText || inputContent.text || '';

    const keyConcepts =
      inputContent.type === 'library'
        ? inputContent.libraryResource?.keyConcepts || (inputContent.libraryResource?.subject ? [inputContent.libraryResource.subject] : [])
        : inputContent.keyConcepts || [];

    try {
      const res = await fetch('/api/ai/generate-exercises', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicName,
          extractedText,
          keyConcepts,
          levelId: selectedLevel.id,
          mode: activeMode,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        if (json.success && json.data) {
          if (activeMode === 'exercices') {
            const list = json.data.exercises || json.data;
            if (Array.isArray(list) && list.length > 0) {
              setGeneratedExercises(list);
              setIsLoading(false);
              return;
            }
          } else if (activeMode === 'qcm') {
            const list = json.data.qcm || json.data;
            if (Array.isArray(list) && list.length > 0) {
              setGeneratedQCM(list);
              setIsLoading(false);
              return;
            }
          } else if (activeMode === 'corriger') {
            const report = json.data.report || json.data;
            if (report) {
              setCorrectionReport(report);
              setIsLoading(false);
              return;
            }
          }
        }
      }
    } catch (err) {
      console.warn('Génération API indisponible, bascule sur moteur local:', err);
    }

    // Repli moteur local Sunubiblio
    setTimeout(() => {
      if (activeMode === 'exercices') {
        const exercises = exerciseGeneratorService.generateExercises(
          topicName,
          selectedLevel.id,
          extractedText,
          keyConcepts
        );
        setGeneratedExercises(exercises);
      } else if (activeMode === 'qcm') {
        const qcm = exerciseGeneratorService.generateQCM(
          topicName,
          selectedLevel.id,
          extractedText,
          keyConcepts
        );
        setGeneratedQCM(qcm);
      } else if (activeMode === 'corriger') {
        const report = exerciseGeneratorService.generateCorrectionReport(
          topicName,
          selectedLevel.id,
          extractedText,
          keyConcepts
        );
        setCorrectionReport(report);
      }

      setIsLoading(false);
    }, 600);
  };

  const handleValidateExercise = (exId: number) => {
    setValidatedExercises((prev) => ({ ...prev, [exId]: true }));
    setGeneratedExercises((prev) =>
      prev.map((e) => (e.id === exId ? { ...e, isSolutionVisible: true } : e))
    );
  };

  const handleToggleSolution = (exId: number) => {
    setGeneratedExercises((prev) =>
      prev.map((e) => (e.id === exId ? { ...e, isSolutionVisible: !e.isSolutionVisible } : e))
    );
  };

  const handleSelectOption = (questionId: number, optionIndex: number) => {
    setSelectedQCMAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleValidateCurrentQCM = (questionId: number) => {
    setValidatedQCMQuestions((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const handleSubmitQCM = () => {
    setIsQCMSubmitted(true);
    setIsQCMFinished(true);
  };

  const handleSendFollowup = (textToSend?: string) => {
    const text = textToSend || followupText.trim();
    if (!text) return;

    const userMsg: ChatReply = {
      id: 'usr-' + Date.now(),
      role: 'user',
      content: text,
    };
    setChatMessages((prev) => [...prev, userMsg]);
    setFollowupText('');

    setTimeout(() => {
      let aiContent = `Bien noté ! Voici un éclaircissement méthodologique : pensez à toujours décomposer le problème en sous-étapes et à vérifier vos hypothèses.`;
      if (text.toLowerCase().includes('indice')) {
        aiContent = `💡 **Indice pédagogique :** Observez attentivement la relation entre les variables principales. Une factorisation ou un changement de variable simplifie immédiatement l'analyse !`;
      } else if (text.toLowerCase().includes('difficile') || text.toLowerCase().includes('variante')) {
        aiContent = `🔥 **Variante niveau Concours :** Que se passerait-il si les conditions initiales variaient de façon non linéaire ? Essayez d'intégrer une contrainte supplémentaire de temps !`;
      } else if (text.toLowerCase().includes('étape 2') || text.toLowerCase().includes('etape 2')) {
        aiContent = `📖 **Éclaircissement sur l'étape 2 :** Nous appliquons le principe de conservation car le système est supposé à l'état stationnaire. Si le régime était transitoire, il faudrait ajouter le terme dérivé temporel !`;
      }
      setChatMessages((prev) => [
        ...prev,
        {
          id: 'ai-' + Date.now(),
          role: 'assistant',
          content: aiContent,
        },
      ]);
    }, 700);
  };

  const handleReset = () => {
    setIsSessionActive(false);
    setIsLoading(false);
    setGeneratedExercises([]);
    setGeneratedQCM([]);
    setSelectedQCMAnswers({});
    setValidatedQCMQuestions({});
    setIsQCMSubmitted(false);
    setIsQCMFinished(false);
    setStudentAnswers({});
    setValidatedExercises({});
    setCurrentExerciseIndex(0);
    setCurrentQCMIndex(0);
    setCorrectionReport(null);
    setChatMessages([]);
  };

  return (
    <div className={`exercices-page-root ${!isSessionActive ? 'is-static-view' : 'is-session-view'}`}>
      <Navbar onOpenAuth={handleOpenAuth} />

      <main className="exercices-main-container">
        {/* En-tête : Titre Exercice à gauche, Sélecteur de niveau à droite */}
        <header className="page-header-compact">
          <div className="container header-container-flex">
            <div className="header-left-group">
              <h1 className="header-simple-title">Exercice</h1>
            </div>

            <div className="header-level-wrapper" ref={levelMenuRef}>
              <button
                type="button"
                className="btn-header-level-pill"
                onClick={() => setIsLevelMenuOpen((prev) => !prev)}
                aria-expanded={isLevelMenuOpen}
                aria-haspopup="true"
                title="Choisir le niveau"
              >
                <span className="level-pill-icon">{selectedLevel.icon}</span>
                <span className="level-pill-label">{selectedLevel.label}</span>
                <svg
                  className={`level-chevron ${isLevelMenuOpen ? 'is-open' : ''}`}
                  width="13"
                  height="13"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {isLevelMenuOpen && (
                <div className="header-level-popover">
                  <div className="level-popover-list">
                    {EDUCATION_LEVELS.map((level) => {
                      const isSelected = level.id === selectedLevelId;
                      return (
                        <button
                          key={level.id}
                          type="button"
                          className={`level-popover-item ${isSelected ? 'is-selected' : ''}`}
                          onClick={() => {
                            setSelectedLevelId(level.id);
                            setIsLevelMenuOpen(false);
                          }}
                        >
                          <span className="level-item-icon">{level.icon}</span>
                          <span className="level-item-title">{level.label}</span>
                          {isSelected && (
                            <svg className="level-item-check" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="container workspace-container">
          {!isSessionActive ? (
            /* ============================================================== */
            /* 1. ÉCRAN DE SAISIE INITIALE : ULTRA-MODERNE, STYLE CHAT       */
            /* ============================================================== */
            <div className="card-workspace-input">
              {/* Étape 1 : Support / Contenu avec les 3 onglets (Exactement la capture) */}
              <div className="section-block">
                <AIInputSelector
                  ref={aiInputRef}
                  label="Sur quelle leçon ou thème voulez-vous des exercices ?"
                  placeholder="Entrez un thème précis (ex: Équations différentielles, Droit des obligations, Génétique...) ou collez votre cours..."
                  onContentChange={setInputContent}
                />
              </div>

              {/* Étape 2 : Barre d'action unifiée style Chat (Sélecteur 3 actions + Bouton flèche d'envoi) */}
              <div className="chat-action-bar-wrap">
                <div className="action-selector-relative">
                  {/* Bouton sélecteur des 3 actions */}
                  <button
                    type="button"
                    className="btn-chat-mode-pill"
                    onClick={() => setIsModeMenuOpen(!isModeMenuOpen)}
                    aria-expanded={isModeMenuOpen}
                    title="Changer d'action (Exercices, QCM, Corriger)"
                  >
                    <span className="mode-current-icon" style={{ color: currentModeConfig.color }}>
                      {currentModeConfig.icon}
                    </span>
                    <span className="mode-current-label">{currentModeConfig.title}</span>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`chevron-indicator ${isModeMenuOpen ? 'is-open' : ''}`}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Menu Popover Flottant des 3 choix */}
                  {isModeMenuOpen && (
                    <>
                      <div className="menu-backdrop" onClick={() => setIsModeMenuOpen(false)} />
                      <div className="chat-mode-popover" role="menu">
                        <div className="popover-items-list">
                          {ACTION_MODES_CONFIG.map((m) => (
                            <button
                              key={m.id}
                              type="button"
                              className={`popover-item-btn ${activeMode === m.id ? 'is-selected' : ''}`}
                              onClick={() => handleSelectMode(m.id)}
                            >
                              <div className="item-icon-box" style={{ background: m.bgColor, color: m.color }}>
                                {m.icon}
                              </div>
                              <div className="item-text-box">
                                <span className="item-title">{m.title}</span>
                                <span className="item-subtitle">{m.subtitle}</span>
                              </div>
                              {activeMode === m.id && (
                                <span className="item-check-badge">✓</span>
                              )}
                            </button>
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Bouton d'envoi circulaire avec flèche style Chat */}
                <button
                  type="button"
                  className="btn-chat-send-submit"
                  onClick={handleStartGeneration}
                  disabled={isLoading}
                  aria-label={`Lancer : ${currentModeConfig.title}`}
                  title={
                    inputContent.type === 'file' && !inputContent.file
                      ? 'Parcourir et importer un document (PDF, Word, TXT)'
                      : inputContent.type === 'library' && !inputContent.libraryResource
                      ? 'Parcourir et choisir une ressource de la bibliothèque'
                      : inputContent.type === 'text' && (!inputContent.text || !inputContent.text.trim())
                      ? 'Saisissez ou collez un sujet à analyser'
                      : `Lancer : ${currentModeConfig.title}`
                  }
                >
                  {isLoading ? (
                    <span className="spinner-send-bullet" />
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="12" y1="19" x2="12" y2="5" />
                      <polyline points="5 12 12 5 19 12" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* ============================================================== */
            /* 2. ÉCRAN INTERACTIF TYPE CHAT : SUR PLACE, SANS SCROLL FORCÉ   */
            /* ============================================================== */
            <div className="interactive-chat-workspace">
              {/* Barre supérieure de session */}
              <div className="session-top-bar">
                <div className="session-top-header-row">
                  <span className="session-badge" style={{ color: currentModeConfig.color, background: currentModeConfig.bgColor }}>
                    {currentModeConfig.title}
                  </span>

                  <button
                    type="button"
                    className="btn-new-exercise"
                    onClick={handleReset}
                    title="Commencer un nouvel exercice"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                      <polyline points="1 4 1 10 7 10" />
                      <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                    </svg>
                    <span>Nouvel exercice</span>
                  </button>
                </div>

                <div className="session-topic-full-banner">
                  <span className="topic-icon">
                    {inputContent.type === 'file' ? '📄' : inputContent.type === 'library' ? '📖' : '📝'}
                  </span>
                  <span className="session-topic-full-text">
                    {inputContent.type === 'library'
                      ? inputContent.libraryResource?.name || 'Ressource de la bibliothèque'
                      : inputContent.type === 'file'
                      ? inputContent.documentTitle || (inputContent.file ? inputContent.file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ') : 'Document analysé')
                      : inputContent.documentTitle || (inputContent.text?.trim() ? inputContent.text.trim().split('\n')[0].slice(0, 70) : 'Session active')}
                  </span>
                </div>
              </div>

              {/* Zone principale interactive */}
              <div className="interactive-viewport">
                {isLoading ? (
                  <div className="loading-state-box">
                    <div className="spinner-sparkle" />
                    <p className="loading-title">L’intelligence pédagogique analyse votre demande...</p>
                    <p className="loading-sub">
                      {activeMode === 'exercices' && 'Élaboration d\'exercices progressifs adaptés.'}
                      {activeMode === 'qcm' && 'Formulation des questions et calibration des réponses.'}
                      {activeMode === 'corriger' && 'Évaluation rigoureuse et barème officiel.'}
                    </p>
                  </div>
                ) : (
                  <>
                    {/* MODE 1 : EXERCICES D'ENTRAÎNEMENT 1 PAR 1 */}
                    {activeMode === 'exercices' && generatedExercises.length > 0 && (() => {
                      const ex = generatedExercises[currentExerciseIndex] || generatedExercises[0];
                      const isValidated = !!validatedExercises[ex.id];
                      const answer = studentAnswers[ex.id] || '';

                      return (
                        <div className="single-exercise-container">
                          {/* Barre d'étape / progression de l'exercice */}
                          <div className="exercise-stepper-header">
                            <div className="stepper-badge-wrap">
                              <span className="stepper-indicator-badge">
                                Exercice {currentExerciseIndex + 1} / {generatedExercises.length}
                              </span>
                              <div className="stepper-dots">
                                {generatedExercises.map((item, idx) => {
                                  const isUnlocked = idx === 0 || !!validatedExercises[generatedExercises[idx - 1]?.id];
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      disabled={!isUnlocked}
                                      className={`step-dot ${idx === currentExerciseIndex ? 'is-active' : ''} ${validatedExercises[item.id] ? 'is-done' : ''} ${!isUnlocked ? 'is-locked' : ''}`}
                                      onClick={() => {
                                        if (isUnlocked) {
                                          setCurrentExerciseIndex(idx);
                                        }
                                      }}
                                      title={isUnlocked ? `Aller à l'exercice ${idx + 1}` : `Validez d'abord l'exercice ${idx} pour débloquer`}
                                    >
                                      {isUnlocked ? idx + 1 : '🔒'}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <span className="card-ex-duration">⏱️ {ex.duration}</span>
                          </div>

                          <div className="exercise-interactive-card">
                            <div className="card-head-row">
                              <div className="card-title-badge-group">
                                <span className="ex-number-badge">Exercice #{ex.id}</span>
                                <h3 className="card-ex-title">{ex.title}</h3>
                              </div>
                            </div>

                            <div className="statement-box">
                              <span className="statement-tag">Énoncé de travail</span>
                              <p className="card-ex-statement">{ex.statement}</p>
                            </div>

                            {!isValidated ? (() => {
                              const cleanAnswer = (answer || '').trim();
                              const wordsList = cleanAnswer ? cleanAnswer.split(/\s+/).filter(Boolean) : [];
                              const currentWordsCount = wordsList.length;
                              const minWords = ex.minWordsRequired || (ex.topicKind === 'calcul' ? 6 : 25);
                              const isThresholdReached = currentWordsCount >= minWords;
                              const wordsRemaining = Math.max(0, minWords - currentWordsCount);
                              const progressPercent = Math.min(100, Math.round((currentWordsCount / minWords) * 100));

                              return (
                                <div className="student-workspace-block">
                                  <div className="student-workspace-header">
                                    <label className="student-input-label">
                                      <span>Votre réponse ou démarche d'entraînement :</span>
                                      <span className="hint-optional">
                                        {ex.instructionHint || (ex.topicKind === 'calcul' ? 'Posez vos calculs et le résultat' : 'Rédigez votre réponse argumentée')}
                                      </span>
                                    </label>
                                    {ex.kindLabel && (
                                      <div className={`topic-kind-pill kind-${ex.topicKind || 'redaction'}`}>
                                        <span className="pill-icon">{ex.badgeIcon || '✍️'}</span>
                                        <span className="pill-text">{ex.kindLabel}</span>
                                      </div>
                                    )}
                                  </div>

                                  <textarea
                                    className="student-answer-textarea"
                                    placeholder={
                                      ex.topicKind === 'calcul'
                                        ? "Posez ici vos formules, vos calculs intermédiaires et votre résultat numérique final..."
                                        : ex.topicKind === 'document'
                                        ? "Rédigez ici votre analyse des données du document, vos observations et votre synthèse..."
                                        : ex.topicKind === 'rapport'
                                        ? "Rédigez ici votre diagnostic de situation, vos arguments et vos recommandations d'action..."
                                        : "Rédigez ici votre réflexion argumentée, vos définitions, votre raisonnement et vos exemples..."
                                    }
                                    rows={4}
                                    value={answer}
                                    onChange={(e) => setStudentAnswers((prev) => ({ ...prev, [ex.id]: e.target.value }))}
                                  />

                                  {/* Barre de progression & Compteur de mots en temps réel */}
                                  <div className="word-count-progress-wrap">
                                    <div className="word-count-info-row">
                                      <span className={`word-count-badge ${isThresholdReached ? 'is-valid' : 'is-pending'}`}>
                                        {isThresholdReached ? (
                                          <>✓ Seuil validé ({currentWordsCount} / {minWords} mots)</>
                                        ) : (
                                          <>✏️ {currentWordsCount} / {minWords} mots requis</>
                                        )}
                                      </span>
                                      <span className="words-remaining-hint">
                                        {!isThresholdReached ? (
                                          <>Encore <strong>{wordsRemaining} mot{wordsRemaining > 1 ? 's' : ''}</strong> pour débloquer</>
                                        ) : (
                                          <span className="text-unlocked-ready">🎉 Corrigé débloquable !</span>
                                        )}
                                      </span>
                                    </div>
                                    <div className="progress-bar-track">
                                      <div
                                        className={`progress-bar-fill ${isThresholdReached ? 'is-full' : ''}`}
                                        style={{ width: `${progressPercent}%` }}
                                      />
                                    </div>
                                  </div>

                                  <div className="card-ex-action-row">
                                    <button
                                      type="button"
                                      className={`btn-validate-step ${!isThresholdReached ? 'is-disabled-lock' : 'is-ready'}`}
                                      onClick={() => isThresholdReached && handleValidateExercise(ex.id)}
                                      disabled={!isThresholdReached}
                                      title={!isThresholdReached ? `Rédigez encore ${wordsRemaining} mot(s) pour débloquer le corrigé` : 'Voir la correction officielle'}
                                    >
                                      {!isThresholdReached ? (
                                        <>
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
                                            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                          </svg>
                                          <span>Rédigez encore {wordsRemaining} mot{wordsRemaining > 1 ? 's' : ''} pour débloquer le corrigé</span>
                                        </>
                                      ) : (
                                        <>
                                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <polyline points="20 6 9 17 4 12" />
                                          </svg>
                                          <span>Valider & Débloquer le corrigé détaillé</span>
                                        </>
                                      )}
                                    </button>
                                  </div>
                                </div>
                              );
                            })() : (
                              <div className="solution-unlocked-section">
                                {answer.trim() && (
                                  <div className="student-submitted-box">
                                    <span className="submitted-tag">Votre proposition enregistrée :</span>
                                    <p className="submitted-content">{answer}</p>
                                  </div>
                                )}

                                <div className="card-ex-solution-box">
                                    <div className="solution-header-bar">
                                      <span className="solution-badge-ok">✓ Corrigé & Méthode officielle</span>
                                    </div>
                                  <pre className="solution-text">{ex.solution}</pre>
                                </div>

                                {/* Navigation séquentielle : passer au numéro 2 après validation */}
                                <div className="exercise-navigation-bar">
                                  {currentExerciseIndex > 0 ? (
                                    <button
                                      type="button"
                                      className="btn-ex-nav-step btn-ex-nav-prev"
                                      onClick={() => setCurrentExerciseIndex((prev) => Math.max(0, prev - 1))}
                                    >
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="19" y1="12" x2="5" y2="12" />
                                        <polyline points="12 19 5 12 12 5" />
                                      </svg>
                                      <span>Exercice précédent ({currentExerciseIndex})</span>
                                    </button>
                                  ) : <div />}

                                  {currentExerciseIndex < generatedExercises.length - 1 ? (
                                    <button
                                      type="button"
                                      className="btn-ex-nav-step btn-ex-nav-next"
                                      onClick={() => setCurrentExerciseIndex((prev) => Math.min(generatedExercises.length - 1, prev + 1))}
                                    >
                                      <span>Passer au numéro {currentExerciseIndex + 2}</span>
                                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                      </svg>
                                    </button>
                                  ) : (
                                    <div className="all-exercises-finished-pill">
                                      <span>🎉 Série terminée ! Tous les exercices sont complétés</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })()}

                    {/* MODE 2 : QCM INTERACTIF QUESTION PAR QUESTION */}
                    {activeMode === 'qcm' && generatedQCM.length > 0 && (() => {
                      if (isQCMFinished) {
                        const correctCount = generatedQCM.filter((q) => selectedQCMAnswers[q.id] === q.correctIndex).length;
                        return (
                          <div className="qcm-final-summary-view">
                            <div className="qcm-score-banner">
                              <div className="score-circle">
                                {correctCount} / {generatedQCM.length}
                              </div>
                              <div className="score-meta">
                                <h4>
                                  {correctCount === generatedQCM.length
                                    ? '🎉 Excellent ! Score parfait sur ce QCM'
                                    : `Bilan : ${correctCount} bonne(s) réponse(s) sur ${generatedQCM.length}`}
                                </h4>
                                <p>Consultez vos résultats ci-dessous ou posez des questions de révision au tuteur.</p>
                              </div>
                            </div>

                            <div className="qcm-summary-actions-bar">
                              <button
                                type="button"
                                className="btn-review-questions"
                                onClick={() => {
                                  setSelectedQCMAnswers({});
                                  setCurrentQCMIndex(0);
                                  setIsQCMFinished(false);
                                }}
                              >
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <polyline points="1 4 1 10 7 10" />
                                  <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                                </svg>
                                <span>Refaire ce QCM (nouvel essai)</span>
                              </button>
                            </div>

                            <div className="qcm-recap-cards-list">
                              {generatedQCM.map((q) => {
                                const selectedIdx = selectedQCMAnswers[q.id];
                                const isCorrect = selectedIdx === q.correctIndex;
                                return (
                                  <div key={q.id} className="qcm-recap-mini-card">
                                    <div className="recap-header">
                                      <span className={`recap-badge ${isCorrect ? 'is-good' : 'is-wrong'}`}>
                                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                                      </span>
                                      <span className="recap-q-num">Question #{q.id}</span>
                                    </div>
                                    <p className="recap-question-text">{q.question}</p>
                                    <div className="recap-explanation">
                                      <div className="recap-choice-line">
                                        <span className="recap-label">Bonne réponse :</span>
                                        <span className="recap-val-ok">{q.options[q.correctIndex]}</span>
                                      </div>
                                      {selectedIdx !== undefined && !isCorrect && (
                                        <div className="recap-choice-line">
                                          <span className="recap-label">Votre choix :</span>
                                          <span className="recap-val-wrong">{q.options[selectedIdx]}</span>
                                        </div>
                                      )}
                                      <p className="recap-detail">{q.explanation}</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      }

                      const q = generatedQCM[currentQCMIndex] || generatedQCM[0];
                      const selectedIdx = selectedQCMAnswers[q.id];
                      const answeredCount = Object.keys(selectedQCMAnswers).length;
                      const hasSelectedCurrent = selectedIdx !== undefined;

                      return (
                        <div className="single-qcm-container">
                          {/* En-tête de progression QCM */}
                          <div className="qcm-stepper-header">
                            <div className="stepper-badge-wrap">
                              <span className="stepper-indicator-badge">
                                Question {currentQCMIndex + 1} / {generatedQCM.length}
                              </span>
                              <div className="stepper-dots">
                                {generatedQCM.map((item, idx) => {
                                  const isAnswered = selectedQCMAnswers[item.id] !== undefined;
                                  return (
                                    <button
                                      key={item.id}
                                      type="button"
                                      className={`step-dot ${idx === currentQCMIndex ? 'is-active' : ''} ${isAnswered ? 'is-answered' : ''}`}
                                      onClick={() => setCurrentQCMIndex(idx)}
                                      title={`Aller à la question ${idx + 1}`}
                                    >
                                      {idx + 1}
                                    </button>
                                  );
                                })}
                              </div>
                            </div>
                            <span className="qcm-answered-counter-pill">
                              {answeredCount} / {generatedQCM.length} répondu{answeredCount > 1 ? 'es' : 'e'}
                            </span>
                          </div>

                          <div className="qcm-interactive-card">
                            <h3 className="qcm-question-title">
                              Question {q.id} : {q.question}
                            </h3>

                            <div className="qcm-options-stack">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedIdx === optIdx;
                                return (
                                  <button
                                    key={optIdx}
                                    type="button"
                                    className={`qcm-option-btn ${isSelected ? 'is-selected' : ''}`}
                                    onClick={() => handleSelectOption(q.id, optIdx)}
                                  >
                                    <span className="option-letter">{String.fromCharCode(65 + optIdx)}</span>
                                    <span className="option-text">{opt}</span>
                                  </button>
                                );
                              })}
                            </div>

                            {/* Navigation QCM : Flèche retour ⬅ et flèche suivante ➔ */}
                            <div className="qcm-navigation-bar">
                              {currentQCMIndex > 0 ? (
                                <button
                                  type="button"
                                  className="btn-qcm-arrow-nav btn-qcm-prev"
                                  onClick={() => setCurrentQCMIndex((prev) => Math.max(0, prev - 1))}
                                  title="Revenir à la question précédente"
                                >
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="19" y1="12" x2="5" y2="12" />
                                    <polyline points="12 19 5 12 12 5" />
                                  </svg>
                                  <span>Question précédente</span>
                                </button>
                              ) : <div />}

                              {currentQCMIndex < generatedQCM.length - 1 ? (
                                <button
                                  type="button"
                                  className={`btn-qcm-arrow-nav btn-qcm-next ${!hasSelectedCurrent ? 'is-subtle' : ''}`}
                                  onClick={() => setCurrentQCMIndex((prev) => Math.min(generatedQCM.length - 1, prev + 1))}
                                  title="Passer à la question suivante"
                                >
                                  <span>Question suivante ({currentQCMIndex + 2})</span>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                  </svg>
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  className="btn-qcm-arrow-nav btn-qcm-finish"
                                  onClick={handleSubmitQCM}
                                  title="Terminer le QCM et voir les réponses et le corrigé complet"
                                >
                                  <span>Terminer le QCM & Voir les réponses</span>
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })()}

                    {/* MODE 3 : RAPPORT DE CORRECTION SUR PLACE */}
                    {activeMode === 'corriger' && correctionReport && (
                      <div className="generated-correction-card">
                        <div className="correction-header-row">
                          <div className="correction-title-group">
                            <span className="correction-sub-tag">Évaluation formative</span>
                            <h3 className="correction-title">Note & Diagnostic Pédagogique</h3>
                          </div>
                          {(() => {
                            const gradeText = correctionReport.grade || '';
                            const match = gradeText.match(/^(.*?)(?:\s*\((.*?)\))?$/);
                            const score = match ? match[1].trim() : gradeText;
                            const mention = match && match[2] ? match[2].trim() : null;

                            return (
                              <div className="grade-badge-card">
                                <div className="grade-score-pill">
                                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                  </svg>
                                  <span className="grade-num">{score}</span>
                                </div>
                                {mention && (
                                  <span className="grade-mention-pill">{mention}</span>
                                )}
                              </div>
                            );
                          })()}
                        </div>

                        <p className="correction-summary">{correctionReport.summary}</p>

                        <div className="correction-points-grid">
                          <div className="points-box strengths-box">
                            <h4 className="points-title">🟢 Points forts observés :</h4>
                            <ul>
                              {correctionReport.strengths.map((s, idx) => (
                                <li key={idx}>{s}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="points-box improvements-box">
                            <h4 className="points-title">💡 Recommandations de progrès :</h4>
                            <ul>
                              {correctionReport.improvements.map((imp, idx) => (
                                <li key={idx}>{imp}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Échanges conversationnels de relance */}
                    {chatMessages.length > 0 && (
                      <div className="chat-thread-flow">
                        {chatMessages.map((msg) => (
                          <div
                            key={msg.id}
                            className={`chat-bubble ${msg.role === 'user' ? 'bubble-user' : 'bubble-assistant'}`}
                          >
                            <span className="bubble-author">
                              {msg.role === 'user' ? 'Vous' : 'Tuteur IA'}
                            </span>
                            <div className="bubble-content">{msg.content}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      {!isSessionActive && (
        <div className="exercices-footer-wrapper desktop-only-footer">
          <Footer />
        </div>
      )}

      <AuthModal
        isOpen={authOpen}
        onClose={() => setAuthOpen(false)}
        initialMode={authMode}
      />

      <style jsx>{`
        .exercices-page-root {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          flex-direction: column;
          background: #f8fafc;
        }

        .exercices-page-root.is-static-view {
          height: 100dvh;
          overflow: hidden;
        }

        .exercices-main-container {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .exercices-page-root.is-static-view .exercices-main-container {
          overflow: hidden;
        }

        .exercices-footer-wrapper {
          margin-top: auto;
          flex-shrink: 0;
        }

        .page-header-compact {
          padding: 16px 0 10px;
          background: transparent;
          position: relative;
          z-index: 60;
        }

        .header-container-flex {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          max-width: 840px;
          padding: 0 16px;
          box-sizing: border-box;
        }

        .header-left-group {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .header-simple-title {
          font-size: clamp(1.5rem, 3.2vw, 1.9rem);
          font-weight: 800;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 55%, #4f46e5 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          color: #1e3a8a;
          margin: 0;
          letter-spacing: -0.025em;
          text-align: left;
        }

        .header-level-wrapper {
          position: relative;
          z-index: 70;
        }

        .btn-header-level-pill {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #ffffff;
          border: 1.5px solid #cbd5e1;
          border-radius: 9999px;
          padding: 7px 14px;
          font-size: 0.8125rem;
          color: #1e293b;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.16s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .btn-header-level-pill:hover {
          background: #f8fafc;
          border-color: #94a3b8;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          transform: translateY(-1px);
        }

        .level-pill-icon {
          font-size: 0.95rem;
          line-height: 1;
        }

        .level-pill-label {
          white-space: nowrap;
        }

        .level-pill-prefix {
          color: #64748b;
          font-weight: 600;
          margin-right: 2px;
        }

        .level-chevron {
          color: #94a3b8;
          transition: transform 0.2s ease;
        }

        .level-chevron.is-open {
          transform: rotate(180deg);
        }

        /* Menu Déroulant Popover du Niveau */
        .header-level-popover {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 205px;
          max-width: calc(100vw - 24px);
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 14px 34px -6px rgba(15, 23, 42, 0.22);
          z-index: 999;
          overflow: hidden;
          animation: popoverFadeIn 0.15s ease-out;
        }

        @keyframes popoverFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .level-popover-list {
          padding: 5px;
          display: flex;
          flex-direction: column;
          gap: 2px;
          max-height: 380px;
          overflow-y: auto;
        }

        .level-popover-item {
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border-radius: 9px;
          border: 1px solid transparent;
          background: transparent;
          text-align: left;
          cursor: pointer;
          width: 100%;
          transition: all 0.14s ease;
        }

        .level-popover-item:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .level-popover-item.is-selected {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .level-item-icon {
          font-size: 1.05rem;
          flex-shrink: 0;
        }

        .level-item-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #1e293b;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .level-popover-item.is-selected .level-item-title {
          color: #1d4ed8;
          font-weight: 800;
        }

        .level-item-check {
          color: #2563eb;
          flex-shrink: 0;
          margin-left: auto;
        }

        .workspace-container {
          max-width: 840px;
          margin: 0 auto;
          width: 100%;
          box-sizing: border-box;
          padding: 12px 16px 24px;
          flex: 1;
          display: flex;
          flex-direction: column;
          min-height: 0;
        }

        .exercices-page-root.is-static-view .workspace-container {
          overflow: hidden;
        }

        /* 1. Carte de Saisie Initiale Ultra-Moderne */
        .card-workspace-input {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          padding: 20px 22px;
          box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.05);
          display: flex;
          flex-direction: column;
          gap: 14px;
          flex: 1;
          min-height: 0;
        }

        .section-block {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
        }

        .section-block :global(.ai-input-selector-root) {
          display: flex;
          flex-direction: column;
          flex: 1;
          min-height: 0;
          height: 100%;
        }

        .section-block :global(.input-content-panel) {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        .section-block :global(.text-editor-wrap) {
          flex: 1;
          min-height: 0;
          display: flex;
          flex-direction: column;
        }

        /* Barre d'action intelligente façon Chat */
        .chat-action-bar-wrap {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding-top: 14px;
          border-top: 1px solid #f1f5f9;
        }

        .action-selector-relative {
          position: relative;
        }

        /* Bouton Pilule Style Chat Sélecteur d'action */
        .btn-chat-mode-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          border-radius: 9999px;
          background: #f8fafc;
          border: 1.5px solid #cbd5e1;
          color: #0f172a;
          cursor: pointer;
          font-size: 0.84rem;
          font-weight: 700;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-chat-mode-pill:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          transform: translateY(-1px);
        }

        .mode-current-icon {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .mode-current-label {
          font-weight: 700;
          color: #1e293b;
        }

        .chevron-indicator {
          color: #94a3b8;
          transition: transform 0.2s ease;
        }

        .chevron-indicator.is-open {
          transform: rotate(180deg);
        }

        /* Menu Popover Flottant */
        .menu-backdrop {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 100;
        }

        .chat-mode-popover {
          position: absolute;
          bottom: calc(100% + 8px);
          left: 0;
          width: 280px;
          max-width: 88vw;
          background: #ffffff;
          border-radius: 14px;
          border: 1px solid rgba(226, 232, 240, 0.95);
          box-shadow: 0 12px 28px -6px rgba(15, 23, 42, 0.16);
          z-index: 101;
          overflow: hidden;
          animation: popoverFade 0.16s cubic-bezier(0.16, 1, 0.3, 1);
        }

        @keyframes popoverFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .popover-items-list {
          padding: 6px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .popover-item-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: 10px;
          border: 1px solid transparent;
          background: transparent;
          text-align: left;
          cursor: pointer;
          width: 100%;
          transition: all 0.14s ease;
        }

        .popover-item-btn:hover {
          background: #f8fafc;
          border-color: #e2e8f0;
        }

        .popover-item-btn.is-selected {
          background: #eff6ff;
          border-color: #bfdbfe;
        }

        .item-icon-box {
          width: 30px;
          height: 30px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .item-text-box {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }

        .item-title {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #0f172a;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-subtitle {
          font-size: 0.6875rem;
          color: #64748b;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .item-check-badge {
          color: #2563eb;
          font-weight: 900;
          font-size: 1rem;
        }

        /* Bouton d'envoi circulaire style Chat (Flèche) */
        .btn-chat-send-submit {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: #ffffff;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.28);
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
        }

        .btn-chat-send-submit:hover:not(:disabled) {
          transform: scale(1.06);
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
        }

        .btn-chat-send-submit:active:not(:disabled) {
          transform: scale(0.95);
        }

        .btn-chat-send-submit:disabled {
          opacity: 0.45;
          cursor: not-allowed;
          box-shadow: none;
        }

        .spinner-send-bullet {
          width: 18px;
          height: 18px;
          border: 2.5px solid rgba(255, 255, 255, 0.3);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spinSend 0.8s linear infinite;
        }

        @keyframes spinSend {
          to { transform: rotate(360deg); }
        }

        /* 2. Espace Interactif Type Chat (In-place & Mobile First) */
        .interactive-chat-workspace {
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 20px;
          overflow: hidden;
          box-shadow: 0 10px 30px -4px rgba(15, 23, 42, 0.08);
          display: flex;
          flex-direction: column;
          min-height: 500px;
        }

        .session-top-bar {
          padding: 12px 18px;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .session-top-header-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
        }

        .session-badge {
          font-size: 0.7813rem;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
        }

        .btn-new-exercise {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.7813rem;
          font-weight: 700;
          color: #2563eb;
          background: #ffffff;
          border: 1px solid #bfdbfe;
          padding: 6px 12px;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .btn-new-exercise:hover {
          background: #eff6ff;
          border-color: #2563eb;
        }

        .session-topic-full-banner {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          background: #ffffff;
          border: 1px solid #e2e8f0;
          border-radius: 10px;
          padding: 8px 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
        }

        .topic-icon {
          font-size: 0.95rem;
          flex-shrink: 0;
          line-height: 1.4;
        }

        .session-topic-full-text {
          font-size: 0.8125rem;
          font-weight: 600;
          color: #334155;
          line-height: 1.45;
          word-break: break-all;
          overflow-wrap: anywhere;
          flex: 1;
        }

        .interactive-viewport {
          padding: 18px;
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16px;
          overflow-y: auto;
          max-height: 60vh;
        }

        .loading-state-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 44px 16px;
        }

        .spinner-sparkle {
          width: 36px;
          height: 36px;
          border: 3px solid #e2e8f0;
          border-top-color: #2563eb;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
          margin-bottom: 14px;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .loading-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 4px;
        }

        .loading-sub {
          font-size: 0.7813rem;
          color: #64748b;
          margin: 0;
        }

        /* Exercices */
        .generated-exercises-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .exercise-interactive-card {
          border: 1px solid #e2e8f0;
          border-radius: 16px;
          padding: 18px;
          background: #ffffff;
          box-shadow: 0 4px 14px -2px rgba(15, 23, 42, 0.04);
        }

        .card-head-row {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
          margin-bottom: 14px;
          width: 100%;
        }

        .card-title-badge-group {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 6px;
          width: 100%;
        }

        .ex-number-badge {
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          background: #eff6ff;
          color: #2563eb;
          padding: 3px 8px;
          border-radius: 6px;
          display: inline-block;
        }

        .card-ex-title {
          font-size: 0.9375rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
          line-height: 1.45;
          word-break: break-all;
          overflow-wrap: anywhere;
          width: 100%;
        }

        .card-ex-duration {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 3px 8px;
          border-radius: 6px;
          white-space: nowrap;
        }

        .statement-box {
          background: #f8fafc;
          border-left: 3px solid #2563eb;
          border-radius: 0 10px 10px 0;
          padding: 12px 14px;
          margin-bottom: 14px;
        }

        .statement-tag {
          font-size: 0.6875rem;
          font-weight: 800;
          text-transform: uppercase;
          color: #64748b;
          letter-spacing: 0.04em;
          display: block;
          margin-bottom: 4px;
        }

        .card-ex-statement {
          font-size: 0.875rem;
          color: #1e293b;
          line-height: 1.6;
          margin: 0;
        }

        /* Espace de travail élève & Contrôle pédagogique de rédaction */
        .student-workspace-block {
          background: #fafafa;
          border: 1.5px solid #e2e8f0;
          border-radius: 14px;
          padding: 14px 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: border-color 0.2s ease;
        }

        .student-workspace-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 10px;
          flex-wrap: wrap;
        }

        .student-input-label {
          display: flex;
          flex-direction: column;
          gap: 3px;
          font-size: 0.8125rem;
          font-weight: 800;
          color: #1e293b;
          flex: 1;
          min-width: 0;
        }

        .hint-optional {
          font-size: 0.7188rem;
          color: #64748b;
          font-weight: 500;
          line-height: 1.35;
        }

        .topic-kind-pill {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.6875rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 9999px;
          white-space: nowrap;
          text-transform: uppercase;
          letter-spacing: 0.03em;
        }

        .topic-kind-pill.kind-calcul {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
        }

        .topic-kind-pill.kind-redaction {
          background: #fdf4ff;
          color: #86198f;
          border: 1px solid #f0abfc;
        }

        .topic-kind-pill.kind-document {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .topic-kind-pill.kind-rapport {
          background: #fffbeb;
          color: #92400e;
          border: 1px solid #fde68a;
        }

        .student-answer-textarea {
          width: 100%;
          border: 1.5px solid #cbd5e1;
          border-radius: 12px;
          background: #ffffff;
          padding: 12px 14px;
          font-size: 0.875rem;
          font-family: inherit;
          color: #0f172a;
          line-height: 1.6;
          resize: vertical;
          min-height: 95px;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          box-sizing: border-box;
        }

        .student-answer-textarea:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
        }

        /* Jauge & Compteur de mots pédagogique */
        .word-count-progress-wrap {
          display: flex;
          flex-direction: column;
          gap: 6px;
          background: #ffffff;
          padding: 10px 12px;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
        }

        .word-count-info-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .word-count-badge {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          font-size: 0.75rem;
          font-weight: 800;
          padding: 3px 10px;
          border-radius: 6px;
        }

        .word-count-badge.is-pending {
          background: #fff7ed;
          color: #c2410c;
          border: 1px solid #ffedd5;
        }

        .word-count-badge.is-valid {
          background: #ecfdf5;
          color: #065f46;
          border: 1px solid #a7f3d0;
        }

        .words-remaining-hint {
          font-size: 0.75rem;
          color: #64748b;
          font-weight: 600;
        }

        .text-unlocked-ready {
          color: #059669;
          font-weight: 800;
        }

        .progress-bar-track {
          width: 100%;
          height: 6px;
          background: #e2e8f0;
          border-radius: 9999px;
          overflow: hidden;
        }

        .progress-bar-fill {
          height: 100%;
          background: linear-gradient(90deg, #f97316 0%, #eab308 100%);
          border-radius: 9999px;
          transition: width 0.25s cubic-bezier(0.16, 1, 0.3, 1), background 0.25s ease;
        }

        .progress-bar-fill.is-full {
          background: linear-gradient(90deg, #10b981 0%, #059669 100%);
        }

        .card-ex-action-row {
          margin-top: 4px;
        }

        .btn-validate-step {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 20px;
          border-radius: 9999px;
          font-size: 0.84rem;
          font-weight: 800;
          border: none;
          cursor: pointer;
          transition: all 0.18s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .btn-validate-step.is-ready {
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          color: #ffffff;
          box-shadow: 0 4px 14px rgba(16, 185, 129, 0.3);
        }

        .btn-validate-step.is-ready:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 18px rgba(16, 185, 129, 0.4);
        }

        .btn-validate-step.is-disabled-lock {
          background: #f1f5f9;
          color: #94a3b8;
          border: 1px solid #cbd5e1;
          cursor: not-allowed;
          box-shadow: none;
          opacity: 0.85;
        }

        /* Corrigé débloqué */
        .solution-unlocked-section {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: cardPop 0.2s ease;
        }

        .student-submitted-box {
          background: #f1f5f9;
          border-radius: 10px;
          padding: 10px 12px;
          border-left: 3px solid #64748b;
        }

        .submitted-tag {
          font-size: 0.6875rem;
          font-weight: 800;
          color: #64748b;
          text-transform: uppercase;
          display: block;
          margin-bottom: 3px;
        }

        .submitted-content {
          font-size: 0.8125rem;
          color: #1e293b;
          margin: 0;
          font-style: italic;
        }

        .card-ex-solution-box {
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          border-radius: 12px;
          padding: 14px;
        }

        .solution-header-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          flex-wrap: wrap;
          gap: 6px;
        }

        .solution-badge-ok {
          font-size: 0.7813rem;
          font-weight: 800;
          color: #15803d;
        }

        .btn-ask-about-this {
          font-size: 0.7188rem;
          font-weight: 700;
          color: #2563eb;
          background: #ffffff;
          border: 1px solid #bfdbfe;
          border-radius: 9999px;
          padding: 4px 10px;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-ask-about-this:hover {
          background: #eff6ff;
          border-color: #2563eb;
        }

        .solution-text {
          font-size: 0.8125rem;
          color: #166534;
          margin: 0;
          white-space: pre-line;
          font-family: inherit;
          line-height: 1.6;
        }

        /* Steppers & Progression 1 par 1 (Exercices & QCM) */
        .single-exercise-container,
        .single-qcm-container {
          display: flex;
          flex-direction: column;
          gap: 12px;
          animation: cardPop 0.2s ease;
        }

        .exercise-stepper-header,
        .qcm-stepper-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 2px 4px 6px;
        }

        .stepper-badge-wrap {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .stepper-indicator-badge {
          font-size: 0.7813rem;
          font-weight: 800;
          color: #1e40af;
          background: #eff6ff;
          border: 1px solid #bfdbfe;
          padding: 4px 12px;
          border-radius: 9999px;
        }

        .stepper-dots {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .step-dot {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          font-size: 0.75rem;
          font-weight: 700;
          border: 1.5px solid #cbd5e1;
          background: #ffffff;
          color: #64748b;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.15s ease;
        }

        .step-dot:hover {
          border-color: #2563eb;
          color: #2563eb;
        }

        .step-dot.is-active {
          border-color: #2563eb;
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
        }

        .step-dot.is-done,
        .step-dot.is-good {
          border-color: #16a34a;
          color: #16a34a;
          background: #f0fdf4;
        }

        .step-dot.is-done.is-active,
        .step-dot.is-good.is-active {
          background: #16a34a;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.35);
        }

        .step-dot.is-wrong {
          border-color: #ef4444;
          color: #ef4444;
          background: #fef2f2;
        }

        .step-dot.is-wrong.is-active {
          background: #ef4444;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
        }

        .step-dot.is-locked {
          opacity: 0.55;
          background: #f1f5f9;
          border-color: #e2e8f0;
          color: #94a3b8;
          cursor: not-allowed;
          font-size: 0.6875rem;
        }

        .step-dot.is-locked:hover {
          border-color: #e2e8f0;
          color: #94a3b8;
        }

        .step-dot.is-answered {
          border-color: #3b82f6;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 800;
        }

        .step-dot.is-answered.is-active {
          border-color: #2563eb;
          background: #2563eb;
          color: #ffffff;
          box-shadow: 0 2px 8px rgba(37, 99, 235, 0.35);
        }

        .qcm-answered-counter-pill {
          font-size: 0.75rem;
          font-weight: 700;
          color: #64748b;
          background: #f1f5f9;
          padding: 3px 10px;
          border-radius: 9999px;
          white-space: nowrap;
        }

        /* Barres de navigation séquentielle (Flèches Suivant / Retour) */
        .exercise-navigation-bar,
        .qcm-navigation-bar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-top: 14px;
          padding-top: 14px;
          border-top: 1px dashed #e2e8f0;
          flex-wrap: wrap;
        }

        .btn-ex-nav-step,
        .btn-qcm-arrow-nav {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 700;
          font-size: 0.8125rem;
          border-radius: 10px;
          padding: 9px 16px;
          cursor: pointer;
          transition: all 0.15s ease;
          border: none;
        }

        .btn-ex-nav-prev,
        .btn-qcm-prev {
          background: #f8fafc;
          border: 1px solid #cbd5e1;
          color: #334155;
        }

        .btn-ex-nav-prev:hover,
        .btn-qcm-prev:hover {
          background: #f1f5f9;
          border-color: #94a3b8;
          color: #0f172a;
        }

        .btn-ex-nav-next,
        .btn-qcm-next {
          background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(37, 99, 235, 0.25);
        }

        .btn-ex-nav-next:hover,
        .btn-qcm-next:hover {
          background: #1e40af;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(37, 99, 235, 0.35);
        }

        .btn-qcm-next.is-subtle {
          background: #eff6ff;
          color: #1d4ed8;
          border: 1px solid #bfdbfe;
          box-shadow: none;
        }

        .btn-qcm-next.is-subtle:hover {
          background: #dbeafe;
          transform: none;
        }

        .btn-qcm-finish {
          background: linear-gradient(135deg, #16a34a 0%, #15803d 100%);
          color: #ffffff;
          box-shadow: 0 3px 10px rgba(22, 163, 74, 0.25);
        }

        .btn-qcm-finish:hover {
          background: #15803d;
          transform: translateY(-1px);
          box-shadow: 0 4px 14px rgba(22, 163, 74, 0.35);
        }

        .all-exercises-finished-pill {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #15803d;
          background: #f0fdf4;
          border: 1px solid #bbf7d0;
          padding: 8px 14px;
          border-radius: 10px;
        }

        .qcm-current-validation-row {
          margin-top: 12px;
          display: flex;
          justify-content: flex-end;
        }

        .hint-recheck {
          margin: 6px 0 0;
          font-size: 0.75rem;
          color: #b91c1c;
        }

        /* Vue Récapitulative finale QCM */
        .qcm-final-summary-view {
          display: flex;
          flex-direction: column;
          gap: 14px;
          animation: cardPop 0.2s ease;
        }

        .qcm-summary-actions-bar {
          display: flex;
          justify-content: flex-end;
        }

        .btn-review-questions {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 8px 14px;
          border-radius: 9999px;
          border: 1px solid #cbd5e1;
          background: #ffffff;
          color: #2563eb;
          font-size: 0.7813rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-review-questions:hover {
          background: #eff6ff;
          border-color: #93c5fd;
        }

        .qcm-recap-cards-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .qcm-recap-mini-card {
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px 14px;
          background: #ffffff;
        }

        .recap-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 6px;
        }

        .recap-badge {
          font-size: 0.6875rem;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 9999px;
        }

        .recap-badge.is-good {
          background: #f0fdf4;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .recap-badge.is-wrong {
          background: #fef2f2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .recap-q-num {
          font-size: 0.7188rem;
          font-weight: 700;
          color: #64748b;
        }

        .recap-question-text {
          font-size: 0.8125rem;
          font-weight: 700;
          color: #0f172a;
          margin: 0 0 8px;
        }

        .recap-explanation {
          font-size: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
          padding: 8px 10px;
          border-left: 3px solid #2563eb;
        }

        .recap-choice-line {
          margin-bottom: 4px;
        }

        .recap-label {
          color: #64748b;
          margin-right: 6px;
          font-weight: 600;
        }

        .recap-val-ok {
          color: #166534;
          font-weight: 700;
        }

        .recap-val-wrong {
          color: #991b1b;
          font-weight: 700;
        }

        .recap-detail {
          margin: 4px 0 0;
          color: #475569;
          font-style: italic;
        }

        .qcm-score-banner {
          background: linear-gradient(135deg, #1e3a8a 0%, #2563eb 100%);
          color: #ffffff;
          border-radius: 16px;
          padding: 16px 20px;
          display: flex;
          align-items: center;
          gap: 16px;
          box-shadow: 0 6px 20px rgba(37, 99, 235, 0.25);
          animation: cardPop 0.2s ease;
        }

        .score-circle {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          background: #ffffff;
          color: #1e3a8a;
          font-size: 1.15rem;
          font-weight: 900;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }

        .score-meta h4 {
          font-size: 0.9375rem;
          font-weight: 800;
          margin: 0 0 4px;
        }

        .score-meta p {
          font-size: 0.7813rem;
          opacity: 0.9;
          margin: 0;
        }

        .qcm-interactive-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 16px;
          background: #fbfcfe;
        }

        .qcm-question-title {
          font-size: 0.9rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0 0 12px;
          line-height: 1.45;
          word-break: break-all;
          overflow-wrap: anywhere;
          width: 100%;
        }

        .qcm-options-stack {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .qcm-option-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 12px;
          border-radius: 10px;
          border: 1.5px solid #e2e8f0;
          background: #ffffff;
          text-align: left;
          cursor: pointer;
          font-size: 0.84rem;
          color: #1e293b;
          transition: all 0.15s ease;
        }

        .qcm-option-btn:hover:not(:disabled) {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .option-letter {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          background: #f1f5f9;
          font-weight: 800;
          font-size: 0.7188rem;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: #475569;
        }

        .qcm-option-btn.is-selected {
          border-color: #2563eb;
          background: #eff6ff;
          color: #1d4ed8;
          font-weight: 600;
        }

        .qcm-option-btn.is-selected .option-letter {
          background: #2563eb;
          color: #ffffff;
        }

        .qcm-option-btn.option-correct {
          background: #f0fdf4;
          border-color: #22c55e;
          color: #15803d;
        }

        .qcm-option-btn.option-correct .option-letter {
          background: #22c55e;
          color: #ffffff;
        }

        .qcm-option-btn.option-wrong {
          background: #fef2f2;
          border-color: #ef4444;
          color: #b91c1c;
        }

        .qcm-option-btn.option-wrong .option-letter {
          background: #ef4444;
          color: #ffffff;
        }

        .qcm-feedback-banner {
          margin-top: 10px;
          border-radius: 10px;
          padding: 8px 12px;
          display: flex;
          align-items: flex-start;
          gap: 8px;
          font-size: 0.7813rem;
        }

        .qcm-feedback-banner.is-success {
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          color: #065f46;
        }

        .qcm-feedback-banner.is-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #991b1b;
        }

        /* Correction */
        .generated-correction-card {
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 18px;
          background: #ffffff;
        }

        .correction-header-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 12px;
          gap: 14px;
          flex-wrap: wrap;
        }

        .correction-title-group {
          display: flex;
          flex-direction: column;
          gap: 2px;
          min-width: 0;
        }

        .correction-sub-tag {
          font-size: 0.6875rem;
          font-weight: 700;
          color: #2563eb;
          text-transform: uppercase;
          letter-spacing: 0.04em;
        }

        .correction-title {
          font-size: 1.0625rem;
          font-weight: 800;
          color: #0f172a;
          margin: 0;
        }

        .grade-badge-card {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .grade-score-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 0.9375rem;
          font-weight: 900;
          color: #ffffff;
          background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          padding: 6px 14px;
          border-radius: 9999px;
          box-shadow: 0 2px 8px rgba(16, 185, 129, 0.28);
          white-space: nowrap;
        }

        .grade-mention-pill {
          display: inline-flex;
          align-items: center;
          font-size: 0.75rem;
          font-weight: 700;
          color: #065f46;
          background: #ecfdf5;
          border: 1px solid #a7f3d0;
          padding: 5px 12px;
          border-radius: 9999px;
          white-space: nowrap;
        }

        .correction-summary {
          font-size: 0.84rem;
          color: #475569;
          line-height: 1.5;
          margin: 0 0 14px;
        }

        .correction-points-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
        }

        .points-box {
          border-radius: 10px;
          padding: 12px;
          font-size: 0.7813rem;
        }

        .strengths-box {
          background: #f0fdf4;
          border: 1px solid #dcfce7;
        }

        .improvements-box {
          background: #eff6ff;
          border: 1px solid #dbeafe;
        }

        .points-title {
          font-size: 0.7813rem;
          font-weight: 800;
          margin: 0 0 6px;
        }

        .strengths-box .points-title { color: #166534; }
        .improvements-box .points-title { color: #1e40af; }

        .points-box ul {
          margin: 0;
          padding-left: 16px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          color: #334155;
        }

        /* Thread de Chat */
        .chat-thread-flow {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 10px;
        }

        .chat-bubble {
          max-width: 85%;
          padding: 10px 14px;
          border-radius: 14px;
          font-size: 0.8125rem;
          line-height: 1.5;
        }

        .bubble-user {
          align-self: flex-end;
          background: #2563eb;
          color: #ffffff;
          border-bottom-right-radius: 4px;
        }

        .bubble-assistant {
          align-self: flex-start;
          background: #f1f5f9;
          color: #0f172a;
          border-bottom-left-radius: 4px;
        }

        .bubble-author {
          display: block;
          font-size: 0.6875rem;
          font-weight: 700;
          margin-bottom: 2px;
          opacity: 0.8;
        }

        /* Vue interactive épurée */

        @media (max-width: 640px) {
          .desktop-only-footer {
            display: none !important;
          }

          /* Mode Statique Mobile (Fit-Screen 100dvh : zéro scroll parasite, zéro espace vide) */
          .exercices-page-root.is-static-view {
            height: 100dvh;
            max-height: 100dvh;
            overflow: hidden;
          }

          .exercices-page-root.is-static-view .page-header-compact {
            padding: 6px 0 2px;
            flex-shrink: 0;
          }

          .header-container-flex {
            padding: 0 10px;
            gap: 8px;
          }

          .header-simple-title {
            font-size: 1.3rem;
            font-weight: 800;
          }

          .btn-header-level-pill {
            padding: 5px 10px;
            font-size: 0.75rem;
            gap: 5px;
          }

          .level-pill-prefix {
            display: none;
          }

          .header-level-popover {
            width: 200px;
            max-width: calc(100vw - 20px);
            right: 0;
            top: calc(100% + 6px);
          }

          /* Vue statique : aucun espace blanc géant, padding exact au-dessus de la MobileBottomNav */
          .exercices-page-root.is-static-view .workspace-container {
            padding: 2px 10px calc(66px + env(safe-area-inset-bottom, 10px));
            overflow: hidden;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          /* Carte d'insertion occupant élégamment la zone utile */
          .exercices-page-root.is-static-view .card-workspace-input {
            flex: 1;
            min-height: 0;
            padding: 12px 10px 10px;
            border-radius: 16px;
            gap: 8px;
            box-shadow: 0 4px 16px -2px rgba(15, 23, 42, 0.05);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
          }

          /* Textarea responsive qui s'adapte sans déborder */
          .exercices-page-root.is-static-view .section-block :global(.ai-textarea-pro) {
            min-height: 85px !important;
            max-height: none !important;
            flex: 1 !important;
          }

          .exercices-page-root.is-static-view .section-block :global(.input-content-panel) {
            min-height: 0 !important;
            height: auto !important;
            flex: 1 !important;
          }

          .exercices-page-root.is-static-view .section-block :global(.text-editor-wrap) {
            min-height: 0 !important;
            height: auto !important;
            flex: 1 !important;
          }

          /* Barre d'action tout en bas de la carte, collée proprement sans vide */
          .chat-action-bar-wrap {
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding-top: 6px;
            flex-shrink: 0;
            margin-top: auto;
          }

          /* Mode Session Active : Défilement vertical naturel réactivé pour le contenu */
          .exercices-page-root.is-session-view {
            height: auto;
            min-height: 100vh;
            overflow-y: auto;
          }

          .exercices-page-root.is-session-view .workspace-container {
            padding: 4px 10px calc(85px + env(safe-area-inset-bottom, 10px));
            overflow-y: visible;
          }
          .action-selector-relative {
            flex: 1;
            min-width: 0;
          }
          .btn-chat-mode-pill {
            width: auto;
            max-width: 100%;
            justify-content: flex-start;
            padding: 6px 11px;
            font-size: 0.7813rem;
            gap: 6px;
          }
          .mode-current-label {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .chat-mode-popover {
            width: 250px;
            max-width: calc(100vw - 32px);
            bottom: calc(100% + 6px);
            border-radius: 12px;
          }
          .popover-items-list {
            padding: 4px;
            gap: 2px;
          }
          .popover-item-btn {
            padding: 6px 8px;
            gap: 8px;
            border-radius: 8px;
          }
          .item-icon-box {
            width: 26px;
            height: 26px;
            border-radius: 6px;
          }
          .item-title {
            font-size: 0.7813rem;
          }
          .item-subtitle {
            display: none;
          }
          .btn-chat-send-submit {
            width: 38px;
            height: 38px;
            flex-shrink: 0;
          }
          .correction-header-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 12px;
          }
          .correction-title-group {
            width: 100%;
          }
          .correction-title {
            font-size: 0.95rem;
            line-height: 1.35;
          }
          .grade-badge-card {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            gap: 6px;
            width: 100%;
          }
          .grade-score-pill {
            font-size: 0.84rem;
            padding: 5px 12px;
            gap: 5px;
          }
          .grade-mention-pill {
            font-size: 0.7188rem;
            padding: 4px 10px;
            white-space: normal;
            word-break: normal;
            line-height: 1.3;
          }
          .correction-points-grid {
            grid-template-columns: 1fr;
          }
          .session-top-bar {
            padding: 10px 12px;
            gap: 8px;
          }
          .session-top-header-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            width: 100%;
          }
          .session-badge {
            font-size: 0.7188rem;
            padding: 4px 8px;
            white-space: nowrap;
          }
          .btn-new-exercise {
            font-size: 0.7188rem;
            padding: 4px 8px;
            gap: 4px;
            white-space: nowrap;
          }
          .session-topic-full-banner {
            padding: 8px 10px;
            gap: 6px;
            width: 100%;
            box-sizing: border-box;
          }
          .session-topic-full-text {
            font-size: 0.75rem;
            line-height: 1.4;
            word-break: break-all;
            overflow-wrap: anywhere;
            white-space: normal;
            width: 100%;
          }
          .exercise-stepper-header,
          .qcm-stepper-header {
            flex-wrap: wrap;
            gap: 8px;
            padding: 0 0 4px;
          }
          .stepper-badge-wrap {
            flex-wrap: wrap;
            gap: 8px;
          }
          .exercise-interactive-card,
          .qcm-interactive-card {
            padding: 14px 12px;
            border-radius: 14px;
            width: 100%;
            box-sizing: border-box;
          }
          .card-head-row {
            margin-bottom: 10px;
            width: 100%;
          }
          .card-title-badge-group {
            width: 100%;
            min-width: 0;
          }
          .card-ex-title {
            font-size: 0.84rem;
            font-weight: 800;
            line-height: 1.45;
            word-break: break-all;
            overflow-wrap: anywhere;
            white-space: normal;
            width: 100%;
            min-width: 0;
          }
          .qcm-question-title {
            font-size: 0.84rem;
            word-break: break-all;
            overflow-wrap: anywhere;
            white-space: normal;
            width: 100%;
            min-width: 0;
          }
          .card-ex-statement {
            font-size: 0.8125rem;
          }
          .btn-validate-step {
            width: 100%;
            justify-content: center;
            font-size: 0.7813rem;
            padding: 10px 14px;
            text-align: center;
          }
          .student-workspace-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .topic-kind-pill {
            align-self: flex-start;
          }
          .word-count-info-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .solution-header-bar {
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .btn-ask-about-this {
            width: 100%;
            text-align: center;
          }
          .exercise-navigation-bar,
          .qcm-navigation-bar {
            flex-direction: column;
            gap: 8px;
          }
          .btn-ex-nav-step,
          .btn-qcm-arrow-nav {
            width: 100%;
            justify-content: center;
            padding: 10px 14px;
          }
          .qcm-score-banner {
            padding: 12px 14px;
            gap: 12px;
            border-radius: 14px;
          }
          .score-circle {
            width: 44px;
            height: 44px;
            font-size: 1rem;
          }
          .interactive-chat-workspace {
            margin-bottom: 12px;
            border-radius: 16px;
            min-height: auto;
            width: 100%;
            box-sizing: border-box;
          }
          .interactive-viewport {
            padding: 12px 10px;
            max-height: none;
            overflow-y: visible;
            gap: 12px;
          }
        }
      `}</style>
    </div>
  );
}
